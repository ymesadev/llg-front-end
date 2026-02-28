export const dynamic = "force-dynamic";

const GHL_TOKEN = "pit-636cbf82-bf7c-467a-b41c-4cd11c0db9c9";
const GHL_LOCATION = "OpuRBif1UwDh1UMMiJ7o";
const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

async function ghlRequest(method, path, body = null) {
  const res = await fetch(`${GHL_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${GHL_TOKEN}`,
      "Content-Type": "application/json",
      Version: GHL_VERSION,
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL ${path}: ${res.status} ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function findOrCreateContact(name, email, phone) {
  // Search for existing contact by email
  try {
    const search = await ghlRequest(
      "GET",
      `/contacts/?locationId=${GHL_LOCATION}&email=${encodeURIComponent(email)}&limit=1`
    );
    if (search.contacts && search.contacts.length > 0) {
      return search.contacts[0].id;
    }
  } catch {}

  // Create new contact
  const nameParts = name.trim().split(" ");
  const contact = await ghlRequest("POST", "/contacts/", {
    locationId: GHL_LOCATION,
    firstName: nameParts[0] || name,
    lastName: nameParts.slice(1).join(" ") || "",
    email,
    phone,
    source: "Document Upload CTA",
  });
  return contact.contact?.id || contact.id;
}

async function findOrCreateConversation(contactId) {
  // Search for existing conversation
  try {
    const search = await ghlRequest(
      "GET",
      `/conversations/?locationId=${GHL_LOCATION}&contactId=${contactId}&limit=1`
    );
    if (search.conversations && search.conversations.length > 0) {
      return search.conversations[0].id;
    }
  } catch {}

  // Create new conversation
  const conv = await ghlRequest("POST", "/conversations/", {
    locationId: GHL_LOCATION,
    contactId,
  });
  return conv.conversation?.id || conv.id;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const phone = formData.get("phone") || "";
    const articleType = formData.get("articleType") || "property-damage";
    const files = formData.getAll("files");

    if (!name || !email || !phone) {
      return Response.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    // 1. Find or create GHL contact
    const contactId = await findOrCreateContact(name, email, phone);

    // 2. Find or create conversation
    const conversationId = await findOrCreateConversation(contactId);

    // 3. Build file list for the message
    const fileNames = files
      .filter((f) => f && f.name)
      .map((f) => `• ${f.name} (${(f.size / 1024).toFixed(1)} KB)`)
      .join("\n");

    const docType =
      articleType === "ssdi"
        ? "SSDI Denial Letter"
        : "Denial Letter & Insurance Policy";

    const messageBody = `📋 Document Upload Request\n\nContact: ${name}\nEmail: ${email}\nPhone: ${phone}\nType: ${docType}\n\nFiles uploaded:\n${fileNames || "No files attached"}\n\n⚡ Please follow up with this client promptly.`;

    // 4. Send message to GHL conversation
    await ghlRequest("POST", `/conversations/${conversationId}/messages`, {
      type: "Note",
      body: messageBody,
    });

    return Response.json({ success: true, conversationId });
  } catch (err) {
    console.error("Upload documents error:", err);
    return Response.json(
      { success: false, error: "Failed to submit. Please call us directly." },
      { status: 500 }
    );
  }
}
