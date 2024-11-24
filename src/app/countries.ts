import countriesData from "../../static/countries/countries.json";

export const Countries: Map<string, Country> = convertToMap(countriesData);

export type Country = {
    name: string,
    code: string
}

function convertToMap(data: Record<string, string>): Map<string, { name: string; code: string }> {
    const resultMap = new Map<string, Country>();
    for (const [code, name] of Object.entries(data)) {
        resultMap.set(code, {name, code});
    }
    return resultMap;
}
