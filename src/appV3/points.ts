import * as THREE from "three";

// @ts-expect-error typescript does not know about vite-plugin-glsl
import displayVertex from "./shaders/display/vertex.glsl"
// @ts-expect-error typescript does not know about vite-plugin-glsl
import displayFragment from "./shaders/display/fragment.glsl"

// @ts-expect-error typescript does not know about vite-plugin-glsl
import pickerVertex from "./shaders/picker/vertex.glsl"
// @ts-expect-error typescript does not know about vite-plugin-glsl
import pickerFragment from "./shaders/picker/fragment.glsl"
import {integerToColor} from "./pickingColors.ts";
import {IUniform} from "three";

export function createPoints(uniforms: { [uniform: string]: IUniform; }) {
    const {positions, size} = generatePositions(130);
    const colors = generateColors(size);

    const pickerGeometry = new THREE.BufferGeometry();
    const displayGeometry = new THREE.BufferGeometry();

    pickerGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pickerGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const hoveredArr = new Float32Array(size).fill(0);
    displayGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    displayGeometry.setAttribute('hover', new THREE.BufferAttribute(hoveredArr, 1));

    const displayPoints = new THREE.Points(displayGeometry, new THREE.ShaderMaterial({
        transparent: true,
        uniforms,
        vertexShader: displayVertex,
        fragmentShader: displayFragment,
    }));

    const pickingPoints = new THREE.Points(pickerGeometry, new THREE.ShaderMaterial({
        uniforms,
        vertexShader: pickerVertex,
        fragmentShader: pickerFragment,
    }));

    return {
        displayPoints,
        pickingPoints,
        size
    };
}

function generateColors(size: number): Float32Array {
    const colors = new Float32Array(size * 3);
    for (let i = 0; i < size; i++) {
        const [r, g, b] = integerToColor(i + 1);
        colors[i * 3] = r / 255;
        colors[i * 3 + 1] = g / 255;
        colors[i * 3 + 2] = b / 255;
    }
    return colors;
}

function generatePositions(detail: number) {
    if (detail < 1) detail = 1;
    if (detail > 520) detail = 520;

    const geometry = new THREE.IcosahedronGeometry(1, detail);
    const pos = geometry.attributes.position.array;
    const uv = geometry.attributes.uv.array;

    const ids = new Float32Array(pos.length / 3);
    for (let i = 0; i < ids.length; i++) ids[i] = i + 1; // +1 to avoid black color (background)

    return {
        positions: new Float32Array(pos),
        uv: new Float32Array(uv),
        ids: ids,
        size: pos.length / 3,
    };
}