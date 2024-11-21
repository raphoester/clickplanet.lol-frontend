import {useContext, useEffect} from 'react';
import {effect} from "./effect.ts";
import {countryContext} from "../CountryContext.tsx";

export default function Viewer() {
    const country = useContext(countryContext).country
    console.log("Viewer country", country)
    useEffect(() => {
        return effect(country)
    }, [country]);

    return <div id="three-container" style={{width: '100vw', height: '100vh'}}/>;
};