import {generateTilesGrid} from "../model/tiles";
import MapViewer from "./MapViewer";
import {generateRegionTriangles, Region} from "../model/regions";


type config = {
    defaultColor: number
    regionDensityIndex: number
    tilesHorizontalDensity: number
    tilesRows: number
}

const devConfig: config = {
    defaultColor: 0x888888FF,
    regionDensityIndex: 1,
    tilesHorizontalDensity: 2,
    tilesRows: 150
}

const prodConfig: config = {
    defaultColor: 0x010000FF,
    regionDensityIndex: 2,
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
    const triangles = generateRegionTriangles(2);
    const regions = triangles.map(triangle => new Region(triangle, tiles));

    return (
        <div className="App">
            <MapViewer
                defaultColor={config.defaultColor}
                regions={regions}
            />
        </div>
    );
}
