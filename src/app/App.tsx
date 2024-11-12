import {generateTilesGrid} from "../model/tiles";
import MapViewer from "./MapViewer";

const tiles = generateTilesGrid(150, 2);
console.log(`tiles count: ${tiles.length}`);

export default function App() {
    return (
        <div className="App">
            <MapViewer
                tiles={tiles}
            />
        </div>
    );
}
