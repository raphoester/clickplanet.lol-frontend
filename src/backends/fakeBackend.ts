import {Ownerships, OwnershipsGetter, TileClicker, UpdatesListener} from "./backend.ts";
import {v4 as UUIDv4} from 'uuid';

export class FakeBackend implements TileClicker, OwnershipsGetter, UpdatesListener {
    private tileBindings: Map<number, string> = new Map()
    private updateListeners: Map<string,
        (tile: number, previousCountry: string | undefined, newCountry: string) => void> = new Map()

    constructor() {
        setInterval(() => {
            const tileId = Math.floor(Math.random() * 100)
            this.clickTile(tileId, "fr").then(() => {
            })
        }, 1000)
    }

    public async clickTile(tileId: number, countryId: string) {
        const prev = this.tileBindings.get(tileId)
        this.tileBindings.set(tileId, countryId)
        this.updateListeners.forEach(l => l(tileId, prev, countryId))
    }

    public async getCurrentOwnerships(): Promise<Ownerships> {
        return {bindings: this.tileBindings}
    }

    public listenForUpdates(
        callback: (tile: number, previousCountry: string | undefined, newCountry: string) => void
    ): () => void {
        const identifier = UUIDv4()
        this.updateListeners.set(identifier, callback)
        return () => {
            this.updateListeners.delete(identifier)
        }
    }
}