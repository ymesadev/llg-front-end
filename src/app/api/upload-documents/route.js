import { NextResponse } from "next/server";

const GHL_TOKEN = "pit-636cbf82-bf7c-467a-b41c-4cd11c0db9c9";
const GHL_LOCATION = "OpuRBif1UwDh1UMMiJ7o";
const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

function ghlHeaders() {
  return {
    Authorization: `Bearer ${GHL_TOKEN}`,
    "Content-Type": "application/json",
    Version: GHL_VERSION,
  };
}

async function findOrCreateContact(name, email, phone) {
  // Search for existing contact by email
  const searchRes = await fetch(
    `${GHL_BASE}/contacts/?locationId=${GHL_LOCATION}&query=${encodeURIComponent(email)}`,
    { headers: ghlHeaders() }
  );
  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.contacts?.length > 0) {
      return searchData.contacts[0].id;
    }
  }

  // Create new contact
  const createRes = await fetch(`${GHL_BASE}/contacts/`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify({
      locationId: GHL_LOCATION,
      firstName: name.split(" ")[0] || name,
      lastName: name.split(" ").slice(1).join(" ") || "",
      email,
      phone,
      source: "Document Upload CTA",
      tags: ["document-upload"],
    }),
  });
  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`GHL create contact failed: ${err}`);
  }
  const createData = await createRes.json();
  return createData.contact?.id;
}

async function createConversation(contactId) {
  const res = await fetch(`${GHL_BASE}/conversations/`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify({
      locationId: GHL_LOCATION,
      contactId,
    }),
  });
  const data = await res.json();
  // GHL returns 400 when conversation already exists but includes conversationId
  if (data.conversationId) return data.conversationId;
  if (data.conversation?.id) return data.conversation.id;
  if (data.id) return data.id;
  // Fallback: search for existing conversation
  const listRes = await fetch(
    `${GHL_BASE}/conversations/search?locationId=${GHL_LOCATION}&contactId=${contactId}`,
    { headers: ghlHeaders() }
  );
  if (listRes.ok) {
    const listData = await listRes.json();
    if (listData.conversations?.length > 0) return listData.conversations[0].id;
  }
  return null;
}

async function addNote(contactId, body) {
  const res = await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify({ body }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("GHL add note failed:", err);
  }
  return res.ok;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const articleType = formData.get("articleType") || "property-damage";
    const files = formData.getAll("files");

    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const fileNames = files.map((f) => (f instanceof File ? f.name : String(f))).filter(Boolean);
    const fileStr = fileNames.length > 0 ? fileNames.join(", ") : "No files attached";

    const docType = articleType === "ssdi"
      ? "SSDI Denial Letter"
      : "Denial Letter & Insurance Policy";

    const noteBody = `Document Upload — ${docType}

Name: ${name}
Email: ${email}
Phone: ${phone}
Type: ${articleType === "ssdi" ? "SSDI" : "Property Damage"}
Files: ${fileStr}

Submitted via article upload CTA on louislawgroup.com`;

    const contactId = await findOrCreateContact(name, email, phone);
    if (!contactId) throw new Error("Could not create or find GHL contact");

    // Add note to contact (primary — always works)
    await addNote(contactId, noteBody);

    // Create/find conversation (secondary — non-blocking)
    await createConversation(contactId).catch(() => null);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("upload-documents error:", err);
    return NextResponse.json({ success: false, error: "Server error. Please try again." }, { status: 500 });
  }
}
