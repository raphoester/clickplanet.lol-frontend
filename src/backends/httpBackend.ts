import {Ownerships, OwnershipsGetter, TileClicker, Update, UpdatesListener} from "./backend.ts";
import {
    ClickRequest, OwnershipBatchRequest,
    Ownerships as OwnershipsProto, TileUpdate,
} from "../gen/grpc/clicks_pb.ts";
import {Message} from "@bufbuild/protobuf";
import {v4 as generateUUID} from 'uuid';

type Config = {
    baseUrl: string
    timeoutMs?: number
}

export class ClickServiceClient {
    constructor(public config: Config) {
    }

    public async fetch(
        verb: string,
        path: string,
        body?: Message
    ): Promise<Uint8Array | undefined> {
        const url = this.config.baseUrl + path

        let res: Response | undefined

        for (let i = 0; i < 5; i++) {
            try {
                res = await fetch(url, {
                    method: verb,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: body ? JSON.stringify({
                        data: Array.from(body?.toBinary())
                    }) : null,
                    signal: AbortSignal.timeout(this.config.timeoutMs || 5000)
                })
            } catch (e) {
                console.error(i, "Failed to fetch", e)
            }
            if (res) {
                break
            }
        }

        if (!res) {
            throw new Error(`Failed to fetch ${verb} ${path}`)
        }

        if (!res.ok) {
            throw new Error(`Failed to fetch ${verb} ${path}: ${res.statusText} ${await res.text()}`)
        }

        const json = await res!.json()
        const base64String = json.data
        if (!base64String) {
            return undefined
        }
        const binaryString = atob(base64String);

        const uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }

        return uint8Array
    }
}

export class HTTPBackend implements TileClicker, OwnershipsGetter, UpdatesListener {
    private pendingUpdates: Update[] = []
    private updateBatchCallbacks: Map<string, ((update: Update[]) => void)> = new Map()

    constructor(
        private client: ClickServiceClient,
        batchUpdateDurationMs: number,
    ) {
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
    }

    public async clickTile(tileId: number, countryId: string) {
        const payload = new ClickRequest({
            tileId: tileId,
            countryId: countryId,
        })

        await this.client.fetch("POST", "/v2/rpc/click", payload)
    }

    public async getCurrentOwnershipsByBatch(
        batchSize: number,
        maxIndex: number,
        callback: (ownerships: Ownerships) => void,
    ) {
        for (let i = 1; i < maxIndex; i += batchSize) {
            const payload = new OwnershipBatchRequest({
                endTileId: i + batchSize,
                startTileId: i,
            })

            const binary = await this.client.fetch("POST", "/v2/rpc/ownerships-by-batch", payload)
            const message = OwnershipsProto.fromBinary(binary!)

            callback({
                bindings: new Map<number, string>(
                    Object.entries(message.bindings).map(([k, v]) => [parseInt(k), v]))
            })
        }
    }

    public async listenForUpdates(callback: (update: Update) => void): Promise<() => void> {
        const protocol = this.client.config.baseUrl.startsWith("https") ? "wss" : "ws"
        const host = this.client.config.baseUrl.replace("https://", "").replace("http://", "")

        const websocket = await initWebsocket({
            url: `${protocol}://${host}/v2/ws/listen`,
            existingWebsocket: undefined,
            timeoutMs: this.client.config.timeoutMs,
            numberOfRetries: 0,
        });

        websocket.binaryType = "arraybuffer";
        websocket.onmessage = (event) => {
            const binary = new Uint8Array(event.data)
            const message = TileUpdate.fromBinary(binary)
            callback({
                tile: message.tileId,
                previousCountry: message.previousCountryId === "" ? undefined : message.previousCountryId,
                newCountry: message.countryId,
            })
        }

        return () => websocket.close
    }

    public listenForUpdatesBatch(
        callback: (updates: Update[]) => void,
    ): () => void {
        const id = generateUUID()
        this.updateBatchCallbacks.set(id, callback)
        return () => this.updateBatchCallbacks.delete(id)
    }
}

function initWebsocket(
    {
        url,
        existingWebsocket,
        timeoutMs,
        numberOfRetries
    }: {
        url: string,
        existingWebsocket: WebSocket | undefined,
        timeoutMs: number | undefined,
        numberOfRetries: number,
    }
): Promise<WebSocket> {
    timeoutMs = timeoutMs ? timeoutMs : 1500;
    numberOfRetries = numberOfRetries ? numberOfRetries : 0;
    let hasReturned = false;
    const promise = new Promise<WebSocket>((resolve, reject) => {
        setTimeout(function () {
            if (!hasReturned) {
                console.info('opening websocket timed out: ' + url);
                rejectInternal();
            }
        }, timeoutMs);

        if (!existingWebsocket || existingWebsocket.readyState != existingWebsocket.OPEN) {
            if (existingWebsocket) {
                existingWebsocket.close();
            }
            const websocket = new WebSocket(url);
            websocket.onopen = function () {
                if (hasReturned) {
                    websocket.close();
                } else {
                    console.info('websocket opened ' + url);
                    resolve(websocket);
                }
            };
            websocket.onclose = function () {
                console.info('websocket closed ' + url);
                rejectInternal();
            };
            websocket.onerror = function () {
                console.info('websocket err ' + url);
                rejectInternal();
            };
        } else {
            resolve(existingWebsocket);
        }

        function rejectInternal() {
            if (numberOfRetries <= 0) {
                reject();
            } else if (!hasReturned) {
                hasReturned = true;
                console.info('retrying connection to websocket url: ' + url + ', remaining retries: ' + (numberOfRetries - 1));
                initWebsocket({
                    url: url,
                    existingWebsocket: undefined,
                    timeoutMs: timeoutMs,
                    numberOfRetries: numberOfRetries - 1,
                }).then(resolve, reject);
            }
        }
    });
    promise.then(function () {
        hasReturned = true;
    }, function () {
        hasReturned = true;
    });
    return promise;
}