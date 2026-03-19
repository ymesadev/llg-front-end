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
      source: "Case Law — Policy Review",
      tags: ["policy-review", "case-law"],
    }),
  });
  const createData = await createRes.json();
  if (!createRes.ok) {
    if (createData?.meta?.contactId) return createData.meta.contactId;
    throw new Error(`GHL create contact failed: ${JSON.stringify(createData)}`);
  }
  return createData.contact?.id;
}

async function getOrCreateEmailConversation(contactId) {
  const res = await fetch(`${GHL_BASE}/conversations/`, {
    method: "POST",
    headers: ghlHeaders(),
    body: JSON.stringify({ locationId: GHL_LOCATION, contactId, type: "TYPE_EMAIL" }),
  });
  const data = await res.json();
  return data.conversation?.id || data.conversationId || null;
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
    const name = formData.get("fullName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const message = formData.get("message") || "";
    const files = formData.getAll("files").filter((f) => f instanceof File && f.size > 0);

    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // 1. Send email to Pierre via relay (primary — reliable)
    const relayUrl = process.env.EMAIL_RELAY_URL || "http://144.217.164.240:9090/send-email";
    const relaySecret = process.env.EMAIL_RELAY_SECRET || "llg-relay-2026";
    const fileNames = files.length > 0 ? files.map(f => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join(", ") : "None";
    try {
      await fetch(relayUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: relaySecret,
          to: "pierre@louislawgroup.com",
          subject: `Policy Review Request — ${name}`,
          body: `Policy Review Request\n\nFull Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nDescription: ${message || "None"}\nDocuments attached: ${fileNames}\n\nSource: Case Law Updates — Policy Review Form`,
        }),
      });
    } catch (relayErr) {
      console.error("[policy-review] Email relay failed:", relayErr.message);
    }

    // 2. Track in GHL (background — don't block response)
    try {
      const contactId = await findOrCreateContact(name, email, phone);
      if (contactId) {
        await addContactNote(contactId, `Policy Review Request\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}\nFiles: ${fileNames}`);
        if (files.length > 0) {
          const conversationId = await getOrCreateEmailConversation(contactId);
          if (conversationId) {
            for (const file of files) {
              await uploadFileToGHL(file, conversationId, contactId);
            }
          }
        }
      }
    } catch (ghlErr) {
      console.error("[policy-review] GHL tracking error:", ghlErr.message);
    }

    return NextResponse.json({ success: true, message: "Your policy review request has been submitted. We will contact you within 24 hours." });
  } catch (err) {
    console.error("[policy-review] error:", err);
    return NextResponse.json({ success: false, error: "Server error. Please try again." }, { status: 500 });
  }
}
