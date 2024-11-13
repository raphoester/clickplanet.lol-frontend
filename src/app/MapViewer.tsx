import React, {
    createRef, MutableRefObject, RefObject,
    useEffect, useMemo, useRef
} from "react";
import {Viewer} from "resium";
import {
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Cartesian2,
    Viewer as CesiumViewer, Color,
} from "cesium";

import Region, {RegionHandle} from "./Region.tsx";
import {Region as ModelRegion} from "../model/regions.ts";

type MapViewerProps = {
    regions: ModelRegion[],
    defaultColor: number,
    className?: string
}

export default function MapViewer(props: MapViewerProps) {
    const viewerRef = React.useRef<{ cesiumElement: CesiumViewer }>(null);
    const regionRefs = useRef<RefObject<RegionHandle>[]>([]);
    regionRefs.current = props.regions.map(
        (_, i) => regionRefs.current[i] ?? createRef<RegionHandle>()
    );

    const groupsPerTile = useMemo(() => {
        const ret: Map<string, number> = new Map();
        props.regions.forEach((group, index) => {
            group.getTiles().forEach((tile: { id: () => string; }) => {
                ret.set(tile.id(), index);
            });
        });
        return ret
    }, []);


    useEffect(() => {
        setTimeout(() => {
            if (!viewerRef.current) throw new Error("viewerRef not found");
            const eventHandler = new ScreenSpaceEventHandler(viewerRef.current.cesiumElement.scene.canvas);
            eventHandler.setInputAction((movement: { position: Cartesian2 }) => {
                const pickedObject = viewerRef.current?.cesiumElement.scene.pick(movement.position);
                if (!pickedObject) {
                    return
                }
                console.log(`clicked object`, pickedObject);

                const groupIndex = groupsPerTile.get(pickedObject.id);
                if (!groupIndex) {
                    console.log(`no group index found for id ${pickedObject.id}`);
                    return
                }

                const regionRef = regionRefs.current[groupIndex];
                if (!regionRef) {
                    throw new Error(`RegionRef not found at index ${groupIndex}`);
                }

                regionRef.current!.updateTileColor(pickedObject.id, Color.BLUE);
            }, ScreenSpaceEventType.LEFT_UP);
        }, 10)
    }, [groupsPerTile]);

    return (
        <Viewer full ref={viewerRef as MutableRefObject<null>} timeline={false} animation={false}>
            {props.regions.map((tileGroup, index) => (
                <Region
                    key={index}
                    tiles={tileGroup.getTiles()}
                    ref={regionRefs.current[index]}
                    defaultColor={props.defaultColor}
                />
            ))}
        </Viewer>
    );
}


