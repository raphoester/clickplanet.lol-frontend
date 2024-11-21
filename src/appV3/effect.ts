import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {addDisplayObjects, setupScene} from "./scene.ts";
import {createPoints} from "./points.ts";
import {setupEventListeners} from "./events.ts";
import {regions} from "./atlas.ts";
import {Vector4} from "three";

const regionVectors = Array.from(Object.values(regions)).map(region => {
    return new THREE.Vector4(
        region.x,
        region.y,
        region.width,
        region.height
    );
});

type Uniforms = {
    zoom: THREE.IUniform,
    resolution: THREE.IUniform
    img: THREE.IUniform
    textureSize: THREE.IUniform
}

export function effect() {
    const {scene, camera, renderer, cleanup} = setupScene();

    const uniforms: Uniforms = {
        zoom: {value: 1.0},
        resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        img: {value: new THREE.TextureLoader().load('/static/countries/atlas.png')},
        textureSize: {value: new THREE.Vector2(13000, 12288)} // TODO: retrieve the size from the texture itself
    };

    const {
        pickingPoints,
        displayPoints,
        size
    } = createPoints(uniforms);

    console.log("running with", size, "points");

    const textureIndex = new Float32Array(size * 4);
    for (let i = 0; i < size; i++) {
        const [x, y, z, w] = regionVectors[i % regionVectors.length];
        textureIndex[i * 4] = x;
        textureIndex[i * 4 + 1] = y;
        textureIndex[i * 4 + 2] = z;
        textureIndex[i * 4 + 3] = w;
    }

    displayPoints.geometry.setAttribute('regionVector', new THREE.BufferAttribute(textureIndex, 4));

    setupEventListeners(renderer, camera, uniforms, pickingPoints, displayPoints);

    addDisplayObjects(scene, displayPoints)

    setInterval(() => {
        // re-randomise all the regions

        console.log("re-randomising regions");

        const textureIndex = new Float32Array(size * 4);
        for (let i = 0; i < size; i++) {
            const [x, y, z, w] = regionVectors[Math.floor(Math.random() * regionVectors.length)];
            textureIndex[i * 4] = x;
            textureIndex[i * 4 + 1] = y;
            textureIndex[i * 4 + 2] = z;
            textureIndex[i * 4 + 3] = w;
        }

        displayPoints.geometry.setAttribute('regionVector', new THREE.BufferAttribute(textureIndex, 4));
        displayPoints.geometry.attributes.regionVector.needsUpdate = true;
    }, 1000)

    startAnimation(renderer, scene, camera, uniforms);

    return cleanup
}

function startAnimation(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.OrthographicCamera,
    uniforms: Uniforms,
) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minZoom = 1;
    controls.maxZoom = 50;

    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        updateUniforms(camera, uniforms);
    };

    animate();
}

function updateUniforms(camera: THREE.OrthographicCamera, uniforms: Uniforms) {
    uniforms.zoom.value = camera.zoom;
}