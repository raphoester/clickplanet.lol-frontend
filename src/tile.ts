const startLat = -90.0;
const endLat = 90.0;
const startLon = -180.0;
const endLon = 180.0;

export function generateTilesGrid(step: number): Tile[] {
    // TODO: reduce density of tiles near poles
    const tiles = []
    for (let lat = startLat; lat < endLat; lat += step) {
        for (let lon = startLon; lon < endLon; lon += step) {
            const tile = new Tile({lat, lon}, step)
            tiles.push(tile)
        }
    }
    return tiles
}

export type Coordinates = {
    lat: number,
    lon: number,
}

export class Tile {
    constructor(southWestCorner: Coordinates, step: number) {
        if (southWestCorner.lat < -90 || southWestCorner.lat + step > 90) {
            throw new Error("latitude must be between -90 and 90")
        }

        if (southWestCorner.lon < -180 || southWestCorner.lon + step > 180) {
            throw new Error("longitude must be between -180 and 180")
        }

        this.southWest = southWestCorner
        this.southEast = {lat: southWestCorner.lat, lon: southWestCorner.lon + step}
        this.northEast = {lat: southWestCorner.lat + step, lon: southWestCorner.lon + step}
        this.northWest = {lat: southWestCorner.lat + step, lon: southWestCorner.lon}
    }

    private readonly southWest: Coordinates
    private readonly southEast: Coordinates
    private readonly northEast: Coordinates
    private readonly northWest: Coordinates

    public getBoundaries(): Coordinates[] {
        return [this.southWest, this.southEast, this.northEast, this.northWest]
    }

    public id(): string {
        return `${this.southWest.lat};${this.southWest.lon}`
    }
}