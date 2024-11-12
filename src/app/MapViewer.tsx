import React, {createRef, MutableRefObject, RefObject, useEffect, useRef} from "react";
import {Viewer} from "resium";
import {
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Cartesian2,
    Viewer as CesiumViewer, Color,
} from "cesium";

import Region, {RegionHandle} from "./Region.tsx";
import {TileGroup} from "../model/tiles.ts";

type MapViewerProps = {
    tileGroups: TileGroup[]
}

export default function MapViewer(props: MapViewerProps) {
    const viewerRef = React.useRef<{ cesiumElement: CesiumViewer }>(null);
    const regionRefs = useRef<RefObject<RegionHandle>[]>([]);
    regionRefs.current = props.tileGroups.map(
        (_, i) => regionRefs.current[i] ?? createRef<RegionHandle>()
    );

    useEffect(() => {
        if (!viewerRef.current) return;

        setTimeout(() => {
            const canvas = viewerRef.current!.cesiumElement.scene.canvas;
            const eventHandler = new ScreenSpaceEventHandler(canvas);

            eventHandler.setInputAction((movement: { position: Cartesian2 }) => {
                const pickedObject = viewerRef.current?.cesiumElement.scene.pick(movement.position);
                if (!pickedObject) {
                    return
                }

                // TODO: check if search is not too long
                const tileGroup = regionRefs.current!.find(
                    (regionRef, index) => {
                        if (!regionRef) {
                            throw new Error(`RegionRef not found at index ${index}`);
                        }
                        return regionRef.current!.hasTile(pickedObject.id);
                    }
                );
                tileGroup!.current!.updateTileColor(pickedObject.id, Color.BLUE);
            }, ScreenSpaceEventType.LEFT_UP);
        }, 10)
    }, [props]);

    return (
        <Viewer full ref={viewerRef as MutableRefObject<null>} timeline={false} animation={false}>
            {props.tileGroups.map((tileGroup, index) => (
                <Region
                    key={index}
                    tiles={tileGroup}
                    ref={regionRefs.current[index]}
                />
            ))}
        </Viewer>
    );
}

