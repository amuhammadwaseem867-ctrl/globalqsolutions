# Global Q Solutions: website redesign and AI assistant proposal

Prepared for Global Q Solutions, Wynberg, Cape Town

---

## 1. The short version

Global Q Solutions helps people at one of the most stressful points in their lives. Most of them search for help late at night, on a phone, feeling embarrassed. Right now, the website doesn't build trust and doesn't capture those people when they're ready to act.

This proposal includes:

1. **A modern, mobile-first website** that looks credible, explains debt review in plain language and leads every visitor to one action: *book a free call-back*.
2. **Q, a 24/7 website assistant** that answers questions, runs a private 2-minute debt check and books call-backs. It turns late-night visitors into qualified leads that are waiting for the team at 08:30.
3. **A savings calculator** that shows visitors what they could save each month. Interactive tools like this keep people on the page and give them a reason to ask for help.

---

## 2. What we found on the current site

| # | Issue | Why it matters |
|---|-------|----------------|
| 1 | **Template placeholder content is still live.** The site still shows "Please install Mailchimp plugin form wordpress plugin directory", and blog links like `/how-to-work-with-a-virtual-assistant-3/` and `/online-business-goals-3/` | Visitors immediately see the site as unfinished, which damages trust for a financial service |
| 2 | **Images load from someone else's server** (`demo.gutenify.com`), including the social-share image | If that demo site goes down or changes, Global Q's images break. Shared links show a generic stock image |
| 3 | **Two different addresses** ("124 Wynberg Centre" in the header, "123 Wynberg Main Road" in the footer) | Confuses visitors and hurts Google local search (Maps listings rely on consistent addresses) |
| 4 | **No NCR registration number shown** | Debt counsellors must be NCR-registered. Showing the NCRDC number is the #1 trust signal in this industry |
| 5 | **"99.99% success rate" claim** | Hard to substantiate and a compliance risk. Regulators and customers are wary of guaranteed-sounding claims |
| 6 | **"5 easy steps" are promised but never shown** | The main headline makes a promise the page doesn't keep |
| 7 | **Social icons link nowhere / generic** | Broken links look careless |
| 8 | **Typos and grammar** ("We helps you", "customer focused provide a best solution", unclosed quotation marks around "Financial Freedom Solutions") | Credibility matters for a financial service |
| 9 | **No way to get help after hours.** The only options are a phone line (08:30–17:00) and a basic form | Debt stress peaks at night and on weekends. Those visitors leave and often don't come back |
| 10 | **No structured data / weak SEO basics** | The site is harder to find for searches like "debt review Cape Town" |

---

## 3. What the new site delivers

**Design and trust**
- Clean, modern navy and red brand system drawn from the existing logo
- Clear trust bar: NCR registration, National Credit Act process, confidentiality, one monthly payment
- The "5 steps to debt-free" promise is now explained step by step
- Plain-language FAQ answering the questions people are afraid to ask (Will I lose my car? What does it cost? Can I get credit?)
- One consistent address, opening hours and phone number everywhere, plus Google structured data for local search

**Conversion**
- Every section leads to one goal: a free call-back
- Interactive savings calculator with a personalised result
- Call-back form with South African phone validation and POPIA consent
- Floating call (or WhatsApp) button, always one tap away on mobile

**Q, the AI assistant**
- Instant answers 24/7 about debt review, consolidation, removal, fees, credit scores and more
- **Guided 2-minute debt check** (income, expenses, debt, arrears). Gives the visitor a clear result and recommends the right service
- **Books call-backs in chat.** Name, number and best time are captured and sent to the team together with the debt-check results, so counsellors start every call already informed
- **Two modes:**
  - *Offline mode*: works on any host with no running costs, using a curated knowledge base
  - *AI mode*: when connected to Claude (Anthropic), Q understands free-form questions, replies in Afrikaans, isiXhosa or isiZulu if the visitor does, and still follows strict rules (no financial advice, no promises, never asks for ID or bank details)
- **Leads dashboard** (`leads.html` in the demo) showing every captured lead with an "over-indebted" flag and CSV export

**Performance and accessibility**
- No WordPress page builder or heavy plugins. Pure HTML/CSS/JS that loads in a fraction of a second
- Keyboard accessible, screen-reader labels, reduced-motion support, works from 320px phones to wide desktops

---

## 4. How to demo it in the meeting (5 minutes)

1. Open the site on your **phone** first. Most of their clients will see it that way.
2. Scroll the hero and point out the trust bar and the 5 steps.
3. Move the **savings calculator** sliders and show the result changing.
4. Tap the red chat button, then **"Run my debt check"**. Answer: R22 000 / R9 000 / R14 000 / "Yes, I'm behind". Show the result card.
5. Tap **"Book a call-back"** and complete it.
6. Open **`/leads.html`** and show the lead that just arrived, with the debt-check figures attached.
7. Ask Q something free-form like "Will they take my car?" or "What does it cost?"

---

## 5. Before going live: details to confirm with the client

- [ ] NCR registration number (NCRDC…). Placeholders are highlighted in yellow on the site
- [ ] Correct street address (123 or 124?) and opening days
- [ ] Mobile/WhatsApp Business number, if they want the WhatsApp button
- [ ] Where leads should go: email inbox, CRM (e.g. HubSpot, Zoho) or WhatsApp
- [ ] Real social media links
- [ ] Their fee structure wording, and any real client testimonials (with permission) to add
- [ ] Review of the FAQ and assistant wording by their compliance person

---

## 6. Suggested packages

Fill in your pricing:

| | **Starter** | **Growth** (recommended) | **Premium** |
|---|---|---|---|
| New website (this design) | ✓ | ✓ | ✓ |
| Savings calculator | ✓ | ✓ | ✓ |
| Q assistant, offline mode (no running costs) | ✓ | ✓ | ✓ |
| Q assistant, AI mode (Claude) | – | ✓ | ✓ |
| Leads emailed to the team | ✓ | ✓ | ✓ |
| CRM or WhatsApp Business integration | – | ✓ | ✓ |
| WhatsApp chatbot (same Q brain on WhatsApp) | – | – | ✓ |
| Monthly report (visitors, chats, leads) | – | ✓ | ✓ |
| Once-off fee | R ____ | R ____ | R ____ |
| Monthly fee (hosting, AI usage, support) | R ____ | R ____ | R ____ |

AI running costs are usage-based and small for a site of this size. Budget a few hundred rand a month and confirm it against real traffic after the first month.
