import {Primitive} from "resium";
import {ForwardedRef, forwardRef, useImperativeHandle, useState} from "react";
import {Tile} from "../model/tiles.ts";
import {
    Cartesian3,
    Color, ColorGeometryInstanceAttribute,
    GeometryInstance, PerInstanceColorAppearance,
    Rectangle,
    RectangleGeometry
} from "cesium";

export interface HoverHandle {
    updateHoverTile(tile: Tile): void;
}

export default forwardRef<HoverHandle>(
    function Hover(
        _: unknown,
        ref: ForwardedRef<HoverHandle>
    ) {

        const [tileCoordinates, setTileCoordinates] = useState<number[] | null>(null);

        useImperativeHandle(ref, () => ({
            updateHoverTile(newTile: Tile) {
                const newCoordinates = newTile.getBoundaries().map(coordinates => {
                    return [coordinates.lon, coordinates.lat]
                }).flat();
                setTileCoordinates(newCoordinates);
                //TODO: find a way to re-render (currently no update)
            },
        }));

        if (!tileCoordinates) {
            return null;
        }

        return (
            <Primitive
                geometryInstances={[
                    new GeometryInstance({
                        geometry: new RectangleGeometry({
                            rectangle: Rectangle.fromCartesianArray(
                                Cartesian3.fromDegreesArray(tileCoordinates!)
                            ),
                            granularity: 1,
                        }),
                        attributes: {
                            color: ColorGeometryInstanceAttribute.fromColor(Color.RED.withAlpha(0.5))
                        },
                        id: tileCoordinates[0].toString() + "-" + tileCoordinates[1].toString() + "-hover",
                    })
                ]}
                appearance={new PerInstanceColorAppearance({
                    closed: true,
                    translucent: true,
                })}
                // releaseGeometryInstances={true}
            />
        )
    }
)