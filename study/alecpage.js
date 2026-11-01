/* A급 과제 해설강의 — 해설 페이지 넘김 버튼 (2026-11-01)
   - 화면 전환 시각 = alecpage-data.js (window.MKST_ALPG["set1/r01_p5_1"] = [초, ...]) — 영상 분석으로 자동 생성. 없으면 30초씩 넘김.
   - "구간점프 ▶" : 다음 화면으로 바로 (마지막 화면이면 다음 부) / "◀ 구간점프" : 지금 화면 처음 → 앞 화면 */
(function () {
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["<video id=\"al-v\" controls playsinline preload=\"none\" style=\"display:block;width:100%;aspect-ratio:16/9;background:#000\"></video></div>",
 "<video id=\"al-v\" controls playsinline preload=\"none\" style=\"display:block;width:100%;aspect-ratio:16/9;background:#000\"></video><div id=\"al-pg\" style=\"display:grid;grid-template-columns:1fr 1.2fr .9fr;gap:6px;padding:6px;background:#14233E\"><button id=\"al-prev\" style=\"border:0;border-radius:10px;padding:11px 8px;font:inherit;font-size:15px;font-weight:800;background:#fff;color:#172844\">◀ 구간점프</button><button id=\"al-next\" style=\"border:0;border-radius:10px;padding:11px 8px;font:inherit;font-size:15px;font-weight:800;background:#F26B1D;color:#fff\">구간점프 ▶</button></div></div>"],
["  v.addEventListener(\"ended\", function () { var nx = cur + 1;",
 "  function alPg() { var k = String(v.currentSrc || v.src || \"\").replace(window.MKST_ALEC_BASE || \"\", \"\").replace(/\\.mp4.*$/, \"\"), P = (window.MKST_ALPG || {})[k]; if (P && P.length) return P; var o = [], d = v.duration || 0; for (var t = 30; t < d - 1; t += 30) o.push(t); return o; }\n" +
 "  function alPlay() { var pp = v.play(); if (pp && pp.catch) pp.catch(function () { }); }\n" +
 "  app.querySelector(\"#al-next\").onclick = function () {\n" +
 "    if (cur < 0) return;\n" +
 "    if (!v.src) { pick(cur, true); return; }\n" +
 "    var t = v.currentTime, nx = alPg().filter(function (x) { return x > t + 0.4; })[0];\n" +
 "    if (nx != null) { v.currentTime = nx; alPlay(); return; }\n" +
 "    var n2 = cur + 1; while (n2 < L2.length && !L2[n2].d) n2++; if (n2 < L2.length) pick(n2, true);\n" +
 "  };\n" +
 "  app.querySelector(\"#al-prev\").onclick = function () {\n" +
 "    if (cur < 0 || !v.src) return;\n" +
 "    var t = v.currentTime, st = [0].concat(alPg()).filter(function (x) { return x <= t - 1.5; });\n" +
 "    v.currentTime = st.length ? st[st.length - 1] : 0; alPlay();\n" +
 "  };\n" +
 "  v.addEventListener(\"ended\", function () { var nx = cur + 1;"]
]);
})();
