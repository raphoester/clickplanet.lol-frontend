import {createContext, ReactNode, useState} from "react";

export const countryContext = createContext({
    country: {
        code: "fr",
        name: "France"
    } as Country,
    setCountry: function (country: Country): void {
        throw new Error(`setCountry not implemented, country: ${country}`);
    }
});

export type Country = {
    name: string,
    code: string
}

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
