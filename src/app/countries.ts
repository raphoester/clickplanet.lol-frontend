import countriesData from "../../static/countries/countries.json";

export const Countries: Country[] = Object.entries(countriesData).map(([code, name]) => ({
    code,
    name,
}));

export type Country = {
    name: string,
    code: string
}
