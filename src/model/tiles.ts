import {Coordinates, endLat, endLon, startLat, startLon} from "../util/geodesic.ts";
import {absDiff} from "../util/math.ts";

export function generateTilesGrid(
    rows: number,
    density: number,
): Tile[] {
    const latitudeStep = absDiff(startLat, endLat) / rows
    const tiles = []

    for (let i = 0; i < rows; i++) {
        const southBorderLatitude = startLat + (i * latitudeStep)
        const absCenterLatitude = Math.abs(southBorderLatitude + (latitudeStep / 2))
        const squaresCount = Math.round(180 - (0.00023 * Math.pow(absCenterLatitude, 3))) * density

        const longitudeStep = absDiff(startLon, endLon) / squaresCount

        for (let j = 0; j < squaresCount; j++) {
            const tile = new Tile(startLon + (j * longitudeStep), southBorderLatitude, longitudeStep, latitudeStep)
            tiles.push(tile)
        }

    }
    return tiles
}


export class Tile {
    constructor(southWestLon: number, southWestLat: number, lonStep: number, latStep: number) {
        const southWest = new Coordinates(southWestLon, southWestLat)
        const southEast = new Coordinates(southWestLon + lonStep, southWestLat)
        const northEast = new Coordinates(southWestLon + lonStep, southWestLat + latStep)
        const northWest = new Coordinates(southWestLon, southWestLat + latStep)

        this.southWest = southWest
        this.southEast = southEast
        this.northEast = northEast
        this.northWest = northWest
    }

    private readonly southWest: Coordinates
    private readonly southEast: Coordinates
    private readonly northEast: Coordinates
    private readonly northWest: Coordinates

    public getBoundaries(): Coordinates[] {
        return [this.southWest, this.southEast, this.northEast, this.northWest]
    }

    public id(): string {
        return `${this.southWest.lon};${this.southWest.lat}`
    }
}
