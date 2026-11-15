# 3D Asset Sources & Licences

Indian Rider uses selected models from the **Low Poly City Kit** by **kayquer**.

- Source repository: https://github.com/kayquer/kit-cidade-lowpoly
- Licence: CC0 1.0 (public domain dedication)
- Licence file: https://github.com/kayquer/kit-cidade-lowpoly/blob/main/LICENSE
- Attribution: optional; credit is retained here as a courtesy.
- Kit scope: 129 low-poly GLB models; the source README reports a maximum of 1,500 triangles per model.
- Runtime delivery: jsDelivr CDN, using the source repository's `main` branch.

## Models integrated

| In-game role | Source model | Runtime key |
|---|---|---|
| Street shop | `models/comercial/loja_esquina.glb` | `shop` |
| Neighbourhood market | `models/comercial/mercado.glb` | `market` |
| Traffic light | `models/mobiliario/semaforo.glb` | `trafficLight` |
| Bus stop | `models/mobiliario/ponto_onibus.glb` | `busStop` |
| Palm tree | `models/vegetacao/buriti.glb` | `palm` |
| Car | `models/veiculos/carro.glb` | `car` |
| City bus | `models/veiculos/onibus.glb` | `bus` |

The game loads these optional GLB files at runtime. Existing procedural geometry remains available as a fallback if a model or the CDN cannot be reached.

## Licence note

CC0 permits copying, modification, redistribution and commercial use without asking permission or providing attribution. This project records the source and licence as good practice. Review the source repository and licence again before replacing or adding third-party assets.
