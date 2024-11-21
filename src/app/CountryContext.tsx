import {Country} from "../model/countries.ts";
import {createContext} from "react";


export type countryContextHandle = {
    country: Country
    setCountry: (country: Country) => void
}

export const countryContext = createContext({
    country: {
        code: "fr",
        name: "France"
    },
    setCountry: function (country: Country): void {
        throw new Error(`setCountry not implemented, country: ${country}`);
    }
} as countryContextHandle);