import {Coordinates} from "./geodesic.ts";

export class Coordinates3 {
    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) {
    }

    public isNormalized(): boolean {
        return Math.abs(this.x ** 2 + this.y ** 2 + this.z ** 2 - 1) < 0.0001
    }

    public normalize(): Coordinates3 {
        const length = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
        return new Coordinates3(this.x / length, this.y / length, this.z / length)
    }

    // toGeodesic converts the cartesian coordinates to geodesic coordinates.
    // it assumes the coordinates are normalized.
    //
    // calling this method on non-normalized coordinates will result in incorrect results.
    public toGeodesic(): Coordinates {
        const lon = Math.atan2(this.y, this.x) * 180 / Math.PI
        const lat = Math.asin(this.z) * 180 / Math.PI
        return new Coordinates(lat, lon)
    }
}

export function fibonacciSphere(pointsCount: number): Coordinates3[] {
    const points: Coordinates3[] = []
    const phi = (1 + Math.sqrt(5)) / 2

    for (let i = 0; i < pointsCount; i++) {
        const y = 1 - (i / (pointsCount - 1)) * 2

        const radius = Math.sqrt(1 - y ** 2)
        const theta = phi * i

        const x = Math.cos(theta) * radius
        const z = Math.sin(theta) * radius

        points.push(new Coordinates3(x, y, z))
    }

    return points
}