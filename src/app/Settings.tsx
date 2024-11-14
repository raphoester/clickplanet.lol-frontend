import countriesData from "../../static/countries/countries.json"
import {Country, countryContext} from "./CountryProvider.tsx";
import {useContext, ChangeEvent, useState} from "react";

import "./Settings.css"

const countries: Country[] = countriesData

export default function Settings() {
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
            <button onClick={togglePopup}
                    className="settings-opener-button">
                Settings
            </button>
            {
                isOpen &&
                <div className="settings-modal" onClick={togglePopup}>
                    <div className="settings-modal-card"
                         onClick={(e) => {
                             e.stopPropagation()
                         }}>
                        <div className="settings-modal-card-title">
                            <h2>Settings</h2>
                        </div>

                        <div className="country-settings settings-section">
                            <label htmlFor="country-select">Country</label>
                            <select
                                onChange={handleCountrySelect}
                                className="settings-country-select">
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
                </div>
            }
        </>
    )
}
