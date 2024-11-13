import {generateTilesGrid} from "../model/tiles";
import MapViewer from "./MapViewer";
import {groupTiles} from "../model/regions.ts";


type config = {
    defaultColor: number
    tileGroupsCount: number
    tilesHorizontalDensity: number
    tilesRows: number
}

const devConfig: config = {
    defaultColor: 0x888888FF,
    tileGroupsCount: 70,
    tilesHorizontalDensity: 2,
    tilesRows: 150
}

const prodConfig: config = {
    defaultColor: 0x010000FF,
    tileGroupsCount: 70,
    tilesHorizontalDensity: 4,
    tilesRows: 800
}

enum env {
    dev = "dev",
    prod = "prod"
}

let environment = env.dev

export default function App() {
    let config = devConfig
    if (environment === env.prod) config = prodConfig

    const tiles = generateTilesGrid(config.tilesRows, config.tilesHorizontalDensity);
    const groups = groupTiles(tiles, config.tileGroupsCount);
    console.log(`${tiles.length} tiles, ~${groups[0].length} in each group`);

    return (
        <div className="App">
            <MapViewer
                defaultColor={config.defaultColor}
                tileGroups={groups}
            />
        </div>
    );
}
