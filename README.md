# Indian Rider — City Rush 🛵

A browser-based 3D arcade driving prototype set in a stylised Indian city. Ride through traffic, avoid autos, buses and cows, collect parcels and earn rupees.

## Current gameplay
- Procedurally assembled repeating Indian city street with buildings, shop signs, trees and streetlights
- Third-person scooter and rider model with lean, suspension bob and rotating wheels
- Moving traffic: cars, auto-rickshaws, buses and cows
- Sidewalk pedestrians, rain particles and scrolling road markings
- Three parcel pickups, countdown timer, cash rewards and collision penalties
- Pause/resume, minimap, nitro meter and game-over/restart flow
- Keyboard and touch controls
- Reduced pixel ratio, no real-time shadows and low-poly procedural geometry for mobile performance

## Controls
- **W / ↑ / GO** — accelerate
- **A / D or ← / →** — steer
- **S / ↓ / Brake** — brake
- **Shift / N₂O** — nitro boost
- **P / Esc / Pause** — pause or resume
- **Mobile** — on-screen steer, GO, brake and N₂O controls

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
This is a compact arcade city-driving slice, not a full GTA-scale open world. The city corridor repeats procedurally; current pedestrians and traffic use lightweight scripted movement rather than advanced AI or physics simulation. There is no online multiplayer, save system, or persistent economy yet.

## Next upgrades
- Distinct neighbourhoods and route selection
- Better vehicle models, traffic behaviours and pedestrian animations
- Scooter garage, upgrades and progression
- Mission variety, police chase and day/night cycle
- Sound design, haptics and accessibility settings
- Persistent local/cloud saves and leaderboards

## Assets
Initial 3D environment and vehicles are generated procedurally in code. No paid assets or API keys are required.

## License
MIT
