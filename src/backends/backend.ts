import {GameMap} from "../model/gameMap.ts";

export interface GameMapProvider {
    provideGameMap(): Promise<GameMap>
}

export interface TileClicker {
    clickTile(tileId: string, countryId: string): Promise<void>
}

export type Ownerships = {
    bindings: Map<string, string>
}

export interface OwnershipsGetter {
    getCurrentOwnerships(): Promise<Ownerships>
}