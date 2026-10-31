/* LC 실전 모의고사 해설강의 — 해설 페이지 넘김 버튼 (2026-11-01)
   - 영상 안에서 화면(해설 페이지)이 바뀌는 시각 = lcpage-data.js (window.MKST_LCPG["s1r1/P1_001"] = [초, ...])
     → 영상마다 화면 전환을 자동 분석해서 만든 목록. 없으면 10초씩 넘김.
   - "다음 페이지 ▶" : 다음 화면으로 바로 이동 (마지막 화면이면 다음 문제 강의로)
   - "◀ 이전 페이지" : 지금 화면의 처음 → 한 번 더 누르면 앞 화면 */
(function () {
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["    `<p id=\"lcv-now\" style=\"margin:0 2px 10px;color:#33404F;font-size:14px\">",
 "    `<div id=\"lcv-pg\" style=\"display:grid;grid-template-columns:1fr 1.4fr;gap:8px;margin:0 0 10px\"><button class=\"btn ghost\" id=\"lcv-prev\" style=\"margin:0\">◀ 이전 페이지</button><button class=\"btn navy\" id=\"lcv-next\" style=\"margin:0\">다음 페이지 ▶</button></div>` +\n    `<p id=\"lcv-now\" style=\"margin:0 2px 10px;color:#33404F;font-size:14px\">"],
["v.src = B + L2[i].f + \".mp4\";", "v.src = B + L2[i].f + \".mp4\"; v.dataset.pg = V.d + \"/\" + L2[i].f;"],
["  v.addEventListener(\"ended\", function () { if (cur >= 0) now.innerHTML = `✓ <b>PART ${L2[cur].part}",
 "  function pgList() { var P = (window.MKST_LCPG || {})[v.dataset.pg]; if (P && P.length) return P; var o = [], d = v.duration || (L2[cur] || {}).d || 0; for (var t = 10; t < d - 1; t += 10) o.push(t); return o; }\n" +
 "  app.querySelector(\"#lcv-next\").onclick = function () {\n" +
 "    if (cur < 0) { go(0); return; }\n" +
 "    var P = pgList(), t = v.currentTime, nx = P.filter(function (x) { return x > t + 0.4; })[0];\n" +
 "    if (nx != null) { v.currentTime = nx; var pp = v.play(); if (pp && pp.catch) pp.catch(function () { }); }\n" +
 "    else if (cur + 1 < L2.length) go(cur + 1);\n" +
 "  };\n" +
 "  app.querySelector(\"#lcv-prev\").onclick = function () {\n" +
 "    if (cur < 0) return;\n" +
 "    var P = [0].concat(pgList()), t = v.currentTime, st = P.filter(function (x) { return x <= t - 1.5; });\n" +
 "    v.currentTime = st.length ? st[st.length - 1] : 0; var pp = v.play(); if (pp && pp.catch) pp.catch(function () { });\n" +
 "  };\n" +
 "  v.addEventListener(\"ended\", function () { if (cur >= 0) now.innerHTML = `✓ <b>PART ${L2[cur].part}"]
]);
})();
