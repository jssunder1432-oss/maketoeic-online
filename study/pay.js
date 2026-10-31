/* 학습실 이용권 결제 (2026-10-31)
   - 그 달 오프라인 수업 등록생: 수업하는 달 말일(full_end)까지 학습실 전체 무료
   - 다음 달부터는 maketoeic.com 쇼핑몰에서 '학습실 이용권' 카드결제 → 자동으로 기간 연장 (Supabase shop_pull)
   - 이용권으로 여는 것: LC = 그 달 Series 전체 / RC = 기출문제만
   - A급 과제(문제·해설강의)·VOCA 는 라이브클래스 상품 → 이용권 학생에겐 잠금 + 라이브클래스로 안내 */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// 학습실 이용권 — study/pay.js
var PAY_URL = window.MKST_PAY_URL || "https://maketoeic.com/shop/item.php?it_id=1793454468", LK_URL = "https://maketoeic.liveklass.com";
function paySync() { return fetch("https://maketoeic.com/kr_sync.php?t=" + Date.now(), { mode: "no-cors", cache: "no-store" }).catch(function () { }).then(function () { return new Promise(function (r) { setTimeout(r, 1500); }); }); }
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
    <p style="font-size:14px;margin:0 0 12px;color:#33404F">LC 그 달 Series 전체 + RC 기출문제<br>결제할 때 <b>주문자 이름·휴대폰 번호를 학습실 로그인과 똑같이</b> 적어 주세요. 결제 후에는 환불되지 않아요.</p>
    <a class="btn" href="${PAY_URL}" target="_blank" rel="noopener">💳 이용권 결제하기</a>
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
  ${payCard("이용권 결제하고 계속 공부하기")}
  <button class="btn ghost" id="mkst-out">다른 이름으로 로그인</button>`);
  document.getElementById("mkst-out").onclick = logout;
  bindPayCheck(function () {
    return api("student_me", { p_token: S.token }).then(function (r) {
      if (r.status === "ok" || (r.profile && r.profile.active)) { S.profile = r.profile; S.catalog = null; S.cache = {}; boot(); return true; }
      return false;
    }).catch(function () { return false; });
  });
}
document.addEventListener("click", function (e) {
  if (!S.token || payFull()) return;
  var a = e.target.closest && e.target.closest('[data-aser],a[href*="/voca/"],[data-go="#/a"],[data-go="#/v"],[data-go^="#/alec"]');
  if (!a) return;
  e.preventDefault(); e.stopPropagation(); go("#/lock");
}, true);
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
// 만료 화면 → 결제 화면 (기존 함수 이름을 바꿔 두고 새 viewExpired 사용)
["function viewExpired() {\n  var p = S.profile || {};\n", "function viewExpiredOld() {\n  var p = S.profile || {};\n"],
["function logout() {", FN + "\nfunction logout() {"],
// 잠금 라우트
["  if (!S.catalog) return boot();\n  var h = location.hash.replace(/^#\\/?/, \"\").split(\"/\");\n", "  if (!S.catalog) return boot();\n  var h = location.hash.replace(/^#\\/?/, \"\").split(\"/\");\n  if (h[0] === \"lock\" || payLocked(h)) return viewLocked();\n"],
// 로그인 화면: 처음 온 사람도 이용권 결제
["<b>처음이신가요?</b><p style=\"margin:6px 0 12px;font-size:14px\">학습실은 메이크토익 수강생 전용입니다. 등록·기간 연장 문의는 카카오톡으로 해 주세요.</p>", "<b>처음이신가요?</b><p style=\"margin:6px 0 12px;font-size:14px\">메이크토익 오프라인 수강생은 수업하는 달에 무료로 이용해요. 그 밖에는 이용권(LC Series 전체 + RC 기출문제)을 결제하면 바로 이용할 수 있어요. 결제할 때 적은 이름·휴대폰 뒤 4자리로 입장하세요.</p><a class=\"btn\" href=\"${PAY_URL}\" target=\"_blank\" rel=\"noopener\" style=\"margin-bottom:8px\">💳 이용권 결제하기</a>"],
// 결제 직후 로그인: 아직 학습실에 안 넘어왔으면 한 번 당겨 오고 다시 로그인
["      if (r.status === \"notfound\") return viewLogin(", "      if (r.status === \"notfound\" && !submit.retried) { submit.retried = true; return paySync().then(function () { b.disabled = false; submit(); }); }\n      if (r.status === \"notfound\") return viewLogin("]
]);
})();
