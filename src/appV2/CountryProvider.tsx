import {ReactNode, useState} from "react";
import {Country} from "../model/countries.ts";
import {countryContext} from "./CountryContext.tsx";


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
