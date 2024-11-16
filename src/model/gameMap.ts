import {Region} from "./regions.ts";
import {Tile} from "./tiles.ts";

export type GameMap = {
    regions: Region[]
    tiles: Tile[]
}