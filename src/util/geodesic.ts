import {absDiff} from "./math.ts";

export const startLat = -90.0;
export const endLat = 90.0;
export const startLon = -180.0;
export const endLon = 180.0;

export class Coordinates {
    public readonly lon: number
    public readonly lat: number

    constructor(
        lon: number,
        lat: number,
    ) {
        lon = round(lon, startLon, endLon)
        lat = round(lat, startLat, endLat)

        if (lon < startLon || lon > endLon) {
            throw new Error(`longitude must be between ${startLon} and ${endLon}, got ${lon}`)
        }

        if (lat < startLat || lat > endLat) {
            throw new Error(`latitude must be between ${endLat} and ${startLat}, got ${lat}`)
        }

        this.lon = lon
        this.lat = lat
    }

    public toString(): string {
        return `(${this.lon};${this.lat})`
    }
}

const approximationTolerance = 0.0001

function round(float: number, ...targets: number[]): number {
    for (const target of targets) {
        const diff = absDiff(float, target)
        if (diff < approximationTolerance) {
            return target
        }
    }
    return float
}

export class Triangle {
    constructor(
        public a: Coordinates,
        public b: Coordinates,
        public c: Coordinates
    ) {
    }

    public contains3OrMore(coordinates: Coordinates[]): boolean {
        return coordinates.filter(coordinates => this.contains(coordinates)).length >= 3
    }

    // contains checks if a point is inside the triangle using barycentric coordinates
    public contains(coordinates: Coordinates): boolean {
        const {lon: x, lat: y} = coordinates;

        const {lon: x1, lat: y1} = this.a;
        const {lon: x2, lat: y2} = this.b;
        const {lon: x3, lat: y3} = this.c;

        // compute barycentric coordinates
        const denominator = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
        const alpha = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / denominator;
        const beta = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / denominator;
        const gamma = 1 - alpha - beta;

        // the dot is inside the triangle if all the barycentric coordinates are positive
        return alpha >= 0 && beta >= 0 && gamma >= 0;
    }
}