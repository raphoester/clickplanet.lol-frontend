import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";


import {addDisplayObjects, setupScene} from "./scene.ts";
import {createPoints} from "./points.ts";
import {setupEventListeners} from "./events.ts";


export function effect() {
    const {scene, camera, renderer, cleanup} = setupScene();
    const uniforms = {
        zoom: {value: 1.0},
        resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
    };

    const {
        pickingPoints,
        displayPoints,
        size
    } = createPoints(uniforms);
    console.log(size, "points generated")

    setupEventListeners(renderer, camera, uniforms, pickingPoints, displayPoints);
    
    addDisplayObjects(scene, displayPoints)

    startAnimation(renderer, scene, camera, uniforms);

    return cleanup
}

function startAnimation(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    uniforms: { [uniform: string]: THREE.IUniform; },
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

function updateUniforms(camera: THREE.Camera, uniforms: any) {
    uniforms.zoom.value = (camera as any).zoom;
}