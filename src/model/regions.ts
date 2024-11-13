import {Tile} from "./tiles.ts";

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