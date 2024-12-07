import {Countries, Country} from "./countries.ts";
import SelectWithSearch from "./components/SelectWithSearch.tsx";
import ModalManager from "./components/ModalManager.tsx";

import "./Settings.css"

type SettingsProps = {
    country: Country,
    setCountry: (country: Country) => void
}

export default function Settings(props: SettingsProps) {
    return (
        <ModalManager
            openByDefault={false}
            modalChildren={<div className="country-settings settings-section">
                <div className="settings-section-header">
                    <label className="settings-country-section-label" htmlFor="country-select">Country</label>
                </div>

                <SelectWithSearch
                    onChange={(country) => {
                        props.setCountry(country)
                    }}
                    selected={props.country}
                    values={Array.from(Countries.values())}
                />
            </div>}
            modalTitle={"Settings"}
            buttonProps={{
                onClick: () => {
                },
                text: props.country.name,
                imageUrl: `/static/countries/svg/${props.country.code}.svg`,
            }}
        />
    )
}
