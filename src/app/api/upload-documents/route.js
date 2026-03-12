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
  const createData = await createRes.json();
  // GHL returns 400 with meta.contactId when duplicate contact protection is on
  if (!createRes.ok) {
    if (createData?.meta?.contactId) return createData.meta.contactId;
    throw new Error(`GHL create contact failed: ${JSON.stringify(createData)}`);
  }
  return createData.contact?.id;
}

async function getOrCreateEmailConversation(contactId) {
  // Create TYPE_EMAIL conversation (GHL returns existing if one exists)
  const res = await fetch(`${GHL_BASE}/conversations/`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify({ locationId: GHL_LOCATION, contactId, type: "TYPE_EMAIL" }),
  });
  const data = await res.json();
  if (data.conversation?.id) return data.conversation.id;
  if (data.conversationId) return data.conversationId;
  return null;
}

async function uploadFileToGHL(file, conversationId, contactId) {
  const form = new FormData();
  form.append("conversationId", conversationId);
  form.append("contactId", contactId);
  form.append("file", file, file.name);
  const res = await fetch(`${GHL_BASE}/conversations/messages/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${GHL_TOKEN}`, Version: GHL_VERSION },
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

async function sendEmailWithAttachments(conversationId, contactId, subject, html, attachments = []) {
  const payload = { type: "Email", conversationId, contactId, subject, html, emailBcc: "pierre@louislawgroup.com" };
  if (attachments.length > 0) payload.attachments = attachments;
  const res = await fetch(`${GHL_BASE}/conversations/messages`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) console.error("GHL email send failed:", await res.text());
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
    const subject = `Document Upload — ${docType} from ${name}`;

    const contactId = await findOrCreateContact(name, email, phone);
    if (!contactId) throw new Error("Could not create or find GHL contact");

    const conversationId = await getOrCreateEmailConversation(contactId);
    if (!conversationId) throw new Error("Could not create GHL email conversation");

    // Upload files to GHL hosted storage
    const attachmentUrls = [];
    for (const file of files) {
      const url = await uploadFileToGHL(file, conversationId, contactId);
      if (url) attachmentUrls.push(url);
    }

    const fileListHtml = files.length > 0
      ? `<ul>${files.map((f) => `<li>${f.name}</li>`).join("")}</ul>`
      : "<p>No files attached</p>";

    const html = `
      <h2>Document Upload — ${docType}</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px;font-weight:bold">Name</td><td style="padding:6px">${name}</td></tr>
        <tr><td style="padding:6px;font-weight:bold">Email</td><td style="padding:6px">${email}</td></tr>
        <tr><td style="padding:6px;font-weight:bold">Phone</td><td style="padding:6px">${phone}</td></tr>
        <tr><td style="padding:6px;font-weight:bold">Type</td><td style="padding:6px">${articleType === "ssdi" ? "SSDI" : "Property Damage"}</td></tr>
        <tr><td style="padding:6px;font-weight:bold">Files</td><td style="padding:6px">${fileListHtml}</td></tr>
      </table>
      <p style="color:#666;font-size:12px">Submitted via article upload CTA on louislawgroup.com</p>
    `;

    await sendEmailWithAttachments(conversationId, contactId, subject, html, attachmentUrls);
    await addContactNote(contactId, `Document Upload — ${docType}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nFiles: ${files.map(f=>f.name).join(", ") || "None"}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("upload-documents error:", err);
    return NextResponse.json({ success: false, error: "Server error. Please try again." }, { status: 500 });
  }
}
