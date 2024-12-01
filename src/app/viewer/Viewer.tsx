import {useEffect, useRef, useState} from 'react';
import {effect} from "./effect.ts";
import {OwnershipsGetter, TileClicker, UpdatesListener} from "../../backends/backend.ts";
import Settings from "../Settings.tsx";
import {Country} from "../countries.ts";
import Leaderboard from "../Leaderboard.tsx";
import About from "../About.tsx";
import "./Viewer.css"

export type ViewerProps = {
    tileClicker: TileClicker
    ownershipsGetter: OwnershipsGetter
    updatesListener: UpdatesListener
}

export default function Viewer(props: ViewerProps) {
    const [country, setCountry] = useState<Country>({name: "France", code: "fr"});
    const setCountryRef = useRef<(country: Country) => void>();
    const tilesCountRef = useRef(0)

    const [leaderboardData, setLeaderboardData] = useState<{ country: Country, tiles: number }[]>([])
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const eventTarget = document.getElementById("three-container")!
        const {
            updateCountry,
            country,
            tilesCount,
            cleanup,
        } = effect(
            props.tileClicker,
            props.ownershipsGetter,
            props.updatesListener,
            (data) => setLeaderboardData(data),
            eventTarget
        )

        tilesCountRef.current = tilesCount
        setCountry(country)
        setCountryRef.current = (country: Country) => {
            console.log("setting country", country)
            setCountry(country)
            updateCountry(country)
        }
        setIsReady(true)

        return cleanup
    }, [props]);

    return <>
        {/*nested container to not blow up when force-deleting events from parent in cleanup*/}
        <div>
            <div id="three-container" style={{width: '100vw', height: '100vh'}}/>
        </div>
        <div>
        </div>
        {isReady && <>
            <Leaderboard
                data={leaderboardData}
                tilesCount={tilesCountRef.current}
            />
            <div className="viewer-right-side-buttons">
                <Settings
                    setCountry={setCountryRef.current!}
                    country={country}/>
                <About/>
            </div>
        </>}
    </>
};