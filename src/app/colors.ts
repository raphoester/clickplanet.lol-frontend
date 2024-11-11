import {
    Color,
    ColorGeometryInstanceAttribute,
    GeometryInstance,
    RectangleGeometry,
    Rectangle,
    Cartesian3
} from "cesium";
import {Tile} from "../model/tiles";

export class ColorMap {
    constructor(private colorMap: Map<string, Color>) {
    }

    public copy(): ColorMap {
        return new ColorMap(new Map(this.colorMap))
    }

    public get(tileId: string): Color {
        return this.colorMap.get(tileId) as Color
    }

    public set(tileId: string, color: Color): void {
        this.colorMap.set(tileId, color)
    }
}

export function tilesToGeometryInstances(tiles: Tile[], colorMap: ColorMap): GeometryInstance[] {
    return tiles.map((tile: Tile) => {
        return new GeometryInstance({
            geometry: new RectangleGeometry({
                rectangle: Rectangle.fromCartesianArray(
                    Cartesian3.fromDegreesArray(tile.getBoundaries().map(coordinates => {
                        return [coordinates.lon, coordinates.lat]
                    }).flat())
                ),
                granularity: 1,
            }),
            attributes: {
                color: ColorGeometryInstanceAttribute.fromColor(colorMap.get(tile.id()) as Color)
            },
            id: tile.id(),
        })
    })
}

export function defaultColorMap(tiles: Tile[], defaultColor: Color): ColorMap {
    const colorMap = new Map<string, Color>()
    tiles.map(tile => {
        colorMap.set(tile.id(), defaultColor)
    })

    return new ColorMap(colorMap)
}