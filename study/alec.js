/* A급 과제 해설강의: 문제를 안 풀어도 바로 볼 수 있게 (2026-10-31) */
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
// 해설강의 화면 잠금 해제 (A급 과제)
["    if (itemsOf(sec).some(function (x) { return !S.prog[x.key]; }))\n", "    if (sec.group !== \"A급 과제\" && itemsOf(sec).some(function (x) { return !S.prog[x.key]; }))\n"],
// 단원 화면의 해설강의 버튼 열기
["  if (!lecturesOf(sec).length) return \"\";\n  return allDone ?", "  if (!lecturesOf(sec).length) return \"\";\n  if (sec.group === \"A급 과제\") allDone = true;\n  return allDone ?"],
// 회차 화면: 잠금 표시 없애고 PART마다 '해설강의 바로 보기' 버튼
["lec = has(s) ? (t.done >= t.total ? \" · ▶ 해설강의 열림\" : \" · 🔒 해설강의\") : \"\";", "lec = has(s) ? \" · ▶ 해설강의\" : \"\";"],
["<span class=\"pbar\"><i style=\"width:${pct(t.done, t.total)}%\"></i></span></button>`; }).join(\"\"));", "<span class=\"pbar\"><i style=\"width:${pct(t.done, t.total)}%\"></i></span></button>` + (has(s) ? `<button class=\"btn navy sm\" data-go=\"#/lec/${encodeURIComponent(s.id)}\" style=\"margin:-4px 0 12px\">▶ PART ${s.part} 해설강의 바로 보기</button>` : \"\"); }).join(\"\"));"]
]);
