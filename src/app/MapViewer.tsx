import {
    createRef, MutableRefObject, RefObject,
    useEffect, useMemo, useRef, useState
} from "react";
import {Viewer} from "resium";
import {
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Cartesian2,
    Viewer as CesiumViewer,
} from "cesium";

import Region, {RegionHandle} from "./Region.tsx";
import {GameMap} from "../model/gameMap.ts";
import Loader from "./Loader.tsx";
import {TileClicker} from "../backends/backend.ts";

type MapViewerProps = {
    gameMap: GameMap
    tileClicker: TileClicker
    defaultColor: number
    className?: string
}

export default function MapViewer(props: MapViewerProps) {
    const viewerRef = useRef<{ cesiumElement: CesiumViewer }>(null);
    const regionRefs = useRef<RefObject<RegionHandle>[]>([]);
    regionRefs.current = props.gameMap.regions.map(
        (_, i) => regionRefs.current[i] ?? createRef<RegionHandle>()
    );

    const regionsPerTile = useMemo(() => {
        const ret: Map<string, number> = new Map();
        props.gameMap.regions.forEach((group, index) => {
            group.getTiles().forEach((tile: { id: () => string; }) => {
                ret.set(tile.id(), index);
            });
        });
        return ret
    }, [props.gameMap]);


    useEffect(() => {
        setTimeout(() => {
            if (!viewerRef.current) throw new Error("viewerRef not found");
            const eventHandler = new ScreenSpaceEventHandler(viewerRef.current.cesiumElement.scene.canvas);
            eventHandler.setInputAction((movement: { position: Cartesian2 }) => {
                const pickedObject = viewerRef.current?.cesiumElement.scene.pick(movement.position);
                if (!pickedObject) return

                const groupIndex = regionsPerTile.get(pickedObject.id);
                if (groupIndex === undefined) return // groupIndex can be 0

                const regionRef = regionRefs.current[groupIndex];
                if (!regionRef) return

                regionRef.current!.handleTileClick(pickedObject.id);
            }, ScreenSpaceEventType.LEFT_UP);
        }, 10)
    }, [regionsPerTile]);

    const counterRef = useRef(0);
    const [allLoaded, setAllLoaded] = useState(false);

    const onRegionReady = () => {
        counterRef.current++;
        if (counterRef.current === props.gameMap.regions.length) {
            setAllLoaded(true);
        }
    }

    return (
        <>
            {!allLoaded && <Loader/>}
            <Viewer full ref={viewerRef as MutableRefObject<null>} timeline={false} animation={false}>
                {props.gameMap.regions.map((region, index) => (
                    <Region
                        tileClicker={props.tileClicker}
                        key={region.getEpicenter().toString()}
                        index={index}
                        tiles={region.getTiles()}
                        ref={regionRefs.current[index]}
                        defaultColor={props.defaultColor}
                        onRegionReady={onRegionReady}
                    />
                ))}
            </Viewer>
        </>
    );
}


