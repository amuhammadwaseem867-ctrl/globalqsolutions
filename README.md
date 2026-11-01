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

## Design system

- **Pattern:** Trust & Authority + Conversion (marketing *Home / landing* route): promise, then proof, offer, objections, convert.
- **Fonts:** Lexend for headings (designed for reading ease) and Source Sans 3 for body text and tabular figures. Weights 400 / 500 / 600 only.
- **Colour has meaning:** ink navy `#0F1E45` for structure, gold `#A16207` for actions, red `#C21F37` only for debt and arrears, green `#0B7556` only for savings and the plan.
- **One orchestrated animation:** the hero statement, where six debit orders are struck off and replaced by one payment. Everything else moves only in response to the visitor. `prefers-reduced-motion` shows the final state instantly.
- **Accessibility:** contrast of at least 4.5:1, visible focus rings, targets of at least 44px, tooltips on icon buttons, form errors shown next to fields on blur, skip link.

Design direction was guided by the UI UX Pro Max catalogs (product, typography, colour and UX guidelines for finance and legal services) and checked with the VectorLab UX audit.

## Libraries (CDN, pinned)

| Library | Use |
|---|---|
| [GSAP 3.15](https://gsap.com) | Hero statement sequence |
| [Lenis 1.3](https://lenis.darkroom.engineering) | Smooth scrolling (off when reduced motion is on) |
| [Lucide 1.66](https://lucide.dev) | Icons |

The page still works if a CDN fails: icons are skipped, the hero shows its final state and scrolling is native.

## Photo credits

Photos are from [Pexels](https://www.pexels.com) under the Pexels License (free for commercial use, no attribution required). They're stored locally as WebP in `assets/img/photos/`.

| File | Pexels photo |
|---|---|
| `budget-calculator` | [7491011](https://www.pexels.com/photo/woman-uses-calculator-7491011/) |
| `home-consultation` | [5699451](https://www.pexels.com/photo/black-patient-and-psychologist-discussing-problem-in-office-5699451/) |
| `family-at-home` | [7114419](https://www.pexels.com/photo/joyful-black-family-sitting-together-on-couch-in-room-7114419/) |
| `callback-phone` | [5319254](https://www.pexels.com/photo/a-man-in-white-crew-neck-t-shirt-talking-on-the-phone-5319254/) |
| `counsellor-desk` | [3894377](https://www.pexels.com/photo/woman-sitting-in-front-of-a-computer-while-talking-on-the-phone-3894377/) |
| `cape-town-aerial` | [4064211](https://www.pexels.com/photo/aerial-shot-of-cape-town-south-africa-4064211/) |

Before launch, consider replacing stock photos with real photos of the Global Q team and office.

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
