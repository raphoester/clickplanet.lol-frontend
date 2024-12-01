import {Countries, Country} from "../countries.ts";
import {Ownerships} from "../../backends/backend.ts";

export type Data = {
    country: Country,
    tiles: number
}[]

export class Leaderboard {
    private readonly data: Data

    constructor(private readonly update: (data: Data) => void) {
        this.data = []
    }

    public registerClick(oldCountry: Country | undefined, country: Country) {
        const leaderboardIndex = this.data.findIndex(entry => entry.country.code === country.code)
        if (leaderboardIndex !== -1) {
            this.data[leaderboardIndex].tiles++
        } else {
            this.data.push({country, tiles: 1})
        }

        if (oldCountry) {
            const oldCountryIndex = this.data.findIndex(entry => entry.country.code === oldCountry.code)
            if (oldCountryIndex !== -1) {
                this.data[oldCountryIndex].tiles--
            }
        }

        this.commitUpdate()
    }

    public registerOwnerships(ownerships: Ownerships) {
        // build a data and call registerBatch
        const data = new Map<string, number>()
        Array.from(ownerships.bindings.values()).forEach(countryCode => {
            if (data.has(countryCode)) {
                data.set(countryCode, data.get(countryCode)! + 1)
                return
            }
            data.set(countryCode, 1)
        })

        const dataEntries = Array.from(data.entries()).map(([countryCode, tilesCount]) => {
            const country = Countries.get(countryCode)
            if (!country) return

            return {
                country: country,
                tiles: tilesCount
            }
        })

        this.registerBatch(dataEntries.filter(e => e !== undefined) as Data)
    }

    public registerBatch(data: Data) {
        for (const entry of data) {
            const leaderboardIndex = this.data.findIndex(e => e.country.code === entry.country.code)
            if (leaderboardIndex !== -1) {
                this.data[leaderboardIndex].tiles += entry.tiles
            } else {
                this.data.push(entry)
            }
        }
        this.commitUpdate()
    }

    private commitUpdate() {
        const newData = [...this.data] // update the reference to trigger re-render
        newData.sort((a, b) => b.tiles - a.tiles)
        this.update(newData)
    }
}