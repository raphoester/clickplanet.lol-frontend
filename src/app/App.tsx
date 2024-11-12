import {generateTilesGrid, groupTiles} from "../model/tiles";
import MapViewer from "./MapViewer";

// const tiles = generateTilesGrid(800, 6);
const tiles = generateTilesGrid(150, 2);
console.log(`tiles count: ${tiles.length}`);

// const groups = groupTiles(tiles, 50);
const groups = groupTiles(tiles, 10);
console.log(`${groups.length} groups, ${groups[0].length} tiles per group`);

export default function App() {
    return (
        <div className="App">
            <MapViewer
                tileGroups={groups}
            />
        </div>
    );
}
