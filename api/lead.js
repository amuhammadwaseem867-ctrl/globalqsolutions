// Vercel serverless function: POST /api/lead
// Receives call-back requests from the website form and from Q.
// Right now it logs leads to the Vercel function logs. Connect it to the
// client's email, CRM or WhatsApp Business inbox before going live (see README).
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const lead = req.body || {};
  const phone = String(lead.phone || "").replace(/[\s()-]/g, "");
  if (!lead.name || !/^(\+?27|0)[1-8]\d{8}$/.test(phone)) {
    return res.status(400).json({ error: "Name and a valid SA phone number are required" });
  }
  console.log("NEW LEAD", JSON.stringify({
    name: String(lead.name).slice(0, 80),
    phone,
    email: lead.email ? String(lead.email).slice(0, 120) : undefined,
    topic: lead.topic,
    time: lead.time,
    source: lead.source,
    check: lead.check,
    created: lead.created,
  }));
  return res.status(200).json({ ok: true });
}
