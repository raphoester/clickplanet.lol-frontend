import './App.css'

import {Primitive, Viewer} from "resium";
import {
    Cartesian2, Cartesian3,
    Color,
    ColorGeometryInstanceAttribute,
    GeometryInstance, PerInstanceColorAppearance,
    PolygonGeometry,
    PolygonHierarchy,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Viewer as CesiumViewer,
} from "cesium";
import React, {MutableRefObject, useEffect, useState} from "react";
import {generateTilesGrid, Tile} from "./tile.ts";

function tilesGridToGeometryInstances(tiles: Tile[], colorMap: Map<string, Color>): GeometryInstance[] {
    return tiles.map((tile: Tile) => {
        return new GeometryInstance({
            geometry: new PolygonGeometry({
                polygonHierarchy: new PolygonHierarchy(
                    Cartesian3.fromDegreesArray(tile.getBoundaries().map(coordinates => {
                        return [coordinates.lon, coordinates.lat]
                    }).flat())
                ),
            }),
            attributes: {
                color: ColorGeometryInstanceAttribute.fromColor(colorMap.get(tile.id()) as Color)
            },
            id: tile.id(),
        })
    })

}

function defaultColorMap(tiles: Tile[], defaultColor: Color): Map<string, Color> {
    const colorMap = new Map<string, Color>()
    tiles.map(tile => {
        colorMap.set(tile.id(), defaultColor)
    })
    return colorMap
}

const tiles = generateTilesGrid(500, 4)
console.log(tiles.length)

export default function AppTwo() {
    const [colorMap, setColorMap] = useState<Map<string, Color>>(defaultColorMap(tiles, Color.fromRandom({alpha: 0.7})))

    const start = performance.now()
    const geometryInstances = tilesGridToGeometryInstances(tiles, colorMap)
    const end = performance.now()

    console.log(`geometryInstances generated in ${end - start}ms`)
    
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
                    colorMap.set(pickedObject.id, Color.BLUE)
                    setColorMap(new Map(colorMap))
                }
            }, ScreenSpaceEventType.LEFT_UP)
        }, 5)
    }, [viewerRef, colorMap])

    return (
        <div className="App">
            <Viewer full ref={viewerRef as MutableRefObject<null>} timeline={false} animation={false}>
                <Primitive
                    geometryInstances={geometryInstances}
                    appearance={new PerInstanceColorAppearance({
                        closed: true,
                        translucent: true
                    })}
                />
            </Viewer>
        </div>
    );
}

