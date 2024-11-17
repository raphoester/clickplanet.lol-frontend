import MapViewer from "./MapViewer";
import Settings from "./Settings.tsx";
import CountryProvider from "./CountryProvider.tsx";
import "./App.css";
import {useEffect, useState} from "react";
import {GameMap} from "../model/gameMap.ts";
import {GameMapProvider, TileClicker, OwnershipsGetter} from "../backends/backend.ts";

export type AppProps = {
    gameMapProvider: GameMapProvider
    tileClicker: TileClicker
    ownershipsGetter: OwnershipsGetter
}

export default function App(props: AppProps) {
    const [gameMap, setGameMap] = useState<GameMap | undefined>()
    useEffect(() => {
        props.gameMapProvider.provideGameMap().then((newGameMap) => {
            setGameMap(newGameMap)
        })
    }, [props.gameMapProvider])

    return (
        <div className="App">
            <CountryProvider>
                <Settings/>
                {gameMap &&
                    <MapViewer
                        tileClicker={props.tileClicker}
                        className="map-viewer"
                        gameMap={gameMap}
                        defaultColor={0x00ff00}
                    />
                }
            </CountryProvider>
        </div>
    );
}