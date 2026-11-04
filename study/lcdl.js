/* LC 회차(폴더)마다 '원음 다운로드' — 그 회차에 들어간 문제 원본 음원을 순서대로 이어 MP3 한 파일로 받기 (2026-11-04)
   - 회차 전체 한 파일 + PART별 파일
   - 음원 = 문항·세트의 audio (R2, maketoeic.kr CORS 허용) / ID3 꼬리표는 떼고 이어 붙임 */
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["(open ? `<div style=\"margin:-2px 0 10px 14px;border-left:3px solid #F6D3BC;padding-left:10px\">` + groups[g].map(function (s) {",
 "(open ? `<div style=\"margin:-2px 0 10px 14px;border-left:3px solid #F6D3BC;padding-left:10px\">` + lcdlRow(g, groups[g]) + groups[g].map(function (s) {"],
["function bindCommon() {\n", String.raw`var LCDL = {};
function lcdlRow(g, list) {
  if (S.area !== "LC" || !list.length || !list.every(function (s) { return s.area === "LC"; })) return "";
  var id = "lcdl" + Object.keys(LCDL).length; LCDL[id] = { g: String(g).replace(/^\d+\|/, ""), list: list };
  var parts = list.slice().sort(function (a, b) { return (a.part || 0) - (b.part || 0); });
  return '<div class="card" style="padding:10px 12px;margin:0 0 8px;border:2px solid #172844"><b style="font-size:15px">🎧 원음 다운로드</b><small style="display:block;color:#33404F;margin:2px 0 8px">이 회차 문제 원본 음원을 MP3로 받아요</small>'
    + '<button class="btn" data-lcdl="' + id + '" style="width:100%">⬇ 회차 전체 한 파일 (' + parts.length + '개 단원)</button>'
    + (parts.length > 1 ? '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">' + parts.map(function (s) { return '<button class="btn ghost sm" data-lcdl="' + id + '" data-lcs="' + esc(s.id) + '" style="flex:1 1 45%;padding:9px 6px;font-size:13.5px">⬇ ' + esc(String(s.title || "").replace(/\s*\(.*\)$/, "")) + '</button>'; }).join("") + "</div>" : "") + "</div>";
}
function lcdlBtn(g, list) {
  if (!list.length) return "";
  var id = "lcdl" + Object.keys(LCDL).length; LCDL[id] = { g: String(g).replace(/^\d+\|/, ""), list: list };
  return '<button class="btn ghost sm" data-lcdl="' + id + '" style="width:100%;margin:-4px 0 10px;border:1.5px dashed #172844">🎧 ' + esc(LCDL[id].g) + ' 원음 전체 MP3 받기</button>';
}
function lcdlStrip(u8) {
  var a = 0, b = u8.length;
  if (u8[0] === 0x49 && u8[1] === 0x44 && u8[2] === 0x33) { a = 10 + ((u8[6] & 127) << 21 | (u8[7] & 127) << 14 | (u8[8] & 127) << 7 | (u8[9] & 127)); if (u8[5] & 16) a += 10; }
  if (b > 128 && u8[b - 128] === 0x54 && u8[b - 127] === 0x41 && u8[b - 126] === 0x47) b -= 128;
  return u8.subarray(a, b);
}
function lcdlGo(btn) {
  var o = LCDL[btn.dataset.lcdl]; if (!o) return;
  var secs = o.list.slice().sort(function (a, b) { return (a.part || 0) - (b.part || 0); });
  if (btn.dataset.lcs) secs = secs.filter(function (s) { return s.id === btn.dataset.lcs; });
  var old = btn.textContent; btn.disabled = true; btn.textContent = "음원 목록 확인 중…";
  Promise.all(secs.map(function (s) { return load("sec:" + s.id); })).then(function (full) {
    var urls = [];
    full.forEach(function (sec) {
      (sec.items || []).forEach(function (it) { if (it.audio && urls.indexOf(it.audio) < 0) urls.push(it.audio); });
      (sec.sets || []).forEach(function (st) { if (st.audio && urls.indexOf(st.audio) < 0) urls.push(st.audio); else (st.questions || []).forEach(function (q) { if (q.audio && urls.indexOf(q.audio) < 0) urls.push(q.audio); }); });
    });
    if (!urls.length) throw new Error("none");
    var out = new Array(urls.length), done = 0, next = 0;
    function one() {
      var i = next++; if (i >= urls.length) return Promise.resolve();
      return fetch(audioUrl(urls[i])).then(function (r) { if (!r.ok) throw new Error("http"); return r.arrayBuffer(); }).then(function (ab) {
        out[i] = lcdlStrip(new Uint8Array(ab)); done++; btn.textContent = "받는 중 " + done + " / " + urls.length;
      }).catch(function () { out[i] = new Uint8Array(0); done++; }).then(one);
    }
    return Promise.all([one(), one(), one(), one()]).then(function () {
      var blob = new Blob(out, { type: "audio/mpeg" }), name = "메이크토익_" + o.g.replace(/\s+/g, "_") + (btn.dataset.lcs ? "_" + String(secs[0].title || "").replace(/\s*\(.*\)$/, "").replace(/\s+/g, "_") : "_전체") + ".mp3";
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
      btn.textContent = "✔ 받았어요 (" + Math.round(blob.size / 1048576 * 10) / 10 + "MB)"; setTimeout(function () { btn.textContent = old; btn.disabled = false; }, 3500);
    });
  }).catch(function () { alert("음원을 받지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요."); btn.textContent = old; btn.disabled = false; });
}
document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-lcdl]"); if (b && !b.disabled) { e.stopPropagation(); lcdlGo(b); } }, true);
function bindCommon() {
`]
]);
