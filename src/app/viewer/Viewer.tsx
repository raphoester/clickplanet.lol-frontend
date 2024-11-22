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
    useEffect(() => {
        const eventTarget = document.getElementById("three-container")!
        return effect(
            country,
            props.tileClicker,
            props.ownershipsGetter,
            props.updatesListener,
            eventTarget
        )
    }, [country, props]);
    return <div id="three-container" style={{width: '100vw', height: '100vh'}}/>;
};