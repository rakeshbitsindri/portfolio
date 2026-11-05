const C = {
  rooms: ["A1", "A2", "A3", "B1", "B2", "B3"],
  KG: 0.45, PALLET: 1800, HAM: 0.12,
  key: "coldroom_v1",
  logKey: "coldroom_log_v1",
  temps: { A1: -18, A2: -20, A3: -18, B1: -22, B2: -18, B3: -19 },
  log() { try { return JSON.parse(localStorage.getItem(this.logKey)) || []; } catch (e) { return []; } },
  note(line) { const l = this.log(); l.unshift({ t: new Date().toISOString().slice(0, 16).replace("T", " "), line }); localStorage.setItem(this.logKey, JSON.stringify(l.slice(0, 40))); },
  seed() {
    return [
      { id: "L-1001", party: "Mehta Traders", goods: "Frozen peas", kg: 1200, left: 900, pallets: 3, loc: "A1", inn: "2026-10-02", mode: "kg", moved: 300 },
      { id: "L-1002", party: "Coastal Foods", goods: "Shrimp block", kg: 600, left: 600, pallets: 2, loc: "B1", inn: "2026-10-18", mode: "pallet", moved: 0 },
      { id: "L-1003", party: "Mehta Traders", goods: "Mango pulp", kg: 400, left: 400, pallets: 1, loc: "A2", inn: "2026-11-01", mode: "kg", moved: 0 }
    ];
  },
  lots() { try { return JSON.parse(localStorage.getItem(this.key)) || this.seed(); } catch (e) { return this.seed(); } },
  save(l) { localStorage.setItem(this.key, JSON.stringify(l)); },
  inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); },
  days(a, b) { return Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000)); },
  parties() { return [...new Set(this.lots().map((l) => l.party))].sort(); },
  used() { const u = {}; this.lots().forEach((l) => { if (l.left > 0) u[l.loc] = (u[l.loc] || 0) + l.left; }); return u; },
  nextLoc() { const load = {}; this.lots().forEach((l) => { if (l.left > 0) load[l.loc] = (load[l.loc] || 0) + 1; }); return this.rooms.slice().sort((a, b) => (load[a] || 0) - (load[b] || 0))[0]; },
  chrome(active) {
    const links = [["index.html", "Floor", "floor"], ["receive.html", "Inward", "in"], ["stock.html", "Stock", "stock"], ["dispatch.html", "Dispatch", "out"], ["billing.html", "Billing", "bill"], ["aging.html", "Aging", "age"], ["depositors.html", "Parties", "who"]];
    document.body.insertAdjacentHTML("afterbegin", `<header><a href="index.html"><strong>Harbour Cold Stores</strong></a><nav>${links.map((l) => `<a class="${active === l[2] ? "on" : ""}" href="${l[0]}">${l[1]}</a>`).join("")}</nav></header>`);
    document.body.insertAdjacentHTML("beforeend", `<footer><span>Harbour Cold Stores · demonstration</span><span><a href="../">All demos</a></span></footer>`);
  },
  roomsHtml() {
    const u = this.used();
    return `<div class="grid">${this.rooms.map((r) => `<div class="room"><b>${r}</b>${this.temps[r]}°C · ${u[r] ? u[r] + " kg" : "empty"}</div>`).join("")}</div>`;
  }
};
if (!localStorage.getItem(C.key)) C.save(C.seed());
