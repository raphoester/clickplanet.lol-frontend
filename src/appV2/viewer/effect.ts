import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {addDisplayObjects, setupScene} from "./scene.ts";
import {createPoints} from "./points.ts";
import {actOnPick} from "./gpuPicking.ts";
import {Region, regions} from "./atlas.ts";
import {Country} from "../../model/countries.ts";

const regionVectors: Region[] = Array.from(regions.values()).map(region => {
    return {
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height
    };
})

type Uniforms = {
    zoom: THREE.IUniform,
    resolution: THREE.IUniform
    img: THREE.IUniform
    textureSize: THREE.IUniform
}

export function effect(country: Country) {
    const {scene, camera, renderer, cleanup} = setupScene();

    const uniforms: Uniforms = {
        zoom: {value: 1.0},
        resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        img: {value: new THREE.TextureLoader().load('/static/countries/atlas.png')},
        textureSize: {value: new THREE.Vector2(13000, 12288)} // TODO: retrieve the size from the texture itself
    };

    const {pickingPoints, displayPoints, size} = createPoints(uniforms);

    console.log("running with", size, "points");

    const randomTextureArray = () => {
        const textureIndex = new Float32Array(size * 4);
        for (let i = 0; i < size; i++) {
            const {x, y, width, height} = regionVectors[Math.floor(Math.random() * regionVectors.length)];
            textureIndex[i * 4] = x;
            textureIndex[i * 4 + 1] = y;
            textureIndex[i * 4 + 2] = width;
            textureIndex[i * 4 + 3] = height;
        }
        return textureIndex;
    }

    const actOnPick_ = (event: MouseEvent, callback: (id: number) => void) => {
        return actOnPick(renderer, camera, event, pickingPoints, callback);
    }

    window.addEventListener('mousemove', (event: MouseEvent) => {
        actOnPick_(event, id => {
            updateHoverEffect(displayPoints.geometry, id)
        })
    });

    window.addEventListener('click', (event: MouseEvent) => {
        actOnPick_(event, id => {
            console.log("clicked on", id)
            const region = regions.get(country.code)
            if (!region) throw new Error(`Region not found for country ${country.code}`)

            const arr = displayPoints.geometry.getAttribute('regionVector').array as Float32Array

            arr[id * 4] = region.x
            arr[id * 4 + 1] = region.y
            arr[id * 4 + 2] = region.width
            arr[id * 4 + 3] = region.height

            displayPoints.geometry.getAttribute('regionVector').needsUpdate = true
        });
    });

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    });

    displayPoints.geometry.setAttribute('regionVector', new THREE.BufferAttribute(randomTextureArray(), 4));

    addDisplayObjects(scene, displayPoints)

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

export function updateHoverEffect(geometry: THREE.BufferGeometry, hoveredId: number) {
    const size = geometry.attributes.hover.array.length;
    const newHovered = new Float32Array(size).fill(0);
    newHovered[hoveredId] = 1;
    geometry.setAttribute('hover', new THREE.BufferAttribute(newHovered, 1));
    geometry.attributes.hover.needsUpdate = true;
}
