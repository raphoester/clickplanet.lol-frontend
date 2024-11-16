import {absDiff} from "./math.ts";

export const startLat = -90.0;
export const endLat = 90.0;
export const startLon = -180.0;
export const endLon = 180.0;

export class Coordinates {
    public readonly lon: number
    public readonly lat: number

    constructor(
        lat: number,
        lon: number,
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

    public haversineDistanceTo(other: Coordinates): number {
        const R = 6371; // Earth radius in km
        const dLat = (other.lat - this.lat) * Math.PI / 180;
        const dLon = (other.lon - this.lon) * Math.PI / 180;
        const lat1 = this.lat * Math.PI / 180;
        const lat2 = other.lat * Math.PI / 180;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in km
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
