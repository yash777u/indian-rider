# Indian Rider — City Rush 🛵

A browser-based 3D arcade driving prototype set in a stylised Indian city. Ride through traffic, avoid autos, buses and cows, collect parcels and earn rupees.

## Current gameplay
- Procedurally assembled repeating Indian city street with named storefronts (chai, dhaba, sweets, medical and repair), trees and streetlights
- Third-person scooter and rider model with lean, suspension bob and rotating wheels
- Moving traffic: cars, auto-rickshaws, buses and cows
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

## Next upgrades
- Distinct neighbourhoods and route selection
- Better vehicle models, traffic behaviours and pedestrian animations
- Scooter garage, upgrades and progression
- Mission variety, police chase and day/night cycle
- Richer recorded sound design, haptics and accessibility settings
- Persistent local/cloud saves and leaderboards

## Assets
Initial 3D environment and vehicles are generated procedurally in code. No paid assets or API keys are required.

## License
MIT
