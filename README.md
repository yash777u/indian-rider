# Indian Rider — City Rush 🛵

A browser-based 3D arcade driving prototype set in a stylised Indian city. Ride through traffic, avoid autos, buses and cows, collect parcels and earn rupees.

## Current gameplay
- Original procedural North-Indian street kit: chai cart stalls with Hindi signboard, fabric awnings, utility wires, street lamps, kerb bollards, zebra crossings, speed breakers and drain grates
- Atmospheric sky dome with warm horizon gradient, low sun and drifting cloud banks
- Animated procedural pedestrians with varied outfits, body shapes, commuter bags and walking cycles
- Repeating Indian city street populated with 20 original, individually generated GLB buildings (shops, dhaba, garage, bank, hospital, school, temple, mosque, gurdwara, cinema, market and more)
- Original custom Rider 125 scooter GLB with separately named body parts and pivoted front/rear wheels, plus rider model, lean, suspension bob and wheel rotation
- Moving traffic: procedural cars, auto-rickshaws, buses and cows
- Sidewalk pedestrians, rain particles and scrolling road markings
- Three parcel pickups, countdown timer, cash rewards and collision penalties
- Pause/resume, minimap, nitro meter, synthesised sound effects and game-over/restart flow
- Swipe-to-steer on touch screens, keyboard support and optional vibration feedback
- Personal-best score saved locally on the player's device
- Keyboard and touch controls
- Reduced pixel ratio, no real-time shadows and low-poly procedural geometry for mobile performance

## Controls
- **W / ↑ / GO** — accelerate
- **A / D or ← / →** — steer
- **S / ↓ / Brake** — brake
- **Shift / N₂O** — nitro boost
- **P / Esc / Pause** — pause or resume
- **Mobile** — on-screen steer, GO, brake and N₂O controls; swipe left/right on the road to change lanes
- **Sound** — toggle the synthesised sound effects from the top-right control
- Personal best is stored locally in the browser; it is not shared across devices

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## Tech
- Three.js
- Vite
- JavaScript ES modules
- CSS

## Known scope limits
This is a compact arcade city-driving slice, not a full GTA-scale open world. The city corridor repeats procedurally; current pedestrians and traffic use lightweight scripted movement rather than advanced AI or physics simulation. There is no online multiplayer, cloud save, or persistent cross-device economy yet. The personal-best score is stored only in the current browser.

## Art direction and procedural assets
- The original visual direction is documented in the Indian Rider environment concept boards created during development
- `src/indian-world.js` builds the sky, clouds, chai stalls, Hindi signage, street furniture, overhead wires and animated pedestrian models directly in Three.js
- Road crossings, raised speed breakers and drainage details are attached to repeating road chunks in `src/main.js`
- These are lightweight runtime 3D meshes, not flat concept images; the concept boards are visual references rather than textures or shipped game assets

## Next upgrades
- Distinct neighbourhoods and route selection
- Original low-poly traffic vehicle models, richer pedestrian animations and LOD variants
- Scooter garage, upgrades and progression
- Mission variety, police chase and day/night cycle
- Richer recorded sound design, haptics and accessibility settings
- Persistent local/cloud saves and leaderboards

## Original 3D assets
- 20 custom Indian-city building GLBs and one original Rider 125 scooter GLB are generated from source geometry by `scripts/generate-original-assets.mjs`
- GLB 2.0 with PBR material settings and per-vertex colour; the scooter has separately named components and wheel pivots for runtime animation
- Assets are generated before `npm run dev` and `npm run build`; the Vercel production build includes the GLBs under `/models/original/`
- The game loads the local GLBs and retains procedural fallbacks if an asset fails to load
- No third-party model pack, paid asset, external asset CDN or API key is required

## License
MIT
