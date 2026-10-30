# Chaiwala Tycoon — project context for Claude Code

A Lemonade-Tycoon-style chai-stall business sim. Single-file HTML/CSS/JS game (`www/index.html`) wrapped by Electron (`main.js`) for desktop; Android/iOS later via Capacitor.

## How to work (from the project instructions)
- Act as game designer, programmer and balance tester. Be practical and opinionated; say when an idea would hurt the game.
- Read `docs/GAME_DESIGN.md` first. If a request conflicts with it, flag it and ask whether to update the doc.
- Build in small, playable steps. Say what changed and why in a few lines. After each feature suggest one thing to playtest and what "feels right" looks like.
- Never invent features and add them silently: propose, then wait for approval.
- Keep all balance data in the CONFIG object at the top of the script. Keep state / logic / UI separate. Game math must be transparent (explain formulas in plain language).
- Mobile-friendly: touch targets, responsive layout. Save/load via localStorage.
- In-game text exists in English (default) and Hinglish: every user-facing string uses `tr("English", "Hinglish")`. New text needs both. Tone: warm, funny, affectionate, no stereotypes.

## Code map (`www/index.html`)
CONFIG -> STATE (`newGame`) -> LOGIC (pure functions; ends at the marker comment `LOGIC END`) -> UI. The Node tests cut the file at that marker, so keep DOM code below it.
Seeded RNG per day (`mulberry32(st.daySeed)`). Stock is batches ("lots") with FIFO use and overnight spoilage. Saves are versioned (`CONFIG.saveVersion`) with migration in `deserializeState`.
City games (v0.6): `st.city` + `st.startDate`; weather/seasons/festivals come from `CONFIG.cities`. Mumbai's weather string is a stand-in: run `node tools/fetch_weather.js mumbai` (needs internet) to use recorded data.

## Tests
`node tests/unit_t4.js` ... `unit_t7.js` (logic) and `node tests/ui/ui6.js` etc. (Playwright, needs `npx playwright install chromium`). Run them all before handing over a version.

## Roadmap (see docs/GAME_DESIGN.md section 17)
Done: MVP, v0.2-v0.6 step 1. Next: story campaign (comic intro, chapters, stall tiers) -> run recording/replay -> Delhi -> online (Supabase) -> mobile.
