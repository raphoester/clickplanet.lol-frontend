import {
    ForwardedRef,
    forwardRef,
    useContext,
    useImperativeHandle, useMemo,
    useState,
} from "react";
import {Primitive} from "resium";
import {
    BlendingState,
    Cartesian3,
    Color, ColorGeometryInstanceAttribute,
    GeometryInstance, Material,
    MaterialAppearance,
    PerInstanceColorAppearance,
    Rectangle,
    RectangleGeometry
} from "cesium";
import {countryContext} from "./CountryProvider.tsx";
import {Tile} from "../model/tiles.ts";
import {Country} from "../model/countries.ts";
import {TileClicker} from "../backends/backend.ts";

type RegionProps = {
    tiles: Tile[]
    defaultColor: number
    onRegionReady?: () => void
    tileClicker: TileClicker
}

export interface RegionHandle {
    handleTileClick(tileId: string): void;
}

export default forwardRef<RegionHandle, RegionProps>(
    function Region(
        props: RegionProps,
        ref: ForwardedRef<RegionHandle>
    ) {
        const [countriesPerTiles, setCountriesPerTiles] =
            useState<Map<string, Country | null>>(new Map(props.tiles.map(tile => [tile.id(), null])))
        const tilesPerId = useMemo(() =>
            new Map(props.tiles.map(tile => [tile.id(), tile])), [props.tiles])

        const {country} = useContext(countryContext)
        useImperativeHandle(ref, () => ({
            handleTileClick: (tileId: string) => {
                countriesPerTiles.set(tileId, country)
                setCountriesPerTiles(new Map(countriesPerTiles))
                props.tileClicker.clickTile(tileId, country.code).catch(console.error)
            },
        }))

        const [territories, tilesWithoutCountry] = useMemo(() => {
            const territories = new Map<Country, Tile[]>()
            const tilesWithoutCountry: Tile[] = []
            countriesPerTiles.forEach((country, tileId) => {
                const tile = tilesPerId.get(tileId)
                if (!tile) return

                if (!country) {
                    tilesWithoutCountry.push(tile)
                    return
                }

                const territory = territories.get(country) || []
                territory.push(tile)
                territories.set(country, territory)
            })
            return [territories, tilesWithoutCountry]
        }, [countriesPerTiles, tilesPerId]);

        return <>
            {(tilesWithoutCountry.length > 0) && <Primitive
                onReady={() => {
                    props.onRegionReady?.()
                }}
                geometryInstances={tilesToGeometryInstances(tilesWithoutCountry,
                    Color.WHITE.withAlpha(0.5),
                )}
                appearance={
                    new PerInstanceColorAppearance({
                        flat: true,
                        translucent: true,
                    })
                }
                releaseGeometryInstances={true}
            />}

            {Array.from(territories).map(([country, tiles]) =>
                <Primitive
                    key={country.code}
                    geometryInstances={tilesToGeometryInstances(tiles)}
                    appearance={new MaterialAppearance({
                        renderState: {
                            blending: BlendingState.ALPHA_BLEND
                        },
                        material: new Material({
                            fabric: {
                                type: "Image",
                                uniforms: {
                                    image: "/static/countries/1x1/" + country.code + ".svg",
                                    color: new Color(1, 1, 1, 0.5),
                                }
                            }
                        }),
                        closed: true,
                        translucent: true,
                    })}
                    releaseGeometryInstances={true}
                />
            )}
        </>
    }
)

function tilesToGeometryInstances(tiles: Tile[], color?: Color): GeometryInstance[] {
    const attrs = color ? {
        color: ColorGeometryInstanceAttribute.fromColor(color)
    } : {}

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
            attributes: attrs,
            id: tile.id(),
        })
    })
}
