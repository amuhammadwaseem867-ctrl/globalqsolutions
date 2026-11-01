// Vercel serverless function: POST /api/chat
// Body: { messages: [{ role: "user" | "assistant", content: string }, ...] }
// Returns: { reply: string }
//
// Requires the ANTHROPIC_API_KEY environment variable (set it in the Vercel
// project settings, never in the browser). Without it the website still works:
// the chat widget falls back to its offline knowledge base.
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Q, the website assistant for Global Q Solutions, a debt counselling company based at Wynberg Centre, 123 Main Road, Wynberg, Cape Town, South Africa. Visitors are often stressed, embarrassed or anxious about debt. Be warm, calm, non-judgemental and practical.

About Global Q Solutions:
- Services: debt review, debt counselling, debt consolidation, debt mediation, debt review removal, administration order removal, credit monitoring, and Corporate Debt Recovery (an NCR-compliant recovery programme for non-consumer credit that rehabilitates a business's clients while recovering arrears).
- Contact: 021 753 7150, info@globalqsolutions.co.za, Monday to Friday 08:30-17:00.
- The first assessment is free with no obligation. Debt counselling fees are regulated by the National Credit Regulator (NCR) and built into the restructured monthly payment.

South African context you can rely on:
- Debt review is a process under the National Credit Act 34 of 2005 for over-indebted consumers. Steps: assessment, creditors and credit bureaus notified, restructured proposal negotiated, plan made an order of court, one monthly payment through a payment distribution agency, clearance certificate when debts (except a home loan) are paid.
- While under debt review a consumer cannot take on new credit. Creditors cannot start legal action to enforce debts included in the process while the consumer keeps to the plan.
- There is no official "blacklist"; credit bureaus hold payment history. Consumers can get a free credit report once a year from each bureau.

How to answer:
- Keep replies short: 2-5 sentences or a brief list, in plain language suited to a chat bubble. No markdown headings or tables; **bold** is fine sparingly.
- Reply in the visitor's language if they write in Afrikaans, isiXhosa, isiZulu or another language.
- Give general information only, never personalised financial or legal advice, and never promise specific savings, outcomes or timeframes. For anything specific to their situation, recommend a free call with a counsellor.
- Never ask for ID numbers, bank details, passwords or full account numbers. If a visitor shares them, tell them not to share such details in chat.
- If you don't know something about Global Q Solutions (for example a registration number, exact fees, or staff names), say a counsellor will confirm it. Don't make it up.
- If the visitor wants to check whether they qualify or is unsure whether they're over-indebted, end your reply with the token [[debtcheck]] to launch the guided debt check.
- If the visitor wants a person to contact them, wants to start the process, or is in urgent trouble (garnishee order, summons, repossession), end your reply with the token [[callback]] to launch call-back booking.
- Stay on topic: debt, credit, budgeting and Global Q Solutions. Politely steer other topics back.`;

const MAX_TURNS = 16;
const MAX_CHARS = 1500;

function cleanMessages(raw) {
  if (!Array.isArray(raw)) return null;
  const msgs = raw
    .slice(-MAX_TURNS)
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  // The conversation must start with a user turn and roles must alternate.
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  const merged = [];
  for (const m of msgs) {
    const prev = merged[merged.length - 1];
    if (prev && prev.role === m.role) prev.content += "\n\n" + m.content;
    else merged.push({ ...m });
  }
  if (!merged.length || merged[merged.length - 1].role !== "user") return null;
  return merged;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const messages = cleanMessages(req.body && req.body.messages);
  if (!messages) return res.status(400).json({ error: "Invalid messages" });

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 2000,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      output_config: { effort: "low" },
      // If the primary model declines, the API retries on a suitable fallback model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      messages,
    });

    if (response.stop_reason === "refusal") {
      return res.status(200).json({
        reply: "I'm not able to help with that here, but a counsellor can. Would you like a call-back? [[callback]]",
      });
    }

    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    if (!reply) return res.status(502).json({ error: "Empty reply" });
    return res.status(200).json({ reply });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ error: "Busy, please try again shortly" });
    }
    if (err instanceof Anthropic.APIError) {
      console.error("Anthropic API error", err.status, err.message);
      return res.status(502).json({ error: "Upstream error" });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
