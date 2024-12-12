import {Countries, Country} from "./countries.ts";
import SelectWithSearch from "./components/SelectWithSearch.tsx";
import ModalManager from "./components/ModalManager.tsx";

type SettingsProps = {
    country: Country,
    setCountry: (country: Country) => void
}

export default function Settings(props: SettingsProps) {
    return (
        <ModalManager
            openByDefault={false}
            modalChildren={<div className="">
                <SelectWithSearch
                    onChange={(country) => {
                        props.setCountry(country)
                    }}
                    selected={props.country}
                    values={Array.from(Countries.values())}
                />
            </div>}
            modalTitle={"Country"}
            buttonProps={{
                className: "button button-settings",
                onClick: () => {
                },
                text: props.country.name,
                imageUrl: `/static/countries/svg/${props.country.code}.svg`,
            }}
        />
    )
}
