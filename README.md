# Chaiwala Tycoon — desktop app

The game itself is one file: `www/index.html`. `main.js` just opens it in a window (Electron).
Edit the game in `www/index.html` only; the desktop shell rarely needs touching.

## Run it (needs Node.js 20+ from nodejs.org)
```
npm install
npm start
```

## Make installers
On your own computer (builds for the OS you are on):
```
npm run dist          # -> dist/  (.exe on Windows, .dmg on Mac, .AppImage on Linux)
```
Or build all three in the cloud: push this folder to a GitHub repo, then
Actions tab -> "Build desktop apps" -> Run workflow. Download the installers from the run page.

## What's in v0.5
Flat-vector street scene (weather, place, festival decor, time of day), synthesised sound and music (⚙️ to switch off), 15 badges + Records tab, first-launch tutorial, Munim ji manager, snacks, events, 6 locations.

## Known limits
- Unsigned: Windows shows a "SmartScreen" warning and Mac needs right-click -> Open the first time.
  Signing needs paid certificates (Apple Developer $99/yr; a Windows cert), only worth it before public release.
- Progress auto-saves (browser storage inside the app). "Naya khel" at the bottom of the prepare screen wipes it.
- Icon is a placeholder teapot (`build/icon.png`, 512x512). Replace it any time.

## Android and iPhone later
Keep all game code in `www/`. Later, add Capacitor (`npm i @capacitor/core @capacitor/cli`, `npx cap init`,
set webDir to `www`, `npx cap add android` / `npx cap add ios`). No game rewrite needed.
Android builds on any computer (Google Play: $25 one-time). iPhone needs a Mac with Xcode (App Store: $99/yr).
