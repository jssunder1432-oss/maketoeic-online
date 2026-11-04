/* 학습실 이용권 결제 (2026-10-31)
   - 그 달 오프라인 수업 등록생: 수업하는 달 말일(full_end)까지 학습실 전체 무료
   - 다음 달부터는 maketoeic.com 쇼핑몰에서 '학습실 이용권' 카드결제 → 자동으로 기간 연장 (Supabase shop_pull)
   - 이용권으로 여는 것: LC = 그 달 Series 전체 / RC = 기출문제만
   - A급 과제(문제·해설강의)·VOCA 는 라이브클래스 상품 → 이용권 학생에겐 잠금 + 라이브클래스로 안내 */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// 학습실 이용권 — study/pay.js
var PAY_URL = window.MKST_PAY_URL || "/pay/", LK_URL = "https://maketoeic.liveklass.com";
function paySync() { return Promise.resolve(); }
function payFull() { var p = S.profile || {}; return p.full !== false; }
function secIsA(id) { var c = S.catalog && S.catalog.sections || []; for (var i = 0; i < c.length; i++) if (c[i].id === id) return c[i].group === "A급 과제"; return false; }
function payLocked(h) {
  if (payFull()) return false;
  if (h[0] === "a" || h[0] === "alec" || h[0] === "v" || h[0] === "w") return true;
  if ((h[0] === "s" || h[0] === "lec" || h[0] === "ex") && h[1] && secIsA(decodeURIComponent(h[1]))) return true;
  return false;
}
function viewLocked() {
  render(topbar("라이브클래스 수강 상품") +
    `<div class="card hero"><span class="kicker">MAKE TOEIC · 학습실</span><h1>A급 과제 · VOCA는 라이브클래스 수강 상품이에요</h1>
      <p>학습실 이용권으로는 LC(그 달 Series 전체)와 RC 기출문제를 이용할 수 있어요. A급 과제 문제·해설강의와 VOCA 단어 암기장은 라이브클래스에서 수강 신청하면 볼 수 있어요.</p></div>
    <a class="btn" href="${LK_URL}" target="_blank" rel="noopener">라이브클래스에서 수강 신청하기</a>
    <button class="btn ghost" data-go="#/" style="margin-top:8px">학습실 홈으로</button>`);
  bindCommon();
}
function payCard(title) {
  return `<div class="card peach"><h2>${title}</h2>
    <p style="font-size:14.5px;margin:6px 0 4px">학습실 이용권 · 1개월 · 결제 즉시 이용</p>
    <p style="font-size:14px;margin:0 0 12px;color:#33404F">LC 그 달 Series 전체 + RC 기출문제<br>결제할 때 <b>학습실 로그인 이름·휴대폰 번호</b>를 그대로 적어 주세요. 결제 후에는 환불되지 않아요.</p>
    <a class="btn" href="${PAY_URL}?p=lc&name=${encodeURIComponent((S.profile || {}).name || "")}">💳 이용권 결제하기</a>
    <button class="btn ghost" id="pay-chk" style="margin-top:8px">결제했어요 · 바로 열기</button>
    <p id="pay-msg" style="font-size:13.5px;margin:8px 0 0;color:#33404F"></p></div>`;
}
function bindPayCheck(after) {
  var b = document.getElementById("pay-chk"); if (!b) return;
  b.onclick = function () {
    var m = document.getElementById("pay-msg"); b.disabled = true; b.textContent = "결제 확인 중…";
    paySync().then(function () { return after(); }).then(function (ok) {
      b.disabled = false; b.textContent = "결제했어요 · 바로 열기";
      if (!ok) m.textContent = "아직 결제가 확인되지 않았어요. 주문자 이름·번호가 로그인 정보와 같은지 확인하고 1~2분 뒤 다시 눌러 주세요.";
    });
  };
}
function viewExpired() {
  var p = S.profile || {};
  render(`
  <div class="card hero"><span class="kicker">MAKE TOEIC · 학습실</span><h1>${esc(p.name || "")}님, 이용 기간이 끝났어요</h1>
    <p>이용 기간: ${esc(p.start_date || "")} ~ ${esc(p.end_date || "")}<br>그동안 푼 기록은 그대로 남아 있어요.</p></div>
  ${(p.plan === "lc" || p.plan === "rc" || p.plan === "lcrc") ? `<div class="card peach"><h2>${p.plan === "lcrc" ? "LC+RC" : p.plan === "rc" ? "RC" : "LC"} 30일 수강권 연장하기</h2><p style="font-size:14.5px;margin:6px 0 12px">이번 달 Season 문제 · 30일 · 결제 화면에서 LC · RC · LC+RC 중 고를 수 있어요</p><a class="btn" href="/pay/?p=${p.plan}&name=${encodeURIComponent(p.name || "")}">💳 30일 수강권 결제하기</a><button class="btn ghost" id="pay-chk" style="margin-top:8px">결제했어요 · 바로 열기</button><p id="pay-msg" style="font-size:13.5px;margin:8px 0 0;color:#33404F"></p></div>` : payCard("이용권 결제하고 계속 공부하기")}
  <button class="btn ghost" id="mkst-out">다른 이름으로 로그인</button>`);
  document.getElementById("mkst-out").onclick = logout;
  bindPayCheck(function () {
    return api("student_me", { p_token: S.token }).then(function (r) {
      if (r.status === "ok" || (r.profile && r.profile.active)) { S.profile = r.profile; S.catalog = null; S.cache = {}; boot(); return true; }
      return false;
    }).catch(function () { return false; });
  });
}
// ---------- 열람 범위 제한 : 비회원 30일권(lc/rc/lcrc) 또는 관리자가 고른 카테고리(cats) ----------
//   카테고리: lcmock(LC 실전 모의고사·해설강의) lcp2(LC Part 2 유형별) rcbook(RC 교재·추가 문제·실전 테스트) agrade(A급 과제·해설강의) voca(VOCA·단어 게임)
function myCats() { var c = (S.profile || {}).cats; return c && c.length ? c : null; }
function hasCat(k) { var c = myCats(); return !c || c.indexOf(k) >= 0; }
function payPart() { var p = S.profile || {}; return p.full === false && (p.plan === "lc" || p.plan === "rc" || p.plan === "lcrc"); }
function payLc() { return !!myCats(); }
function planLC() { return hasCat("lcmock") || hasCat("lcp2"); }
function planRC() { return hasCat("rcbook") || hasCat("agrade") || hasCat("voca"); }
function planName() { var p = (S.profile || {}).plan; if (!payPart()) return "학습실"; return p === "lcrc" ? "LC+RC 30일 수강권" : p === "rc" ? "RC 30일 수강권" : "LC 30일 수강권"; }
function secCat(s) { return s.area === "LC" ? (/LC 실전 모의고사/.test(s.group || "") ? "lcmock" : "lcp2") : s.group === "A급 과제" ? "agrade" : "rcbook"; }
function planSec(s) {
  var k = secCat(s); if (!hasCat(k)) return false;
  if (payPart() && (k === "lcmock" || k === "rcbook")) { var sea = s.season ? +s.season : 3; return allowedSeries().indexOf(sea) >= 0; }
  return true;
}
var LC_OPEN = ["", "learn", "full", "s", "lcv", "lec", "ex", "wrong", "bm", "stats", "weak", "lock", "pick", "room"];
function catOpen(h) {
  var r = h[0] || "";
  if (LC_OPEN.indexOf(r) >= 0) return true;
  if (r === "mock") return hasCat("rcbook");
  if (r === "a" || r === "alec") return hasCat("agrade");
  if (["v", "w", "game", "race", "rank", "rrank"].indexOf(r) >= 0) return hasCat("voca");
  if (r === "rec") return !payPart();
  return false;
}
function viewLockedLc() {
  var nm = encodeURIComponent((S.profile || {}).name || "");
  var more = payPart() && !(hasCat("lcmock") && hasCat("rcbook")) ? `<a class="btn" href="/pay/?p=lcrc&name=${nm}">LC+RC 30일권으로 함께 보기</a>` : "";
  render(topbar(planName()) +
    `<div class="card hero"><span class="kicker">MAKE TOEIC · ${planName()}</span><h1>이 메뉴는 열려 있지 않아요</h1>
      <p>${payPart() ? planName() + "에 포함되지 않은 메뉴예요." : "이 학습 메뉴는 아직 열려 있지 않아요. 필요하면 메이크토익 질문방으로 문의해 주세요."}</p></div>
    ${more}<button class="btn ghost" data-go="#/" style="margin-top:8px">학습실 홈으로</button>`);
  bindCommon();
}
// ---------- 시즌(Series) 선택 : 입장할 때마다 고르기 (열린 Series 만 들어갈 수 있음) ----------
function viewPick() {
  var a = allowedSeries(), p = S.profile || {};
  render(`<div class="card hero"><span class="kicker">MAKE TOEIC · 수강생 학습실</span>
    <h1>${esc(p.name || "")}님, 시즌을 선택하세요</h1><p>수강한 달의 시즌이 열려 있어요. 이번 달은 <b>Series ${p.cur_series || a[a.length - 1]}</b>이에요.</p></div>` +
    [1, 2, 3].map(function (n) {
      var on = a.indexOf(n) >= 0, now = n === p.cur_series;
      return on
        ? `<button class="row" data-pick="${n}" style="padding:20px 18px${now ? ";border-color:#F26B1D;background:#FFF4EC" : ""}"><span class="pill o" style="font-size:14px;padding:5px 12px">Series ${n}</span><span class="t"><b style="font-size:18px">Series ${n} 입장${now ? " · 이번 달" : ""}</b><small>LC · RC · A급 과제 · VOCA</small></span>›</button>`
        : `<div class="row" style="padding:20px 18px;cursor:default;opacity:.55"><span class="pill n" style="font-size:14px;padding:5px 12px">Series ${n}</span><span class="t"><b style="font-size:18px">Series ${n}</b><small>수강 기간에 포함되지 않았어요</small></span>🔒</div>`;
    }).join("") +
    `<div class="foot"><button class="btn ghost sm" id="mkst-logout">로그아웃</button><br><br><a href="/">메인페이지로 돌아가기</a></div>`);
  app.querySelectorAll("[data-pick]").forEach(function (b) { b.onclick = function () { ls("ser", b.dataset.pick); S.picked = true; location.hash = "#/"; viewHome(); }; });
  var lo = document.getElementById("mkst-logout"); if (lo) lo.onclick = logout;
}
// 비회원 30일권: 수강권에 없는 메뉴(A급 · VOCA · 게임 · 실전 테스트 등)는 화면에서 숨김
function payLockSel() {
  var a = [];
  if (!hasCat("voca")) a.push('[data-go^="#/game"]', '[data-go^="#/race"]', 'a[href*="/voca/"]', '[data-go="#/v"]', '[data-go^="#/w"]');
  if (!hasCat("agrade")) a.push('[data-aser]', '[data-go="#/a"]', '[data-go^="#/alec"]');
  if (!hasCat("rcbook")) a.push('[data-go="#/mock"]');
  if (payPart()) a.push('[data-go="#/rec"]');
  if (!(planLC() && planRC())) a.push('[data-go="#/room"]');
  if (!planRC()) a.push('[data-room="RC"]');
  if (!planLC()) a.push('[data-room="LC"]');
  return a.join(",") || "#__none";
}
function payHide() {
  if (!S.token || !payLc()) return;
  document.querySelectorAll(".mkst " + payLockSel().split(",").join(",.mkst ")).forEach(function (el) {
    var row = el.closest(".row") || el; if (row.style.display === "none") return; row.style.display = "none";
    var box = row.parentNode;
    if (box && box.className.indexOf("mkst") < 0 && box.id !== "app" && ![].some.call(box.querySelectorAll(".row,button"), function (x) { return x.style.display !== "none" && x.offsetParent !== null; })) box.style.display = "none";
  });
}
new MutationObserver(function () { payHide(); }).observe(document.documentElement, { childList: true, subtree: true });
document.addEventListener("click", function (e) {
  if (!S.token) return;
  if (payLc()) { var r = e.target.closest && e.target.closest(payLockSel()); if (r) { e.preventDefault(); e.stopPropagation(); go("#/lock"); } return; }
  if (payFull()) return;
  var a = e.target.closest && e.target.closest('[data-aser],a[href*="/voca/"],[data-go="#/a"],[data-go="#/v"],[data-go^="#/alec"]');
  if (!a) return;
  e.preventDefault(); e.stopPropagation(); go("#/lock");
}, true);
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
// 기존 Series 선택 화면은 새 화면(시즌 선택)으로
["function viewPick() {", "function viewPickOld() {"],
// 만료 화면 → 결제 화면 (기존 함수 이름을 바꿔 두고 새 viewExpired 사용)
["function viewExpired() {\n  var p = S.profile || {};\n", "function viewExpiredOld() {\n  var p = S.profile || {};\n"],
["function logout() {", FN + "\nfunction logout() {"],
// 잠금 라우트 (LC 수강권은 LC 모의고사 화면만)
["  if (!S.catalog) return boot();\n  var h = location.hash.replace(/^#\\/?/, \"\").split(\"/\");\n", "  if (!S.catalog) return boot();\n  var h = location.hash.replace(/^#\\/?/, \"\").split(\"/\");\n  if (payLc()) { if (allowedSeries().length < 2) S.picked = true; if (!(planLC() && planRC())) { S.area = planRC() ? \"RC\" : \"LC\"; S.roomPicked = true; } if (h[0] === \"lock\" || !catOpen(h)) return viewLockedLc(); }\n  else if (h[0] === \"lock\" || payLocked(h)) return viewLocked();\n"],
// 입장할 때마다 시즌 선택 (LC 수강권 제외)
["if (!S.picked && allowedSeries().length > 1 && (!h[0] || h[0] === \"\")) { S.picked = true; return viewPick(); }", "if (!S.picked && (!payPart() || allowedSeries().length > 1) && (!h[0] || h[0] === \"\")) { S.picked = true; return viewPick(); }"],
// LC 수강권: 이번 달 Series 만
["function allowedSeries() {\n  var p = S.profile || {}, out = [];", "function allowedSeries() {\n  var p = S.profile || {}, out = [];\n  if ((p.plan === \"lc\" || p.plan === \"rc\" || p.plan === \"lcrc\") && p.full === false && p.cur_series && !(p.seasons && p.seasons.length)) return [p.cur_series];\n  if (p.seasons && p.seasons.length) return p.seasons.map(Number).filter(function (n) { return n >= 1 && n <= 3; }).sort();"],
// LC 수강권: 목록에는 이번 달 LC 실전 모의고사만
["S.catalog = x[0] || { sections: [] }; S.videos", "S.catalog = x[0] || { sections: [] }; if (payLc()) S.catalog = { sections: S.catalog.sections.filter(planSec) }; S.videos"],
// 로그인 화면: 처음 온 사람도 이용권 결제
["<b>처음이신가요?</b><p style=\"margin:6px 0 12px;font-size:14px\">학습실은 메이크토익 수강생 전용입니다. 등록·기간 연장 문의는 카카오톡으로 해 주세요.</p>", "<b>처음이신가요?</b><p style=\"margin:6px 0 12px;font-size:14px\">메이크토익 오프라인 수강생은 수업하는 달에 무료로 이용해요. 학원생이 아니면 <b>비회원 학습실</b>에서 30일 수강권(LC · RC · LC+RC 중 선택)으로 시작할 수 있어요. 결제할 때 적은 이름·휴대폰 뒤 4자리로 입장하세요.</p><a class=\"btn\" href=\"/lc/\" style=\"margin-bottom:8px\">🎧 비회원 학습실 · 30일 수강권</a><a class=\"btn ghost\" href=\"${PAY_URL}?p=lc\" style=\"margin-bottom:8px\">수업 끝난 수강생 · 30일 수강권(수강생가)</a>"],
// 결제 직후 로그인: 아직 학습실에 안 넘어왔으면 한 번 당겨 오고 다시 로그인
["      if (r.status === \"notfound\") return viewLogin(", "      if (r.status === \"notfound\" && !submit.retried) { submit.retried = true; return paySync().then(function () { b.disabled = false; submit(); }); }\n      if (r.status === \"notfound\") return viewLogin("]
]);
})();
