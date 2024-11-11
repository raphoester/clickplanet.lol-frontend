import React, {MutableRefObject, useEffect} from "react";
import {Primitive, Viewer} from "resium";
import {
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Cartesian2,
    Viewer as CesiumViewer,
    PerInstanceColorAppearance,
    GeometryInstance
} from "cesium";

interface MapViewerProps {
    geometryInstances: GeometryInstance[];
    onTileClick: (tileId: string) => void;
}

export default function MapViewer(props: MapViewerProps) {
    const viewerRef = React.useRef<{ cesiumElement: CesiumViewer }>(null);

    useEffect(() => {
        if (!viewerRef.current) return;

        setTimeout(() => {
            const canvas = viewerRef.current!.cesiumElement.scene.canvas;
            const eventHandler = new ScreenSpaceEventHandler(canvas);

            eventHandler.setInputAction((movement: { position: Cartesian2 }) => {
                const pickedObject = viewerRef.current?.cesiumElement.scene.pick(movement.position);
                if (pickedObject) {
                    props.onTileClick(pickedObject.id);
                }
            }, ScreenSpaceEventType.LEFT_UP);
            return () => eventHandler.destroy();
        }, 10)
    }, [props, props.onTileClick]);

    return (
        <Viewer full ref={viewerRef as MutableRefObject<null>} timeline={false} animation={false}>
            <Primitive
                geometryInstances={props.geometryInstances}
                appearance={new PerInstanceColorAppearance({
                    closed: true,
                    translucent: true
                })}
                releaseGeometryInstances={true}
            />
        </Viewer>
    );
}

