/* 교재 전자책 (2026-11-04)
   - LC 학습실 / RC 학습실 메뉴 → "📖 교재 전자책" → 교재·해설 목차(그 학습실 파트만) → 페이지 보기
   - 페이지 = 교재 PDF 그림(eb/<책>/i/<쪽>.webp) + 단어 자리(eb/<책>/p/<쪽>.json)
   - 단어 누르면 품사·뜻(RC 문제와 같은 문맥 뜻), LC 지문·문제는 그 문장 원본 음원 재생
   - Season 2 = 교재2 (교재 · 해설) — 다른 Season은 준비 중
   - get_app 코드에 문자열 패치로 덧붙임 — 앵커가 하나라도 안 맞으면 원본 그대로 사용(index.html 로더 규칙). */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// 교재 전자책 — study/ebook.js
var EB_BASE = "/study/eb/";
var EB_PDF = { 1: [["s1_book", "교재1 원본 PDF", "MAKETOEIC_Season1_교재1.pdf", "9MB"], ["s1_ans", "교재1 해설지 PDF", "MAKETOEIC_Season1_해설지.pdf", "6MB"]], 2: [["s2_book", "교재2 원본 PDF", "MAKETOEIC_Season2_교재2.pdf", "29MB"], ["s2_ans", "교재2 해설지 PDF", "MAKETOEIC_Season2_해설지.pdf", "20MB"]], 3: [["s3_book", "통합 교재 원본 PDF", "MAKETOEIC_Season3_통합교재.pdf", "8MB"], ["s3_ans", "통합 교재 해설지 PDF", "MAKETOEIC_Season3_해설지.pdf", "20MB"]] };
function ebPdfFolder(ser) {
  var F = EB_PDF[ser] || []; if (!F.length) return "";
  return `<div class="eb-fd"><b>📁 원본 PDF 받기 <small>Season ${ser}</small></b>${F.map(function (f) { return `<a class="row" href="${EB_BASE}files/${f[0]}.pdf" download="${esc(f[2])}" target="_blank" rel="noopener"><span class="pill" style="background:${/ans/.test(f[0]) ? "#1E8E5A" : "#172844"};color:#fff">${/ans/.test(f[0]) ? "해설" : "교재"}</span><span class="t"><b>${esc(f[1])}</b><small>${f[3]} · 누르면 내려받아요</small></span>⬇</a>`; }).join("")}</div>`;
}
var EB_BOOKS = { 1: [{ id: "b1", nm: "교재1", sub: "문제 교재" }], 2: [{ id: "b2", nm: "교재2", sub: "문제 교재" }], 3: [{ id: "b3", nm: "통합 교재", sub: "문제 교재" }] };
var EB = { meta: {}, page: {} };
function ebBooks(ser) { return EB_BOOKS[ser] || []; }
function ebMeta(id) {
  if (EB.meta[id]) return Promise.resolve(EB.meta[id]);
  return fetch(EB_BASE + id + "/meta.json?v=" + (window.MKST_EB_VER || 1) + "ps4").then(function (r) { if (!r.ok) throw new Error("meta"); return r.json(); }).then(function (m) { EB.meta[id] = m; return m; });
}
function ebPage(id, n) {
  var k = id + ":" + n;
  if (EB.page[k]) return Promise.resolve(EB.page[k]);
  return fetch(EB_BASE + id + "/p/" + n + ".json?v=" + (window.MKST_EB_VER || 1) + "ps4").then(function (r) { return r.ok ? r.json() : { w: [], g: [], a: [], t: [] }; }).catch(function () { return { w: [], g: [], a: [], t: [] }; }).then(function (d) { EB.page[k] = d; return d; });
}
var EB_CSS = `
.mkst .eb-tabs{display:flex;gap:6px;margin:0 0 12px}
.mkst .eb-tabs button{flex:1;border:1.5px solid var(--line);background:#fff;border-radius:12px;padding:11px 8px;font-weight:800;font-size:15px}
.mkst .eb-tabs button.on{background:#172844;color:#fff;border-color:#172844}
.mkst .eb-ch{margin:0 0 10px;border:1px solid var(--line);border-radius:16px;background:#fff;overflow:hidden}
.mkst .eb-ch>b{display:block;padding:13px 16px;font-size:16px;background:#F7F9FC;border-bottom:1px solid var(--line)}
.mkst .eb-ch .eb-sub{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:6px;padding:10px}
.mkst .eb-ch .eb-sub button{border:1px solid var(--line);background:#fff;border-radius:10px;padding:10px 6px;font-size:14px;font-weight:700;color:#172844;line-height:1.3}
.mkst .eb-ch .eb-sub button small{display:block;font-size:11.5px;font-weight:600;color:#5B6573;margin-top:2px}
.mkst .eb-bar{position:sticky;top:calc(52px + env(safe-area-inset-top));z-index:20;display:flex;align-items:center;gap:6px;background:rgba(245,247,250,.96);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);padding:8px 0;margin:-4px 0 8px}
.mkst .eb-bar button,.mkst .eb-bar select{border:1px solid var(--line);background:#fff;border-radius:10px;padding:9px 11px;font-weight:800;font-size:14px;color:#172844;min-height:40px}
.mkst .eb-bar select{flex:1;min-width:0;padding:9px 6px}
.mkst .eb-trk{padding:0 0 6px;margin:0 0 4px}
.mkst .eb-tt{display:flex;gap:6px;flex-wrap:wrap}
.mkst .eb-tt button{border:1.5px solid #172844;background:#fff;color:#172844;border-radius:12px;padding:10px 13px;font-weight:900;font-size:14.5px}
.mkst .eb-tt #eb-tall{background:#E95721;border-color:#E95721;color:#fff}
.mkst .eb-tt #eb-trep.on{background:#1E8E5A;border-color:#1E8E5A;color:#fff}
.mkst .eb-tog{display:flex;align-items:center;gap:8px;width:100%;margin:2px 0 6px;border:1.5px solid #172844;background:#fff;border-radius:12px;padding:11px 14px;font-weight:900;font-size:15px;color:#172844;text-align:left}
.mkst .eb-tog span{font-size:13px;font-weight:700;color:#33404F}.mkst .eb-tog b{margin-left:auto;font-size:14px}
.mkst .eb-tch{grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:6px;padding:2px 0 8px;max-height:46vh;overflow-y:auto}
.mkst .eb-tch button{border:0;border-radius:10px;padding:10px 8px;background:#172844;color:#fff;font-weight:800;font-size:14px;text-align:left}
.mkst .eb-trk button.on{background:#E95721}
.mkst .eb-scroll{overflow:auto;-webkit-overflow-scrolling:touch;border:1px solid var(--line);border-radius:12px;background:#fff;max-height:calc(100vh - 150px);overscroll-behavior:contain}
.mkst .eb-pg{position:relative;margin:0;transform-origin:0 0}
.mkst .eb-pg img{display:block;width:100%;height:auto;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;pointer-events:none}
.mkst .eb-w{position:absolute;border-radius:2px;cursor:pointer;-webkit-tap-highlight-color:transparent}
.mkst .eb-w.au{border-bottom:1.5px solid rgba(233,87,33,.35)}
.mkst .eb-w.on{background:rgba(255,145,60,.38);outline:1.5px solid #E95721}
.mkst .eb-w.play{background:rgba(23,40,68,.13)}
.mkst .eb-pop{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(12px + env(safe-area-inset-bottom));z-index:2147483000;width:min(560px,calc(100vw - 20px));background:#fff;border:1.5px solid #172844;border-radius:16px;box-shadow:0 12px 34px rgba(23,40,68,.25);padding:14px 16px 12px}
.mkst .eb-pop .x{position:absolute;right:8px;top:6px;border:0;background:none;font-size:22px;color:#5B6573;padding:4px 8px}
.mkst .eb-pop .wd{font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#172844;margin-right:8px}
.mkst .eb-pop .ps{display:inline-block;background:#FFF1E6;color:#C2410C;border-radius:99px;padding:3px 10px;font-size:13px;font-weight:800;vertical-align:4px}
.mkst .eb-pop .bs{display:inline-block;margin-left:6px;color:#33404F;font-size:13px;font-weight:700;vertical-align:4px}
.mkst .eb-pop .mn{margin-top:6px;font-size:17px;font-weight:700;color:#172844}
.mkst .eb-pop .pl{margin-top:10px;display:flex;gap:6px}
.mkst .eb-pop .pl button{border:0;border-radius:10px;padding:9px 13px;font-weight:800;font-size:14px;background:#172844;color:#fff}
.mkst .eb-pop .pl button.g{background:#fff;color:#172844;border:1px solid var(--line)}
.mkst .eb-nav{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
.mkst .eb-qz{margin-top:10px;padding:16px}
.mkst .eb-qz h3{margin:0 0 2px;font-size:17px}
.mkst .eb-qr{border-top:1px solid var(--line);padding:10px 0}
.mkst .eb-qr .hd{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.mkst .eb-qr .no{min-width:58px;font-weight:900;color:#172844;font-size:15px}
.mkst .eb-qr .ch button{width:40px;height:40px;margin-right:4px;border:1.5px solid var(--line);border-radius:10px;background:#fff;font-weight:900;font-size:15px;color:#172844}
.mkst .eb-qr .ch button.on{background:#172844;color:#fff;border-color:#172844}
.mkst .eb-qr .ch button.ok{background:#1E8E5A;color:#fff;border-color:#1E8E5A}
.mkst .eb-qr .ch button.bad{background:#D2453B;color:#fff;border-color:#D2453B}
.mkst .eb-qr .rs{font-weight:900;font-size:14px}
.mkst .eb-qr .rs.o{color:#1E8E5A}.mkst .eb-qr .rs.x{color:#D2453B}
.mkst .eb-qr .exb{border:1px solid var(--line);background:#fff;border-radius:99px;padding:5px 11px;font-size:13px;font-weight:800;color:#172844}
.mkst .eb-qr .ex{margin-top:8px;background:#F7F9FC;border:1px solid var(--line);border-radius:12px;padding:12px;font-size:14.5px;line-height:1.65;white-space:pre-wrap;color:#172844}
.mkst .eb-score{margin:8px 0 0;padding:12px;border-radius:12px;background:#FFF4EC;font-weight:900;font-size:16px;color:#C2410C;text-align:center}
.mkst .eb-tip{font-size:13px;color:#33404F;margin:0 2px 8px}
.mkst .eb-fd{border:2px solid #172844;border-radius:16px;padding:12px 12px 4px;margin:12px 0 10px;background:#fff}
.mkst .eb-fd>b{display:block;font-size:16px;color:#172844;margin:2px 4px 10px}.mkst .eb-fd>b small{color:#5B6573;font-size:12.5px;margin-left:4px}
.mkst .eb-fd a.row{text-decoration:none}
.mkst .eb-ps{margin-top:10px;padding:14px 16px}
.mkst .eb-ps h3{margin:0 0 4px;font-size:17px}
.mkst .eb-pr{display:flex;align-items:center;gap:6px;flex-wrap:wrap;border-top:1px solid var(--line);padding:10px 0}
.mkst .eb-pr .no{flex:1;min-width:130px;font-weight:900;color:#172844;font-size:14.5px}
.mkst .eb-pr button{border:1.5px solid #172844;background:#fff;color:#172844;border-radius:10px;padding:8px 12px;font-weight:900;font-size:14px}
.mkst .eb-pr button.an{background:#5B2A86;border-color:#5B2A86;color:#fff}
.mkst .eb-side{position:fixed;top:0;right:0;bottom:0;z-index:2147482990;width:min(460px,92vw);background:#fff;border-left:2px solid #172844;box-shadow:-10px 0 30px rgba(23,40,68,.22);display:flex;flex-direction:column;padding-top:env(safe-area-inset-top)}
.mkst .eb-side .hd{display:flex;align-items:center;gap:6px;padding:12px 12px 10px 16px;border-bottom:1px solid var(--line)}
.mkst .eb-side .hd b{flex:1;font-size:16px;color:#172844}
.mkst .eb-side .hd button{border:1px solid var(--line);background:#fff;border-radius:10px;padding:7px 11px;font-weight:800;font-size:13.5px;color:#172844}
.mkst .eb-side .hd button.on{background:#172844;color:#fff;border-color:#172844}
.mkst .eb-side .bd{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;padding:14px 16px calc(20px + env(safe-area-inset-bottom));font-size:15px;line-height:1.75;white-space:pre-wrap;color:#172844}
.mkst .eb-side .bd .sh{display:block;margin:12px 0 4px;font-weight:900;color:#5B2A86}
.mkst .eb-side .bd .qh{display:block;margin:14px 0 2px;font-weight:900;color:#C2410C}
@media (min-width:900px){.mkst.eb-sideon .wrap,.mkst.eb-sideon main{margin-right:470px}}
`;
function ebStyle() { if (!document.getElementById("eb-css")) { var s = document.createElement("style"); s.id = "eb-css"; s.textContent = EB_CSS; document.head.appendChild(s); } }
// 목차 보기: #/eb  (지금 학습실 LC/RC 파트만)
function ebRoomBox() {
  var al = allowedSeries().slice().sort(), cur = curSer(), rows = [];
  [cur].forEach(function (n) {
    ebBooks(n).forEach(function (b) {
      rows.push(`<button class="row" data-go="#/eb/all/${n}" style="${n === cur ? "background:linear-gradient(125deg,#5B2A86,#8E4FD1);color:#fff;border:0" : ""}"><span class="pill" style="background:${n === cur ? "#fff" : "#5B2A86"};color:${n === cur ? "#5B2A86" : "#fff"}">S${n}</span><span class="t"><b style="${n === cur ? "color:#fff" : ""}">📖 ${esc(b.nm)}</b><small style="${n === cur ? "color:#fff" : ""}">Season ${n} 교재 · LC · RC 전체${n === cur ? " · 지금 Season" : ""}</small></span>›</button>`);
    });
    if ((EB_PDF[n] || []).length) rows.push(`<button class="row" data-go="#/eb/all/${n}" style="border:1.5px dashed #172844"><span class="pill" style="background:#172844;color:#fff">PDF</span><span class="t"><b>📁 원본 PDF 받기</b><small>교재 PDF · 해설지 PDF 내려받기 (목차 맨 아래)</small></span>›</button>`);
  });
  if (!rows.length) return "";
  return `<div style="border:2px solid #5B2A86;border-radius:18px;padding:12px 12px 2px;margin:0 0 14px;background:#fff"><div style="display:flex;align-items:baseline;flex-wrap:wrap;gap:8px;margin:2px 4px 10px"><b style="font-size:17px;color:#172844">📚 교재 전자책</b><small style="color:#33404F;font-size:13px">단어 누르면 품사·뜻 · LC 지문 누르면 원본 음원 · 정답 매기기</small></div>${rows.join("")}</div>`;
}
function viewEb(all) {
  ebStyle(); ls("eball", all ? "1" : "0");
  var ser = curSer(), B = ebBooks(ser), lc = S.area === "LC";
  if (!B.length) { render(topbar("교재 전자책") + '<div class="empty">Season ' + ser + ' 교재 전자책은 곧 열려요.</div>'); bindCommon(); return; }
  var cur = ls("ebtab") === "1" && B[1] ? 1 : 0, bk = B[cur];
  render(topbar("교재 전자책") + '<div class="empty">불러오는 중…</div>'); bindCommon();
  ebMeta(bk.id).then(function (m) {
    var chs = (m.toc || []).filter(function (c) { return all || c.area === S.area; });
    var last = +(ls("ebp:" + bk.id) || 0);
    render(topbar("교재 전자책") +
      `<div class="card hero"><span class="kicker">SEASON ${ser} · ${all ? "LC · RC" : lc ? "🎧 LC" : "📖 RC"} 교재</span><h1>📖 ${esc(bk.nm)} 전자책</h1><p>${all ? "LC는 지문·문제를 누르면 원본 음원, RC는 단어를 누르면 품사와 뜻이 나와요." : lc ? "지문·문제를 누르면 그 문장 원본 음원이 나오고, 단어 뜻도 함께 보여요." : "단어를 누르면 그 문장에 맞는 품사와 뜻이 나와요."} 문제를 풀고 쪽 아래 <b>정답 매기기</b>를 누르면 정답과 해설이 나와요.</p></div>` +
      (B.length > 1 ? `<div class="eb-tabs">${B.map(function (b, i) { return `<button data-ebt="${i}" class="${i === cur ? "on" : ""}">${esc(b.nm)}<br><small style="font-weight:600">${esc(b.sub)}</small></button>`; }).join("")}</div>` : "") +
      (last ? `<button class="row" data-go="#/eb/${bk.id}/${last}" style="background:linear-gradient(125deg,#E95721,#FF8A3D);color:#fff;border:0"><span class="pill" style="background:#fff;color:#E95721">이어</span><span class="t"><b style="color:#fff">이어 보기 · ${last}쪽</b><small style="color:#fff">마지막으로 본 쪽</small></span>›</button>` : "") +
      (chs.length ? chs.map(function (c) {
        return `<div class="eb-ch"><b>${all ? `<span class="pill ${c.area === "LC" ? "n" : "o"}" style="margin-right:6px">${c.area}</span>` : ""}${esc(c.t)} <small style="color:#5B6573;font-weight:700">${c.p}~${c.e}쪽</small></b><div class="eb-sub">${(c.s && c.s.length ? c.s : [{ t: "처음부터", p: c.p }]).map(function (x) { return `<button data-go="#/eb/${bk.id}/${x.p}">${esc(x.t)}<small>${x.p}쪽</small></button>`; }).join("")}</div></div>`;
      }).join("") : `<div class="empty">이 책에는 ${S.area} 파트가 없어요.</div>`) +
      `<button class="row" id="eb-pdf" data-ebook="${bk.id}" style="border:2px dashed #5B2A86"><span class="pill" style="background:#5B2A86;color:#fff">PDF</span><span class="t"><b>📄 쪽 골라 PDF로 저장</b><small>당일 수업 필기 쪽 번호를 적으면 그 쪽들만 PDF 파일로 만들어요</small></span>›</button>${ebPdfFolder(ser)}<p class="eb-tip">💡 휴대폰은 가로로 돌리면 더 크게 보여요. 페이지 안에서 두 손가락으로 확대할 수 있어요.</p>`);
    bindCommon();
    app.querySelectorAll("[data-ebt]").forEach(function (b) { b.onclick = function () { ls("ebtab", b.dataset.ebt); viewEb(all); }; });
  }).catch(function () { render(topbar("교재 전자책") + '<div class="empty">전자책을 불러오지 못했어요. 새로고침해 주세요.</div>'); bindCommon(); });
}
// 페이지 보기: #/eb/<책>/<쪽>
function viewEbPage(id, n) {
  ebStyle();
  var ser = curSer(), bk = ebBooks(ser).filter(function (b) { return b.id === id; })[0];
  if (!bk) { render(topbar("교재 전자책") + '<div class="empty">이 Season에서는 볼 수 없는 교재예요.</div>'); bindCommon(); return; }
  ebMeta(id).then(function (m) {
    n = Math.max(1, Math.min(m.n, n || 1)); ls("ebp:" + id, n);
    var z = +(ls("ebz") || (window.innerWidth < 700 ? 2 : 1));
    var ch = (m.toc || []).filter(function (c) { return n >= c.p && n <= c.e; })[0];
    var opts = []; for (var i = 1; i <= m.n; i++) opts.push(i);
    render(topbar(bk.nm + " · " + n + "쪽") + (ch ? `<p class="eb-tip" style="margin-top:-6px"><b>${esc(ch.t)}</b></p>` : "") +
      `<div class="eb-bar"><button data-ebn="${n - 1}" ${n <= 1 ? "disabled" : ""}>◀</button><select id="eb-sel">${opts.map(function (i) { return `<option value="${i}" ${i === n ? "selected" : ""}>${i} / ${m.n}쪽</option>`; }).join("")}</select><button data-ebn="${n + 1}" ${n >= m.n ? "disabled" : ""}>▶</button><button id="eb-zo">－</button><button id="eb-zi">＋</button></div>
      <div id="eb-trk" class="eb-trk" style="display:none"></div>
      <div class="eb-scroll" id="eb-sc"><div class="eb-pg" id="eb-pg" style="width:${z * 100}%"><img id="eb-img" alt="${n}쪽" src="${EB_BASE + id}/i/${n}.webp?v=${m.v || 1}"><div id="eb-ov"></div></div></div>
      <div id="eb-psbox"></div>
      <div id="eb-qbox"></div>
      <div class="eb-nav"><button class="btn ghost" data-ebn="${n - 1}" ${n <= 1 ? "disabled" : ""}>◀ 이전 쪽</button><button class="btn navy" data-ebn="${n + 1}" ${n >= m.n ? "disabled" : ""}>다음 쪽 ▶</button></div>
      <div style="display:grid;gap:8px;margin-top:8px"><button class="btn ghost" id="eb-pdf" data-ebook="${id}" data-cur="${n}">📄 쪽 골라 PDF로 저장</button><button class="btn ghost" data-go="#/eb${ls("eball") === "1" ? "/all" : ""}">목차로</button></div>
      <audio id="eb-au" preload="none"></audio>`);
    bindCommon();
    if (n < m.n) { var pre = new Image(); pre.src = EB_BASE + id + "/i/" + (n + 1) + ".webp?v=" + (m.v || 1); }
    function goP(p) { if (p >= 1 && p <= m.n) { ebHide(); ebSideClose(); go("#/eb/" + id + "/" + p); } }
    app.querySelectorAll("[data-ebn]").forEach(function (b) { b.onclick = function () { goP(+b.dataset.ebn); }; });
    app.querySelector("#eb-sel").onchange = function () { goP(+this.value); };
    var pg = app.querySelector("#eb-pg"), sc = app.querySelector("#eb-sc");
    function zoom(d) { var nz = Math.max(1, Math.min(4, z + d)); if (nz === z) return; var cx = (sc.scrollLeft + sc.clientWidth / 2) / pg.offsetWidth, cy = (sc.scrollTop + sc.clientHeight / 2) / pg.offsetHeight; z = nz; ls("ebz", z); pg.style.width = z * 100 + "%"; sc.scrollLeft = cx * pg.offsetWidth - sc.clientWidth / 2; sc.scrollTop = cy * pg.offsetHeight - sc.clientHeight / 2; }
    app.querySelector("#eb-zo").onclick = function () { zoom(-0.5); };
    app.querySelector("#eb-zi").onclick = function () { zoom(0.5); };
    ebPage(id, n).then(function (d) { ebDraw(m, d); ebPs(d); ebQuiz(id, n, d); });
  }).catch(function () { render(topbar("교재 전자책") + '<div class="empty">전자책을 불러오지 못했어요. 새로고침해 주세요.</div>'); bindCommon(); });
}
var EBP = { stop: 0, cur: null };
// 쪽 골라 PDF로 저장 (당일 수업 필기 쪽) — 쪽 그림을 그대로 A4 가로 PDF로
function ebPages(txt, max) {
  var out = [];
  String(txt || "").replace(/[~–—]/g, "-").split(/[,\s/]+/).forEach(function (p) {
    var m = p.match(/^(\d+)(?:-(\d+))?$/); if (!m) return;
    var a = +m[1], b = m[2] ? +m[2] : a; if (a > b) { var t = a; a = b; b = t; }
    for (var i = a; i <= b && out.length < 120; i++) if (i >= 1 && i <= max && out.indexOf(i) < 0) out.push(i);
  });
  return out;
}
function ebLoadJsPDF() {
  if (window.jspdf) return Promise.resolve(window.jspdf.jsPDF);
  return new Promise(function (res, rej) { var sc = document.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; sc.onload = function () { res(window.jspdf.jsPDF); }; sc.onerror = rej; document.head.appendChild(sc); });
}
function ebImgJpeg(url) {
  return new Promise(function (res, rej) {
    var im = new Image(); im.crossOrigin = "anonymous";
    im.onload = function () { var c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight; var x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0); res({ d: c.toDataURL("image/jpeg", 0.85), w: c.width, h: c.height }); };
    im.onerror = rej; im.src = url;
  });
}
function ebPdfDialog(id, cur) {
  ebMeta(id).then(function (m) {
    var bk = null; Object.keys(EB_BOOKS).forEach(function (k) { EB_BOOKS[k].forEach(function (b) { if (b.id === id) bk = b; }); });
    var last = ls("ebpdf:" + id) || (cur ? String(cur) : "");
    var box = document.createElement("div"); box.className = "eb-pop"; box.style.bottom = "auto"; box.style.top = "18%";
    box.innerHTML = `<button class="x" aria-label="닫기">×</button><div style="font-size:18px;font-weight:900;margin-bottom:6px">📄 쪽 골라 PDF로 저장</div>
      <p class="eb-tip" style="margin:0 0 8px">${esc(bk ? bk.nm : "")} · 1~${m.n}쪽. 쪽 번호를 적어 주세요.<br>예) <b>32-35, 71, 88</b></p>
      <input class="in" id="eb-pdfin" inputmode="text" value="${esc(last)}" placeholder="예: 32-35, 71" style="margin:0 0 10px">
      <div id="eb-pdfmsg" class="eb-tip" style="min-height:20px"></div>
      <div class="pl"><button id="eb-pdfgo">PDF 만들기</button><button class="g" id="eb-pdfx">닫기</button></div>`;
    app.appendChild(box);
    var inp = box.querySelector("#eb-pdfin"), msg = box.querySelector("#eb-pdfmsg");
    box.querySelector(".x").onclick = box.querySelector("#eb-pdfx").onclick = function () { box.remove(); };
    box.querySelector("#eb-pdfgo").onclick = function () {
      var P = ebPages(inp.value, m.n);
      if (!P.length) { msg.textContent = "쪽 번호를 확인해 주세요. 예) 32-35, 71"; return; }
      ls("ebpdf:" + id, inp.value);
      var btn = this; btn.disabled = true; msg.textContent = "PDF 만드는 중… 0 / " + P.length + "쪽";
      ebLoadJsPDF().then(function (jsPDF) {
        var doc = null, i = 0;
        function nx() {
          if (i >= P.length) {
            var nm = (bk ? bk.nm : "교재") + "_" + inp.value.replace(/[^0-9,\-]+/g, "").replace(/,/g, "_") + "쪽.pdf";
            doc.save(nm); msg.textContent = "✓ " + P.length + "쪽 PDF를 저장했어요. (다운로드 폴더 확인)"; btn.disabled = false; return;
          }
          var p = P[i++];
          return ebImgJpeg(EB_BASE + id + "/i/" + p + ".webp?v=" + (m.v || 1)).then(function (im) {
            var o = im.w >= im.h ? "l" : "p";
            if (!doc) doc = new jsPDF({ orientation: o, unit: "mm", format: "a4", compress: true }); else doc.addPage("a4", o);
            var W = o === "l" ? 297 : 210, H = o === "l" ? 210 : 297, r = Math.min(W / im.w, H / im.h), w = im.w * r, h = im.h * r;
            doc.addImage(im.d, "JPEG", (W - w) / 2, (H - h) / 2, w, h, undefined, "FAST");
            msg.textContent = "PDF 만드는 중… " + i + " / " + P.length + "쪽"; return nx();
          });
        }
        return nx();
      }).catch(function () { msg.textContent = "PDF를 만들지 못했어요. 잠시 뒤 다시 눌러 주세요."; btn.disabled = false; });
    };
  });
}
document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("#eb-pdf"); if (b) ebPdfDialog(b.dataset.ebook, +b.dataset.cur || 0); });
function ebAudio() { return app.querySelector("#eb-au"); }
function ebSrc(m, s) { return /^https?:/.test(s) ? s : (m.au || {})[s] || s; }
function ebPlay(m, a, onEnd) {
  var au = ebAudio(); if (!au || !a) return;
  stopPlay();
  var src = ebSrc(m, a[0]), st = +a[1] || 0, en = +a[2] || 0, run = ++EBP.stop;
  function seekPlay() { try { au.currentTime = st; } catch (e) { } var p = au.play(); if (p && p.catch) p.catch(function () { }); }
  au.ontimeupdate = function () { if (run !== EBP.stop) return; if (en && au.currentTime >= en) { au.pause(); if (onEnd) onEnd(); } };
  au.onended = function () { if (run === EBP.stop && onEnd) onEnd(); };
  if (au.dataset.src !== src) { au.dataset.src = src; au.src = src; au.preload = "auto"; au.onloadedmetadata = function () { if (run === EBP.stop) seekPlay(); }; au.load(); var p = au.play(); if (p && p.catch) p.catch(function () { }); }
  else seekPlay();
}
function ebSideClose() { var x = document.querySelector(".mkst .eb-side"); if (x) x.remove(); var r = document.querySelector(".mkst"); if (r) r.classList.remove("eb-sideon"); }
window.addEventListener("hashchange", function () { if (!/^#\/eb\//.test(location.hash)) ebSideClose(); });
function ebFmt(t) {
  return esc(t || "").replace(/^(▶ [^\n]+)$/gm, '<span class="sh">$1</span>').replace(/^(■ [^\n]+)$/gm, '<span class="sh" style="margin-top:0;font-size:16px;color:#172844">$1</span>').replace(/^(\d{3}번 · [^\n]+)$/gm, '<span class="qh">$1</span>').replace(/^(\[지문 \d\])/gm, '<b style="color:#5B2A86">$1</b>').replace(/^(정답 근거|오답 분석|의식의 흐름|보기 정리|암기|해석|어휘|이렇게 본다|정답 포인트)(?=\s|$)/gm, '<b style="color:#172844">$1</b>').replace(/^(정답 \([A-D]\))/gm, '<b style="color:#1E8E5A">$1</b>').replace(/\n{2,}/g, "\n").replace(/<\/span>\n/g, "</span>").replace(/\n(<span class="(?:sh|qh)")/g, "$1");
}
// 지문마다 해석 · 지문 분석 (옆에 펼침)
function ebPs(d) {
  var box = app.querySelector("#eb-psbox"), P = d.ps || []; ebSideClose(); if (!box || !P.length) return;
  box.innerHTML = `<div class="card eb-ps"><h3>📖 지문 해석 · 🔍 지문 분석</h3><p class="eb-tip" style="margin:0 0 4px">버튼을 누르면 옆에 펼쳐져요. 교재를 보면서 같이 읽으세요.</p>` +
    P.map(function (p, i) { return `<div class="eb-pr"><span class="no">${esc(p.h)}</span>${p.tr ? `<button data-pst="${i}" data-k="tr">📖 해석</button>` : ""}${p.an ? `<button class="an" data-pst="${i}" data-k="an">🔍 지문 분석</button>` : ""}</div>`; }).join("") + `</div>`;
  function open(i, k) {
    ebSideClose(); ebHide();
    var p = P[i], sd = document.createElement("div"); sd.className = "eb-side";
    sd.innerHTML = `<div class="hd"><b>${esc(p.h)}</b>${p.tr ? `<button data-sk="tr" class="${k === "tr" ? "on" : ""}">해석</button>` : ""}${p.an ? `<button data-sk="an" class="${k === "an" ? "on" : ""}">분석</button>` : ""}<button data-sx="1" aria-label="닫기">✕</button></div><div class="bd">${ebFmt(k === "tr" ? p.tr : p.an)}</div>`;
    var root = document.querySelector(".mkst") || document.body; root.appendChild(sd); root.classList.add("eb-sideon");
    sd.querySelector("[data-sx]").onclick = ebSideClose;
    sd.querySelectorAll("[data-sk]").forEach(function (b) { b.onclick = function () { open(i, b.dataset.sk); }; });
  }
  box.querySelectorAll("[data-pst]").forEach(function (b) { b.onclick = function () { open(+b.dataset.pst, b.dataset.k); }; });
}
function ebHide() { var p = document.querySelector(".mkst .eb-pop"); if (p) p.remove(); app.querySelectorAll(".eb-w.on,.eb-w.play").forEach(function (x) { x.classList.remove("on"); x.classList.remove("play"); }); }
function ebDraw(m, d) {
  var ov = app.querySelector("#eb-ov"); if (!ov) return;
  var W = d.w || [], G = d.g || [], A = d.a || [];
  ov.innerHTML = W.map(function (w, i) {
    return `<span class="eb-w${w[5] >= 0 ? " au" : ""}" data-i="${i}" style="left:${w[0] * 100}%;top:${w[1] * 100}%;width:${w[2] * 100}%;height:${w[3] * 100}%"></span>`;
  }).join("");
  // 듣기 묶음(파트2 마킹 시트·파트3·4 실전): 전체 듣기 / 문제 골라 듣기 / 정답 반복 듣기
  var tk = app.querySelector("#eb-trk"), T2 = d.t || [];
  if (tk && T2.length) {
    var hasQA = T2.some(function (t) { return t[2]; }), rep = ls("ebrep") === "1" && hasQA, run = 0;
    tk.style.display = "block";
    tk.innerHTML = `<div class="eb-tt"><button id="eb-tall">▶ 전체 듣기</button>${hasQA ? `<button id="eb-trep" class="${rep ? "on" : ""}">🔁 정답 반복 듣기 ${rep ? "켜짐" : "꺼짐"}</button>` : ""}<button id="eb-tstop">■ 멈춤</button></div>` +
      `<p class="eb-tip" style="margin:4px 2px 6px">${hasQA ? "문제를 누르면 그 문제만 들어요. <b>정답 반복 듣기</b>를 켜면 질문과 정답만 계속 반복해요." : "문제 묶음을 누르면 그 부분만 들어요."}</p>` +
      `<button class="eb-tog" id="eb-tog">📋 문제 골라 듣기 <span>${T2.length}문제</span><b>${ls("ebtog") === "1" ? "▲ 접기" : "▼ 펼치기"}</b></button>` +
      `<div class="eb-tch" id="eb-tch" style="display:${ls("ebtog") === "1" ? "grid" : "none"}">${T2.map(function (t, i) { return `<button data-tk="${i}">▶ ${esc(t[0])}</button>`; }).join("")}</div>`;
    tk.querySelector("#eb-tog").onclick = function () { var g = tk.querySelector("#eb-tch"), on = g.style.display === "none"; g.style.display = on ? "grid" : "none"; ls("ebtog", on ? "1" : "0"); this.querySelector("b").textContent = on ? "▲ 접기" : "▼ 펼치기"; };
    function once(a) { return new Promise(function (res) { ebPlay(m, a, res); }); }
    function gap(ms, r) { return new Promise(function (res, rej) { setTimeout(function () { r === run ? res() : rej(); }, ms); }); }
    function mark(i) { tk.querySelectorAll("[data-tk]").forEach(function (x) { var on = +x.dataset.tk === i; x.classList.toggle("on", on); x.textContent = (on ? "■ " : "▶ ") + T2[+x.dataset.tk][0]; }); if (i >= 0) { var c = tk.querySelector('[data-tk="' + i + '"]'); if (c && c.offsetParent && c.scrollIntoView) c.scrollIntoView({ block: "nearest", behavior: "smooth" }); } }
    function stopAll() { run++; EBP.stop++; stopPlay(); mark(-1); }
    function playOneTrack(i, r) {
      var t = T2[i]; mark(i);
      if (rep && t[2]) return once(A[t[2][0]]).then(function () { return gap(600, r); }).then(function () { if (r !== run) throw 0; return once(A[t[2][1]]); }).then(function () { return gap(1000, r); });
      return once(A[t[1]]).then(function () { return gap(800, r); });
    }
    function loopRep(i, r) { return playOneTrack(i, r).then(function () { if (r === run) return loopRep(i, r); }); }
    tk.querySelector("#eb-tall").onclick = function () {
      stopAll(); var r = run, i = 0;
      (function nx() { if (r !== run || i >= T2.length) { if (r === run) mark(-1); return; } var k = i++; playOneTrack(k, r).then(function () { if (rep && T2[k][2]) return playOneTrack(k, r); }).then(nx).catch(function () { }); })();
    };
    tk.querySelector("#eb-tstop").onclick = stopAll;
    var rb = tk.querySelector("#eb-trep"); if (rb) rb.onclick = function () { rep = !rep; ls("ebrep", rep ? "1" : "0"); rb.classList.toggle("on", rep); rb.textContent = "🔁 정답 반복 듣기 " + (rep ? "켜짐" : "꺼짐"); };
    tk.querySelectorAll("[data-tk]").forEach(function (b) {
      b.onclick = function () {
        var i = +b.dataset.tk, on = b.classList.contains("on"); stopAll(); if (on) return;
        var r = run; (rep && T2[i][2] ? loopRep(i, r) : playOneTrack(i, r)).then(function () { if (r === run) mark(-1); }).catch(function () { });
      };
    });
  }
  ov.onclick = function (e) {
    var el = e.target.closest(".eb-w"); if (!el) return;
    var w = W[+el.dataset.i], g = w[4] >= 0 ? G[w[4]] : null, a = w[5] >= 0 ? A[w[5]] : null;
    ebHide();
    el.classList.add("on");
    if (g && g[4]) ov.querySelectorAll(".eb-w").forEach(function (x) { var y = W[+x.dataset.i]; if (y[4] === w[4]) x.classList.add("on"); });
    if (a) ov.querySelectorAll(".eb-w").forEach(function (x) { if (W[+x.dataset.i][5] === w[5] && !x.classList.contains("on")) x.classList.add("play"); });
    var word = w[6] || (g && g[3]) || "";
    var pop = document.createElement("div"); pop.className = "eb-pop";
    pop.innerHTML = `<button class="x" aria-label="닫기">×</button>` +
      (g ? `<div><span class="wd">${esc(g[4] ? g[3] : word)}</span><span class="ps">${esc(g[0])}</span>${g[2] ? `<span class="bs">원형 ${esc(g[2])}</span>` : ""}</div><div class="mn">${esc(g[1])}</div>` : `<div><span class="wd">${esc(word)}</span></div>`) +
      (a ? `<div class="pl"><button data-p="1">▶ 이 문장 다시 듣기</button><button class="g" data-p="0">■ 멈춤</button></div>` : "");
    app.appendChild(pop);
    pop.querySelector(".x").onclick = function () { ebHide(); stopPlay(); EBP.stop++; };
    if (a) {
      ebPlay(m, a);
      pop.querySelector('[data-p="1"]').onclick = function () { ebPlay(m, a); };
      pop.querySelector('[data-p="0"]').onclick = function () { stopPlay(); EBP.stop++; };
    }
  };
}
// 이 쪽 문제 풀기 → 정답 매기기 → 정답·해설
function ebQuiz(id, n, d) {
  var box = app.querySelector("#eb-qbox"), Q = d.q || []; if (!box || !Q.length) return;
  var key = "ebq:" + id + ":" + n, st; try { st = JSON.parse(ls(key) || "{}"); } catch (e) { st = {}; } st.p = st.p || {};
  var LT = "ABCD";
  function save() { ls(key, JSON.stringify(st)); }
  function draw() {
    var ok = 0, done = 0;
    Q.forEach(function (q, i) { var p = st.p[i]; if (p != null) { done++; if (p === q.a) ok++; } });
    box.innerHTML = `<div class="card eb-qz"><h3>📝 이 쪽 문제 풀기 · ${Q.length}문항</h3><p class="eb-tip" style="margin:0 0 6px">${st.g ? "정답을 맞춰 봤어요. 해설 버튼을 누르면 정답 해설이 나와요." : "문제를 풀고 답을 고른 뒤 맨 아래 <b>정답 매기기</b>를 누르세요."}</p>` +
      Q.map(function (q, i) {
        var p = st.p[i], g = st.g;
        return `<div class="eb-qr"><div class="hd"><span class="no">${esc(q.n)}</span><span class="ch">${LT.slice(0, q.k || 4).split("").map(function (L, j) {
          var c = g ? (j === q.a ? "ok" : (p === j ? "bad" : "")) : (p === j ? "on" : "");
          return `<button data-qi="${i}" data-qj="${j}" class="${c}">${L}</button>`; }).join("")}</span>` +
          (g ? `<span class="rs ${p === q.a ? "o" : "x"}">${p == null ? "안 풂 · 정답 " + LT[q.a] : p === q.a ? "✔ 정답" : "✘ 정답 " + LT[q.a]}</span>${q.ex || q.tr ? `<button class="exb" data-qx="${i}">해설</button>` : ""}` : "") +
          `</div><div class="ex" id="eb-x${i}" style="display:none">${esc(q.ex || "")}${q.tr ? "\n\n해석  " + esc(q.tr) : ""}</div></div>`;
      }).join("") +
      (st.g ? `<div class="eb-score">${Q.length}문항 중 ${ok}개 정답</div><div style="display:grid;gap:8px;margin-top:10px"><button class="btn ghost" id="eb-qre">다시 풀기</button></div>`
        : `<div style="display:grid;gap:8px;margin-top:12px"><button class="btn" id="eb-qgo">정답 매기기 (${done} / ${Q.length} 풂)</button></div>`) + `</div>`;
    box.querySelectorAll("[data-qi]").forEach(function (b) { b.onclick = function () { if (st.g) return; var i = +b.dataset.qi, j = +b.dataset.qj; st.p[i] = st.p[i] === j ? null : j; save(); draw(); }; });
    box.querySelectorAll("[data-qx]").forEach(function (b) { b.onclick = function () { var x = box.querySelector("#eb-x" + b.dataset.qx); x.style.display = x.style.display === "none" ? "block" : "none"; }; });
    var go2 = box.querySelector("#eb-qgo"); if (go2) go2.onclick = function () { if (done < Q.length && !confirm("아직 안 푼 문제가 " + (Q.length - done) + "개 있어요. 정답을 매길까요?")) return; st.g = 1; save(); draw(); };
    var re = box.querySelector("#eb-qre"); if (re) re.onclick = function () { st = { p: {} }; save(); draw(); };
  }
  draw();
}
function lecturesOf(sec) {
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
// 1) 기능 함수 (tblec.js가 같은 앵커를 다시 남겨 두므로 그 뒤에 붙는다)
["function lecturesOf(sec) {\n", FN + "\n"],
// 4) 학습실 고르는 첫 화면(LC·RC 선택)에 교재 전자책
["    ${recBox()}", "    ${ebRoomBox()}${recBox()}"],
// 5) 주소 연결
["  if (h[0] === \"pick\") return viewPick();\n", "  if (h[0] === \"pick\") return viewPick();\n  if (h[0] === \"eb\" && h[1] === \"all\") { if (h[2] && allowedSeries().indexOf(+h[2]) >= 0) ls(\"ser\", h[2]); return viewEb(true); }\n  if (h[0] === \"eb\" && h[1]) return viewEbPage(h[1], +h[2] || 1);\n  if (h[0] === \"eb\") return viewEb();\n"]
]);
})();
