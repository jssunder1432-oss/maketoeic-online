/* 수업 공지 게시판 (2026-11-06): 학습실 앱 첫 화면(시즌 선택 · 학습실 선택) 맨 위에 📢 수업 공지
   - 관리자 페이지 '📢 수업 공지'에서 쓴 글(videos.notice) — 상단 고정 먼저, 나머지 최신순
   - 대상: all 모든 학생 / mem 수강생만 / nm 비회원 30일권만 · hide 숨김
   - 처음 3개만 펼쳐 보이고 나머지는 '공지 더 보기' · 읽지 않은 공지는 NEW (이 기기 기준) */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// 수업 공지 — study/notice.js
function ntList() {
  var nm = typeof payPart === "function" && payPart(), L = ((S.videos || {}).notice || []).filter(function (n) { return n && !n.hide && (n.to === "all" || (nm ? n.to === "nm" : n.to !== "nm")); });
  return L.sort(function (a, b) { return (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || String(b.d || "").localeCompare(String(a.d || "")) || (b.id || 0) - (a.id || 0); });
}
function ntSeen() { try { return JSON.parse(ls("ntseen") || "[]"); } catch (e) { return []; } }
function ntBox() {
  var L = ntList(), seen = ntSeen(), W = "일월화수목금토";
  var row = function (n, i) {
    var d = new Date(String(n.d || "") + "T00:00:00"), dl = isNaN(d) ? "" : (d.getMonth() + 1) + "/" + d.getDate() + "(" + W[d.getDay()] + ")", nw = seen.indexOf(String(n.id)) < 0;
    return '<div data-ntr="' + esc(n.id) + '" style="border-top:' + (i ? "1px solid #E7EAF0" : "0") + ';padding:11px 2px;' + (i >= 3 ? "display:none" : "") + '"' + (i >= 3 ? " data-ntmore" : "") + '>' +
      '<button data-ntt="' + esc(n.id) + '" style="all:unset;cursor:pointer;display:flex;gap:8px;align-items:flex-start;width:100%">' +
      '<span style="flex:1;min-width:0"><b style="font-size:16px;color:#172844;line-height:1.4">' + (n.pin ? "📌 " : "") + esc(n.t) + "</b>" + (nw ? ' <span style="display:inline-block;background:#E0322B;color:#fff;font-size:11px;font-weight:900;border-radius:99px;padding:1px 7px;vertical-align:2px">NEW</span>' : "") +
      '<small style="display:block;color:#33404F;font-weight:700;margin-top:1px">' + dl + "</small></span>" +
      '<span data-ntar style="font-size:15px;color:#172844;font-weight:900;padding-top:2px">▾</span></button>' +
      '<div data-ntb style="display:none;white-space:pre-wrap;font-size:15px;line-height:1.65;color:#1F2937;font-weight:600;margin-top:8px;background:#F5F7FA;border-radius:12px;padding:12px 13px">' + (esc(n.b) || "(내용 없음)").replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color:#2952CC;word-break:break-all">$1</a>') + "</div></div>";
  };
  return '<div class="card" data-nt="1" style="border:2px solid #172844;background:#fff"><div style="display:flex;align-items:baseline;gap:8px"><b style="font-size:18px;color:#172844">📢 수업 공지</b><small style="color:#33404F;font-weight:700">' + L.length + "개</small></div>" +
    '<div style="margin-top:6px">' + (L.length ? L.map(row).join("") : '<p style="margin:8px 2px 2px;font-size:14px;font-weight:700;color:#33404F">아직 올라온 공지가 없어요.</p>') + "</div>" +
    (L.length > 3 ? '<button class="btn ghost sm" data-ntall="1" style="width:100%;margin-top:6px">공지 ' + (L.length - 3) + "개 더 보기 ▾</button>" : "") + "</div>";
}
function ntBind() {
  var box = app.querySelector("[data-nt]"); if (!box) return;
  box.querySelectorAll("[data-ntt]").forEach(function (b) {
    b.onclick = function () {
      var r = b.closest("[data-ntr]"), body = r.querySelector("[data-ntb]"), on = body.style.display === "none";
      body.style.display = on ? "block" : "none"; r.querySelector("[data-ntar]").textContent = on ? "▴" : "▾";
      if (on) { var s = ntSeen(), id = String(b.dataset.ntt); if (s.indexOf(id) < 0) { s.push(id); ls("ntseen", JSON.stringify(s.slice(-200))); } var nw = b.querySelector("span[style*='E0322B']"); if (nw) nw.remove(); }
    };
  });
  var all = box.querySelector("[data-ntall]"); if (all) all.onclick = function () { box.querySelectorAll("[data-ntmore]").forEach(function (x) { x.style.display = ""; }); all.remove(); };
}
function ntInject(html) {
  if (!S.token || app.querySelector("[data-nt]")) return;
  if (!/시즌을 선택하세요/.test(html) && !(/어느 학습실로 들어갈까요/.test(html) && !S.picked)) return;
  var at = app.querySelector(".hero"); if (!at) return;
  at.insertAdjacentHTML("afterend", ntBox()); ntBind();
  // 첫 화면에 들어올 때마다 새 공지를 다시 받아 온다 (앱을 켜 둔 채로 있어도 최신 공지)
  if (!S.ntFresh) { S.ntFresh = 1; api("get_content", { p_token: S.token, p_key: "videos" }).then(function (r) { if (!r || !r.data) return; S.videos = r.data; S.cache.videos = r.data; var b = app.querySelector("[data-nt]"); if (b) { b.outerHTML = ntBox(); ntBind(); } }).catch(function () { }).then(function () { setTimeout(function () { S.ntFresh = 0; }, 60000); }); }
}
function viewLectures(id) {
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function viewLectures(id) {\n", FN + "\n"],
["dgInject(html); nmInject(html); attInject(html); }", "dgInject(html); nmInject(html); attInject(html); ntInject(html); }"]
]);
})();
