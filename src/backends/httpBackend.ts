import {GameMapProvider, Ownerships, OwnershipsGetter, TileClicker} from "./backend.ts";
import {GameMap} from "../model/gameMap.ts";
import {
    ClickRequest,
    Map as GameMapProto,
    Ownerships as OwnershipsProto,
    GeodesicCoordinates,
} from "../gen/grpc/clicks_pb.ts";
import {Tile} from "../model/tiles.ts";
import {Coordinates} from "../util/geodesic.ts";
import {Region} from "../model/regions.ts";
import {Message} from "@bufbuild/protobuf";

type Config = {
    baseUrl: string
    timeoutMs?: number
}

export class ClickServiceClient {
    constructor(private config: Config) {
    }

    public async fetch(
        verb: string,
        path: string,
        body?: Message
    ): Promise<Uint8Array | undefined> {
        const url = this.config.baseUrl + path
        console.log(`Fetching ${verb} ${url}`)
        const res = await fetch(url, {
            method: verb,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify({
                data: Array.from(body?.toBinary())
            }) : null
        })

        if (!res.ok) {
            throw new Error(`Failed to fetch ${verb} ${path}: ${res.statusText} ${await res.text()}`)
        }

        const json = await res.json()
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

export class HTTPBackend implements GameMapProvider, TileClicker, OwnershipsGetter {
    constructor(private client: ClickServiceClient) {
    }

    public async provideGameMap(): Promise<GameMap> {
        const binary = await this.client.fetch("GET", "/app/map", undefined)
        const message = GameMapProto.fromBinary(binary!)
        const regions = message.regions.map(region =>
            new Region(
                mapGeodesicCoordinates(region.epicenter),
                region.tiles.map(tile =>
                    Tile.fromMinimalBoundaries(
                        mapGeodesicCoordinates(tile.southWest),
                        mapGeodesicCoordinates(tile.northEast),
                        tile.id
                    ).setCountryCode(tile.countryId)
                ))
        )
        const tiles = regions.flatMap(region => region.getTiles())
        return Promise.resolve({regions, tiles})
    }

    public async clickTile(tileId: number, countryId: string) {
        const payload = new ClickRequest({
            tileId: tileId,
            countryId: countryId,
        })

        await this.client.fetch("POST", "/app/click", payload)
    }

    public async getCurrentOwnerships(): Promise<Ownerships> {
        const binary = await this.client.fetch("GET", "/app/bindings", undefined)
        const message = OwnershipsProto.fromBinary(binary!)
        return {
            bindings: new Map<string, string>(Object.entries(message.bindings))
        }
    }
}

function mapGeodesicCoordinates(proto: GeodesicCoordinates | undefined): Coordinates {
    return new Coordinates(proto!.lat, proto!.lon)
}