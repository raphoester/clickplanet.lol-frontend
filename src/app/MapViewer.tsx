import React, {createRef, MutableRefObject, RefObject, useEffect, useMemo, useRef} from "react";
import {Viewer} from "resium";
import {
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Cartesian2,
    Viewer as CesiumViewer, Color,
} from "cesium";

import Region, {RegionHandle} from "./Region.tsx";
import {TileGroup} from "../model/tiles.ts";
import Hover, {HoverHandle} from "./Hover.tsx";

type MapViewerProps = {
    tileGroups: TileGroup[]
}


export default function MapViewer(props: MapViewerProps) {
    const viewerRef = React.useRef<{ cesiumElement: CesiumViewer }>(null);
    const regionRefs = useRef<RefObject<RegionHandle>[]>([]);
    regionRefs.current = props.tileGroups.map(
        (_, i) => regionRefs.current[i] ?? createRef<RegionHandle>()
    );

    const hoverRef = useRef<HoverHandle>(null);

    const groupsPerTile = useMemo(() => {
        const ret: Map<string, number> = new Map();
        props.tileGroups.forEach((group, index) => {
            group.forEach(tile => {
                ret.set(tile.id(), index);
            });
        });
        return ret
    }, [props.tileGroups]);


    useEffect(() => {
        setTimeout(() => {
            if (!viewerRef.current) return;
            const eventHandler = new ScreenSpaceEventHandler(viewerRef.current.cesiumElement.scene.canvas);

            eventHandler.setInputAction((movement: { endPosition: Cartesian2 }) => {
                const pickedObject = viewerRef.current!.cesiumElement.scene.pick(movement.endPosition);
                if (!pickedObject) return

                const groupIndex = groupsPerTile.get(pickedObject.id);
                if (!groupIndex) return

                const tile = regionRefs.current[groupIndex]!.current!.getTile(pickedObject.id);
                hoverRef.current!.updateHoverTile(tile!);
            }, ScreenSpaceEventType.MOUSE_MOVE);

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
    }, [groupsPerTile, props]);

    return (
        <Viewer full ref={viewerRef as MutableRefObject<null>} timeline={false} animation={false}>
            <Hover ref={hoverRef}/>
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


