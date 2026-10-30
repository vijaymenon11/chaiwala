// Replaces a city's stand-in weather with REAL recorded daily weather for 2025 (Open-Meteo archive, free, no key).
// Run on a computer with internet:   node tools/fetch_weather.js mumbai      (Node 18+)
// It rewrites the weather string inside www/index.html (between the /*WEATHER:city*/ markers).
const fs = require("fs"), path = require("path");
const CITIES = { mumbai: { lat: 19.076, lon: 72.8777, tz: "Asia/Kolkata" } };
// precipitation >= 2.5 mm -> rain; very hot -> hot; chilly -> cold; mostly overcast -> cloudy; else sunny
function classify(day) {
  if (day.rain >= 2.5) return "R";
  if (day.tmax >= 33) return "H";
  if (day.tmax <= 20 || day.tmin <= 11) return "K";
  if (day.cloud >= 70) return "C";
  return "S";
}
async function main(city) {
  const c = CITIES[city]; if (!c) throw new Error("unknown city " + city);
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${c.lat}&longitude=${c.lon}&start_date=2025-01-01&end_date=2025-12-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,cloud_cover_mean&timezone=${encodeURIComponent(c.tz)}`;
  const j = await (await fetch(url)).json(), d = j.daily;
  const str = d.time.map((_, i) => classify({ tmax: d.temperature_2m_max[i], tmin: d.temperature_2m_min[i], rain: d.precipitation_sum[i], cloud: d.cloud_cover_mean[i] })).join("");
  if (str.length !== 365) throw new Error("expected 365 days, got " + str.length);
  const file = path.join(__dirname, "..", "www", "index.html"); let html = fs.readFileSync(file, "utf8");
  const re = new RegExp(`(/\\*WEATHER:${city}\\*/")[SHCRK]+(")`);
  if (!re.test(html)) throw new Error("marker not found");
  fs.writeFileSync(file, html.replace(re, `$1${str}$2`)); console.log("updated", city, "with real 2025 weather");
}
if (require.main === module) main(process.argv[2] || "mumbai").catch(e => { console.error(e.message); process.exit(1); });
module.exports = { classify };
