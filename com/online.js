/* maketoeic.com 수강신청 페이지(shop/list.php?ca_id=10) 하단 '온라인 수업' 섹션
   - .com 관리자 '추가 스크립트'에서 <script src="https://maketoeic.kr/com/online.js" defer></script> 로 불러옴
   - 가격은 maketoeic.kr 결제 설정(pay_cfg)에서 받아 와 admin 가격과 자동으로 맞춤 */
(function () {
  if (!/\/shop\/list\.php$/.test(location.pathname)) return;
  if (!/(^|[?&])ca_id=10(&|$)/.test(location.search)) return;
  function run() {
    if (document.getElementById("mk-onl")) return;
    var anchor = document.getElementById("sct");
    if (!anchor) return;
    var css = document.createElement("style");
    css.textContent =
      "#mk-onl{margin:48px 0 36px;font-family:inherit;color:#1F2937}" +
      "#mk-onl *{box-sizing:border-box}" +
      "#mk-onl .h{border-left:5px solid #FF581F;background:#FFF5EF;border-radius:12px;padding:16px 18px;margin-bottom:16px}" +
      "#mk-onl .h b{display:block;font-size:22px;color:#172844;letter-spacing:-.02em}" +
      "#mk-onl .h span{display:block;font-size:14.5px;margin-top:4px;color:#33404F}" +
      "#mk-onl .g{display:grid;gap:14px;grid-template-columns:1fr}" +
      "@media(min-width:760px){#mk-onl .g{grid-template-columns:repeat(3,1fr)}}" +
      "#mk-onl .c{border:1px solid #E3E7EF;border-radius:16px;overflow:hidden;background:#fff;display:flex;flex-direction:column}" +
      "#mk-onl .mkonl-hd{position:static!important;top:auto!important;left:auto!important;right:auto!important;width:auto!important;height:auto!important;z-index:auto!important;box-shadow:none!important;background:linear-gradient(135deg,#14233E,#233C5C);color:#fff;padding:18px 18px 16px}" +
      "#mk-onl .mkonl-hd small{display:inline-block;font-size:12px;font-weight:800;color:#FFB08F;border:1px solid rgba(255,176,143,.6);border-radius:999px;padding:3px 9px}" +
      "#mk-onl .mkonl-hd strong{display:block;font-size:20px;margin-top:10px;color:#fff;letter-spacing:-.01em}" +
      "#mk-onl .bd{padding:14px 18px 18px;display:flex;flex-direction:column;gap:8px;flex:1}" +
      "#mk-onl .bd p{margin:0;font-size:14.5px;line-height:1.6;color:#1F2937}" +
      "#mk-onl .pr{margin-top:auto;font-size:14px;font-weight:700;color:#172844}" +
      "#mk-onl .pr b{font-size:21px;color:#FF581F}" +
      "#mk-onl a.bt{display:block;text-align:center;text-decoration:none;font-weight:800;font-size:15.5px;border-radius:10px;padding:13px 10px;background:#FF581F;color:#fff;margin-top:6px}" +
      "#mk-onl a.bt.nv{background:#172844}" +
      "#mk-onl .bk{margin-top:12px;font-size:14px;font-weight:700;color:#172844;text-align:center}" +
      "#mk-onl a.more{display:block;text-align:center;text-decoration:none;font-weight:800;font-size:16px;border:2px solid #172844;color:#172844;border-radius:12px;padding:14px;margin-top:16px;background:#fff}";
    document.head.appendChild(css);
    var box = document.createElement("div");
    box.id = "mk-onl";
    box.innerHTML =
      '<div class="h"><b>온라인 수업</b><span>학원 수업 그대로, 휴대폰에서 이어서 · maketoeic.kr</span></div>' +
      '<div class="g">' +
      '<div class="c"><div class="mkonl-hd"><small>현장 수강생</small><strong>수강생 학습실</strong></div><div class="bd">' +
      "<p>수업 듣는 달에는 LC 실전 모의고사 · RC 문제 · A급 과제 해설강의 · VOCA를 휴대폰으로 무료 이용해요.</p>" +
      '<div class="pr">수업 달 <b>무료</b><br><span data-mkp="m">수업 끝난 뒤 수강생가로 계속</span></div>' +
      '<a class="bt nv" href="https://maketoeic.kr/study/">학습실 입장</a></div></div>' +
      '<div class="c"><div class="mkonl-hd"><small>학원생이 아니어도</small><strong>비회원 30일 수강권</strong></div><div class="bd">' +
      "<p>원하는 Season의 LC 실전 모의고사 10회 · 해설강의로 30일 훈련해요. 결제하면 바로 열려요.</p>" +
      '<div class="pr"><b data-mkp="lc">30,000원</b> / 30일 · 교재 PDF 무료<br><span data-mkp="lcm">메이크토익 수강생 15,000원</span></div>' +
      '<a class="bt" href="https://maketoeic.kr/lc/">30일권 보기</a></div></div>' +
      '<div class="c"><div class="mkonl-hd"><small>강의로 듣기</small><strong>A급RC 기본 Season 강의</strong></div><div class="bd">' +
      "<p>해당 월 수업 당일 녹화 영상 + 과제 해설 · 30일 수강 · 교재 별매</p>" +
      '<div class="pr"><b>150,000원</b><br>지난달 현장 수강생 100,000원</div>' +
      '<a class="bt" href="https://maketoeic.liveklass.com/classes/323558" target="_blank" rel="noopener">수강신청</a></div></div>' +
      "</div>" +
      '<p class="bk">※ 온라인 수강 교재비는 별도 · 택배 배송 시 착불 · 문의 요망 (010-4845-1432)</p>' +
      '<a class="more" href="https://maketoeic.kr/online/">온라인 수업 자세히 보기 →</a>';
    anchor.parentNode.insertBefore(box, anchor.nextSibling);
    fetch("https://hrlldteviatcatxyzrrz.supabase.co/rest/v1/rpc/pay_cfg", { method: "POST", headers: { apikey: "sb_publishable_YT1A99HvH7VoMz76xq7Tvg__Imr0_qy", "Content-Type": "application/json" }, body: "{}" })
      .then(function (r) { return r.json(); }).then(function (c) {
        if (!c) return;
        function w(n) { return (+n).toLocaleString() + "원"; }
        c.lc_price = 30000; if (c.lc_price) box.querySelectorAll('[data-mkp="lc"]').forEach(function (e) { e.textContent = w(c.lc_price); });
        if (c.lc_price_m) {
          box.querySelectorAll('[data-mkp="lcm"]').forEach(function (e) { e.textContent = "메이크토익 수강생 " + w(c.lc_price_m); });
          box.querySelectorAll('[data-mkp="m"]').forEach(function (e) { e.textContent = "수업 끝난 뒤 수강생가 " + w(c.lc_price_m) + "부터"; });
        }
      }).catch(function () { });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
