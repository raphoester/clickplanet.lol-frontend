import {Coordinates, Triangle as geodesicTriangle} from "./geodesic.ts";

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
        return new Coordinates(lon, lat)
    }
}

export function midPoint(a: Coordinates3, b: Coordinates3): Coordinates3 {
    return new Coordinates3((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2)
}

export class onSphereTriangle {
    public readonly a: Coordinates3
    public readonly b: Coordinates3
    public readonly c: Coordinates3

    constructor(
        a: Coordinates3,
        b: Coordinates3,
        c: Coordinates3
    ) {
        this.a = a.normalize()
        this.b = b.normalize()
        this.c = c.normalize()
    }

    public subdivide(depth: number): onSphereTriangle[] {
        if (depth === 0) {
            return [this]
        }

        const mid1 = midPoint(this.a, this.b)
        const mid2 = midPoint(this.b, this.c)
        const mid3 = midPoint(this.c, this.a)

        return [
            ...new onSphereTriangle(this.a, mid1, mid3).subdivide(depth - 1),
            ...new onSphereTriangle(this.b, mid2, mid1).subdivide(depth - 1),
            ...new onSphereTriangle(this.c, mid3, mid2).subdivide(depth - 1),
            ...new onSphereTriangle(mid1, mid2, mid3).subdivide(depth - 1)
        ]
    }

    public toGeodesic(): geodesicTriangle {
        return new geodesicTriangle(
            this.a.toGeodesic(),
            this.b.toGeodesic(),
            this.c.toGeodesic(),
        )
    }
}
