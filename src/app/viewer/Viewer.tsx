import {useEffect, useRef, useState} from 'react';
import {effect} from "./effect.ts";
import {OwnershipsGetter, TileClicker, UpdatesListener} from "../../backends/backend.ts";
import Settings from "../Settings.tsx";
import {Country} from "../countries.ts";

export type ViewerProps = {
    tileClicker: TileClicker
    ownershipsGetter: OwnershipsGetter
    updatesListener: UpdatesListener
}

export default function Viewer(props: ViewerProps) {
    const [country, setCountry] = useState<Country>({name: "France", code: "fr"});
    const setCountryRef = useRef<(country: Country) => void>();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const eventTarget = document.getElementById("three-container")!
        const {
            updateCountry,
            country,
            cleanup
        } = effect(
            props.tileClicker,
            props.ownershipsGetter,
            props.updatesListener,
            eventTarget
        )

        setCountry(country)
        setCountryRef.current = (country: Country) => {
            console.log("setting country", country)
            setCountry(country)
            updateCountry(country)
        }

        setIsReady(true) // we are ready to receive country updates

        return cleanup
    }, [props]);

    return <>
        {/*nested container to not blow up when force-deleting events from parent in cleanup*/}
        <div>
            <div id="three-container" style={{width: '100vw', height: '100vh'}}/>
        </div>
        {isReady && <Settings
            setCountry={setCountryRef.current!}
            country={country}
        />}
    </>
};