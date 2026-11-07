/* 당일 수업 녹화(유튜브) — 공통 재생 도구(player.js)에 유튜브 영상을 연결 (2026-11-06)
   - 빨간 재생바 · 배속(펼쳐 선택) · 10초 이동 · 전체화면/가로 자동 화면 가득 · 두 번 터치 10초 · 5초 뒤 숨김 */
(function () {
  window.mkRecCtl = function (box, f) {
    if (!box || !f || !window.mkPlayer) return;
    var st = { t: 0, d: 0, ps: -1, at: 0, go: false }, fns = [], want = null;
    function cmd(func, args) { try { f.contentWindow.postMessage(JSON.stringify({ event: "command", func: func, args: args || [] }), "*"); } catch (e) { } }
    function hello() { try { f.contentWindow.postMessage(JSON.stringify({ event: "listening", id: "rec" }), "*"); } catch (e) { } }
    function onMsg(e) {
      if (e.source !== f.contentWindow) return;
      if (!document.body.contains(f)) { window.removeEventListener("message", onMsg); return; }
      var d; try { d = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch (er) { return; }
      var i = d && d.info; if (d && d.event === "onStateChange" && typeof i === "number") i = { playerState: i };
      if (!i || typeof i !== "object") return;
      if (i.duration) st.d = i.duration;
      if (i.currentTime != null) { st.t = i.currentTime; st.at = Date.now(); }
      if (i.playerState != null) { st.ps = i.playerState; if (st.ps === 1) st.go = true; if (st.ps === 1 && want != null) { cmd("setPlaybackRate", [want]); } }
      if (i.playbackRate != null && want != null && i.playbackRate !== want && st.ps === 1) cmd("setPlaybackRate", [want]);
      fns.forEach(function (fn) { fn(); });
    }
    window.addEventListener("message", onMsg);
    f.addEventListener("load", function () { hello(); setTimeout(function () { if (want != null) cmd("setPlaybackRate", [want]); }, 800); });
    hello();
    var P = {
      el: f, t: function () { return st.ps === 1 ? st.t + Math.min(1, (Date.now() - st.at) / 1000) * (want || 1) : st.t; }, d: function () { return st.d; },
      playing: function () { return st.ps === 1 || st.ps === 3; },
      seek: function (s) { st.t = s; st.at = Date.now(); cmd("seekTo", [s, true]); cmd("playVideo"); },
      play: function () { st.ps = 1; cmd("playVideo"); }, pause: function () { st.ps = 2; cmd("pauseVideo"); },
      gate: function () { return st.go; }, rate: function (r) { want = r; cmd("setPlaybackRate", [r]); }, on: function (fn) { fns.push(fn); }
    };
    window.mkPlayer(f.parentNode, P, box);
    window.mkRecSeek = function (sec) { P.seek(sec); };
  };
})();
