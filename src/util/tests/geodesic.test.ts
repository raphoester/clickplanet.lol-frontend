import {describe, expect, test} from "vitest"
import {Coordinates} from "../geodesic.ts";

describe('Coordinates', () => {
    test('constructor should assign correct values', () => {
        const coordinates = new Coordinates(1, 2)
        expect(coordinates.lat).toEqual(1)
        expect(coordinates.lon).toEqual(2)
    })

    test('constructor should throw error if longitude is out of bounds', () => {
        expect(() => new Coordinates(0, 181))
            .toThrowError('longitude must be between -180 and 180, got 181')
    })


    test('constructor should throw error if latitude is out of bounds', () => {
        expect(() => new Coordinates(91, 0))
            .toThrowError('latitude must be between 90 and -90, got 91')
    })

    test('toString should return correct string', () => {
        const coordinates = new Coordinates(1, 2)
        expect(coordinates.toString()).toEqual('(1;2)')
    })

    test('constructor should round longitude to nearest bound when applicable', () => {
        const coordinates = new Coordinates(2, -180.0000000003)
        expect(coordinates.lon).toEqual(-180)
    })

    test('constructor should round latitude to nearest bound when applicable', () => {
        const coordinates = new Coordinates(90.0000000003, 1)
        expect(coordinates.lat).toEqual(90)
    })
})

describe('haversineDistanceTo', () => {
    test('should return 0 when coordinates are the same', () => {
        const coordinates = new Coordinates(1, 2)
        expect(coordinates.haversineDistanceTo(new Coordinates(1, 2))).toEqual(0)
    })

    test('should return correct distance', () => {
        const coordinates = new Coordinates(0, 0)
        const other = new Coordinates(1, 0)
        expect(coordinates.haversineDistanceTo(other)).toBeCloseTo(111.195, 3)
    })

    test('should return correct distance when coordinates are far apart', () => {
        const coordinates = new Coordinates(0, 0)
        const other = new Coordinates(90, 180)
        expect(coordinates.haversineDistanceTo(other)).toBeCloseTo(10007.543398, 5)
    })
})