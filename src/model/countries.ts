import countriesData from "../../static/countries/countries.json"

export const Countries: Country[] = countriesData

export type Country = {
    name: string,
    code: string
}
