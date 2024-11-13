import {describe, expect, test} from "vitest"
import {Coordinates, Triangle} from "../geodesic.ts";

describe('Coordinates', () => {
    test('constructor should assign correct values', () => {
        const coordinates = new Coordinates(1, 2)
        expect(coordinates.lon).toEqual(1)
        expect(coordinates.lat).toEqual(2)
    })

    test('constructor should throw error if longitude is out of bounds', () => {
        expect(() => new Coordinates(181, 0))
            .toThrowError('longitude must be between -180 and 180, got 181')
    })


    test('constructor should throw error if latitude is out of bounds', () => {
        expect(() => new Coordinates(0, 91))
            .toThrowError('latitude must be between 90 and -90, got 91')
    })

    test('toString should return correct string', () => {
        const coordinates = new Coordinates(1, 2)
        expect(coordinates.toString()).toEqual('(1;2)')
    })

    test('constructor should round longitude to nearest bound when applicable', () => {
        const coordinates = new Coordinates(-180.0000000003, 2)
        expect(coordinates.lon).toEqual(-180)
    })

    test('constructor should round latitude to nearest bound when applicable', () => {
        const coordinates = new Coordinates(1, 90.0000000003)
        expect(coordinates.lat).toEqual(90)
    })
})

describe('triangle', () => {
    test('contains should return true if coordinates are inside triangle', () => {
        const triangle = new Triangle(
            new Coordinates(0, 0),
            new Coordinates(1, 0),
            new Coordinates(0, 1)
        )

        expect(triangle.contains(new Coordinates(0.5, 0.5))).toBeTruthy()
        expect(triangle.contains(new Coordinates(0.1, 0.1))).toBeTruthy()
        expect(triangle.contains(new Coordinates(0, 0.5))).toBeTruthy()
    })

    test('contains should return false if coordinates are outside triangle', () => {
        const triangle = new Triangle(
            new Coordinates(0, 0),
            new Coordinates(1, 0),
            new Coordinates(0, 1)
        )

        expect(triangle.contains(new Coordinates(0.5, 1.5))).toBeFalsy()
        expect(triangle.contains(new Coordinates(0.5, -0.5))).toBeFalsy()
    })

    test('contains should return true if coordinates are on the edge of the triangle', () => {
        const triangle = new Triangle(
            new Coordinates(0, 0),
            new Coordinates(1, 0),
            new Coordinates(0, 1)
        )

        expect(triangle.contains(new Coordinates(0, 0))).toBeTruthy()
        expect(triangle.contains(new Coordinates(1, 0))).toBeTruthy()
        expect(triangle.contains(new Coordinates(0, 1))).toBeTruthy()
    })

    test('contains should work even with negative coordinates', () => {
        const triangle = new Triangle(
            new Coordinates(-1, -1),
            new Coordinates(1, -1),
            new Coordinates(0, 1)
        )

        expect(triangle.contains(new Coordinates(0, 0))).toBeTruthy()
        expect(triangle.contains(new Coordinates(1, -1))).toBeTruthy()
        expect(triangle.contains(new Coordinates(-1, -1))).toBeTruthy()
        expect(triangle.contains(new Coordinates(0, -1))).toBeTruthy()
        expect(triangle.contains(new Coordinates(0, -2))).toBeFalsy()
    })
})