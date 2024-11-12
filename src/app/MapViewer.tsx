import React, {MutableRefObject, useEffect, useRef} from "react";
import {Viewer} from "resium";
import {
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Cartesian2,
    Viewer as CesiumViewer, Color,
} from "cesium";
import Region, {RegionHandle} from "./Region.tsx";
import {Tile} from "../model/tiles.ts";

type MapViewerProps = {
    tiles: Tile[]
}

export default function MapViewer(props: MapViewerProps) {
    const viewerRef = React.useRef<{ cesiumElement: CesiumViewer }>(null);
    const regionRef = useRef<RegionHandle | null>(null)
    useEffect(() => {
        if (!viewerRef.current) return;

        setTimeout(() => {
            const canvas = viewerRef.current!.cesiumElement.scene.canvas;
            const eventHandler = new ScreenSpaceEventHandler(canvas);

            eventHandler.setInputAction((movement: { position: Cartesian2 }) => {
                const pickedObject = viewerRef.current?.cesiumElement.scene.pick(movement.position);
                if (pickedObject) {
                    regionRef.current!.updateTileColor(pickedObject.id, Color.BLUE);
                }
            }, ScreenSpaceEventType.LEFT_UP);
        }, 10)
    }, [props]);

    return (
        <Viewer full ref={viewerRef as MutableRefObject<null>} timeline={false} animation={false}>
            <Region
                tiles={props.tiles}
                ref={regionRef}
            />
        </Viewer>
    );
}

