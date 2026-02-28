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
      name,
      email,
      phone,
      source: "Document Upload CTA",
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
      type: "TYPE_PHONE",
    }),
  });
  if (!res.ok) {
    // Conversation may already exist — try to find it
    const listRes = await fetch(
      `${GHL_BASE}/conversations/search?locationId=${GHL_LOCATION}&contactId=${contactId}`,
      { headers: ghlHeaders() }
    );
    if (listRes.ok) {
      const listData = await listRes.json();
      if (listData.conversations?.length > 0) {
        return listData.conversations[0].id;
      }
    }
    throw new Error("Could not create or find conversation");
  }
  const data = await res.json();
  return data.conversation?.id || data.id;
}

async function sendMessage(conversationId, body) {
  const res = await fetch(`${GHL_BASE}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify({
      type: "Note",
      body,
    }),
  });
  if (!res.ok) {
    console.error("GHL send message failed:", await res.text());
  }
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

    // Build file list string
    const fileNames = files.map((f) => (f instanceof File ? f.name : String(f))).filter(Boolean);
    const fileStr = fileNames.length > 0 ? fileNames.join(", ") : "No files attached";

    const docType = articleType === "ssdi"
      ? "SSDI Denial Letter"
      : "Denial Letter & Insurance Policy";

    const messageBody = `📎 Document Upload — ${docType}

Name: ${name}
Email: ${email}
Phone: ${phone}
Type: ${articleType === "ssdi" ? "SSDI" : "Property Damage"}
Files: ${fileStr}

Submitted via article upload CTA on louislawgroup.com`;

    // GHL workflow
    const contactId = await findOrCreateContact(name, email, phone);
    const conversationId = await createConversation(contactId);
    await sendMessage(conversationId, messageBody);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("upload-documents error:", err);
    return NextResponse.json({ success: false, error: "Server error. Please try again." }, { status: 500 });
  }
}
