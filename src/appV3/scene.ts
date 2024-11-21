import * as THREE from 'three';
import {innerSphere} from "./sphere.ts";

export function setupScene() {
    const scene = new THREE.Scene();
    const cameraSize = 1;
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
        -cameraSize * aspect, cameraSize * aspect,
        cameraSize, -cameraSize, 0.01, 100
    );
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-container')!.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    const cleanup = () => {
        renderer.dispose();
        document.getElementById('three-container')!.innerHTML = '';
    }

    return {scene, camera, renderer, cleanup};
}

const textureLoader = new THREE.TextureLoader();

export function addDisplayObjects(
    scene: THREE.Scene,
    displayPoints: THREE.Points,
) {
    scene.add(displayPoints);
    scene.add(new THREE.Mesh(
        innerSphere(),
        new THREE.MeshStandardMaterial({
            map: textureLoader.load('/static/earth/3_no_ice_clouds_8k.jpg'),
        })
    ))
}