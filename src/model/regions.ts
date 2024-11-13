import {Tile} from "./tiles.ts";
import {Coordinates3, onSphereTriangle} from "../util/cartesian.ts";
import {Triangle as geodesicTriangle} from "../util/geodesic.ts";

export class Region {
    private tiles: Tile[]

    constructor(
        private triangle: geodesicTriangle,
        allTiles: Tile[]
    ) {
        this.tiles = allTiles.filter(tile => this.triangle.contains3OrMore(tile.getBoundaries()))
    }

    public id(): string {
        return this.triangle.a.toString() +
            this.triangle.b.toString() +
            this.triangle.c.toString()
    }

    public getTiles(): Tile[] {
        return this.tiles
    }
}

function getIcosahedronVertices(): Coordinates3[] {
    const phi = (1 + Math.sqrt(5)) / 2;
    const a = 1
    const b = 1 / phi

    return [
        new Coordinates3(0, a, b), new Coordinates3(0, -a, b), new Coordinates3(0, a, -b),
        new Coordinates3(0, -a, -b), new Coordinates3(b, 0, a), new Coordinates3(-b, 0, a),
        new Coordinates3(b, 0, -a), new Coordinates3(-b, 0, -a), new Coordinates3(a, b, 0),
        new Coordinates3(-a, b, 0), new Coordinates3(a, -b, 0), new Coordinates3(-a, -b, 0)
    ]
}

export function generateRegionTriangles(subdivisionLevel: number): geodesicTriangle[] {
    const vertices = getIcosahedronVertices()

    const triangles: onSphereTriangle[] = [ // TODO: make this more explicit ?
        new onSphereTriangle(vertices[0], vertices[8], vertices[4]),
        new onSphereTriangle(vertices[0], vertices[4], vertices[1]),
        new onSphereTriangle(vertices[0], vertices[1], vertices[6]),
        new onSphereTriangle(vertices[0], vertices[6], vertices[10]),
        new onSphereTriangle(vertices[0], vertices[10], vertices[8]),
        new onSphereTriangle(vertices[8], vertices[10], vertices[2]),
        new onSphereTriangle(vertices[8], vertices[2], vertices[4]),
        new onSphereTriangle(vertices[4], vertices[2], vertices[5]),
        new onSphereTriangle(vertices[4], vertices[5], vertices[1]),
        new onSphereTriangle(vertices[1], vertices[5], vertices[11]),
        new onSphereTriangle(vertices[1], vertices[11], vertices[6]),
        new onSphereTriangle(vertices[6], vertices[11], vertices[7]),
        new onSphereTriangle(vertices[6], vertices[7], vertices[10]),
        new onSphereTriangle(vertices[10], vertices[7], vertices[2]),
        new onSphereTriangle(vertices[2], vertices[7], vertices[9]),
        new onSphereTriangle(vertices[2], vertices[9], vertices[5]),
        new onSphereTriangle(vertices[5], vertices[9], vertices[11]),
        new onSphereTriangle(vertices[11], vertices[9], vertices[3]),
        new onSphereTriangle(vertices[11], vertices[3], vertices[7]),
        new onSphereTriangle(vertices[7], vertices[3], vertices[9])
    ]

    return triangles.map(triangle =>
        triangle.subdivide(subdivisionLevel)).flat().map(triangle => triangle.toGeodesic())
}

// legacy

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