export function absDiff(a: number, b: number): number {
    if (a < b) {
        return Math.abs(b - a)
    }
    return Math.abs(a - b)
}
