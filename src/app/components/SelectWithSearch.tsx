import { ChangeEvent, useState } from "react";
import "./SelectWithSearch.css"

type Value = {
    code: string,
    name: string
}

type SelectWithSearchProps = {
    selected: Value,
    values: Value[],
    onChange: (value: Value) => void
}

export default function SelectWithSearch(props: SelectWithSearchProps) {
    const [search, setSearch] = useState("")
    const [selected, setSelected] = useState(props.selected)

    const filteredOptions = props.values.filter(
        (v) => v.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = props.values.find((v) => v.code === event.target.value)
        if (!value) {
            console.error(`Value not found for code ${event.target.value}`)
            return
        }

        setSelected(value)
        setSearch("")
        props.onChange(value)
    }

    return <div className="select-with-search">
        <input
            type="text"
            placeholder={"Search..."}
            value={search}
            onChange={handleSearchChange}
            className="select-with-search-search"
            autoComplete="off"
        />
        <select
            value={selected.code}
            onChange={(e) => {
                handleSelectChange(e)
            }}
            size={5}
            className="select-with-search-select">
            {
                filteredOptions.map(
                    (v) => (
                        <option
                            className={`select-with-search-option`}
                            onClick={() => {
                                setSelected(v)
                                props.onChange(v)
                            }}
                            key={v.code}
                            value={v.code}
                        >{v.name}
                        </option>
                    )
                )
            }
        </select>
    </div>
}
