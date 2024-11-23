import {Country} from "../countries.ts";
import timezonesData from "moment-timezone/data/meta/latest.json"

const timezones = timezonesData as {
    countries: {
        [key: string]: {
            name: string
        }
    }
    zones: {
        [key: string]: {
            countries: string[]
        }
    }
}

export function getCountryOfVisitor(): Country {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const countryCode = timezones.zones[tz]!.countries[0]!;
        return {code: countryCode.toLowerCase(), name: timezones.countries[countryCode]!.name}
    } catch (e) {
        console.error("Failed to get country of visitor", e)
        return {code: "fr", name: "France"}
    }
}