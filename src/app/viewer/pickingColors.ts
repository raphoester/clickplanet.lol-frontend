export function integerToColor(id: number): [number, number, number] {
    const r = (id >> 16) & 0xff;
    const g = (id >> 8) & 0xff;
    const b = id & 0xff;

    return [r, g, b];
}

export function colorToInteger(rgb: [number, number, number]): number {
    return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
}


