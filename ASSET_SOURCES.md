# Original 3D Asset Catalogue

All models in this catalogue are original geometry authored for Indian Rider. They are generated locally during the Vite development/production build by `scripts/generate-original-assets.mjs`.

## Format and pipeline

- **Format:** binary glTF 2.0 (`.glb`), loaded with Three.js `GLTFLoader`
- **Materials:** glTF PBR metallic-roughness material and per-vertex colour; no external texture dependencies
- **Current fidelity:** original stylised low-poly geometry, not photorealistic 4K textured assets yet. A higher-fidelity art pass would add sculpted details, UV unwrapping, baked albedo/normal/roughness/AO maps and LODs in Blender.
- **Coordinate system:** Y up; scooter front points toward -Z
- **Runtime:** local same-origin files under `/models/original/`; no third-party asset CDN
- **Fallback:** the current procedural city and scooter remain available if a GLB cannot be loaded
- **Generation:** `npm run dev` and `npm run build` generate the files before Vite starts/builds

## 20 original buildings

| File | Design |
|---|---|
| `01_scooter_garage.glb` | Scooter garage |
| `02_kirana_store.glb` | Kirana / neighbourhood grocery |
| `03_chai_tapri.glb` | Roadside chai tapri |
| `04_medical_store.glb` | Medical store |
| `05_punjabi_dhaba.glb` | Punjabi dhaba |
| `06_sweet_shop.glb` | Indian sweet shop |
| `07_mobile_shop.glb` | Mobile phone shop |
| `08_bank.glb` | Bank branch |
| `09_atm_kiosk.glb` | ATM kiosk |
| `10_police_station.glb` | Police station |
| `11_city_hospital.glb` | City hospital |
| `12_public_school.glb` | Public school |
| `13_hindu_temple.glb` | Hindu temple |
| `14_mosque.glb` | Mosque |
| `15_gurdwara.glb` | Gurdwara |
| `16_bus_stand.glb` | Bus stand |
| `17_petrol_pump.glb` | Petrol pump |
| `18_cinema.glb` | Cinema |
| `19_shopping_complex.glb` | Shopping complex |
| `20_residential_apartment.glb` | Residential apartment block |

## Original hero vehicle

- `rider125_scooter.glb` — custom orange/black Rider 125 scooter.
- `manifest.json` — generated asset inventory and format metadata.
- Separate named meshes: frame/floorboard, front apron/cowl, seat, handlebar, mirrors, front and rear wheels, suspension, mudguard, exhaust, tail/number plate, side panels, trim and brake details.
- Front and rear wheels have dedicated pivot nodes for animation in Three.js.

## Design references

The generated concept boards are visual direction only. The actual GLB assets are independently constructed from the source geometry in the generator; the concept images are not used as textures or geometry.
