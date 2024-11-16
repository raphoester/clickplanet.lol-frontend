import GameMapProvider from "./dataSources.ts";
import {GameMap} from "../model/gameMap.ts";
import {Map as GameMapProto} from "../gen/grpc/clicks_pb.ts";
import {Tile} from "../model/tiles.ts";
import {GeodesicCoordinates} from "../gen/grpc/clicks_pb.ts";
import {Coordinates} from "../util/geodesic.ts";
import {Region} from "../model/regions.ts";

type Config = {
    baseUrl: string
    timeoutMs?: number
}

export class ClickServiceClient {
    constructor(private config: Config) {
    }

    public async fetch(verb: string, path: string, body?: never): Promise<Uint8Array> {
        const url = this.config.baseUrl + path
        console.log(`Fetching ${verb} ${url}`)
        const res = await fetch(url, {
            method: verb,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        })
        if (!res.ok) {
            throw new Error(`Failed to fetch ${verb} ${path}: ${res.statusText}`)
        }

        const json = await res.json()
        const base64String = json.data
        const binaryString = atob(base64String);

        const uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }

        return uint8Array
    }
}

export class RegionsFetcher implements GameMapProvider {
    constructor(private client: ClickServiceClient) {
    }

    async provideGameMap(): Promise<GameMap> {
        const binary = await this.client.fetch("GET", "/map", undefined)
        const message = GameMapProto.fromBinary(binary)
        const regions = message.regions.map(region =>
            new Region(mapGeodesicCoordinates(
                region.epicenter), region.tiles.map(tile =>
                Tile.fromMinimalBoundaries(
                    mapGeodesicCoordinates(tile.southWest),
                    mapGeodesicCoordinates(tile.northEast),
                )
            ))
        )
        const tiles = regions.flatMap(region => region.getTiles())
        return Promise.resolve({regions, tiles})
    }
}

function mapGeodesicCoordinates(proto: GeodesicCoordinates | undefined): Coordinates {
    return new Coordinates(proto!.lat, proto!.lon)
}