/* A급 과제 해설강의: 문제를 안 풀어도 바로 볼 수 있게 (2026-10-31) */
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
// 해설강의 화면 잠금 해제 (A급 과제)
["    if (itemsOf(sec).some(function (x) { return !S.prog[x.key]; }))\n", "    if (sec.group !== \"A급 과제\" && itemsOf(sec).some(function (x) { return !S.prog[x.key]; }))\n"],
// 단원 화면의 해설강의 버튼 열기
["  if (!lecturesOf(sec).length) return \"\";\n  return allDone ?", "  if (!lecturesOf(sec).length) return \"\";\n  if (sec.group === \"A급 과제\") allDone = true;\n  return allDone ?"],
// 회차 화면: PART마다 [✏️ 문제 풀기](주황) · [▶ 해설강의 보기](흰 바탕) 두 버튼으로 구별 (2026-11-10)
["lec = has(s) ? (t.done >= t.total ? \" · ▶ 해설강의 열림\" : \" · 🔒 해설강의\") : \"\";", "lec = \"\";"],
["<span class=\"pbar\"><i style=\"width:${pct(t.done, t.total)}%\"></i></span></button>`; }).join(\"\"));", "<span class=\"pbar\"><i style=\"width:${pct(t.done, t.total)}%\"></i></span></button>` + `<div style=\"display:grid;grid-template-columns:${has(s) ? \"1fr 1fr\" : \"1fr\"};gap:8px;margin:-4px 0 14px\"><button class=\"btn\" data-sec=\"${esc(s.id)}\" style=\"margin:0;padding:13px 6px;font-size:16px\">✏️ PART ${s.part} 문제 풀기</button>` + (has(s) ? `<button class=\"btn ghost\" data-go=\"#/lec/${encodeURIComponent(s.id)}\" style=\"margin:0;padding:13px 6px;font-size:16px;border:2px solid #172844;color:#172844;background:#fff\">▶ 해설강의 보기</button>` : \"\") + `</div>`; }).join(\"\"));"]
]);
/* A급 과제 PART 7은 기출 2개 회차(예: 29·30회) 지문을 이어 붙여서 지문 번호(168-171 등)가 겹친다.
   → 지문 번호 앞에 회차를 붙여 구분 ("29회 161-164"). 해설강의 목록·채점표·풀이 화면이 모두 구분되고,
     같은 번호 지문이 한 화면에 합쳐지던 문제도 없어진다. */
window.MKST_PATCHES = window.MKST_PATCHES.concat([
["    S.cache[key] = r.data; return r.data;", "    S.cache[key] = aFixRanges(r.data); return r.data;"],
["function load(key) {\n", "function aFixRanges(d) {\n  try {\n    if (!d || d.group !== \"A급 과제\" || !d.sets || !d.sets.length) return d;\n    var m = String(d.title || \"\").match(/(\\d+)\\s*[·,]\\s*(\\d+)\\s*회/); if (!m) return d;\n    var half = 0, prev = -1;\n    d.sets.forEach(function (st) {\n      if (/회 /.test(st.range || \"\")) return;\n      var a = parseInt(st.range, 10); if (prev >= 0 && a <= prev) half = 1; prev = a;\n      st.range = (half ? m[2] : m[1]) + \"회 \" + st.range;\n    });\n  } catch (e) { }\n  return d;\n}\nfunction load(key) {\n"]
]);
/* 문제 풀기 목록: Series마다 'A급 과제' 를 별도 분류로 (RC) */
window.MKST_PATCHES = window.MKST_PATCHES.concat([
["out += `<div class=\"sea\"><b>SERIES ${n}</b>Series ${n}</div>` + ", "out += `<div class=\"sea\"><b>SERIES ${n}</b>Series ${n}</div>` + (S.area === \"RC\" ? `<button class=\"row\" data-go=\"#/a\" data-aser=\"${n}\" style=\"background:#FFF8F2;border-color:#F6D3BC\"><span class=\"pill o\">A급</span><span class=\"t\"><b>A급 과제 · Series ${n}</b><small>1~15회 · PART 5·6·7 과제 · 해설강의</small></span>›</button>` : \"\") + "],
["  app.querySelectorAll(\"[data-fold]\")", "  app.querySelectorAll(\"[data-aser]\").forEach(function (b) { b.onclick = function () { ls(\"aser\", b.dataset.aser); go(\"#/a\"); }; });\n  app.querySelectorAll(\"[data-fold]\")"]
]);
