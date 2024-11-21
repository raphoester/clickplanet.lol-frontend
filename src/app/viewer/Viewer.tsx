import {useContext, useEffect} from 'react';
import {effect} from "./effect.ts";
import {countryContext} from "../CountryContext.tsx";
import {OwnershipsGetter, TileClicker, UpdatesListener} from "../../backends/backend.ts";

export type ViewerProps = {
    tileClicker: TileClicker
    ownershipsGetter: OwnershipsGetter
    updatesListener: UpdatesListener
}

export default function Viewer(props: ViewerProps) {
    const country = useContext(countryContext).country
    console.log("Viewer country", country)
    useEffect(() => {
        return effect(
            country,
            props.tileClicker,
            props.ownershipsGetter,
            props.updatesListener,
        )
    }, [country, props]);
    return <div id="three-container" style={{width: '100vw', height: '100vh'}}/>;
};