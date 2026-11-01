/* Global Q Solutions — site interactions */
(function () {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const rand = (n) => "R" + Math.round(n).toLocaleString("en-ZA").replace(/,/g, " ");
  window.GQ_formatRand = rand;

  // Year
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  // Sticky header shadow
  const header = $(".header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav
  const toggle = $(".nav__toggle");
  const menu = $("#nav-menu");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
  });
  $$("a", menu).forEach((a) =>
    a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
    })
  );

  // Reveal on scroll
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -60px 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  // Service filter tabs
  const tabs = $$(".tabs [role=tab]");
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      const f = tab.dataset.filter;
      $$(".card[data-cat]").forEach((c) => c.classList.toggle("is-hidden", f !== "all" && c.dataset.cat !== f));
    })
  );

  // Savings calculator (illustrative only)
  const ids = ["income", "expenses", "debt", "secured"];
  const inputs = Object.fromEntries(ids.map((k) => [k, $("#c-" + k)]));
  function calc() {
    const income = +inputs.income.value;
    const expenses = +inputs.expenses.value;
    const debt = +inputs.debt.value;
    const secured = +inputs.secured.value / 100;
    $("#o-income").textContent = rand(income);
    $("#o-expenses").textContent = rand(expenses);
    $("#o-debt").textContent = rand(debt);
    $("#o-secured").textContent = Math.round(secured * 100) + "%";

    // Unsecured debt typically restructures more than secured debt.
    const est = debt * (secured * 0.85 + (1 - secured) * 0.55);
    const save = debt - est;
    $("#r-new").textContent = rand(est);
    $("#r-save").textContent = "+" + rand(save);

    const available = income - expenses;
    const status = $("#r-status");
    status.className = "calc__status";
    if (available <= 0) {
      status.textContent = "Your essential expenses use up your whole income. Please speak to a counsellor. There are options.";
      status.classList.add("warn");
    } else if (debt > available) {
      status.textContent = `Your repayments are ${rand(debt - available)} more than you have available. That's a sign of over-indebtedness, and debt review was designed for it.`;
      status.classList.add("warn");
    } else if (debt > available * 0.8) {
      status.textContent = "You're cutting it very close each month. A restructured plan could give you breathing room.";
    } else {
      status.textContent = "Your repayments look manageable. Consolidation or a budget review could still save you money.";
      status.classList.add("ok");
    }
  }
  ids.forEach((k) => inputs[k] && inputs[k].addEventListener("input", calc));
  if (inputs.income) calc();

  // Lead storage (demo: localStorage; production: POST to CRM/email — see README)
  window.GQ_saveLead = function (lead) {
    const record = Object.assign({ id: Date.now().toString(36), created: new Date().toISOString() }, lead);
    try {
      const list = JSON.parse(localStorage.getItem("gqs_leads") || "[]");
      list.unshift(record);
      localStorage.setItem("gqs_leads", JSON.stringify(list.slice(0, 200)));
    } catch (_) { /* storage unavailable */ }
    // Fire-and-forget to the optional backend; ignored on static hosting.
    fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record) }).catch(() => {});
    return record;
  };
  window.GQ_validPhone = (v) => /^(\+?27|0)[1-8]\d{8}$/.test(String(v).replace(/[\s()-]/g, ""));

  // Call-back form
  const form = $("#callback-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = $(".form__msg", form);
    const data = Object.fromEntries(new FormData(form));
    $$("input", form).forEach((i) => i.classList.remove("is-invalid"));
    msg.className = "form__msg";

    const errors = [];
    if (!data.name || data.name.trim().length < 2) { errors.push("your name"); form.name.classList.add("is-invalid"); }
    if (!window.GQ_validPhone(data.phone || "")) { errors.push("a valid South African phone number"); form.phone.classList.add("is-invalid"); }
    if (!data.consent) errors.push("your consent to be contacted");
    if (errors.length) {
      msg.textContent = "Please add " + errors.join(", ") + ".";
      msg.classList.add("err");
      return;
    }
    window.GQ_saveLead({ source: "website form", name: data.name.trim(), phone: data.phone, email: data.email, topic: data.topic, time: data.time });
    form.reset();
    msg.textContent = `Thank you, ${data.name.split(" ")[0]}. A counsellor will call you within one working day.`;
    msg.classList.add("ok");
  });
})();
