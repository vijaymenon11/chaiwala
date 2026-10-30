// Builds a 365-character "typical year" of daily weather for a city: S sunny, H hot, C cloudy, R rain, K cold.
// This is a stand-in made from the city's usual monthly pattern (with spells of rain, not random flicker).
// Replace it with REAL recorded data by running:  node tools/fetch_weather.js mumbai   (needs internet)
const mulberry32 = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// relative weights per month: S H C R K
const MUMBAI = [
  { S: 6, H: 0.2, C: 1.5, R: 0, K: 1 },     // Jan
  { S: 6.5, H: 1, C: 1, R: 0, K: 1 },       // Feb
  { S: 4, H: 4, C: 1.2, R: 0, K: 0 },       // Mar
  { S: 3, H: 6, C: 1, R: 0, K: 0 },         // Apr
  { S: 2.5, H: 6, C: 1.5, R: 0.3, K: 0 },   // May (monsoon arrived early, 26 May 2025)
  { S: 0.5, H: 0, C: 2.5, R: 7, K: 0 },     // Jun
  { S: 0.2, H: 0, C: 1.8, R: 8, K: 0 },     // Jul
  { S: 0.5, H: 0, C: 2, R: 7.5, K: 0 },     // Aug
  { S: 2, H: 0.5, C: 2.5, R: 5, K: 0 },     // Sep
  { S: 4, H: 3, C: 2, R: 1.5, K: 0 },       // Oct
  { S: 6, H: 1.5, C: 1.5, R: 0, K: 0.5 },   // Nov
  { S: 6, H: 0, C: 1, R: 0, K: 0.8 },         // Dec
];
function build(table, seed) {
  const rng = mulberry32(seed); let out = "", prev = "S", doy = 0;
  for (let m = 0; m < 12; m++) for (let d = 1; d <= DAYS[m]; d++, doy++) {
    let w = { ...table[m] };
    if (m === 4 && d >= 26) w = { S: 0.3, H: 0.5, C: 2, R: 6, K: 0 };      // early monsoon onset
    const persist = (m >= 5 && m <= 8) ? 0.55 : 0.35;
    let pick;
    if (rng() < persist && w[prev] > 0) pick = prev;
    else { const tot = Object.values(w).reduce((a, b) => a + b, 0); let r = rng() * tot; for (const [k, v] of Object.entries(w)) { r -= v; if (r <= 0) { pick = k; break; } } pick = pick || "S"; }
    out += pick; prev = pick;
  }
  return out;
}
if (require.main === module) {
  const s = build(MUMBAI, 2025); console.log(s);
  let i = 0; DAYS.forEach((n, m) => { const seg = s.slice(i, i + n); i += n; const c = {}; for (const ch of seg) c[ch] = (c[ch] || 0) + 1; console.error(m + 1, JSON.stringify(c)); });
}
module.exports = { build, MUMBAI };
