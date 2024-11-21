import {useContext, useEffect} from 'react';
import {effect} from "./effect.ts";
import {countryContext} from "../CountryContext.tsx";
import {OwnershipsGetter, TileClicker} from "../../backends/backend.ts";

export type ViewerProps = {
    tileClicker: TileClicker
    ownershipsGetter: OwnershipsGetter
}

export default function Viewer(props: ViewerProps) {
    const country = useContext(countryContext).country
    console.log("Viewer country", country)
    useEffect(() => {
        return effect(country, props.tileClicker, props.ownershipsGetter)
    }, [country, props]);

    return <div id="three-container" style={{width: '100vw', height: '100vh'}}/>;
};