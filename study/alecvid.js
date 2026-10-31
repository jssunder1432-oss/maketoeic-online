/* A급 과제 해설강의 = D드라이브에서 만든 강의 영상(R2) (2026-10-31)
   - Series 3 = A급과제_최종_세트1, Series 2 = A급과제_최종_세트2 (회차·PART별 1부·2부…)
   - 목록 = alecvid-data.js (window.MKST_ALEC[Series][회][PART] = [길이초, ...]), 영상 = MKST_ALEC_BASE + "set{세트}/r01_p5_1.mp4"
   - 문제를 안 풀어도 바로 볼 수 있다. 기존 유튜브 해설강의 대신 이 영상을 연다. */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// A급 과제 해설강의 영상 — study/alecvid.js
function aLecRoundData(ser, n) { var D = window.MKST_ALEC || {}; return (D[ser] || {})[+n] || null; }
function aLecList(sec) {
  if (!sec || sec.group !== "A급 과제" || !sec.round) return null;
  var r = aLecRoundData(serOf(sec), sec.round), l = r && r[sec.part];
  return l && l.length ? l : null;
}
function aLecHref(sec) { return "#/alec/" + serOf(sec) + "/" + sec.round + "/" + sec.part; }
function viewALec(ser, n, part) {
  var R = aLecRoundData(ser, n);
  if (allowedSeries().indexOf(ser) < 0) { render(topbar("해설강의") + '<div class="empty">이 Series는 수강 기간에 포함되지 않았어요.</div>'); bindCommon(); return; }
  if (!R) { render(topbar("해설강의") + '<div class="empty">이 회차 해설강의는 준비 중이에요.</div>'); bindCommon(); return; }
  var set = { 3: 1, 2: 2, 1: 3 }[ser], B = (window.MKST_ALEC_BASE || "") + "set" + set + "/r" + (n < 10 ? "0" : "") + n + "_p";
  var L2 = []; [5, 6, 7].forEach(function (p) { (R[p] || []).forEach(function (d, i) { L2.push({ p: p, k: i + 1, d: d, n: (R[p] || []).length }); }); });
  var cur = -1;
  render(topbar("A급 과제 " + n + "회 해설강의") +
    `<div style="position:sticky;top:0;z-index:5;border-radius:14px;overflow:hidden;background:#000;margin-bottom:8px"><video id="al-v" controls playsinline preload="none" style="display:block;width:100%;aspect-ratio:16/9;background:#000"></video></div>` +
    `<p id="al-now" style="margin:0 2px 10px;color:#33404F;font-size:14px">아래에서 강의를 고르면 바로 재생돼요.</p>` +
    [5, 6, 7].filter(function (p) { return R[p] && R[p].length; }).map(function (p) {
      return `<div class="grp">PART ${p}</div>` + L2.map(function (l, i) {
        if (l.p !== p) return "";
        return `<button class="row" data-al="${i}"><span class="pill n">${l.k}부</span><span class="t"><b>PART ${p} 해설 ${l.k}부${l.n > 1 ? " / " + l.n + "부" : ""}</b><small>${Math.floor(l.d / 60)}분 ${Math.round(l.d % 60)}초</small></span>›</button>`;
      }).join("");
    }).join("") +
    `<div style="display:grid;gap:8px;margin-top:12px"><button class="btn ghost" data-go="#/a/${ser === 3 ? n : "s" + ser + "-" + n}">${n}회 문제 풀러 가기</button></div>`);
  bindCommon();
  var v = app.querySelector("#al-v"), now = app.querySelector("#al-now");
  function mark() { app.querySelectorAll("[data-al]").forEach(function (b) { var on = +b.dataset.al === cur; b.style.borderColor = on ? "#F26B1D" : ""; b.style.background = on ? "#FFF4EC" : ""; b.querySelector(".pill").className = "pill " + (on ? "o" : "n"); }); }
  function pick(i, play) {
    cur = i; mark(); var l = L2[i];
    now.innerHTML = `${play ? "▶" : "◻"} <b>PART ${l.p} · ${l.k}부</b> ${play ? "재생 중" : "— ▶를 누르면 재생돼요"}`;
    v.src = B + l.p + "_" + l.k + ".mp4";
    if (play) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () { }); }
  }
  v.addEventListener("ended", function () { if (cur >= 0 && cur + 1 < L2.length) { pick(cur + 1, true); } else if (cur >= 0) now.innerHTML = "✓ 이 회차 강의를 다 봤어요."; });
  v.addEventListener("play", function () { if (cur >= 0) now.innerHTML = `▶ <b>PART ${L2[cur].p} · ${L2[cur].k}부</b> 재생 중`; });
  v.addEventListener("error", function () { if (cur >= 0) now.innerHTML = "영상을 불러오지 못했어요. 잠시 뒤 다시 눌러 주세요."; });
  app.querySelectorAll("[data-al]").forEach(function (b) { b.onclick = function () { pick(+b.dataset.al, true); window.scrollTo({ top: 0, behavior: "smooth" }); }; });
  var first = part ? L2.findIndex(function (l) { return l.p === part; }) : 0;
  if (first >= 0) pick(first, false);
}
function viewLectures(id) {
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function viewLectures(id) {\n", FN + "\n"],
["    var L2 = lecturesOf(sec), cur = 0;\n", "    if (aLecList(sec)) { location.replace(aLecHref(sec)); return; }\n    var L2 = lecturesOf(sec), cur = 0;\n"],
["  if (!lecturesOf(sec).length) return \"\";\n  if (sec.group === \"A급 과제\") allDone = true;", "  if (aLecList(sec)) return `<button class=\"btn navy\" data-go=\"${aLecHref(sec)}\">▶ 해설강의 보기 (${aLecList(sec).length}부)</button>`;\n  if (!lecturesOf(sec).length) return \"\";\n  if (sec.group === \"A급 과제\") allDone = true;"],
["var q = S.videos.q || {}, has = function (s) { return ", "var q = S.videos.q || {}, has = function (s) { return !!aLecList(Object.assign({ group: \"A급 과제\" }, s)) || "],
["data-go=\"#/lec/${encodeURIComponent(s.id)}\" style=\"margin:-4px 0 12px\">", "data-go=\"${aLecList(Object.assign({ group: \"A급 과제\" }, s)) ? aLecHref(s) : \"#/lec/\" + encodeURIComponent(s.id)}\" style=\"margin:-4px 0 12px\">"],
["${vid ? \"▶ 해설강의 · \" : \"\"}", "${vid || aLecRoundData(ser, n) ? \"▶ 해설강의 · \" : \"\"}"],
["  if (h[0] === \"pick\") return viewPick();\n", "  if (h[0] === \"pick\") return viewPick();\n  if (h[0] === \"alec\" && h[2]) return viewALec(+h[1], +h[2], +(h[3] || 0));\n"]
]);
})();
