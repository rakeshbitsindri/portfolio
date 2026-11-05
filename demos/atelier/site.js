const A = {
  metals: { "Gold-tone": 1, "Silver-tone": 0.72, Kundan: 1.35 },
  sizes: { S: 0, M: 800, L: 1600 },
  products: [
    { id: 1, name: "Temple necklace", cat: "Necklace", metal: "Gold-tone", base: 18600, color: "linear-gradient(135deg,#8a5a2b,#e6c27a)", note: "Hand-set temple motifs on an adjustable dori." },
    { id: 2, name: "Kundan choker", cat: "Necklace", metal: "Kundan", base: 32400, color: "linear-gradient(135deg,#5c3b1e,#f3e2b3)", note: "Polki-style kundan with a pearl drop." },
    { id: 3, name: "Jhumka pair", cat: "Earrings", metal: "Gold-tone", base: 4200, color: "linear-gradient(135deg,#a86b32,#f6e7c1)", note: "Light bell jhumkas for day wear." },
    { id: 4, name: "Silver kadas", cat: "Bangles", metal: "Silver-tone", base: 3100, color: "linear-gradient(135deg,#8d9399,#e8eef2)", note: "A pair of carved openable kadas." },
    { id: 5, name: "Bridal set", cat: "Set", metal: "Kundan", base: 46800, color: "linear-gradient(135deg,#6b3a1f,#f0d48a)", note: "Necklace, earrings, and a maang tikka." },
    { id: 6, name: "Daily hoops", cat: "Earrings", metal: "Silver-tone", base: 1800, color: "linear-gradient(135deg,#9aa3ab,#f4f7f8)", note: "Slim hoops with a matte finish." }
  ],
  key: "atelier_bag_v1",
  bag() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { return []; } },
  save(b) { localStorage.setItem(this.key, JSON.stringify(b)); },
  inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); },
  product(id) { return this.products.find((p) => p.id === +id); },
  price(p, metal, size) { return Math.round(p.base * this.metals[metal] + (this.sizes[size] || 0)); },
  count() { return this.bag().reduce((s, l) => s + l.qty, 0); },
  total() { return this.bag().reduce((s, l) => s + l.price * l.qty, 0); },
  add(item) {
    const b = this.bag();
    const hit = b.find((l) => l.id === item.id && l.metal === item.metal && l.size === item.size);
    if (hit) hit.qty += item.qty; else b.push(item);
    this.save(b);
  },
  chrome(active) {
    const links = [["index.html", "Home", "home"], ["shop.html", "Collection", "shop"], ["about.html", "The house", "about"], ["visit.html", "Visit", "visit"]];
    document.body.insertAdjacentHTML("afterbegin", `<header>
      <a class="logo" href="index.html">Atelier</a>
      <nav>${links.map((l) => `<a class="${active === l[2] ? "on" : ""}" href="${l[0]}">${l[1]}</a>`).join("")}
        <a class="bag" href="bag.html">Bag ${this.count()}</a></nav>
    </header>`);
    document.body.insertAdjacentHTML("beforeend", `<footer><span>Atelier · a portfolio demonstration</span><span><a href="../">All demos</a> · <a href="../../">Portfolio</a></span></footer>`);
  }
};
