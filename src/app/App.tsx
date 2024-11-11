import {useState} from "react";
import {Color} from "cesium";
import {generateTilesGrid} from "../model/tiles";
import {tilesToGeometryInstances, defaultColorMap, ColorMap} from "./colors.ts";
import MapViewer from "./MapViewer";

const tiles = generateTilesGrid(50, 1);
console.log(`tiles count: ${tiles.length}`);

export default function App() {
    const [colorMap, setColorMap] = useState<ColorMap>(defaultColorMap(tiles, Color.fromRgba(0x67ADDFFF)));
    const geometryInstances = tilesToGeometryInstances(tiles, colorMap);

    const handleTileClick = (tileId: string) => {
        colorMap.set(tileId, Color.BLUE);
        setColorMap(colorMap.copy());  // Crée une nouvelle Map pour forcer un nouveau rendu
    };

    return (
        <div className="App">
            <MapViewer
                geometryInstances={geometryInstances}
                onTileClick={handleTileClick}
            />
        </div>
    );
}
