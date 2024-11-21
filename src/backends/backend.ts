export interface TileClicker {
    clickTile(tileId: number, countryId: string): Promise<void>
}

export type Ownerships = {
    bindings: Map<number, string>
}

export interface OwnershipsGetter {
    getCurrentOwnerships(): Promise<Ownerships>
}

export interface UpdatesListener {
    listenForUpdates(callback: (tile: number, countryCode: string) => void): Promise<() => void>
}