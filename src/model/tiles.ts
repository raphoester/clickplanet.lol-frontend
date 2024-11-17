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
    private _epicenter: Coordinates | null = null
    countryCode: string | undefined

    constructor(
        southWestLon: number,
        southWestLat: number,
        lonStep: number,
        latStep: number,
        private ID?: string,
    ) {
        const southWest = new Coordinates(southWestLat, southWestLon)
        const southEast = new Coordinates(southWestLat, southWestLon + lonStep,)
        const northEast = new Coordinates(southWestLat + latStep, southWestLon + lonStep,)
        const northWest = new Coordinates(southWestLat + latStep, southWestLon,)

        this.southWest = southWest
        this.southEast = southEast
        this.northEast = northEast
        this.northWest = northWest
    }

    private readonly southWest: Coordinates
    private readonly southEast: Coordinates
    private readonly northEast: Coordinates
    private readonly northWest: Coordinates

    public static fromMinimalBoundaries(southWest: Coordinates, northEast: Coordinates, id?: string): Tile {
        return new Tile(
            southWest.lon,
            southWest.lat,
            northEast.lon - southWest.lon,
            northEast.lat - southWest.lat,
            id,
        )
    }

    public getBoundaries(): Coordinates[] {
        return [this.southWest, this.southEast, this.northEast, this.northWest]
    }

    public setCountryCode(countryCode?: string) {
        this.countryCode = countryCode
        return this
    }

    public getCountryCode(): string | undefined {
        return this.countryCode
    }

    public epicenter(): Coordinates {
        if (!this._epicenter) {
            this._epicenter = new Coordinates(
                (this.southWest.lat + this.southEast.lat + this.northEast.lat + this.northWest.lat) / 4,
                (this.southWest.lon + this.southEast.lon + this.northEast.lon + this.northWest.lon) / 4,
            )
        }
        return this._epicenter
    }

    public id(): string {
        return this.ID ?? `${this.southWest.lon};${this.southWest.lat}`
    }
}
