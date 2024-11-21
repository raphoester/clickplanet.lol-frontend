import atlasRegion from "../../../static/countries/atlas.json"

export type Region = {
    x: number,
    y: number,
    width: number,
    height: number,
}

// export dictionary of regions and assign key to code

export const regions: { [code: string]: Region } = atlasRegion
