import countriesData from "../../static/countries/countries.json" assert {type: "json"};
import {Country} from "./CountryProvider.tsx";
import {useContext} from "react";

const countries = countriesData as Country[];

export default function CountrySelector() {
    const state = useContext();
    return (
        <>
            <select onChange={handleCountrySelect}>
                {countries.map((country) => (
                    <option key={country.code} value={country.code}>{country.name}</option>
                ))}
            </select>
        </>
    )
}