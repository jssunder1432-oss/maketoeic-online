/* 유형별 강화 추가문제 화면 = YBM(기출 TEST 흑백) 디자인 + 'MAKE TOEIC' 흐린 워터마크 (2026-11-08)
   - 문항 · 선택지 Helvetica, 번호만 왼쪽에 거는 hanging indent, (A)~(D) 괄호 표기, 흑백
   - PART 6 지문 Helvetica / PART 7 지문 Times, 검정 테두리 상자
   - 화면 위 '유형별 강화 추가문제'일 때만 적용 */
(function () {
  var css = document.createElement("style");
  css.textContent = [
    ".mk-ybm .twocol .card,.mk-ybm .twocol .passage{position:relative;overflow:hidden;background:#fff!important;border:1px solid #111!important;border-radius:3px!important;color:#000;box-shadow:none!important}",
    ".mk-ybm .twocol .card::after,.mk-ybm .twocol .passage::after{content:'MAKE TOEIC';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-28deg);font:900 clamp(40px,12vw,72px)/1 Helvetica,Arial,sans-serif;letter-spacing:.06em;color:rgba(0,0,0,.07);pointer-events:none;white-space:nowrap;z-index:0}",
    ".mk-ybm .qb{position:relative;z-index:1;padding-left:2.5em}",
    ".mk-ybm .qb .qno{position:absolute;left:0;top:0;color:#000;font:700 16.5px/1.55 Helvetica,Arial,sans-serif}",
    ".mk-ybm .qb .sent,.mk-ybm .qb .qt{display:inline;font:400 16.5px/1.55 Helvetica,Arial,'Liberation Sans',sans-serif;color:#000;margin:0}",
    ".mk-ybm .opts{display:grid;gap:1px!important;margin-top:8px!important}",
    ".mk-ybm .opt{border:0!important;border-radius:3px!important;background:transparent!important;padding:4px 6px 4px 0!important;font:400 16.5px/1.45 Helvetica,Arial,'Liberation Sans',sans-serif!important;color:#000!important;gap:6px!important;align-items:baseline!important}",
    ".mk-ybm .opt .k{flex:0 0 auto!important;width:auto!important;height:auto!important;border-radius:0!important;background:none!important;font:400 16.5px/1.45 Helvetica,Arial,sans-serif!important;color:#000!important;display:inline!important}",
    ".mk-ybm .opt .k::before{content:'('}.mk-ybm .opt .k::after{content:')'}",
    ".mk-ybm .opt.sel{background:#E6E9EF!important;outline:1.5px solid #000}",
    ".mk-ybm .opt.right{background:#E3F4EB!important;font-weight:700!important}.mk-ybm .opt.wrong{background:#FDE8E8!important;text-decoration:line-through}",
    ".mk-ybm .twocol .passage{font:400 15.5px/1.6 Helvetica,Arial,sans-serif;padding:14px 16px!important}",
    ".mk-ybm.mk-p7 .twocol .passage{font:400 16px/1.55 'Times New Roman',Times,'Liberation Serif',serif}",
    ".mk-ybm .passage>*,.mk-ybm .ex,.mk-ybm .hint,.mk-ybm .pron{position:relative;z-index:1}"
  ].join("\n");
  document.head.appendChild(css);
  function chk() {
    var app = document.querySelector(".mkst > .wrap"); if (!app) return;
    var h = app.querySelector(".qhead span"), t = h ? h.textContent : "";
    var on = /유형별 강화 추가문제/.test(t);
    app.classList.toggle("mk-ybm", on);
    app.classList.toggle("mk-p7", on && /PART 7/.test(t));
  }
  function start() { var app = document.querySelector(".mkst > .wrap"); if (!app) return setTimeout(start, 300); new MutationObserver(chk).observe(app, { childList: true }); chk(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
