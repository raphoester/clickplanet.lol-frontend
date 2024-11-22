import {Ownerships, OwnershipsGetter, TileClicker, UpdatesListener} from "./backend.ts";

export class FakeBackend implements TileClicker, OwnershipsGetter, UpdatesListener {
    private tileBindings: Map<number, string> = new Map()
    private updateListeners: Map<string, (tile: number, countryCode: string) => void> = new Map()

    public async clickTile(tileId: number, countryId: string) {
        this.tileBindings.set(tileId, countryId)
        this.updateListeners.forEach(l => l(tileId, countryId))
    }

    public async getCurrentOwnerships(): Promise<Ownerships> {
        return {bindings: this.tileBindings}
    }

    public listenForUpdates(
        callback: (tile: number, countryCode: string) => void
    ): () => void {
        const identifier = self.crypto.randomUUID()
        this.updateListeners.set(identifier, callback)
        return () => {
            this.updateListeners.delete(identifier)
        }
    }
}