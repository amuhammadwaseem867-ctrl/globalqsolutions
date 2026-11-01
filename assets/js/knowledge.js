/* Q's offline knowledge base. Works with no backend at all.
   Each entry: keywords (phrases score higher), answer, optional follow-up chips. */
window.GQ_KB = [
  {
    id: "debt-review",
    keywords: ["debt review", "what is debt review", "how does debt review work", "section 86", "under debt review", "debt counselling process"],
    answer: "Debt review is a legal process under the National Credit Act for people who are over-indebted. Here's how it works:\n\n1. We assess your income, expenses and debts.\n2. We notify your creditors and the credit bureaus.\n3. We negotiate lower instalments and interest.\n4. A court order makes the plan legally binding.\n5. You make one monthly payment until you're debt-free and get a clearance certificate.",
    chips: ["Do I qualify?", "What does it cost?", "Can I keep my car?"]
  },
  {
    id: "counselling",
    keywords: ["debt counselling", "debt counseling", "counsellor", "counselor", "budget help", "budget"],
    answer: "Debt counselling starts with an honest look at your budget. A counsellor goes through your income and essential expenses, then reworks your repayments into something you can afford. You also learn habits that keep you out of debt for good.",
    chips: ["Do I qualify?", "Book a call-back"]
  },
  {
    id: "consolidation",
    keywords: ["consolidation", "consolidate", "one payment", "single payment", "combine debts", "combine"],
    answer: "Debt consolidation combines your accounts into one manageable monthly payment. That usually means better affordability, less interest, and no more juggling many debit orders. A counsellor can tell you whether consolidation or full debt review suits you better.",
    chips: ["Run my debt check", "Book a call-back"]
  },
  {
    id: "mediation",
    keywords: ["mediation", "mediate", "negotiate", "negotiation", "settlement", "settle"],
    answer: "With debt mediation, we negotiate with your creditors on your behalf to reach an arrangement you can manage. It can work well if you have only a few creditors and don't need the full debt review process.",
    chips: ["Run my debt check", "Book a call-back"]
  },
  {
    id: "removal",
    keywords: ["debt review removal", "remove debt review", "exit debt review", "get out of debt review", "leave debt review", "clearance certificate", "17.w", "flag removed", "removal"],
    answer: "There are two main ways out of debt review:\n\n• Clearance certificate: when all debts in the plan are paid (except a home loan), your counsellor issues a clearance certificate and the flag is removed from your credit record.\n• Debt review removal: in certain situations, for example if you're no longer over-indebted, removal may be possible earlier.\n\nWe can check which route applies to you.",
    chips: ["Book a call-back", "How long does it take?"]
  },
  {
    id: "admin",
    keywords: ["administration", "admin order", "administration order", "magistrate", "rescind", "rescission", "section 74"],
    answer: "An administration order is issued by a Magistrate's Court, and it sets the amounts you must pay towards your debts. Once the requirements are met, we help you have the order rescinded and your credit record updated.",
    chips: ["Book a call-back"]
  },
  {
    id: "credit-score",
    keywords: ["credit score", "improve score", "boost score", "credit report", "credit rating", "creditworthy", "creditworthiness", "credit monitoring"],
    answer: "To improve your credit score:\n\n• Pay every account on time, every month. Payment history matters most.\n• Keep credit card and overdraft balances well below their limits.\n• Don't apply for lots of credit at once.\n• Check your credit report for free once a year and dispute any errors.\n• Keep older accounts in good standing open.\n\nThere's no quick fix, but steady habits work. We also offer credit monitoring.",
    chips: ["Tell me about credit monitoring", "Book a call-back"]
  },
  {
    id: "blacklist",
    keywords: ["blacklisted", "blacklist", "black listed", "judgement", "judgment", "listed"],
    answer: "There isn't really an official \"blacklist\" in South Africa. Credit bureaus keep a record of your payment history, including defaults and judgements, and lenders use it to make decisions. The good news is that it can be fixed. Debt counselling and good payment habits rebuild your record over time.",
    chips: ["How can I improve my credit score?", "Book a call-back"]
  },
  {
    id: "cost",
    keywords: ["cost", "fee", "fees", "price", "how much", "charge", "pay you", "expensive", "free"],
    answer: "Your first assessment with us is free and there's no obligation. Debt counselling fees are regulated by the National Credit Regulator and are built into your restructured monthly payment, so you don't pay a large amount upfront. Your counsellor explains every cost before you sign anything.",
    chips: ["Do I qualify?", "Book a call-back"]
  },
  {
    id: "car-house",
    keywords: ["car", "vehicle", "house", "home", "bond", "repossess", "repossession", "lose my", "keep my", "attach", "sheriff", "garnishee", "emolument"],
    answer: "Once you've applied for debt review and your creditors have been notified, they can't start legal action to enforce debts included in the process, as long as you keep to your plan. Your home loan and vehicle finance can be included in the restructuring. If you're already facing legal action or a garnishee order, talk to a counsellor urgently so we can check your options.",
    chips: ["Book a call-back", "Run my debt check"]
  },
  {
    id: "new-credit",
    keywords: ["new credit", "new loan", "take a loan", "apply for credit", "credit card while", "buy a house", "get finance"],
    answer: "While you're under debt review you can't take on new credit. This protects you from going deeper into debt while your plan runs. Once you have your clearance certificate, you can apply for credit again.",
    chips: ["How do I get out of debt review?", "Book a call-back"]
  },
  {
    id: "duration",
    keywords: ["how long", "duration", "years", "months", "time does it take", "timeframe"],
    answer: "It depends on how much you owe and what you can afford. Many debt review plans run for about 3 to 5 years. Some are shorter, and home loans can run longer. Your counsellor will show you a realistic timeline in your assessment.",
    chips: ["Run my debt check", "Book a call-back"]
  },
  {
    id: "qualify",
    keywords: ["qualify", "eligible", "eligibility", "can i apply", "do i qualify", "over-indebted", "over indebted", "overindebted"],
    answer: "You may qualify for debt review if you earn an income and can't keep up with your monthly debt repayments. I can run a quick, private 2-minute check right now. It takes four questions and doesn't need your ID number.",
    chips: ["Run my debt check", "Book a call-back"]
  },
  {
    id: "business",
    keywords: ["business", "company", "corporate", "recovery", "arrears", "debtors", "non-consumer", "cdr"],
    answer: "Our Corporate Debt Recovery (CDR) programme is an NCR-compliant solution for non-consumer credit. We rehabilitate your clients so you keep the relationship, while recovering arrears in full. Would you like a call from our business team?",
    chips: ["Book a call-back", "Contact details"]
  },
  {
    id: "contact",
    keywords: ["contact", "phone", "call you", "number", "email", "address", "where are you", "location", "office", "visit", "hours", "open", "wynberg"],
    answer: "You can reach us here:\n\nPhone: 021 753 7150\nEmail: info@globalqsolutions.co.za\nOffice: Wynberg Centre, 123 Main Road, Wynberg, Cape Town\nHours: Monday to Friday, 08:30–17:00\n\nOr I can book a call-back for you right now.",
    chips: ["Book a call-back"]
  },
  {
    id: "legit",
    keywords: ["registered", "ncr", "legit", "legitimate", "scam", "trust", "regulated", "national credit regulator"],
    answer: "Global Q Solutions works under the National Credit Act, which the National Credit Regulator (NCR) oversees. We'll always give you our registration details and explain each step in writing. A legitimate debt counsellor will never ask you to pay a large upfront fee before your plan is in place.",
    chips: ["What does it cost?", "Book a call-back"]
  },
  {
    id: "thanks",
    keywords: ["thank", "thanks", "appreciate", "great", "awesome", "cool", "ok thanks"],
    answer: "You're welcome! Asking for help is the hardest step, and you've already taken it. Is there anything else I can help with?",
    chips: ["Run my debt check", "Book a call-back"]
  },
  {
    id: "hello",
    keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "molo", "sawubona", "hallo", "goeie"],
    answer: "Hello, I'm Q. I can explain how debt review works, run a quick debt check, or book a call-back with a counsellor. What would you like to do?",
    chips: ["Run my debt check", "What is debt review?", "Book a call-back"]
  },
  {
    id: "human",
    keywords: ["human", "person", "agent", "speak to someone", "talk to someone", "real person", "consultant"],
    answer: "Of course. A counsellor can call you, usually within one working day. Shall I book that for you? It takes about 20 seconds.",
    chips: ["Book a call-back", "Contact details"]
  }
];
