/* 학습실 단어 발음 복구 (2026-10-31): 단어장 음원(voca2/…, 예문 v…mp3)은 R2에 없고 Supabase 저장소에만 있음.
   단어장·단어 게임 화면에서는 Supabase 주소로, 그 밖에도 R2에서 못 읽으면 Supabase로 한 번 더 시도. */
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function audioUrl(src) { return String(src || \"\").replace(\"__AUDIO_BASE__\", CFG.audioBase || (SUPA + \"/storage/v1/object/public/study-audio\")); }",
 "function sbUrl(src) { return String(src || \"\").replace(\"__AUDIO_BASE__\", SUPA + \"/storage/v1/object/public/study-audio\"); }\nfunction audioUrl(src) { if (/^#\\/(v|w|game|rank)(\\/|$)/.test(location.hash) || /__AUDIO_BASE__\\/voca/.test(String(src || \"\"))) return sbUrl(src); return String(src || \"\").replace(\"__AUDIO_BASE__\", CFG.audioBase || (SUPA + \"/storage/v1/object/public/study-audio\")); }"],
["      var a = PL.audio; a.onended = a.onerror = function () { res(); };\n      a.src = audioUrl(src); a.currentTime = 0; a.play().catch(function () { res(); });",
 "      var a = PL.audio, alt = sbUrl(src), tried = false;\n      a.onended = function () { res(); };\n      a.onerror = function () { if (!tried && a.src !== alt) { tried = true; a.src = alt; a.play().catch(function (e) { if (!e || e.name !== \"AbortError\") res(); }); } else res(); };\n      a.src = audioUrl(src); a.currentTime = 0; a.play().catch(function (e) { if (e && e.name === \"NotAllowedError\") res(); });"]
]);
