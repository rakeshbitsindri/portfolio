/* Sends each page view to the shared visit log. No IP address is stored. */
(function () {
  var API = "https://crudcrud.com/api/cc582e3d13ca4c75aca609dbe9da43cb/visits";
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
  var remoteId = null;
  var sending = null;
  var dirty = false;
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
    else if (/Chrome\//.test(u)) name = "Chrome";
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
  var b = ua();
  var path = (location.pathname || "/").replace(/^\/portfolio/, "") || "/";
  var ref = "direct";
  try { if (document.referrer) ref = new URL(document.referrer).host || "direct"; } catch (e) {}
  var record = {
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
  function payload() {
    return {
      uid: record.uid, id: record.id, t: record.t, path: record.path, ref: record.ref,
      lang: record.lang, tz: record.tz, sw: record.sw, sh: record.sh,
      browser: record.browser, os: record.os, city: record.city, region: record.region,
      country: record.country, lat: record.lat, lon: record.lon, depth: record.depth, ms: record.ms
    };
  }
  function write() {
    var body = JSON.stringify(payload());
    if (!remoteId) {
      if (sending) { dirty = true; return sending; }
      sending = fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: body })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          remoteId = j && j._id;
          sending = null;
          if (dirty) { dirty = false; write(); }
        })
        .catch(function () { sending = null; });
      return sending;
    }
    return fetch(API + "/" + remoteId, { method: "PUT", headers: { "Content-Type": "application/json" }, body: body }).catch(function () {});
  }
  write();
  window.addEventListener("scroll", function () { depth = Math.max(depth, pct()); }, { passive: true });
  function flush() {
    record.depth = Math.max(depth, pct());
    record.ms = Date.now() - t0;
    write();
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(); });
  window.addEventListener("pagehide", flush);
  setInterval(flush, 8000);
  function apply(g) {
    record.city = g.city || "";
    record.region = g.region || "";
    record.country = g.country || "";
    record.lat = g.lat;
    record.lon = g.lon;
    write();
  }
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
