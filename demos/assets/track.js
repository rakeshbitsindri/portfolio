/* One shared visit log. Every browser reads and writes the same records, so the stats page matches from any place. */
(function () {
  var APP = "vklyh2z7";
  var ROOT = "https://keyvalue.immanuel.co/api/KeyVal";
  var VID = "rk_vid";
  var MAX = 180;
  var vid = localStorage.getItem(VID);
  if (!vid || !/^[a-z0-9]{8}$/.test(vid)) {
    vid = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).replace(/[^a-z0-9]/g, "").slice(0, 8);
    while (vid.length < 8) vid += Math.random().toString(36).slice(2);
    vid = vid.slice(0, 8);
    localStorage.setItem(VID, vid);
  }
  var views = (parseInt(localStorage.getItem("rk_views") || "0", 10) || 0) + 1;
  localStorage.setItem("rk_views", String(views));
  var t0 = Date.now();
  var depth = 0;
  var counted = false;
  var tail = Promise.resolve();

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
  var history = [];
  try { history = JSON.parse(localStorage.getItem("rk_hits") || "[]"); } catch (e) {}
  history.push({ t: new Date().toISOString(), path: path, depth: 0, ms: 0 });
  history = history.slice(-6);
  localStorage.setItem("rk_hits", JSON.stringify(history));
  var record = {
    id: vid,
    t: history[history.length - 1].t,
    first: localStorage.getItem("rk_first") || history[history.length - 1].t,
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
    ms: 0,
    views: views,
    hits: history
  };
  if (!localStorage.getItem("rk_first")) localStorage.setItem("rk_first", record.first);

  function enc(s, max) {
    var out = String(s == null ? "" : s)
      .replace(/[()']/g, "")
      .replace(/_/g, ")")
      .replace(/ /g, "_")
      .replace(/\./g, "!")
      .replace(/\//g, "~")
      .replace(/:/g, "")
      .replace(/[^A-Za-z0-9_!)~-]/g, "");
    return max ? out.slice(0, max) : out;
  }
  function dec(s) {
    return String(s || "").replace(/~/g, "/").replace(/!/g, ".").replace(/_/g, " ").replace(/\)/g, "_");
  }
  function pack(r) {
    var caps = [8, 13, 13, 6, 3, 7, 4, 4, 8, 8, 18, 14, 14, 8, 9, 36, 22, 8, 24];
    var lat = r.lat == null || r.lat === "" ? "" : String(Math.round(Number(r.lat) * 10000));
    var lon = r.lon == null || r.lon === "" ? "" : String(Math.round(Number(r.lon) * 10000));
    var parts = [
      enc(r.id, 8), String(Date.parse(r.t) || Date.now()), String(Date.parse(r.first) || Date.now()),
      String(r.views || 1), String(Math.max(0, Math.min(100, r.depth || 0))), String(Math.max(0, Math.min(9999999, r.ms || 0))),
      String(r.sw || 0), String(r.sh || 0), enc(r.browser, 8), enc(r.os, 8), enc(r.city, 18), enc(r.region, 14),
      enc(r.country, 14), lat, lon, enc(r.path, 36), enc(r.ref, 22), enc(r.lang, 8), enc(r.tz, 24)
    ];
    function build() {
      return parts.map(function (p, i) { return String(p).slice(0, caps[i]); }).join("'");
    }
    var line = build();
    if (line.length > MAX) { caps[15] = 16; caps[16] = 10; caps[18] = 10; line = build(); }
    return line.slice(0, MAX);
  }
  function unpack(line) {
    if (!line || line.indexOf("'") < 0) return null;
    var p = String(line).split("'");
    if (!/^[a-z0-9]{8}$/.test(p[0] || "")) return null;
    function num(v) { var n = parseInt(v, 10); return isNaN(n) ? 0 : n; }
    function coord(v) { if (v == null || v === "") return null; var n = parseInt(v, 10); return isNaN(n) ? null : n / 10000; }
    return {
      id: p[0],
      uid: p[0],
      t: new Date(num(p[1]) || Date.now()).toISOString(),
      first: new Date(num(p[2]) || Date.now()).toISOString(),
      views: Math.max(1, num(p[3])),
      depth: num(p[4]),
      ms: num(p[5]),
      sw: num(p[6]),
      sh: num(p[7]),
      browser: dec(p[8] || ""),
      os: dec(p[9] || ""),
      city: dec(p[10] || ""),
      region: dec(p[11] || ""),
      country: dec(p[12] || ""),
      lat: coord(p[13]),
      lon: coord(p[14]),
      path: dec(p[15] || "/"),
      ref: dec(p[16] || ""),
      lang: dec(p[17] || ""),
      tz: dec(p[18] || ""),
      hits: []
    };
  }
  function packHits(hits) {
    return (hits || []).slice(-4).map(function (h) {
      return [String(Date.parse(h.t) || Date.now()), enc(h.path, 28), String(h.depth || 0), String(h.ms || 0)].join("'");
    }).join("(").slice(0, MAX);
  }
  function unpackHits(line) {
    if (!line) return [];
    return String(line).split("(").map(function (bit) {
      var p = bit.split("'");
      if (!p[0]) return null;
      return { t: new Date(parseInt(p[0], 10) || Date.now()).toISOString(), path: dec(p[1] || ""), depth: parseInt(p[2], 10) || 0, ms: parseInt(p[3], 10) || 0 };
    }).filter(Boolean);
  }
  function get(key) {
    return fetch(ROOT + "/GetValue/" + APP + "/" + key, { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("read");
      return r.json();
    }).then(function (v) { return v == null ? "" : String(v); });
  }
  function put(key, value) {
    value = String(value || "").slice(0, MAX);
    return fetch(ROOT + "/UpdateValue/" + APP + "/" + key + "/" + encodeURIComponent(value), { method: "POST", keepalive: true }).then(function (r) {
      if (!r.ok) throw new Error("write");
      return r.json();
    });
  }
  function chunks() {
    return get("n").then(function (nraw) {
      var n = parseInt(nraw, 10) || 0;
      var jobs = [];
      for (var i = 0; i < n; i++) jobs.push(get("i" + i));
      return Promise.all(jobs).then(function (list) {
        return { n: n, chunks: list.map(function (c) { return String(c || "").replace(/[^a-z0-9]/g, ""); }) };
      });
    });
  }
  function idsOf(chunk) {
    var ids = [];
    for (var i = 0; i + 8 <= chunk.length; i += 8) ids.push(chunk.slice(i, i + 8));
    return ids;
  }
  function ensure(id) {
    var attempt = 0;
    function step() {
      attempt += 1;
      return chunks().then(function (info) {
        var found = false;
        info.chunks.forEach(function (c) { if (idsOf(c).indexOf(id) >= 0) found = true; });
        if (found) return;
        var n = info.n;
        var last = n > 0 ? info.chunks[n - 1] : "";
        var idx = n > 0 ? n - 1 : 0;
        var nn = n > 0 ? n : 1;
        var piece = last + id;
        if (piece.length > MAX) { piece = id; idx = n; nn = n + 1; }
        return put("i" + idx, piece).then(function () { return put("n", String(nn)); }).then(function () {
          return get("i" + idx);
        }).then(function (check) {
          if (idsOf(String(check || "").replace(/[^a-z0-9]/g, "")).indexOf(id) >= 0) return;
          if (attempt < 8) return step();
          throw new Error("index");
        });
      });
    }
    return step();
  }
  function alignAndPut() {
    var job = tail.then(function () {
      return get("v" + record.id).then(function (line) {
        var prev = unpack(line);
        var remoteViews = prev ? prev.views : 0;
        if (!counted) record.views = Math.max(record.views, remoteViews + 1);
        else if (remoteViews > record.views) record.views = remoteViews;
        counted = true;
        localStorage.setItem("rk_views", String(record.views));
      }).catch(function () { counted = true; });
    }).then(function () {
      return put("v" + record.id, pack(record));
    }).then(function () {
      return put("h" + record.id, packHits(record.hits));
    });
    tail = job.catch(function () {});
    return job;
  }
  function readAll() {
    return chunks().then(function (info) {
      var ids = [];
      info.chunks.forEach(function (c) {
        idsOf(c).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
      });
      return Promise.all(ids.map(function (id) {
        return Promise.all([get("v" + id), get("h" + id)]).then(function (pair) {
          var row = unpack(pair[0]);
          if (!row) return null;
          row.hits = unpackHits(pair[1]);
          return row;
        }).catch(function () { return null; });
      })).then(function (rows) { return rows.filter(Boolean); });
    });
  }

  var geoP = new Promise(function (resolve) {
    var done = false;
    function finish() { if (!done) { done = true; resolve(); } }
    setTimeout(finish, 4000);
    var cached = sessionStorage.getItem("rk_geo_v1");
    if (cached) {
      try {
        var g = JSON.parse(cached);
        record.city = g.city || ""; record.region = g.region || ""; record.country = g.country || "";
        record.lat = g.lat; record.lon = g.lon;
      } catch (e) {}
      finish();
      return;
    }
    fetch("https://ipwho.is/").then(function (r) { return r.json(); }).then(function (j) {
      if (!j || j.success === false) return;
      var g = { city: j.city || "", region: j.region || "", country: j.country || "", lat: j.latitude, lon: j.longitude };
      sessionStorage.setItem("rk_geo_v1", JSON.stringify(g));
      record.city = g.city; record.region = g.region; record.country = g.country; record.lat = g.lat; record.lon = g.lon;
    }).catch(function () {}).then(finish, finish);
  });
  var ready = alignAndPut().then(function () { return ensure(record.id); }).catch(function () {});
  var settled = Promise.all([ready, geoP]).then(function () { return alignAndPut(); }).catch(function () {});
  window.RKVisits = { ready: ready, settled: settled, readAll: readAll };

  window.addEventListener("scroll", function () { depth = Math.max(depth, pct()); }, { passive: true });
  function flush() {
    record.depth = Math.max(depth, pct());
    record.ms = Date.now() - t0;
    if (record.hits.length) {
      var last = record.hits[record.hits.length - 1];
      last.depth = record.depth;
      last.ms = record.ms;
      localStorage.setItem("rk_hits", JSON.stringify(record.hits));
    }
    alignAndPut();
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(); });
  window.addEventListener("pagehide", flush);
})();
