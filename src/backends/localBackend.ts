import {AssignTilesToRegions} from "../model/regions.ts";
import {GameMapProvider} from "./backend.ts";
import {generateTilesGrid} from "../model/tiles.ts";
import {fibonacciSphere} from "../util/cartesian.ts";
import {GameMap} from "../model/gameMap.ts";

export type LocalGameMapComputerConfig = {
    regionDensityIndex: number
    tilesHorizontalDensity: number
    tilesRows: number
}

export class GameMapComputer implements GameMapProvider {
    private gameMap: GameMap | null = null

    constructor(private cfg: LocalGameMapComputerConfig) {
    }

    provideGameMap(): Promise<GameMap> {
        return Promise.resolve(this.computeGameMap())
    }

    public provideGameMapSync(): GameMap {
        return this.computeGameMap()
    }

    private computeGameMap(): GameMap {
        if (this.gameMap) return this.gameMap

        const tiles = generateTilesGrid(this.cfg.tilesRows, this.cfg.tilesHorizontalDensity);
        const regionEpicenters = fibonacciSphere(this.cfg.regionDensityIndex)
        const regions = AssignTilesToRegions(
            regionEpicenters.map(epicenter => epicenter.toGeodesic()), tiles)

        this.gameMap = {tiles, regions}
        return this.gameMap
    }
}