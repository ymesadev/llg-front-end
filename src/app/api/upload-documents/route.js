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
  const searchRes = await fetch(
    `${GHL_BASE}/contacts/?locationId=${GHL_LOCATION}&query=${encodeURIComponent(email)}`,
    { headers: ghlHeaders() }
  );
  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.contacts?.length > 0) return searchData.contacts[0].id;
  }
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
  if (!createRes.ok) throw new Error(`GHL create contact failed: ${await createRes.text()}`);
  const data = await createRes.json();
  return data.contact?.id;
}

async function getOrCreateConversation(contactId) {
  const createRes = await fetch(`${GHL_BASE}/conversations/`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify({ locationId: GHL_LOCATION, contactId }),
  });
  const data = await createRes.json();
  if (data.conversation?.id) return data.conversation.id;
  if (data.conversationId) return data.conversationId;
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

async function uploadFileToGHL(file, conversationId, contactId) {
  const form = new FormData();
  form.append("conversationId", conversationId);
  form.append("contactId", contactId);
  form.append("file", file, file.name);
  const res = await fetch(`${GHL_BASE}/conversations/messages/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GHL_TOKEN}`,
      Version: GHL_VERSION,
    },
    body: form,
  });
  if (!res.ok) {
    console.error("GHL file upload failed:", await res.text());
    return null;
  }
  const data = await res.json();
  const urls = Object.values(data.uploadedFiles || {});
  return urls[0] || null;
}

async function sendInboundMessage(conversationId, contactId, body) {
  const res = await fetch(`${GHL_BASE}/conversations/messages`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify({
      type: "SMS",
      direction: "inbound",
      conversationId,
      contactId,
      message: body,
    }),
  });
  if (!res.ok) console.error("GHL inbound message failed:", await res.text());
  return res.ok;
}

async function addContactNote(contactId, body) {
  const res = await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify({ body }),
  });
  if (!res.ok) console.error("GHL note failed:", await res.text());
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const articleType = formData.get("articleType") || "property-damage";
    const files = formData.getAll("files").filter((f) => f instanceof File && f.size > 0);

    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const docType = articleType === "ssdi" ? "SSDI Denial Letter" : "Denial Letter & Insurance Policy";

    const contactId = await findOrCreateContact(name, email, phone);
    if (!contactId) throw new Error("Could not create or find GHL contact");

    const conversationId = await getOrCreateConversation(contactId);
    if (!conversationId) throw new Error("Could not create GHL conversation");

    // Upload files to GHL and collect URLs
    const uploadedUrls = [];
    for (const file of files) {
      const url = await uploadFileToGHL(file, conversationId, contactId);
      if (url) uploadedUrls.push({ name: file.name, url });
    }

    // Build message body
    const fileStr = uploadedUrls.length > 0
      ? uploadedUrls.map((f) => `${f.name}: ${f.url}`).join("\n")
      : files.length > 0
        ? files.map((f) => f.name).join(", ") + " (upload failed)"
        : "No files attached";

    const msgBody = `Document Upload — ${docType}

Name: ${name}
Email: ${email}
Phone: ${phone}
Type: ${articleType === "ssdi" ? "SSDI" : "Property Damage"}
Files:
${fileStr}

Submitted via article upload CTA on louislawgroup.com`;

    // Send inbound message (shows in GHL conversations inbox)
    await sendInboundMessage(conversationId, contactId, msgBody);

    // Also add contact note for documentation
    await addContactNote(contactId, msgBody);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("upload-documents error:", err);
    return NextResponse.json({ success: false, error: "Server error. Please try again." }, { status: 500 });
  }
}
