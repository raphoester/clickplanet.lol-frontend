import {createContext} from "react";

const countryContext = createContext({
    country: {
        code: "fr",
        name: "France"
    } as Country,
    setCountry: () => {
    }
});

export type Country = {
    name: string,
    code: string
}


export default function CountryProvider() {
    return (
        <>
            <h1>CountryProvider</h1>
        </>
    )
}