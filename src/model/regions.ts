import {Tile} from "./tiles.ts";
import {Coordinates} from "../util/geodesic.ts";

export class Region {
    private readonly tiles: Tile[]

    constructor(
        private epicenter: Coordinates,
    ) {
        this.tiles = []
    }

    public id(): string {
        return this.epicenter.toString()
    }

    public getEpicenter(): Coordinates {
        return this.epicenter
    }

    public getTiles(): Tile[] {
        return this.tiles
    }
}

export function AssignTilesToRegions(epicenters: Coordinates[], tiles: Tile[]): Region[] {
    const regions = epicenters.map(epicenter => new Region(epicenter))
    for (const tile of tiles) {
        let minDistance = Infinity
        let minIndex = -1

        for (let i = 0; i < regions.length; i++) {
            const epicenter = regions[i].getEpicenter()
            const distance = epicenter.haversineDistanceTo(tile.epicenter())
            if (distance < minDistance) {
                minDistance = distance
                minIndex = i
            }
        }

        regions[minIndex].getTiles().push(tile)
    }

    return regions
}