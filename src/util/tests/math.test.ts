import {describe, expect, test} from "vitest"
import {absDiff} from "../math.ts";

describe('absDiff', () => {
    test('should return positive difference', () => {
        expect(absDiff(1, 2)).toEqual(1)
    })

    test('should return positive difference when a is greater', () => {
        expect(absDiff(2, 1)).toEqual(1)
    })

    test('should return 0 when a equals b', () => {
        expect(absDiff(1, 1)).toEqual(0)
    })

    test('should return positive difference when a is negative', () => {
        expect(absDiff(-1, 1)).toEqual(2)
    })

    test('should return positive difference when b is negative', () => {
        expect(absDiff(1, -1)).toEqual(2)
    })
})