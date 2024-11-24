import {ChangeEvent, useState} from "react";
import {Countries, Country} from "./countries.ts";
import "./Settings.css"

type SettingsProps = {
    country: Country,
    setCountry: (country: Country) => void
}

export default function Settings(props: SettingsProps) {
    const [isOpen, setIsOpen] = useState(false)
    const togglePopup = (val: boolean) => {
        return () => {
            setIsOpen(val)
        }
    }

    const handleCountrySelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedCountry = Countries.get(event.target.value);
        if (!selectedCountry) {
            throw new Error(`Country not found for code ${event.target.value}`);
        }
        props.setCountry(selectedCountry);
    }

    return (
        <>
            <button onClick={togglePopup(true)}
                    className="settings-opener-button">
                <img src={`/static/countries/svg/${props.country.code}.svg`} alt={`flag of ${props.country.name}`}/>
                <div>Change country</div>
            </button>
            {
                isOpen &&
                <div className="settings-modal" onClick={togglePopup(false)}>
                    <div className="settings-modal-card"
                         onClick={(e) => {
                             e.stopPropagation()
                         }}>
                        <div className="settings-modal-card-title">
                            <h2>Settings</h2>
                        </div>
                        <div
                            className="settings-modal-card-close"
                            onClick={togglePopup(false)}
                        ></div>
                        <div className="country-settings settings-section">
                            <label htmlFor="country-select">Country</label>
                            <select
                                defaultValue={props.country.code}
                                onChange={handleCountrySelect}
                                className="settings-country-select">
                                {
                                    Array.from(Countries.values()).map(
                                        (c) => (
                                            <option
                                                key={c.code}
                                                value={c.code}
                                            >{c.name}
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
