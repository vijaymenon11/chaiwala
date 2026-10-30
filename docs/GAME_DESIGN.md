Part 2: Game Design Doc (project knowledge)

Last updated: v0.6 (30 Oct 2026). Changes since the original draft are marked [UPDATED] or [NEW].

1. Vision

Run a chai stall in India, starting with a small cart and growing into a chai empire. The player makes daily decisions about recipe, price, location, and stock, then watches the day play out. Target feel: cozy, funny, a little addictive, with “one more day” pull.

2. Core loop (one in-game day)

Morning briefing: weather forecast, date/season, any events (festival, cricket match, strike).

Prepare: buy ingredients, set the recipe, set the price, choose a location.

Run the day: a sped-up simulation of customers arriving, with the stall visibly serving them (speed controls and skip). [UPDATED: built as a sped-up animated day; see section 14.]

Evening report: cups sold, revenue, costs, profit, customer feedback, and reputation change.

Spend profit: upgrades, staff, new menu items, new locations.

3. Ingredients and recipe

Core: tea leaves (patti), milk, sugar, water.

Flavor add-ins: ginger (adrak), cardamom (elaichi), masala mix, tulsi, saffron (premium). [UPDATED: v0.4 has one "masala" add-in (ginger-cardamom) as a fourth taste setting; tulsi and saffron are not built.]

The player sets a recipe, e.g. strength of tea, sweetness, milk ratio, and which spices to include.

Customers have taste preferences by type. A recipe that is too weak, too sweet, or too costly lowers satisfaction.

Ingredients can spoil (milk lasts 1 day, so it must be bought daily; a milk cooler adds a day), which creates stock-management tension.

4. Pricing and demand

Price per cup is set by the player. Demand falls as price rises, shifted by weather, location, reputation, and recipe quality.

Customer satisfaction is a function of taste match, price fairness, wait time, and cleanliness. [UPDATED: built as taste 50%, price 30%, wait 20%, plus a cup bonus; cleanliness is not modelled.]

Satisfaction feeds reputation, which feeds future footfall.

5. Weather and seasons

Winter and rain: demand up. Peak summer heat: demand down (lassi is the cold-drink option, built in v0.4).

Monsoon: pakoda/samosa side items sell strongly. A forecast that is sometimes wrong (right 75% of the time) adds risk.

6. Locations (unlockable)

Location\tCustomers\tNotes

Street corner\tMixed, low volume\tStarting spot

Railway station\tCommuters, high volume, impatient\tWait time matters most

College campus\tStudents, price-sensitive\tLoves cheap, sweet chai

Office district\tProfessionals, will pay more\tMorning and evening rushes

Highway dhaba\tTruckers/travellers\tLong stays, big orders

Cricket stadium\tHuge spikes on match days\tEvent-dependent

Each location has rent or a “licence fee”, a customer mix, and rush-hour patterns.

7. Customer types

Office worker, student, auto driver, tourist, grumpy uncle who complains about everything, trucker, cricket fan, regular loyalist. Each has a price tolerance, taste preference, and patience. Regulars build loyalty over time.

8. Menu extensions (progression)

Chai → add biscuits, bun maska, samosa, pakoda, then cutting chai, masala chai, and lassi in summer. [UPDATED: all of these are built. Kulhad chai is built as a cup type under Upgrades, and cold coffee is not built.]

9. Upgrades

Equipment: bigger kettle, better stove (faster brewing), cooler for milk. (More cup capacity is not built separately; the kettle covers it.)

Cup type: paper cup (cheap), glass, kulhad (clay, premium and eco-friendly, with customer bonus).

Stall: cart → stall with seating → small shop → multi-outlet chain. [NOT BUILT: planned as story-campaign progression, see section 17.]

Staff: helper (serves faster), cook (brews faster), manager (late game, automates daily stock-buying; needs Reputation 60). Staff are paid a daily wage.

Marketing: signboard, a loudspeaker jingle, a delivery-app (Zomato-style) listing. Word of mouth comes from reputation and regulars.

10. Random events

Heavy rain, municipal inspector (pay the fine honestly, or bribe, with a chance of a later scandal), milk price hike, local festival (Diwali, Holi, Ganesh Chaturthi), street fair, IPL match, transport strike, a food blogger visit (reputation spike or crash).

11. Economy and progression

Currency: ₹ (rupees). Start with ₹500 and a small cart.

Goal modes: a story Campaign (one chapter per city, each with a goal and a day limit; APPROVED, see section 17) and Free Play (the endless sandbox; APPROVED, stays alongside the Campaign). [Campaign NOT BUILT yet. Today the game is open-ended, with badges as soft goals.]

Failure state: going bankrupt, with a gentle “start fresh with a loan” option rather than a hard game over. Badges and records survive a bankruptcy.

Achievements: 15 badges with no rewards, e.g. “First 100 Cups,” “Rain Master,” “Cutting Chai King,” “Honest Chaiwala,” “Millionaire Chaiwala,” plus a Records tab. [UPDATED: built in v0.5.]

12. Visual and audio direction [UPDATED]

Art: flat-vector SVG street scene (decided in v0.5). It changes with the weather, the location, festival decorations and time of day. Warm palette (chai browns, marigold, teal).

Sound: all synthesised in the browser (no audio files): kettle whistle, coin and sale sounds, rain ambience, and a gentle tabla-and-pentatonic background loop. Sound effects and music can each be switched off in Settings.

UI: simple, big buttons, clear numbers, with a morning briefing “newspaper” (The Chai Gazette) at the top of the Today tab.

13. Language and tone [NEW]

The game ships in English by default, with plain, warm, lightly funny wording that keeps a few Indian terms where they are natural (chai, masala, kulhad, dhaba, Munim ji).

A Hinglish version of all in-game text is available as an option: Settings > Language > English / Hinglish. The choice is stored outside the save file and switching reloads the page.

Reason for the change: the all-Hinglish text read as forced. Keep humour affectionate and avoid stereotypes in both languages. New text must be written in both languages.

14. Platforms and layout [NEW]

Single-file HTML/CSS/JS game; works in any browser with no build tools. A desktop (Electron) wrapper exists, with F11 for full screen. Android and iPhone (Capacitor) come later.

Responsive layout: phone = one column; tablet = a wider single column (about 780px); desktop and tablet landscape (1000px and wider) = two columns, with the stall and live ticker side by side on the day screen. Touch targets stay large on all sizes.

15. Development roadmap

MVP: one location, three ingredients, set price and recipe, a simple day simulation, an end-of-day report. DONE.

v0.2: weather, ingredient spoilage, reputation, save/load. DONE.

v0.3: multiple locations, customer types, upgrades. DONE.

v0.4: random events, menu extensions, staff. DONE.

v0.5: polish, art, sound, achievements, balance pass. DONE. v0.5.1: English/Hinglish language option and responsive layout. DONE.

v0.5.2: undo button for ingredient purchases made today. DONE.

v0.6 (step 1 of section 17): city system, with Mumbai as the first city. DONE.

Next: see the build order in section 17.

16. Open decisions [UPDATED]

Real-time animated day, or a fast text-and-icon simulation? RESOLVED: sped-up animated day with ▶ / ▶▶ / ▶▶▶ and skip.

Single-player only, or a leaderboard later? Still open (single-player for now).

Free browser game, or a mobile app eventually? Browser and desktop now, mobile apps later.

Art style: pixel art, flat vector, or hand-drawn? RESOLVED: flat vector.

17. Approved direction: cities, story campaign, online (30 Oct 2026) [NEW]

A. Cities and real-date weather [step 1 BUILT for Mumbai]
- A new game can be a city game. Days follow the real calendar from a chosen start date (2025 calendar). The weather is that city's weather for the same date, seasons follow the real month, and festivals fall on their real dates (Mumbai: Holi 14 Mar, Ganesh Chaturthi from 27 Aug for 3 days, Diwali from 20 Oct for 3 days). IPL matches only happen in the IPL window (22 Mar to 3 Jun). Heavy rain only happens on days it really rains.
- Each city renames and re-describes the six place types; the numbers stay the same. Mumbai: Dadar flower-market corner (street), Matunga college lane (college), CST station (station), BKC offices (office), Eastern Express Highway dhaba (dhaba), Wankhede stadium (stadium).
- Weather data is bundled in the game (no weather service is called while playing), so it works offline and every player sees the same weather on the same date. IMPORTANT: Mumbai's weather is currently a stand-in built from the city's usual monthly pattern, not recorded data. Run tools/fetch_weather.js on a computer with internet to replace it with real 2025 data.
- City order (approved): Mumbai, Delhi, Kolkata, Chennai, Bengaluru. Start with Mumbai and Delhi to prove that adding a city is cheap.

B. Story Campaign [NOT BUILT]
- One chapter per city: start date, goal, day limit, and short story scenes between days. Hero: a young chaiwala (working name Raju) who takes over his uncle's cart, with a different mentor in each city. Name and arc can be edited.
- First launch opens with a short comic-style intro (flat-vector panels with speech bubbles and captions, skippable, replayable from Settings, English and Hinglish).
- Stall tiers (cart, stall, shop, chain) become chapter milestones.
- Free Play stays as the endless sandbox alongside the Campaign.

C. Online [NOT BUILT]
- Backend: Supabase (approved). Accounts via email or Google, nickname only shown, account deletion built in.
- Cloud save, plus leaderboards per chapter and a weekly board.
- Fair scores: the game records the player's decisions each day and the server replays them with the same game code to verify the score.
- Offline play keeps working.
- At this stage the single HTML file is split into a few files with a small build step.

D. Build order
1. City system and weather, Mumbai. DONE (v0.6).
2. Campaign engine: chapters, goals, day limits, story scenes, comic intro, stall tiers.
3. Run recording and replay: verifiable personal bests.
4. Delhi chapter.
5. Online: accounts, cloud save, leaderboards.
6. Android and iPhone packaging.
