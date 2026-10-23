update content set text_data = $mkapp$/* 메이크토익 학습실 (학생용) — maketoeic.com/?mk=study 에 마운트. 데이터는 Supabase RPC로만 가져온다. */
(function () {
"use strict";
var CFG = window.MKST_CONFIG || {};
var SUPA = CFG.url, KEY = CFG.key;
var KAKAO = "https://pf.kakao.com/_zacab/chat";
var LOGO = "https://maketoeic.com/data/banner/6";
var LEVELS = ["기초", "중급", "고급"];
var L = ["A", "B", "C", "D"];

/* ---------- 스타일 (.mkst 범위) ---------- */
var CSS = `
.mkst{--navy:#172844;--orange:#FF581F;--orange2:#E95721;--peach:#FFF9F5;--peachline:#F3DACD;--bg:#F5F7FA;--line:#E7EAF0;--sub:#5B6573;--ok:#1E8E5A;--bad:#D2453B;
 font-family:"Pretendard","Noto Sans KR",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;color:var(--navy);line-height:1.55;word-break:keep-all;background:var(--bg)}
.mkst *{box-sizing:border-box}
.mkst button{font:inherit;color:inherit;cursor:pointer;margin:0;height:auto!important;line-height:1.35}
.mkst a{color:inherit}
.mkst .wrap{max-width:760px;margin:0 auto;padding:18px 16px 60px}
.mkst .card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:20px;margin-bottom:14px;box-shadow:0 6px 20px rgba(23,40,68,.04)}
.mkst .hero{position:relative;overflow:hidden;border:0;border-radius:20px;padding:26px 22px;color:#fff;background:linear-gradient(125deg,#14233E,#233C5C)}
.mkst .hero .logo{display:block;width:170px;height:52px;object-fit:contain;object-position:left center;margin:-6px 0 6px -4px}
.mkst .kicker{display:block;font-size:12px;font-weight:800;letter-spacing:2px;color:#FF713E}
.mkst .hero h1{font-size:26px;line-height:1.35;margin:10px 0 6px;font-weight:900;letter-spacing:-.6px;color:#fff}
.mkst .hero p{margin:0;color:#D7E0EE;font-size:14.5px}
.mkst .hero .dday{display:inline-block;margin-top:12px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:99px;padding:5px 12px;font-size:13px;font-weight:700}
.mkst .peach{background:var(--peach);border-color:var(--peachline)}
.mkst h2{font-size:19px;margin:0 0 12px;font-weight:800;letter-spacing:-.3px}
.mkst h3{font-size:16px;margin:18px 0 8px;font-weight:800}
.mkst .btn{display:flex;justify-content:center;align-items:center;gap:8px;border:0;border-radius:12px;padding:15px 18px;font-weight:800;font-size:16px;background:var(--orange);color:#fff;text-decoration:none;width:100%}
.mkst .btn.navy{background:var(--navy)}
.mkst .btn.ghost{background:#fff;color:var(--navy);border:1px solid var(--line)}
.mkst .btn.kakao{background:#FEE500;color:#191919}
.mkst .btn.sm{width:auto;display:inline-flex;padding:9px 14px;font-size:14px;flex-shrink:0}
.mkst .vw .pill{flex-shrink:0}
.mkst .btn[disabled]{opacity:.45;cursor:default}
.mkst input.in{width:100%;border:1.5px solid var(--line);border-radius:12px;padding:14px;font-size:17px;margin:6px 0 12px;background:#fff;height:auto}
.mkst input.in:focus{outline:none;border-color:var(--orange)}
.mkst label.lb{font-size:13.5px;font-weight:800;color:var(--sub)}
.mkst .msg{border-radius:12px;padding:12px 14px;font-size:14.5px;margin:0 0 12px}
.mkst .msg.err{background:#FBECEA;color:var(--bad)}
.mkst .msg.info{background:var(--peach);border:1px solid var(--peachline)}
.mkst .seg{display:flex;gap:6px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:5px;margin-bottom:12px}
.mkst .seg button{flex:1;border:0;background:transparent;border-radius:10px;padding:11px 4px;font-weight:800;font-size:15px;color:var(--sub)}
.mkst .seg button.on{background:var(--navy);color:#fff}
.mkst .seg.lv button.on{background:var(--orange)}
.mkst .grp{font-size:13px;font-weight:900;color:var(--orange2);letter-spacing:.5px;margin:18px 4px 8px}
.mkst .gw{cursor:pointer;border-radius:4px;padding:0 1px;text-decoration:underline dotted #C9CFDA;text-underline-offset:4px}
.mkst .gw.on{background:#FFE3D6;color:#172844;text-decoration:none}
.mkst .gpop{margin:10px 0 4px;background:#172844;color:#fff;border-radius:12px;padding:10px 14px;font-size:14px;line-height:1.5;animation:gpin .15s ease-out}
.mkst .gpop .gpw{font-size:17px;margin-right:8px}
.mkst .gpop .gpp{display:inline-block;background:#FF581F;color:#fff;border-radius:6px;padding:1px 7px;font-size:12px;font-weight:800;vertical-align:2px}
.mkst .gpop .gpb{margin-left:8px;font-size:12.5px;color:#C9D3E3}
.mkst .gpop .gpm{margin-top:3px;font-size:15.5px;font-weight:700}
.mkst .passage .gpop.inpsg{position:sticky;top:0;z-index:2;margin:0 0 10px;white-space:normal}
@keyframes gpin{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.mkst .seg.ar{padding:6px;gap:8px;border-width:2px}
.mkst .seg.ar button{padding:14px 4px;font-size:18px;letter-spacing:.5px}
.mkst .seg.ar button small{display:block;font-size:11.5px;font-weight:700;letter-spacing:0;opacity:.85;margin-top:1px}
.mkst .seg.ar button.on.lc{background:var(--navy)}
.mkst .seg.ar button.on.rc{background:var(--orange)}
.mkst .areahead{display:flex;align-items:center;gap:8px;margin:4px 2px 10px;font-weight:900;font-size:15px}
.mkst .areahead i{font-style:normal;color:#fff;border-radius:8px;padding:2px 9px;font-size:13px}
.mkst .sea{display:flex;align-items:center;gap:8px;margin:18px 2px 8px;font-size:15px;font-weight:900;color:var(--navy)}
.mkst .sea b{background:var(--navy);color:#fff;border-radius:999px;padding:3px 11px;font-size:12.5px;letter-spacing:.5px}
.mkst .sea.soon{color:var(--sub)}
.mkst .sea.soon b{background:#C9CFDA}
.mkst .serbar{display:flex;align-items:center;gap:8px;background:#fff;border:2px solid var(--orange);border-radius:14px;padding:10px 14px;margin-bottom:12px;font-size:14px;color:var(--sub)}
.mkst .serbar b{color:var(--orange);font-size:17px;margin-right:auto}
.mkst .serbar button{border:1px solid var(--line);background:#fff;border-radius:10px;padding:7px 12px;font-weight:800;font-size:13px;color:var(--navy)}
.mkst .soonbox{border:1.5px dashed var(--line);border-radius:14px;padding:14px;color:var(--sub);font-size:14px;text-align:center;margin-bottom:10px;background:#fff}
.mkst .row{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin-bottom:8px;text-decoration:none;cursor:pointer;width:100%;text-align:left}
.mkst .row:hover{border-color:var(--orange)}
.mkst .row .t{flex:1;min-width:0}
.mkst .row .t b{display:block;font-size:15.5px}
.mkst .row .t small{color:var(--sub);font-size:12.5px}
.mkst .pbar{flex:0 0 74px;height:7px;background:var(--bg);border-radius:9px;overflow:hidden}
.mkst .pbar i{display:block;height:100%;background:var(--orange)}
.mkst .pill{display:inline-block;font-size:11.5px;font-weight:800;border-radius:99px;padding:3px 9px;background:var(--bg);color:var(--sub);margin-right:4px}
.mkst .pill.o{background:var(--orange);color:#fff}
.mkst .pill.n{background:var(--navy);color:#fff}
.mkst .tiles{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.mkst .tile{background:#fff;border:1px solid var(--line);border-radius:16px;padding:16px;cursor:pointer;text-align:left}
.mkst .tile b{display:block;font-size:17px}
.mkst .tile small{color:var(--sub)}
.mkst .top{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.mkst .top .back{border:0;background:#fff;border:1px solid var(--line);border-radius:10px;padding:8px 12px;font-weight:800}
.mkst .top .tt{flex:1;font-weight:900;font-size:17px}
.mkst .qhead{display:flex;justify-content:space-between;font-size:13px;font-weight:800;color:var(--sub);margin-bottom:8px}
.mkst .bar{height:6px;background:var(--line);border-radius:9px;overflow:hidden;margin-bottom:14px}
.mkst .bar i{display:block;height:100%;background:var(--orange)}
.mkst .qno{font-weight:900;color:var(--orange)}
.mkst .sent{font-size:18.5px;line-height:1.7;font-weight:600;margin:6px 0 2px}
.mkst .pron{color:var(--sub);font-size:13.5px;margin-top:2px}
.mkst .hint{background:#FFF8E6;border:1px dashed #F2B33D;border-radius:10px;padding:8px 12px;margin-top:8px;font-size:13.5px;line-height:1.65;color:#5A4A1E}
.mkst .hint b{color:#B4690E}
.mkst .opts{display:grid;gap:8px;margin-top:12px}
.mkst .opt{display:flex;gap:12px;align-items:flex-start;text-align:left;width:100%;background:#fff;border:1.5px solid var(--line);border-radius:12px;padding:13px 14px;font-size:16px}
.mkst .opt .k{flex:0 0 26px;height:26px;border-radius:50%;display:grid;place-items:center;background:var(--bg);font-weight:800;font-size:13px}
.mkst .opt.sel{border-color:var(--orange);background:var(--peach)}
.mkst .opt.sel .k{background:var(--orange);color:#fff}
.mkst .opt.right{border-color:var(--ok);background:#EAF6EF}
.mkst .opt.right .k{background:var(--ok);color:#fff}
.mkst .opt.wrong{border-color:var(--bad);background:#FBECEA}
.mkst .opt.wrong .k{background:var(--bad);color:#fff}
.mkst .ex{background:#fff;border-left:4px solid var(--orange);border-radius:12px;padding:12px 14px;margin-top:12px;font-size:14.5px;line-height:1.75}
.mkst .ex p{margin:0 0 6px}
.mkst .ex b.lb2{color:var(--orange2)}
.mkst .passage{white-space:pre-wrap;font-size:15px;line-height:1.75;background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px;max-height:52vh;overflow:auto}
.mkst .passage .blankn{background:#FFE3D6;border-radius:4px;padding:0 4px;font-weight:800}
.mkst .script .ln{padding:7px 0;border-bottom:1px dashed var(--line);font-size:14.5px}
.mkst .script .spk{display:inline-block;min-width:54px;font-weight:800;font-size:12px;color:var(--orange2)}
.mkst .script .ko{color:var(--sub);font-size:13.5px}
.mkst .script .ln[data-au]{cursor:pointer}.mkst .script .ln[data-au]:hover{background:#FFF8F2}.mkst .script .ln .pl{color:var(--orange);font-size:12px;margin-right:4px}
.mkst .lcimg{display:block;width:100%;max-width:560px;border-radius:12px;border:1px solid var(--line);margin:6px 0 10px}
.mkst .qb{margin-top:16px}
.mkst .qb .qt{font-weight:700}
.mkst .note{white-space:pre-wrap;font-size:14.5px;line-height:1.75}
.mkst details.nc{background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px 16px;margin-bottom:8px}
.mkst details.nc summary{font-weight:800;cursor:pointer}
.mkst .video{position:relative;padding-top:56.25%;border-radius:14px;overflow:hidden;background:#000;margin-bottom:12px}
.mkst .video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.mkst .audio{display:flex;align-items:center;gap:10px;margin:8px 0}
.mkst .audio .play{width:48px;height:48px;border-radius:50%;border:0;background:var(--navy);color:#fff;font-size:18px}
.mkst .sticky{position:sticky;bottom:10px;margin-top:14px}
.mkst .empty{text-align:center;color:var(--sub);padding:30px 10px}
.mkst .foot{text-align:center;font-size:12px;color:var(--sub);margin-top:18px;line-height:1.7}
.mkst .score{text-align:center}
.mkst .score .big{font-size:52px;font-weight:900;color:#fff;letter-spacing:-1px}
.mkst .twocol{display:grid;gap:14px}
@media(min-width:900px){.mkst .twocol.set{grid-template-columns:1fr 1fr;align-items:start}.mkst .twocol.set .passage{max-height:75vh;position:sticky;top:10px}}
`;

/* ---------- 공통 ---------- */
var root, app;
var S = { token: null, profile: null, catalog: null, prog: {}, videos: {}, level: null, area: "RC", cache: {}, ytTitle: {} };
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function ls(k, v) { try { if (v === undefined) return localStorage.getItem("mkst:" + k); if (v === null) localStorage.removeItem("mkst:" + k); else localStorage.setItem("mkst:" + k, v); } catch (e) { return null; } }
function api(fn, args) {
  // 새 형식 키(sb_publishable_…)는 Authorization 헤더에 넣으면 안 되고 apikey 헤더만 쓴다
  var hd = { apikey: KEY, "Content-Type": "application/json" };
  if (!/^sb_/.test(KEY)) hd.Authorization = "Bearer " + KEY;
  if (fn === "save_progress" && !/^voca:/.test(args.p_item || "")) logStudy();
  return fetch(SUPA + "/rest/v1/rpc/" + fn, { method: "POST", headers: hd, body: JSON.stringify(args || {}) })
    .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); });
}
/* ---------- 학습 기록 (오늘 푼 문제 · 연속 학습일 · 하루 목표) — 이 기기에 저장 ---------- */
function ymdLocal(d) { d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function studyDays() { try { return JSON.parse(ls("days") || "{}"); } catch (e) { return {}; } }
function logStudy() { var d = studyDays(), k = ymdLocal(); d[k] = (d[k] || 0) + 1; ls("days", JSON.stringify(d)); }
function streak() {
  var d = studyDays(), n = 0, t = new Date();
  if (!d[ymdLocal(t)]) t.setDate(t.getDate() - 1);  // 오늘 아직 안 풀었으면 어제까지의 연속 기록
  while (d[ymdLocal(t)]) { n++; t.setDate(t.getDate() - 1); }
  return n;
}
function render(html) { app.innerHTML = html; }
function go(h) { location.hash = h; }
function scrollTop() { try { var y = root.getBoundingClientRect().top + window.scrollY - 70; window.scrollTo(0, Math.max(0, y)); } catch (e) { } }
function track(n, p) { try { if (window.gtag) gtag("event", n, p || {}); } catch (e) { } }
function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
function blank(s) { return esc(s).replace(/_{3,}|-{4,}/g, '<span style="display:inline-block;min-width:70px;border-bottom:3px solid #172844"></span>'); }
// RC 단어 뜻: q.g = { 소문자단어: [품사, 문맥 뜻, 기본형] } 이 있으면 단어를 누를 수 있게 감싼다
function gkey(t) { return t.replace(/^[^A-Za-z0-9_$%']+|[^A-Za-z0-9_%']+$/g, "").toLowerCase(); }
function blankG(q) {
  if (!q || !q.g) return blank(q && q.q);
  return String(q.q).split(/(\s+)/).map(function (t) {
    if (!t || /^\s+$/.test(t)) return t;
    if (/_{3,}|-{4,}/.test(t)) return blank(t);
    var k = gkey(t), v = q.g[k];
    return v ? '<span class="gw" data-w="' + esc(k) + '" data-p="' + esc(v[0]) + '" data-m="' + esc(v[1]) + '" data-b="' + esc(v[2] || "") + '">' + esc(t) + "</span>" : esc(t);
  }).join("");
}
function psgHtml(set) {
  var g = set.g || {};
  var h = String(set.passage).split(/(\s+)/).map(function (t) {
    if (!t || /^\s+$/.test(t) || /-{2,}\d{3}-{2,}|={3,}/.test(t)) return esc(t);
    var k = gkey(t), v = g[k];
    return v ? '<span class="gw" data-w="' + esc(k) + '" data-p="' + esc(v[0]) + '" data-m="' + esc(v[1]) + '" data-b="' + esc(v[2] || "") + '">' + esc(t) + "</span>" : esc(t);
  }).join("");
  return h.replace(/-{2,}(\d{3})-{2,}/g, '<span class="blankn">$1</span>').replace(/\n\n=====\n\n/g, "\n\n──────────\n\n");
}
document.addEventListener("click", function (e) {
  var w = e.target.closest && e.target.closest(".mkst .gw"); if (!w) return;
  var qb = w.closest(".passage") || w.closest(".qb") || w.parentNode, box = qb.querySelector(".gpop");
  var was = w.classList.contains("on");
  qb.querySelectorAll(".gw.on").forEach(function (x) { x.classList.remove("on"); });
  if (was) { if (box) box.remove(); return; }
  w.classList.add("on");
  if (!box) { box = document.createElement("div"); box.className = "gpop"; var pz = w.closest(".passage"); if (pz) { box.classList.add("inpsg"); pz.insertBefore(box, pz.firstChild); } else { var sent = w.closest(".sent,.qt") || w; sent.insertAdjacentElement("afterend", box); } }
  box.innerHTML = '<b class="gpw">' + esc(w.textContent.replace(/^[^A-Za-z0-9$%']+|[^A-Za-z0-9%']+$/g, "")) + '</b><span class="gpp">' + esc(w.dataset.p) + "</span>" + (w.dataset.b ? '<span class="gpb">원형 ' + esc(w.dataset.b) + "</span>" : "") + '<div class="gpm">' + esc(w.dataset.m) + "</div>";
});
function fmtExplain(t) {
  var labels = /^(정답|오답 분석|오답|암기|해석|어휘|의식의 흐름|정답 근거|보기 정리|지문 개요|발음|함정|Paraphrase|패러프레이즈|POINT|핵심)/;
  return String(t || "").split(/\n+/).map(function (ln) {
    ln = esc(ln.trim()); if (!ln) return "";
    var m = ln.match(labels);
    return "<p>" + (m ? '<b class="lb2">' + m[0] + "</b>" + ln.slice(m[0].length) : ln) + "</p>";
  }).join("");
}
function itemsOf(sec) {
  // 섹션 안의 모든 문항을 [key, 문항, 세트] 목록으로 평탄화
  var out = [];
  (sec.items || []).forEach(function (it, i) { out.push({ key: sec.id + ":i" + (it.src || "") + (it.no != null ? it.no : i), q: it, set: null }); });
  (sec.sets || []).forEach(function (st, si) { (st.questions || []).forEach(function (q, qi) { out.push({ key: sec.id + ":s" + si + "-" + (q.no != null ? q.no : qi), q: q, set: st }); }); });
  return out;
}
function secStats(meta) {
  var keys = meta.keys || [], done = 0, ok = 0;
  keys.forEach(function (k) { var p = S.prog[k]; if (p) { done++; if (p[1]) ok++; } });
  return { total: keys.length, done: done, ok: ok };
}

/* ---------- 로그인 ---------- */
function viewLogin(msg) {
  render(`
  <div class="card hero"><img class="logo" src="${LOGO}" alt="MAKE TOEIC" onerror="this.style.display='none'">
    <span class="kicker">MAKE TOEIC · 학습실</span><h1>메이크토익 수강생 학습실</h1>
    <p>등록한 이름과 휴대폰 번호 뒤 4자리로 입장하세요.</p></div>
  <div class="card">
    ${msg || ""}
    <label class="lb">이름</label><input class="in" id="mkst-name" autocomplete="name" placeholder="홍길동" value="${esc(ls("name") || "")}">
    <label class="lb">휴대폰 번호 뒤 4자리</label><input class="in" id="mkst-pin" inputmode="numeric" maxlength="4" placeholder="1234">
    <button class="btn" id="mkst-login">학습실 입장</button>
  </div>
  <div class="card peach"><b>처음이신가요?</b><p style="margin:6px 0 12px;font-size:14px">학습실은 메이크토익 수강생 전용입니다. 등록·기간 연장 문의는 카카오톡으로 해 주세요.</p>
    <a class="btn kakao" href="${KAKAO}" target="_blank" rel="noopener">💬 카카오톡 문의</a></div>`);
  var b = document.getElementById("mkst-login");
  function submit() {
    var n = document.getElementById("mkst-name").value.trim(), p = document.getElementById("mkst-pin").value.replace(/\D/g, "");
    if (!n || p.length !== 4) return viewLogin('<div class="msg err">이름과 휴대폰 뒤 4자리를 정확히 입력해 주세요.</div>');
    b.disabled = true; b.textContent = "확인 중…";
    api("student_login", { p_name: n, p_last4: p }).then(function (r) {
      if (r.status === "locked") return viewLogin('<div class="msg err">로그인 시도가 너무 많아요. 30분 뒤에 다시 시도하거나 카카오톡으로 문의해 주세요.</div>');
      if (r.status === "notfound") return viewLogin('<div class="msg err">등록된 수강생 정보를 찾지 못했어요. 이름과 번호를 확인해 주세요.</div>');
      ls("name", n); ls("token", r.token); S.token = r.token; S.profile = r.profile;
      track("study_login", { status: r.status });
      if (r.status === "expired") return viewExpired();
      boot();
    }).catch(function () { viewLogin('<div class="msg err">연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요.</div>'); });
  }
  b.onclick = submit;
  document.getElementById("mkst-pin").addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); });
}
function viewExpired() {
  var p = S.profile || {};
  render(`
  <div class="card hero"><span class="kicker">MAKE TOEIC · 학습실</span><h1>${esc(p.name || "")}님, 수강 기간이 끝났어요</h1>
    <p>이용 기간: ${esc(p.start_date || "")} ~ ${esc(p.end_date || "")}</p></div>
  <div class="card peach"><h2>계속 공부하고 싶다면</h2>
    <p style="font-size:14.5px">기간 연장(추가 이용) 후 바로 다시 이용할 수 있어요. 카카오톡으로 연장을 신청해 주세요. 그동안 푼 기록은 그대로 남아 있습니다.</p>
    <a class="btn kakao" href="${KAKAO}" target="_blank" rel="noopener">💬 카카오톡으로 연장 신청</a></div>
  <button class="btn ghost" id="mkst-out">다른 이름으로 로그인</button>`);
  document.getElementById("mkst-out").onclick = logout;
}
function logout() { if (S.token) api("student_logout", { p_token: S.token }).catch(function () { }); ls("token", null); S.token = null; S.catalog = null; S.cache = {}; viewLogin(); }

/* ---------- 데이터 ---------- */
function load(key) {
  if (S.cache[key]) return Promise.resolve(S.cache[key]);
  return api("get_content", { p_token: S.token, p_key: key }).then(function (r) {
    if (r.status === "login") { logout(); throw new Error("login"); }
    if (r.status === "expired") { S.profile = r.profile; viewExpired(); throw new Error("expired"); }
    S.cache[key] = r.data; return r.data;
  });
}
function boot() {
  render('<div class="empty">학습실을 여는 중…</div>');
  api("student_me", { p_token: S.token }).then(function (r) {
    if (r.status === "login") return logout();
    S.profile = r.profile;
    if (r.status === "expired") return viewExpired();
    S.level = S.level || ls("level") || r.profile.level || "기초";
    S.area = ls("area") || "RC";
    return Promise.all([load("catalog"), load("videos").catch(function () { return {}; }), api("get_progress", { p_token: S.token })]).then(function (x) {
      S.catalog = x[0] || { sections: [] }; S.videos = x[1] || {}; S.prog = x[2] || {};
      route();
    });
  }).catch(function (e) { if (e && (e.message === "login" || e.message === "expired")) return; render('<div class="empty">연결이 원활하지 않아요. 새로고침해 주세요.</div>'); });
}

/* ---------- 홈 ---------- */
// ---------- Series (월별 순환: 2026-10=3, 11=2, 12=1, 2027-01=3 …) ----------
function serForMonth(y, m) { var k = (y - 2026) * 12 + (m - 10); return [3, 2, 1][((k % 3) + 3) % 3]; }
function allowedSeries() {
  var p = S.profile || {}, out = [];
  var st = String(p.start_date || "").split("-"), en = String(p.end_date || "").split("-"), now = new Date();
  if (st.length < 2) return [serForMonth(now.getFullYear(), now.getMonth() + 1)];
  var y = +st[0], m = +st[1], ey = +en[0] || now.getFullYear(), em = +en[1] || now.getMonth() + 1;
  if (y * 12 + m < 2026 * 12 + 10) { y = 2026; m = 10; } // Series는 2026년 10월부터 시작
  var cy = now.getFullYear(), cm = now.getMonth() + 1;
  if (ey * 12 + em > cy * 12 + cm) { ey = cy; em = cm; }
  for (var i = 0; i < 36 && y * 12 + m <= ey * 12 + em; i++) { var v = serForMonth(y, m); if (out.indexOf(v) < 0) out.push(v); m++; if (m > 12) { m = 1; y++; } }
  if (!out.length) out.push(serForMonth(y, m));
  return out;
}
function curSer() { var a = allowedSeries(), v = +ls("ser"); return a.indexOf(v) >= 0 ? v : a[a.length - 1]; }
function viewPick() {
  var a = allowedSeries().slice().sort();
  render(`<div class="card hero"><span class="kicker">MAKE TOEIC · 학습실</span><h1>${esc((S.profile || {}).name || "")}님, Series를 선택하세요</h1><p>수강한 달의 Series가 열려 있어요.</p></div>` +
    a.map(function (n) { return `<button class="row" data-pick="${n}" style="padding:20px 18px"><span class="pill o" style="font-size:14px;padding:5px 12px">Series ${n}</span><span class="t"><b style="font-size:18px">Series ${n} 입장</b><small>LC · RC · A급 과제 · VOCA</small></span>›</button>`; }).join(""));
  app.querySelectorAll("[data-pick]").forEach(function (b) { b.onclick = function () { ls("ser", b.dataset.pick); S.picked = true; location.hash = "#/"; viewHome(); }; });
}
function serBar() {
  var a = allowedSeries(), c = curSer();
  return `<div class="serbar"><span>지금 보는 곳</span><b>Series ${c}</b>${a.length > 1 ? '<button data-go="#/pick">Series 바꾸기</button>' : ""}</div>`;
}
function seasonOf(list) {
  var s = list[0] || {};
  if (s.season) return +s.season;
  if (s.area === "LC" && /^LC 실전 모의고사/.test(s.group || "")) return 3;
  return 0;
}
function viewHome() {
  // 단계와 상관없이 모든 문제를 같이 풀고, 단계는 힌트 양만 바꾼다
  var p = S.profile, secs = S.catalog.sections.filter(function (s) { return s.area === S.area && s.group !== "A급 과제"; });
  var groups = {};
  secs.forEach(function (s) { (groups[s.group] = groups[s.group] || []).push(s); });
  var all = S.catalog.sections, tot = 0, done = 0, ok = 0;
  all.forEach(function (s) { var t = secStats(s); tot += t.total; done += t.done; ok += t.ok; });
  var wrongN = Object.keys(S.prog).filter(function (k) { return !S.prog[k][1]; }).length;
  render(`
  <div class="card hero"><img class="logo" src="${LOGO}" alt="MAKE TOEIC" onerror="this.style.display='none'">
    <span class="kicker">MAKE TOEIC · 학습실</span><h1>${esc(p.name)}님, 오늘도 한 걸음!</h1>
    <p>푼 문제 ${done} / ${tot} · 정답률 ${pct(ok, done)}%</p>
    <span class="dday">수강 기간 ${esc(p.end_date)}까지 · D-${p.days_left}</span></div>
  ${todayCard()}
  <div class="seg lv">${LEVELS.map(function (l) { return `<button data-lv="${l}" class="${S.level === l ? "on" : ""}">${l}${p.level === l ? " ★" : ""}</button>`; }).join("")}</div>
  <p style="margin:-4px 2px 10px;color:#5B6573;font-size:13px">${{ "기초": "💡 기초: 문제마다 유형과 풀이 힌트가 나와요.", "중급": "💡 중급: 문제 유형 힌트만 나와요.", "고급": "🎯 고급: 힌트 없이 실제 시험 그대로 풀어요." }[S.level] || ""}</p>
  ${serBar()}
  <div class="seg ar">${["LC", "RC"].map(function (a) { return `<button data-ar="${a}" class="${a.toLowerCase()} ${S.area === a ? "on" : ""}">${a === "LC" ? "🎧 LC" : "📖 RC"}<small>${a === "LC" ? "듣기 · Part 1~4" : "읽기 · Part 5~7"}</small></button>`; }).join("")}</div>
  <div class="areahead"><i style="background:${S.area === "LC" ? "#172844" : "#FF581F"}">${S.area}</i>${S.area === "LC" ? "듣기 학습" : "읽기 학습"}</div>
  ${(function () {
    function folder(g) {
    // 그룹은 A급 과제처럼 폴더: 누르면 단원 목록이 펼쳐진다 (열림 상태는 기억)
    var tt = 0, dd = 0; groups[g].forEach(function (s) { var t = secStats(s); tt += t.total; dd += t.done; });
    var open = ls("fold:" + g) === "1";
    return `<button class="row" data-fold="${esc(g)}" style="background:#FFF8F2;border-color:#F6D3BC"><span class="pill o">${open ? "📂" : "📁"}</span><span class="t"><b>${esc(g)}</b><small>${groups[g].length}개 단원 · ${tt}문항 · ${dd}개 풀이</small></span><span style="font-size:18px;color:#E95721">${open ? "▴" : "▾"}</span></button>` +
      (open ? `<div style="margin:-2px 0 10px 14px;border-left:3px solid #F6D3BC;padding-left:10px">` + groups[g].map(function (s) {
        var t = secStats(s);
        return `<button class="row" data-sec="${esc(s.id)}"><span class="t"><b>${esc(s.title)}</b><small>${t.total}문항 · ${t.done}개 풀이 · 정답 ${t.ok}</small></span><span class="pbar"><i style="width:${pct(t.done, t.total)}%"></i></span></button>`;
      }).join("") + `</div>` : "");
    }
    var gs = Object.keys(groups), base = gs.filter(function (g) { return !seasonOf(groups[g]); }), out = "";
    if (false) return `<div class="empty">${S.level} 단계 ${S.area} 콘텐츠는 준비 중이에요. 다른 단계나 ${S.area === "LC" ? "RC" : "LC"}를 확인해 보세요.</div>`;
    if (base.length) out += `<div class="sea"><b>BASIC</b>${S.area === "LC" ? "기본 유형 연습" : "기본 문제 연습"}</div>` + base.map(folder).join("");
    [curSer()].forEach(function (n) {
      var sg = gs.filter(function (g) { return seasonOf(groups[g]) === n; });
      var voca = `<a class="row" href="https://maketoeic.kr/ls/69ec23199641/voca/?s=${n}" style="background:linear-gradient(125deg,#14233E,#233C5C);color:#fff;border:0;text-decoration:none"><span class="pill o">VOCA</span><span class="t"><b style="color:#fff">VOCA 단어 암기장</b><small style="color:#D7E0EE">DAY 01~30 · 815단어 · 단어·파생어·예문 누르면 성우 발음</small></span>›</a>`;
      out += `<div class="sea"><b>SERIES ${n}</b>Series ${n}</div>` + voca + (sg.length ? sg.map(folder).join("") : `<div class="soonbox">Series ${n} ${S.area} 문제는 곧 열려요.</div>`);
    });
    return out;
  })()}
  <div class="grp">과제 · 복습</div>
  <button class="row" data-go="#/v" style="background:linear-gradient(125deg,#14233E,#233C5C);color:#fff;border:0"><span class="pill o">VOCA</span><span class="t"><b style="color:#fff">단어 암기장</b><small style="color:#D7E0EE">New 암기장 · 분야별 30 DAY · 품사 · 한 단어 10번 듣기 · 플래시카드</small></span>›</button>
  <button class="row" data-go="#/game" style="background:linear-gradient(125deg,#F26B1D,#FF9A4D);color:#fff;border:0"><span class="pill" style="background:#fff;color:#E95721">GAME</span><span class="t"><b style="color:#fff">🎮 단어 점프 게임</b><small style="color:#FFF1E6">뜻을 보고 철자가 맞는 단어 블록을 점프로 치기 · DAY별 스테이지</small></span>›</button>
  ${S.area === "LC" && reelList().length ? `<button class="row" data-go="#/reels" style="background:linear-gradient(125deg,#172844,#3A2A6B);color:#fff;border:0"><span class="pill" style="background:#FF4D6D;color:#fff">REELS</span><span class="t"><b style="color:#fff">🎬 기출 릴스 · PART 3·4</b><small style="color:#D7E0EE">원본 음원 + 단어 자막 + 정답 공개 · ${reelList().length}편</small></span>›</button>` : ""}
  ${S.area === "RC" ? `<button class="row" data-go="#/race" style="background:linear-gradient(125deg,#172844,#2B4C7E);color:#fff;border:0"><span class="pill" style="background:#FFD23F;color:#172844">GAME</span><span class="t"><b style="color:#fff">🚗 빈칸 레이서</b><small style="color:#D7E0EE">파트5 빈칸에 맞는 차선으로 운전 · 앞차 피하기 · 코인 · 시간 순위</small></span>›</button>` : ""}  <div class="tiles" style="margin-bottom:10px">
    <button class="tile" data-go="#/stats"><span class="pill n">실력 분석</span><b>유형별 정답률</b><small>약점 유형 · 맞춤 문제 추천</small></button>
    <button class="tile" data-go="#/mock"><span class="pill o">실전 테스트</span><b>${S.area === "LC" ? "파트2 25문제" : "파트5 30문제"}</b><small>${S.area === "LC" ? "실전처럼 자동 넘김" : "제한 시간 10분 · 랜덤 출제"}</small></button>
    <button class="tile" data-go="#/bm"><span class="pill n">저장한 문제</span><b>☆ ${bmList().length}문제</b><small>다시 볼 문제 모음</small></button>
    <button class="tile" data-go="#/weak"><span class="pill o">약점 맞춤</span><b>약점 유형 20문제</b><small>틀린·안 푼 문제 위주</small></button>
  </div>
  <div class="tiles">
    <button class="tile" data-go="#/a"><span class="pill o">A급 과제</span><b>Series ${curSer()} · 1~15회</b><small>PART 5·6·7 과제 · 해설</small></button>
    <button class="tile" data-go="#/wrong"><span class="pill n">오답노트</span><b>틀린 문제 ${wrongN}개</b><small>다시 풀고 졸업하기</small></button>
  </div>
  <div class="foot"><button class="btn ghost sm" id="mkst-logout">로그아웃</button><br><br><a href="/">메인페이지로 돌아가기</a></div>`);
  bindCommon();
  app.querySelectorAll("[data-lv]").forEach(function (b) { b.onclick = function () { S.level = b.dataset.lv; ls("level", S.level); viewHome(); }; });
  app.querySelectorAll("[data-ar]").forEach(function (b) { b.onclick = function () { S.area = b.dataset.ar; ls("area", S.area); viewHome(); }; });
  app.querySelectorAll("[data-goal]").forEach(function (b) { b.onclick = function () { ls("goal", b.dataset.goal); viewHome(); }; });
  app.querySelectorAll("[data-fold]").forEach(function (b) { b.onclick = function () { var k = "fold:" + b.dataset.fold; ls(k, ls(k) === "1" ? "0" : "1"); viewHome(); }; });
  document.getElementById("mkst-logout").onclick = logout;
}
function bindCommon() {
  app.querySelectorAll("[data-sec]").forEach(function (b) { b.onclick = function () { go("#/s/" + b.dataset.sec); }; });
  app.querySelectorAll("[data-go]").forEach(function (b) { b.onclick = function () { go(b.dataset.go); }; });
  app.querySelectorAll("[data-back]").forEach(function (b) { b.onclick = function () { history.length > 1 ? history.back() : go("#/"); }; });
}
function topbar(t) { return `<div class="top"><button class="back" data-back>‹ 뒤로</button><div class="tt">${esc(t)}</div></div>`; }

/* ---------- A급 과제 ---------- */
function serOf(s) { return +(s.series || 3); }
function viewA() {
  var al = allowedSeries(), ser = +(ls("aser") || curSer()); if (al.indexOf(ser) < 0) ser = curSer();
  var rounds = {}, cnt = { 1: 0, 2: 0, 3: 0 };
  S.catalog.sections.filter(function (s) { return s.group === "A급 과제"; }).forEach(function (s) { cnt[serOf(s)] = (cnt[serOf(s)] || 0) + 1; if (serOf(s) !== ser) return; (rounds[s.round] = rounds[s.round] || []).push(s); });
  var ns = Object.keys(rounds).map(Number).sort(function (a, b) { return a - b; });
  var tabs = `<div class="seg">${al.slice().sort().map(function (k) { return `<button data-ser="${k}" class="${ser === k ? "on" : ""}">Series ${k}</button>`; }).join("")}</div>`;
  render(topbar("A급 과제") + tabs + `<div class="card peach"><b>A급 과제 Series ${ser}</b><p style="margin:6px 0 0;font-size:14px">회차마다 PART 5 · 6 · 7 과제를 풀어 보세요. 채점과 해설이 바로 나옵니다.</p></div>` +
    (ns.length ? ns.map(function (n) {
      var tt = 0, dd = 0, ps = []; rounds[n].forEach(function (s) { var t = secStats(s); tt += t.total; dd += t.done; if (ps.indexOf(s.part) < 0) ps.push(s.part); });
      var vid = ser === 3 && S.videos[n];
      return `<button class="row" data-go="#/a/${ser === 3 ? n : "s" + ser + "-" + n}"><span class="pill o">${n}회</span><span class="t"><b>A급 과제 ${n}회</b><small>PART ${ps.sort().join("·")} · ${vid ? "▶ 해설강의 · " : ""}${tt}문항 · ${dd}개 풀이</small></span><span class="pbar"><i style="width:${pct(dd, tt)}%"></i></span></button>`;
    }).join("") : '<div class="empty">Series ' + ser + ' 과제는 곧 열려요.</div>'));
  app.querySelectorAll("[data-ser]").forEach(function (b) { b.onclick = function () { ls("aser", b.dataset.ser); viewA(); }; });
  bindCommon();
}
function ytId(u) { var m = String(u || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : null; }
function viewARound(n) {
  var ser = 3, m = String(n).match(/^s(\d)-(\d+)$/); if (m) { ser = +m[1]; n = m[2]; }
  if (allowedSeries().indexOf(ser) < 0) { render(topbar("A급 과제") + '<div class="empty">이 Series는 수강 기간에 포함되지 않았어요.</div>'); bindCommon(); return; }
  var secs = S.catalog.sections.filter(function (s) { return s.group === "A급 과제" && serOf(s) === ser && String(s.round) === String(n); }).sort(function (a, b) { return a.part - b.part; });
  // 해설강의는 각 PART 문제를 다 푼 뒤 그 PART 화면에서 골라 본다
  var q = S.videos.q || {}, has = function (s) { return (ser === 3 && s.part === 5 && S.videos[n]) || Object.keys(q).some(function (k) { return k.indexOf(s.id + "|") === 0; }); };
  render(topbar("A급 과제 " + (ser === 3 ? "" : "S" + ser + " · ") + n + "회") +
    `<div class="card peach" style="font-size:14px">PART별로 <b>전체 문제를 풀고 제출</b>하면 채점표가 나와요. 틀린 문제를 확인하고, 해설을 보고 싶은 문제를 골라 순서대로 볼 수 있어요(해설강의 포함).</div>` +
    secs.map(function (s) { var t = secStats(s), lec = has(s) ? (t.done >= t.total ? " · ▶ 해설강의 열림" : " · 🔒 해설강의") : ""; return `<button class="row" data-sec="${esc(s.id)}"><span class="pill n">PART ${s.part}</span><span class="t"><b>${esc(s.title)}</b><small>${t.total}문항 · ${t.done}개 풀이 · 정답 ${t.ok}${lec}</small></span><span class="pbar"><i style="width:${pct(t.done, t.total)}%"></i></span></button>`; }).join(""));
  bindCommon();
}

/* ---------- 섹션 & 문제 풀이 ---------- */
function viewSection(id) {
  render('<div class="empty">불러오는 중…</div>');
  load("sec:" + id).then(function (sec) {
    // 목록(catalog)에 없는 단원은 아직 공개 전
    if (!sec || !S.catalog.sections.some(function (s) { return s.id === id; })) return render(topbar("") + '<div class="empty">아직 공개되지 않은 단원이에요.</div>'), bindCommon();
    var list = itemsOf(sec), done = list.filter(function (x) { return S.prog[x.key]; }).length;
    var notes = sec.notes || [], exam = sec.group === "A급 과제", lc = isLc2(sec);
    render(topbar(sec.title) + `
      <div class="card"><span class="pill ${sec.area === "LC" ? "n" : "o"}">${sec.area} · PART ${sec.part}</span><span class="pill">${esc(S.level)} · ${S.level === "고급" ? "힌트 없음" : S.level === "중급" ? "힌트 조금" : "힌트 많이"}</span>
        <h2 style="margin-top:8px">${esc(sec.title)}</h2><p style="margin:0;color:#5B6573;font-size:14px">${list.length}문항 · ${done}개 풀이</p>
        <div style="display:grid;gap:8px;margin-top:14px">
          ${exam ? `${done >= list.length ? `<button class="btn navy" data-go="#/ex/${encodeURIComponent(sec.id)}">채점 결과 · 해설 볼 문제 고르기</button>` : ""}
            <button class="btn${done >= list.length ? " ghost" : ""}" id="mkst-start">${exGet(sec.id).ans ? "이어서 풀기" : done >= list.length ? "처음부터 다시 풀기" : "문제 풀기 (전체 풀고 제출)"}</button>
            <p style="margin:0;color:#5B6573;font-size:13px">전체 문제를 다 풀고 제출하면 채점표가 나와요. 틀린 문제를 확인하고, 해설을 보고 싶은 문제를 골라 순서대로 볼 수 있어요.</p>`
          : lc ? `${done >= list.length ? `<button class="btn navy" data-go="#/ex/${encodeURIComponent(sec.id)}">채점 결과 · 틀린 문제 다시 확인</button>` : ""}
            <button class="btn" id="mkst-lc">⏱ ${exGet("lc:" + sec.id).ans ? "실전 모드 이어서 풀기" : "실전 모드로 풀기 (자동 넘김)"}</button>
            <button class="btn ghost" id="mkst-start">한 문제씩 풀기 (채점·해설 바로 보기)</button>
            <p style="margin:0;color:#5B6573;font-size:13px">실전 모드: 실제 시험처럼 음성이 끝나고 몇 초 뒤 자동으로 다음 문제로 넘어가요. 남은 시간은 문제 위에 초로 표시돼요. 다 풀면 틀린 문제를 다시 확인할 수 있어요.</p>`
          : `<button class="btn" id="mkst-start">${done && done < list.length ? "이어서 풀기" : "문제 풀기"}</button>
          ${done ? '<button class="btn ghost" id="mkst-restart">처음부터 다시 풀기</button>' : ""}`}
          ${lectureButton(sec, done >= list.length)}
        </div></div>
      ${notes.length ? '<div class="grp">핵심 정리</div>' + notes.map(function (n, i) { return `<details class="nc" ${i === 0 ? "open" : ""}><summary>${esc(n.title || "정리 " + (i + 1))}</summary><div class="note">${esc(n.body)}</div></details>`; }).join("") : ""}`);
    bindCommon();
    var firstUndone = list.findIndex(function (x) { return !S.prog[x.key]; });
    document.getElementById("mkst-start").onclick = function () { quiz(sec, list, exam ? 0 : firstUndone < 0 ? 0 : firstUndone, sec.title); };
    var rs = document.getElementById("mkst-restart"); if (rs) rs.onclick = function () { quiz(sec, list, 0, sec.title); };
    var lb = document.getElementById("mkst-lc"); if (lb) lb.onclick = function () { lcStart(sec, list); };
  }).catch(function () { });
}
function isLc2(sec) { return sec.area === "LC" && sec.part === 2; }

/* ---------- LC 실전 모드: 문제 위 초 카운트다운 → 시간이 끝나면 자동으로 다음 문제 → 끝나면 채점표(틀린 문제 다시 확인) ---------- */
var LC_ANSWER_SEC = 5;  // 실제 시험처럼 음성이 끝난 뒤 답을 고르는 시간
function lcStart(sec, list) {
  var saved = exGet("lc:" + sec.id);
  Q = { sec: sec, list: list, i: saved.i || 0, ans: saved.ans || {}, title: sec.title, lc: true };
  lcPage();
}
function lcPage() {
  stopPlay();
  var x = Q.list[Q.i], q = x.q, run = PL.run, lv = S.level;
  exSet("lc:" + Q.sec.id, { ans: Q.ans, i: Q.i });
  var showQ = lv !== "고급", showOpt = lv === "기초";
  var qko = lv === "기초" && q.translation ? String(q.translation).split(" / ")[0] : "";
  render(`${topbar(Q.title)}
    <div class="qhead"><span>${esc(Q.sec.title)} · 실전 모드</span><span>${Q.i + 1} / ${Q.list.length}</span></div>
    <div class="bar"><i style="width:${pct(Q.i, Q.list.length)}%"></i></div>
    <div style="display:flex;justify-content:center;margin:6px 0 10px"><span id="lc-time" style="display:inline-flex;align-items:center;gap:6px;background:#172844;color:#fff;border-radius:999px;padding:8px 18px;font-size:20px;font-weight:900">⏱ <b id="lc-sec">--</b>초</span></div>
    <div class="card"><div class="qb"><span class="qno">${esc(q.no != null ? q.no : Q.i + 1)}.</span> ${showQ ? `<span class="sent">${esc(q.q)}</span>` : '<span class="sent">음성을 듣고 알맞은 응답을 고르세요.</span>'}
      ${qko ? `<div class="hint">💡 <b>질문 해석</b> ${esc(qko)}</div>` : ""}
      <div class="opts" ${showOpt ? "" : 'style="grid-template-columns:repeat(' + q.options.length + ',1fr)"'}>${q.options.map(function (o, k) {
        return `<button class="opt ${Q.ans[x.key] === k ? "sel" : ""}" data-k="${k}" ${showOpt ? "" : 'style="justify-content:center"'}><span class="k">${L[k]}</span>${showOpt ? `<span>${esc(o)}</span>` : ""}</button>`;
      }).join("")}</div>
      <div id="lc-tap" style="display:none;margin-top:12px"><button class="btn" id="lc-play">▶ 음성 시작</button></div></div>
    <div class="sticky" style="display:flex;gap:8px"><button class="btn ghost" id="lc-pause" style="flex:1">❚❚ 잠시 멈춤</button><button class="btn navy" id="lc-next" style="flex:1">다음 문제 ›</button></div>`);
  bindCommon();
  app.querySelectorAll(".opt").forEach(function (b) { b.onclick = function () { Q.ans[x.key] = +b.dataset.k; exSet("lc:" + Q.sec.id, { ans: Q.ans, i: Q.i }); app.querySelectorAll(".opt").forEach(function (o) { o.classList.toggle("sel", o === b); }); }; });
  var secEl = document.getElementById("lc-sec"), timeEl = document.getElementById("lc-time");
  var total = null, t0 = null, paused = false, pausedAt = 0, timer = null;
  function tick() {
    if (run !== PL.run) { clearInterval(timer); return; }
    if (total == null || paused) return;
    var left = Math.max(0, Math.ceil(total - (Date.now() - t0) / 1000));
    secEl.textContent = left; timeEl.style.background = left <= 3 ? "#E95721" : "#172844";
    if (left <= 0) { clearInterval(timer); next(); }
  }
  function begin() {
    if (!PL.audio) PL.audio = new Audio();
    var a = PL.audio; a.onended = a.onerror = null; a.src = audioUrl(q.audio); a.currentTime = 0;
    a.onloadedmetadata = function () { if (total == null) { total = Math.ceil(a.duration || 10) + LC_ANSWER_SEC; t0 = Date.now(); } };
    a.play().then(function () { if (total == null && a.duration) { total = Math.ceil(a.duration) + LC_ANSWER_SEC; t0 = Date.now(); } })
      .catch(function () { document.getElementById("lc-tap").style.display = ""; });  // 브라우저가 자동 재생을 막으면 한 번 눌러서 시작
    if (!q.audio) { total = 12; t0 = Date.now(); }
  }
  function next() {
    stopPlay(); clearInterval(timer);
    if (Q.i + 1 < Q.list.length) { Q.i++; lcPage(); scrollTop(); return; }
    // 마지막 문제 → 채점 저장 후 채점표
    Q.list.forEach(function (y) {
      var c = Q.ans[y.key] != null ? Q.ans[y.key] : -1, ok = c === y.q.answer, prev = S.prog[y.key];
      S.prog[y.key] = [c, ok, prev ? prev[2] + 1 : 1];
      api("save_progress", { p_token: S.token, p_item: y.key, p_chosen: c, p_correct: ok }).catch(function () { });
    });
    exSet("lc:" + Q.sec.id, null);
    if (Q.onDone) return Q.onDone();
    go("#/ex/" + encodeURIComponent(Q.sec.id));
  }
  document.getElementById("lc-play").onclick = function () { document.getElementById("lc-tap").style.display = "none"; begin(); };
  document.getElementById("lc-next").onclick = next;
  document.getElementById("lc-pause").onclick = function () {
    var b = this, a = PL.audio;
    if (!paused) { paused = true; pausedAt = Date.now(); if (a) a.pause(); b.textContent = "▶ 계속"; }
    else { paused = false; if (t0) t0 += Date.now() - pausedAt; if (a && a.currentTime < (a.duration || 0)) a.play().catch(function () { }); b.textContent = "❚❚ 잠시 멈춤"; }
  };
  timer = setInterval(tick, 200);
  begin();
}

var Q = null;
function quiz(sec, list, start, title, backHash) {
  // 같은 세트(지문)의 문항은 한 화면에 묶어서 보여 준다
  var pages = [], seen = {};
  list.forEach(function (x, i) {
    if (x.set) { var k = sec.id + "|" + (x.set.range || (sec.sets || []).indexOf(x.set)); if (seen[k] != null) { pages[seen[k]].push(x); return; } seen[k] = pages.length; }
    pages.push([x]);
  });
  var startPage = pages.findIndex(function (pg) { return pg.some(function (x) { return x === list[start]; }); });
  Q = { sec: sec, pages: pages, i: Math.max(0, startPage), title: title, ok: 0, n: 0, back: backHash };
  // A급 과제: 시험처럼 전부 풀고 제출 → 채점표에서 해설 볼 문제를 골라 순서대로 본다
  if (sec.group === "A급 과제" && !backHash) {
    var saved = exGet(sec.id);
    Q.exam = true; Q.list = list; Q.ans = saved.ans || {}; Q.i = start === 0 && !saved.ans ? 0 : (saved.i || 0);
    return examPage();
  }
  page();
}
function exGet(id) { try { return JSON.parse(ls("exam:" + id) || "{}") || {}; } catch (e) { return {}; } }
function exSet(id, v) { ls("exam:" + id, v ? JSON.stringify(v) : null); }
/* ---------- 단계별 힌트: 모든 단계가 같은 문제를 풀고, 기초는 힌트 많이 · 중급은 조금 · 고급은 원본 그대로 ---------- */
function qType(q) {
  if (q.qtype) return q.qtype;
  var ls2 = String(q.explain || "").split("\n");
  for (var i = 0; i < ls2.length; i++) if (/^유형\s*:/.test(ls2[i])) return ls2[i].replace(/^유형\s*:\s*/, "");
  if (/^정답/.test(ls2[0] || "") && ls2[1] && ls2[1].indexOf(":") < 0) return ls2[1];
  return "";
}
function qFlow(q, n) {
  var m = String(q.explain || "").match(/(?:의식의 흐름|이렇게 본다)\s*:\s*([^\n]+)/);
  if (!m) return "";
  var ss = m[1].match(/[^.!?]+[.!?]?/g) || [m[1]];
  return ss.slice(0, n).join("").trim();
}
function hintHtml(q, set) {
  var lv = S.level;
  if (lv === "고급" || q.audio) return "";  // LC Part 2는 스크립트 공개 정도로 단계를 나눈다
  var t = qType(q), parts = [];
  if (t) parts.push(`<b>유형</b> ${esc(t)}`);
  // Part 5 문항: 기초는 그 문제만을 위해 쓴 힌트(hint), 중급은 유형만
  if (!set) {
    if (lv === "기초" && q.hint) parts.push(`<b>힌트</b> ${esc(q.hint)}`);
    if (lv === "기초" && q.expr) parts.push(`<b>📌 중요 표현</b><br>${String(q.expr).split(/\s*\/\s*/).map(esc).join("<br>")}`);
    return parts.length ? `<div class="hint">💡 ${parts.join("<br>")}</div>` : "";
  }
  var f = lv === "기초" ? qFlow(q, set ? 3 : 2) : !t ? qFlow(q, 1) : "";
  if (f) parts.push(`<b>풀이 힌트</b> ${esc(f)}`);
  return parts.length ? `<div class="hint">💡 ${parts.join("<br>")}</div>` : "";
}
// Part 5 문장 읽어주기 (기초·중급): 풀기 전에는 빈칸을 "blank"로, 채점 뒤에는 정답을 넣어 읽는다. 🔁 반복 설정을 따른다
function sayBtn(q, filled) {
  return "";  // 원장님 요청(2026-10-07): RC 문제의 문장 읽어주기·반복 버튼은 쓰지 않는다
  if (S.level === "고급" || q.audio || !q.q || Q && Q.sec && Q.sec.area !== "RC") return "";
  var txt = String(q.q).replace(/_{3,}|-{4,}/g, filled ? (q.options || [])[q.answer] || "blank" : "blank");
  var on = ls(REP_KEY) === "1";
  return `<div style="display:flex;gap:6px;margin-top:6px"><button class="btn ghost sm" data-saytxt="${esc(txt)}">🔊 문장 읽어주기</button><button class="btn ${on ? "" : "ghost"} sm" data-rep2>${on ? "🔁 반복 켜짐" : "🔁 반복 듣기"}</button></div>`;
}
function bindSay() {
  app.querySelectorAll("[data-rep2]").forEach(function (b) { b.onclick = function () { var on = ls(REP_KEY) !== "1"; ls(REP_KEY, on ? "1" : "0"); app.querySelectorAll("[data-rep2]").forEach(function (x) { x.textContent = on ? "🔁 반복 켜짐" : "🔁 반복 듣기"; x.className = "btn sm " + (on ? "" : "ghost"); }); }; });
  app.querySelectorAll("[data-saytxt]").forEach(function (b) {
    b.onclick = function () {
      if (!window.speechSynthesis) return;
      if (speechSynthesis.speaking) { speechSynthesis.cancel(); b.textContent = "🔊 문장 읽어주기"; return; }
      var txt = b.dataset.saytxt, run = ++PL.run;
      function once() {
        var u = new SpeechSynthesisUtterance(txt); u.lang = "en-US"; u.rate = 0.9;
        var v = speechSynthesis.getVoices().filter(function (x) { return /^en[-_]US/i.test(x.lang); })[0]; if (v) u.voice = v;
        u.onend = function () { if (run === PL.run && ls(REP_KEY) === "1" && document.contains(b)) setTimeout(function () { if (run === PL.run) once(); }, 1200); else b.textContent = "🔊 문장 읽어주기"; };
        speechSynthesis.speak(u);
      }
      b.textContent = "■ 멈춤"; once();
    };
  });
}
function scriptHtml(lines) {
  // 스크립트 줄을 누르면 그 부분 음성만 재생
  return `<div class="card script" style="margin-top:12px"><b>스크립트</b>${lines.some(function (l) { return l.audio; }) ? '<small style="color:#5B6573;margin-left:6px">문장을 누르면 그 부분만 읽어 줘요</small>' : ""}${lines.map(function (l) { return `<div class="ln"${l.audio ? ` data-au="${esc(l.audio)}"` : ""}>${l.audio ? '<span class="pl">▶</span>' : ""}<span class="spk">${esc(l.spk || "")}</span>${esc(l.en)}${l.ko ? `<div class="ko">${esc(l.ko)}</div>` : ""}</div>`; }).join("")}</div>`;
}
function passageHtml(set) {
  return set.passage ? `<div class="passage">${psgHtml(set)}</div>` : "";
}
// 음성 박스(▶ 재생 + 🔁 반복 듣기). 반복을 켜 두면 끝날 때마다 1.5초 쉬고 다시 재생 (설정은 다음 문제에도 유지)
var REP_KEY = "rep";
function bindPlayer() {
  var box = app.querySelector(".audio"), pl = box && box.querySelector(".play:not(#mkst-tts)");
  if (!pl) return;
  var a = box.querySelector("audio"), rb = box.querySelector(".rep"), cnt = box.querySelector(".repn");
  // 다시 그려져도(보기 선택 등) 재생 중이던 음성은 끊기지 않게 이어 붙인다
  if (PL.box && PL.box.src === a.src && !PL.box.paused) { a.replaceWith(PL.box); a = PL.box; pl.textContent = "❚❚"; }
  PL.box = a;
  var on = ls(REP_KEY) === "1", n = +(a.dataset.n || 0);
  function label() { if (rb) { rb.textContent = on ? "🔁 반복 켜짐" : "🔁 반복 듣기"; rb.className = "btn sm rep " + (on ? "" : "ghost"); } if (cnt) cnt.textContent = n > 1 ? n + "번째" : ""; }
  label();
  a.onplay = function () { n++; a.dataset.n = n; label(); };
  a.onended = function () {
    if (on && document.contains(a)) setTimeout(function () { if (on && document.contains(a) && a.paused) a.play().catch(function () { }); }, 1500);
    else pl.textContent = "▶";
  };
  pl.onclick = function () { if (a.paused) { a.play().catch(function () { }); pl.textContent = "❚❚"; } else { a.pause(); pl.textContent = "▶"; } };
  if (rb) rb.onclick = function () { on = !on; ls(REP_KEY, on ? "1" : "0"); label(); };
}

/* ---------- A급 과제 시험 모드 ---------- */
function examPage() {
  var pg = Q.pages[Q.i], set = pg[0].set;
  exSet(Q.sec.id, { ans: Q.ans, i: Q.i });
  var qs = pg.map(function (x) {
    var q = x.q;
    return `<div class="qb">${bmBtn(x.key)}${q.no != null ? `<span class="qno">${esc(q.no)}.</span> ` : ""}${q.q ? `<span class="${set ? "qt" : "sent"}">${blankG(q)}</span>` : ""}
      ${q.pron && S.level === "기초" ? `<div class="pron">${esc(q.pron)}</div>` : ""}${hintHtml(q, set)}${set ? "" : sayBtn(q, false)}
      <div class="opts">${(q.options || []).map(function (o, k) { return `<button class="opt ${Q.ans[x.key] === k ? "sel" : ""}" data-key="${esc(x.key)}" data-k="${k}"><span class="k">${L[k]}</span><span>${esc(o)}</span></button>`; }).join("")}</div></div>`;
  }).join("");
  var left = set ? (set.read_audio ? audioBox(set.read_audio, "지문 읽어주기") : "") + passageHtml(set) + (set.translation && S.level === "기초" ? `<details class="nc" style="margin-top:12px"><summary>지문 해석 보기 (기초 힌트)</summary><div class="note">${esc(set.translation)}</div></details>` : "") : "";
  var answered = Q.list.filter(function (x) { return Q.ans[x.key] != null; }).length, last = Q.i + 1 === Q.pages.length;
  render(`${topbar(Q.title)}
    <div class="qhead"><span>${esc(Q.sec.title)} · ${Q.deadline ? `⏱ <b id="ex-time">--:--</b>` : "시험 모드"}</span><span>${Q.i + 1} / ${Q.pages.length}</span></div>
    <div class="bar"><i style="width:${pct(answered, Q.list.length)}%"></i></div>
    <div class="twocol ${set ? "set" : ""}"><div>${left}</div><div class="card">${qs}</div></div>
    <div class="sticky" style="display:flex;gap:8px">${Q.i ? '<button class="btn ghost" id="ex-prev" style="flex:1">‹ 이전</button>' : ""}
      <button class="btn ${last ? "" : "navy"}" id="ex-next" style="flex:2">${last ? `제출하고 채점하기 (${answered}/${Q.list.length})` : "다음 ›"}</button></div>`);
  bindCommon(); bindPlayer(); bindSay(); bindBm();
  app.querySelectorAll(".opt").forEach(function (b) { b.onclick = function () { Q.ans[b.dataset.key] = +b.dataset.k; exSet(Q.sec.id, { ans: Q.ans, i: Q.i }); app.querySelectorAll('.opt[data-key="' + b.dataset.key + '"]').forEach(function (o) { o.classList.toggle("sel", o === b); }); var nb = document.getElementById("ex-next"); if (last) nb.textContent = "제출하고 채점하기 (" + Q.list.filter(function (x) { return Q.ans[x.key] != null; }).length + "/" + Q.list.length + ")"; }; });
  var pv = document.getElementById("ex-prev"); if (pv) pv.onclick = function () { stopPlay(); Q.i--; examPage(); scrollTop(); };
  function submit(force) {
    var left2 = Q.list.filter(function (x) { return Q.ans[x.key] == null; }).length;
    if (!force && left2 && !confirm("아직 안 푼 문제가 " + left2 + "개 있어요. 그대로 제출할까요? (안 푼 문제는 오답 처리)")) return;
    clearInterval(Q.tick);
    Q.list.forEach(function (x) {
      var c = Q.ans[x.key] != null ? Q.ans[x.key] : -1, ok = c === x.q.answer, prev = S.prog[x.key];
      S.prog[x.key] = [c, ok, prev ? prev[2] + 1 : 1];
      api("save_progress", { p_token: S.token, p_item: x.key, p_chosen: c, p_correct: ok }).catch(function () { });
    });
    exSet(Q.sec.id, null);
    if (Q.onDone) return Q.onDone();
    go("#/ex/" + encodeURIComponent(Q.sec.id));
  }
  document.getElementById("ex-next").onclick = function () {
    stopPlay();
    if (!last) { Q.i++; examPage(); scrollTop(); return; }
    submit(false);
  };
  // 실전 테스트: 남은 시간 표시, 시간이 다 되면 자동 제출
  clearInterval(Q.tick);
  if (Q.deadline) {
    var te = document.getElementById("ex-time"), run = PL.run;
    var upd = function () {
      if (!document.contains(te)) { clearInterval(Q.tick); return; }
      var s2 = Math.max(0, Math.round((Q.deadline - Date.now()) / 1000));
      te.textContent = Math.floor(s2 / 60) + ":" + String(s2 % 60).padStart(2, "0"); te.style.color = s2 <= 60 ? "#E95721" : "";
      if (s2 <= 0) { clearInterval(Q.tick); alert("시간이 끝났어요. 자동으로 제출합니다."); submit(true); }
    };
    upd(); Q.tick = setInterval(upd, 500);
  }
  scrollTop();
}
// 채점표: 맞은/틀린 문제를 보고, 해설을 볼 문제를 고른다 (틀린 문제는 미리 체크)
function viewExam(id) {
  render('<div class="empty">불러오는 중…</div>');
  load("sec:" + id).then(function (sec) {
    var list = itemsOf(sec);
    if (list.some(function (x) { return !S.prog[x.key]; })) return go("#/s/" + encodeURIComponent(id));
    var pick = {}, ok = 0;
    list.forEach(function (x) { var p = S.prog[x.key]; if (p[1]) ok++; else pick[x.key] = 1; });
    function cnt() { return list.filter(function (x) { return pick[x.key]; }).length; }
    function draw() {
      var lastSet = null;
      render(topbar(sec.title) + `<div class="card hero score"><span class="kicker">채점 결과</span><div class="big">${ok} / ${list.length}</div><p>정답률 ${pct(ok, list.length)}% · 틀린 문제 ${list.length - ok}개</p></div>
        <div class="card" style="font-size:14px">해설을 보고 싶은 문제를 골라 주세요. <b>틀린 문제는 미리 체크</b>해 두었어요.
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px"><button class="btn ghost sm" id="ex-wrong">틀린 문제만</button><button class="btn ghost sm" id="ex-all">전체 선택</button><button class="btn ghost sm" id="ex-none">선택 해제</button></div></div>
        <div class="card" style="padding:6px 12px">${list.map(function (x) {
          var p = S.prog[x.key], q = x.q, head = "";
          if (x.set && x.set !== lastSet) { lastSet = x.set; head = `<div style="font-weight:800;color:#172844;margin:12px 0 4px">${esc(x.set.range || "")}번 지문</div>`; }
          return head + `<label style="display:flex;align-items:center;gap:10px;padding:9px 2px;border-bottom:1px solid #EEF1F5;cursor:pointer">
            <input type="checkbox" data-pk="${esc(x.key)}" ${pick[x.key] ? "checked" : ""} style="width:20px;height:20px;accent-color:#F26B1D">
            <span style="font-weight:800;min-width:46px">${esc(q.no != null ? q.no : "")}번</span>
            <span class="pill ${p[1] ? "n" : "o"}" style="min-width:34px;text-align:center">${p[1] ? "○" : "✕"}</span>
            <span style="color:#5B6573;font-size:13.5px">내 답 ${p[0] >= 0 ? "(" + L[p[0]] + ")" : "—"} · 정답 (${L[q.answer]})</span></label>`;
        }).join("")}</div>
        <div style="display:grid;gap:8px">${lectureButton(sec, true)}<button class="btn ghost" id="ex-retry">처음부터 다시 풀기</button></div>
        <div class="sticky"><button class="btn navy" id="ex-go" ${cnt() ? "" : "disabled"}>선택한 ${cnt()}문제 해설 보기</button></div>`);
      bindCommon();
      app.querySelectorAll("[data-pk]").forEach(function (c) { c.onchange = function () { if (c.checked) pick[c.dataset.pk] = 1; else delete pick[c.dataset.pk]; var g = document.getElementById("ex-go"); g.textContent = "선택한 " + cnt() + "문제 해설 보기"; g.disabled = !cnt(); }; });
      document.getElementById("ex-wrong").onclick = function () { pick = {}; list.forEach(function (x) { if (!S.prog[x.key][1]) pick[x.key] = 1; }); draw(); };
      document.getElementById("ex-all").onclick = function () { pick = {}; list.forEach(function (x) { pick[x.key] = 1; }); draw(); };
      document.getElementById("ex-none").onclick = function () { pick = {}; draw(); };
      document.getElementById("ex-retry").onclick = function () { if (isLc2(sec)) { exSet("lc:" + sec.id, null); return lcStart(sec, list); } exSet(sec.id, null); quiz(sec, list, 0, sec.title); };
      document.getElementById("ex-go").onclick = function () { examReview(sec, list.filter(function (x) { return pick[x.key]; }), draw); };
    }
    draw();
  }).catch(function () { });
}
// 고른 문제만 순서대로: 지문 → 문제(내 답·정답) → 해석·해설 → 해설강의
function examReview(sec, picked, back) {
  var q2 = S.videos.q || {}, blocks = [], cur = null;
  picked.forEach(function (x) { if (x.set && cur && cur.set === x.set) cur.xs.push(x); else { cur = { set: x.set, xs: [x] }; blocks.push(cur); } });
  function lec(key) { var v = ytId(q2[key]); return v ? `<button class="btn ghost sm" data-lec="${v}" style="margin-top:10px">▶ 이 ${key.indexOf("|s") > 0 ? "지문" : "문제"} 해설강의 보기</button>` : ""; }
  render(`<div class="top"><button class="back" id="rv-back">‹ 채점표</button><div class="tt">해설 보기 · ${picked.length}문제</div></div>` + blocks.map(function (b) {
    var qs = b.xs.map(function (x) {
      var q = x.q, p = S.prog[x.key] || [-1, false];
      return `<div class="qb"><span class="qno">${esc(q.no != null ? q.no : "")}.</span> <span class="pill ${p[1] ? "n" : "o"}">${p[1] ? "○ 정답" : "✕ 오답"}</span> ${q.audio ? `<button class="btn ghost sm" data-au="${esc(q.audio)}" style="margin-left:4px">🔊 다시 듣기</button> ` : ""}${q.q ? `<span class="${b.set ? "qt" : "sent"}">${blankG(q)}</span>` : ""}
        <div class="opts">${(q.options || []).map(function (o, k) { return `<div class="opt ${k === q.answer ? "right" : k === p[0] ? "wrong" : ""}"><span class="k">${L[k]}</span><span>${esc(o)}</span></div>`; }).join("")}</div>
        <div class="ex">${q.translation ? `<p><b class="lb2">해석</b> ${esc(q.translation)}</p>` : ""}${fmtExplain(q.explain)}${q.vocab ? `<p><b class="lb2">어휘</b> ${esc(q.vocab)}</p>` : ""}</div>
        ${b.set ? "" : lec(sec.id + "|i" + (sec.items || []).indexOf(q))}</div>`;
    }).join("");
    if (!b.set) return `<div class="card">${qs}</div>`;
    return `<div class="card"><div style="font-weight:800;color:#172844;margin-bottom:8px">${esc(b.set.range || "")}번 지문</div>
      <details class="nc"><summary>지문 보기</summary>${passageHtml(b.set)}</details>
      ${b.set.translation ? `<details class="nc"><summary>지문 해석 보기</summary><div class="note">${esc(b.set.translation)}</div></details>` : ""}
      ${qs}${lec(sec.id + "|s" + (sec.sets || []).indexOf(b.set))}</div>`;
  }).join("") + `<div style="display:grid;gap:8px"><button class="btn ghost" id="rv-back2">채점표로 돌아가기</button></div>`);
  document.getElementById("rv-back").onclick = document.getElementById("rv-back2").onclick = function () { stopPlay(); back(); scrollTop(); };
  app.querySelectorAll("[data-au]").forEach(function (b) { b.onclick = function () { stopPlay(); playOne(b.dataset.au, null, PL.run); }; });
  app.querySelectorAll("[data-lec]").forEach(function (b) { b.onclick = function () { b.outerHTML = `<div class="video" style="margin-top:10px"><iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.lec}?rel=0&autoplay=1" title="해설강의" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`; }; });
  scrollTop();
}
function page() {
  var pg = Q.pages[Q.i], st = { sel: {}, done: false, show: false };
  function draw() {
    var set = pg[0].set;
    // LC Part 2 단계: 기초 = 질문·보기 글 + 질문 해석까지 보임 / 중급 = 질문 글만 / 고급 = 실제 시험처럼 음성만 (채점 후 공개)
    var lc2 = Q.sec.area === "LC" && !set && pg[0].q.audio && !st.done && !st.show;
    var hide = lc2 && S.level === "고급", hideOpt = lc2 && S.level !== "기초";
    var qs = pg.map(function (x, j) {
      var q = x.q, opts = q.options || [];
      var qko = lc2 && S.level === "기초" && q.translation ? String(q.translation).split(" / ")[0] : "";
      return `<div class="qb">${bmBtn(x.key)}${q.no != null ? `<span class="qno">${esc(q.no)}.</span> ` : ""}${q.image ? `<img class="lcimg" src="${esc(audioUrl(q.image))}" alt="">` : ""}${q.q && !hide ? `<span class="${set ? "qt" : "sent"}">${blankG(q)}</span>` : hide && !q.image ? '<span class="sent">음성을 듣고 알맞은 응답을 고르세요.</span>' : ""}
        ${q.pron && (st.done || S.level === "기초") ? `<div class="pron">${esc(q.pron)}</div>` : ""}${set ? "" : sayBtn(q, st.done)}
        ${qko ? `<div class="hint">💡 <b>질문 해석</b> ${esc(qko)}</div>` : ""}
        ${st.done ? "" : hintHtml(q, set)}
        <div class="opts" ${hideOpt ? 'style="grid-template-columns:repeat(' + opts.length + ',1fr)"' : ""}>${opts.map(function (o, k) {
          var c = st.sel[j] === k ? "sel" : ""; if (st.done) c = k === q.answer ? "right" : (st.sel[j] === k ? "wrong" : "");
          return `<button class="opt ${c}" data-j="${j}" data-k="${k}" ${hideOpt ? 'style="justify-content:center"' : ""}><span class="k">${L[k]}</span>${hideOpt ? "" : `<span>${esc(o)}</span>`}</button>`;
        }).join("")}</div>
        ${hideOpt && S.level === "중급" ? '<button class="btn ghost sm" id="mkst-show" style="margin-top:10px">보기 스크립트 보기</button>' : ""}
        ${st.done ? `<div class="ex">${q.translation ? `<p><b class="lb2">해석</b> ${esc(q.translation)}</p>` : ""}${fmtExplain(q.explain)}${q.vocab ? `<p><b class="lb2">어휘</b> ${esc(q.vocab)}</p>` : ""}</div>${q.script ? scriptHtml(q.script) : ""}` : ""}
</div>`;
    }).join("");
    var left = set ? `${set.audio ? audioBox(set.audio) : set.read_audio ? audioBox(set.read_audio, "지문 읽어주기")
        : set.passage && window.speechSynthesis ? '<div class="audio"><button class="play" id="mkst-tts">▶</button><span style="color:#5B6573;font-size:14px">지문 읽어주기</span></div>' : ""}
        ${set.passage ? `<div class="passage">${psgHtml(set)}</div>` : ""}
        ${set.image ? `<img class="lcimg" src="${esc(audioUrl(set.image))}" alt="">` : ""}${set.script && st.done ? scriptHtml(set.script) : ""}
        ${set.translation && (st.done || S.level === "기초") ? `<details class="nc" style="margin-top:12px"><summary>지문 해석 보기${st.done ? "" : " (기초 힌트)"}</summary><div class="note">${esc(set.translation)}</div></details>` : ""}` : (pg[0].q.audio ? audioBox(pg[0].q.audio) : "");
    render(`${topbar(Q.title)}
      <div class="qhead"><span>${esc(Q.sec.title)}</span><span>${Q.i + 1} / ${Q.pages.length}</span></div>
      <div class="bar"><i style="width:${pct(Q.i, Q.pages.length)}%"></i></div>
      <div class="twocol ${set ? "set" : ""}"><div>${left}</div><div class="card">${qs}</div></div>
      <div class="sticky">${st.done ? `<button class="btn navy" id="mkst-next">${Q.i + 1 < Q.pages.length ? "다음" : "결과 보기"}</button>`
        : `<button class="btn" id="mkst-check" ${Object.keys(st.sel).length < pg.length ? "disabled" : ""}>채점하기</button>`}</div>`);
    bindCommon();
    app.querySelectorAll("[data-au]").forEach(function (b) { b.onclick = function () { stopPlay(); playOne(b.dataset.au, null, PL.run); }; });
    app.querySelectorAll(".opt").forEach(function (b) { b.onclick = function () { if (st.done) return; st.sel[b.dataset.j] = +b.dataset.k; draw(); }; });
    var ck = document.getElementById("mkst-check");
    if (ck) ck.onclick = function () {
      st.done = true;
      pg.forEach(function (x, j) {
        var ok = st.sel[j] === x.q.answer; Q.n++; if (ok) Q.ok++;
        var prev = S.prog[x.key]; S.prog[x.key] = [st.sel[j], ok, prev ? prev[2] + 1 : 1];
        api("save_progress", { p_token: S.token, p_item: x.key, p_chosen: st.sel[j], p_correct: ok }).catch(function () { });
      });
      draw();
    };
    var sh = document.getElementById("mkst-show"); if (sh) sh.onclick = function () { st.show = true; draw(); };
    var nx = document.getElementById("mkst-next");
    if (nx) nx.onclick = function () { stopPlay(); Q.i++; Q.i < Q.pages.length ? page() : result(); scrollTop(); };
    var tts = document.getElementById("mkst-tts");
    if (tts && speechSynthesis.speaking) tts.textContent = "❚❚";
    if (tts) tts.onclick = function () {
      // 음원 파일이 아직 없는 지문은 브라우저 음성으로 읽어 준다 (빈칸은 "blank")
      if (speechSynthesis.speaking) { speechSynthesis.cancel(); tts.textContent = "▶"; return; }
      var txt = set.passage.replace(/-{2,}\s*\d{3}\s*-{2,}/g, " blank ").replace(/=====/g, ". ");
      var u = new SpeechSynthesisUtterance(txt); u.lang = "en-US"; u.rate = 0.9;
      var v = speechSynthesis.getVoices().filter(function (x) { return /^en[-_]US/i.test(x.lang); })[0]; if (v) u.voice = v;
      u.onend = function () { tts.textContent = "▶"; };
      speechSynthesis.speak(u); tts.textContent = "❚❚";
    };
    bindPlayer(); bindSay(); bindBm();
  }
  draw(); scrollTop();
}
/* ---------- 해설강의 (문제를 다 푼 뒤 골라 보기) ----------
   videos = { "<회차>": 주소(들), q: { "섹션id|i문항순서" 또는 "섹션id|s세트순서": 주소 } } */
function lecturesOf(sec) {
  var out = [], by = {}, q = S.videos.q || {};
  function add(u, label) { var v = ytId(u); if (!v) return null; if (!by[v]) { by[v] = { vid: v, nos: [], label: label }; out.push(by[v]); } return by[v]; }
  if (sec.group === "A급 과제" && sec.round && sec.part === 5 && (sec.series || 3) === 3) [].concat(S.videos[sec.round] || []).join(" ").split(/\s+/).forEach(function (u, i) { add(u, "A급 과제 " + sec.round + "회 강의" + (i ? " " + (i + 1) : "")); });
  (sec.items || []).forEach(function (it, i) { var l = add(q[sec.id + "|i" + i]); if (l && it.no != null) l.nos.push(it.no); });
  (sec.sets || []).forEach(function (st, si) { var l = add(q[sec.id + "|s" + si]); if (l) l.nos.push((st.range || "") + "번 지문"); });
  out.forEach(function (l) {
    if (l.label) return;
    var n = l.nos;
    l.label = !n.length ? "해설강의" : typeof n[0] === "string" ? n.join(" · ") : n.length === 1 ? n[0] + "번 문제" : n[0] + "~" + n[n.length - 1] + "번 (" + n.length + "문항)";
  });
  return out;
}
function viewLectures(id) {
  render('<div class="empty">불러오는 중…</div>');
  load("sec:" + id).then(function (sec) {
    var L2 = lecturesOf(sec), cur = 0;
    if (itemsOf(sec).some(function (x) { return !S.prog[x.key]; }))
      return render(topbar("해설강의") + `<div class="card peach" style="font-size:14px">🔒 <b>${esc(sec.title)}</b> 문제를 끝까지 풀면 해설강의를 볼 수 있어요.</div><button class="btn" data-sec="${esc(sec.id)}">문제 풀러 가기</button>`), bindCommon();
    function frame(i, auto) { return `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${L2[i].vid}?rel=0${auto ? "&autoplay=1" : ""}" title="${esc(L2[i].label)}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`; }
    function draw(auto) {
      render(topbar("해설강의") + `<div class="card"><span class="pill o">해설강의</span><h2 style="margin:8px 0 0">${esc(sec.title)}</h2><p style="margin:4px 0 0;color:#5B6573;font-size:14px">보고 싶은 강의를 골라 주세요 · ${L2.length}개</p></div>` +
        (L2.length ? frame(cur, auto) + `<div class="grp">강의 목록</div>` + L2.map(function (l, i) {
          return `<button class="row${i === cur ? " on" : ""}" data-li="${i}" style="${i === cur ? "border-color:#F26B1D;background:#FFF4EC" : ""}"><span class="pill ${i === cur ? "o" : "n"}">${i === cur ? "▶ 재생 중" : i + 1}</span><span class="t"><b>${esc(l.label)}</b><small class="yt-t" data-v="${l.vid}">${esc(S.ytTitle[l.vid] || "")}</small></span>›</button>`;
        }).join("") : '<div class="empty">이 단원의 해설강의는 준비 중이에요.</div>'));
      bindCommon();
      app.querySelectorAll("[data-li]").forEach(function (b) { b.onclick = function () { cur = +b.dataset.li; draw(true); scrollTop(); }; });
      // 영상 제목은 유튜브에서 가져와 목록에 표시
      L2.forEach(function (l) {
        if (S.ytTitle[l.vid] != null) return; S.ytTitle[l.vid] = "";
        fetch("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent("https://youtu.be/" + l.vid)).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
          if (!j) return; S.ytTitle[l.vid] = "영상: " + j.title;
          app.querySelectorAll('.yt-t[data-v="' + l.vid + '"]').forEach(function (e) { e.textContent = S.ytTitle[l.vid]; });
        }).catch(function () { });
      });
    }
    draw(false);
  }).catch(function () { });
}
function lectureButton(sec, allDone) {
  if (!lecturesOf(sec).length) return "";
  return allDone ? `<button class="btn navy" data-go="#/lec/${encodeURIComponent(sec.id)}">▶ 해설강의 보기 (${lecturesOf(sec).length}개)</button>`
    : `<button class="btn ghost" disabled title="문제를 다 풀면 열려요">🔒 해설강의 · 문제를 다 풀면 볼 수 있어요</button>`;
}
function audioBox(src, label) {
  src = String(src).replace("__AUDIO_BASE__", CFG.audioBase || (SUPA + "/storage/v1/object/public/study-audio"));
  return `<div class="audio" style="flex-wrap:wrap"><button class="play">▶</button><audio src="${esc(src)}" preload="none"></audio><span style="color:#5B6573;font-size:14px">${esc(label || "음성 듣기")}</span><span class="repn" style="color:#E95721;font-size:13px;font-weight:800"></span><span style="flex:1"></span><button class="btn ghost sm rep">🔁 반복 듣기</button></div>`; }
function result() {
  render(`${topbar(Q.title)}
    <div class="card hero score"><span class="kicker">RESULT</span><div class="big">${Q.ok} / ${Q.n}</div><p>정답률 ${pct(Q.ok, Q.n)}%</p></div>
    <div style="display:grid;gap:8px">${lectureButton(Q.sec, true)}<button class="btn" data-go="#/wrong">오답노트 보기</button><button class="btn ghost" data-go="${Q.back || "#/"}">목록으로</button></div>`);
  bindCommon();
}

/* ---------- 오답노트 ---------- */
function viewWrong() {
  var wrongKeys = Object.keys(S.prog).filter(function (k) { return !S.prog[k][1]; });
  var bySec = {};
  wrongKeys.forEach(function (k) { var id = k.split(":")[0]; (bySec[id] = bySec[id] || []).push(k); });
  var metas = S.catalog.sections.filter(function (s) { return bySec[s.id]; });
  render(topbar("오답노트") + `<div class="card peach" style="font-size:14px">틀린 문제만 모았어요. 다시 맞히면 오답노트에서 빠집니다.</div>` +
    (metas.length ? metas.map(function (s) { return `<button class="row" data-wsec="${esc(s.id)}"><span class="pill ${s.area === "LC" ? "n" : "o"}">${s.area}</span><span class="t"><b>${esc(s.title)}</b><small>틀린 문제 ${bySec[s.id].length}개</small></span>›</button>`; }).join("")
      : '<div class="empty">아직 틀린 문제가 없어요! 👏</div>'));
  bindCommon();
  app.querySelectorAll("[data-wsec]").forEach(function (b) {
    b.onclick = function () {
      load("sec:" + b.dataset.wsec).then(function (sec) {
        var list = itemsOf(sec).filter(function (x) { return S.prog[x.key] && !S.prog[x.key][1]; });
        if (list.length) quiz(sec, list, 0, "오답 다시 풀기", "#/wrong");
      }).catch(function () { });
    };
  });
}

/* ---------- 단어 암기장 ---------- */
// 단어장 종류: 기본 암기장(#/v) · 파트6·7 분야별 단어장(#/w). 콘텐츠 키는 모두 voca: 로 시작해야 한다(get_content 허용 범위)
var VBS = {
  v: { r: "v", idx: "voca_index", day: "voca:", prog: "voca:", unit: "DAY", title: "단어 암기장", h1: "토익 필수 단어 암기장", desc: "김정수 메이크토익 New 암기장 · 분야별 DAY · 단어를 누르면 발음, 🔁10을 누르면 한 단어를 10번 연속으로 들려줘요." },
  w: { r: "w", idx: "voca:p67_index", day: "voca:p67:", prog: "voca:p67:", unit: "분야", title: "파트6·7 분야별 단어장", h1: "파트6·7 분야별 단어장", desc: "Part 6·7 지문에 나온 단어를 분야별로 모았어요 · 품사 표시 · 🔁10 버튼으로 한 단어를 10번 연속 듣기" }
};
var VB = VBS.v;
function audioUrl(src) { return String(src || "").replace("__AUDIO_BASE__", CFG.audioBase || (SUPA + "/storage/v1/object/public/study-audio")); }
var PL = { audio: null, run: 0, playing: false };
// 음원 한 개 재생 (없으면 기기 TTS로 대체). 재생이 끝나면 resolve
function playOne(src, text, run) {
  return new Promise(function (res) {
    if (run != null && run !== PL.run) return res();
    if (src) {
      if (!PL.audio) PL.audio = new Audio();
      var a = PL.audio; a.onended = a.onerror = function () { res(); };
      a.src = audioUrl(src); a.currentTime = 0; a.play().catch(function () { res(); });
    } else if (text && window.speechSynthesis) {
      var u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = 0.9; u.onend = u.onerror = function () { res(); };
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } else res();
  });
}
function stopPlay() { PL.run++; PL.playing = false; PL.ten = null; if (PL.audio) PL.audio.pause(); if (window.speechSynthesis) speechSynthesis.cancel(); if (app) app.querySelectorAll("audio").forEach(function (a) { a.pause(); }); }
function wait(ms, run) { return new Promise(function (r) { setTimeout(r, ms); }).then(function () { if (run !== PL.run) throw new Error("stop"); }); }
function vKey(day, no) { return VB.prog + day + ":" + no; }
function vKnown(day, no) { var p = S.prog[vKey(day, no)]; return !!(p && p[1]); }
function setKnown(day, no, ok) {
  var k = vKey(day, no), prev = S.prog[k]; S.prog[k] = [null, ok, prev ? prev[2] + 1 : 1];
  api("save_progress", { p_token: S.token, p_item: k, p_chosen: null, p_correct: ok }).catch(function () { });
}
function vSettings() {
  var d = { rep: 2, gap: 1.5, meaning: true, ex: false, shuffle: false, hide: false, onlyUnknown: false };
  try { var s = JSON.parse(ls("vset") || "{}"); Object.keys(s).forEach(function (k) { d[k] = s[k]; }); } catch (e) { }
  return d;
}
function saveV(v) { ls("vset", JSON.stringify(v)); }

function viewVocaIndex() {
  stopPlay();
  load(VB.idx).then(function (idx) {
    idx = idx || [];
    var tot = 0, kn = 0;
    render(topbar(VB.title) + `<div class="card hero"><span class="kicker">MAKE TOEIC · VOCA</span><h1>${esc(VB.h1)}</h1>
      <p>${esc(VB.desc)}</p></div>` +
      (idx.length ? idx.map(function (d) {
        var k = 0; for (var i = 1; i <= d.n; i++) if (vKnown(d.day, i)) k++; tot += d.n; kn += k;
        return `<button class="row" data-go="#/${VB.r}/${d.day}"><span class="pill o">${VB.unit} ${String(d.day).padStart(2, "0")}</span><span class="t"><b>${esc(d.theme_ko || "")}</b><small>${esc((d.preview || []).join(", "))} … · 외운 단어 ${k}/${d.n}</small></span><span class="pbar"><i style="width:${pct(k, d.n)}%"></i></span></button>`;
      }).join("") : '<div class="empty">단어장을 준비 중이에요.</div>'));
    bindCommon();
  }).catch(function () { });
}

function viewVocaDay(day) {
  stopPlay();
  load(VB.day + day).then(function (D) {
    if (!D) return render(topbar(VB.title) + '<div class="empty">단어장을 찾지 못했어요.</div>');
    var v = vSettings(), open = {};
    function list() { var w = D.words.slice(); if (v.onlyUnknown) w = w.filter(function (x) { return !vKnown(day, x.no); }); return w; }
    function draw() {
      var words = list(), kn = D.words.filter(function (w) { return vKnown(day, w.no); }).length;
      render(topbar(VB.unit + " " + String(day).padStart(2, "0") + " · " + (D.theme_ko || "")) + `
      <div class="card" style="padding:16px">
        <button class="btn" id="v-play">${PL.playing ? "■ 듣기 멈춤" : "▶ 연속 듣기 (반복 청취)"}</button>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">
          <button class="btn navy sm" style="width:100%;justify-content:center" data-go="#/${VB.r}/${day}/card">플래시카드</button>
          <button class="btn ghost sm" style="width:100%;justify-content:center" data-go="#/${VB.r}/${day}/test">뜻 테스트</button>
        </div>
        <details style="margin-top:10px" ${ls("vopen") === "1" ? "open" : ""} id="v-set"><summary style="cursor:pointer;font-weight:800;font-size:14px">⚙ 듣기 설정 · 반복 ${v.rep}회 · 간격 ${v.gap}초${v.ex ? " · 예문" : ""}${v.shuffle ? " · 섞기" : ""}${v.hide ? " · 뜻 가림" : ""}${v.onlyUnknown ? " · 못 외운 단어만" : ""}</summary>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;align-items:center"><b style="font-size:13px;width:34px">반복</b>${[1, 2, 3, 5].map(function (n) { return `<button class="btn ${v.rep === n ? "navy" : "ghost"} sm" data-rep="${n}">${n}회</button>`; }).join("")}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;align-items:center"><b style="font-size:13px;width:34px">간격</b>${[1, 1.5, 3].map(function (n) { return `<button class="btn ${v.gap === n ? "navy" : "ghost"} sm" data-gap="${n}">${n}초</button>`; }).join("")}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">
          ${[["ex", "예문도 듣기"], ["shuffle", "섞어서 듣기"], ["hide", "뜻 가리기"], ["onlyUnknown", "못 외운 단어만"]].map(function (o) { return `<button class="btn ${v[o[0]] ? "" : "ghost"} sm" data-opt="${o[0]}">${v[o[0]] ? "✓ " : ""}${o[1]}</button>`; }).join("")}
          </div></details>
        <p style="margin:10px 0 0;font-size:13px;color:#5B6573">외운 단어 ${kn} / ${D.words.length} · 단어를 누르면 발음 · ○ 외웠어요 · ▾ 파생어·예문</p>
      </div>
      ${words.map(function (w) {
        var k = vKnown(day, w.no);
        return `<div class="card vw" id="vw-${w.no}" style="padding:12px 14px;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:10px">
            <span class="pill ${k ? "o" : ""}">${String(w.no).padStart(2, "0")}</span>
            <button class="vsay" data-say="${w.no}" style="flex:1;min-width:0;text-align:left;background:none;border:0;padding:0;overflow-wrap:anywhere">
              <b style="font-size:18px">${esc(w.word)}</b> <span style="color:#5B6573;font-size:13px">[${esc(w.pron || "")}]</span>${w.pos ? ` <span class="pill n" style="font-size:11.5px;padding:2px 7px">${esc(w.pos)}</span>` : ""}
              <div class="vmean" style="font-size:15px;margin-top:2px;${v.hide ? "filter:blur(6px)" : ""}">${esc(w.meaning)}</div></button>
            <button class="btn ghost sm" data-ten="${w.no}" title="10번 연속 듣기" aria-label="10번 연속 듣기" style="padding:7px 6px;justify-content:center;font-size:12.5px">${PL.ten === w.no ? "■" : "🔁10"}</button>
            <button class="btn ${k ? "" : "ghost"} sm" data-known="${w.no}" title="외웠어요" aria-label="외웠어요" style="width:36px;padding:7px 0;justify-content:center">${k ? "✓" : "○"}</button>
            <button class="btn ghost sm" data-open="${w.no}" style="width:36px;padding:7px 0;justify-content:center">${open[w.no] ? "▴" : "▾"}</button>
          </div>
          ${open[w.no] ? detailHtml(w) : ""}
        </div>`;
      }).join("") || '<div class="empty">모든 단어를 외웠어요! 🎉</div>'}`);
      bindCommon();
      document.getElementById("v-play").onclick = function () { if (PL.playing) { stopPlay(); draw(); } else playAll(); };
      document.getElementById("v-set").addEventListener("toggle", function (e) { ls("vopen", e.target.open ? "1" : "0"); });
      app.querySelectorAll("[data-rep]").forEach(function (b) { b.onclick = function () { v.rep = +b.dataset.rep; saveV(v); draw(); }; });
      app.querySelectorAll("[data-gap]").forEach(function (b) { b.onclick = function () { v.gap = +b.dataset.gap; saveV(v); draw(); }; });
      app.querySelectorAll("[data-opt]").forEach(function (b) { b.onclick = function () { v[b.dataset.opt] = !v[b.dataset.opt]; saveV(v); draw(); }; });
      app.querySelectorAll("[data-say]").forEach(function (b) {
        b.onclick = function () { var w = D.words.find(function (x) { return String(x.no) === b.dataset.say; }); stopPlay(); playOne(w.audio, w.word, PL.run); var m = b.querySelector(".vmean"); if (m) m.style.filter = ""; };
      });
      // 한 단어 발음을 10번 연속으로 들려준다 (다시 누르면 멈춤)
      app.querySelectorAll("[data-ten]").forEach(function (b) {
        b.onclick = function () {
          var no = +b.dataset.ten, was = PL.ten === no; stopPlay(); PL.ten = null;
          if (was) return draw();
          var w = D.words.find(function (x) { return x.no === no; }), run = PL.run, n = 0; PL.ten = no; draw(); highlight(no);
          (function again() {
            playOne(w.audio, w.word, run).then(function () { return wait(500, run); }).then(function () { if (++n < 10) return again(); PL.ten = null; draw(); }).catch(function () { });
          })();
        };
      });
      app.querySelectorAll("[data-known]").forEach(function (b) { b.onclick = function () { var no = +b.dataset.known; setKnown(day, no, !vKnown(day, no)); draw(); }; });
      app.querySelectorAll("[data-open]").forEach(function (b) { b.onclick = function () { open[b.dataset.open] = !open[b.dataset.open]; draw(); }; });
      app.querySelectorAll("[data-ex]").forEach(function (b) { b.onclick = function () { var p = b.dataset.ex.split("|"); var w = D.words.find(function (x) { return String(x.no) === p[0]; }); var e = w.examples[+p[1]]; stopPlay(); playOne(e.audio, e.en, PL.run); }; });
    }
    function highlight(no) {
      app.querySelectorAll(".vw").forEach(function (el) { el.style.borderColor = ""; el.style.background = ""; });
      var el = document.getElementById("vw-" + no); if (!el) return;
      el.style.borderColor = "#FF581F"; el.style.background = "#FFF9F5";
      var m = el.querySelector(".vmean"); if (m && v.meaning) m.style.filter = "";
      var r = el.getBoundingClientRect(); if (r.top < 80 || r.bottom > innerHeight - 20) el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    function playAll() {
      stopPlay(); var run = PL.run; PL.playing = true; draw();
      var words = list(); if (v.shuffle) words = words.slice().sort(function () { return Math.random() - .5; });
      var i = 0;
      (function next() {
        if (run !== PL.run) return;
        if (i >= words.length) { PL.playing = false; draw(); return; }
        var w = words[i++], r = 0; highlight(w.no);
        (function rep() {
          playOne(w.audio, w.word, run).then(function () { return wait(v.gap * 1000, run); }).then(function () {
            if (++r < v.rep) return rep();
            var ex = v.ex && w.examples && w.examples[0];
            (ex ? playOne(ex.audio, ex.en, run).then(function () { return wait(v.gap * 1000, run); }) : Promise.resolve()).then(next).catch(function () { });
          }).catch(function () { });
        })();
      })();
    }
    draw();
  }).catch(function () { });
}
function detailHtml(w) {
  var h = (w.details || []).map(function (d) {
    return `<div style="margin-top:8px"><span class="pill n">${esc(d.label)}</span>${(d.items || []).map(function (it) {
      return `<div style="font-size:14px;margin:3px 0 0 4px"><b>${esc(it.en || "")}</b>${it.pron ? ` <span style="color:#5B6573">[${esc(it.pron)}]</span>` : ""}${it.ko ? " · " + esc(it.ko) : ""}</div>`;
    }).join("")}</div>`;
  }).join("");
  h += (w.examples || []).map(function (e, i) {
    return `<div style="margin-top:8px;background:#F5F7FA;border-radius:10px;padding:8px 10px;font-size:14px"><button class="btn ghost sm" data-ex="${w.no}|${i}" style="float:right;margin-left:6px">🔊</button><b>${esc(e.en)}</b><div style="color:#5B6573">${esc(e.ko || "")}</div></div>`;
  }).join("");
  if (w.note) h += `<p style="font-size:13px;color:#E95721;margin:8px 0 0">${esc(w.note)}</p>`;
  return h;
}
function viewVocaCard(day) {
  stopPlay();
  load(VB.day + day).then(function (D) {
    var deck = D.words.filter(function (w) { return !vKnown(day, w.no); }); if (!deck.length) deck = D.words.slice();
    deck.sort(function () { return Math.random() - .5; });
    var i = 0, flip = false;
    function draw() {
      if (i >= deck.length) { render(topbar("플래시카드") + `<div class="card hero score"><span class="kicker">DAY ${day}</span><div class="big">완료!</div><p>외운 단어 ${D.words.filter(function (w) { return vKnown(day, w.no); }).length} / ${D.words.length}</p></div><button class="btn" data-go="#/${VB.r}/${day}">단어 목록으로</button>`); bindCommon(); return; }
      var w = deck[i];
      render(topbar("플래시카드 · DAY " + day) + `<div class="qhead"><span>${i + 1} / ${deck.length}</span><span>카드를 누르면 뜻</span></div>
        <div class="card" id="fc" style="min-height:280px;display:flex;flex-direction:column;justify-content:center;text-align:center;cursor:pointer">
          <div style="font-size:34px;font-weight:900">${esc(w.word)}</div><div style="color:#5B6573">[${esc(w.pron || "")}]</div>
          ${flip ? `<div style="font-size:21px;font-weight:800;margin-top:14px;color:#E95721">${esc(w.meaning)}</div><div style="text-align:left">${detailHtml(w)}</div>` : ""}
        </div>
        <div style="display:grid;grid-template-columns:auto 1fr 1fr;gap:8px"><button class="btn ghost" id="fc-say">🔊</button><button class="btn ghost" id="fc-again">다시 볼래요</button><button class="btn" id="fc-ok">외웠어요</button></div>`);
      bindCommon();
      if (!flip) playOne(w.audio, w.word, PL.run);
      document.getElementById("fc").onclick = function (e) { if (e.target.closest("[data-ex]")) return; flip = !flip; draw(); };
      app.querySelectorAll("[data-ex]").forEach(function (b) { b.onclick = function () { var e = w.examples[+b.dataset.ex.split("|")[1]]; playOne(e.audio, e.en, PL.run); }; });
      document.getElementById("fc-say").onclick = function () { playOne(w.audio, w.word, PL.run); };
      document.getElementById("fc-again").onclick = function () { setKnown(day, w.no, false); deck.push(w); i++; flip = false; draw(); };
      document.getElementById("fc-ok").onclick = function () { setKnown(day, w.no, true); i++; flip = false; draw(); };
    }
    draw();
  }).catch(function () { });
}
function viewVocaTest(day) {
  stopPlay();
  load(VB.day + day).then(function (D) {
    var qs = D.words.slice().sort(function () { return Math.random() - .5; }).slice(0, Math.min(10, D.words.length));
    var i = 0, ok = 0, picked = null;
    function draw() {
      if (i >= qs.length) { render(topbar("뜻 테스트") + `<div class="card hero score"><span class="kicker">DAY ${day} TEST</span><div class="big">${ok} / ${qs.length}</div><p>틀린 단어는 '못 외운 단어'로 표시됐어요.</p></div><div style="display:grid;gap:8px"><button class="btn" data-go="#/${VB.r}/${day}/test">다시 테스트</button><button class="btn ghost" data-go="#/${VB.r}/${day}">단어 목록으로</button></div>`); bindCommon(); return; }
      var w = qs[i];
      if (!w._opts) { var others = D.words.filter(function (x) { return x !== w; }).sort(function () { return Math.random() - .5; }).slice(0, 3); w._opts = others.concat([w]).sort(function () { return Math.random() - .5; }); }
      render(topbar("뜻 테스트 · DAY " + day) + `<div class="qhead"><span>${i + 1} / ${qs.length}</span><span>정답 ${ok}</span></div><div class="bar"><i style="width:${pct(i, qs.length)}%"></i></div>
        <div class="card" style="text-align:center"><div style="font-size:30px;font-weight:900">${esc(w.word)}</div><button class="btn ghost sm" id="t-say" style="margin-top:8px">🔊 발음 듣기</button></div>
        <div class="opts">${w._opts.map(function (o, k) {
          var c = ""; if (picked != null) c = o === w ? "right" : (k === picked ? "wrong" : "");
          return `<button class="opt ${c}" data-k="${k}"><span class="k">${L[k]}</span><span>${esc(o.meaning)}</span></button>`;
        }).join("")}</div>
        ${picked != null ? '<div class="sticky"><button class="btn navy" id="t-next">다음</button></div>' : ""}`);
      bindCommon();
      if (picked == null) playOne(w.audio, w.word, PL.run);
      document.getElementById("t-say").onclick = function () { playOne(w.audio, w.word, PL.run); };
      app.querySelectorAll(".opt").forEach(function (b) {
        b.onclick = function () { if (picked != null) return; picked = +b.dataset.k; var right = w._opts[picked] === w; if (right) ok++; setKnown(day, w.no, right); draw(); };
      });
      var nx = document.getElementById("t-next"); if (nx) nx.onclick = function () { i++; picked = null; draw(); };
    }
    draw();
  }).catch(function () { });
}

/* ---------- 🎮 단어 점프 게임 (횡스크롤 플랫폼 게임 · 메이크토익 오리지널 캐릭터) ----------
   DAY = 스테이지. 철자 맞추기: 위에 한국어 뜻이 뜨고, 앞의 단어 블록 3개(정답 철자 1 + 틀린 철자 2) 중 맞는 철자를 머리로 쳐야 문이 열린다.
   틀리면 하트 -1, 그 단어는 '못 외운 단어'로 표시. 몬스터는 밟으면 +50, 옆으로 부딪히면 하트 -1. */
function viewGameMenu() {
  stopPlay();
  load("voca_index").then(function (idx) {
    render(topbar("단어 점프 게임") + `<div class="card hero"><span class="kicker">MAKE TOEIC · GAME</span><h1>🎮 단어 점프 게임</h1>
      <p>블록에 다가가면 <b>한글 뜻</b>을 계속 읽어 줘요. 그 뜻의 영어 단어 블록을 머리로 치세요! 맞히면 뜻 읽기가 멈추고 그 단어 발음이 나오며 문이 열려요. 맞힌 블록을 또 치면 발음을 계속 들을 수 있어요. 틀리면 하트가 줄어요.</p></div>
      <button class="btn navy" data-go="#/rank" style="margin-bottom:10px">🏆 순위 보기 (클리어 시간 대결)</button>
      <div class="card" style="font-size:13.5px">⚠ 뒤에서 <b>추격자</b>가 쫓아와요! 닿으면 하트가 줄어요. 끝까지 가는 <b>시간</b>으로 순위를 겨뤄요.<br>조작: <b>휴대폰</b> 화면 아래 ◀ ▶ 버튼 + 점프 · <b>PC</b> 방향키 ← → + 스페이스바(점프). 휴대폰은 가로로 돌리면 더 크게 보여요.</div>` +
      (idx || []).map(function (d) {
        var g = gameRec(d.day);
        return `<button class="row" data-go="#/game/${d.day}"><span class="pill o">DAY ${String(d.day).padStart(2, "0")}</span><span class="t"><b>${esc(d.theme_ko || "")}</b><small>${g.ms ? "내 최고 기록 ⏱ " + fmtMs(g.ms) : g.best ? "아직 클리어 전" : "아직 도전 전"}</small></span><span style="font-size:18px;letter-spacing:1px">${"★".repeat(g.stars || 0)}<span style="color:#D6DCE4">${"★".repeat(3 - (g.stars || 0))}</span></span></button>`;
      }).join(""));
    bindCommon();
  }).catch(function () { });
}
// 헷갈리기 쉬운 틀린 철자 만들기 (겹자음 빼기/넣기, 모음 바꾸기, 자주 틀리는 어미 바꾸기, 글자 순서 바꾸기)
function misspell(word, all) {
  var real = {}; (all || []).forEach(function (w) { real[String(w.word).toLowerCase()] = 1; });
  var out = [], seen = {}; seen[word.toLowerCase()] = 1;
  // 여러 단어 표현이면 가장 긴 단어 하나만 바꾼다
  var parts = word.split(" "), wi = 0; parts.forEach(function (p, i) { if (p.length > parts[wi].length) wi = i; });
  var base = parts[wi];
  function add(v) {
    if (!v || v === base) return;
    if (/([aiuo])\1/.test(v) && !/([aiuo])\1/.test(base)) return;  // 실제로는 안 보이는 모음 겹침(ii, aa…)은 버린다
    if (/(.)\1\1/.test(v)) return; var full = parts.slice(0, wi).concat([v], parts.slice(wi + 1)).join(" "); var k = full.toLowerCase(); if (!seen[k] && !real[k]) { seen[k] = 1; out.push(full); } }
  var rules = [
    function (s) { return s.replace(/([bcdfglmnprst])\1/, "$1"); },                       // 겹자음 → 하나 (accommodate → acommodate)
    function (s) { var m = s.match(/[aeiou]([bcdfglmnprst])[aeiou]/); return m ? s.replace(m[0], m[0][0] + m[1] + m[1] + m[0][2]) : ""; }, // 자음 겹치기
    function (s) { return s.replace(/ant$/, "ent").replace(/ance$/, "ence") !== s ? s.replace(/ant$/, "ent").replace(/ance$/, "ence") : s.replace(/ent$/, "ant").replace(/ence$/, "ance"); },
    function (s) { return /able$/.test(s) ? s.replace(/able$/, "ible") : s.replace(/ible$/, "able"); },
    function (s) { return /tion$/.test(s) ? s.replace(/tion$/, "sion") : s.replace(/sion$/, "tion"); },
    function (s) { return s.replace(/ie/, "ei") !== s ? s.replace(/ie/, "ei") : s.replace(/ei/, "ie"); },
    function (s) { var i = s.search(/[aeiou](?!.*[aeiou]{2})/); if (i < 1) return ""; var v = "aeiou".replace(s[i], ""); return s.slice(0, i) + v[(s.length + i) % v.length] + s.slice(i + 1); }, // 모음 하나 바꾸기
    function (s) { var i = Math.floor(s.length / 2); return s.length > 4 ? s.slice(0, i) + s.slice(i + 1) : ""; },  // 가운데 글자 빠뜨리기
    function (s) { var i = Math.max(1, Math.floor(s.length / 2) - 1); return s.length > 4 ? s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2) : ""; }, // 두 글자 순서 바꾸기
    function (s) { return s.replace(/c(?=[eiy])/, "s"); },
    function (s) { return s.replace(/y$/, "ie"); }
  ];
  shuffle(rules).forEach(function (r) { if (out.length < 3) { try { add(r(base)); } catch (e) { } } });
  while (out.length < 2) add(base + "e".repeat(out.length + 1));
  return out;
}
// 게임 배경음악: 메이크토익 오리지널 8비트 곡 (WebAudio로 직접 연주 · 저작권 음원 사용 안 함)
function makeBgm(song) {
  var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return { start: function () { }, stop: function () { } };
  var ac = null, timer = null, step = 0, nextT = 0, master = null;
  // 8분음표 단위 (null = 쉼표). 음 이름 → 주파수
  var N = { C4: 261.6, D4: 293.7, E4: 329.6, F4: 349.2, G4: 392, A4: 440, B4: 493.9, C5: 523.3, D5: 587.3, E5: 659.3, F5: 698.5, G5: 784, A5: 880,
            C3: 130.8, D3: 146.8, E3: 164.8, F3: 174.6, G3: 196, A3: 220, B3: 246.9 };
  var lead = ["E5","G5","A5","G5","E5","D5","C5","D5", "E5","E5","G5","A5","C5",null,"A4","G4",
              "F4","A4","C5","A4","F4","E4","D4","E4", "G4","G4","A4","B4","C5",null,null,null,
              "C5","E5","G5","E5","D5","F5","A5","F5", "E5","G5","C5","E5","D5",null,"G4",null,
              "A4","C5","E5","C5","B4","D5","G5","D5", "C5","E5","G5","E5","C5",null,null,null];
  var bass = ["C3","C3","F3","G3","C3","C3","F3","G3","F3","F3","C3","C3","G3","G3","C3","C3",
              "C3","C3","D3","D3","E3","E3","G3","G3","A3","A3","G3","G3","C3","G3","C3",null];
  var BPM = 150;
  if (song === "race") {
    // 빈칸 레이서 전용: 빠르고 신나는 드라이브 곡 (오리지널)
    N.Bb4 = 466.2; N.Eb5 = 622.3; N.Bb3 = 233.1; N.Ab3 = 207.7; N.Eb4 = 311.1;
    lead = ["G5",null,"G5","E5","G5",null,"A5","G5", "E5",null,"D5","E5","C5",null,null,null,
            "A4","C5","D5","E5","G5","E5","D5","C5", "D5",null,"E5","D5","B4",null,"G4",null,
            "G5",null,"G5","E5","G5",null,"A5","C5", "A5","G5","E5","G5","E5","D5","C5",null,
            "F5","E5","D5","C5","D5","E5","G5","E5", "C5",null,"G4","A4","C5",null,null,null];
    bass = ["C3","G3","C3","G3","A3","E3","A3","E3","F3","C3","F3","C3","G3","D3","G3","B3",
            "C3","G3","C3","G3","A3","E3","A3","E3","F3","C3","G3","G3","C3","G3","C3",null];
    BPM = 172;
  }
  var E8 = 60 / BPM / 2;
  function note(f, t, d, type, vol) {
    var o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d * 0.95);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + d);
  }
  function sched() {
    while (nextT < ac.currentTime + 0.25) {
      var l = lead[step % lead.length]; if (l) note(N[l], nextT, E8 * 0.9, "square", 0.05);
      if (step % 2 === 0) { var b = bass[(step / 2) % bass.length]; if (b) note(N[b], nextT, E8 * 1.8, "triangle", 0.09); }
      nextT += E8; step++;
    }
  }
  return {
    start: function () {
      if (timer) return;
      try { ac = ac || new AC(); if (ac.state === "suspended") ac.resume(); if (!master) { master = ac.createGain(); master.gain.value = 0.55; master.connect(ac.destination); } } catch (e) { return; }
      nextT = ac.currentTime + 0.05; timer = setInterval(sched, 80); sched();
    },
    stop: function () { clearInterval(timer); timer = null; try { if (ac) ac.suspend(); } catch (e) { } }
  };
}
function fmtMs(ms) { ms = Math.max(0, Math.round(ms)); var m = Math.floor(ms / 60000), s = Math.floor(ms / 1000) % 60, d = Math.floor(ms / 100) % 10; return m + ":" + String(s).padStart(2, "0") + "." + d; }
// 결과 공유: 휴대폰은 공유 창(카카오톡 등), PC는 문구 복사
function shareGame(day, ms, rk) {
  var txt = "🎮 메이크토익 단어 점프 게임 DAY " + day + " 클리어! ⏱ " + fmtMs(ms) + (rk ? " · " + rk.rank + "위 / " + rk.total + "명" : "") + "\n나보다 빨리 깰 수 있어? 👉 https://maketoeic.com/?mk=study";
  if (navigator.share) { navigator.share({ title: "메이크토익 단어 점프 게임", text: txt }).catch(function () { }); return; }
  try { navigator.clipboard.writeText(txt).then(function () { alert("결과 문구를 복사했어요. 카카오톡 등에 붙여 넣어 공유하세요!"); }); } catch (e) { prompt("아래 문구를 복사해서 공유하세요", txt); }
}
// 순위표: #/rank (종합) · #/rank/<day> (DAY별). 클리어 시간이 빠를수록 높은 순위
function viewRank(day) {
  stopPlay();
  render(topbar("🏆 단어 게임 순위") + '<div class="empty">순위를 불러오는 중…</div>');
  Promise.all([api("game_ranking", { p_token: S.token, p_day: day || 0 }), load("voca_index").catch(function () { return []; })]).then(function (x) {
    var r = x[0] || {}, idx = x[1] || [], top = r.top || [], me = r.me;
    var tabs = `<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;margin-bottom:8px"><button class="btn ${!day ? "navy" : "ghost"} sm" data-go="#/rank">종합</button>${idx.map(function (d) { return `<button class="btn ${day === d.day ? "navy" : "ghost"} sm" data-go="#/rank/${d.day}" style="white-space:nowrap">DAY ${d.day}</button>`; }).join("")}</div>`;
    render(topbar("🏆 단어 게임 순위") + tabs + `<div class="card hero"><span class="kicker">${day ? "DAY " + day + " · 클리어 시간 대결" : "종합 · 클리어한 스테이지 수 → 합계 시간"}</span>
      <h1>${me ? "내 순위 " + me.rank + "위" : "아직 기록이 없어요"}</h1><p>${me ? (day ? "내 최고 기록 " + fmtMs(me.ms) : "클리어 " + me.cleared + "개 · 합계 " + fmtMs(me.ms)) : "스테이지를 끝까지 깨면 순위에 올라가요"} · 참가 ${r.players || 0}명</p></div>
      <div class="card" style="padding:6px 12px">${top.length ? top.map(function (t) {
        var medal = t.rank === 1 ? "🥇" : t.rank === 2 ? "🥈" : t.rank === 3 ? "🥉" : t.rank + "위";
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 4px;border-bottom:1px solid #EEF1F5;${t.me ? "background:#FFF4EC;border-radius:10px" : ""}">
          <b style="min-width:40px;font-size:${t.rank <= 3 ? 20 : 15}px">${medal}</b><span style="flex:1;font-weight:800">${esc(t.label)}${t.me ? " (나)" : ""}</span>
          <span style="color:#5B6573;font-size:14px">${day ? "⏱ " + fmtMs(t.ms) : t.cleared + "개 · " + fmtMs(t.ms)}</span></div>`;
      }).join("") : '<div class="empty">아직 아무도 클리어하지 않았어요. 첫 1등에 도전하세요!</div>'}</div>
      <div style="display:grid;gap:8px">${day ? `<button class="btn" data-go="#/game/${day}">DAY ${day} 도전하기</button>` : ""}<button class="btn ghost" id="rk-share">📤 순위 공유하기</button></div>`);
    bindCommon();
    document.getElementById("rk-share").onclick = function () {
      var txt = "🏆 메이크토익 단어 점프 게임 " + (day ? "DAY " + day : "종합") + " 순위\n" + top.slice(0, 5).map(function (t) { return t.rank + "위 " + t.label + " " + (day ? fmtMs(t.ms) : t.cleared + "개 " + fmtMs(t.ms)); }).join("\n") + (me ? "\n나는 " + me.rank + "위!" : "") + "\n👉 https://maketoeic.com/?mk=study";
      if (navigator.share) navigator.share({ title: "메이크토익 단어 게임 순위", text: txt }).catch(function () { });
      else { try { navigator.clipboard.writeText(txt).then(function () { alert("순위 문구를 복사했어요. 카카오톡 등에 붙여 넣어 공유하세요!"); }); } catch (e) { prompt("아래 문구를 복사해서 공유하세요", txt); } }
    };
  }).catch(function () { render(topbar("🏆 단어 게임 순위") + '<div class="empty">순위를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</div>'); bindCommon(); });
}
function gameRec(day) { try { return JSON.parse(ls("game:" + day) || "{}"); } catch (e) { return {}; } }
function viewGame(day) {
  stopPlay();
  VB = VBS.v;
  render('<div class="empty">스테이지를 준비하는 중…</div>');
  load("voca:" + day).then(function (D) {
    // 못 외운 단어 먼저, 최대 10문제
    var words = D.words.slice(), unk = shuffle(words.filter(function (w) { return !vKnown(day, w.no); })), kn = shuffle(words.filter(function (w) { return vKnown(day, w.no); }));
    var qs = unk.concat(kn).slice(0, 10);
    render(topbar("DAY " + day + " · " + (D.theme_ko || "")) + `
      <div style="display:flex;gap:8px;margin-bottom:8px"><button class="btn ghost sm" data-go="#/game">‹ 스테이지 목록</button><span style="flex:1"></span><button class="btn ghost sm" id="gm-bgm">${ls("bgm") === "0" ? "🔇 음악 꺼짐" : "🎵 음악 켜짐"}</button><button class="btn ghost sm" id="gm-say">🔊 뜻 다시 듣기</button></div>
      <div id="gm-wrap" style="position:relative;background:#7EC8F2;border-radius:14px;overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none">
        <canvas id="gm" width="640" height="400" style="display:block;width:100%;height:auto"></canvas>
        <div id="gm-over" style="display:none;position:absolute;inset:0;background:rgba(18,30,52,.82);color:#fff;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:16px"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1.4fr;gap:8px;margin-top:10px">
        <button class="btn navy" data-pad="L" style="font-size:22px;padding:14px 0">◀</button>
        <button class="btn navy" data-pad="R" style="font-size:22px;padding:14px 0">▶</button>
        <button class="btn" data-pad="J" style="font-size:18px;padding:14px 0">점프</button>
      </div>
      `);
    bindCommon();
    gameRun(day, D, qs);
  }).catch(function () { });
}
function gameRun(day, D, qs) {
  var cv = document.getElementById("gm"), cx = cv.getContext("2d"), W = 640, H = 400, GY = 330, run = PL.run;
  var keys = { L: false, R: false, J: false }, jumpQueued = false, bgm = makeBgm(), bgmOn = ls("bgm") !== "0", bgmStarted = false;
  function bgmKick() { if (bgmOn && !bgmStarted && !over) { bgmStarted = true; bgm.start(); } }
  document.getElementById("gm-bgm").onclick = function () { bgmOn = !bgmOn; ls("bgm", bgmOn ? "1" : "0"); this.textContent = bgmOn ? "🎵 음악 켜짐" : "🔇 음악 꺼짐"; if (bgmOn) { bgmStarted = false; bgmKick(); } else { bgm.stop(); bgmStarted = false; } };
  var P = { x: 60, y: GY - 40, w: 30, h: 40, vx: 0, vy: 0, on: false, face: 1, inv: 0 };
  var hearts = 3, score = 0, correct = 0, wrongN = 0, cam = 0, t0 = performance.now(), last = t0, over = false, fx = [], cp = 60, playT = 0;
  // 뒤에서 쫓아오는 추격자: 플레이어보다 조금 느리지만 멈추지 않는다. 닿으면 하트 -1, 뒤로 밀려난다
  var CH = { x: -260, y: GY - 46, w: 34, h: 46, sp: 150, wait: 2.5 };
  // ---- 레벨 만들기: 시작 평지 → (문제마다) 장애물 구간 + 뜻 블록 3개 + 잠긴 문 → 깃발
  var solids = [], blocks = [], gates = [], enemies = [], x = 0, all = D.words;
  function ground(a, b) { solids.push({ x: a, y: GY, w: b - a, h: H - GY, k: "g" }); }
  ground(0, 420); x = 420;
  qs.forEach(function (w, qi) {
    var kind = qi % 3;
    if (kind === 0) { ground(x, x + 120); x += 120; x += 110; ground(x, x + 260); solids.push({ x: x - 70, y: GY - 90, w: 80, h: 22, k: "p" }); x += 260; }
    else if (kind === 1) { ground(x, x + 360); enemies.push({ x: x + 220, y: GY - 28, w: 30, h: 28, vx: -60, a: x + 40, b: x + 340, dead: 0 }); solids.push({ x: x + 120, y: GY - 100, w: 120, h: 22, k: "p" }); x += 360; }
    else { ground(x, x + 160); x += 160; x += 90; ground(x, x + 90); x += 90; x += 90; ground(x, x + 200); x += 200; }
    // 뜻 블록 구간
    // 철자 맞추기: 정답 철자 1개 + 헷갈리는 틀린 철자 2개
    // 선택지: 정답 단어 1개 + 같은 DAY의 다른 단어 2개를 무작위 순서로
    var others = shuffle(all.filter(function (o) { return o !== w && o.word !== w.word && o.meaning !== w.meaning; })).slice(0, 2);
    var opts = shuffle([{ text: w.word, ok: true }].concat(others.map(function (o) { return { text: o.word, ok: false }; })));
    ground(x, x + 720);
    var g = { w: w, x0: x, open: false, opts: [], said: false, wall: { x: x + 640, y: GY - 260, w: 26, h: 260, k: "wall" } };
    opts.forEach(function (o, k) { var b = { x: x + 90 + k * 175, y: GY - 196, w: 150, h: 58, o: o, ok: o.ok, st: 0, bump: 0, g: g }; g.opts.push(b); blocks.push(b); });
    gates.push(g); solids.push(g.wall);
    x += 720;
  });
  ground(x, x + 400); var flagX = x + 260; x += 400;
  var worldW = x;
  function curGate() { for (var i = 0; i < gates.length; i++) if (!gates[i].open) return gates[i]; return null; }
  // 한글 뜻을 기기 음성(한국어)으로 읽어 준다
  function say(g) {
    if (!g || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(String(g.w.meaning).replace(/[~()\[\]]/g, " ")); u.lang = "ko-KR"; u.rate = 1;
    var v = speechSynthesis.getVoices().filter(function (x) { return /^ko/i.test(x.lang); })[0]; if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  document.getElementById("gm-say").onclick = function () { say(curGate()); };
  // ---- 입력
  function setKey(k, v) { if (v) bgmKick(); if (k === "J" && v && !keys.J) jumpQueued = true; keys[k] = v; }
  app.querySelectorAll("[data-pad]").forEach(function (b) {
    var k = b.dataset.pad;
    ["touchstart", "mousedown"].forEach(function (e) { b.addEventListener(e, function (ev) { ev.preventDefault(); setKey(k, true); }, { passive: false }); });
    ["touchend", "touchcancel", "mouseup", "mouseleave"].forEach(function (e) { b.addEventListener(e, function (ev) { ev.preventDefault(); setKey(k, false); }, { passive: false }); });
  });
  function kd(e) { var m = { ArrowLeft: "L", ArrowRight: "R", ArrowUp: "J", " ": "J", Space: "J" }[e.key] || ({ Space: "J" })[e.code]; if (m) { e.preventDefault(); setKey(m, true); } }
  function ku(e) { var m = { ArrowLeft: "L", ArrowRight: "R", ArrowUp: "J", " ": "J" }[e.key] || ({ Space: "J" })[e.code]; if (m) { e.preventDefault(); setKey(m, false); } }
  window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
  function cleanup() { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); bgm.stop(); if (window.speechSynthesis) speechSynthesis.cancel(); }
  // ---- 충돌
  function hit(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
  function hurt() {
    if (P.inv > 0) return; hearts--; P.inv = 1.6; P.vy = -420;
    if (hearts <= 0) end(false);
  }
  function answer(b) {
    // 이미 맞힌 정답 블록은 칠 때마다 그 단어 발음을 다시 들려준다
    if (b.st === 1) { b.bump = 0.25; if (PL.audio) PL.audio.pause(); playOne(b.g.w.audio, b.g.w.word, null); return; }
    if (b.st || b.g.open) return;
    b.bump = 0.25; logStudy();
    if (b.ok) {
      b.st = 1; b.g.open = true; score += 100; correct++; setKnown(day, b.g.w.no, b.g.wrong ? false : true); if (window.speechSynthesis) speechSynthesis.cancel(); playOne(b.g.w.audio, b.g.w.word, PL.run);
      for (var i = 0; i < 14; i++) fx.push({ x: b.x + b.w / 2, y: b.y, vx: (Math.random() - .5) * 260, vy: -200 - Math.random() * 260, t: 0.9, c: "#FFD23F" });
      cp = b.g.wall.x + 40; solids.splice(solids.indexOf(b.g.wall), 1);
    } else {
      b.st = 2; b.g.wrong = true; wrongN++; setKnown(day, b.g.w.no, false); hurt();
    }
  }
  function end(win) {
    if (over) return; over = true; cleanup(); if (PL.audio) PL.audio.pause();
    var rec = gameRec(day), stars = win ? (hearts >= 3 && !wrongN ? 3 : hearts >= 2 ? 2 : 1) : 0;
    if (win) score += hearts * 200;
    var ms = Math.round(playT * 1000);
    if (score > (rec.best || 0)) rec.best = score; if (stars > (rec.stars || 0)) rec.stars = stars;
    if (win && (!rec.ms || ms < rec.ms)) rec.ms = ms;
    ls("game:" + day, JSON.stringify(rec));
    var ov = document.getElementById("gm-over"); if (!ov) return;
    ov.style.display = "flex";
    ov.innerHTML = `<div style="font-size:30px;font-weight:900">${win ? "🏁 STAGE CLEAR!" : "GAME OVER"}</div>
      <div style="font-size:26px;margin:6px 0;color:#FFD23F">${"★".repeat(stars)}<span style="color:#56657A">${"★".repeat(3 - stars)}</span></div>
      <div style="font-size:16px">${win ? "클리어 시간 <b style=\"color:#FFD23F\">" + fmtMs(ms) + "</b> · " : ""}맞힌 단어 ${correct}/${qs.length}${wrongN ? " · 틀린 단어는 '못 외운 단어'로 저장" : ""}</div>
      ${win ? `<div id="gm-rank" style="margin-top:6px;font-size:15px">순위 확인 중…</div>` : ""}
      <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;justify-content:center"><button class="btn" id="gm-again">다시 하기</button>${win && day < 30 ? `<button class="btn navy" data-go="#/game/${day + 1}">다음 스테이지 ›</button>` : ""}<button class="btn ghost" data-go="#/rank/${day}" style="background:#fff">🏆 순위</button>${win ? `<button class="btn ghost" id="gm-share" style="background:#fff">📤 공유</button>` : ""}<button class="btn ghost" data-go="#/v/${day}" style="background:#fff">DAY ${day} 단어</button></div>`;
    bindCommon(); document.getElementById("gm-again").onclick = function () { viewGame(day); };
    if (win) {
      var rk = null;
      api("game_save", { p_token: S.token, p_day: day, p_ms: ms, p_stars: stars }).then(function (r) {
        var el = document.getElementById("gm-rank"); if (!el || !r || r.status !== "ok") { if (el) el.textContent = ""; return; }
        rk = r; el.innerHTML = `🏆 DAY ${day} 순위 <b style="color:#FFD23F">${r.rank}위</b> / ${r.total}명 · 내 최고 기록 ${fmtMs(r.best_ms)}`;
      }).catch(function () { var el = document.getElementById("gm-rank"); if (el) el.textContent = ""; });
      var sh = document.getElementById("gm-share"); if (sh) sh.onclick = function () { shareGame(day, ms, rk); };
    }
  }
  // ---- 그리기
  function rr(x, y, w, h, r, f) { cx.fillStyle = f; cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.fill(); }
  function wrapText(t, x, y, mw, lh) {
    // (구형 아이폰 사파리는 정규식 lookbehind를 못 읽어 앱 전체가 멈추므로 쓰지 않는다)
    var words2 = String(t).match(/[^,\s·]+[,\s·]*|[,\s·]+/g) || [String(t)], line = "", lines = [];
    words2.forEach(function (s) { if (cx.measureText(line + s).width > mw && line) { lines.push(line); line = s; } else line += s; }); if (line) lines.push(line);
    lines = lines.slice(0, 2); var y0 = y - (lines.length - 1) * lh / 2;
    lines.forEach(function (l, i) { cx.fillText(l.trim(), x, y0 + i * lh); });
  }
  function draw() {
    var sky = cx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#6EC1F0"); sky.addColorStop(1, "#CDEBFA"); cx.fillStyle = sky; cx.fillRect(0, 0, W, H);
    // 배경 언덕·구름 (느리게 움직임)
    for (var i = -1; i < 6; i++) { var hx = i * 260 - (cam * 0.3) % 260; cx.fillStyle = "#9ED88C"; cx.beginPath(); cx.arc(hx + 130, GY + 20, 120, Math.PI, 0); cx.fill(); }
    for (i = -1; i < 5; i++) { var cxp = i * 220 - (cam * 0.15) % 220 + 40; rr(cxp, 50 + (i % 2) * 30, 90, 26, 13, "rgba(255,255,255,.9)"); }
    cx.save(); cx.translate(-Math.round(cam), 0);
    solids.forEach(function (s) {
      if (s.x + s.w < cam - 20 || s.x > cam + W + 20) return;
      if (s.k === "g") { cx.fillStyle = "#C9783B"; cx.fillRect(s.x, s.y, s.w, s.h); cx.fillStyle = "#4CB648"; cx.fillRect(s.x, s.y, s.w, 12); cx.fillStyle = "#B66A30"; for (var bx = s.x + 10; bx < s.x + s.w; bx += 40) cx.fillRect(bx, s.y + 30, 18, 8); }
      else if (s.k === "p") { cx.fillStyle = "#D8642B"; cx.fillRect(s.x, s.y, s.w, s.h); cx.strokeStyle = "#9B3E14"; cx.lineWidth = 2; for (var px = s.x; px < s.x + s.w; px += 20) cx.strokeRect(px, s.y, 20, s.h); }
      else if (s.k === "wall") { rr(s.x, s.y, s.w, s.h, 6, "#2A3C5E"); cx.fillStyle = "#FFD23F"; cx.font = "bold 18px sans-serif"; cx.textAlign = "center"; cx.fillText("🔒", s.x + s.w / 2, s.y + s.h / 2); }
    });
    blocks.forEach(function (b) {
      if (b.x + b.w < cam - 20 || b.x > cam + W + 20) return;
      var by = b.y - (b.bump > 0 ? Math.sin(b.bump / 0.25 * Math.PI) * 10 : 0);
      rr(b.x, by, b.w, b.h, 8, b.st === 1 ? "#FFC83D" : b.st === 2 ? "#E8664A" : b.g.open ? "#C8B48A" : "#F6A93B");
      cx.strokeStyle = "#8A4B12"; cx.lineWidth = 3; cx.strokeRect(b.x + 1.5, by + 1.5, b.w - 3, b.h - 3);
      cx.fillStyle = b.st === 2 ? "#fff" : "#3A2208"; var fs = 19; cx.font = "bold " + fs + "px sans-serif";
      while (fs > 12 && cx.measureText(b.o.text).width > b.w - 12) { fs--; cx.font = "bold " + fs + "px sans-serif"; }
      cx.textAlign = "center"; cx.textBaseline = "middle"; if (cx.measureText(b.o.text).width > b.w - 12) wrapText(b.o.text, b.x + b.w / 2, by + b.h / 2, b.w - 12, fs + 2); else cx.fillText(b.o.text, b.x + b.w / 2, by + b.h / 2);
    });
    // 깃발
    cx.fillStyle = "#555"; cx.fillRect(flagX, GY - 170, 6, 170); cx.fillStyle = "#F26B1D"; cx.beginPath(); cx.moveTo(flagX + 6, GY - 170); cx.lineTo(flagX + 60, GY - 150); cx.lineTo(flagX + 6, GY - 130); cx.fill();
    // 몬스터
    enemies.forEach(function (e) {
      if (e.dead > 1) return;
      var hh = e.dead ? 10 : e.h; rr(e.x, e.y + (e.h - hh), e.w, hh, 10, "#2A3C5E");
      if (!e.dead) { cx.fillStyle = "#fff"; cx.fillRect(e.x + 6, e.y + 8, 7, 8); cx.fillRect(e.x + 17, e.y + 8, 7, 8); cx.fillStyle = "#000"; cx.fillRect(e.x + (e.vx < 0 ? 6 : 9), e.y + 11, 4, 5); cx.fillRect(e.x + (e.vx < 0 ? 17 : 20), e.y + 11, 4, 5); }
    });
    // 추격자: 보라빛 그림자 몬스터
    if (CH.x > cam - 60) {
      rr(CH.x, CH.y, CH.w, CH.h, 14, "rgba(92,60,140,.92)"); cx.fillStyle = "#fff"; cx.fillRect(CH.x + 7, CH.y + 12, 8, 9); cx.fillRect(CH.x + 20, CH.y + 12, 8, 9);
      cx.fillStyle = "#E8004C"; cx.fillRect(CH.x + 10, CH.y + 15, 4, 5); cx.fillRect(CH.x + 23, CH.y + 15, 4, 5);
      cx.fillStyle = "rgba(92,60,140,.92)"; for (var zz = 0; zz < 3; zz++) { cx.beginPath(); cx.moveTo(CH.x + zz * 12, CH.y + CH.h); cx.lineTo(CH.x + zz * 12 + 6, CH.y + CH.h + 8); cx.lineTo(CH.x + zz * 12 + 12, CH.y + CH.h); cx.fill(); }
    }
    // 주인공 (오리지널: 주황 몸 + 남색 모자 'M')
    if (!(P.inv > 0 && Math.floor(P.inv * 10) % 2)) {
      rr(P.x, P.y + 8, P.w, P.h - 8, 10, "#F26B1D"); rr(P.x - 2, P.y, P.w + 4, 14, 6, "#172844");
      cx.fillStyle = "#fff"; cx.font = "bold 11px sans-serif"; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText("M", P.x + P.w / 2, P.y + 7);
      cx.fillStyle = "#fff"; cx.fillRect(P.x + (P.face > 0 ? 17 : 5), P.y + 17, 8, 8); cx.fillStyle = "#000"; cx.fillRect(P.x + (P.face > 0 ? 21 : 6), P.y + 19, 3, 4);
      cx.fillStyle = "#172844"; cx.fillRect(P.x + 3, P.y + P.h - 6, 10, 6); cx.fillRect(P.x + P.w - 13, P.y + P.h - 6, 10, 6);
    }
    fx.forEach(function (f) { cx.fillStyle = f.c; cx.beginPath(); cx.arc(f.x, f.y, 5, 0, Math.PI * 2); cx.fill(); });
    cx.restore();
    // HUD
    rr(8, 8, W - 16, 40, 10, "rgba(23,40,68,.85)");
    cx.textBaseline = "middle"; cx.textAlign = "left"; cx.fillStyle = "#FF5A5A"; cx.font = "bold 20px sans-serif"; cx.fillText("♥".repeat(Math.max(0, hearts)), 20, 28);
    cx.fillStyle = "#fff"; cx.font = "bold 15px sans-serif"; cx.fillText("⏱ " + fmtMs(playT * 1000) + "  ·  " + correct + "/" + qs.length, 96, 28);
    var gap = P.x - (CH.x + CH.w); if (CH.wait <= 0 && gap < 260) { cx.fillStyle = "rgba(232,0,76," + (0.5 + 0.5 * Math.abs(Math.sin(playT * 8))) + ")"; cx.font = "bold 16px sans-serif"; cx.textAlign = "left"; cx.fillText("⚠ 추격자가 가까워요!", 16, 66); }
    var g = curGate();
    if (g) { cx.textAlign = "right"; cx.fillStyle = "#FFD23F"; var mf = 20; cx.font = "bold " + mf + "px sans-serif"; var mt = "뜻: " + g.w.meaning; while (mf > 12 && cx.measureText(mt).width > W - 330) { mf--; cx.font = "bold " + mf + "px sans-serif"; } cx.fillText(mt, W - 20, 29); }
  }
  // ---- 물리·게임 루프
  function step(dt) {
    var acc = 1500, max = 230, fr = keys.L ? -1 : keys.R ? 1 : 0;
    if (fr) { P.vx += fr * acc * dt; P.face = fr; } else P.vx *= Math.pow(0.0005, dt);
    P.vx = Math.max(-max, Math.min(max, P.vx));
    if (jumpQueued && P.on) { P.vy = -760; P.on = false; }
    jumpQueued = false;
    if (!keys.J && P.vy < -250) P.vy += 2600 * dt;  // 짧게 누르면 낮게 점프
    P.vy += 2100 * dt; if (P.vy > 900) P.vy = 900;
    var sol = solids.concat(blocks);
    P.x += P.vx * dt; if (P.x < 0) P.x = 0;
    sol.forEach(function (s) { if (hit(P, s)) { if (P.vx > 0) P.x = s.x - P.w; else if (P.vx < 0) P.x = s.x + s.w; P.vx = 0; } });
    P.y += P.vy * dt; P.on = false;
    sol.forEach(function (s) {
      if (!hit(P, s)) return;
      if (P.vy > 0) { P.y = s.y - P.h; P.vy = 0; P.on = true; }
      else if (P.vy < 0) { P.y = s.y + s.h; P.vy = 0; if (s.o) answer(s); }
    });
    if (P.inv > 0) P.inv -= dt;
    // 몬스터
    enemies.forEach(function (e) {
      if (e.dead) { e.dead += dt; return; }
      e.x += e.vx * dt; if (e.x < e.a || e.x + e.w > e.b) e.vx *= -1;
      if (hit(P, e)) { if (P.vy > 0 && P.y + P.h - e.y < 16) { e.dead = 0.01; P.vy = -480; score += 50; } else hurt(); }
    });
    // 구덩이
    if (P.y > H + 40) { hurt(); if (!over) { P.x = cp; P.y = GY - 120; P.vx = 0; P.vy = 0; CH.x = Math.min(CH.x, cp - 320); } }
    // 추격자
    playT += dt;
    if (CH.wait > 0) CH.wait -= dt; else { CH.sp = Math.min(185, 150 + playT * 0.4); CH.x += CH.sp * dt; }
    CH.y = GY - CH.h - Math.abs(Math.sin(playT * 7)) * 6;
    if (hit(P, CH)) { hurt(); CH.x = P.x - 300; CH.wait = 1.2; }
    // 문 앞에 오면 단어 발음
    var g = curGate();
    if (g && P.x > g.x0 - 220) { g.sayT = (g.sayT || 0) - dt; if (g.sayT <= 0 && !(window.speechSynthesis && speechSynthesis.speaking)) { say(g); g.sayT = 1.6; } }
    if (!curGate() && P.x > flagX - 10) end(true);
    fx.forEach(function (f) { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 900 * dt; f.t -= dt; }); fx = fx.filter(function (f) { return f.t > 0; });
    cam += ((P.x - W * 0.35) - cam) * Math.min(1, dt * 8); cam = Math.max(0, Math.min(worldW - W, cam));
  }
  function loop(now) {
    if (run !== PL.run && !over) { window.__gmStop = "run"; cleanup(); return; }  // 다른 화면으로 나가면 멈춤
    if (!document.getElementById("gm")) { window.__gmStop = "gone"; cleanup(); return; }
    var dt = Math.max(0, Math.min(0.033, (now - last) / 1000)); last = now;
    try { if (!over) step(dt); draw(); } catch (e) { window.__gmErr = String(e && e.stack || e); }  // 한 프레임 오류로 게임이 멈추지 않게
    if (!over) requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ---------- 🏃 빈칸 레이서 (파트5 문법 게임) ----------
   위에 빈칸 문장, 아래 4차선 도로. 보기가 적힌 문이 다가오면 정답 차선으로 옮겨 통과한다.
   맞히면 콤보·속도 업, 틀리면 하트 -1 + 정답 안내. 스테이지 = 교재 유형. 순위 = 클리어 시간(game_scores day 51~). */
var RACE_TYPES = ["2형식", "명사", "격", "부사", "형용사 · 소유격 · ing/ed", "능동태 · 수동태", "동사 수일치 · 조동사", "자동사",
  "명사절 · 관계대명사", "동명사 · to부정사 / 시제", "전치사 · 접속사", "비교 · 기타 구문", "어휘", "전체 랜덤"];
var RACE_N = 12;  // 한 판 문제 수
function raceCode(i) { return 51 + i; }
function raceRec(code) { try { return JSON.parse(ls("race:" + code) || "{}"); } catch (e) { return {}; } }
function racePool(type) {
  return poolKeys("RC").filter(function (x) { return x.sec.part === 5 && (type === "전체 랜덤" || x.t === type); });
}
function viewRaceMenu() {
  stopPlay();
  render(topbar("빈칸 레이서") + `<div class="card hero" style="background:linear-gradient(125deg,#172844,#2B4C7E)"><span class="kicker">MAKE TOEIC · GAME</span><h1>🚗 빈칸 레이서</h1>
    <p>🚗 내 차를 몰고 빈칸에 맞는 보기 차선의 게이트를 통과하세요! 앞차를 피하고(부딪히면 +2초) 코인을 먹으면(-0.3초) 기록이 줄어요. 3콤보부터 🔥부스터!</p></div>
    <button class="btn navy" data-go="#/rrank/-1" style="margin-bottom:10px">🏆 레이서 순위 (클리어 시간 대결)</button>
    <div class="card" style="font-size:13.5px">조작: <b>휴대폰</b> 도로를 왼쪽·오른쪽으로 밀기(스와이프) 또는 아래 ◀ ▶ 버튼 · <b>PC</b> 방향키 ← →. 한 판 ${RACE_N}문제 · 하트 3개. 단계(기초·중급·고급)에 따라 문이 다가오는 속도가 달라요.</div>` +
    RACE_TYPES.map(function (t, i) {
      var n = racePool(t).length, r = raceRec(raceCode(i));
      if (n < 4) return "";
      return `<button class="row" data-go="#/race/${raceCode(i)}"><span class="pill ${t === "어휘" || t === "전체 랜덤" ? "o" : "n"}">${t === "전체 랜덤" ? "MIX" : t === "어휘" ? "VOCA" : "문법"}</span><span class="t"><b>${esc(t)}</b><small>${n}문제 중 ${Math.min(RACE_N, n)}문제 출제 · ${r.ms ? "내 최고 ⏱ " + fmtMs(r.ms) : "아직 클리어 전"}</small></span><span style="font-size:18px">${"★".repeat(r.stars || 0)}<span style="color:#D6DCE4">${"★".repeat(3 - (r.stars || 0))}</span></span></button>`;
    }).join(""));
  bindCommon();
}
function viewRace(code) {
  stopPlay();
  var ti = code - 51, type = RACE_TYPES[ti]; if (!type) return go("#/race");
  render('<div class="empty">문제를 준비하는 중…</div>');
  // 틀린 문제 → 안 푼 문제 → 맞힌 문제 순으로 섞어서 출제
  var pool = racePool(type), wrong = pool.filter(function (x) { var p = S.prog[x.k]; return p && !p[1]; }), un = pool.filter(function (x) { return !S.prog[x.k]; }), ok = pool.filter(function (x) { var p = S.prog[x.k]; return p && p[1]; });
  var pick = shuffle(wrong).concat(shuffle(un), shuffle(ok)).slice(0, RACE_N).map(function (x) { return x.k; });
  loadItems(shuffle(pick)).then(function (list) {
    list = list.filter(function (x) { return (x.q.options || []).length >= 2; });
    render(topbar("빈칸 레이서 · " + type) + `
      <div style="display:flex;gap:8px;margin-bottom:8px"><button class="btn ghost sm" data-go="#/race">‹ 스테이지 목록</button><span style="flex:1"></span><button class="btn ghost sm" id="rc-bgm">${ls("bgm") === "0" ? "🔇 음악 꺼짐" : "🎵 음악 켜짐"}</button></div>
      <div class="card" id="rc-q" style="min-height:74px;font-size:17px;line-height:1.55;padding:12px 14px"></div>
      <div id="rc-wrap" style="position:relative;border-radius:14px;overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none;background:#8FD3F5">
        <canvas id="rc" width="640" height="400" style="display:block;width:100%;height:auto"></canvas>
        <div id="rc-over" style="display:none;position:absolute;inset:0;background:rgba(18,30,52,.86);color:#fff;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:16px"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">
        <button class="btn navy" data-lane="-1" style="font-size:22px;padding:14px 0">◀</button>
        <button class="btn navy" data-lane="1" style="font-size:22px;padding:14px 0">▶</button>
      </div>`);
    bindCommon();
    raceRun(code, type, list);
  }).catch(function () { });
}
function raceRun(code, type, list) {
  var cv = document.getElementById("rc"), cx = cv.getContext("2d"), W = 640, H = 400, HZ = 120, BOT = 352, run = PL.run;
  var qi = 0, lane = 1, laneX = 1, p = 0, combo = 0, best = 0, hearts = 3, correct = 0, wrongN = 0, playT = 0, over = false, paused = false, flash = 0, flashOk = true, last = performance.now(), pops = [];
  var lvMul = S.level === "기초" ? 1.35 : S.level === "고급" ? 0.8 : 1;
  var bgm = makeBgm("race"), bgmOn = ls("bgm") !== "0", bgmStarted = false;
  function bgmKick() { if (bgmOn && !bgmStarted && !over) { bgmStarted = true; bgm.start(); } }
  document.getElementById("rc-bgm").onclick = function () { bgmOn = !bgmOn; ls("bgm", bgmOn ? "1" : "0"); this.textContent = bgmOn ? "🎵 음악 켜짐" : "🔇 음악 꺼짐"; if (bgmOn) { bgmStarted = false; bgmKick(); } else { bgm.stop(); bgmStarted = false; } };
  function cur() { return list[qi]; }
  function lanes() { return Math.min(4, (cur().q.options || []).length); }
  function dur() { return Math.max(4.2, (9.5 - combo * 0.35)) * lvMul; }  // 문이 도착할 때까지 걸리는 시간(초)
  function showQ() {
    var x = cur(), q = x.q, el = document.getElementById("rc-q"); if (!el) return;
    el.innerHTML = `<div style="font-size:12.5px;color:#5B6573;margin-bottom:4px">${qi + 1} / ${list.length} · ${esc(typeOfKey(x.key))}</div>${blankG(q)}
      <div style="display:grid;grid-template-columns:repeat(${Math.min(4, q.options.length)},1fr);gap:6px;margin-top:10px">${q.options.slice(0, 4).map(function (o, j) { return `<span class="rc-chip" style="background:${["#F26B1D", "#2B9BD8", "#2EAD6B", "#9B59B6"][j]};color:#fff;border-radius:10px;padding:8px 3px;font-size:${o.length > 12 ? 12.5 : o.length > 9 ? 14 : 16}px;font-weight:900;text-align:center;overflow-wrap:break-word;word-break:keep-all;line-height:1.25;border:3px solid transparent;transition:transform .12s"><span style="font-size:12px;opacity:.85">${L[j]}</span><br>${esc(o)}</span>`; }).join("")}</div>`;
    lane = Math.min(lane, lanes() - 1); markLane();
  }
  function move(d) { if (over || paused) return; bgmKick(); lane = Math.max(0, Math.min(lanes() - 1, lane + d)); markLane(); }
  // 지금 내 차가 있는 차선의 보기를 노란 테두리로 표시
  function markLane() { app.querySelectorAll(".rc-chip").forEach(function (c, j) { c.style.borderColor = j === lane ? "#FFE45C" : "transparent"; c.style.transform = j === lane ? "scale(1.06)" : ""; c.style.boxShadow = j === lane ? "0 0 0 2px #172844" : ""; }); }
  app.querySelectorAll("[data-lane]").forEach(function (b) { ["touchstart", "mousedown"].forEach(function (e) { b.addEventListener(e, function (ev) { ev.preventDefault(); move(+b.dataset.lane); }, { passive: false }); }); });
  var sx = null, wrap = document.getElementById("rc-wrap");
  wrap.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; bgmKick(); }, { passive: true });
  wrap.addEventListener("touchend", function (e) { if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 30) move(dx > 0 ? 1 : -1); sx = null; }, { passive: true });
  function kd(e) { if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); } else if (e.key === "ArrowRight") { e.preventDefault(); move(1); } }
  window.addEventListener("keydown", kd);
  function cleanup() { window.removeEventListener("keydown", kd); bgm.stop(); }
  function judge() {
    var x = cur(), q = x.q, ok = lane === q.answer, prev = S.prog[x.key];
    S.prog[x.key] = [lane, ok, prev ? prev[2] + 1 : 1];
    api("save_progress", { p_token: S.token, p_item: x.key, p_chosen: lane, p_correct: ok }).catch(function () { });
    flash = 0.5; flashOk = ok;
    if (ok) { correct++; combo++; best = Math.max(best, combo); pops.push({ t: 0.8, txt: combo > 1 ? combo + " COMBO!" : "GOOD!" }); next(); }
    else {
      wrongN++; combo = 0; hearts--; paused = true;
      var ov = document.getElementById("rc-over"); ov.style.display = "flex";
      ov.innerHTML = `<div style="font-size:24px;font-weight:900;color:#FF8A8A">✕ 오답</div><div style="font-size:18px;margin:8px 0">정답 <b style="color:#FFD23F">(${L[q.answer]}) ${esc(q.options[q.answer])}</b></div>
        ${q.hint ? `<div style="font-size:14px;max-width:520px;color:#DDE6F2">💡 ${esc(q.hint)}</div>` : ""}<button class="btn" id="rc-go" style="margin-top:14px">${hearts > 0 ? "계속 달리기" : "결과 보기"}</button>`;
      document.getElementById("rc-go").onclick = function () { ov.style.display = "none"; paused = false; last = performance.now(); if (hearts <= 0) end(false); else next(); };
    }
  }
  function next() { qi++; p = 0; if (qi >= list.length) end(true); else showQ(); }
  function end(win) {
    if (over) return; over = true; cleanup();
    var ms = Math.round(raceTime() * 1000), rec = raceRec(code), stars = win ? (hearts >= 3 ? 3 : hearts === 2 ? 2 : 1) : 0;
    if (win && (!rec.ms || ms < rec.ms)) rec.ms = ms; if (stars > (rec.stars || 0)) rec.stars = stars; ls("race:" + code, JSON.stringify(rec));
    var ov = document.getElementById("rc-over"); if (!ov) return; ov.style.display = "flex";
    ov.innerHTML = `<div style="font-size:28px;font-weight:900">${win ? "🏁 골인!" : "GAME OVER"}</div>
      <div style="font-size:26px;margin:4px 0;color:#FFD23F">${"★".repeat(stars)}<span style="color:#56657A">${"★".repeat(3 - stars)}</span></div>
      <div style="font-size:15px">${win ? "기록 <b style=\"color:#FFD23F\">" + fmtMs(ms) + "</b> · " : ""}정답 ${correct}/${list.length} · 최대 콤보 ${best} · 코인 ${coinsN}개${penalty ? " · 충돌 +" + penalty + "초" : ""}</div>
      ${win ? '<div id="rc-rank" style="margin-top:6px;font-size:14px">순위 확인 중…</div>' : ""}
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;justify-content:center"><button class="btn" id="rc-again">다시 달리기</button><button class="btn ghost" data-go="#/rrank/${code}" style="background:#fff">🏆 순위</button>${win ? '<button class="btn ghost" id="rc-share" style="background:#fff">📤 공유</button>' : ""}${wrongN ? '<button class="btn ghost" data-go="#/wrong" style="background:#fff">오답노트</button>' : ""}</div>`;
    bindCommon(); document.getElementById("rc-again").onclick = function () { viewRace(code); };
    if (win) {
      var rk = null;
      api("game_save", { p_token: S.token, p_day: code, p_ms: ms, p_stars: stars }).then(function (r) {
        var el = document.getElementById("rc-rank"); if (!el) return; if (!r || r.status !== "ok") { el.textContent = ""; return; }
        rk = r; el.innerHTML = `🏆 ${esc(type)} 순위 <b style="color:#FFD23F">${r.rank}위</b> / ${r.total}명 · 내 최고 ${fmtMs(r.best_ms)}`;
      }).catch(function () { var el = document.getElementById("rc-rank"); if (el) el.textContent = ""; });
      document.getElementById("rc-share").onclick = function () {
        var txt = "🏃 메이크토익 빈칸 레이서 [" + type + "] 골인! ⏱ " + fmtMs(ms) + " · 정답 " + correct + "/" + list.length + (rk ? " · " + rk.rank + "위 / " + rk.total + "명" : "") + "\n나보다 빨리 달릴 수 있어? 👉 https://maketoeic.com/?mk=study";
        if (navigator.share) navigator.share({ title: "메이크토익 빈칸 레이서", text: txt }).catch(function () { });
        else { try { navigator.clipboard.writeText(txt).then(function () { alert("결과 문구를 복사했어요. 카카오톡 등에 붙여 넣어 공유하세요!"); }); } catch (e) { prompt("아래 문구를 복사해서 공유하세요", txt); } }
      };
    }
  }
  // ---- 차차차 스타일: 만화풍 자동차 · 앞차 피하기 · 코인 · 부스터 (그림은 모두 직접 그린 오리지널)
  var objs = [], spawnT = 0.6, penalty = 0, coinsN = 0, crash = 0, shake = 0;
  var CARS = ["#3FA9F5", "#7ED957", "#FF6B9A", "#B57BFF", "#FFC23D"];
  function raceTime() { return Math.max(0, playT + penalty - coinsN * 0.3); }
  function rr(x, y, w, h, r, f) { cx.fillStyle = f; cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.fill(); }
  function roadAt(t) { var y = HZ + (BOT - HZ) * t, w = 90 + (600 - 90) * t; return { y: y, w: w, x0: 320 - w / 2 }; }
  // 뒤에서 본 귀여운 자동차 (s = 크기 배율)
  function car(x, y, s, col, me) {
    cx.save(); cx.translate(x, y); cx.scale(s, s);
    cx.fillStyle = "rgba(0,0,0,.18)"; cx.beginPath(); cx.ellipse(0, 2, 40, 9, 0, 0, Math.PI * 2); cx.fill();
    rr(-36, -30, 14, 22, 5, "#222"); rr(22, -30, 14, 22, 5, "#222");                 // 바퀴
    rr(-34, -46, 68, 40, 14, col);                                                     // 몸통
    rr(-24, -66, 48, 26, 12, col); rr(-19, -62, 38, 17, 7, "#BFE7FF");                 // 지붕·뒷유리
    rr(-30, -26, 12, 7, 3, "#FF3B3B"); rr(18, -26, 12, 7, 3, "#FF3B3B");               // 브레이크등
    rr(-13, -21, 26, 11, 3, "#fff"); cx.fillStyle = "#172844"; cx.font = "bold 9px sans-serif"; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText(me ? "MAKE" : "TOEIC", 0, -15.5);
    if (me) { rr(-10, -78, 20, 10, 4, "#172844"); cx.fillStyle = "#fff"; cx.font = "bold 8px sans-serif"; cx.fillText("M", 0, -73); }  // 지붕 위 M 깃발
    cx.restore();
  }
  function draw() {
    cx.save(); if (shake > 0) cx.translate((Math.random() - .5) * 10 * shake, (Math.random() - .5) * 6 * shake);
    var sky = cx.createLinearGradient(0, 0, 0, HZ); sky.addColorStop(0, "#43B3F2"); sky.addColorStop(1, "#C9EEFF"); cx.fillStyle = sky; cx.fillRect(-10, -10, W + 20, HZ + 10);
    // 먼 산과 구름
    cx.fillStyle = "#8FD18A"; for (var m = 0; m < 5; m++) { cx.beginPath(); cx.arc(m * 160 + 40, HZ + 30, 90, Math.PI, 0); cx.fill(); }
    for (var i = 0; i < 4; i++) rr((i * 190 + playT * 12) % 760 - 60, 24 + (i % 2) * 26, 80, 22, 11, "rgba(255,255,255,.95)");
    cx.fillStyle = "#6CC35F"; cx.fillRect(-10, HZ, W + 20, H - HZ + 10);
    var n = lanes(), top = roadAt(0), bot = roadAt(1.15), boost = combo >= 3;
    // 빨강·흰 연석 (움직임)
    for (var d = 0; d < 16; d++) {
      var t1 = d / 16 + (playT * (boost ? 1.4 : 0.9)) % (1 / 16), t2 = t1 + 1 / 32; if (t2 > 1.15) continue;
      var a1 = roadAt(t1 * t1), a2 = roadAt(t2 * t2), cw1 = a1.w * 0.05, cw2 = a2.w * 0.05;
      cx.fillStyle = d % 2 ? "#E8443A" : "#FFFFFF";
      [[a1.x0 - cw1, a2.x0 - cw2, a2.x0, a1.x0], [a1.x0 + a1.w, a2.x0 + a2.w, a2.x0 + a2.w + cw2, a1.x0 + a1.w + cw1]].forEach(function (xs) { cx.beginPath(); cx.moveTo(xs[0], a1.y); cx.lineTo(xs[1], a2.y); cx.lineTo(xs[2], a2.y); cx.lineTo(xs[3], a1.y); cx.fill(); });
    }
    cx.fillStyle = "#565E6C"; cx.beginPath(); cx.moveTo(top.x0, top.y); cx.lineTo(top.x0 + top.w, top.y); cx.lineTo(bot.x0 + bot.w, bot.y); cx.lineTo(bot.x0, bot.y); cx.fill();
    // 길가 나무 (움직임)
    for (var tr = 0; tr < 8; tr++) {
      var tt = tr / 8 + (playT * (boost ? 0.7 : 0.45)) % (1 / 8), tz = tt * tt, ra = roadAt(tz), sc = 0.25 + tz * 1.1;
      [ra.x0 - 40 * sc - ra.w * 0.08, ra.x0 + ra.w + 40 * sc + ra.w * 0.08].forEach(function (tx) { cx.fillStyle = "#8B5A2B"; cx.fillRect(tx - 4 * sc, ra.y - 30 * sc, 8 * sc, 30 * sc); cx.fillStyle = "#2E9E4F"; cx.beginPath(); cx.arc(tx, ra.y - 38 * sc, 22 * sc, 0, Math.PI * 2); cx.fill(); });
    }
    // 차선 점선
    cx.strokeStyle = "rgba(255,255,255,.8)"; cx.lineWidth = 3;
    for (var k = 1; k < n; k++) for (var e = 0; e < 12; e++) {
      var u1 = e / 12 + (playT * (boost ? 1.4 : 0.9)) % (1 / 12), u2 = u1 + 0.035; if (u2 > 1.15) continue;
      var b1 = roadAt(u1 * u1), b2 = roadAt(u2 * u2); cx.beginPath(); cx.moveTo(b1.x0 + b1.w * k / n, b1.y); cx.lineTo(b2.x0 + b2.w * k / n, b2.y); cx.stroke();
    }
    // 앞차·코인 (먼 것부터)
    objs.slice().sort(function (a, b) { return a.z - b.z; }).forEach(function (o) {
      var tz = o.z * o.z, ra = roadAt(tz), ox = ra.x0 + ra.w * (o.lane + 0.5) / n, sc = 0.15 + tz * 0.85;
      if (o.k === "car") car(ox, ra.y, sc, o.col, false);
      else { var cs = 10 + 16 * tz; cx.fillStyle = "#FFC400"; cx.beginPath(); cx.ellipse(ox, ra.y - cs * 1.4, cs * Math.abs(Math.cos(playT * 5)) + 2, cs, 0, 0, Math.PI * 2); cx.fill(); cx.fillStyle = "#FFF3B0"; cx.font = "bold " + Math.round(cs) + "px sans-serif"; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText("₩", ox, ra.y - cs * 1.4); }
    });
    // 보기 문 (아치형 게이트)
    if (!over && cur()) {
      var q = cur().q, t = p * p, g = roadAt(t), gh = 24 + 78 * t, fs = Math.max(11, Math.round(11 + 24 * t));
      for (var j = 0; j < n; j++) {
        var lx = g.x0 + g.w * j / n + 3, lw = g.w / n - 6, colr = ["#F26B1D", "#2B9BD8", "#2EAD6B", "#9B59B6"][j];
        cx.fillStyle = colr; cx.fillRect(lx, g.y - gh * 1.6, 3 + 3 * t, gh * 1.6); cx.fillRect(lx + lw - 3 - 3 * t, g.y - gh * 1.6, 3 + 3 * t, gh * 1.6);
        rr(lx, g.y - gh * 1.6, lw, gh, 6 * t + 2, colr);
        if (j === lane) { cx.strokeStyle = "#FFE45C"; cx.lineWidth = 3 + 3 * t; cx.strokeRect(lx - 2, g.y - gh * 1.6 - 2, lw + 4, gh + 4); }  // 내 차선 게이트 강조
        cx.textAlign = "center"; cx.textBaseline = "middle";
        var label = q.options[j], f2 = fs; cx.font = "900 " + f2 + "px sans-serif";
        while (f2 > 9 && cx.measureText(label).width > lw - 8) { f2--; cx.font = "900 " + f2 + "px sans-serif"; }
        cx.lineJoin = "round"; cx.strokeStyle = "rgba(0,0,0,.55)"; cx.lineWidth = Math.max(2, f2 / 5); cx.strokeText(label, lx + lw / 2, g.y - gh * 1.1);
        cx.fillStyle = "#fff"; cx.fillText(label, lx + lw / 2, g.y - gh * 1.1);
        var bs = Math.max(8, Math.round(f2 * 0.7)); rr(lx + 3, g.y - gh * 1.6 + 3, bs + 6, bs + 4, 4, "rgba(255,255,255,.9)"); cx.fillStyle = colr; cx.font = "900 " + bs + "px sans-serif"; cx.fillText(L[j], lx + 6 + bs / 2, g.y - gh * 1.6 + 5 + bs / 2);
      }
    }
    // 내 차 (차선 이동 시 살짝 기울기 · 부스터 불꽃)
    laneX += (lane - laneX) * 0.22;
    var bb = roadAt(1), px = bb.x0 + bb.w * (laneX + 0.5) / n, py = BOT + 30 - Math.abs(Math.sin(playT * 14)) * 2;
    if (boost) for (var fl = 0; fl < 2; fl++) { cx.fillStyle = ["#FFD23F", "#FF6A00"][fl]; cx.beginPath(); cx.ellipse(px + (fl ? 12 : -12), py + 4, 6, 10 + Math.random() * 8, 0, 0, Math.PI * 2); cx.fill(); }
    cx.save(); cx.translate(px, py); cx.rotate((lane - laneX) * -0.12); car(0, 0, 1, crash > 0 && Math.floor(crash * 12) % 2 ? "#FFFFFF" : "#F26B1D", true); cx.restore();
    if (boost) { cx.strokeStyle = "rgba(255,255,255,.5)"; cx.lineWidth = 2; for (var sl = 0; sl < 10; sl++) { var ang = sl / 10 * Math.PI * 2 + playT; cx.beginPath(); cx.moveTo(320 + Math.cos(ang) * 200, 230 + Math.sin(ang) * 120); cx.lineTo(320 + Math.cos(ang) * 320, 230 + Math.sin(ang) * 190); cx.stroke(); } }
    cx.restore();
    // 판정 반짝임 · 글자
    if (flash > 0) { cx.fillStyle = flashOk ? "rgba(46,173,107," + flash * 0.5 + ")" : "rgba(232,0,76," + flash * 0.5 + ")"; cx.fillRect(0, 0, W, H); }
    pops.forEach(function (o) { cx.fillStyle = o.c ? o.c.replace("A", Math.min(1, o.t * 2)) : "rgba(255,210,63," + Math.min(1, o.t * 2) + ")"; cx.font = "bold 30px sans-serif"; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.strokeStyle = "rgba(23,40,68,.6)"; cx.lineWidth = 4; cx.strokeText(o.txt, 320, 190 - (0.8 - o.t) * 60); cx.fillText(o.txt, 320, 190 - (0.8 - o.t) * 60); });
    // HUD
    rr(8, 8, W - 16, 38, 10, "rgba(23,40,68,.85)"); cx.textBaseline = "middle"; cx.textAlign = "left";
    cx.fillStyle = "#FF5A5A"; cx.font = "bold 19px sans-serif"; cx.fillText("♥".repeat(Math.max(0, hearts)), 18, 27);
    cx.fillStyle = "#fff"; cx.font = "bold 15px sans-serif"; cx.fillText("⏱ " + fmtMs(raceTime() * 1000) + "  ·  " + correct + "/" + list.length + "  ·  ₩" + coinsN + (boost ? "  ·  🔥부스터" : combo > 1 ? "  ·  " + combo + "콤보" : ""), 92, 27);
    cx.fillStyle = "rgba(255,255,255,.35)"; cx.fillRect(16, 52, W - 32, 5); cx.fillStyle = "#FFD23F"; cx.fillRect(16, 52, (W - 32) * p, 5);
  }
  // 앞차·코인 생성: 문이 너무 가까울 때는 만들지 않아 정답 차선을 막지 않는다
  function spawn(dt) {
    spawnT -= dt; if (spawnT > 0 || p > 0.55) return;
    spawnT = (0.9 + Math.random() * 0.8) * (dur() / 9);
    var n = lanes(), l = Math.floor(Math.random() * n), free = [];
    for (var i = 0; i < n; i++) if (i !== l) free.push(i);
    objs.push({ k: "car", lane: l, z: 0, col: CARS[Math.floor(Math.random() * CARS.length)] });
    if (Math.random() < 0.8) objs.push({ k: "coin", lane: free[Math.floor(Math.random() * free.length)], z: 0 });
  }
  function loop(now) {
    if (run !== PL.run && !over) { cleanup(); return; }
    if (!document.getElementById("rc")) { cleanup(); return; }
    var dt = Math.max(0, Math.min(0.033, (now - last) / 1000)); last = now;
    try {
      if (!over && !paused) {
        playT += dt; var sp = dt / dur(); p += sp;
        spawn(dt);
        objs.forEach(function (o) { o.z += sp * (o.k === "car" ? 0.75 : 1); });  // 앞차는 같은 방향으로 달려서 조금 느리게 다가온다
        objs = objs.filter(function (o) {
          if (o.z < 0.97) return true;
          if (o.lane === lane) {
            if (o.k === "coin") { coinsN++; pops.push({ t: 0.5, txt: "₩ -0.3초", c: "rgba(255,196,0,A)" }); }
            else if (crash <= 0) { penalty += 2; crash = 1; shake = 0.6; combo = 0; pops.push({ t: 0.8, txt: "쾅! +2초", c: "rgba(255,90,90,A)" }); }
          }
          return false;
        });
        if (p >= 1) { p = 1; judge(); }
      }
      if (flash > 0) flash -= dt; if (crash > 0) crash -= dt; if (shake > 0) shake -= dt;
      pops.forEach(function (o) { o.t -= dt; }); pops = pops.filter(function (o) { return o.t > 0; });
      draw();
    } catch (e) { window.__rcErr = String(e && e.stack || e); }
    if (!over) requestAnimationFrame(loop); else draw();
  }
  if (!list.length) { render(topbar("빈칸 레이서") + '<div class="empty">이 유형은 아직 문제가 없어요.</div>'); bindCommon(); return; }
  showQ(); requestAnimationFrame(loop);
}
function viewRaceRank(code) {
  stopPlay();
  render(topbar("🏆 빈칸 레이서 순위") + '<div class="empty">순위를 불러오는 중…</div>');
  api("game_ranking", { p_token: S.token, p_day: code }).then(function (r) {
    r = r || {}; var top = r.top || [], me = r.me, all = code < 0, name = all ? "종합" : RACE_TYPES[code - 51] || "";
    var tabs = `<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;margin-bottom:8px"><button class="btn ${all ? "navy" : "ghost"} sm" data-go="#/rrank/-1">종합</button>${RACE_TYPES.map(function (t, i) { return `<button class="btn ${code === raceCode(i) ? "navy" : "ghost"} sm" data-go="#/rrank/${raceCode(i)}" style="white-space:nowrap">${esc(t)}</button>`; }).join("")}</div>`;
    render(topbar("🏆 빈칸 레이서 순위") + tabs + `<div class="card hero" style="background:linear-gradient(125deg,#172844,#2B4C7E)"><span class="kicker">${all ? "종합 · 골인한 스테이지 수 → 합계 시간" : esc(name) + " · 클리어 시간 대결"}</span>
      <h1>${me ? "내 순위 " + me.rank + "위" : "아직 기록이 없어요"}</h1><p>${me ? (all ? "골인 " + me.cleared + "개 · 합계 " + fmtMs(me.ms) : "내 최고 기록 " + fmtMs(me.ms)) : "끝까지 골인하면 순위에 올라가요"} · 참가 ${r.players || 0}명</p></div>
      <div class="card" style="padding:6px 12px">${top.length ? top.map(function (t) {
        var medal = t.rank === 1 ? "🥇" : t.rank === 2 ? "🥈" : t.rank === 3 ? "🥉" : t.rank + "위";
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 4px;border-bottom:1px solid #EEF1F5;${t.me ? "background:#FFF4EC;border-radius:10px" : ""}"><b style="min-width:40px;font-size:${t.rank <= 3 ? 20 : 15}px">${medal}</b><span style="flex:1;font-weight:800">${esc(t.label)}${t.me ? " (나)" : ""}</span><span style="color:#5B6573;font-size:14px">${all ? t.cleared + "개 · " + fmtMs(t.ms) : "⏱ " + fmtMs(t.ms)}</span></div>`;
      }).join("") : '<div class="empty">아직 아무도 골인하지 않았어요. 첫 1등에 도전하세요!</div>'}</div>
      <div style="display:grid;gap:8px">${all ? "" : `<button class="btn" data-go="#/race/${code}">이 스테이지 달리기</button>`}<button class="btn ghost" data-go="#/race">스테이지 목록</button></div>`);
    bindCommon();
  }).catch(function () { render(topbar("🏆 빈칸 레이서 순위") + '<div class="empty">순위를 불러오지 못했어요.</div>'); bindCommon(); });
}

/* ---------- 🎬 기출 릴스 (파트3·4 원본 음원 + 단어 자막 + 정답 공개 영상, 학습실 안에서만) ----------
   목록은 videos.reels = [{ id, title, part, qs, file, thumb }] (파일은 study-audio 저장소) */
function reelList() { return (S.videos && S.videos.reels) || []; }
function reelUrl(f) { return audioUrl("__AUDIO_BASE__/" + f); }
function viewReels() {
  stopPlay();
  var list = reelList();
  render(topbar("🎬 기출 릴스") + `<div class="card hero" style="background:linear-gradient(125deg,#172844,#3A2A6B)"><span class="kicker">PART 3 · 4 실전 듣기</span><h1>🎬 기출 릴스</h1>
    <p>문제를 먼저 보고 → 원본 음원을 단어 자막과 함께 듣고 → 정답과 단서 문장을 확인해요. 1분 남짓이라 이동 중에 보기 좋아요.</p></div>` +
    (list.length ? `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">${list.map(function (r) {
      var seen = ls("reel:" + r.id) === "1";
      return `<button data-go="#/reel/${esc(r.id)}" style="border:0;padding:0;background:#fff;border-radius:14px;overflow:hidden;text-align:left;box-shadow:0 2px 8px rgba(23,40,68,.12);cursor:pointer">
        <div style="position:relative;aspect-ratio:9/16;background:#172844 url('${esc(reelUrl(r.thumb))}') center/cover"><span style="position:absolute;left:8px;top:8px" class="pill o">PART ${r.part}</span>${seen ? '<span style="position:absolute;right:8px;top:8px" class="pill n">✓ 봤어요</span>' : ""}
          <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:44px;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.5)">▶</span></div>
        <div style="padding:8px 10px;font-size:13.5px;font-weight:800;color:#172844">${esc(r.title)}<br><small style="color:#5B6573;font-weight:600">${esc(r.qs || "")}번</small></div></button>`;
    }).join("")}</div>` : '<div class="empty">릴스를 준비 중이에요.</div>'));
  bindCommon();
}
function viewReel(id) {
  stopPlay();
  var list = reelList(), i = list.findIndex(function (r) { return r.id === id; }), r = list[i];
  if (!r) return go("#/reels");
  render(topbar(r.title) + `<div style="max-width:420px;margin:0 auto"><video id="rl-v" src="${esc(reelUrl(r.file))}" poster="${esc(reelUrl(r.thumb))}" controls playsinline preload="metadata" style="width:100%;border-radius:14px;background:#000;aspect-ratio:9/16"></video></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">
      ${i > 0 ? `<button class="btn ghost" data-go="#/reel/${esc(list[i - 1].id)}">‹ 이전 릴스</button>` : "<span></span>"}
      ${i < list.length - 1 ? `<button class="btn navy" data-go="#/reel/${esc(list[i + 1].id)}">다음 릴스 ›</button>` : `<button class="btn ghost" data-go="#/reels">릴스 목록</button>`}
    </div>`);
  bindCommon();
  var v = document.getElementById("rl-v");
  v.addEventListener("ended", function () { ls("reel:" + r.id, "1"); });
  v.play().catch(function () { });  // 자동 재생이 막히면 재생 버튼을 누르면 된다
}

/* ---------- 오늘의 학습 카드 (하루 목표 · 연속 학습일 · 최근 7일) ---------- */
function todayCard() {
  var d = studyDays(), today = d[ymdLocal()] || 0, goal = +(ls("goal") || 20), st = streak(), days = [];
  for (var i = 6; i >= 0; i--) { var t = new Date(); t.setDate(t.getDate() - i); days.push({ k: ymdLocal(t), n: d[ymdLocal(t)] || 0, w: "일월화수목금토"[t.getDay()] }); }
  var mx = Math.max(goal, Math.max.apply(null, days.map(function (x) { return x.n; })));
  return `<div class="card" style="padding:14px 16px">
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <b style="font-size:16px">오늘의 학습</b><span class="pill ${today >= goal ? "o" : "n"}">${today >= goal ? "🎉 목표 달성" : "목표까지 " + (goal - today) + "문제"}</span>
      <span style="flex:1"></span><span style="font-weight:800;color:#E95721">🔥 연속 ${st}일</span></div>
    <div class="bar" style="margin:10px 0 6px"><i style="width:${pct(Math.min(today, goal), goal)}%"></i></div>
    <div style="display:flex;justify-content:space-between;font-size:13px;color:#5B6573"><span>오늘 ${today} / ${goal}문제</span>
      <span>하루 목표 ${[10, 20, 30, 50].map(function (g) { return `<button class="btn ${goal === g ? "navy" : "ghost"} sm" data-goal="${g}" style="padding:3px 8px">${g}</button>`; }).join(" ")}</span></div>
    <div style="display:flex;gap:6px;align-items:flex-end;height:52px;margin-top:10px">${days.map(function (x) {
      return `<div style="flex:1;text-align:center;font-size:11px;color:#5B6573"><div style="height:${Math.max(3, Math.round(x.n / mx * 34))}px;background:${x.n >= goal ? "#F26B1D" : x.n ? "#F6B48A" : "#E4E8EE"};border-radius:4px;margin-bottom:3px"></div>${x.w}</div>`;
    }).join("")}</div></div>`;
}

/* ---------- 문제 저장(북마크) ---------- */
function bmList() { try { return JSON.parse(ls("bm") || "[]"); } catch (e) { return []; } }
function bmHas(k) { return bmList().indexOf(k) >= 0; }
function bmToggle(k) { var l = bmList(), i = l.indexOf(k); if (i >= 0) l.splice(i, 1); else l.push(k); ls("bm", JSON.stringify(l)); return i < 0; }
function bmBtn(key) { var on = bmHas(key); return `<button class="btn ${on ? "" : "ghost"} sm" data-bm="${esc(key)}" title="문제 저장" style="float:right;padding:3px 9px">${on ? "★ 저장됨" : "☆ 저장"}</button>`; }
function bindBm() { app.querySelectorAll("[data-bm]").forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); var on = bmToggle(b.dataset.bm); b.textContent = on ? "★ 저장됨" : "☆ 저장"; b.className = "btn " + (on ? "" : "ghost") + " sm"; }; }); }

/* ---------- 여러 단원의 문항을 키로 모아 오기 ---------- */
function loadItems(keys) {
  var ids = []; keys.forEach(function (k) { var id = k.split(":")[0]; if (ids.indexOf(id) < 0) ids.push(id); });
  return Promise.all(ids.map(function (id) { return load("sec:" + id).catch(function () { return null; }); })).then(function (secs) {
    var map = {};
    secs.forEach(function (sec) { if (sec) itemsOf(sec).forEach(function (x) { x.sec = sec; map[x.key] = x; }); });
    return keys.map(function (k) { return map[k]; }).filter(function (x) { return x && !x.set; });
  });
}
function mixSec(title, area, list) { return { id: "mix", title: title, area: area, part: area === "LC" ? 2 : 5, items: list.map(function (x) { return x.q; }), sets: [] }; }
function mixQuiz(title, area, list, back) {
  if (!list.length) return render(topbar(title) + '<div class="empty">풀 문제가 없어요.</div>'), bindCommon();
  var sec = mixSec(title, area, list);
  Q = { sec: sec, pages: list.map(function (x) { return [x]; }), i: 0, title: title, ok: 0, n: 0, back: back };
  page();
}
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
// 화면에 공개된 문항 키와 유형 목록
function poolKeys(area) {
  var out = [];
  S.catalog.sections.forEach(function (s) { if (s.area !== area) return; (s.keys || []).forEach(function (k, i) { out.push({ k: k, t: (s.types || [])[i] || s.title, sec: s }); }); });
  return out;
}

/* ---------- 실력 분석: 유형별 정답률 · 약점 · 예상 정답 수 ---------- */
function typeStats(area) {
  var by = {};
  poolKeys(area).forEach(function (x) {
    var b = by[x.t] = by[x.t] || { t: x.t, total: 0, done: 0, ok: 0 }; b.total++;
    var p = S.prog[x.k]; if (p) { b.done++; if (p[1]) b.ok++; }
  });
  return Object.keys(by).map(function (k) { return by[k]; }).filter(function (b) { return b.t !== "기타"; });
}
function weakTypes(area) {
  return typeStats(area).filter(function (b) { return b.done >= 3; }).sort(function (a, b) { return a.ok / a.done - b.ok / b.done; });
}
function viewStats() {
  var area = S.area, st = typeStats(area), done = 0, ok = 0;
  st.forEach(function (b) { done += b.done; ok += b.ok; });
  var weak = weakTypes(area).slice(0, 3);
  var est = area === "RC" ? `파트5 30문제 기준 예상 정답 약 <b>${Math.round(30 * (done ? ok / done : 0))}개</b>` : `파트2 25문제 기준 예상 정답 약 <b>${Math.round(25 * (done ? ok / done : 0))}개</b>`;
  render(topbar("실력 분석") + `<div class="card hero"><span class="kicker">${area} 실력 분석</span><h1>정답률 ${pct(ok, done)}%</h1><p>푼 문제 ${done}개 · ${done >= 30 ? est : "30문제 이상 풀면 예상 정답 수가 나와요"}</p></div>
    ${weak.length ? `<div class="card peach"><b>집중해야 할 약점 유형</b>${weak.map(function (b) { return `<div style="display:flex;align-items:center;gap:8px;margin-top:8px"><span style="flex:1"><b>${esc(b.t)}</b> <span style="color:#5B6573;font-size:13px">정답률 ${pct(b.ok, b.done)}% (${b.ok}/${b.done})</span></span><button class="btn sm" data-wt="${esc(b.t)}">약점 문제 풀기</button></div>`; }).join("")}</div>` : '<div class="card peach" style="font-size:14px">유형마다 3문제 이상 풀면 약점 유형을 찾아 드려요.</div>'}
    <div class="grp">유형별 정답률</div>
    <div class="card">${st.sort(function (a, b) { return (b.done ? 1 : 0) - (a.done ? 1 : 0) || (a.done ? a.ok / a.done : 1) - (b.done ? b.ok / b.done : 1); }).map(function (b) {
      var r = pct(b.ok, b.done), col = !b.done ? "#E4E8EE" : r >= 80 ? "#2E9E6A" : r >= 60 ? "#F2B33D" : "#E95721";
      return `<div style="padding:8px 0;border-bottom:1px solid #EEF1F5"><div style="display:flex;font-size:14px"><b style="flex:1">${esc(b.t)}</b><span style="color:#5B6573">${b.done ? r + "% · " + b.ok + "/" + b.done : "아직 안 풂"} · 전체 ${b.total}</span></div>
        <div style="height:8px;background:#EEF1F5;border-radius:6px;margin-top:5px;overflow:hidden"><i style="display:block;height:100%;width:${b.done ? r : 0}%;background:${col}"></i></div></div>`;
    }).join("")}</div>`);
  bindCommon();
  app.querySelectorAll("[data-wt]").forEach(function (b) { b.onclick = function () { weakQuiz(b.dataset.wt); }; });
}
// 약점 유형 20문제: 틀린 문제 → 안 푼 문제 → 맞힌 문제 순
function weakQuiz(type) {
  var area = S.area;
  if (!type) { var w = weakTypes(area)[0]; if (!w) return render(topbar("약점 맞춤 문제") + '<div class="card peach">문제를 조금 더 풀면 약점 유형을 찾아 드려요. (유형마다 3문제 이상)</div><button class="btn" data-go="#/">문제 풀러 가기</button>'), bindCommon(); type = w.t; }
  var ks = poolKeys(area).filter(function (x) { return x.t === type; });
  var wrong = ks.filter(function (x) { var p = S.prog[x.k]; return p && !p[1]; }), un = ks.filter(function (x) { return !S.prog[x.k]; }), right = ks.filter(function (x) { var p = S.prog[x.k]; return p && p[1]; });
  var pick = shuffle(wrong).concat(shuffle(un), shuffle(right)).slice(0, 20).map(function (x) { return x.k; });
  render('<div class="empty">문제를 모으는 중…</div>');
  loadItems(pick).then(function (list) { mixQuiz("약점 맞춤 · " + type, area, list, "#/stats"); });
}

/* ---------- 실전 테스트: RC 파트5 30문제 10분 / LC 파트2 25문제 자동 넘김 ---------- */
function viewMock() {
  var area = S.area, n = area === "RC" ? 30 : 25;
  var pool = poolKeys(area).filter(function (x) { return x.sec.part === (area === "RC" ? 5 : 2); });
  render(topbar("실전 테스트") + `<div class="card hero"><span class="kicker">${area} 실전 테스트</span><h1>${area === "RC" ? "파트5 30문제 · 10분" : "파트2 25문제 · 자동 넘김"}</h1>
    <p>공개된 전체 문제에서 무작위로 출제돼요. ${area === "RC" ? "시간이 끝나면 자동으로 제출돼요." : "음성이 끝나고 5초 뒤 자동으로 다음 문제로 넘어가요."}</p></div>
    <div class="card" style="font-size:14px">끝나면 점수와 유형별 결과가 나오고, 틀린 문제의 해설을 바로 볼 수 있어요. 결과는 실력 분석에도 반영돼요.</div>
    <button class="btn" id="mk-go">시작하기</button>`);
  bindCommon();
  document.getElementById("mk-go").onclick = function () {
    render('<div class="empty">문제를 준비하는 중…</div>');
    loadItems(shuffle(pool).slice(0, n).map(function (x) { return x.k; })).then(function (list) {
      var sec = mixSec(area === "RC" ? "파트5 실전 테스트" : "파트2 실전 테스트", area, list), started = Date.now();
      sec.id = "mock-" + area;
      var done = function () { mockResult(sec, list, Math.round((Date.now() - started) / 1000)); };
      if (area === "LC") { exSet("lc:" + sec.id, null); Q = { sec: sec, list: list, i: 0, ans: {}, title: sec.title, lc: true, onDone: done }; return lcPage(); }
      exSet(sec.id, null);
      Q = { sec: sec, pages: list.map(function (x) { return [x]; }), list: list, i: 0, ans: {}, title: sec.title, exam: true, deadline: Date.now() + 10 * 60 * 1000, onDone: done };
      examPage();
    });
  };
}
function mockResult(sec, list, secs) {
  var ok = list.filter(function (x) { return S.prog[x.key] && S.prog[x.key][1]; }).length, by = {};
  list.forEach(function (x) { var t = typeOfKey(x.key); var b = by[t] = by[t] || { t: t, n: 0, ok: 0 }; b.n++; if (S.prog[x.key][1]) b.ok++; });
  var wrong = list.filter(function (x) { return !(S.prog[x.key] && S.prog[x.key][1]); });
  function draw() {
    render(topbar(sec.title) + `<div class="card hero score"><span class="kicker">실전 테스트 결과</span><div class="big">${ok} / ${list.length}</div><p>정답률 ${pct(ok, list.length)}% · 걸린 시간 ${Math.floor(secs / 60)}분 ${secs % 60}초</p></div>
      <div class="grp">유형별 결과</div><div class="card">${Object.keys(by).map(function (k) { var b = by[k]; return `<div style="display:flex;padding:6px 0;border-bottom:1px solid #EEF1F5;font-size:14px"><b style="flex:1">${esc(b.t)}</b><span style="color:${b.ok === b.n ? "#2E9E6A" : "#E95721"}">${b.ok}/${b.n}</span></div>`; }).join("")}</div>
      <div style="display:grid;gap:8px">${wrong.length ? `<button class="btn navy" id="mr-wrong">틀린 ${wrong.length}문제 해설 보기</button>` : ""}<button class="btn" data-go="#/mock">한 번 더 테스트</button><button class="btn ghost" data-go="#/stats">실력 분석 보기</button></div>`);
    bindCommon();
    var w = document.getElementById("mr-wrong"); if (w) w.onclick = function () { examReview(sec, wrong, draw); };
  }
  draw();
}
function typeOfKey(k) {
  var id = k.split(":")[0], s = S.catalog.sections.find(function (x) { return x.id === id; });
  if (!s) return "기타"; var i = (s.keys || []).indexOf(k); return (s.types || [])[i] || s.title;
}

/* ---------- 저장한 문제 ---------- */
function viewBm() {
  var ks = bmList().filter(function (k) { return S.catalog.sections.some(function (s) { return s.keys && s.keys.indexOf(k) >= 0; }); });
  render(topbar("저장한 문제") + `<div class="card peach" style="font-size:14px">문제 화면의 <b>☆ 저장</b>을 누르면 여기에 모여요. 저장한 문제 ${ks.length}개</div>` +
    (ks.length ? `<button class="btn" id="bm-go">저장한 문제 풀기</button>` : '<div class="empty">아직 저장한 문제가 없어요.</div>'));
  bindCommon();
  var g = document.getElementById("bm-go");
  if (g) g.onclick = function () { render('<div class="empty">불러오는 중…</div>'); loadItems(ks).then(function (list) { var lc = list.filter(function (x) { return x.sec.area === "LC"; }), rc = list.filter(function (x) { return x.sec.area !== "LC"; }); mixQuiz("저장한 문제", rc.length ? "RC" : "LC", rc.concat(lc), "#/bm"); }); };
}

/* ---------- 라우터 ---------- */
function route() {
  stopPlay();
  if (!S.token) return viewLogin();
  if (!S.catalog) return boot();
  var h = location.hash.replace(/^#\/?/, "").split("/");
  if (h[0] === "s" && h[1]) return viewSection(decodeURIComponent(h[1]));
  if (h[0] === "lec" && h[1]) return viewLectures(decodeURIComponent(h[1]));
  if (h[0] === "ex" && h[1]) return viewExam(decodeURIComponent(h[1]));
  if (h[0] === "rank") return viewRank(h[1] ? +h[1] : 0);
  if (h[0] === "race" && h[1]) return viewRace(+h[1]);
  if (h[0] === "race") return viewRaceMenu();
  if (h[0] === "rrank") return viewRaceRank(h[1] ? +h[1] : -1);
  if (h[0] === "game" && h[1]) return viewGame(+h[1]);
  if (h[0] === "game") return viewGameMenu();
  if (h[0] === "reels") return viewReels();
  if (h[0] === "reel" && h[1]) return viewReel(decodeURIComponent(h[1]));
  if (h[0] === "stats") return viewStats();
  if (h[0] === "weak") return weakQuiz(null);
  if (h[0] === "mock") return viewMock();
  if (h[0] === "bm") return viewBm();
  if (h[0] === "pick") return viewPick();
  if (!S.picked && allowedSeries().length > 1 && (!h[0] || h[0] === "")) { S.picked = true; return viewPick(); }
  if (h[0] === "a" && h[1]) return viewARound(h[1]);
  if (h[0] === "a") return viewA();
  if (h[0] === "wrong") return viewWrong();
  if (h[0] === "v" || h[0] === "w") VB = VBS[h[0]];
  if (h[0] === "w") h[0] = "v";
  if (h[0] === "v" && h[1] && h[2] === "card") return viewVocaCard(+h[1]);
  if (h[0] === "v" && h[1] && h[2] === "test") return viewVocaTest(+h[1]);
  if (h[0] === "v" && h[1]) return viewVocaDay(+h[1]);
  if (h[0] === "v") return viewVocaIndex();
  viewHome();
}

/* ---------- 마운트 ---------- */
window.MKST_MOUNT = function (host) {
  if (!SUPA || !KEY) { host.innerHTML = "<p>학습실 설정이 아직 연결되지 않았어요.</p>"; return; }
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
  root = document.createElement("div"); root.className = "mkst"; root.innerHTML = '<div class="wrap"></div>';
  host.replaceWith ? host.replaceWith(root) : host.appendChild(root);
  app = root.firstChild;
  S.token = ls("token");
  window.addEventListener("hashchange", function () { route(); scrollTop(); });
  route();
};
})();
$mkapp$, updated_at = now() where key='app';
select key, length(text_data) as len, updated_at from content where key='app';
