const startLat = -90.0;
const endLat = 90.0;
const startLon = -180.0;
const endLon = 180.0;

const absDiff = (a: number, b: number): number => {
    if (a < b) {
        return Math.abs(b - a)
    }
    return Math.abs(a - b)
}

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

const approximationTolerance = 0.0001

function round(float: number, ...targets: number[]): number {
    for (const target of targets) {
        if (absDiff(float, target) < approximationTolerance) {
            return target
        }
    }
    return float
}

export class Coordinates {
    constructor(public lon: number, public lat: number) {
        lon = round(lon, startLon, endLon)
        lat = round(lat, startLat, endLat)

        if (lon < startLon || lon > endLon) {
            throw new Error(`longitude must be between ${startLon} and ${endLon}, got ${lon}`)
        }

        if (lat < startLat || lat > endLat) {
            throw new Error(`latitude must be between ${endLat} and ${startLat}, got ${lat}`)
        }
    }

    public toString(): string {
        return `(${this.lon};${this.lat})`
    }
}

export type TileGroup = Tile[]

export function groupTiles(tiles: Tile[], groupsCount: number): TileGroup[] {
    const groups: TileGroup[] = []

    const tilesPerGroup = Math.floor(tiles.length / groupsCount)

    for (let i = 0; i < groupsCount; i++) {
        const start = i * tilesPerGroup
        let end = (i + 1) * tilesPerGroup

        if (i === groupsCount - 1) {
            end = tiles.length
        }

        groups.push(tiles.slice(start, end))
    }

    return groups
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
