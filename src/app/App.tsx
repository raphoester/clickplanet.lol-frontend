import {generateTilesGrid} from "../model/tiles";
import MapViewer from "./MapViewer";
import {AssignTilesToRegions, Region} from "../model/regions";
import {fibonacciSphere} from "../util/cartesian.ts";


type config = {
    defaultColor: number
    regionDensityIndex: number
    tilesHorizontalDensity: number
    tilesRows: number
}

const devConfig: config = {
    defaultColor: 0x888888FF,
    regionDensityIndex: 300,
    tilesHorizontalDensity: 2,
    tilesRows: 150
}

const prodConfig: config = {
    defaultColor: 0x010000FF,
    regionDensityIndex: 1000,
    tilesHorizontalDensity: 4,
    tilesRows: 800
}

enum env {
    dev = "dev",
    prod = "prod"
}

const environment = env.dev

let config = prodConfig
if (environment === env.dev) config = devConfig

const tiles = generateTilesGrid(config.tilesRows, config.tilesHorizontalDensity);
const regionEpicenters = fibonacciSphere(config.regionDensityIndex)

const regions: Region[] = AssignTilesToRegions(
    regionEpicenters.map(epicenter => epicenter.toGeodesic()), tiles)

export default function App() {
    return (
        <div className="App">
            <MapViewer
                defaultColor={config.defaultColor}
                regions={regions}
            />
        </div>
    );
}
