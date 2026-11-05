/* 출석 체크 도장 (2026-11-05): 학습실 첫 화면에 이번 달 수업일 도장판 — 수업한 날을 누르고 몇 시 수업이었는지 고르면 도장
   - 수업일: ATT_MONTHS에 적은 달은 그 기간 주중, 그 밖의 달은 그 달 주중 전체
   - 기록: progress "att:YYYY-MM-DD" (chosen = 수업 시각(시), correct = true) — 관리자 진도 기록에도 남는다
   - 수강생만(비회원 30일권은 안 보임). 오늘·지난 수업일만 찍을 수 있고 앞으로 올 날은 잠김 */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// 출석 도장 — study/att.js
var ATT_MONTHS = { "2026-11": ["2026-11-04", "2026-11-27"] };
var ATT_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
function attYmd(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function attDays(d0) {
  var y = d0.getFullYear(), m = d0.getMonth(), key = y + "-" + String(m + 1).padStart(2, "0"), R = ATT_MONTHS[key];
  var a = R ? new Date(R[0] + "T00:00:00") : new Date(y, m, 1), b = R ? new Date(R[1] + "T00:00:00") : new Date(y, m + 1, 0), out = [];
  for (var d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) { var w = d.getDay(); if (w > 0 && w < 6) out.push(attYmd(d)); }
  return out;
}
function attHr(h) { return h < 12 ? "오전 " + h + "시" : h === 12 ? "낮 12시" : "오후 " + (h - 12) + "시"; }
function attCard() {
  var now = new Date(), today = attYmd(now), D = attDays(now), P = S.prog || {}, n = D.filter(function (d) { return P["att:" + d]; }).length, W = "일월화수목금토";
  return '<div class="card" data-att="1" style="border:2px solid #E95721;background:#FFFBF7"><div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap"><b style="font-size:18px">📅 ' + (now.getMonth() + 1) + '월 출석 도장</b><span style="font-weight:900;color:#E95721;font-size:16px">' + n + " / " + D.length + "회</span>" + (P["att:" + today] ? '<small style="margin-left:auto;color:#1E8E5A;font-weight:800">오늘 출석 완료 ✔</small>' : D.indexOf(today) >= 0 ? '<small style="margin-left:auto;color:#E95721;font-weight:800">오늘 수업일 · 도장을 찍어 주세요</small>' : "") + "</div>" +
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(68px,1fr));gap:8px;margin-top:10px">' + D.map(function (d) {
      var p = P["att:" + d], dt = new Date(d + "T00:00:00"), fut = d > today, on = d === today;
      return '<button data-attd="' + d + '"' + (fut ? " disabled" : "") + ' style="aspect-ratio:1;border-radius:50%;border:2px ' + (p ? "solid #E0322B" : on ? "solid #E95721" : "dashed #C9CFDA") + ";background:" + (p ? "#FFF0EE" : "#fff") + ";padding:0;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:" + (fut ? ".6" : "1") + ";min-width:0;width:100%;box-sizing:border-box" + ';position:relative">' +
        '<span style="font-size:12px;font-weight:800;color:#33404F">' + (dt.getMonth() + 1) + "/" + dt.getDate() + "(" + W[dt.getDay()] + ")</span>" +
        (p ? '<span style="font-size:20px;line-height:1.1;color:#E0322B;font-weight:900;transform:rotate(-12deg)">출석</span><span style="font-size:11px;font-weight:800;color:#E0322B">' + attHr(+p[0]) + "</span>" : '<span style="font-size:18px;color:#C9CFDA">' + (fut ? "·" : "＋") + "</span>") + "</button>";
    }).join("") + "</div>" +
    '<div id="att-pick" style="display:none;margin-top:10px"></div></div>';
}
function attBind() {
  var box = app.querySelector("[data-att]"); if (!box) return;
  box.querySelectorAll("[data-attd]").forEach(function (b) {
    b.onclick = function () {
      var d = b.dataset.attd, pk = box.querySelector("#att-pick"), p = S.prog["att:" + d], dt = new Date(d + "T00:00:00");
      pk.style.display = "block";
      pk.innerHTML = '<div style="font-weight:800;margin-bottom:6px">' + (dt.getMonth() + 1) + "월 " + dt.getDate() + "일 몇 시 수업이었나요?" + (p ? ' <small style="color:#1E8E5A">(지금: ' + attHr(+p[0]) + ")</small>" : "") + '</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">' +
        ATT_HOURS.map(function (h) { return '<button class="btn ' + (p && +p[0] === h ? "" : "ghost ") + 'sm" data-atth="' + h + '">' + attHr(h) + "</button>"; }).join("") + "</div>" +
        '<div style="display:flex;gap:6px;margin-top:8px">' + (p ? '<button class="btn ghost sm" data-attx="1" style="flex:1">도장 지우기</button>' : "") + '<button class="btn ghost sm" data-attc="1" style="flex:1">닫기</button></div>';
      pk.querySelectorAll("[data-atth]").forEach(function (h) { h.onclick = function () { var v = +h.dataset.atth; S.prog["att:" + d] = [v, true, 1]; api("save_progress", { p_token: S.token, p_item: "att:" + d, p_chosen: v, p_correct: true }).catch(function () { }); attRe(); }; });
      var x = pk.querySelector("[data-attx]"); if (x) x.onclick = function () { delete S.prog["att:" + d]; api("save_progress", { p_token: S.token, p_item: "att:" + d, p_chosen: -1, p_correct: false }).catch(function () { }); attRe(); };
      pk.querySelector("[data-attc]").onclick = function () { pk.style.display = "none"; };
    };
  });
}
function attRe() { var box = app.querySelector("[data-att]"); if (!box) return; box.outerHTML = attCard(); attBind(); }
function attInject(html) {
  if (!S.token || (typeof payPart === "function" && payPart()) || app.querySelector("[data-att]")) return;
  if (!/어느 학습실로 들어갈까요|오늘의 학습|시즌을 선택하세요/.test(html)) return;
  var at = app.querySelector(".hero"); if (!at) return;
  Object.keys(S.prog || {}).forEach(function (k) { if (/^att:/.test(k) && S.prog[k] && !S.prog[k][1]) delete S.prog[k]; });
  at.insertAdjacentHTML("afterend", attCard()); attBind();
}
function viewLectures(id) {
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function viewLectures(id) {\n", FN + "\n"],
["dgInject(html); nmInject(html); }", "dgInject(html); nmInject(html); attInject(html); }"]
]);
})();
