import {createContext, ReactNode, useState} from "react";
import {Country} from "../model/countries.ts";

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

export type CountryProviderProps = {
    children: ReactNode
}

export default function CountryProvider(props: CountryProviderProps) {
    const [country, setCountry] = useState({code: "fr", name: "France"})

    return (<countryContext.Provider
        value={
            {
                country: country,
                setCountry:
                    (c: Country) => {
                        console.log("country set to ", c)
                        setCountry(c)
                    }
            }
        }>
        {props.children}
    </countryContext.Provider>)
}
