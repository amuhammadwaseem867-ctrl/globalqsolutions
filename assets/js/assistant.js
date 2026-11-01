/* Q — Global Q Solutions website assistant
   - Guided flows (debt check, call-back booking) always run in the browser.
   - Free-text questions go to the AI endpoint (/api/chat) when it's deployed,
     and fall back to the offline knowledge base (knowledge.js) when it isn't. */
(function () {
  "use strict";

  const CONFIG = {
    aiEndpoint: "/api/chat",
    // International format, digits only, e.g. "27821234567". Leave empty to hide WhatsApp.
    whatsapp: "",
    phoneDisplay: "021 753 7150",
    phoneHref: "tel:+27217537150",
  };

  const $ = (s) => document.querySelector(s);
  const chat = $("#chat");
  const log = $("#chat-log");
  const chipsEl = $("#chat-chips");
  const form = $("#chat-form");
  const input = $("#chat-text");
  const fab = $("#chat-fab");
  const badge = $("#chat-badge");
  const modeLabel = $("#chat-mode");
  const rand = window.GQ_formatRand || ((n) => "R" + Math.round(n));

  let started = false;
  let busy = false;
  let aiAvailable = null; // null = unknown, true/false after first attempt
  let flow = null; // { name, step, data }
  let lastCheck = null; // results of the debt check, attached to leads
  const history = []; // AI conversation [{role, content}]

  /* ---------- WhatsApp ---------- */
  if (CONFIG.whatsapp) {
    const wa = $("#wa-fab");
    wa.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent("Hi Global Q Solutions, I'd like help with my debt.");
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.classList.add("is-wa");
    wa.setAttribute("aria-label", "Chat on WhatsApp");
    wa.innerHTML = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 .9c.3.1.5.2.5.3.1.2.1.7-.1 1.2z"/></svg>';
  }

  /* ---------- UI helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function linkify(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/(021 753 7150)/g, `<a href="${CONFIG.phoneHref}">$1</a>`)
      .replace(/(info@globalqsolutions\.co\.za)/g, '<a href="mailto:$1">$1</a>');
  }
  function scroll() { log.scrollTop = log.scrollHeight; }
  function addMsg(text, who = "bot") {
    const el = document.createElement("div");
    el.className = "msg msg--" + who;
    el.innerHTML = who === "me" ? esc(text) : linkify(text);
    log.appendChild(el);
    scroll();
    return el;
  }
  function addCard(title, rows, note) {
    const el = document.createElement("div");
    el.className = "msg msg--bot msg--card";
    el.innerHTML = `<h4>${esc(title)}</h4>` +
      rows.map(([k, v]) => `<div class="row"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("") +
      (note ? `<p style="margin:8px 0 0;font-size:.82rem;color:var(--muted)">${esc(note)}</p>` : "");
    log.appendChild(el);
    scroll();
  }
  function setChips(list) {
    chipsEl.innerHTML = "";
    (list || []).forEach((label) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", () => handle(label));
      chipsEl.appendChild(b);
    });
  }
  function typing() {
    const el = document.createElement("div");
    el.className = "msg msg--bot typing";
    el.setAttribute("aria-label", "Q is typing");
    el.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(el);
    scroll();
    return el;
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function say(text, chips, delay) {
    const t = typing();
    await wait(delay != null ? delay : Math.min(1100, 350 + text.length * 6));
    t.remove();
    addMsg(text);
    setChips(chips);
  }

  /* ---------- Open / close ---------- */
  function open(start) {
    chat.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    badge.hidden = true;
    fab.classList.add("no-ping");
    if (!started) {
      started = true;
      greet(start);
    } else if (start === "debtcheck") startDebtCheck();
    else if (start === "callback") startCallback();
    setTimeout(() => input.focus({ preventScroll: true }), 50);
  }
  function close() {
    chat.hidden = true;
    fab.setAttribute("aria-expanded", "false");
    fab.focus({ preventScroll: true });
  }
  fab.addEventListener("click", () => (chat.hidden ? open() : close()));
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open-chat]");
    if (opener) { e.preventDefault(); open(opener.dataset.openChat); }
    const asker = e.target.closest("[data-ask]");
    if (asker) {
      e.preventDefault();
      const q = asker.dataset.ask;
      if (!started) { started = true; chat.hidden = false; fab.setAttribute("aria-expanded", "true"); badge.hidden = true; fab.classList.add("no-ping"); }
      else open();
      handle(q);
    }
    if (e.target.closest("[data-close-chat]")) close();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !chat.hidden) close(); });

  async function greet(start) {
    const h = new Date().getHours();
    const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    await say(`${part}! I'm Q, the Global Q Solutions assistant. 👋\n\nI can answer questions about debt review, run a private 2-minute debt check, or book a call-back with a counsellor.`, [], 500);
    if (start === "debtcheck") return startDebtCheck();
    if (start === "callback") return startCallback();
    setChips(["Run my debt check", "What is debt review?", "What does it cost?", "Book a call-back"]);
  }

  /* ---------- Input routing ---------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || busy) return;
    input.value = "";
    handle(text);
  });

  async function handle(text) {
    if (busy) return;
    busy = true;
    addMsg(text, "me");
    setChips([]);
    try {
      const t = text.toLowerCase();
      if (flow && /^(cancel|stop|never ?mind|exit)\b/.test(t)) {
        flow = null;
        await say("No problem, I've cancelled that. What else can I help with?", ["Run my debt check", "Book a call-back"]);
      } else if (flow) {
        await flowStep(text);
      } else if (/debt check|do i qualify|check for me|run my/.test(t)) {
        await startDebtCheck();
      } else if (/call.?back|call me|book/.test(t)) {
        await startCallback();
      } else if (/^contact details$/.test(t)) {
        await say(localAnswer("contact").answer, ["Book a call-back"]);
      } else {
        await answer(text);
      }
    } finally {
      busy = false;
    }
  }

  /* ---------- Free-text answers ---------- */
  function score(text, entry) {
    const t = " " + text.toLowerCase().replace(/[^a-z0-9.\s-]/g, " ").replace(/\s+/g, " ") + " ";
    let s = 0;
    entry.keywords.forEach((k) => {
      if (t.includes(" " + k + " ") || (k.includes(" ") && t.includes(k))) s += k.split(" ").length + 1;
    });
    return s;
  }
  function localAnswer(idOrText) {
    const kb = window.GQ_KB || [];
    const byId = kb.find((e) => e.id === idOrText);
    if (byId) return byId;
    let best = null, bestScore = 0;
    kb.forEach((e) => { const s = score(idOrText, e); if (s > bestScore) { best = e; bestScore = s; } });
    return bestScore >= 2 ? best : null;
  }

  async function answer(text) {
    history.push({ role: "user", content: text });
    if (aiAvailable !== false) {
      const t = typing();
      try {
        const res = await fetch(CONFIG.aiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-16) }),
        });
        if (!res.ok) throw new Error("status " + res.status);
        const data = await res.json();
        if (!data.reply) throw new Error("empty");
        t.remove();
        if (aiAvailable !== true) { aiAvailable = true; modeLabel.textContent = "Online · AI-powered"; }
        let reply = data.reply;
        const wantsCallback = reply.includes("[[callback]]");
        const wantsCheck = reply.includes("[[debtcheck]]");
        reply = reply.replace(/\[\[(callback|debtcheck)\]\]/g, "").trim();
        history.push({ role: "assistant", content: reply });
        addMsg(reply);
        if (wantsCheck) return startDebtCheck();
        if (wantsCallback) return startCallback();
        setChips(["Run my debt check", "Book a call-back"]);
        return;
      } catch (_) {
        t.remove();
        if (aiAvailable === null) aiAvailable = false; // static hosting — use offline mode from now on
      }
    }
    const hit = localAnswer(text);
    const reply = hit
      ? hit.answer
      : "That's a good question. I'd rather a counsellor gives you an accurate answer than I guess. I can book a quick call-back, or you can call us on 021 753 7150 (Mon–Fri, 08:30–17:00).";
    history.push({ role: "assistant", content: reply });
    await say(reply, hit ? hit.chips : ["Book a call-back", "Run my debt check", "What is debt review?"]);
  }

  /* ---------- Guided flows ---------- */
  function parseAmount(s) {
    let t = String(s).toLowerCase().replace(/zar|rand|r|\s|,/g, "");
    let mult = 1;
    if (/k$/.test(t)) { mult = 1000; t = t.replace(/k$/, ""); }
    const n = parseFloat(t);
    return isFinite(n) && n >= 0 ? n * mult : NaN;
  }

  async function startDebtCheck() {
    flow = { name: "check", step: 0, data: {} };
    await say("Let's do your private debt check. It's 4 quick questions, and I won't ask for your ID or bank details.\n\n**1 of 4:** What's your monthly take-home pay after tax? (e.g. 18 000)", ["R10 000", "R20 000", "R35 000"]);
  }
  async function startCallback() {
    flow = { name: "callback", step: 0, data: {} };
    await say("I'll book a free call-back with a counsellor. What's your first name?", []);
  }

  async function flowStep(text) {
    const f = flow;
    if (f.name === "check") {
      if (f.step < 3) {
        const n = parseAmount(text);
        if (isNaN(n) || (n <= 0 && f.step !== 1)) return say("Sorry, I didn't catch that amount. Please type a number, like 15000.", f.step === 0 ? ["R10 000", "R20 000", "R35 000"] : []);
        if (f.step === 0) {
          f.data.income = n; f.step = 1;
          return say("**2 of 4:** Roughly how much do your essential living costs come to each month? Include rent, food, transport, school fees and utilities, but not debt repayments.", [rand(n * 0.4), rand(n * 0.5), rand(n * 0.6)]);
        }
        if (f.step === 1) {
          f.data.expenses = n; f.step = 2;
          return say("**3 of 4:** What's the total of all your monthly debt repayments? Include loans, credit cards, store accounts, car finance and home loan.", []);
        }
        if (f.step === 2) {
          f.data.debt = n; f.step = 3;
          return say("**4 of 4:** Are you behind on any payments, or have you received letters of demand or calls from collectors?", ["Yes, I'm behind", "Not yet, but it's tight", "No, I'm up to date"]);
        }
      }
      if (f.step === 3) {
        f.data.behind = /yes|behind|letter|demand|collector/i.test(text) ? "yes" : /tight|not yet/i.test(text) ? "tight" : "no";
        flow = null;
        return debtResult(f.data);
      }
    }

    if (f.name === "callback") {
      if (f.step === 0) {
        const name = text.replace(/[^\p{L}\s'-]/gu, "").trim();
        if (name.length < 2) return say("Please type your first name so the counsellor knows who to ask for.", []);
        f.data.name = name.charAt(0).toUpperCase() + name.slice(1);
        f.step = 1;
        return say(`Thanks, ${f.data.name}. What number should we call? We'll only use it for this call-back.`, []);
      }
      if (f.step === 1) {
        if (!window.GQ_validPhone || !window.GQ_validPhone(text)) return say("That doesn't look like a South African number. Please try again, for example 082 123 4567.", []);
        f.data.phone = text.trim();
        f.step = 2;
        return say("When's the best time for us to call? (Mon–Fri, 08:30–17:00)", ["Morning", "Afternoon", "Any time"]);
      }
      if (f.step === 2) {
        f.data.time = text.trim();
        flow = null;
        const lead = window.GQ_saveLead ? window.GQ_saveLead(Object.assign({ source: "Q chat assistant" }, f.data, lastCheck ? { check: lastCheck } : {}, { transcript: history.slice(-10) })) : null;
        const ref = lead ? lead.id.toUpperCase().slice(-6) : "";
        addCard("Call-back booked ✓", [["Name", f.data.name], ["Number", f.data.phone], ["Preferred time", f.data.time]].concat(ref ? [["Reference", ref]] : []));
        return say(`You're all set, ${f.data.name}. A counsellor will call you within one working day. Everything you share stays confidential.\n\nCan I help with anything else in the meantime?`, ["What is debt review?", "What does it cost?", "How can I improve my credit score?"]);
      }
    }
  }

  async function debtResult(d) {
    const available = d.income - d.expenses;
    const ratio = d.income > 0 ? d.debt / d.income : 1;
    const est = d.debt * 0.64; // assumes a typical mix of secured/unsecured debt
    lastCheck = { income: d.income, expenses: d.expenses, debt: d.debt, behind: d.behind };

    const t = typing();
    await wait(900);
    t.remove();
    addCard("Your debt check", [
      ["Take-home pay", rand(d.income)],
      ["Living costs", rand(d.expenses)],
      ["Debt repayments", rand(d.debt)],
      ["Left over (or short)", (available - d.debt < 0 ? "−" : "") + rand(Math.abs(available - d.debt))],
      ["Debt-to-income", Math.round(ratio * 100) + "%"],
      ["Possible new repayment", "≈ " + rand(est)],
    ], "Rough estimate only. A counsellor will confirm your real figures.");

    let msg;
    if (available <= 0 || d.debt > available || d.behind === "yes") {
      msg = "Based on your answers, you're likely **over-indebted**, and **debt review** was designed for exactly this situation. It could lower your instalments, stop legal action and leave you with money for essentials each month.\n\nI'd recommend a free call with a counsellor to confirm. Shall I book it?";
    } else if (d.debt > available * 0.8 || d.behind === "tight" || ratio > 0.4) {
      msg = "You're managing, but it's tight. A small surprise expense could tip things over. **Debt consolidation** or **debt counselling** could give you breathing room before it becomes a crisis.\n\nWould you like a counsellor to look at your options?";
    } else {
      msg = "Good news. Your repayments look manageable right now. 👏 You might still save by consolidating high-interest accounts, and **credit monitoring** helps you stay on track.\n\nWant tips on boosting your credit score?";
    }
    history.push({ role: "assistant", content: "[Debt check completed] " + msg });
    await say(msg, ["Book a call-back", "What is debt review?", "How can I improve my credit score?"]);
  }

  /* ---------- Gentle nudge after 20s ---------- */
  setTimeout(() => { if (!started) fab.classList.remove("no-ping"); }, 20000);
})();
