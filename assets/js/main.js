/* Global Q Solutions: site interactions
   Libraries (CDN, all optional; the page works without them):
   - Lucide: icons
   - GSAP: the one orchestrated hero sequence
   - Lenis: smooth scrolling */
(function () {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rand = (n) => "R" + Math.round(n).toLocaleString("en-ZA").replace(/[, ]/g, " ");
  window.GQ_formatRand = rand;

  /* Icons */
  if (window.lucide) window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });

  /* Year */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* Smooth scrolling */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new window.Lenis({ autoRaf: true, lerp: 0.11 });
  }
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id.length > 1 ? $(id) : document.body;
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: id === "#top" ? 0 : -88 });
      else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      if (id.length > 1 && target.tabIndex < 0 && !/^(A|BUTTON|INPUT)$/.test(target.tagName)) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    })
  );

  /* Header state */
  const hdr = $(".hdr");
  const onScroll = () => hdr.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const menuBtn = $(".menu-btn");
  const menu = $("#menu");
  const setMenu = (open) => {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.querySelector(".sr").textContent = open ? "Close menu" : "Open menu";
    menu.classList.toggle("is-open", open);
  };
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); } });

  /* Hero: six debit orders become one payment */
  const stmt = $(".stmt");
  if (stmt) {
    const rows = $$(".stmt__row", stmt);
    const plan = $(".stmt__plan", stmt);
    const total = $(".js-total", stmt);
    const FROM = 14200, TO = 8650;

    const finalState = () => {
      rows.forEach((r) => r.classList.add("is-cleared"));
      stmt.classList.add("is-done");
      total.textContent = rand(TO);
      if (window.gsap) window.gsap.set(plan, { autoAlpha: 1, y: 0 });
    };
    const reset = () => {
      rows.forEach((r) => r.classList.remove("is-cleared"));
      stmt.classList.remove("is-done");
      total.textContent = rand(FROM);
      window.gsap.set(plan, { autoAlpha: 0, y: 14 });
    };
    const play = () => {
      const gsap = window.gsap;
      reset();
      const counter = { v: FROM };
      const tl = gsap.timeline({ delay: 0.5, defaults: { ease: "power2.out" } });
      rows.forEach((row, i) => tl.call(() => row.classList.add("is-cleared"), null, i * 0.22));
      tl.to(counter, { v: TO, duration: rows.length * 0.22 + 0.2, ease: "power1.inOut", onUpdate: () => { total.textContent = rand(Math.round(counter.v / 50) * 50); } }, 0);
      tl.to(plan, { autoAlpha: 1, y: 0, duration: 0.5 }, ">-0.1");
      tl.call(() => stmt.classList.add("is-done"), null, "<");
      return tl;
    };

    if (window.gsap && !reduceMotion) play();
    else finalState();

    $(".stmt__replay", stmt).addEventListener("click", () => {
      if (window.gsap && !reduceMotion) play();
      else finalState();
    });
  }

  /* Savings calculator (illustrative) */
  const ids = ["income", "expenses", "debt", "secured"];
  const inputs = Object.fromEntries(ids.map((k) => [k, $("#c-" + k)]));
  const paintRange = (el) => el.style.setProperty("--p", ((el.value - el.min) / (el.max - el.min)) * 100 + "%");
  function calc() {
    const income = +inputs.income.value;
    const expenses = +inputs.expenses.value;
    const debt = +inputs.debt.value;
    const secured = +inputs.secured.value / 100;
    ids.forEach((k) => paintRange(inputs[k]));
    $("#o-income").textContent = rand(income);
    $("#o-expenses").textContent = rand(expenses);
    $("#o-debt").textContent = rand(debt);
    $("#o-secured").textContent = Math.round(secured * 100) + "%";

    // Unsecured debt typically restructures further than secured debt.
    const est = debt * (secured * 0.85 + (1 - secured) * 0.55);
    $("#r-old").textContent = rand(debt);
    $("#r-new").textContent = rand(est);
    $("#r-save").textContent = rand(debt - est);
    $("#b-now").style.setProperty("--s", "1");
    $("#b-new").style.setProperty("--s", (est / debt).toFixed(3));

    const available = income - expenses;
    const status = $("#r-status");
    status.className = "calc__status";
    if (available <= 0) {
      status.textContent = "Your essential costs use up all of your income. Speak to a counsellor. There are still options.";
      status.classList.add("warn");
    } else if (debt > available) {
      status.textContent = `Your repayments are ${rand(debt - available)} more than you have left after living costs. That's what debt review is designed for.`;
      status.classList.add("warn");
    } else if (debt > available * 0.8) {
      status.textContent = "You're getting by, but only just. A restructured plan could give you room to breathe.";
    } else {
      status.textContent = "Your repayments look manageable. Consolidation or a budget review could still lower your costs.";
      status.classList.add("ok");
    }
  }
  if (inputs.income) {
    ids.forEach((k) => inputs[k].addEventListener("input", calc));
    calc();
  }

  /* Leads: stored locally for the demo and posted to /api/lead when deployed */
  window.GQ_saveLead = function (lead) {
    const record = Object.assign({ id: Date.now().toString(36), created: new Date().toISOString() }, lead);
    try {
      const list = JSON.parse(localStorage.getItem("gqs_leads") || "[]");
      list.unshift(record);
      localStorage.setItem("gqs_leads", JSON.stringify(list.slice(0, 200)));
    } catch (_) { /* storage unavailable */ }
    fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record) }).catch(() => {});
    return record;
  };
  window.GQ_validPhone = (v) => /^(\+?27|0)[1-8]\d{8}$/.test(String(v).replace(/[\s()-]/g, ""));

  /* Call-back form: errors appear on blur or submit, next to the field, and clear while correcting */
  const form = $("#callback-form");
  const rules = {
    name: { err: "err-name", check: (v) => v.trim().length >= 2, msg: "Enter your name so we know who to ask for." },
    phone: { err: "err-phone", check: (v) => window.GQ_validPhone(v), msg: "Enter a South African number, like 082 123 4567." },
    consent: { err: "err-consent", check: (_, el) => el.checked, msg: "Tick the box so we're allowed to call you." },
  };
  const validate = (name) => {
    const el = form.elements[name];
    const r = rules[name];
    const ok = r.check(el.value || "", el);
    $("#" + r.err).textContent = ok ? "" : r.msg;
    el.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  };
  const clear = (name) => {
    $("#" + rules[name].err).textContent = "";
    form.elements[name].removeAttribute("aria-invalid");
  };
  Object.keys(rules).forEach((name) => {
    const el = form.elements[name];
    if (name === "consent") {
      el.addEventListener("change", () => validate(name));
    } else {
      el.addEventListener("blur", () => { if (el.value.trim()) validate(name); });
      el.addEventListener("input", () => clear(name));
    }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = $(".form__msg", form);
    msg.className = "form__msg";
    msg.textContent = "";
    const failed = Object.keys(rules).filter((n) => !validate(n));
    if (failed.length) { form.elements[failed[0]].focus(); return; }

    const data = Object.fromEntries(new FormData(form));
    window.GQ_saveLead({ source: "Website form", name: data.name.trim(), phone: data.phone, email: data.email, topic: data.topic, time: data.time });
    form.reset();
    Object.keys(rules).forEach(clear);
    msg.textContent = `Call-back requested. ${data.name.trim().split(" ")[0]}, a counsellor will phone you within one working day.`;
    msg.classList.add("ok");
  });
})();
