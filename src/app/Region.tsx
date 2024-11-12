import {Primitive} from "resium";
import {Color, PerInstanceColorAppearance} from "cesium";
import {Tile} from "../model/tiles.ts";
import {ColorMap, defaultColorMap, tilesToGeometryInstances} from "./colors.ts";
import {ForwardedRef, forwardRef, useImperativeHandle, useState} from "react";

type RegionProps = {
    tiles: Tile[];
}

export interface RegionHandle {
    updateTileColor(tileId: string, color: Color): void;
}

export default forwardRef<RegionHandle, RegionProps>(
    function Region(
        props: RegionProps,
        ref: ForwardedRef<RegionHandle>
    ) {
        const [colorMap, setColorMap] = useState<ColorMap>(defaultColorMap(props.tiles));
        const geometryInstances = tilesToGeometryInstances(props.tiles, colorMap);

        useImperativeHandle(ref, () => ({
            updateTileColor: (tileId: string, color: Color) => {
                colorMap.set(tileId, color);
                setColorMap(colorMap.copy());
            }
        }))

        return (
            <Primitive
                geometryInstances={geometryInstances}
                appearance={new PerInstanceColorAppearance({
                    closed: true,
                    translucent: true
                })}
                releaseGeometryInstances={true}
            />
        )
    }
)

