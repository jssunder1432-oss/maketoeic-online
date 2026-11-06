/* 당일 수업 녹화(유튜브) — 배속 · 구간 골라 보기 (2026-11-06)
   - 배속: 0.75~2배 (이 기기에 기억, 해설강의 배속과 같은 값 mkst:speed 공유)
   - 구간: 관리자가 넣은 '구간'(한 줄에 "12:30 파트5") 버튼 → 누르면 그 시점으로 이동, 지금 보는 구간 표시
           구간을 안 넣었으면 10분 단위 자동 구간
   - ⏪10초 / 10초⏩
   - 내가 구간 정하기: 시작·끝을 '지금 위치'로 찍거나 시간 입력 → 그 구간만 재생(반복 가능), 내 구간으로 저장(이 기기) */
(function () {
  var SP = [0.75, 1, 1.25, 1.5, 1.75, 2];
  function cur() { try { var v = +localStorage.getItem("mkst:speed"); return SP.indexOf(v) >= 0 ? v : 1; } catch (e) { return 1; } }
  function save(v) { try { localStorage.setItem("mkst:speed", String(v)); } catch (e) { } }
  function sec(s) { var p = String(s).split(":").map(Number); if (p.some(isNaN)) return null; return p.reduce(function (a, b) { return a * 60 + b; }, 0); }
  function fmt(t) { t = Math.max(0, Math.floor(t)); var h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60; return (h ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s; }
  function parse(txt) {
    var out = [];
    String(txt || "").split(/\r?\n/).forEach(function (l) {
      var m = l.trim().match(/^(\d{1,2}(?::\d{1,2}){1,2})\s*[-–~.)]?\s*(.*)$/); if (!m) return;
      var t = sec(m[1]); if (t != null) out.push({ t: t, n: m[2] || fmt(t) });
    });
    return out.sort(function (a, b) { return a.t - b.t; });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var CSS = ".rc-box{background:#fff;border:2px solid #172844;border-radius:16px;padding:12px;margin:0 0 10px}.rc-h{font-weight:800;color:#172844;font-size:15px;margin:2px 2px 8px}.rc-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.rc-b{border:2px solid #172844;background:#fff;color:#172844;border-radius:10px;padding:8px 11px;font:inherit;font-size:15px;font-weight:800;cursor:pointer}.rc-b.on{background:#172844;color:#fff}.rc-ch{display:grid;gap:6px}.rc-c{display:flex;gap:10px;align-items:center;text-align:left;border:1.5px solid #D5DBE5;background:#fff;border-radius:12px;padding:10px 12px;font:inherit;font-size:15px;color:#172844;cursor:pointer}.rc-c b{min-width:58px;color:#E95721;font-variant-numeric:tabular-nums}.rc-c.on{border-color:#E95721;background:#FFF3EB;font-weight:800}.rc-in{width:64px;border:2px solid #172844;border-radius:10px;padding:8px;font:inherit;font-size:15px;font-weight:800;text-align:center;color:#172844}.rc-now{font-size:13px;color:#33404F;margin:-2px 2px 8px;font-variant-numeric:tabular-nums}";
  function css() { if (document.getElementById("rc-css")) return; var s = document.createElement("style"); s.id = "rc-css"; s.textContent = CSS; document.head.appendChild(s); }
  window.mkRecCtl = function (box, f, chapters, vid) {
    if (!box || !f) return; css();
    var CH = parse(chapters), dur = 0, now = 0, rate = cur(), A = null, B = null, rep = false, on = false, MK = "mkst:recseg:" + (vid || "x");
    function mine() { try { return JSON.parse(localStorage.getItem(MK) || "[]"); } catch (e) { return []; } }
    function keep(L) { try { localStorage.setItem(MK, JSON.stringify(L)); } catch (e) { } }
    function playAB() { if (A == null) return; if (B != null && B <= A) B = null; on = true; now = A; cmd("seekTo", [A, true]); cmd("playVideo"); draw(); }
    function cmd(func, args) { try { f.contentWindow.postMessage(JSON.stringify({ event: "command", func: func, args: args || [] }), "*"); } catch (e) { } }
    function list() {
      if (CH.length) return CH;
      if (!dur) return [];
      var L = []; for (var t = 0; t < dur; t += 600) L.push({ t: t, n: fmt(t) + " ~ " + fmt(Math.min(dur, t + 600)) }); return L;
    }
    function draw() {
      var L = list(), act = -1;
      L.forEach(function (c, i) { if (now >= c.t - 0.5) act = i; });
      box.innerHTML = '<div class="rc-box"><div class="rc-h">⏩ 배속</div><div class="rc-row">' +
        SP.map(function (r) { return '<button class="rc-b' + (r === rate ? " on" : "") + '" data-r="' + r + '">' + r + "배</button>"; }).join("") +
        '</div><div class="rc-row"><button class="rc-b" data-j="-10">⏪ 10초</button><button class="rc-b" data-j="10">10초 ⏩</button></div>' +
        '<div class="rc-h">✂️ 내가 구간 정하기</div><div class="rc-row" style="align-items:center"><button class="rc-b" data-a>시작=지금</button><input class="rc-in" id="rc-a" inputmode="numeric" placeholder="0:00" value="' + (A != null ? fmt(A) : "") + '"><span style="font-weight:800;color:#172844">~</span><input class="rc-in" id="rc-bb" inputmode="numeric" placeholder="끝" value="' + (B != null ? fmt(B) : "") + '"><button class="rc-b" data-b>끝=지금</button></div>' +
        '<div class="rc-row"><button class="rc-b' + (on ? " on" : "") + '" data-ab>▶ 이 구간만 보기</button><button class="rc-b' + (rep ? " on" : "") + '" data-rep>🔁 반복 ' + (rep ? "켜짐" : "꺼짐") + '</button>' + (on ? '<button class="rc-b" data-off>구간 해제</button>' : "") + '</div><div class="rc-row"><input class="rc-in" id="rc-n" style="flex:1;width:auto;text-align:left" placeholder="구간 이름 (예: 관계대명사)"><button class="rc-b" data-sv>⭐ 내 구간 저장</button></div>' +
        (mine().length ? '<div class="rc-h">⭐ 내 구간</div><div class="rc-ch" style="margin-bottom:10px">' + mine().map(function (m, i) { return '<div style="display:flex;gap:6px"><button class="rc-c" style="flex:1" data-my="' + i + '"><b>' + fmt(m.a) + (m.b != null ? "~" + fmt(m.b) : "") + "</b><span>" + esc(m.n || "내 구간") + '</span></button><button class="rc-b" data-mx="' + i + '" title="지우기">✕</button></div>'; }).join("") + "</div>" : "") +
        '<div class="rc-h">📍 구간 골라 보기' + (CH.length ? "" : ' <small style="font-weight:600;color:#33404F">(10분 단위)</small>') + "</div>" +
        '<div class="rc-now" id="rc-t">' + (dur || now ? "지금 " + fmt(now) + (dur ? " / " + fmt(dur) : "") : "") + "</div>" +
        (L.length ? '<div class="rc-ch">' + L.map(function (c, i) { return '<button class="rc-c' + (i === act ? " on" : "") + '" data-t="' + c.t + '"><b>' + fmt(c.t) + "</b><span>" + esc(c.n) + "</span></button>"; }).join("") + "</div>" : '<div class="rc-now">영상을 재생하면 구간이 나와요.</div>') + "</div>";
      box.querySelectorAll("[data-r]").forEach(function (b) { b.onclick = function () { rate = +b.dataset.r; save(rate); cmd("setPlaybackRate", [rate]); draw(); }; });
      box.querySelectorAll("[data-j]").forEach(function (b) { b.onclick = function () { now = Math.max(0, now + +b.dataset.j); cmd("seekTo", [now, true]); cmd("playVideo"); draw(); }; });
      function rd() { var a = sec((box.querySelector("#rc-a") || {}).value || ""), b = sec((box.querySelector("#rc-bb") || {}).value || ""); if (a != null && (box.querySelector("#rc-a").value || "").trim()) A = a; if ((box.querySelector("#rc-bb").value || "").trim()) B = b; else B = null; }
      ["#rc-a", "#rc-bb"].forEach(function (q) { var el = box.querySelector(q); if (el) el.onchange = function () { rd(); }; });
      var q1 = box.querySelector("[data-a]"); if (q1) q1.onclick = function () { A = Math.floor(now); if (B != null && B <= A) B = null; draw(); };
      var q2 = box.querySelector("[data-b]"); if (q2) q2.onclick = function () { rd(); B = Math.floor(now); if (A == null) A = 0; if (B <= A) { var t = A; A = B; B = t; } draw(); };
      var q3 = box.querySelector("[data-ab]"); if (q3) q3.onclick = function () { rd(); if (A == null) A = 0; playAB(); };
      var q4 = box.querySelector("[data-rep]"); if (q4) q4.onclick = function () { rep = !rep; draw(); };
      var q5 = box.querySelector("[data-off]"); if (q5) q5.onclick = function () { on = false; draw(); };
      var q6 = box.querySelector("[data-sv]"); if (q6) q6.onclick = function () { rd(); if (A == null) { alert0(); return; } var n = (box.querySelector("#rc-n") || {}).value || ""; var L = mine(); L.push({ a: A, b: B, n: (n || "").trim() }); L.sort(function (x, y) { return x.a - y.a; }); keep(L); draw(); };
      box.querySelectorAll("[data-my]").forEach(function (b) { b.onclick = function () { var m = mine()[+b.dataset.my]; if (!m) return; A = m.a; B = m.b; playAB(); }; });
      box.querySelectorAll("[data-mx]").forEach(function (b) { b.onclick = function () { var L = mine(); L.splice(+b.dataset.mx, 1); keep(L); draw(); }; });
      function alert0() { var h = box.querySelector(".rc-h"); if (h) h.textContent = "✂️ 내가 구간 정하기 — 시작 시간을 먼저 정해 주세요"; }
      box.querySelectorAll("[data-t]").forEach(function (b) { b.onclick = function () { now = +b.dataset.t; cmd("seekTo", [now, true]); cmd("playVideo"); draw(); }; });
    }
    var last = "";
    function onMsg(e) {
      if (e.source !== f.contentWindow) return;
      if (!document.body.contains(f)) { window.removeEventListener("message", onMsg); return; }
      var d; try { d = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch (er) { return; }
      var i = d && d.info; if (!i || typeof i !== "object") return;
      if (i.duration) dur = i.duration;
      if (i.currentTime != null) now = i.currentTime;
      if (i.playerState === 1 && i.playbackRate != null && i.playbackRate !== rate) cmd("setPlaybackRate", [rate]);
      if (on && B != null && now >= B) { if (rep) { now = A; cmd("seekTo", [A, true]); } else { on = false; cmd("pauseVideo"); last = ""; } }
      var L = list(), act = -1; L.forEach(function (c, k) { if (now >= c.t - 0.5) act = k; });
      var tt = box.querySelector("#rc-t"); if (tt) tt.textContent = "지금 " + fmt(now) + (dur ? " / " + fmt(dur) : "");
      var key = Math.floor(dur) + "|" + act + "|" + on;
      var ae = document.activeElement, typing = ae && ae.classList && ae.classList.contains("rc-in") && box.contains(ae);
      if (key !== last && !typing) { last = key; draw(); }
    }
    window.addEventListener("message", onMsg);
    function hello() { try { f.contentWindow.postMessage(JSON.stringify({ event: "listening", id: "rec" }), "*"); } catch (e) { } }
    f.addEventListener("load", function () { hello(); setTimeout(function () { cmd("setPlaybackRate", [rate]); }, 800); });
    hello(); draw();
  };
})();
