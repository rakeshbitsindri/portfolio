/* Records a visit in this browser only. No IP address is stored. */
(function () {
  var KEY = "rk_visits_v1";
  var GEO = "rk_geo_v1";
  var SID = "rk_sid";
  var sid = sessionStorage.getItem(SID);
  if (!sid) {
    sid = Math.random().toString(36).slice(2, 8);
    sessionStorage.setItem(SID, sid);
  }
  var uid = sid + "-" + Date.now().toString(36);
  var t0 = Date.now();
  var depth = 0;
  function pct() {
    var el = document.documentElement;
    var max = el.scrollHeight - el.clientHeight;
    if (max <= 8) return 100;
    return Math.max(0, Math.min(100, Math.round((el.scrollTop / max) * 100)));
  }
  function ua() {
    var u = navigator.userAgent || "";
    var name = "Browser";
    if (/Edg\//.test(u)) name = "Edge";
    else if (/Chrome\//.test(u) && !/Edg\//.test(u)) name = "Chrome";
    else if (/Firefox\//.test(u)) name = "Firefox";
    else if (/Safari\//.test(u)) name = "Safari";
    var os = "Other";
    if (/Windows/.test(u)) os = "Windows";
    else if (/Android/.test(u)) os = "Android";
    else if (/iPhone|iPad/.test(u)) os = "iOS";
    else if (/Mac OS/.test(u)) os = "macOS";
    else if (/Linux/.test(u)) os = "Linux";
    return { name: name, os: os };
  }
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function save(all) {
    localStorage.setItem(KEY, JSON.stringify(all.slice(-400)));
  }
  function patch(extra) {
    var all = load();
    for (var i = all.length - 1; i >= 0; i--) {
      if (all[i].uid === uid) {
        for (var k in extra) all[i][k] = extra[k];
        save(all);
        return;
      }
    }
  }
  var b = ua();
  var path = (location.pathname || "/").replace(/^\/portfolio/, "") || "/";
  var ref = "direct";
  try { if (document.referrer) ref = new URL(document.referrer).host || "direct"; } catch (e) {}
  var row = {
    uid: uid,
    id: sid,
    t: new Date().toISOString(),
    path: path,
    ref: ref,
    lang: navigator.language || "",
    tz: (Intl.DateTimeFormat().resolvedOptions().timeZone) || "",
    sw: screen.width || 0,
    sh: screen.height || 0,
    browser: b.name,
    os: b.os,
    city: "",
    region: "",
    country: "",
    lat: null,
    lon: null,
    depth: 0,
    ms: 0
  };
  var all = load();
  all.push(row);
  save(all);
  window.addEventListener("scroll", function () { depth = Math.max(depth, pct()); }, { passive: true });
  function flush() { patch({ depth: Math.max(depth, pct()), ms: Date.now() - t0 }); }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(); });
  window.addEventListener("pagehide", flush);
  setInterval(flush, 5000);
  function apply(g) { patch({ city: g.city || "", region: g.region || "", country: g.country || "", lat: g.lat, lon: g.lon }); }
  var cached = sessionStorage.getItem(GEO);
  if (cached) { try { apply(JSON.parse(cached)); } catch (e) {} }
  else {
    fetch("https://ipwho.is/").then(function (r) { return r.json(); }).then(function (j) {
      if (!j || j.success === false) return;
      var g = { city: j.city || "", region: j.region || "", country: j.country || "", lat: j.latitude, lon: j.longitude };
      sessionStorage.setItem(GEO, JSON.stringify(g));
      apply(g);
    }).catch(function () {});
  }
})();
