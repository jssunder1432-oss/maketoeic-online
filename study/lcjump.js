/* LC 실전 모의고사 해설강의 — 문제마다 '해설' · '반복 청취' 바로 가기 버튼 (2026-11-09, 모든 Season)
   - 위치표 = lcjump-data.js → window.MKST_LCJP["s1r1/P2_007"] = [[초, "📖 해설"], [초, "🔁 반복 청취"], ...]
     (영상 화면의 표시(듣기·해설·정답 N회 반복)를 자동 분석해서 만든 목록)
   - 해설강의 화면(#lcv-v 영상)이 바뀔 때마다 영상 바로 아래에 버튼을 그려 준다 — 앱 코드는 건드리지 않음 */
(function () {
if (window.MKST_LCJP_ON) return; window.MKST_LCJP_ON = 1;
var st = document.createElement("style");
st.textContent = "#lcv-jp{display:flex;flex-wrap:wrap;gap:6px;padding:0 6px 6px;background:#14233E}" +
  "#lcv-jp button{flex:1 1 30%;border:0;border-radius:10px;padding:10px 6px;font:inherit;font-size:14px;font-weight:800;background:#fff;color:#172844;cursor:pointer;white-space:nowrap}" +
  "#lcv-jp button.rp{background:#FFE3E0;color:#B3261E}#lcv-jp button.on{outline:3px solid #F26B1D}";
document.head.appendChild(st);
function draw(v) {
  var box = document.getElementById("lcv-box"); if (!box) return;
  var k = v.dataset.pg || "", L = (window.MKST_LCJP || {})[k] || [];
  var el = document.getElementById("lcv-jp");
  if (!L.length) { if (el) el.remove(); return; }
  if (!el) { el = document.createElement("div"); el.id = "lcv-jp"; box.appendChild(el); }
  if (el.dataset.k === k) return; el.dataset.k = k;
  el.innerHTML = L.map(function (x, i) { return '<button data-jp="' + i + '" class="' + (/반복/.test(x[1]) ? "rp" : "") + '">' + x[1] + '</button>'; }).join("");
  el.querySelectorAll("[data-jp]").forEach(function (b) {
    b.onclick = function () {
      var x = L[+b.dataset.jp]; if (!x) return;
      try { v.currentTime = x[0]; } catch (e) { }
      var p = v.play(); if (p && p.catch) p.catch(function () { });
    };
  });
}
function mark(v) {
  var el = document.getElementById("lcv-jp"); if (!el) return;
  var L = (window.MKST_LCJP || {})[v.dataset.pg || ""] || [], t = v.currentTime, on = -1;
  for (var i = 0; i < L.length; i++) if (t >= L[i][0] - 0.2) on = i;
  el.querySelectorAll("[data-jp]").forEach(function (b) { b.classList.toggle("on", +b.dataset.jp === on); });
}
function hook(v) {
  if (v.dataset.jph) return; v.dataset.jph = "1";
  ["loadstart", "loadedmetadata", "play"].forEach(function (e) { v.addEventListener(e, function () { draw(v); mark(v); }); });
  v.addEventListener("timeupdate", function () { mark(v); });
  new MutationObserver(function () { draw(v); }).observe(v, { attributes: true, attributeFilter: ["src", "data-pg"] });
  draw(v);
}
var tm = 0; new MutationObserver(function () { clearTimeout(tm); tm = setTimeout(function () { var v = document.getElementById("lcv-v"); if (v) hook(v); }, 80); }).observe(document.documentElement, { childList: true, subtree: true });
})();
