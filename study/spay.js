/* 수업 결제 (2026-11-06): 수강생 학습실 앱 첫 화면 맨 아래 💳 수업 결제
   - 누르면 상품 목록(수업 연장 · 주말특강 · 학습실 앱 이용 연장 …) 펼침 → 상품 고르면 금액 · 입금 계좌 · 입금 확인 문자
   - 상품 · 가격은 관리자 페이지 '상품 가격' 탭 아래 '학습실 수업 결제 상품'(videos.spay)에서 — 가격 비우면 '금액 문의'
   - 수강생 전용(비회원 30일권 학생에겐 안 보임) · 이노페이 카드결제(spay_order → pay_confirm_inno, kind 'sp') + 계좌이체
   - 학습실 앱 이용 연장은 parts(LC 실전 모의고사 · LC 교재 강의 · RC 교재 · A급 과제 · VOCA) 골라 결제 — 수업 다시보기 제외 */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// 수업 결제 — study/spay.js
var SP_DEF = [
  { id: "ext", t: "다음 달 수업 연장 (1개월)", b: "다음 달 정규 수업 연장 · 학습실 전체 이용 포함", p: 240000, bk: 28000 },
  { id: "on", t: "온라인 only 정규반 연장 (1개월)", b: "온라인 only 정규반 다음 달 연장 · 학습실 전체 이용 포함", p: 200000, bk: 28000 },
  { id: "rec", t: "온라인 only 전달 수업 녹화 연장", b: "지난달 수업 녹화 영상 다시보기 기간 연장", p: 100000 },
  { id: "book", t: "교재비", b: "교재만 따로 결제 · 택배 배송 시 착불", p: 28000 },
  { id: "wk", t: "주말특강", b: "주말 특강 수업 등록", p: 0 },
  { id: "app", t: "학습실 앱 이용 연장 (1개월)", b: "쓰고 싶은 것만 골라서 결제 (수업 다시보기 제외)", p: 0, parts: [
    { id: "lcmock", t: "LC 실전 모의고사 (문제 · 해설강의)", p: 0 }, { id: "lcp2", t: "LC 교재 강의 · PART 2 유형별", p: 0 },
    { id: "rcbook", t: "RC 교재 문제 · 해설", p: 0 }, { id: "agrade", t: "A급 과제 (문제 · 해설강의 · 오답노트)", p: 0 }, { id: "voca", t: "VOCA 단어 암기장", p: 0 }] }
];
function spList() { var L = (S.videos || {}).spay; return (L && L.length ? L : SP_DEF).filter(function (x) { return x && x.t && !x.hide; }); }
function spWon(n) { return n > 0 ? Number(n).toLocaleString() + "원" : "금액 문의"; }
function spHasParts(x) { return x && x.parts && x.parts.length; }
function spPartsOk(x) { return (x.parts || []).filter(function (q) { return +q.p > 0; }); }
function spRow() {
  return '<button class="row" data-go="#/spay" data-sp="1" style="padding:22px 20px;background:linear-gradient(125deg,#F28C28,#FFB25B);color:#fff;border:0"><span class="pill" style="background:#fff;color:#E8702A;font-size:15px;padding:6px 14px">결제</span><span class="t"><b style="color:#fff;font-size:21px">💳 수업 결제</b><small style="color:#fff">수업 연장 · 온라인 only · 녹화 연장 · 교재비 · 앱 연장</small></span><span style="font-size:22px;color:#fff">›</span></button>';
}
function spBox() {
  var L = spList();
  return '<div class="card" data-spbox="1">' +
    '<b style="font-size:17px;color:#172844">결제할 상품을 고르세요</b>' +
    L.map(function (x, i) {
      var ok = spPartsOk(x), pr = spHasParts(x) ? (ok.length ? Math.min.apply(null, ok.map(function (q) { return +q.p; })).toLocaleString() + "원~" : "금액 문의") : spWon(+x.p);
      return '<button data-spk="' + i + '" style="all:unset;box-sizing:border-box;cursor:pointer;display:flex;gap:10px;align-items:center;width:100%;background:#fff;border:1.5px solid #E7EAF0;border-radius:14px;padding:12px 13px;margin-top:8px">' +
        '<span style="flex:1;min-width:0"><b style="font-size:16px;color:#172844">' + esc(x.t) + '</b>' + (x.b ? '<small style="display:block;color:#33404F;font-weight:600;margin-top:2px;line-height:1.45">' + esc(x.b) + '</small>' : '') + '</span>' +
        '<b style="font-size:16px;color:#E8702A;white-space:nowrap">' + pr + '</b></button>';
    }).join("") +
    '<div data-spd style="display:none"></div>' +
    '<div style="background:#E9F8EE;border:2px solid #03C75A;border-radius:14px;padding:13px 14px;margin-top:12px;text-align:left"><b style="font-size:16px;color:#0B6B33;line-height:1.5">🎁 결제 당일 네이버 영수증리뷰 남겨주시면 5천원 환급 받으실 수 있습니다</b><p style="font-size:14px;font-weight:600;color:#1F2937;line-height:1.6;margin:6px 0 0">네이버에서 <b>\'청주토익 메이크토익\'</b> 검색 → 영수증리뷰 작성 후 캡처해서 <a href="https://open.kakao.com/o/su9VbJTi" target="_blank" rel="noopener" style="color:#0B6B33;font-weight:800">카카오톡 고객 문의</a>로 보내 주세요.</p></div>' +
    '<p style="font-size:13px;color:#33404F;font-weight:600;margin:10px 2px 0;line-height:1.55">💳 카드결제 또는 🏦 계좌이체 · 결제 후에는 환불되지 않아요 (결제 오류 · 중복 결제는 돌려 드려요)</p></div>';
}
function viewSpay() {
  render(topbar("💳 수업 결제") + spBox());
  bindCommon(); spBind(); window.scrollTo(0, 0);
  // 최신 상품 · 가격 다시 받기 (관리자에서 바꾼 가격 바로 반영)
  if (!S.spFresh) { S.spFresh = 1; api("get_content", { p_token: S.token, p_key: "videos" }).then(function (r) { if (r && r.data) { S.videos = r.data; S.cache && (S.cache.videos = r.data); if (/^#\/spay/.test(location.hash)) { render(topbar("💳 수업 결제") + spBox()); bindCommon(); spBind(); } } }).catch(function () { }).then(function () { setTimeout(function () { S.spFresh = 0; }, 30000); }); }
}
function spAmt(x, sum, sel) {
  if (spHasParts(x)) return x.parts.reduce(function (a, q) { return a + (sel[q.id] && +q.p > 0 ? +q.p : 0); }, 0);
  return (+x.p || 0) + (sum && +x.bk > 0 ? +x.bk : 0);
}
function spDesc(x, sum, sel) {
  if (spHasParts(x)) return x.t + " : " + x.parts.filter(function (q) { return sel[q.id]; }).map(function (q) { return q.t; }).join(" · ");
  return x.t + (+x.bk > 0 ? (sum ? " + 교재 (합산 결제)" : " (교재 별도 결제)") : "");
}
function spDetail(x, sum, sel) {
  var nm = (S.profile || {}).name || "", bk = +x.bk > 0, amt = spAmt(x, sum, sel), pa = spHasParts(x), any = pa && x.parts.some(function (q) { return sel[q.id]; });
  var parts = pa ? '<div style="font-size:14px;font-weight:800;color:#172844;margin-top:10px">이용할 것을 고르세요 <small style="font-weight:700;color:#33404F">(여러 개 가능 · 수업 다시보기 제외)</small></div>' +
    x.parts.map(function (q) { var on = !!sel[q.id]; return '<button data-sppt="' + esc(q.id) + '" style="all:unset;box-sizing:border-box;cursor:pointer;display:flex;gap:10px;align-items:center;width:100%;border:2px solid ' + (on ? "#F28C28" : "#E7EAF0") + ';background:' + (on ? "#FFF1E3" : "#fff") + ';border-radius:12px;padding:10px 12px;margin-top:6px"><span style="font-size:18px;width:22px;text-align:center">' + (on ? "☑" : "☐") + '</span><b style="flex:1;font-size:15px;color:#172844">' + esc(q.t) + '</b><b style="font-size:15px;color:#E8702A;white-space:nowrap">' + spWon(+q.p) + '</b></button>'; }).join("") : "";
  return '<div style="background:#fff;border:2px solid #172844;border-radius:14px;padding:14px;margin-top:10px">' +
    '<b style="font-size:16px;color:#172844">' + esc(x.t) + '</b>' + parts +
    (bk ? '<div style="font-size:14px;font-weight:800;color:#172844;margin-top:10px">교재비 ' + Number(x.bk).toLocaleString() + '원은 어떻게 낼까요?</div>' +
      '<div style="display:flex;gap:8px;margin-top:6px">' +
      ['1', '0'].map(function (k) { var on = (k === "1") === !!sum; return '<button data-spsum="' + k + '" style="all:unset;box-sizing:border-box;cursor:pointer;flex:1;text-align:center;border:2px solid ' + (on ? "#F28C28" : "#E7EAF0") + ';background:' + (on ? "#FFF1E3" : "#fff") + ';border-radius:12px;padding:10px 6px"><b style="display:block;font-size:15px;color:#172844">' + (k === "1" ? "합산 결제" : "별도 결제") + '</b><small style="display:block;font-size:12.5px;font-weight:700;color:#33404F;margin-top:2px">' + (k === "1" ? "수업 + 교재 한 번에" : "지금은 수업만 · 교재는 따로") + '</small></button>'; }).join("") + '</div>' : '') +
    '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-top:12px;border-top:1px solid #E7EAF0;padding-top:10px"><span style="font-size:14.5px;font-weight:800;color:#172844">' + (bk ? (sum ? "수업 " + Number(x.p).toLocaleString() + " + 교재 " + Number(x.bk).toLocaleString() : "수업만") : "결제 금액") + '</span><b style="font-size:21px;color:#E8702A;white-space:nowrap">' + (pa && !any ? "골라 주세요" : spWon(amt)) + '</b></div>' +
    (bk && !sum ? '<p style="font-size:13px;font-weight:700;color:#33404F;margin:4px 0 0">교재비 ' + Number(x.bk).toLocaleString() + '원은 목록의 <b>교재비</b>로 따로 결제해 주세요.</p>' : '') +
    (amt > 0 ? '<button class="btn" data-spcard="1" style="width:100%;margin-top:12px;padding:15px;font-size:17px">💳 ' + amt.toLocaleString() + '원 카드결제</button>' : '') +
    '<details style="margin-top:10px"' + (amt > 0 ? '' : ' open') + '><summary style="cursor:pointer;font-size:14.5px;font-weight:800;color:#172844">🏦 ' + (amt > 0 ? '계좌이체로 결제하기' : '금액 문의 · 계좌이체') + '</summary>' +
    '<p style="font-size:14.5px;color:#1F2937;font-weight:600;line-height:1.65;margin:8px 0 0">입금 계좌: <b>신한은행 612-06-541251 (김정수)</b><br>입금자명은 <b>' + esc(nm) + '</b>(실명)으로 해 주세요.' + (amt > 0 ? '' : '<br>금액은 문자로 안내해 드려요.') + '</p>' +
    '<button class="btn ghost" data-spcp="1" style="width:100%;margin-top:10px">계좌번호 복사</button>' +
    '<button class="btn ghost" data-spsms="1" style="width:100%;margin-top:8px">' + (amt > 0 ? '입금했어요 · 확인 문자 보내기' : '금액 문의 문자 보내기') + '</button></details>' +
    '<p data-spm style="font-size:13.5px;color:#33404F;font-weight:600;margin:8px 0 0"></p></div>';
}
function spInno() {
  if (window.innopay) return Promise.resolve();
  return new Promise(function (ok, no) { var s = document.createElement("script"); s.src = "https://pg.innopay.co.kr/tpay/js/v1/innopay.js"; s.onload = ok; s.onerror = function () { no(new Error("결제창을 불러오지 못했어요. 새로고침해 주세요.")); }; document.head.appendChild(s); });
}
function spBind() {
  var box = app.querySelector("[data-spbox]"); if (!box) return;
  var L = spList(), cur = null, sum = true, sel = {}, det = box.querySelector("[data-spd]");
  box.querySelectorAll("[data-spk]").forEach(function (b) {
    b.onclick = function () {
      cur = L[+b.dataset.spk];
      box.querySelectorAll("[data-spk]").forEach(function (y) { y.style.borderColor = y === b ? "#F28C28" : "#E7EAF0"; y.style.background = y === b ? "#FFF1E3" : "#fff"; });
      sum = true; sel = {}; draw();
      setTimeout(function () { det.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 30);
    };
  });
  function msg(h) { var m = det.querySelector("[data-spm]"); if (m) m.innerHTML = h; }
  function draw() {
      det.style.display = "block"; det.innerHTML = spDetail(cur, sum, sel);
      det.querySelectorAll("[data-spsum]").forEach(function (y) { y.onclick = function () { sum = y.dataset.spsum === "1"; draw(); }; });
      det.querySelectorAll("[data-sppt]").forEach(function (y) { y.onclick = function () { var k = y.dataset.sppt; sel[k] = !sel[k]; draw(); }; });
      det.querySelector("[data-spcp]").onclick = function () {
        var t = "신한은행 61206541251", me = this; function ok() { me.textContent = "✔ 복사했어요 (신한 612-06-541251)"; }
        if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, function () { prompt("계좌번호", t); }); else prompt("계좌번호", t);
      };
      det.querySelector("[data-spsms]").onclick = function () {
        var p = S.profile || {}, amt = spAmt(cur, sum, sel), paid = amt > 0, bk = +cur.bk > 0;
        var body = (paid ? "[메이크토익 수업 결제 · 입금 확인 요청]" : "[메이크토익 수업 결제 · 금액 문의]") + "\n이름: " + (p.name || "") + "\n상품: " + spDesc(cur, sum, sel) + (paid ? "\n금액: " + amt.toLocaleString() + "원" + (bk && sum ? " (수업 " + Number(cur.p).toLocaleString() + " + 교재 " + Number(cur.bk).toLocaleString() + ")" : "") + "\n신한은행 612-06-541251(김정수)로 입금했어요." : "");
        location.href = "sms:01048451432" + (/iPhone|iPad|iPod/.test(navigator.userAgent) ? "&" : "?") + "body=" + encodeURIComponent(body);
        msg("문자 앱이 열리면 그대로 <b>보내기</b>를 눌러 주세요." + (paid ? " 입금이 확인되면 바로 처리해 드려요." : "") + "<br>안 열리면 010-4845-1432로 이름 · 상품을 보내 주세요.");
      };
      var cb = det.querySelector("[data-spcard]");
      if (cb) cb.onclick = function () {
        var amt = spAmt(cur, sum, sel); cb.disabled = true; cb.textContent = "결제창 여는 중…";
        var parts = spHasParts(cur) ? Object.keys(sel).filter(function (k) { return sel[k]; }) : null, MID = "";
        api("pay_cfg", {}).then(function (c) { MID = (c || {}).mid || ""; if (!MID) throw new Error("카드결제를 준비 중이에요. 계좌이체로 결제해 주세요.");
          return api("spay_order", { p_token: S.token, p_id: cur.id, p_sum: !!sum, p_parts: parts }); }).then(function (o) {
          if (!o || o.status !== "ok") throw new Error(o && o.status === "noprice" ? "가격이 아직 정해지지 않은 상품이 있어요. 문자로 문의해 주세요." : o && o.status === "login" ? "다시 로그인해 주세요." : "결제를 시작하지 못했어요. 잠시 후 다시 시도해 주세요.");
          if (o.amount !== amt) throw new Error("가격이 바뀌었어요. 화면을 새로 열어 주세요.");
          return spInno().then(function () {
            cb.disabled = false; cb.textContent = "💳 " + amt.toLocaleString() + "원 카드결제";
            innopay.goPay({ payMethod: "CARD", mid: MID, moid: o.order_id, goodsName: String(o.order_name).slice(0, 40), amt: o.amount, goodsCnt: 1,
              buyerName: o.name, buyerTel: o.phone, buyerEmail: "js1432@naver.com", returnUrl: location.origin + "/pay/" });
          });
        }).catch(function (e) { cb.disabled = false; cb.textContent = "💳 " + amt.toLocaleString() + "원 카드결제"; msg('<span style="color:#C8202B;font-weight:800">' + esc(e.message || e) + "</span>"); });
      };
  }
}
function spInject(html) {
  if (!S.token || app.querySelector("[data-sp]")) return;
  if (typeof payPart === "function" && payPart()) return;   // 비회원 30일권 학생에겐 안 보임
  if (!/시즌을 선택하세요|어느 학습실로 들어갈까요/.test(html)) return;
  var ft = app.querySelector(".foot");
  if (ft) ft.insertAdjacentHTML("beforebegin", spRow()); else app.insertAdjacentHTML("beforeend", spRow());
  var b = app.querySelector("[data-sp]"); if (b) b.onclick = function () { go("#/spay"); };
}
function viewLectures(id) {
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function viewLectures(id) {\n", FN + "\n"],
['  if (h[0] === "dg") return viewDG();', '  if (h[0] === "spay") return viewSpay();\n  if (h[0] === "dg") return viewDG();'],
["attInject(html); ntInject(html); }", "attInject(html); ntInject(html); spInject(html); }"]
]);
})();
