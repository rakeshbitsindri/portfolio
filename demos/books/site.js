const B = {
  home: "Telangana",
  key: "books_v1",
  parties: [
    { name: "Mehta Traders", gstin: "36AABCM1234A1Z1", state: "Telangana" },
    { name: "Coastal Foods", gstin: "29AABCC5678B1Z2", state: "Karnataka" },
    { name: "Walk-in counter", gstin: "—", state: "Telangana" }
  ],
  state() { try { return JSON.parse(localStorage.getItem(this.key)) || { invoices: [], seq: 26041 }; } catch (e) { return { invoices: [], seq: 26041 }; } },
  save(s) { localStorage.setItem(this.key, JSON.stringify(s)); },
  inr(n) { return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); },
  chrome(active) {
    const links = [["index.html", "Books", "home"], ["invoice.html", "New invoice", "new"], ["ledger.html", "Ledger", "ledger"], ["parties.html", "Parties", "parties"]];
    document.body.insertAdjacentHTML("afterbegin", `<header><a class="logo" href="index.html">Northline Books</a><nav>${links.map((l) => `<a class="${active === l[2] ? "on" : ""}" href="${l[0]}">${l[1]}</a>`).join("")}</nav></header>`);
    document.body.insertAdjacentHTML("beforeend", `<footer><span>Northline Books · GSTIN 36AABCU9603R1ZM · demonstration</span><span><a href="../">All demos</a></span></footer>`);
  }
};
