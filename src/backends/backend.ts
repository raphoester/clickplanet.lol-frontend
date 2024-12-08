export interface TileClicker {
    clickTile(tileId: number, countryId: string): Promise<void>
}

export type Ownerships = {
    bindings: Map<number, string>
}

export interface OwnershipsGetter {
    getCurrentOwnershipsByBatch(
        batchSize: number,
        maxIndex: number,
        callback: (ownerships: Ownerships) => void
    ): Promise<void>
}

export type Update = {
    tile: number,
    previousCountry: string | undefined,
    newCountry: string
}

export interface UpdatesListener {
    listenForUpdates(callback: (update: Update) => void): Promise<() => void>

    listenForUpdatesBatch(
        callback: (updates: Update[]) => void,
    ): () => void
}