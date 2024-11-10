import './App.css'

import {Primitive, Viewer} from "resium";
import {
    Cartesian2,
    Cartesian3,
    Color,
    ColorGeometryInstanceAttribute,
    GeometryInstance,
    PerInstanceColorAppearance,
    PolygonGeometry,
    PolygonHierarchy,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Viewer as CesiumViewer,
} from "cesium";
import React, {MutableRefObject, useEffect} from "react";

const startLat = -90.0;
const endLat = 90.0;
const startLon = -180.0;
const endLon = 180.0;
const step = 3; // Taille de chaque cellule du maillage

const generateColor = (index: number): Color => {
    const r = ((index * 97) % 255) / 255;
    const g = ((index * 67) % 255) / 255;
    const b = ((index * 137) % 255) / 255;
    return new Color(r, g, b, 0.4);
};

type tile = {
    instance: GeometryInstance
}

function getInstances(): Map<string, tile> {
    const tiles = new Map<string, tile>()
    for (let lat = startLat; lat < endLat; lat += step) {
        for (let lon = startLon; lon < endLon; lon += step) {
            const id = `${lat};${lon}`

            const instance = new GeometryInstance({
                geometry: new PolygonGeometry({
                    polygonHierarchy: new PolygonHierarchy(
                        Cartesian3.fromDegreesArray([
                            lon, lat,
                            lon + step, lat,
                            lon + step, lat + step,
                            lon, lat + step
                        ])
                    ),
                }),
                attributes: {
                    color: ColorGeometryInstanceAttribute.fromColor(generateColor(tiles.size)),
                },
                id: id,
            })

            tiles.set(id, {
                instance: instance,
            });
        }
    }
    return tiles
}

const tiles = getInstances()


function App() {
    const viewerRef = React.useRef<{ cesiumElement: CesiumViewer }>(null);

    useEffect(() => {
        console.log("useEffect")
        if (!viewerRef.current) return

        setTimeout(() => {
            const canvas = viewerRef.current?.cesiumElement.scene.canvas;
            if (!canvas) throw new Error("Canvas not found")
            const eventHandler = new ScreenSpaceEventHandler(canvas);

            interface mousePos {
                position: Cartesian2
            }

            eventHandler.setInputAction((movement: mousePos) => {
                const pickedObject = viewerRef.current?.cesiumElement.scene.pick(movement.position);
                if (pickedObject) {
                    console.log("picked object", pickedObject)
                }
            }, ScreenSpaceEventType.LEFT_UP)

        }, 10)
    }, [])

    return (
        <div className="App">
            <Viewer full ref={viewerRef as MutableRefObject<null>} timeline={false} animation={false}>
                <Primitive
                    geometryInstances={Array.from(tiles.values()).map(tile => {
                        return tile.instance
                    })}
                    appearance={new PerInstanceColorAppearance({
                        closed: true,
                        translucent: true
                    })}
                    releaseGeometryInstances={false}
                />
            </Viewer>
        </div>
    );
}

export default App;
