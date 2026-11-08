/* 이용 기록 (2026-11-08): 학생이 어느 화면 · 어떤 영상을 날마다 쓰는지 → usage_log (관리자 📊 이용 통계)
   - page: 화면에 들어갈 때(주소 #/ 앞부분) 하루 한 화면당 1번
   - vid : 영상(해설강의 · 교재 강의 · 수업 녹화 등)을 처음 재생할 때 (player.js가 window.mkUseLog('vid') 호출)
   - 문제 풀이는 서버에서 progress 저장 때 자동으로 기록(q) */
(function () {
function T(f) { var s = f.toString(); return s.slice(s.indexOf("/*") + 2, s.lastIndexOf("*/")); }
var FN = T(function () {/*// 이용 기록 — study/uselog.js
var USE_SENT = {};
function useRef() { var h = location.hash.replace(/^#\/?/, "").split("/"); var a = h[0] || "home"; return h[1] && /^(rec|eb|lcv|tbl|v|a|s|full|mock|bk|ex|lcx|fq)$/.test(a) ? a + "/" + decodeURIComponent(h[1]).slice(0, 40) : a; }
function useLog(kind, ref) {
  try {
    if (!S || !S.token) return;
    ref = ref || useRef(); var day = new Date().toDateString(), k = kind + "|" + ref + "|" + day;
    if (USE_SENT[k]) return; USE_SENT[k] = 1;
    api("log_use", { p_token: S.token, p_kind: kind, p_ref: ref }).catch(function () { });
  } catch (e) { }
}
window.mkUseLog = function (kind) { useLog(kind || "vid"); };
window.addEventListener("hashchange", function () { setTimeout(function () { useLog("page"); }, 300); });
setTimeout(function () { useLog("page"); }, 2500);
function viewLectures(id) {
*/});
window.MKST_PATCHES = (window.MKST_PATCHES || []).concat([
["function viewLectures(id) {\n", FN + "\n"]
]);
})();
