// Shared helpers for portfolio demos (plain, dependency-free).
window.Demo = (function () {
  function nav(active) {
    return `
    <nav class="dnav">
      <a class="brand" href="demos/">Rakesh<span>·</span>demos</a>
      <div class="links">
        <a href="demos/">All demos</a>
        <a href="./">Portfolio</a>
        <a href="resume.html">Résumé</a>
        <a href="review.html">Review</a>
      </div>
    </nav>`;
  }
  function mountNav(active) {
    const host = document.getElementById("nav");
    if (host) host.outerHTML = nav(active);
  }
  let toastHost;
  function toast(msg) {
    if (!toastHost) {
      toastHost = document.createElement("div");
      toastHost.className = "toast-host";
      document.body.appendChild(toastHost);
    }
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    toastHost.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }
  function money(n) { return "$" + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function store(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  return { nav, mountNav, toast, money, store, save };
})();
