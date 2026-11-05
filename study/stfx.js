/* 학습실 문제 화면에 교재 전자책 기능 (2026-11-05)
   RC: 모든 단어 품사·뜻(이 문장 쓰임 1순위 + 다른 쓰임), 표현·문법 덩어리(수동태·완료·진행·사역), 관계대명사 축약·분사구문, 명령문,
       단어 누르면 문장 구조(주어·동사·목적어 + 전치사·전치사의 목적어 박스와 연결선, 색 안내), PART 5 전치사 누르면 전치사+명사 중앙선,
       ☆ 내 단어장 저장, ✏️ 필기(볼펜·연필·형광펜·지우개·줄자·글자), 📸 캡처 → 필기 노트
   LC: 스크립트·문제·보기 단어 품사·뜻, 단어 누르면 그 문장 듣기, PART 2 정답 반복(질문+정답)·질문/보기 골라 듣기,
       🎧 이 단원 전체 듣기·문제 골라 듣기·정답 반복·MP3 받기
   데이터: /study/fx/<단원id>.json (문장별 단어 뜻·구조) — 빈칸 문제는 채점 뒤에만 문장 구조를 보여 준다(정답 노출 방지). */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// 학습실 전자책 기능 — study/stfx.js
var FXT = {}, FXF = {}, FX_CSS = `
.mkst .fxr .gx{cursor:pointer;border-radius:4px}
.mkst .fxr .gw,.mkst .fxr .gx{position:relative;z-index:2}
.mkst .fxr .gph{text-decoration:underline solid #FF9A6B;text-decoration-thickness:2px;text-underline-offset:4px;background:#FFF4EC;border-radius:4px}
.mkst .fxr .gph .gw{text-decoration:none}
.mkst .fxr .on{background:#FFE3D6;color:#172844}.mkst .fxr .gph.on{background:#FFD3BC;box-shadow:0 0 0 2px #FF9A6B}
.mkst .fxr .ck{background:#FFF1C9}
.mkst .mr-line .fxr .gw{text-decoration:underline dotted #C9CFDA;text-underline-offset:4px}
.mkst .fxsv{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:1}
.mkst .fxsv svg{position:absolute;left:0;top:0;overflow:visible}
.mkst .fxsv .eb-sb{position:absolute}
.mkst .fxsv .eb-strk{position:absolute}
.mkst .fxlg{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;background:#fff;border:1.5px solid #172844;border-radius:10px;padding:6px 8px 6px 10px;font-size:13px;font-weight:900;color:#172844;margin:0 0 8px;position:relative;z-index:3}
.mkst .fxlg i{display:inline-block;width:16px;height:12px;border-radius:3px;margin-right:4px;vertical-align:-1px}
.mkst .fxlg i.s{background:rgba(31,95,214,.3);border:1.5px solid #1F5FD6}.mkst .fxlg i.v{background:rgba(224,50,43,.3);border:1.5px solid #E0322B}.mkst .fxlg i.o{background:rgba(14,159,110,.3);border:1.5px solid #0E9F6E}
.mkst .fxlg i.p{background:rgba(233,87,33,.3);border:1.5px solid #E95721}.mkst .fxlg i.q{background:rgba(142,68,173,.25);border:1.5px dashed #8E44AD}
.mkst .fxlg button{border:0;background:#EEF1F5;border-radius:50%;width:22px;height:22px;font-size:11px;padding:0;margin-left:auto}
.mkst .eb-pop .fxl{margin-top:6px;font-size:14px;font-weight:700;color:#33404F;line-height:1.45}
.mkst .eb-pop .fxl b{color:#C2410C}
.mkst .fxtip{font-size:12.5px;color:#33404F;font-weight:700;margin:6px 2px 0}
.mkst .fxp2{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.mkst .fxp2 button{border:1.5px solid #172844;background:#fff;border-radius:10px;padding:8px 11px;font-weight:900;font-size:14px;color:#172844}
.mkst .fxp2 button.on{background:#172844;color:#fff}
.mkst .fxp2 button.rep{background:#E95721;border-color:#E95721;color:#fff}
.mkst .fxp2 button.rep.on{background:#7A2A0C;border-color:#7A2A0C}
.mkst .st-ink{position:absolute;left:0;top:0;width:100%;z-index:6;pointer-events:none}
.mkst .st-ink.on{pointer-events:auto;touch-action:none;cursor:crosshair;outline:3px solid rgba(31,95,214,.35);outline-offset:-3px}
.mkst .fxhost{position:relative}
`;
function fxH(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); }
function fxStyle() { ebStyle(); if (!document.getElementById("fx-css")) { var s = document.createElement("style"); s.id = "fx-css"; s.textContent = FX_CSS; document.head.appendChild(s); } }
// 단원을 불러올 때 그 단원 문장 데이터도 같이 (없거나 늦으면 그냥 넘어감)
function fxPre(key, d) {
  if (!/^sec:/.test(key)) return d;
  var id = key.slice(4);
  if (!FXF[id]) FXF[id] = fetch("/study/fx/" + encodeURIComponent(id) + ".json?v=" + (window.MKST_BUILD || "1")).then(function (r) { return r.ok ? r.json() : null; }).then(function (F) {
    if (!F || !F.x) return;
    Object.keys(F.x).forEach(function (h) { var x = F.x[h]; x.F = F; x.h = h; FXT[h] = x; });
  }).catch(function () { });
  return Promise.race([FXF[id], new Promise(function (r) { setTimeout(r, 2500); })]).then(function () { return d; });
}
function fxOf(text) { return text ? FXT[fxH(text)] || null : null; }
function fxText(t) { var X = fxOf(t); return X ? fxGloss(t, {}, {}, [], false, X) : esc(t); }
function fxGloss(text, g, oc, ph, psg, X) {
  g = g || {}; oc = oc || {}; ph = X.ph && X.ph.length ? X.ph : (ph || []);
  var G = X.F.G, start = {}; ph.forEach(function (p) { start[p[0]] = p; });
  var parts = String(text).split(/(\s+)/), out = [], ti = -1, open = null, bl = false;
  parts.forEach(function (t) {
    if (!t) return;
    if (/^\s+$/.test(t)) { out.push(esc(t)); return; }
    ti++;
    if (psg && /^=+$/.test(t)) { out.push(esc(t)); return; }
    if (!open && start[ti] && start[ti][1] > ti) { open = start[ti]; out.push('<span class="gph" data-pm="' + esc(open[2]) + '" data-p0="' + open[0] + '" data-p1="' + open[1] + '">'); }
    if (psg && /-{2,}\d{3}-{2,}/.test(t)) { bl = true; out.push('<span class="gx" data-ti="' + ti + '">' + esc(t) + "</span>"); }
    else if (!psg && /_{3,}|-{4,}/.test(t)) { bl = true; out.push('<span class="gx" data-ti="' + ti + '">' + blank(t) + "</span>"); }
    else {
      var gi = X.t[ti], v = gi != null && gi >= 0 ? G[gi] : null;
      if (!v) { var k = gkey(t); v = oc[ti] || g[k]; if (v && v[0] === "한정사") v = ["형용사", v[1], v[2]]; }
      out.push(v ? '<span class="gw" data-ti="' + ti + '" data-p="' + esc(v[0]) + '" data-m="' + esc(v[1]) + '" data-b="' + esc(v[2] || "") + '">' + esc(t) + "</span>" : '<span class="gx" data-ti="' + ti + '">' + esc(t) + "</span>");
    }
    if (open && ti >= open[1]) { out.push("</span>"); open = null; }
  });
  if (open) out.push("</span>");
  return '<span class="fxr" data-x="' + X.h + '"' + (bl ? ' data-bl="1"' : "") + ">" + out.join("") + "</span>";
}
// ---------- 단어 누르기 ----------
var FXS = { root: null, k: -1, pp: {} };
function fxWord(el) { return el.textContent.replace(/^[^A-Za-z0-9$%']+|[^A-Za-z0-9%']+$/g, ""); }
function fxGraded(root) { var c = root.closest(".qb") || root.closest(".twocol") || app; return !!(c.querySelector(".opt.right") || (root.closest(".twocol") || app).querySelector(".opt.right")); }
function fxSentOf(X, ti) { var sv = X.sv || []; for (var k = 0; k < sv.length; k++) if (sv[k][0].indexOf(ti) >= 0) return k; return -1; }
function fxClear() {
  document.querySelectorAll(".mkst .fxsv,.mkst .fxlg").forEach(function (x) { x.remove(); });
  document.querySelectorAll(".mkst .fxr .ck").forEach(function (x) { x.classList.remove("ck"); });
}
function fxHost(root) { var c = root.closest(".passage") || root.closest(".mr-line") || root.closest(".qb") || root.parentNode; if (getComputedStyle(c).position === "static") c.style.position = "relative"; return c; }
function fxRects(root, c, ix) {
  var E = {}; root.querySelectorAll("[data-ti]").forEach(function (e) { E[e.dataset.ti] = e; });
  var cr = c.getBoundingClientRect(), B = [];
  ix.slice().sort(function (a, b) { return a - b; }).forEach(function (i) {
    var e = E[i]; if (!e) return;
    Array.prototype.forEach.call(e.getClientRects(), function (r) {
      var x = r.left - cr.left + c.scrollLeft, y = r.top - cr.top + c.scrollTop, l = B[B.length - 1];
      if (l && Math.abs(y - l[1]) < r.height * 0.5 && x >= l[0] && x - (l[0] + l[2]) < 18) { l[2] = Math.max(l[0] + l[2], x + r.width) - l[0]; l[3] = Math.max(l[3], r.height); }
      else B.push([x, y, r.width, r.height]);
    });
  });
  return B;
}
function fxBox(L, b, cls, pad) { var e = document.createElement("div"); e.className = "eb-sb " + cls; pad = pad || 2; e.style.cssText = "left:" + (b[0] - pad) + "px;top:" + (b[1] - pad) + "px;width:" + (b[2] + pad * 2) + "px;height:" + (b[3] + pad * 2) + "px"; L.appendChild(e); }
function fxSvDraw(root, X, k) {
  fxClear(); FXS.root = root; FXS.k = k; if (k < 0 || !X.sv[k]) return;
  var c = fxHost(root), s = X.sv[k], OT = ["", "목적어(명사)", "목적어(명사절)", "목적어(to부정사)", "목적어(동명사)"], LG = { s: 0, imp: 0, o: {}, p: 0 };
  s[1].forEach(function (cl) { if (cl[4]) LG.imp = 1; if (cl[0].length) LG.s = 1; if (cl[2].length) LG.o[OT[cl[3]] || "목적어"] = 1; });
  if ((s[2] || []).length) LG.p = 1;
  var lg = document.createElement("div"); lg.className = "fxlg";
  lg.innerHTML = (LG.s ? '<span><i class="s"></i>주어</span>' : "") + (LG.imp ? '<span><i class="s"></i>주어 (You) 생략 · 명령문</span>' : "") + (s[1].length ? '<span><i class="v"></i>동사</span>' : "") + Object.keys(LG.o).map(function (o) { return '<span><i class="o"></i>' + o + "</span>"; }).join("") + (LG.p ? '<span><i class="p"></i>전치사</span><span><i class="q"></i>전치사의 목적어(명사)</span>' : "") + '<button aria-label="닫기">✕</button>';
  c.insertBefore(lg, c.firstChild);
  lg.querySelector("button").onclick = function (e) { e.stopPropagation(); fxClear(); FXS.k = -1; };
  var L = document.createElement("div"); L.className = "fxsv"; var lines = [];
  function bot(b) { return [b[0] + b[2] / 2, b[1] + b[3] + 2, b[3]]; }
  s[1].forEach(function (cl) {
    var an = [[cl[0], "s"], [cl[1], "v"], [cl[2], "o"]].map(function (r) { if (!r[0].length) return null; var B = fxRects(root, c, r[0]); B.forEach(function (b) { fxBox(L, b, r[1]); }); return B.length ? [B[0], B[B.length - 1]] : null; });
    if (an[0] && an[1]) lines.push([bot(an[0][1]), bot(an[1][0]), "#1F5FD6"]);
    if (an[1] && an[2]) lines.push([bot(an[1][1]), bot(an[2][0]), "#0E9F6E"]);
  });
  (s[2] || []).forEach(function (pp) {
    var bp = fxRects(root, c, pp[0]), bo = fxRects(root, c, pp[1]); if (!bp.length || !bo.length) return;
    bp.forEach(function (b) { fxBox(L, b, "p"); }); bo.forEach(function (b) { fxBox(L, b, "q", 1); });
    var z = bo[bo.length - 1]; lines.push([[bp[0][0] + bp[0][2] / 2, bp[0][1] + bp[0][3] + 2, bp[0][3] * 0.6], [z[0] + z[2] / 2, z[1] + z[3] + 2], "#8E44AD"]);
  });
  L.insertAdjacentHTML("afterbegin", '<svg width="' + c.scrollWidth + '" height="' + c.scrollHeight + '">' + lines.map(function (l) { var dy = Math.max(l[0][1], l[1][1]) + Math.max(6, l[0][2] * 0.5); return '<path d="M' + l[0][0] + " " + l[0][1] + " C" + l[0][0] + " " + dy + " " + l[1][0] + " " + dy + " " + l[1][0] + " " + l[1][1] + '" fill="none" stroke="' + l[2] + '" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="5 3"/>'; }).join("") + "</svg>");
  c.appendChild(L);
}
// PART 5: 전치사를 누르면 전치사 + 명사(전치사의 목적어)에 빨간 중앙선
function fxPpDraw(root, X) {
  var c = fxHost(root), old = c.querySelector(".fxsv.pp"); if (old) old.remove();
  var ks = Object.keys(FXS.pp); if (!ks.length) return;
  var L = document.createElement("div"); L.className = "fxsv pp";
  ks.forEach(function (k) { fxRects(root, c, FXS.pp[k]).forEach(function (b) { var e = document.createElement("div"); e.className = "eb-strk"; e.style.cssText = "left:" + (b[0] - 2) + "px;top:" + b[1] + "px;width:" + (b[2] + 4) + "px;height:" + b[3] + "px"; L.appendChild(e); }); });
  c.appendChild(L);
}
function fxPpOf(X, ti) { var r = null; (X.sv || []).forEach(function (s) { (s[2] || []).forEach(function (pp) { if (pp[0][0] === ti) r = pp[0].concat(pp[1]); }); }); return r; }
function fxTap(el, e) {
  var root = el.closest(".fxr"); if (!root) return; var X = FXT[root.dataset.x]; if (!X) return;
  fxStyle(); var ti = +el.dataset.ti, qb1 = root.closest(".qb"), lc = !!(root.closest(".mr-line") || (qb1 && qb1.fxq) || (Q && Q.sec && Q.sec.area === "LC") || S.area === "LC"), rc = !lc;
  var canSv = rc && (!root.dataset.bl || fxGraded(root)), word = fxWord(el), isItem = !root.closest(".passage") && !root.closest(".mr-line");
  // 구조 / 전치사 중앙선
  var pp = rc && isItem && canSv ? fxPpOf(X, ti) : null;
  if (pp) { if (FXS.pp[ti] && FXS.root === root) { delete FXS.pp[ti]; fxPpDraw(root, X); ebHide(); return; } if (FXS.root !== root) FXS.pp = {}; FXS.root = root; FXS.pp[ti] = pp; fxPpDraw(root, X); }
  else if (false) { var k = fxSentOf(X, ti); if (k >= 0 && FXS.root === root && FXS.k === k && el.classList.contains("on")) { fxClear(); FXS.k = -1; ebHide(); root.querySelectorAll(".on").forEach(function (x) { x.classList.remove("on"); }); return; } if (k !== FXS.k || FXS.root !== root) fxSvDraw(root, X, k); }
  ebHide(); document.querySelectorAll(".mkst .fxr .on,.mkst .fxr .ck").forEach(function (x) { x.classList.remove("on"); x.classList.remove("ck"); });
  el.classList.add("on");
  var p = el.dataset.p || "", m = el.dataset.m || "", b = el.dataset.b || "", L = X.F.L || [], extra = [];
  var ph = el.closest(".gph"), phT = ph ? ph.textContent.replace(/^[^A-Za-z0-9$%']+|[,.;:?!"')]+$/g, "") : "";
  if (ph) { ph.classList.add("on"); if (p || m) extra.push("· <b>" + esc(word) + "</b> " + esc(p) + " " + esc(m) + (b ? " (원형 " + esc(b) + ")" : "")); }
  var BL = {}, hide = root.dataset.bl && !fxGraded(root);
  if (hide) root.querySelectorAll(".gx").forEach(function (g) { if (/_{3,}|-{4,}|-{2,}\d{3}/.test(g.textContent) || g.querySelector("span")) BL[g.dataset.ti] = 1; });
  function hasBl(L2) { return hide && L2.some(function (i) { return BL[i]; }); }
  (X.ck || []).forEach(function (c) { if (c[0].indexOf(ti) < 0 || hasBl(c[0])) return; var ws = c[0].map(function (i) { var t = root.querySelector('[data-ti="' + i + '"]'); if (t) t.classList.add("ck"); return t ? fxWord(t) : ""; }).join(" "); extra.push("🧩 <b>" + esc(L[c[1]] || "") + "</b> · " + esc(ws)); });
  (X.rd || []).forEach(function (r) { if (r[0] === ti && !hasBl([ti])) extra.push("🔗 <b>" + esc((L[r[1]] || "").split(" — ")[0]) + "</b> — " + esc((L[r[1]] || "").split(" — ").slice(1).join(" — "))); });
  var sk = fxSentOf(X, ti); if (sk >= 0 && X.sv[sk][1].some(function (cl) { return cl[4] && cl[1].indexOf(ti) >= 0; })) extra.push("📢 <b>명령문</b> — 주어(You)가 생략되고 동사원형으로 시작하는 문장");
  var pop = document.createElement("div"); pop.className = "eb-pop";
  var au = fxAudOf(el);
  pop.innerHTML = '<button class="x" aria-label="닫기">×</button>' + (ph ? '<div><span class="wd">' + esc(phT) + '</span><span class="ps">묶음 표현</span></div><div class="mn">' + esc(ph.dataset.pm) + "</div>" : '<div><span class="wd">' + esc(word) + "</span>" + (p ? '<span class="ps">' + esc(p) + "</span>" : "") + (b ? '<span class="bs">원형 ' + esc(b) + "</span>" : "") + "</div>" + (m ? '<div class="mn">' + esc(m) + "</div>" : "")) +
    extra.map(function (x) { return '<div class="fxl">' + x + "</div>"; }).join("") +

    '<div class="pl">' + (au ? '<button data-fp="1">▶ 이 문장 듣기</button><button class="g" data-fp="0">■ 멈춤</button>' : "") + (m || ph ? '<button class="g sv" data-sv="1">☆ 단어장 저장</button>' : "") + "</div>";
  (document.querySelector(".mkst") || document.body).appendChild(pop); if (typeof ebPopFollow === "function") ebPopFollow(pop);
  if (p && m && !ph) ebAltShow(pop, word, [p, m, b]);
  var vw = ph ? { w: phT, ps: "표현", mn: ph.dataset.pm, bs: "", b: "학습실", p: (Q && Q.sec ? Q.sec.title : "문제") } : m ? { w: b && /^(동사|과거분사|현재분사|동명사)/.test(p) ? b : word, ps: p, mn: m, bs: b, b: "학습실", p: (Q && Q.sec ? Q.sec.title : "문제") } : null;
  var svb = pop.querySelector("[data-sv]");
  function svDraw() { var on = ebVocHas(vw); svb.classList.toggle("on", on); svb.textContent = on ? "★ 저장됨 (단어장)" : "☆ 단어장 저장"; }
  if (svb) { svDraw(); svb.onclick = function () { ebVocToggle(vw); svDraw(); }; }
  pop.querySelector(".x").onclick = function () { ebHide(); fxStop(); };
  if (au) { pop.querySelector('[data-fp="1"]').onclick = function () { au(); }; pop.querySelector('[data-fp="0"]').onclick = function () { fxStop(); stopPlay(); }; if (!el.closest(".mr-line")) au(); }
}
document.addEventListener("click", function (e) {
  var el = e.target.closest && e.target.closest(".mkst .fxr .gw,.mkst .fxr .gx"); if (!el) return;
  e.__fx = true; try { fxTap(el, e); } catch (er) { }
}, true);
// ---------- 듣기: 문장 음원 ----------
var FXA = { a: null, run: 0, seg: {} };
function fxStop() { FXA.run++; if (FXA.a) FXA.a.pause(); }
function fxPlay(url, st, en) {
  fxStop(); stopPlay(); var run = ++FXA.run;
  if (!FXA.a) FXA.a = new Audio(); var a = FXA.a; PL.reader = a;
  return new Promise(function (res) {
    function go() { try { a.currentTime = st || 0; } catch (e) { } var p = a.play(); if (p && p.catch) p.catch(function () { res(); }); }
    a.ontimeupdate = function () { if (run !== FXA.run) return; if (en && a.currentTime >= en) { a.pause(); res(); } };
    a.onended = function () { if (run === FXA.run) res(); };
    a.onerror = function () { res(); };
    if (a.dataset.src !== url) { a.dataset.src = url; a.src = url; a.preload = "auto"; a.onloadedmetadata = function () { if (run === FXA.run) go(); }; a.load(); var p = a.play(); if (p && p.catch) p.catch(function () { }); }
    else go();
  }).then(function () { if (run !== FXA.run) throw new Error("stop"); });
}
function fxGap(ms) { var r = FXA.run; return new Promise(function (res, rej) { setTimeout(function () { r === FXA.run ? res() : rej(new Error("stop")); }, ms); }); }
// PART 2 음원 하나 = 질문 + (A)(B)(C): 소리 없는 틈으로 나눠 [질문, A, B, C] 구간을 찾는다
function fxSeg(url) {
  if (FXA.seg[url]) return FXA.seg[url];
  var Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  FXA.seg[url] = fetch(url).then(function (r) { return r.arrayBuffer(); }).then(function (ab) {
    var c = new Ctx(1, 1, 22050); return new Promise(function (res, rej) { var p = c.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); });
  }).then(function (buf) {
    var ch = buf.getChannelData(0), sr = buf.sampleRate, W = Math.round(sr * 0.02), E = [], mx = 0;
    for (var i = 0; i + W <= ch.length; i += W) { var s = 0; for (var j = i; j < i + W; j += 4) s += ch[j] * ch[j]; s = Math.sqrt(s / (W / 4)); E.push(s); if (s > mx) mx = s; }
    var th = mx * 0.06, on = E.map(function (v) { return v > th; }), segs = [], cur = null, gapN = 0;
    for (var k = 0; k < on.length; k++) {
      if (on[k]) { if (!cur) cur = [k, k]; cur[1] = k; gapN = 0; }
      else if (cur) { gapN++; if (gapN >= 18) { segs.push(cur); cur = null; gapN = 0; } }
    }
    if (cur) segs.push(cur);
    segs = segs.filter(function (g) { return g[1] - g[0] >= 8; });
    while (segs.length > 4) { var bi = 1, bg = 1e9; for (var q = 1; q < segs.length; q++) { var gg = segs[q][0] - segs[q - 1][1]; if (gg < bg) { bg = gg; bi = q; } } segs[bi - 1][1] = segs[bi][1]; segs.splice(bi, 1); }
    var D = 0.02; return segs.map(function (g) { return [Math.max(0, g[0] * D - 0.15), g[1] * D + 0.25]; });
  }).catch(function () { return []; });
  return FXA.seg[url];
}
// 문장별로 잘라 둔 음원(질문·A·B·C)이 있으면 그것을, 없으면 통음원에서 소리 틈으로 잘라 재생
function fxCut(q, idx) { var a = typeof sAu === "function" ? sAu(q, idx - 1) : ""; return a ? Promise.resolve([audioUrl(a), 0, 0]) : fxSeg(audioUrl(q.audio)).then(function (sg) { var u = audioUrl(q.audio), g = sg.length === 4 ? sg[idx] : null; return g ? [u, g[0], g[1]] : idx ? null : [u, 0, 0]; }); }
function fxP2Play(q, idx) { return fxCut(q, idx).then(function (c) { return c ? fxPlay(c[0], c[1], c[2]) : fxPlay(audioUrl(q.audio), 0, 0); }); }
function fxP2Rep(q) { return Promise.all([fxCut(q, 0), fxCut(q, q.answer + 1)]).then(function (c) { if (!c[0] || !c[1] || (c[0][0] === c[1][0] && !c[0][2])) return fxPlay(audioUrl(q.audio), 0, 0); return fxPlay(c[0][0], c[0][1], c[0][2]).then(function () { return fxGap(500); }).then(function () { return fxPlay(c[1][0], c[1][1], c[1][2]); }); }); }
// 단어를 눌렀을 때 들려줄 문장 음원
function fxAudOf(el) {
  var line = el.closest(".mr-line"); if (line) return function () { line.click(); };
  var qb = el.closest(".qb"); if (!qb) return null;
  var op0 = el.closest(".opt"); if (qb.fxq) { var q0 = qb.fxq, i0 = op0 ? +(op0.dataset.k || Array.prototype.indexOf.call(op0.parentNode.children, op0)) + 1 : 0; return function () { fxP2Play(q0, i0).catch(function () { }); }; }
  if (!Q || !Q.pages) return null;
  var pg = Q.pages[Q.i], x = pg && pg[0]; if (!x || x.set || !x.q.audio) return null;
  var op = el.closest(".opt"), idx = op ? +op.dataset.k + 1 : 0;
  return function () { fxP2Play(x.q, idx).catch(function () { }); };
}
// ---------- 문제 화면에 붙이기 ----------
function stfxPage(pg, st) {
  fxStyle(); fxClear(); FXS = { root: null, k: -1, pp: {} };
  var tw = app.querySelector(".twocol"); if (!tw) return;
  var x = pg[0], lc = Q && Q.sec && Q.sec.area === "LC";
  // PART 2: 질문·보기 골라 듣기 + 정답 반복(질문+정답)
  if (lc && !x.set && x.q.audio) fxP2Bar(tw.querySelector(".audio"), x.q, st.done);
  // 필기 · 캡처 · 음원 버튼
  stFloats(tw, "st:" + pg[0].key, lc);
}
function fxP2Bar(ab, q, done) {
    var url = audioUrl(q.audio), n = (q.options || []).length, ans = q.answer, st = { done: done }, x = { q: q };
    if (ab && n) {
      var bar = document.createElement("div"); bar.className = "fxp2";
      bar.innerHTML = '<button data-x="0">▶ 질문만</button>' + (st.done ? (x.q.options || []).map(function (o, k) { return '<button data-x="' + (k + 1) + '">▶ (' + "ABCD"[k] + ")</button>"; }).join("") + '<button class="rep" data-rep="1">🔁 정답 반복 (질문+정답)</button>' : "");
      ab.insertAdjacentElement("afterend", bar);
      if (st.done) bar.insertAdjacentHTML("afterend", '<p class="fxtip">정답 반복: 질문과 정답만 계속 반복해서 들려줘요. 한 번 더 누르면 멈춰요.</p>');
      bar.querySelectorAll("[data-x]").forEach(function (b) { b.onclick = function () { bar.querySelectorAll(".on").forEach(function (y) { y.classList.remove("on"); }); b.classList.add("on"); fxP2Play(q, +b.dataset.x).then(function () { b.classList.remove("on"); }).catch(function () { b.classList.remove("on"); }); }; });
      var rb = bar.querySelector("[data-rep]");
      if (rb) rb.onclick = function () {
        if (rb.classList.contains("on")) { fxStop(); rb.classList.remove("on"); return; }
        rb.classList.add("on"); var r0;
        (function loop() { fxP2Rep(q).then(function () { return fxGap(1000); }).then(loop).catch(function () { rb.classList.remove("on"); }); })();
      };
    }
}
// 시험 모드(전체 풀고 제출) 문제 화면
function stfxExam() { fxStyle(); fxClear(); var tw = app.querySelector(".twocol"); if (tw && Q && Q.pages) stFloats(tw, "st:" + Q.pages[Q.i][0].key, false); }
// 채점 뒤 해설 보기: 문장 구조·단어, PART 2 정답 반복, 필기·캡처
function stfxReview(picked) {
  fxStyle(); fxClear(); FXS = { root: null, k: -1, pp: {} };
  var qbs = app.querySelectorAll(".qb"), lc = picked.some(function (x) { return x.q && x.q.audio; });
  picked.forEach(function (x, i) { var qb = qbs[i]; if (!qb || x.set || !x.q.audio) return; qb.fxq = x.q; var h = document.createElement("div"); qb.querySelector(".opts").insertAdjacentElement("beforebegin", h); fxP2Bar(h, x.q, true); });
  var key = "st:rv:" + fxH(picked.map(function (x) { return x.key; }).join(","));
  stFloats(app, key, false);
}
function stFloats(tw, key, lc) {
  document.querySelectorAll(".mkst .st-f").forEach(function (b) { b.remove(); });
  var host = document.querySelector(".mkst") || document.body;
  tw.classList.add("fxhost"); stInk(key, tw);
  var bc = document.createElement("button"); bc.className = "eb-camf st-f"; bc.innerHTML = "📸<small>캡처</small>"; bc.onclick = function () { stCap(tw); }; host.appendChild(bc);
  var bi = document.createElement("button"); bi.className = "eb-inkf eb-inkb st-f"; bi.innerHTML = "✏️<small>필기</small>"; bi.onclick = function () { ebInkToggle(); }; host.appendChild(bi);
  if (lc) { var ba = document.createElement("button"); ba.className = "eb-audf st-f"; ba.innerHTML = "🎧<small>음원</small>"; ba.onclick = stAudSheet; host.appendChild(ba); }
}
// 문제 화면을 벗어나면 떠 있는 버튼 정리
new MutationObserver(function () { if (app && !/^#\/eb/.test(location.hash) && !app.querySelector(".fxr .on")) document.querySelectorAll(".mkst .eb-pop").forEach(function (x) { x.remove(); });
  if (app && !app.querySelector(".st-ink")) { document.querySelectorAll(".mkst .st-f,.mkst .eb-auds.st-s").forEach(function (b) { b.remove(); }); if (EBI.on && EBI.cv && !EBI.cv.isConnected) ebInkToggle(false); } }).observe(document.getElementById("mkst-app") || document.body, { childList: true });
// ---------- 필기 (문제 화면 위) : 좌표는 화면 너비 기준이라 해설이 펼쳐져도 그대로 ----------
function stInk(key, pg) {
  EBI.on = false; EBI.key = key; EBI.S = []; EBI.hist = []; document.querySelectorAll(".mkst .eb-inkbar").forEach(function (b) { b.remove(); });
  var host = document.querySelector(".mkst"); if (host) host.classList.remove("eb-inking");
  var cv = document.createElement("canvas"); cv.id = "eb-ink"; cv.className = "st-ink"; pg.appendChild(cv);
  var cur = null, raf = 0;
  function WH() { return [pg.offsetWidth, Math.max(pg.offsetHeight, pg.scrollHeight)]; }
  function size() { var s = WH(); s[1] = Math.min(s[1], 30000); var d = Math.min(1.5, window.devicePixelRatio || 1, Math.sqrt(14e6 / Math.max(1, s[0] * s[1]))), w = Math.round(s[0] * d), h = Math.round(s[1] * d); cv.style.height = s[1] + "px"; if (w && h && (cv.width !== w || cv.height !== h)) { cv.width = w; cv.height = h; paint(); } }
  function conv(s) { var r = cv.width / cv.height; if (s.t === "text") return { t: "text", c: s.c, s: s.s, x: s.x, y: s.y * r, txt: s.txt }; var o = {}; for (var k in s) o[k] = s[k]; o.p = (s.p || []).map(function (q) { return [q[0], q[1] * r]; }); return o; }
  function paint() { if (!cv.height) return; ebInkPaint(cv, EBI.S.map(conv), cur && !cur.er ? conv(cur) : null); }
  function save() { if (key === EBI.key) ebInkPut(key, EBI.S); }
  if (window.ResizeObserver) new ResizeObserver(size).observe(pg); size();
  ebInkGet(key).then(function (v) { if (key !== EBI.key) return; EBI.S = v || []; size(); paint(); });
  function pt(e) { var r = cv.getBoundingClientRect(); return [Math.round((e.clientX - r.left) / r.width * 10000) / 10000, Math.round((e.clientY - r.top) / r.width * 10000) / 10000]; }
  function snap(a, b) { var dx = b[0] - a[0], dy = b[1] - a[1], ang = Math.abs(Math.atan2(dy, dx) * 180 / Math.PI); if (ang < 6 || ang > 174) return [b[0], a[1]]; if (Math.abs(ang - 90) < 6) return [a[0], b[1]]; return b; }
  function near(s, p) { if (s.t === "text") { var n = String(s.txt).split("\n"); return p[0] >= s.x - 0.005 && p[0] <= s.x + s.s * Math.max.apply(null, n.map(function (l) { return l.length; })) * 0.9 && p[1] >= s.y - 0.005 && p[1] <= s.y + s.s * 1.3 * n.length; } return (s.p || []).some(function (q) { return Math.hypot(q[0] - p[0], q[1] - p[1]) < EBI_W.er + s.w / 2; }); }
  function erase(p) { var hit = false; EBI.S = EBI.S.filter(function (s) { var n = near(s, p); if (n) hit = true; return !n; }); if (hit) paint(); }
  function textAt(p, old) {
    var ta = document.createElement("textarea"), s = old ? old.s : EBI_W.text[EBI.w.text], c = old ? old.c : EBI.c.text;
    ta.className = "eb-inkt"; ta.value = old ? old.txt : ""; ta.style.left = p[0] * 100 + "%"; ta.style.top = p[1] * pg.offsetWidth + "px"; ta.style.fontSize = s * pg.offsetWidth + "px"; ta.style.color = c; ta.rows = Math.max(1, (ta.value.match(/\n/g) || []).length + 1);
    pg.appendChild(ta); setTimeout(function () { ta.focus(); }, 30);
    ta.oninput = function () { ta.rows = Math.max(1, (ta.value.match(/\n/g) || []).length + 1); };
    ta.onblur = function () { var v = ta.value.replace(/\s+$/, ""); ta.remove(); if (v) { EBI.hist.push(EBI.S.slice()); EBI.S.push({ t: "text", c: c, s: s, x: p[0], y: p[1], txt: v }); } paint(); save(); };
  }
  var sy = 0, scrolling = false, holdT = 0;
  cv.addEventListener("pointerdown", function (e) {
    if (!EBI.on) return;
    if (e.pointerType === "pen") EBI.pen = true;
    if (e.pointerType === "touch" && EBI.pen) { scrolling = true; sy = e.clientY; cv.setPointerCapture(e.pointerId); return; }
    e.preventDefault(); cv.setPointerCapture(e.pointerId); var p = pt(e);
    if (EBI.tool === "er") { EBI.hist.push(EBI.S.slice()); cur = { er: 1 }; erase(p); return; }
    if (EBI.tool === "text") { var hit = EBI.S.filter(function (s) { return s.t === "text" && near(s, p); })[0]; if (hit) { EBI.hist.push(EBI.S.slice()); EBI.S.splice(EBI.S.indexOf(hit), 1); paint(); textAt([hit.x, hit.y], hit); } else textAt(p); return; }
    cur = { t: EBI.tool, c: EBI.c[EBI.tool], w: EBI_W[EBI.tool][EBI.w[EBI.tool]] * (e.pointerType === "pen" && e.pressure && EBI.tool !== "hl" ? 0.7 + e.pressure * 0.6 : 1), p: [p] };
    if (EBI.ruler) cur.r = 1; paint();
  });
  cv.addEventListener("pointermove", function (e) {
    if (scrolling) { window.scrollBy(0, sy - e.clientY); sy = e.clientY; return; }
    if (!cur) return; e.preventDefault();
    if (cur.er) { erase(pt(e)); return; }
    var ev = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; if (!ev.length) ev = [e];
    clearTimeout(holdT); var lastE = pt(ev[ev.length - 1]);
    if (!cur.r && cur.p.length > 4) holdT = setTimeout(function () { if (cur && !cur.er && cur.p && cur.p.length > 2) { cur.r = 1; cur.p = [cur.p[0], snap(cur.p[0], lastE)]; paint(); } }, 550);
    if (cur.r) cur.p = [cur.p[0], snap(cur.p[0], lastE)];
    else ev.forEach(function (q) { var p = pt(q), l = cur.p[cur.p.length - 1]; if (Math.abs(p[0] - l[0]) + Math.abs(p[1] - l[1]) > 0.0008) cur.p.push(p); });
    if (!raf) raf = requestAnimationFrame(function () { raf = 0; paint(); });
  });
  function straight(c) { var p = c.p; if (!p || p.length < 3 || c.r) return; var W = pg.offsetWidth, a = p[0], z = p[p.length - 1], dx = (z[0] - a[0]) * W, dy = (z[1] - a[1]) * W, L = Math.hypot(dx, dy); if (L < 24) return; var dev = 0; p.forEach(function (q) { var d = Math.abs((q[0] - a[0]) * W * dy - (q[1] - a[1]) * W * dx) / L; if (d > dev) dev = d; }); if (dev < Math.max(3, L * 0.045)) c.p = [a, snap(a, z)]; }
  function up() { clearTimeout(holdT); if (scrolling) { scrolling = false; return; } if (!cur) return; if (cur.er) { cur = null; save(); return; } straight(cur); EBI.hist.push(EBI.S.slice()); EBI.S.push(cur); cur = null; paint(); save(); }
  cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
  EBI.paint = paint; EBI.save = save; EBI.cv = cv;
}
// ---------- 📸 캡처: 지금 보이는 문제 화면을 필기 노트에 ----------
function stH2C() {
  if (window.html2canvas) return Promise.resolve(window.html2canvas);
  return new Promise(function (res, rej) { var s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"; s.onload = function () { res(window.html2canvas); }; s.onerror = rej; document.head.appendChild(s); });
}
function stCap(tw) {
  var r = tw.getBoundingClientRect(), vh = window.innerHeight, top = Math.max(0, -r.top), h = Math.min(r.height - top, vh - Math.max(0, r.top) - 90);
  if (h < 40) h = Math.min(r.height, vh);
  ebToast("📸 캡처하는 중…");
  stH2C().then(function (h2c) {
    return h2c(tw, { y: top + r.top + window.scrollY, height: h, scale: Math.min(2, 1400 / r.width), backgroundColor: "#ffffff", useCORS: true, logging: false, windowHeight: document.documentElement.scrollHeight, scrollY: -window.scrollY,
      ignoreElements: function (el) { return el.classList && el.classList.contains("st-ink"); } });
  }).then(function (cv) {
    var ic = tw.querySelector(".st-ink"), x = cv.getContext("2d");
    if (ic && ic.width) { var k = ic.width / tw.offsetWidth; x.drawImage(ic, 0, top * k, ic.width, h * k, 0, 0, cv.width, cv.height); }
    var t = Q && Q.sec ? Q.sec.title : "학습실", n = Q && Q.pages ? Q.i + 1 : 0, it = Q && Q.pages ? Q.pages[Q.i][0] : null;
    var o = { id: Date.now() + "-" + Math.random().toString(36).slice(2, 6), t: Date.now(), b: "학습실 · " + t, bid: "st", p: it && it.q && it.q.no != null ? it.q.no + "번" : n + "번째 문제", go: location.hash, img: cv.toDataURL("image/jpeg", 0.86), w: cv.width, h: cv.height, memo: "" };
    return ebNotePut(o).then(function () { ebToast('📸 필기 노트에 저장했어요 · <a href="#/eb/note" style="color:#FFD2B8;font-weight:900">필기 노트 보기</a>'); });
  }).catch(function () { ebToast("캡처하지 못했어요. 다시 눌러 주세요."); });
}
// ---------- 🎧 이 단원 음원: 전체 듣기 · 문제 골라 듣기 · 정답 반복 · MP3 받기 ----------
function stAudList() {
  var L = [], seen = {};
  (Q && Q.pages || []).forEach(function (pg, i) {
    var x = pg[0];
    if (x.set && x.set.audio) { if (seen[x.set.audio]) return; seen[x.set.audio] = 1; L.push({ i: i, t: (x.set.range || (x.q.no + "")) + "번", url: audioUrl(x.set.audio) }); }
    else if (!x.set && x.q.audio) L.push({ i: i, t: (x.q.no != null ? x.q.no : i + 1) + "번", url: audioUrl(x.q.audio), q: x.q, p2: true });
  });
  return L;
}
function stAudSheet() {
  var old = document.querySelector(".mkst .eb-auds.st-s"); if (old) { old.remove(); return; }
  var L = stAudList(); if (!L.length) return;
  var rep = ls("strep") === "1" && L.some(function (a) { return a.p2; }), cur = -1;
  var sh = document.createElement("div"); sh.className = "eb-auds st-s"; (document.querySelector(".mkst") || document.body).appendChild(sh);
  function draw() {
    sh.innerHTML = '<div class="eb-audh"><b>🎧 ' + esc(Q.sec.title) + " · " + L.length + '개 음원</b><button class="x">✕</button></div>' +
      '<div class="eb-audt"><button data-a="all">▶ 전체 듣기</button>' + (L.some(function (a) { return a.p2; }) ? '<button data-a="rep" class="' + (rep ? "on" : "") + '">🔁 정답 반복 ' + (rep ? "켜짐" : "꺼짐") + "</button>" : "") + '<button data-a="stop">■ 멈춤</button><button data-a="dl" style="border-color:#1E8E5A;color:#1E8E5A">⬇ 음원 받기 (MP3)</button></div>' +
      '<p class="eb-tip" style="margin:0 2px 8px;font-size:13px">문제를 누르면 그 문제만 들어요.' + (L.some(function (a) { return a.p2; }) ? " <b>정답 반복</b>을 켜면 질문과 정답만 들려줘요(문제를 누르면 그 문제를 계속 반복)." : "") + "</p>" +
      '<div class="eb-audl">' + L.map(function (a, k) { return '<button data-k="' + k + '" class="' + (k === cur ? "on" : "") + '">' + (k === cur ? "■ " : "▶ ") + esc(a.t) + "</button>"; }).join("") + "</div>";
    sh.querySelector(".x").onclick = function () { fxStop(); sh.remove(); };
    sh.querySelector('[data-a="all"]').onclick = function () { cur = 0; draw(); seq(0); };
    sh.querySelector('[data-a="stop"]').onclick = function () { fxStop(); cur = -1; draw(); };
    var rb = sh.querySelector('[data-a="rep"]'); if (rb) rb.onclick = function () { rep = !rep; ls("strep", rep ? "1" : "0"); draw(); };
    sh.querySelector('[data-a="dl"]').onclick = function () {
      var b = this; Promise.all(L.map(function (a) { return rep && a.p2 ? Promise.all([fxCut(a.q, 0), fxCut(a.q, a.q.answer + 1)]) : Promise.resolve(null); })).then(function (S2) {
        var segs = []; L.forEach(function (a, k) { var c = S2[k]; if (c && c[0] && c[1]) segs.push(c[0], c[1]); else segs.push([a.url, 0, 0]); });
        EB.cur = { nm: Q.sec.title, n: rep ? "정답반복" : "전체" }; ebAudDl({}, segs, b);
      });
    };
    sh.querySelectorAll("[data-k]").forEach(function (b) { b.onclick = function () { var k = +b.dataset.k; if (k === cur) { fxStop(); cur = -1; draw(); return; } cur = k; draw(); one(k, rep && L[k].p2).then(function () { if (rep && L[k].p2 && cur === k) return loop(k); }).then(function () { if (cur === k) { cur = -1; draw(); } }).catch(function () { }); }; });
  }
  function one(k, r) { var a = L[k]; return r && a.p2 ? fxP2Rep(a.q).then(function () { return fxGap(900); }) : fxPlay(a.url, 0, 0).then(function () { return fxGap(700); }); }
  function loop(k) { return one(k, true).then(function () { if (cur === k) return loop(k); }); }
  function seq(k) { if (k >= L.length) { cur = -1; draw(); return; } cur = k; draw(); one(k, rep).then(function () { seq(k + 1); }).catch(function () { }); }
  draw();
}
function viewLectures(id) {
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function viewLectures(id) {\n", FN + "\n"],
["function load(key) {\n  if (S.cache[key]) return Promise.resolve(S.cache[key]);", "function load(key) { return load0(key).then(function (d) { return fxPre(key, d); }); }\nfunction load0(key) {\n  if (S.cache[key]) return Promise.resolve(S.cache[key]);"],
["function glossHtml(text, g, oc, ph, psg) {\n", "function glossHtml(text, g, oc, ph, psg) {\n  var FXx = fxOf(text); if (FXx) return fxGloss(text, g, oc, ph, psg, FXx);\n"],
["  if (!q || !q.g) return blank(q && q.q);", "  if (!q || (!q.g && !fxOf(q.q))) return blank(q && q.q);"],
['e.target.closest(".mkst .gw"); if (!w) return;', 'e.target.closest(".mkst .gw"); if (!w || e.__fx) return;'],
['${hideOpt ? "" : `<span>${esc(o)}</span>`}', '${hideOpt ? "" : `<span>${st.done ? fxText(o) : esc(o)}</span>`}'],
['<span class="mr-en" lang="en">${esc(l.en)}</span>', '<span class="mr-en" lang="en">${fxText(l.en)}</span>'],
['  bindCommon(); bindPlayer(); bindSay(); bindBm(); bindReaders();\n  app.querySelectorAll(".opt").forEach(function (b) { b.onclick = function () { Q.ans[b.dataset.key]', '  bindCommon(); bindPlayer(); bindSay(); bindBm(); bindReaders(); try { stfxExam(); } catch (e) { }\n  app.querySelectorAll(".opt").forEach(function (b) { b.onclick = function () { Q.ans[b.dataset.key]'],
['<span>${esc(o)}</span>${b.set ? "" : sPlay(q, k)}</div>`; }).join("")}</div>', '<span>${fxText(o)}</span>${b.set ? "" : sPlay(q, k)}</div>`; }).join("")}</div>'],
["  app.querySelectorAll(\"[data-lec]\").forEach(function (b) { b.onclick = function () { b.outerHTML = `<div class=\"video\"", "  try { stfxReview(picked); } catch (e) { }\n  app.querySelectorAll(\"[data-lec]\").forEach(function (b) { b.onclick = function () { b.outerHTML = `<div class=\"video\""],
["    bindPlayer(); bindSay(); bindBm(); bindReaders();\n  }\n  draw(); scrollTop();", "    bindPlayer(); bindSay(); bindBm(); bindReaders(); try { stfxPage(pg, st); } catch (e) { }\n  }\n  draw(); scrollTop();"]
]);
})();
