> **This repo has moved.** ClickPlanet is now a monorepo at [github.com/raphoester/clickplanet](https://github.com/raphoester/clickplanet) (this app lives under `apps/frontend`, with full history preserved). This repo is archived and read-only.

# ClickPlanet

A real-time multiplayer globe conquest game — click tiles on a 3D globe to claim them for your country, and watch the
world change live.

**Live demo:** [clickplanet.lol](https://clickplanet.lol)

---

## Tech stack

|                  |                                                        |
|------------------|--------------------------------------------------------|
| **UI**           | React 18, TypeScript, Vite                             |
| **3D rendering** | Three.js with custom GLSL shaders                      |
| **Real-time**    | WebSocket + Protocol Buffers (binary)                  |
| **API**          | HTTP + protobuf serialization via `@bufbuild/protobuf` |
| **Deployment**   | Docker → Nginx, DigitalOcean                           |

---

## How it works

### GPU-accelerated tile picking

With tens of thousands of tiles on the globe, traditional raycasting against geometry is too slow for smooth hover and
click detection. Instead, a second invisible Three.js scene is maintained in parallel where each tile is rendered with a
unique RGB color encoding its ID. On every mouse event, that hidden scene is rendered to an offscreen WebGL render
target, and a single pixel is sampled at the cursor position. The RGB value is decoded back to a tile ID in O(1) — no
spatial queries needed.

```
mouse position → render picking scene to offscreen target → read 1px → RGB → tile ID
```

### Custom GLSL shaders

Tiles are rendered as GPU point sprites. Two shader pipelines run in parallel:

- **Display shader** — samples the correct region of a sprite atlas based on the owning country, applies a hover
  highlight, and scales point size with zoom level
- **Picker shader** — renders each tile as a solid unique color for GPU picking

Country flag textures are packed into a single sprite atlas to minimize draw calls. Tile ownership is stored as a `vec4`
attribute per point (`regionVector`: x, y, width, height in atlas UV space), updated on the GPU directly when ownership
changes.

### Real-time architecture

The backend exposes three contracts, implemented behind a clean interface:

```typescript
interface TileClicker {
    clickTile(tileId, countryId): Promise<void>
}

interface OwnershipsGetter {
    getCurrentOwnershipsByBatch(...): Promise<void>
}

interface UpdatesListener {
    listenForUpdatesBatch(callback): () => void
}
```

On load, tile ownerships are fetched in batches of 10,000 via HTTP (protobuf binary). A persistent WebSocket then
streams live `TileUpdate` messages. Updates are batched client-side at 100ms intervals before being applied to the GPU
geometry, avoiding per-message re-renders under high traffic.

---

## Running locally

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build
npm run proto     # regenerate types from proto/clicks.proto
```
