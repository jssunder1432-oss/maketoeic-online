/* 출석 체크 도장 (2026-11-05): 학습실 첫 화면에 이번 달 수업일 도장판 — 수업한 날을 누르고 몇 시 수업이었는지 고르면 도장
   - 수업일: ATT_MONTHS에 적은 달은 그 기간 주중, 그 밖의 달은 그 달 주중 전체
   - 기록: progress "att:YYYY-MM-DD" (chosen = 수업 시각(시), correct = true) — 관리자 진도 기록에도 남는다
   - 수강생만(비회원 30일권은 안 보임). 오늘·지난 수업일만 찍을 수 있고 앞으로 올 날은 잠김 */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// 출석 도장 — study/att.js
var ATT_MONTHS = { "2026-11": ["2026-11-04", "2026-11-27"] };
var ATT_HOURS = [1110, 1730, 1910]; // 이번 달 수업 시각 (HHMM)
function attYmd(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function attDays(d0) {
  var y = d0.getFullYear(), m = d0.getMonth(), key = y + "-" + String(m + 1).padStart(2, "0"), R = ATT_MONTHS[key];
  var a = R ? new Date(R[0] + "T00:00:00") : new Date(y, m, 1), b = R ? new Date(R[1] + "T00:00:00") : new Date(y, m + 1, 0), out = [];
  for (var d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) { var w = d.getDay(); if (w > 0 && w < 6) out.push(attYmd(d)); }
  return out;
}
function attHr(v) { var h = v >= 100 ? Math.floor(v / 100) : v, m = v >= 100 ? v % 100 : 0, t = h < 12 ? "오전 " + h : h === 12 ? "낮 12" : "오후 " + (h - 12); return t + "시" + (m ? " " + m + "분" : ""); }
// 접속하면 맨 위에 오늘 도장 (찍었으면 큰 도장, 아직이면 수업 시각 버튼 바로)
function attShort(v) { var h = v >= 100 ? Math.floor(v / 100) : v, m = v >= 100 ? v % 100 : 0; return (h < 12 ? "오전 " : "오후 ") + (h > 12 ? h - 12 : h) + ":" + String(m).padStart(2, "0"); }
function attToday(today, D, P) {
  if (D.indexOf(today) < 0) return "";
  var p = P["att:" + today], dt = new Date(today + "T00:00:00"), lab = (dt.getMonth() + 1) + "월 " + dt.getDate() + "일 (" + "일월화수목금토"[dt.getDay()] + ")";
  if (p) return '<div style="display:flex;align-items:center;gap:14px;margin-top:12px;padding:12px 14px;border-radius:14px;background:#fff;border:1.5px solid #F3C9A8"><div style="width:104px;height:104px;border-radius:50%;border:4px solid #E0322B;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-12deg);color:#E0322B;flex:0 0 auto"><b style="font-size:24px;line-height:1">출석</b><small style="font-size:12px;font-weight:900;margin-top:3px;white-space:nowrap">' + attShort(+p[0]) + '</small></div><div><b style="font-size:17px">오늘 ' + lab + '</b><div style="font-size:14px;font-weight:700;color:#1E8E5A;margin-top:2px">출석 도장을 찍었어요 ✔</div><small style="color:#33404F;font-weight:700">시각을 바꾸려면 아래 오늘 칸을 누르세요</small></div></div>';
  return '<div style="margin-top:12px;padding:12px 14px;border-radius:14px;background:#fff;border:2px solid #E95721"><b style="font-size:17px">오늘 ' + lab + ' · 몇 시 수업에 참석했나요?</b><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px">' + ATT_HOURS.map(function (h) { return '<button class="btn sm" data-attq="' + h + '">' + attHr(h) + '</button>'; }).join("") + "</div></div>";
}
function attCard() {
  var now = new Date(), today = attYmd(now), D = attDays(now), P = S.prog || {}, n = D.filter(function (d) { return P["att:" + d]; }).length, W = "일월화수목금토";
  return '<div class="card" data-att="1" style="border:2px solid #E95721;background:#FFFBF7"><div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap"><b style="font-size:18px">📅 ' + (now.getMonth() + 1) + '월 출석 도장</b><span style="font-weight:900;color:#E95721;font-size:16px">' + n + " / " + D.length + "회</span>" + (P["att:" + today] ? '<small style="margin-left:auto;color:#1E8E5A;font-weight:800">오늘 출석 완료 ✔</small>' : D.indexOf(today) >= 0 ? '<small style="margin-left:auto;color:#E95721;font-weight:800">오늘 수업일 · 도장을 찍어 주세요</small>' : "") + "</div>" +
    attToday(today, D, P) +
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(68px,1fr));gap:8px;margin-top:10px">' + D.map(function (d) {
      var p = P["att:" + d], dt = new Date(d + "T00:00:00"), fut = d > today, on = d === today;
      return '<button data-attd="' + d + '"' + (fut ? " disabled" : "") + ' style="aspect-ratio:1;border-radius:50%;border:2px ' + (p ? "solid #E0322B" : on ? "solid #E95721" : "dashed #C9CFDA") + ";background:" + (p ? "#FFF0EE" : "#fff") + ";padding:0;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:" + (fut ? ".6" : "1") + ";min-width:0;width:100%;box-sizing:border-box" + ';position:relative">' +
        '<span style="font-size:12px;font-weight:800;color:#33404F">' + (dt.getMonth() + 1) + "/" + dt.getDate() + "(" + W[dt.getDay()] + ")</span>" +
        (p ? '<span style="font-size:20px;line-height:1.1;color:#E0322B;font-weight:900;transform:rotate(-12deg)">출석</span><span style="font-size:10.5px;font-weight:800;color:#E0322B;white-space:nowrap">' + attShort(+p[0]) + "</span>" : '<span style="font-size:18px;color:#C9CFDA">' + (fut ? "·" : "＋") + "</span>") + "</button>";
    }).join("") + "</div>" +
    '<p style="margin:8px 2px 0;font-size:13px;font-weight:700;color:#33404F">수업한 날을 누르고 몇 시 수업에 참석했는지 고르면 도장이 찍혀요.</p></div>';
}
function attBind() {
  if (!window.attPopHook) { window.attPopHook = 1; window.addEventListener("hashchange", attPopX); }
  var box = app.querySelector("[data-att]"); if (!box) return;
  box.querySelectorAll("[data-attq]").forEach(function (b) { b.onclick = function () { var d = attYmd(new Date()), v = +b.dataset.attq; S.prog["att:" + d] = [v, true, 1]; api("save_progress", { p_token: S.token, p_item: "att:" + d, p_chosen: v, p_correct: true }).catch(function () { }); attRe(); }; });
  box.querySelectorAll("[data-attd]").forEach(function (b) {
    b.onclick = function () {
      var d = b.dataset.attd, p = S.prog["att:" + d], dt = new Date(d + "T00:00:00");
      attPopX();   // 누른 날짜 바로 옆에 떠 있는 시간 선택 창 (2026-11-08)
      var bg = document.createElement("div"); bg.id = "att-bg"; bg.style.cssText = "position:fixed;inset:0;z-index:9998;background:rgba(23,40,68,.18)"; bg.onclick = attPopX; document.body.appendChild(bg);
      var pk = document.createElement("div"); pk.id = "att-pop";
      pk.style.cssText = "position:fixed;z-index:9999;left:12px;right:12px;max-width:420px;margin:0 auto;background:#fff;border:2px solid #E95721;border-radius:16px;padding:12px;box-shadow:0 10px 30px rgba(23,40,68,.28);visibility:hidden";
      document.body.appendChild(pk);
      pk.innerHTML = '<div style="font-weight:800;margin-bottom:6px">' + (dt.getMonth() + 1) + "월 " + dt.getDate() + "일 몇 시 수업이었나요?" + (p ? ' <small style="color:#1E8E5A">(지금: ' + attHr(+p[0]) + ")</small>" : "") + '</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">' +
        ATT_HOURS.map(function (h) { return '<button class="btn ' + (p && +p[0] === h ? "" : "ghost ") + 'sm" data-atth="' + h + '">' + attHr(h) + "</button>"; }).join("") + "</div>" +
        '<div style="display:flex;gap:6px;margin-top:8px">' + (p ? '<button class="btn ghost sm" data-attx="1" style="flex:1">도장 지우기</button>' : "") + '<button class="btn ghost sm" data-attc="1" style="flex:1">닫기</button></div>';
      pk.querySelectorAll("[data-atth]").forEach(function (h) { h.onclick = function () { var v = +h.dataset.atth; S.prog["att:" + d] = [v, true, 1]; api("save_progress", { p_token: S.token, p_item: "att:" + d, p_chosen: v, p_correct: true }).catch(function () { }); attRe(); }; });
      var x = pk.querySelector("[data-attx]"); if (x) x.onclick = function () { delete S.prog["att:" + d]; api("save_progress", { p_token: S.token, p_item: "att:" + d, p_chosen: -1, p_correct: false }).catch(function () { }); attRe(); };
      pk.querySelector("[data-attc]").onclick = attPopX;
      var r = b.getBoundingClientRect(), H = pk.offsetHeight, vh = window.innerHeight, top = r.bottom + 8;
      if (top + H > vh - 8) top = r.top - H - 8;          // 아래 공간 없으면 날짜 위에
      if (top < 8) top = Math.max(8, Math.min(vh - H - 8, r.top + r.height / 2 - H / 2));
      pk.style.top = top + "px"; pk.style.visibility = "visible";
    };
  });
}
function attPopX() { ["att-pop", "att-bg"].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); }); }
function attRe() { attPopX(); var box = app.querySelector("[data-att]"); if (!box) return; box.outerHTML = attCard(); attBind(); }
// 첫 화면: 내 단어장 · 필기 노트(캡처) 폴더 바로 가기
function myBox() {
  var nv = typeof ebVoc === "function" ? ebVoc().length : 0;
  return '<div data-mybox="1" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 14px">' +
    '<button class="row" data-go="#/eb/voc" style="margin:0;flex-direction:column;align-items:flex-start;gap:4px;padding:16px;border:2px solid #E8B500;background:#FFFBEA"><b style="font-size:17px">⭐ 내 단어장</b><small style="color:#33404F;font-weight:700">저장한 단어 ' + nv + '개 · PDF</small></button>' +
    '<button class="row" data-go="#/eb/note" style="margin:0;flex-direction:column;align-items:flex-start;gap:4px;padding:16px;border:2px solid #E95721;background:#FFF4EC"><b style="font-size:17px">📒 필기 노트</b><small style="color:#33404F;font-weight:700" data-mynote>📸 캡처한 화면 모음 · 날짜별 PDF</small></button></div>';
}
function myBind() {
  app.querySelectorAll("[data-mybox] [data-go]").forEach(function (b) { b.onclick = function () { go(b.dataset.go); }; });
  if (typeof ebNotes === "function") ebNotes().then(function (L) { var e = app.querySelector("[data-mynote]"); if (e) e.textContent = "📸 캡처 " + L.length + "장 · 날짜별 PDF"; });
}
function attInject(html) {
  if (!S.token || (typeof payPart === "function" && payPart()) || app.querySelector("[data-att]")) return;
  if (!/시즌을 선택하세요/.test(html) && !(/어느 학습실로 들어갈까요/.test(html) && !S.picked)) return;
  var at = app.querySelector(".hero"); if (!at) return;
  Object.keys(S.prog || {}).forEach(function (k) { if (/^att:/.test(k) && S.prog[k] && !S.prog[k][1]) delete S.prog[k]; });
  at.insertAdjacentHTML("afterend", attCard() + myBox()); attBind(); myBind();
}
function viewLectures(id) {
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function viewLectures(id) {\n", FN + "\n"],
["dgInject(html); nmInject(html); }", "dgInject(html); nmInject(html); attInject(html); }"]
]);
})();
