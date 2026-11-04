/* A급 과제: 회차 화면에 '오늘 과제 제출' 버튼 (날짜별 기록 → 관리자 📮 과제 제출 탭에서 확인) 2026-11-04
   기록: save_progress  p_item = "hw:<Season>-<회>:<YYYYMMDD>",  p_chosen = 푼 문제 수 × 10000 + 제출 시각(HHMM) */
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["  onoteRound(secs, ser, n);\n", String.raw`  onoteRound(secs, ser, n);
  hwCard(secs, ser, n);
`],
["function bindCommon() {\n", String.raw`function hwCard(secs, ser, n) {
  var old = app.querySelector(".hw-card"); if (old) old.remove();
  var pre = "hw:" + ser + "-" + n + ":", now = new Date(), dk = ymdLocal(now).replace(/-/g, ""), key = pre + dk;
  var done = 0, tot = 0; secs.forEach(function (s) { var t = secStats(s); done += t.done || 0; tot += t.total || 0; });
  var WD = "일월화수목금토", lab = (now.getMonth() + 1) + "월 " + now.getDate() + "일 (" + WD[now.getDay()] + ")";
  var mine = S.prog[key], past = Object.keys(S.prog).filter(function (k) { return k.indexOf(pre) === 0 && k !== key; }).map(function (k) { return k.slice(-8); }).sort().reverse();
  function tm(v) { v = +v || 0; var hm = v % 10000, h = Math.floor(hm / 100), m = hm % 100; return (h < 12 ? "오전 " : "오후 ") + (h % 12 || 12) + ":" + String(m).padStart(2, "0"); }
  var box = document.createElement("div"); box.className = "card hw-card"; box.style.cssText = "border:2px solid #E95721;background:#FFF8F3";
  box.innerHTML = '<b style="font-size:16px">📮 오늘 과제 제출 · ' + lab + '</b>'
    + '<p style="margin:4px 0 10px;font-size:14px;color:#33404F">이 회차에서 지금까지 푼 문제 <b>' + done + ' / ' + tot + '</b> · 오늘 한 만큼 제출하면 선생님이 확인해요.</p>'
    + (mine ? '<div style="background:#E8F7EF;border-radius:10px;padding:10px 12px;font-weight:800;color:#0E7A4F;margin-bottom:8px">✔ 오늘 제출 완료 · ' + tm(mine[0]) + ' · ' + Math.floor((+mine[0] || 0) / 10000) + '문제</div>' : "")
    + '<button class="btn' + (mine ? " ghost" : "") + '" id="hw-sub" style="width:100%;padding:14px">' + (mine ? "🔄 다시 제출 (지금 푼 만큼으로 바꾸기)" : "📮 " + lab + " 과제 제출하기") + '</button>'
    + (past.length ? '<p style="margin:10px 0 0;font-size:13px;color:#33404F">지난 제출: ' + past.slice(0, 10).map(function (d) { return +d.slice(4, 6) + "/" + +d.slice(6); }).join(" · ") + (past.length > 10 ? " 외 " + (past.length - 10) + "일" : "") + "</p>" : "");
  var top = app.querySelector(".card.peach"); if (top && top.nextSibling) app.insertBefore(box, top.nextSibling); else app.appendChild(box);
  box.querySelector("#hw-sub").onclick = function () {
    var b = this, t = new Date(), v = done * 10000 + t.getHours() * 100 + t.getMinutes();
    if (!done && !confirm("아직 푼 문제가 없어요. 그래도 제출할까요?")) return;
    b.disabled = true; b.textContent = "제출 중…";
    api("save_progress", { p_token: S.token, p_item: key, p_chosen: v, p_correct: true }).catch(function (e) { if (e && e.name === "SyntaxError") return; throw e; }).then(function () { S.prog[key] = [v, true, 1]; hwCard(secs, ser, n); })
      .catch(function () { b.disabled = false; b.textContent = "다시 시도"; alert("제출하지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요."); });
  };
}
function bindCommon() {
`]
]);
