import {GameMap} from "../model/gameMap.ts";

export default interface GameMapProvider {
    provideGameMap(): Promise<GameMap>
}

