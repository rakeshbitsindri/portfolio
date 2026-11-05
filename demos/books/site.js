const B = {
  home: "Telangana",
  key: "books_v2",
  parties: [
    { name: "Mehta Traders", gstin: "36AABCM1234A1Z1", state: "Telangana" },
    { name: "Coastal Foods", gstin: "29AABCC5678B1Z2", state: "Karnataka" },
    { name: "Walk-in counter", gstin: "—", state: "Telangana" }
  ],
  state() {
    const seed = {
      seq: 26044,
      invoices: [
        { no: "NT-26041", party: "Mehta Traders", kind: "CGST+SGST", taxable: 38000, tax: 6840, total: 44840, when: "2026-10-28" },
        { no: "NT-26042", party: "Coastal Foods", kind: "IGST", taxable: 22000, tax: 3960, total: 25960, when: "2026-11-02" },
        { no: "NT-26043", party: "Walk-in counter", kind: "CGST+SGST", taxable: 4500, tax: 810, total: 5310, when: "2026-11-04" }
      ]
    };
    try { return JSON.parse(localStorage.getItem(this.key)) || seed; } catch (e) { return seed; }
  },
  save(s) { localStorage.setItem(this.key, JSON.stringify(s)); },
  inr(n) { return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
  chrome(active) {
    const links = [["index.html", "Books", "home"], ["invoice.html", "New invoice", "new"], ["ledger.html", "Ledger", "ledger"], ["parties.html", "Parties", "parties"], ["tax.html", "Tax", "tax"]];
    document.body.insertAdjacentHTML("afterbegin", `<header><a class="logo" href="index.html">Northline Books</a><nav>${links.map((l) => `<a class="${active === l[2] ? "on" : ""}" href="${l[0]}">${l[1]}</a>`).join("")}</nav></header>`);
    document.body.insertAdjacentHTML("beforeend", `<footer><span>Northline Books · GSTIN 36AABCU9603R1ZM · demonstration</span><span><a href="../">All demos</a></span></footer>`);
  }
};
