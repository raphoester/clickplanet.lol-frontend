import {Ownerships, OwnershipsGetter, TileClicker, Update, UpdatesListener} from "./backend.ts";
import {v4 as UUIDv4} from 'uuid';
import {Countries} from "../app/countries.ts";

export class FakeBackend implements TileClicker, OwnershipsGetter, UpdatesListener {
    private tileBindings: Map<number, string> = new Map()
    private updateListeners: Map<string, (update: Update) => void> = new Map()
    private pendingUpdates: Update[] = []
    private updateBatchCallbacks: Map<string, (update: Update[]) => void> = new Map()


    constructor(batchUpdateDurationMs: number) {
        for (let i = 1; i < 257000; i++) {
            this.tileBindings.set(i, "fr")
        }

        this.listenForUpdates((update) => {
            this.pendingUpdates.push(update)
        })

        setInterval(() => {
            if (this.pendingUpdates.length > 0) {
                const updates = this.pendingUpdates
                this.pendingUpdates = []
                this.updateBatchCallbacks.forEach(callback => callback(updates))
            }
        }, batchUpdateDurationMs)

        Countries.forEach((country) => {
            let tileId = Math.floor(Math.random() * 100_00)
            const gap = Math.floor(Math.random() * 100)

            setInterval(() => { // simulate updates
                tileId = (tileId + gap) % 257_000
                this.clickTile(tileId, country.code).catch(e => console.error("failed to click", e))
            }, Math.random() * 1000)
        })
    }

    public async clickTile(tileId: number, countryId: string) {
        const prev = this.tileBindings.get(tileId)
        this.tileBindings.set(tileId, countryId)
        this.updateListeners.forEach(l => l({
            tile: tileId,
            previousCountry: prev,
            newCountry: countryId,
        }))
    }

    public async listenForUpdates(
        callback: (update: Update) => void
    ): Promise<() => void> {
        const identifier = UUIDv4()
        this.updateListeners.set(identifier, callback)
        return () => {
            this.updateListeners.delete(identifier)
        }
    }

    public listenForUpdatesBatch(
        callback: (updates: Update[]) => void,
    ): () => void {
        const id = UUIDv4()
        this.updateBatchCallbacks.set(id, callback)
        return () => {
            this.updateBatchCallbacks.delete(id)
        }
    }

    public async getCurrentOwnershipsByBatch(
        batchSize: number,
        maxIndex: number,
        callback: (ownerships: Ownerships) => void) {

        let index = 1
        while (index < maxIndex) {
            const end = Math.min(index + batchSize, maxIndex)
            const slice = new Map(Array.from(this.tileBindings.entries()).slice(index, end))
            callback({bindings: slice})
            index = end
        }
    }
}