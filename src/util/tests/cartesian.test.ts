import {Coordinates3, fibonacciSphere} from "../cartesian.ts";

import {describe, expect, test} from "vitest"

describe('Coordinates3', () => {
    test('constructor', () => {
        const coordinates = new Coordinates3(1, 2, 3)
        expect(coordinates.x).toEqual(1)
        expect(coordinates.y).toEqual(2)
        expect(coordinates.z).toEqual(3)
    })

    test('normalize', () => {
        const coordinates = new Coordinates3(1, 2, 3)
        const normalized = coordinates.normalize()
        expect(normalized.x).toBeCloseTo(0.267261, 5)
        expect(normalized.y).toBeCloseTo(0.534522, 5)
        expect(normalized.z).toBeCloseTo(0.801783, 5)
    })

    test('toGeodesic simple', () => {
        const coordinates = new Coordinates3(0, 0, 1)
        const geodesic = coordinates.toGeodesic()
        expect(geodesic.lon).toEqual(0)
        expect(geodesic.lat).toEqual(90)
    })

    test('toGeodesic complex', () => {
        const coordinates = new Coordinates3(0.5, 0.5, 0.5).normalize()
        const geodesic = coordinates.toGeodesic()
        expect(geodesic.lon).toBeCloseTo(45, 5)
        expect(geodesic.lat).toBeCloseTo(35.26438968275465, 5)
    })
})

describe('fibonacciSphere normalized check', () => {
    test('100 points', () => {
        const points = fibonacciSphere(100)
        expect(points).toHaveLength(100)
        points.forEach(point => expect(point.isNormalized()).toBeTruthy())
    })

    test('1000 points', () => {
        const points = fibonacciSphere(1000)
        expect(points).toHaveLength(1000)
        points.forEach(point => expect(point.isNormalized()).toBeTruthy())
    })

    test('10000 points', () => {
        const points = fibonacciSphere(10000)
        expect(points).toHaveLength(10000)
        points.forEach(point => expect(point.isNormalized()).toBeTruthy())
    })
})