import MapViewer from "./MapViewer";
import Settings from "./Settings.tsx";
import CountryProvider from "./CountryProvider.tsx";
import "./App.css";
import {useEffect, useState} from "react";
import GameMapProvider from "../adapters/dataSources.ts";
import {GameMap} from "../model/gameMap.ts";

export type AppProps = {
    gameMapProvider: GameMapProvider
}

export default function App(props: AppProps) {
    const [gameMap, setGameMap] = useState<GameMap | undefined>()
    useEffect(() => {
        props.gameMapProvider.provideGameMap().then((newGameMap) => {
            console.log("gameMap", newGameMap)
            setGameMap(newGameMap)
        })
    }, [props.gameMapProvider])

    return (
        <div className="App">
            <CountryProvider>
                <Settings/>
                {gameMap &&
                    <MapViewer
                        className="map-viewer"
                        gameMap={gameMap}
                        defaultColor={0x00ff00}
                    />
                }
            </CountryProvider>
        </div>
    );
}