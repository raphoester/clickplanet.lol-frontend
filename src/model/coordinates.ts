import {absDiff} from "../util/math.ts";

export const startLat = -90.0;
export const endLat = 90.0;
export const startLon = -180.0;
export const endLon = 180.0;


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

const approximationTolerance = 0.0001

function round(float: number, ...targets: number[]): number {
    for (const target of targets) {
        if (absDiff(float, target) < approximationTolerance) {
            return target
        }
    }
    return float
}

