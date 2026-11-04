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
  return fetch(EB_BASE + id + "/meta.json?v=" + (window.MKST_EB_VER || 1) + "psG").then(function (r) { if (!r.ok) throw new Error("meta"); return r.json(); }).then(function (m) { EB.meta[id] = m; return m; });
}
function ebPage(id, n) {
  var k = id + ":" + n;
  if (EB.page[k]) return Promise.resolve(EB.page[k]);
  return fetch(EB_BASE + id + "/p/" + n + ".json?v=" + (window.MKST_EB_VER || 1) + "psG").then(function (r) { return r.ok ? r.json() : { w: [], g: [], a: [], t: [] }; }).catch(function () { return { w: [], g: [], a: [], t: [] }; }).then(function (d) { EB.page[k] = d; return d; });
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
.mkst .eb-ft{position:absolute;z-index:3;border:0;border-radius:14px;padding:12px 18px;background:#E95721;color:#fff;font-weight:900;font-size:clamp(13px,2.2vw,17px);box-shadow:0 6px 16px rgba(233,87,33,.3);white-space:nowrap}
.mkst .eb-ft.on{background:#172844}.mkst .eb-ft.in{position:static;margin:0 6px 6px 0}
.mkst .eb-pg{container-type:inline-size}
.mkst .eb-qo{position:absolute;z-index:4;display:flex;gap:4%;transform:translateY(-6%)}
.mkst .eb-qo button{flex:1;aspect-ratio:1;min-width:0;padding:0;border:1.5px solid #5B2A86;border-radius:50%;background:rgba(255,255,255,.92);color:#5B2A86;font-weight:900;font-size:max(9px,1.15cqw);line-height:1;box-shadow:0 1px 4px rgba(91,42,134,.25)}
.mkst .eb-qc{position:absolute;z-index:4;transform:translate(-50%,-50%);aspect-ratio:1;padding:0;border:1.5px solid rgba(91,42,134,.55);border-radius:50%;background:rgba(255,255,255,.01);color:transparent;font-weight:900;font-size:max(7px,.9cqw);line-height:1}
.mkst .eb-qc.on{background:#5B2A86;border-color:#5B2A86;color:#fff}
.mkst .eb-qc.ok{background:#1E8E5A;border-color:#1E8E5A;color:#fff}
.mkst .eb-qc.bad{background:#D2453B;border-color:#D2453B;color:#fff}
.mkst .eb-qo .lb{flex:0 0 auto;align-self:center;font-weight:900;color:#5B2A86;font-size:max(9px,1.1cqw);margin-right:2%;white-space:nowrap}
.mkst .eb-qo.lbd{background:rgba(247,243,252,.95);border:1px solid #D9C8EE;border-radius:999px;padding:.3% .6%}
.mkst .eb-qo button.on{background:#5B2A86;color:#fff}
.mkst .eb-qo button.ok{background:#1E8E5A;border-color:#1E8E5A;color:#fff}
.mkst .eb-qo button.bad{background:#D2453B;border-color:#D2453B;color:#fff}
.mkst .eb-pop .sv{margin-left:auto}.mkst .eb-pop .sv.on{background:#FFE9A8 !important;color:#7A5200 !important;border-color:#E8B500 !important}
.mkst .eb-camf{position:fixed;left:14px;bottom:calc(96px + env(safe-area-inset-bottom));z-index:2147482980;width:62px;height:62px;border-radius:50%;border:2px solid #fff;background:#E95721;color:#fff;font-size:24px;line-height:1;box-shadow:0 8px 22px rgba(233,87,33,.45);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0}
.mkst .eb-camf small{font-size:11px;font-weight:900;margin-top:2px}
.mkst .eb-toast{position:fixed;left:50%;top:calc(70px + env(safe-area-inset-top));transform:translateX(-50%);z-index:2147483001;background:#172844;color:#fff;border-radius:14px;padding:12px 16px;font-weight:800;font-size:14.5px;box-shadow:0 10px 26px rgba(23,40,68,.3);transition:opacity .4s}
.mkst .eb-toast.out{opacity:0}
.mkst .eb-flash{position:absolute;inset:0;background:#fff;opacity:.7;pointer-events:none;animation:ebfl .45s ease-out forwards;z-index:9}
@keyframes ebfl{to{opacity:0}}
.mkst .eb-nd{padding:14px}.mkst .eb-ndh{display:flex;align-items:baseline;gap:10px}.mkst .eb-ndh b{font-size:18px;color:#172844}.mkst .eb-ndh small{color:#33404F;font-weight:700}
.mkst .eb-ni{display:grid;grid-template-columns:42% 1fr;gap:10px;border-top:1px solid var(--line);padding:10px 0}
.mkst .eb-ni img{width:100%;border:1px solid var(--line);border-radius:10px;background:#fff}
.mkst .eb-nm small{display:block;font-weight:800;color:#5B2A86;margin-bottom:4px}
.mkst .eb-nm textarea{width:100%;min-height:72px;border:1px solid var(--line);border-radius:10px;padding:8px;font-size:14.5px;font-family:inherit;margin-bottom:6px;box-sizing:border-box}
.mkst .eb-nv{border-top:1px solid var(--line);padding-top:10px;font-weight:800;color:#7A5200;font-size:14.5px;line-height:1.6}
.mkst .eb-vt{width:100%;border-collapse:collapse;font-size:14.5px}
.mkst .eb-vt td{border-top:1px solid var(--line);padding:9px 6px;vertical-align:top;color:#172844}
.mkst .eb-vt td.w{font-family:Georgia,serif;font-size:17px;font-weight:700;white-space:nowrap}
.mkst .eb-vt td.s{font-size:12.5px;color:#33404F;white-space:nowrap}
.mkst .eb-vt button{border:1px solid var(--line);background:#fff;border-radius:8px;padding:4px 8px;font-size:13px;color:#D2453B}
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
      `<button class="row" data-go="#/eb/note" style="border:2px solid #E95721;background:#FFF4EC"><span class="pill" style="background:#E95721;color:#fff">필기</span><span class="t"><b>📒 필기 노트</b><small>쪽 위 📸 버튼으로 캡처 → 날짜별로 모아 예쁜 수업 필기 PDF로</small></span>›</button>` +
      `<button class="row" data-go="#/eb/voc" style="border:2px solid #E8B500;background:#FFFBEA"><span class="pill" style="background:#E8B500;color:#fff">단어</span><span class="t"><b>⭐ 내 단어장 · ${ebVoc().length}개</b><small>모르는 단어를 눌러 ☆ 저장 → 모아서 PDF로 저장·보내기</small></span>›</button>` +
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
      `<div class="eb-bar"><button data-ebn="${n - 1}" ${n <= 1 ? "disabled" : ""}>◀</button><select id="eb-sel">${opts.map(function (i) { return `<option value="${i}" ${i === n ? "selected" : ""}>${i} / ${m.n}쪽</option>`; }).join("")}</select><button data-ebn="${n + 1}" ${n >= m.n ? "disabled" : ""}>▶</button><button id="eb-zo">－</button><button id="eb-zi">＋</button><button id="eb-cap" title="화면 캡처 → 필기 노트" style="background:#FFF4EC;border-color:#E95721">📸</button></div>
      <div id="eb-trk" class="eb-trk" style="display:none"></div>
      <div class="eb-scroll" id="eb-sc"><div class="eb-pg" id="eb-pg" style="width:${z * 100}%"><img id="eb-img" alt="${n}쪽" src="${EB_BASE + id}/i/${n}.webp?v=${m.v || 1}"><div id="eb-ov"></div></div></div>
      <div id="eb-psbox"></div>
      <div id="eb-qbox"></div>
      <div class="eb-nav"><button class="btn ghost" data-ebn="${n - 1}" ${n <= 1 ? "disabled" : ""}>◀ 이전 쪽</button><button class="btn navy" data-ebn="${n + 1}" ${n >= m.n ? "disabled" : ""}>다음 쪽 ▶</button></div>
      <div style="display:grid;gap:8px;margin-top:8px"><button class="btn ghost" data-go="#/eb/note">📒 필기 노트 (캡처 모음) · 오늘 필기 PDF</button><button class="btn ghost" data-go="#/eb/voc">⭐ 내 단어장 (${ebVoc().length}개) · PDF로 보내기</button><button class="btn ghost" id="eb-pdf" data-ebook="${id}" data-cur="${n}">📄 쪽 골라 PDF로 저장</button><button class="btn ghost" data-go="#/eb${ls("eball") === "1" ? "/all" : ""}">목차로</button></div>
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
    app.querySelector("#eb-cap").onclick = function () { ebCapture(bk, n, sc, pg); };
    ebCamFloat(function () { ebCapture(bk, n, sc, pg); });
    EB.cur = { nm: bk.nm, n: n, id: id };
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
// 화면을 두 손가락으로 확대해도 📸 버튼이 보이는 화면 왼쪽 아래에 따라옴
function ebCamFloat(fn) {
  var old = document.querySelector(".mkst .eb-camf"); if (old) old.remove();
  var b = document.createElement("button"); b.className = "eb-camf"; b.innerHTML = "📸<small>캡처</small>"; b.onclick = fn;
  (document.querySelector(".mkst") || document.body).appendChild(b);
  var V = window.visualViewport;
  function place() {
    if (!b.isConnected || !/^#\/eb\/b/.test(location.hash)) { b.remove(); if (V) { V.removeEventListener("resize", place); V.removeEventListener("scroll", place); } return; }
    var sc = V ? V.scale || 1 : 1;
    if (sc <= 1.01) { b.style.transform = ""; b.style.left = ""; b.style.top = ""; b.style.bottom = ""; return; }
    b.style.left = "0"; b.style.top = "0"; b.style.bottom = "auto"; b.style.transformOrigin = "0 0";
    var x = V.offsetLeft + 14 / sc, y = V.offsetTop + V.height - (b.offsetHeight + 96) / sc;
    b.style.transform = "translate(" + x + "px," + y + "px) scale(" + 1 / sc + ")";
  }
  if (V) { V.addEventListener("resize", place); V.addEventListener("scroll", place); }
  window.addEventListener("hashchange", function h() { if (!/^#\/eb\/b/.test(location.hash)) { b.remove(); window.removeEventListener("hashchange", h); } });
  place();
}
function ebPopFollow(pop) {
  var V = window.visualViewport; if (!V) return;
  function place() {
    if (!pop.isConnected) { V.removeEventListener("resize", place); V.removeEventListener("scroll", place); return; }
    var sc = V.scale || 1;
    if (sc <= 1.01) { pop.style.cssText = ""; return; }
    var w = Math.min(560, V.width * sc - 20);
    pop.style.left = "0"; pop.style.top = "0"; pop.style.bottom = "auto"; pop.style.width = w + "px"; pop.style.transformOrigin = "0 0";
    var h = pop.offsetHeight;
    var x = V.offsetLeft + (V.width - w / sc) / 2, y = V.offsetTop + V.height - (h + 12) / sc;
    pop.style.transform = "translate(" + x + "px," + y + "px) scale(" + 1 / sc + ")";
  }
  V.addEventListener("resize", place); V.addEventListener("scroll", place); place();
}
function ebHide() { var p = document.querySelector(".mkst .eb-pop"); if (p) p.remove(); document.querySelectorAll(".mkst .eb-ft.on").forEach(function (x) { x.classList.remove("on"); x.textContent = x.textContent.replace(/^■ /, "▶ ").replace(/ 멈춤$/, ""); }); app.querySelectorAll(".eb-w.on,.eb-w.play").forEach(function (x) { x.classList.remove("on"); x.classList.remove("play"); }); }
function ebDraw(m, d) {
  var ov = app.querySelector("#eb-ov"); if (!ov) return;
  var W = d.w || [], G = d.g || [], A = d.a || [];
  ov.innerHTML = W.map(function (w, i) {
    return `<span class="eb-w${w[5] >= 0 ? " au" : ""}" data-i="${i}" style="left:${w[0] * 100}%;top:${w[1] * 100}%;width:${w[2] * 100}%;height:${w[3] * 100}%"></span>`;
  }).join("");
  // 대화·담화 스크립트 쪽: 단마다 전체 듣기 (쪽 아래 빈 곳)
  (d.ft || []).forEach(function (f, k) {
    var b = document.createElement("button"); b.className = "eb-ft"; b.textContent = "▶ " + f[0];
    if (f[3] >= 0) { b.style.left = f[2] * 100 + "%"; b.style.top = f[3] * 100 + "%"; ov.appendChild(b); }
    else { var tk0 = app.querySelector("#eb-trk"); if (!tk0) return; tk0.style.display = "block"; b.classList.add("in"); tk0.appendChild(b); }
    b.onclick = function (e) {
      e.stopPropagation(); var on = b.classList.contains("on");
      app.querySelectorAll(".eb-ft.on").forEach(function (x) { x.classList.remove("on"); x.textContent = "▶ " + d.ft[+x.dataset.k][0]; });
      EBP.stop++; stopPlay(); ebHide(); if (on) return;
      b.classList.add("on"); b.textContent = "■ " + f[0] + " 멈춤";
      ebPlay(m, A[f[1]], function () { b.classList.remove("on"); b.textContent = "▶ " + f[0]; });
    };
    b.dataset.k = k;
  });
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
      `<div class="pl">${a ? `<button data-p="1">▶ 이 문장 다시 듣기</button><button class="g" data-p="0">■ 멈춤</button>` : ""}${g ? `<button class="g sv" data-sv="1">☆ 단어장 저장</button>` : ""}</div>`;
    app.appendChild(pop); ebPopFollow(pop);
    var vw = g ? { w: g[4] ? (/^(동사\(|5형식)/.test(g[0]) ? g[3] : (g[2] || g[3])) : (w[6] || g[3]), ps: g[0], mn: g[1], bs: g[2] || "", b: (EB.cur || {}).nm || "", p: (EB.cur || {}).n || 0 } : null;
    var svb = pop.querySelector("[data-sv]");
    function svDraw() { var on = ebVocHas(vw); svb.classList.toggle("on", on); svb.textContent = on ? "★ 저장됨 (단어장)" : "☆ 단어장 저장"; }
    if (svb) { svDraw(); svb.onclick = function () { ebVocToggle(vw); svDraw(); }; }
    pop.querySelector(".x").onclick = function () { ebHide(); stopPlay(); EBP.stop++; };
    if (a) {
      ebPlay(m, a);
      pop.querySelector('[data-p="1"]').onclick = function () { ebPlay(m, a); };
      pop.querySelector('[data-p="0"]').onclick = function () { stopPlay(); EBP.stop++; };
    }
  };
}
// ---------- 필기 노트: 화면 캡처 (이 기기 IndexedDB) ----------
function ebDB() {
  return new Promise(function (res, rej) {
    try { var q = indexedDB.open("mkst-ebnote", 1); q.onupgradeneeded = function () { q.result.createObjectStore("n", { keyPath: "id" }); }; q.onsuccess = function () { res(q.result); }; q.onerror = function () { rej(q.error); }; } catch (e) { rej(e); }
  });
}
function ebNotes() { return ebDB().then(function (db) { return new Promise(function (res) { var r = db.transaction("n").objectStore("n").getAll(); r.onsuccess = function () { res((r.result || []).sort(function (a, b) { return a.t - b.t; })); }; r.onerror = function () { res([]); }; }); }).catch(function () { return []; }); }
function ebNotePut(o) { return ebDB().then(function (db) { return new Promise(function (res) { var tx = db.transaction("n", "readwrite"); tx.objectStore("n").put(o); tx.oncomplete = res; tx.onerror = res; }); }); }
function ebNoteDel(id) { return ebDB().then(function (db) { return new Promise(function (res) { var tx = db.transaction("n", "readwrite"); tx.objectStore("n").delete(id); tx.oncomplete = res; tx.onerror = res; }); }); }
function ebDay(t) { var d = new Date(t); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function ebToast(t) { var e = document.createElement("div"); e.className = "eb-toast"; e.innerHTML = t; (document.querySelector(".mkst") || document.body).appendChild(e); setTimeout(function () { e.classList.add("out"); }, 2200); setTimeout(function () { e.remove(); }, 2700); }
// 지금 보이는 부분(확대했으면 확대한 부분)을 그대로 잘라 저장
function ebCapture(bk, n, sc, pg) {
  var img = app.querySelector("#eb-img"); if (!img || !img.naturalWidth) return;
  var W = pg.offsetWidth, H = pg.offsetHeight, k = img.naturalWidth / W;
  var vr = sc.getBoundingClientRect(), V = window.visualViewport;
  var vt = V ? V.offsetTop : 0, vl = V ? V.offsetLeft : 0, vh = V ? V.height : window.innerHeight, vw = V ? V.width : window.innerWidth;
  var top = Math.max(vr.top, vt), bot = Math.min(vr.bottom, vt + vh), lf = Math.max(vr.left, vl), rt = Math.min(vr.right, vl + vw);
  var y0 = sc.scrollTop + Math.max(0, top - vr.top), y1 = sc.scrollTop + Math.max(0, bot - vr.top);
  var x0 = sc.scrollLeft + Math.max(0, lf - vr.left), x1 = sc.scrollLeft + Math.max(0, Math.min(sc.clientWidth, rt - vr.left));
  y0 = Math.max(0, Math.min(H, y0)); y1 = Math.max(y0 + 20, Math.min(H, y1)); x1 = Math.min(W, x1);
  var cw = Math.round((x1 - x0) * k), ch = Math.round((y1 - y0) * k), sc2 = Math.min(1, 1600 / cw);
  var cv = document.createElement("canvas"); cv.width = Math.round(cw * sc2); cv.height = Math.round(ch * sc2);
  var x = cv.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, cv.width, cv.height);
  x.drawImage(img, x0 * k, y0 * k, cw, ch, 0, 0, cv.width, cv.height);
  // 지금 표시 중인 단어(주황 칸)도 같이 남김
  app.querySelectorAll(".eb-w.on").forEach(function (e) { var r = e.getBoundingClientRect(), pr = pg.getBoundingClientRect(); var ex = (r.left - pr.left - x0) * k * sc2, ey = (r.top - pr.top - y0) * k * sc2; x.fillStyle = "rgba(255,145,60,.35)"; x.fillRect(ex, ey, r.width * k * sc2, r.height * k * sc2); });
  var flash = document.createElement("div"); flash.className = "eb-flash"; sc.appendChild(flash); setTimeout(function () { flash.remove(); }, 450);
  var o = { id: Date.now() + "-" + Math.random().toString(36).slice(2, 6), t: Date.now(), b: bk.nm, bid: bk.id, p: n, img: cv.toDataURL("image/jpeg", 0.86), w: cv.width, h: cv.height, memo: "" };
  ebNotePut(o).then(function () { ebToast('📸 필기 노트에 저장했어요 · <a href="#/eb/note" style="color:#FFD2B8;font-weight:900">필기 노트 보기</a>'); }).catch(function () { alert("이 기기에서는 캡처를 저장할 수 없어요."); });
}
function viewEbNote() {
  ebStyle(); render(topbar("필기 노트") + '<div class="empty">불러오는 중…</div>'); bindCommon();
  ebNotes().then(function (L) {
    var V = ebVoc(), days = {};
    L.forEach(function (o) { (days[ebDay(o.t)] = days[ebDay(o.t)] || { n: [], v: [] }).n.push(o); });
    V.forEach(function (v) { if (v.t) (days[ebDay(v.t)] = days[ebDay(v.t)] || { n: [], v: [] }).v.push(v); });
    var keys = Object.keys(days).sort().reverse();
    render(topbar("필기 노트") +
      `<div class="card hero"><span class="kicker">교재 전자책 · 당일 수업 필기</span><h1>📒 필기 노트</h1><p>교재 쪽 위 <b>📸</b> 버튼을 누르면 지금 보이는 화면이 여기에 저장돼요. 날짜마다 그날 캡처와 그날 저장한 단어를 묶어 <b>예쁘게 꾸민 수업 필기 PDF</b>로 만들어 줘요.</p></div>` +
      (keys.length ? keys.map(function (k) {
        var D = days[k], dt = new Date(k + "T00:00:00");
        return `<div class="card eb-nd"><div class="eb-ndh"><b>${dt.getMonth() + 1}월 ${dt.getDate()}일 (${"일월화수목금토"[dt.getDay()]})</b><small>캡처 ${D.n.length}장 · 단어 ${D.v.length}개</small></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0 10px"><button class="btn" data-np="${k}" data-sh="1">📤 이 날 필기 PDF 보내기</button><button class="btn ghost" data-np="${k}">📄 PDF 저장</button></div>
          ${D.n.map(function (o) { return `<div class="eb-ni"><img src="${o.img}" alt=""><div class="eb-nm"><small>${esc(o.b)} · ${o.p}쪽 · ${new Date(o.t).toTimeString().slice(0, 5)}</small><textarea data-nm="${o.id}" placeholder="메모 (선생님 설명, 외울 것…)">${esc(o.memo || "")}</textarea><div style="display:flex;gap:6px"><button class="exb" data-ngo="#/eb/${o.bid}/${o.p}">쪽 열기</button><button class="exb" data-nd="${o.id}" style="color:#D2453B">삭제</button></div></div></div>`; }).join("")}
          ${D.v.length ? `<div class="eb-nv">⭐ ${D.v.map(function (v) { return esc(v.w); }).join(" · ")}</div>` : ""}</div>`;
      }).join("") : `<div class="empty">아직 캡처가 없어요. 교재 쪽에서 📸 버튼을 눌러 보세요.</div>`) +
      `<div style="display:grid;gap:8px;margin-top:10px"><button class="btn ghost" data-go="#/eb/voc">⭐ 내 단어장</button><button class="btn ghost" data-go="#/eb${ls("eball") === "1" ? "/all" : ""}">교재 목차로</button></div>`);
    bindCommon();
    app.querySelectorAll("[data-ngo]").forEach(function (b) { b.onclick = function () { go(b.dataset.ngo); }; });
    app.querySelectorAll("[data-nd]").forEach(function (b) { b.onclick = function () { if (confirm("이 캡처를 지울까요?")) ebNoteDel(b.dataset.nd).then(viewEbNote); }; });
    app.querySelectorAll("[data-nm]").forEach(function (t) { t.onchange = function () { var o = L.filter(function (x) { return x.id === t.dataset.nm; })[0]; if (o) { o.memo = t.value; ebNotePut(o); } }; });
    app.querySelectorAll("[data-np]").forEach(function (b) { b.onclick = function () { var D = days[b.dataset.np]; app.querySelectorAll("[data-nm]").forEach(function (t) { D.n.forEach(function (o) { if (o.id === t.dataset.nm) o.memo = t.value; }); }); ebNotePdf(b.dataset.np, D.n, D.v, !!b.dataset.sh, b); }; });
  });
}
function ebLoadImg(src) { return new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src; }); }
function ebRR(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
// 당일 수업 필기 PDF — 표지 띠·날짜·캡처 카드·메모 말풍선·오늘의 단어 표를 자동으로 꾸밈
function ebNotePdf(day, N, V, share, btn) {
  var old = btn.textContent; btn.disabled = true; btn.textContent = "꾸미는 중…";
  Promise.all([ebLoadJsPDF()].concat(N.map(function (o) { return ebLoadImg(o.img); }))).then(function (R) {
    var jsPDF = R[0], IM = R.slice(1), PW = 1240, PH = 1754, M = 70, F = "'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif";
    var dt = new Date(day + "T00:00:00"), title = dt.getFullYear() + "년 " + (dt.getMonth() + 1) + "월 " + dt.getDate() + "일 (" + "일월화수목금토"[dt.getDay()] + ")";
    var pages = [], cv, x, y, pno = 0, books = {};
    N.forEach(function (o) { books[o.b] = (books[o.b] || []).concat(o.p); });
    function wrap(t, w, font) { x.font = font; var out = [], cur = ""; String(t || "").split("").forEach(function (ch) { if (ch === "\n") { out.push(cur); cur = ""; return; } if (x.measureText(cur + ch).width > w && cur) { out.push(cur); cur = ch.trim() ? ch : ""; } else cur += ch; }); if (cur) out.push(cur); return out; }
    function newPage(first) {
      if (cv) foot();
      cv = document.createElement("canvas"); cv.width = PW; cv.height = PH; x = cv.getContext("2d"); pno++;
      x.fillStyle = "#FFFDF8"; x.fillRect(0, 0, PW, PH);
      x.strokeStyle = "#EEE6D8"; x.lineWidth = 1; for (var gy = 40; gy < PH; gy += 40) { x.beginPath(); x.moveTo(0, gy); x.lineTo(PW, gy); x.stroke(); }   // 노트 줄
      x.fillStyle = "#F2B8A0"; x.fillRect(M - 26, 0, 3, PH);   // 노트 여백선
      if (first) {
        var g = x.createLinearGradient(0, 0, PW, 0); g.addColorStop(0, "#172844"); g.addColorStop(1, "#2B4A7A");
        x.fillStyle = g; x.fillRect(0, 0, PW, 250);
        x.fillStyle = "#E95721"; x.fillRect(0, 250, PW, 10);
        x.fillStyle = "#FF9A6B"; x.font = "800 26px " + F; x.fillText("MAKE TOEIC · 김정수 메이크토익", M, 72);
        x.fillStyle = "#fff"; x.font = "900 58px " + F; x.fillText("오늘의 수업 필기", M, 145);
        x.font = "700 30px " + F; x.fillStyle = "#DCE5F2"; x.fillText(title, M, 200);
        x.textAlign = "right"; x.font = "800 26px " + F; x.fillStyle = "#fff";
        x.fillText("📸 " + N.length + "장  ·  ⭐ 단어 " + V.length + "개", PW - M, 200); x.textAlign = "left";
        y = 300;
        var bl = Object.keys(books); if (bl.length) {
          x.font = "700 24px " + F; var tx = "오늘 본 쪽  " + bl.map(function (b) { return b + " " + books[b].filter(function (v, i, a) { return a.indexOf(v) === i; }).join("·") + "쪽"; }).join("  /  ");
          wrap(tx, PW - 2 * M - 40, "700 24px " + F).forEach(function (t) { x.fillStyle = "#5B2A86"; x.fillText(t, M + 20, y); y += 34; }); y += 16;
        }
      } else {
        x.fillStyle = "#172844"; x.fillRect(0, 0, PW, 70); x.fillStyle = "#fff"; x.font = "800 24px " + F; x.fillText("오늘의 수업 필기 · " + title, M, 45); y = 110;
      }
    }
    function foot() { x.fillStyle = "#9AA5B4"; x.font = "600 20px " + F; x.textAlign = "center"; x.fillText("MAKE TOEIC  ·  " + pno, PW / 2, PH - 30); x.textAlign = "left"; pages.push(cv.toDataURL("image/jpeg", 0.88)); }
    var COL = ["#E95721", "#5B2A86", "#1E8E5A", "#2B6CB0"];
    newPage(true);
    N.forEach(function (o, i) {
      var im = IM[i]; if (!im) return;
      var mw = PW - 2 * M, iw = mw - 40, ih = im.height * iw / im.width, maxH = PH - 260;
      if (ih > maxH) { ih = maxH; iw = im.width * ih / im.height; }
      var ml = o.memo ? wrap(o.memo, mw - 90, "600 26px " + F) : [], mh = ml.length ? ml.length * 36 + 40 : 0, h = ih + 110 + mh;
      if (y + h > PH - 70) {
        var av = PH - 70 - y - 110 - mh;
        if (av >= 520) { iw = iw * av / ih; ih = av; h = ih + 110 + mh; }
        else { newPage(false); if (y + h > PH - 70) { ih = PH - 70 - y - 110 - mh; iw = im.width * ih / im.height; h = ih + 110 + mh; } }
      }
      var c = COL[i % COL.length];
      x.save(); x.shadowColor = "rgba(23,40,68,.18)"; x.shadowBlur = 18; x.shadowOffsetY = 6; ebRR(x, M, y, mw, h - 20, 22); x.fillStyle = "#fff"; x.fill(); x.restore();
      x.fillStyle = c; ebRR(x, M, y, mw, 58, 22); x.fill(); x.fillRect(M, y + 30, mw, 28);
      x.fillStyle = "#fff"; x.font = "900 26px " + F; x.fillText("No." + (i + 1) + "   " + o.b + " · " + o.p + "쪽", M + 24, y + 39);
      x.textAlign = "right"; x.font = "700 22px " + F; x.fillText(new Date(o.t).toTimeString().slice(0, 5), M + mw - 24, y + 38); x.textAlign = "left";
      x.drawImage(im, M + (mw - iw) / 2, y + 74, iw, ih);
      x.strokeStyle = "#E3E8EF"; x.lineWidth = 2; x.strokeRect(M + (mw - iw) / 2, y + 74, iw, ih);
      if (ml.length) {
        var my = y + 74 + ih + 18; x.fillStyle = "#FFF6D6"; ebRR(x, M + 20, my, mw - 40, mh - 10, 16); x.fill();
        x.fillStyle = "#E8B500"; x.fillRect(M + 20, my, 8, mh - 10);
        x.fillStyle = "#3D2E00"; x.font = "600 26px " + F; ml.forEach(function (t, k) { x.fillText((k ? "" : "✎ ") + t, M + 46, my + 38 + k * 36); });
      }
      y += h + 6;
    });
    if (V.length) {
      if (y + 220 > PH - 70) newPage(false);
      x.fillStyle = "#E8B500"; ebRR(x, M, y, 300, 56, 28); x.fill(); x.fillStyle = "#fff"; x.font = "900 28px " + F; x.fillText("⭐ 오늘의 단어 " + V.length, M + 26, y + 38); y += 80;
      V.forEach(function (v, i) {
        var ml = wrap(v.ps + "  " + v.mn, PW - 2 * M - 420, "500 24px " + F), h = Math.max(1, ml.length) * 34 + 22;
        if (y + h > PH - 70) { newPage(false); }
        if (i % 2 === 0) { x.fillStyle = "#FFF8E1"; x.fillRect(M, y - 6, PW - 2 * M, h); }
        x.fillStyle = "#172844"; x.font = "700 28px Georgia,serif"; x.fillText(v.w, M + 18, y + 26);
        x.font = "500 24px " + F; ml.forEach(function (t, k) { x.fillStyle = "#172844"; x.fillText(t, M + 400, y + 25 + k * 34); });
        x.fillStyle = "#9AA5B4"; x.font = "500 18px " + F; x.textAlign = "right"; x.fillText((v.b || "") + (v.p ? " " + v.p + "쪽" : ""), PW - M - 10, y + 25); x.textAlign = "left";
        y += h;
      });
    }
    foot();
    var doc = new jsPDF({ unit: "pt", format: "a4" });
    pages.forEach(function (d, i) { if (i) doc.addPage(); doc.addImage(d, "JPEG", 0, 0, 595.28, 841.89); });
    var name = "메이크토익_수업필기_" + day + ".pdf", blob = doc.output("blob"), file = null;
    try { file = new File([blob], name, { type: "application/pdf" }); } catch (e) { }
    if (share && file && navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: "메이크토익 수업 필기 " + day }).catch(function () { });
    else { doc.save(name); if (share) alert("이 기기에서는 바로 보내기가 안 돼서 PDF 파일로 저장했어요. 저장된 파일을 카톡이나 문자로 보내 주세요."); }
  }).catch(function () { alert("PDF를 만들지 못했어요. 인터넷 연결을 확인해 주세요."); }).then(function () { btn.disabled = false; btn.textContent = old; });
}
// 내 단어장 (모든 교재 공통, 이 기기에 저장)
function ebVoc() { try { return JSON.parse(ls("ebvoc") || "[]") || []; } catch (e) { return []; } }
function ebVocKey(v) { return (v.w || "").toLowerCase() + "|" + (v.mn || ""); }
function ebVocHas(v) { if (!v) return false; var k = ebVocKey(v); return ebVoc().some(function (x) { return ebVocKey(x) === k; }); }
function ebVocToggle(v) {
  var L = ebVoc(), k = ebVocKey(v), i = -1;
  L.forEach(function (x, j) { if (ebVocKey(x) === k) i = j; });
  if (i >= 0) L.splice(i, 1); else { v.t = Date.now(); L.unshift(v); }
  ls("ebvoc", JSON.stringify(L));
}
function viewEbVoc() {
  ebStyle(); var L = ebVoc();
  render(topbar("내 단어장") +
    `<div class="card hero"><span class="kicker">교재 전자책 · 모든 교재</span><h1>⭐ 내 단어장 ${L.length}개</h1><p>교재에서 단어를 누르고 <b>☆ 단어장 저장</b>을 누르면 여기에 모여요. 다 모으면 PDF로 저장하거나 카톡·문자로 보낼 수 있어요.</p></div>` +
    (L.length ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 12px"><button class="btn" id="eb-vsend">📤 PDF 보내기</button><button class="btn ghost" id="eb-vsave">📄 PDF 저장</button></div>
      <div class="card" style="padding:6px 12px"><table class="eb-vt">${L.map(function (v, i) { return `<tr><td class="w">${esc(v.w)}</td><td><b style="color:#C2410C">${esc(v.ps)}</b> ${esc(v.mn)}${v.bs ? `<br><small style="color:#33404F">원형 ${esc(v.bs)}</small>` : ""}</td><td class="s">${esc(v.b)}<br>${v.p ? v.p + "쪽" : ""}</td><td><button data-vd="${i}">삭제</button></td></tr>`; }).join("")}</table></div>
      <div style="display:grid;gap:8px;margin-top:10px"><button class="btn ghost" id="eb-vclr">단어장 비우기</button></div>`
      : `<div class="empty">아직 저장한 단어가 없어요. 교재 쪽에서 모르는 단어를 눌러 보세요.</div>`) +
    `<div style="display:grid;gap:8px;margin-top:10px"><button class="btn ghost" data-go="#/eb${ls("eball") === "1" ? "/all" : ""}">교재 목차로</button></div>`);
  bindCommon();
  app.querySelectorAll("[data-vd]").forEach(function (b) { b.onclick = function () { var L2 = ebVoc(); L2.splice(+b.dataset.vd, 1); ls("ebvoc", JSON.stringify(L2)); viewEbVoc(); }; });
  var c = app.querySelector("#eb-vclr"); if (c) c.onclick = function () { if (confirm("저장한 단어를 모두 지울까요?")) { ls("ebvoc", "[]"); viewEbVoc(); } };
  var s1 = app.querySelector("#eb-vsave"), s2 = app.querySelector("#eb-vsend");
  if (s1) s1.onclick = function () { ebVocPdf(false, s1); };
  if (s2) s2.onclick = function () { ebVocPdf(true, s2); };
}
// 단어장 PDF: 글자를 그림(캔버스)으로 그려 A4 쪽마다 넣는다 → 한글 깨짐 없음
function ebVocPdf(share, btn) {
  var L = ebVoc(); if (!L.length) return;
  var old = btn.textContent; btn.disabled = true; btn.textContent = "PDF 만드는 중…";
  ebLoadJsPDF().then(function (jsPDF) {
    var W = 1240, H = 1754, M = 80, rows = [], cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    var x = cv.getContext("2d"), F = "'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif";
    function wrap(t, w, font) { x.font = font; var out = [], cur = ""; String(t).split("").forEach(function (ch) { if (x.measureText(cur + ch).width > w && cur) { out.push(cur); cur = ch.trim() ? ch : ""; } else cur += ch; }); if (cur) out.push(cur); return out.length ? out : [""]; }
    var C = [M, M + 70, M + 420, W - M - 210], pages = [], y = 0, doc = new jsPDF({ unit: "pt", format: "a4" });
    function head(first) {
      x.fillStyle = "#fff"; x.fillRect(0, 0, W, H);
      x.fillStyle = "#172844"; x.font = "900 40px " + F; x.fillText(first ? "메이크토익 내 단어장" : "메이크토익 내 단어장 (이어서)", M, M + 30);
      x.font = "600 22px " + F; x.fillStyle = "#33404F"; x.fillText(new Date().toLocaleDateString("ko-KR") + " · 단어 " + L.length + "개", M, M + 66);
      x.fillStyle = "#172844"; x.fillRect(M, M + 86, W - 2 * M, 44); x.fillStyle = "#fff"; x.font = "800 22px " + F;
      ["번호", "단어", "품사 · 뜻", "교재 · 쪽"].forEach(function (h, i) { x.fillText(h, C[i] + 8, M + 116); });
      y = M + 150;
    }
    function flush() { pages.push(cv.toDataURL("image/jpeg", 0.9)); }
    head(true);
    L.forEach(function (v, i) {
      var wl = wrap(v.w, 330, "700 28px Georgia,serif"), ml = wrap(v.ps + "  " + v.mn + (v.bs ? "  (원형 " + v.bs + ")" : ""), C[3] - C[2] - 20, "500 24px " + F), sl = wrap((v.b || "") + (v.p ? " " + v.p + "쪽" : ""), 190, "500 20px " + F);
      var h = Math.max(wl.length * 36, ml.length * 34, sl.length * 28) + 22;
      if (y + h > H - M) { flush(); head(false); }
      if (i % 2) { x.fillStyle = "#F4F6FA"; x.fillRect(M, y - 4, W - 2 * M, h); }
      x.fillStyle = "#33404F"; x.font = "700 22px " + F; x.fillText(String(i + 1), C[0] + 8, y + 28);
      x.fillStyle = "#172844"; x.font = "700 28px Georgia,serif"; wl.forEach(function (t, k) { x.fillText(t, C[1] + 8, y + 30 + k * 36); });
      x.font = "500 24px " + F; ml.forEach(function (t, k) { x.fillStyle = "#172844"; x.fillText(t, C[2] + 8, y + 29 + k * 34); });
      x.fillStyle = "#33404F"; x.font = "500 20px " + F; sl.forEach(function (t, k) { x.fillText(t, C[3] + 8, y + 27 + k * 28); });
      x.fillStyle = "#D5DCE6"; x.fillRect(M, y + h - 5, W - 2 * M, 1.5);
      y += h;
    });
    flush();
    pages.forEach(function (d, i) { if (i) doc.addPage(); doc.addImage(d, "JPEG", 0, 0, 595.28, 841.89); });
    var name = "메이크토익_내단어장_" + new Date().toISOString().slice(0, 10) + ".pdf";
    var blob = doc.output("blob"), file = null;
    try { file = new File([blob], name, { type: "application/pdf" }); } catch (e) { }
    if (share && file && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: "메이크토익 내 단어장" }).catch(function () { });
    } else {
      doc.save(name);
      if (share) alert("이 기기에서는 바로 보내기가 안 돼서 PDF 파일로 저장했어요. 저장된 파일을 카톡이나 문자로 보내 주세요.");
    }
  }).catch(function () { alert("PDF를 만들지 못했어요. 인터넷 연결을 확인해 주세요."); }).then(function () { btn.disabled = false; btn.textContent = old; });
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
    // 쪽 위 문제 옆 정답 칸 (같은 답과 연결)
    var ov = app.querySelector("#eb-ov"), QP = d.qp || [];
    if (ov) {
      ov.querySelectorAll(".eb-qo,.eb-qc").forEach(function (x) { x.remove(); });
      Q.forEach(function (q, i) {
        var P = QP[i]; if (!P) return;
        var k = q.k || 4, p = st.p[i], g = st.g, el;
        if (P.c) {
          P.c.forEach(function (c, j) {
            var b = document.createElement("button"), cls = g ? (j === q.a ? "ok" : (p === j ? "bad" : "")) : (p === j ? "on" : "");
            b.className = "eb-qc " + cls; b.textContent = LT[j];
            b.style.left = c[0] * 100 + "%"; b.style.top = c[1] * 100 + "%"; b.style.width = (P.s || 0.014) * 100 + "%";
            b.onclick = function (e) { e.stopPropagation(); if (st.g) return; st.p[i] = st.p[i] === j ? null : j; save(); draw(); };
            ov.appendChild(b);
          });
          return;
        }
        el = document.createElement("div"); el.className = "eb-qo";
        el.style.left = P[0] * 100 + "%"; el.style.top = P[1] * 100 + "%"; el.style.width = Math.min(k * 3.1 + (P[3] ? 7 : 0), (P[2] - P[0] - 0.006) * 100) + "%";
        if (P[3]) el.classList.add("lbd");
        el.innerHTML = (P[3] ? `<span class="lb">${esc(q.n)}</span>` : "") + LT.slice(0, k).split("").map(function (L, j) {
          var c = g ? (j === q.a ? "ok" : (p === j ? "bad" : "")) : (p === j ? "on" : "");
          return `<button data-oi="${i}" data-oj="${j}" class="${c}">${L}</button>`; }).join("");
        el.onclick = function (e) {
          e.stopPropagation(); var b = e.target.closest("[data-oi]"); if (!b || st.g) return;
          var j = +b.dataset.oj; st.p[i] = st.p[i] === j ? null : j; save(); draw();
        };
        ov.appendChild(el);
      });
    }
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
["  if (h[0] === \"pick\") return viewPick();\n", "  if (h[0] === \"pick\") return viewPick();\n  if (h[0] === \"eb\" && h[1] === \"all\") { if (h[2] && allowedSeries().indexOf(+h[2]) >= 0) ls(\"ser\", h[2]); return viewEb(true); }\n  if (h[0] === \"eb\" && h[1] === \"voc\") return viewEbVoc();\n  if (h[0] === \"eb\" && h[1] === \"note\") return viewEbNote();\n  if (h[0] === \"eb\" && h[1]) return viewEbPage(h[1], +h[2] || 1);\n  if (h[0] === \"eb\") return viewEb();\n"]
]);
})();
