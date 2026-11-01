# Global Q Solutions: website redesign + Q assistant

A redesigned, mobile-first website for [globalqsolutions.co.za](https://globalqsolutions.co.za) (debt counselling, Cape Town), with **Q**, a built-in chat assistant that answers questions, runs a 2-minute debt check and books call-backs.

See **[PITCH.md](PITCH.md)** for the audit of the current site, the proposal and a demo script.

## What's in here

| Path | What it is |
|------|------------|
| `index.html` | The full one-page site: hero, 5 steps, services, savings calculator, Q showcase, about, guides, FAQ, contact |
| `assets/css/styles.css` | Design system and all styles (responsive, accessible, reduced-motion aware) |
| `assets/js/main.js` | Navigation, scroll reveals, service filter, savings calculator, call-back form, lead storage |
| `assets/js/knowledge.js` | Q's offline knowledge base (edit answers here) |
| `assets/js/assistant.js` | The Q chat widget: guided debt check, call-back booking, AI/offline routing |
| `api/chat.js` | Optional serverless AI endpoint (Claude via the Anthropic SDK) |
| `api/lead.js` | Serverless endpoint that receives call-back leads (currently logs them; connect to email/CRM) |
| `leads.html` | Demo dashboard showing leads captured on this browser, with CSV export |

## Run it locally

Offline mode (no backend, no API key). Q uses its built-in knowledge base:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Deploy with the AI assistant (Vercel)

1. Import this repository into Vercel. No build step is needed.
2. In **Project → Settings → Environment Variables**, add `ANTHROPIC_API_KEY`.
3. Deploy. The chat header changes to **"Online · AI-powered"** once `/api/chat` responds.

If the API is unavailable for any reason, Q automatically falls back to offline mode, so the chat never breaks.

## Configure before launch

- **WhatsApp button:** set `CONFIG.whatsapp` in `assets/js/assistant.js` (e.g. `"27821234567"`). Until it's set, the button is a phone-call button.
- **NCR number:** search for `todo` in `index.html`. The placeholders are highlighted in yellow.
- **Lead delivery:** in `api/lead.js`, replace the `console.log` with an email (e.g. Resend/SendGrid), a CRM API call, or a WhatsApp Business message.
- **Assistant wording:** offline answers live in `assets/js/knowledge.js`. The AI's rules and facts are in `SYSTEM_PROMPT` in `api/chat.js`.
