import {
    ForwardedRef,
    forwardRef,
    useContext, useEffect,
    useImperativeHandle, useRef, useState,
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
import {TileClicker} from "../backends/backend.ts";

type RegionProps = {
    tiles: Tile[]
    defaultColor: number
    onRegionReady?: () => void
    tileClicker: TileClicker
    index: number
}

export interface RegionHandle {
    handleTileClick(tileId: string): void;
}

export default forwardRef<RegionHandle, RegionProps>(
    function Region(
        props: RegionProps,
        ref: ForwardedRef<RegionHandle>
    ) {
        const [tilesPerId, setTilesPerId] = useState(() => new Map<string, Tile>())

        useEffect(() => {
            const tilesPerId = new Map<string, Tile>()
            props.tiles.forEach((tile) => {
                tilesPerId.set(tile.id(), tile)
            })
            setTilesPerId(tilesPerId)
        }, [props.tiles]);

        const {country} = useContext(countryContext)

        useImperativeHandle(ref, () => ({
            handleTileClick: (tileId: string) => {
                console.log("clicked on", props.index)
                const tile = tilesPerId.get(tileId)
                if (!tile) throw new Error(`Tile with id ${tileId} not found`)

                setTilesPerId((tilesPerId) => {
                    const newTilesPerId = new Map(tilesPerId)
                    newTilesPerId.delete(tileId)
                    newTilesPerId.set(tileId, tile.setCountryCode(country.code))
                    return newTilesPerId
                })

                // call backend to save tile state
                props.tileClicker.clickTile(tileId, country.code).catch(console.error)
            },
        }))

        const [mainLoadingFinished, setMainLoadingFinished] = useState(false)
        const territoriesLoaded = useRef(0)
        const territoriesCount = useRef(0)

        useEffect(() => {
            if (mainLoadingFinished) return
            if (territoriesCount.current != 0
                && territoriesCount.current === territoriesLoaded.current) {
                setMainLoadingFinished(true)
            }
        }, [mainLoadingFinished, setMainLoadingFinished])

        return <> {
            function () {
                const perCountry = new Map<string | undefined, Tile[]>()
                tilesPerId.forEach(tile => {
                    const countryId = tile.getCountryCode()
                    perCountry.set(countryId, (perCountry.get(countryId) ?? []).concat(tile))
                })

                territoriesCount.current = perCountry.size


                return Array.from(perCountry.entries()).map(([countryId, tiles]) => {
                    return <Primitive
                        onReady={() => {
                            territoriesLoaded.current++
                        }}
                        key={countryId}
                        geometryInstances={
                            tilesToGeometryInstances(tiles,
                                (countryId) ? undefined : Color.fromRandom({alpha: 0.5})
                            )
                        }
                        appearance={
                            countryId ? new MaterialAppearance({
                                renderState: {
                                    blending: BlendingState.ALPHA_BLEND
                                },
                                material: new Material({
                                    fabric: {
                                        type: "Image",
                                        uniforms: {
                                            image: "/static/countries/1x1/" + countryId + ".svg",
                                            color: new Color(1, 1, 1, 0.5),
                                        }
                                    }
                                }),
                                closed: true,
                                translucent: true,
                            }) : new PerInstanceColorAppearance({
                                flat: true,
                                translucent: true,
                            })
                        }
                        releaseGeometryInstances={true}
                    />
                })
            }()
        }
        </>
    }
)

function tilesToGeometryInstances(tiles: Tile[], color?: Color): GeometryInstance[] {
    const attrs = color ? {color: ColorGeometryInstanceAttribute.fromColor(color)} : {}
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
