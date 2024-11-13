import {Coordinates3, finabocciSphere, midPoint, onSphereTriangle} from "../cartesian.ts";

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

    test('midPoint simple', () => {
        const a = new Coordinates3(1, 1, 1)
        const b = new Coordinates3(2, 2, 2)
        const mid = midPoint(a, b)
        expect(mid.x).toEqual(1.5)
        expect(mid.y).toEqual(1.5)
        expect(mid.z).toEqual(1.5)
    })

    test('midPoint complex', () => {
        const a = new Coordinates3(30, -51, 24)
        const b = new Coordinates3(-5, 48, -19)
        const mid = midPoint(a, b)
        expect(mid.x).toEqual(12.5)
        expect(mid.y).toEqual(-1.5)
        expect(mid.z).toEqual(2.5)
    })

    test('onSphereTriangle subdivide simple', () => {
        const a = new Coordinates3(0, 1, 0).normalize()
        const b = new Coordinates3(1, 0, 0).normalize()
        const c = new Coordinates3(0, 0, 1).normalize()
        const triangle = new onSphereTriangle(a, b, c)
        const subdivisions = triangle.subdivide(1)

        expect(subdivisions).toHaveLength(4)
        const normalized05 = 0.70710678

        expect(subdivisions[0].a.x).toBeCloseTo(0, 5)
        expect(subdivisions[0].a.y).toBeCloseTo(1, 5)
        expect(subdivisions[0].a.z).toBeCloseTo(0, 5)

        expect(subdivisions[0].b.x).toBeCloseTo(normalized05, 5)
        expect(subdivisions[0].b.y).toBeCloseTo(normalized05, 5)
        expect(subdivisions[0].b.z).toBeCloseTo(0, 5)

        expect(subdivisions[0].c.x).toBeCloseTo(0, 5)
        expect(subdivisions[0].c.y).toBeCloseTo(normalized05, 5)
        expect(subdivisions[0].c.z).toBeCloseTo(normalized05, 5)

        expect(subdivisions[1].a.x).toBeCloseTo(1, 5)
        expect(subdivisions[1].a.y).toBeCloseTo(0, 5)
        expect(subdivisions[1].a.z).toBeCloseTo(0, 5)

        expect(subdivisions[1].b.x).toBeCloseTo(normalized05, 5)
        expect(subdivisions[1].b.y).toBeCloseTo(0, 5)
        expect(subdivisions[1].b.z).toBeCloseTo(normalized05, 5)

        expect(subdivisions[1].c.x).toBeCloseTo(normalized05, 5)
        expect(subdivisions[1].c.y).toBeCloseTo(normalized05, 5)
        expect(subdivisions[1].c.z).toBeCloseTo(0, 5)

        // SubTriangle 3
        expect(subdivisions[2].a.x).toBeCloseTo(0, 5)
        expect(subdivisions[2].a.y).toBeCloseTo(0, 5)
        expect(subdivisions[2].a.z).toBeCloseTo(1, 5)

        expect(subdivisions[2].b.x).toBeCloseTo(0, 5)
        expect(subdivisions[2].b.y).toBeCloseTo(normalized05, 5)
        expect(subdivisions[2].b.z).toBeCloseTo(normalized05, 5)

        expect(subdivisions[2].c.x).toBeCloseTo(normalized05, 5)
        expect(subdivisions[2].c.y).toBeCloseTo(0, 5)
        expect(subdivisions[2].c.z).toBeCloseTo(normalized05, 5)

        // SubTriangle 4
        expect(subdivisions[3].a.x).toBeCloseTo(normalized05, 5)
        expect(subdivisions[3].a.y).toBeCloseTo(normalized05, 5)
        expect(subdivisions[3].a.z).toBeCloseTo(0, 5)

        expect(subdivisions[3].b.x).toBeCloseTo(normalized05, 5)
        expect(subdivisions[3].b.y).toBeCloseTo(0, 5)
        expect(subdivisions[3].b.z).toBeCloseTo(normalized05, 5)

        expect(subdivisions[3].c.x).toBeCloseTo(0, 5)
        expect(subdivisions[3].c.y).toBeCloseTo(normalized05, 5)
        expect(subdivisions[3].c.z).toBeCloseTo(normalized05, 5)
    })
})

describe('fibonacciSphere normalized check', () => {
    test('100 points', () => {
        const points = finabocciSphere(100)
        expect(points).toHaveLength(100)
        points.forEach(point => expect(point.isNormalized()).toBeTruthy())
    })

    test('1000 points', () => {
        const points = finabocciSphere(1000)
        expect(points).toHaveLength(1000)
        points.forEach(point => expect(point.isNormalized()).toBeTruthy())
    })

    test('10000 points', () => {
        const points = finabocciSphere(10000)
        expect(points).toHaveLength(10000)
        points.forEach(point => expect(point.isNormalized()).toBeTruthy())
    })
})