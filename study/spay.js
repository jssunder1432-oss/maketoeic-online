/* 수업 결제 (2026-11-06): 수강생 학습실 앱 첫 화면 맨 아래 💳 수업 결제
   - 누르면 상품 목록(수업 연장 · 주말특강 · 학습실 앱 이용 연장 …) 펼침 → 상품 고르면 금액 · 입금 계좌 · 입금 확인 문자
   - 상품 · 가격은 관리자 페이지 '상품 가격' 탭 아래 '학습실 수업 결제 상품'(videos.spay)에서 — 가격 비우면 '금액 문의'
   - 수강생 전용(비회원 30일권 학생에겐 안 보임) · 지금은 계좌이체만 (온라인 카드결제 곧 가능) */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// 수업 결제 — study/spay.js
var SP_DEF = [
  { id: "ext", t: "다음 달 수업 연장 (1개월)", b: "다음 달 정규 수업 연장 · 학습실 전체 이용 포함", p: 240000, bk: 28000 },
  { id: "on", t: "온라인 정규반 연장 (1개월)", b: "온라인 정규반 다음 달 연장 · 학습실 전체 이용 포함", p: 200000, bk: 28000 },
  { id: "book", t: "교재비", b: "교재만 따로 결제 · 택배 배송 시 착불", p: 28000 },
  { id: "wk", t: "주말특강", b: "주말 특강 수업 등록", p: 0 },
  { id: "app", t: "학습실 앱 이용 연장 (1개월)", b: "수업 없이 학습실(LC · RC · 교재 전자책 · 해설강의)만 1개월 더", p: 0 }
];
function spList() { var L = (S.videos || {}).spay; return (L && L.length ? L : SP_DEF).filter(function (x) { return x && x.t && !x.hide; }); }
function spWon(n) { return n > 0 ? Number(n).toLocaleString() + "원" : "금액 문의"; }
function spRow() {
  return '<button class="row" data-go="#/spay" data-sp="1" style="padding:22px 20px;background:linear-gradient(125deg,#F28C28,#FFB25B);color:#fff;border:0"><span class="pill" style="background:#fff;color:#E8702A;font-size:15px;padding:6px 14px">결제</span><span class="t"><b style="color:#fff;font-size:21px">💳 수업 결제</b><small style="color:#fff">수업 연장 · 온라인 연장 · 교재비 · 주말특강</small></span><span style="font-size:22px;color:#fff">›</span></button>';
}
function spBox() {
  var L = spList();
  return '<div class="card" data-spbox="1">' +
    '<b style="font-size:17px;color:#172844">결제할 상품을 고르세요</b>' +
    L.map(function (x, i) {
      return '<button data-spk="' + i + '" style="all:unset;box-sizing:border-box;cursor:pointer;display:flex;gap:10px;align-items:center;width:100%;background:#fff;border:1.5px solid #E7EAF0;border-radius:14px;padding:12px 13px;margin-top:8px">' +
        '<span style="flex:1;min-width:0"><b style="font-size:16px;color:#172844">' + esc(x.t) + '</b>' + (x.b ? '<small style="display:block;color:#33404F;font-weight:600;margin-top:2px;line-height:1.45">' + esc(x.b) + '</small>' : '') + '</span>' +
        '<b style="font-size:16px;color:#E8702A;white-space:nowrap">' + spWon(+x.p) + '</b></button>';
    }).join("") +
    '<div data-spd style="display:none"></div>' +
    '<p style="font-size:13px;color:#33404F;font-weight:600;margin:10px 2px 0;line-height:1.55">지금은 계좌이체로만 결제돼요 · 온라인 카드결제 곧 가능<br>결제 후에는 환불되지 않아요 (결제 오류 · 중복 입금은 돌려 드려요)</p></div>';
}
function viewSpay() {
  render(topbar("💳 수업 결제") + spBox());
  bindCommon(); spBind(); window.scrollTo(0, 0);
}
function spAmt(x, sum) { return (+x.p || 0) + (sum && +x.bk > 0 ? +x.bk : 0); }
function spDetail(x, sum) {
  var nm = (S.profile || {}).name || "", bk = +x.bk > 0, amt = spAmt(x, sum);
  return '<div style="background:#fff;border:2px solid #172844;border-radius:14px;padding:14px;margin-top:10px">' +
    '<b style="font-size:16px;color:#172844">' + esc(x.t) + '</b>' +
    (bk ? '<div style="font-size:14px;font-weight:800;color:#172844;margin-top:10px">교재비 ' + Number(x.bk).toLocaleString() + '원은 어떻게 낼까요?</div>' +
      '<div style="display:flex;gap:8px;margin-top:6px">' +
      ['1', '0'].map(function (k) { var on = (k === "1") === !!sum; return '<button data-spsum="' + k + '" style="all:unset;box-sizing:border-box;cursor:pointer;flex:1;text-align:center;border:2px solid ' + (on ? "#F28C28" : "#E7EAF0") + ';background:' + (on ? "#FFF1E3" : "#fff") + ';border-radius:12px;padding:10px 6px"><b style="display:block;font-size:15px;color:#172844">' + (k === "1" ? "합산 결제" : "별도 결제") + '</b><small style="display:block;font-size:12.5px;font-weight:700;color:#33404F;margin-top:2px">' + (k === "1" ? "수업 + 교재 한 번에" : "지금은 수업만 · 교재는 따로") + '</small></button>'; }).join("") + '</div>' : '') +
    '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-top:12px;border-top:1px solid #E7EAF0;padding-top:10px"><span style="font-size:14.5px;font-weight:800;color:#172844">' + (bk ? (sum ? "수업 " + Number(x.p).toLocaleString() + " + 교재 " + Number(x.bk).toLocaleString() : "수업만") : "결제 금액") + '</span><b style="font-size:21px;color:#E8702A;white-space:nowrap">' + spWon(amt) + '</b></div>' +
    (bk && !sum ? '<p style="font-size:13px;font-weight:700;color:#33404F;margin:4px 0 0">교재비 ' + Number(x.bk).toLocaleString() + '원은 목록의 <b>교재비</b>로 따로 결제해 주세요.</p>' : '') +
    '<p style="font-size:14.5px;color:#1F2937;font-weight:600;line-height:1.65;margin:10px 0 0">입금 계좌: <b>신한은행 612-06-541251 (김정수)</b><br>입금자명은 <b>' + esc(nm) + '</b>(실명)으로 해 주세요.' + (amt > 0 ? '' : '<br>금액은 문자로 안내해 드려요.') + '</p>' +
    '<button class="btn ghost" data-spcp="1" style="width:100%;margin-top:10px">계좌번호 복사</button>' +
    '<button class="btn" data-spsms="1" style="width:100%;margin-top:8px">' + (amt > 0 ? '입금했어요 · 확인 문자 보내기' : '금액 문의 문자 보내기') + '</button>' +
    '<p data-spm style="font-size:13.5px;color:#33404F;font-weight:600;margin:8px 0 0"></p></div>';
}
function spBind() {
  var box = app.querySelector("[data-spbox]"); if (!box) return;
  var L = spList(), cur = null, sum = true, det = box.querySelector("[data-spd]");
  box.querySelectorAll("[data-spk]").forEach(function (b) {
    b.onclick = function () {
      cur = L[+b.dataset.spk];
      box.querySelectorAll("[data-spk]").forEach(function (y) { y.style.borderColor = y === b ? "#F28C28" : "#E7EAF0"; y.style.background = y === b ? "#FFF1E3" : "#fff"; });
      sum = true; draw();
      setTimeout(function () { det.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 30);
    };
  });
  function draw() {
      det.style.display = "block"; det.innerHTML = spDetail(cur, sum);
      det.querySelectorAll("[data-spsum]").forEach(function (y) { y.onclick = function () { sum = y.dataset.spsum === "1"; draw(); }; });
      det.querySelector("[data-spcp]").onclick = function () {
        var t = "신한은행 61206541251", me = this; function ok() { me.textContent = "✔ 복사했어요 (신한 612-06-541251)"; }
        if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, function () { prompt("계좌번호", t); }); else prompt("계좌번호", t);
      };
      det.querySelector("[data-spsms]").onclick = function () {
        var p = S.profile || {}, amt = spAmt(cur, sum), paid = amt > 0, bk = +cur.bk > 0;
        var body = (paid ? "[메이크토익 수업 결제 · 입금 확인 요청]" : "[메이크토익 수업 결제 · 금액 문의]") + "\n이름: " + (p.name || "") + "\n상품: " + cur.t + (bk ? (sum ? " + 교재 (합산 결제)" : " (교재 별도 결제)") : "") + (paid ? "\n금액: " + amt.toLocaleString() + "원" + (bk && sum ? " (수업 " + Number(cur.p).toLocaleString() + " + 교재 " + Number(cur.bk).toLocaleString() + ")" : "") + "\n신한은행 612-06-541251(김정수)로 입금했어요." : "");
        location.href = "sms:01048451432" + (/iPhone|iPad|iPod/.test(navigator.userAgent) ? "&" : "?") + "body=" + encodeURIComponent(body);
        det.querySelector("[data-spm]").innerHTML = "문자 앱이 열리면 그대로 <b>보내기</b>를 눌러 주세요." + (paid ? " 입금이 확인되면 바로 처리해 드려요." : "") + "<br>안 열리면 010-4845-1432로 이름 · 상품을 보내 주세요.";
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
