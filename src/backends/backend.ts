export interface TileClicker {
    clickTile(tileId: number, countryId: string): Promise<void>
}

export type Ownerships = {
    bindings: Map<number, string>
}

export interface OwnershipsGetter {
    getCurrentOwnerships(): Promise<Ownerships>

    getCurrentOwnershipsByBatch(
        batchSize: number,
        maxIndex: number,
        callback: (ownerships: Ownerships) => void
    ): Promise<void>
}

export interface UpdatesListener {
    listenForUpdates(callback: (tile: number, previousCountry: string | undefined, newCountry: string) => void): () => void
}