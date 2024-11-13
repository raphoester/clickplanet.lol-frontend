import countriesData from "../../static/countries/countries.json"
import {Country, countryContext} from "./CountryProvider.tsx";
import {useContext, ChangeEvent, useState} from "react";

import "./CountrySelector.css"

const countries: Country[] = countriesData

export default function CountrySelector() {
    const [isOpen, setIsOpen] = useState(false)
    const togglePopup = () => {
        setIsOpen(!isOpen)
    }

    const {setCountry} = useContext(countryContext);
    const handleCountrySelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedCountry = countries.find(country =>
            country.code === event.target.value);
        if (!selectedCountry) {
            throw new Error(`Country not found for code ${event.target.value}`);
        }
        setCountry(selectedCountry);
    }

    return (
        <>
            <button
                onClick={togglePopup}
                className="country-selector-button">Open Popup
            </button>
            {
                isOpen &&
                <div className="country-selector-modal" onClick={togglePopup}>
                    <div className="country-selector-modal-card"
                         onClick={(e) => {
                             e.stopPropagation()
                         }}>
                        <h2 className="country-selector-modal-card-title">
                            Choose a country</h2>
                        <select
                            onChange={handleCountrySelect}
                            className="country-selector-select">
                            {
                                countries.map(
                                    (country) => (
                                        <option
                                            key={country.code}
                                            value={country.code}
                                        >{country.name}
                                        </option>
                                    )
                                )
                            }
                        </select>
                    </div>
                </div>
            }
        </>
    )
}
