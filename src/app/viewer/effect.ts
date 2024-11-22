import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {addDisplayObjects, setupScene} from "./scene.ts";
import {createPoints} from "./points.ts";
import {actOnPick} from "./gpuPicking.ts";
import {regions} from "./atlas.ts";
import {Country} from "../countries.ts";
import {OwnershipsGetter, TileClicker, UpdatesListener} from "../../backends/backend.ts";

type Uniforms = {
    zoom: THREE.IUniform,
    resolution: THREE.IUniform
    img: THREE.IUniform
    textureSize: THREE.IUniform
}

export function effect(
    country: Country,
    tileClicker: TileClicker,
    ownershipsGetter: OwnershipsGetter,
    updatesListener: UpdatesListener,
    eventTarget: HTMLElement,
) {
    const {scene, camera, renderer, cleanup} = setupScene();
    const uniforms: Uniforms = {
        zoom: {value: 1.0},
        resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        img: {value: new THREE.TextureLoader().load('/static/countries/atlas.png')},
        textureSize: {value: new THREE.Vector2(13000, 12288)} // TODO: retrieve the size from the texture itself
    };

    const {pickingPoints, displayPoints, size} = createPoints(uniforms);
    console.log("running with", size, "points");

    function actOnPick_(
        event: MouseEvent,
        callback: (id: number) => void,
        nullCallback?: () => void, // if no point is selected
    ) {
        return actOnPick(renderer, camera, event, pickingPoints, callback, nullCallback);
    }

    eventTarget.addEventListener('mousemove', (event: MouseEvent) => {
        actOnPick_(event,
            id => updateHoverEffect(displayPoints.geometry, id),
            () => updateHoverEffect(displayPoints.geometry)
        )
    });

    eventTarget.addEventListener('click', (event: MouseEvent) => {
        actOnPick_(event, id => {
            const region = regions.get(country.code)
            if (!region) throw new Error(`Region not found for country ${country.code}`)

            console.log("clicked on", id)
            tileClicker.clickTile(id, country.code).catch(console.error)

            const arrayIdIndexedOnZero = id - 1
            const arr = displayPoints.geometry.getAttribute('regionVector').array as Float32Array
            arr[arrayIdIndexedOnZero * 4] = region.x
            arr[arrayIdIndexedOnZero * 4 + 1] = region.y
            arr[arrayIdIndexedOnZero * 4 + 2] = region.width
            arr[arrayIdIndexedOnZero * 4 + 3] = region.height

            displayPoints.geometry.getAttribute('regionVector').needsUpdate = true
        });
    });

    eventTarget.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    });

    // 0 means no region is selected, by default it's like that for the whole map
    const generateDefaultRegionVector = (size: number) => {
        return new Float32Array(size * 4).fill(0);
    }

    displayPoints.geometry.setAttribute('regionVector', new THREE.BufferAttribute(generateDefaultRegionVector(size), 4));

    const updateTilesAccordingToNewBindings = (bindings: Map<number, string>) => {
        if (bindings.size == 0) return

        const regionVectors = displayPoints.geometry.getAttribute('regionVector').array as Float32Array;
        bindings.forEach((countryCode, index) => {
            const arrayIdIndexedOnZero = index - 1
            const region = regions.get(countryCode);
            if (!region) throw new Error(`Region not found for country ${countryCode}`);
            regionVectors[arrayIdIndexedOnZero * 4] = region.x;
            regionVectors[arrayIdIndexedOnZero * 4 + 1] = region.y;
            regionVectors[arrayIdIndexedOnZero * 4 + 2] = region.width;
            regionVectors[arrayIdIndexedOnZero * 4 + 3] = region.height;
        });
        displayPoints.geometry.getAttribute('regionVector').needsUpdate = true;
    }

    ownershipsGetter.getCurrentOwnerships().then(ownerships => {
        updateTilesAccordingToNewBindings(ownerships.bindings)
    }).catch(console.error)

    const cleanUpdatesListener = updatesListener.listenForUpdates((tile, countryCode) => {
        console.log("updating tile", tile, "to", countryCode)
        updateTilesAccordingToNewBindings(new Map([[tile, countryCode]]))
    })

    addDisplayObjects(scene, displayPoints)
    startAnimation(renderer, scene, camera, uniforms);

    return () => {
        // Cleaning up event listeners by replacing the eventTarget with a clone of itself
        // Cannot use removeEventListener because the refs are not fixed (callbacks are created in the effect)
        const newNode = eventTarget.cloneNode(true)
        eventTarget.parentNode?.replaceChild(newNode, eventTarget)
        cleanUpdatesListener()
        console.log("cleaning up")
        cleanup()
    }
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
    controls.panSpeed = 0.1;

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

export function updateHoverEffect(geometry: THREE.BufferGeometry, hoveredId?: number) {
    const size = geometry.attributes.hover.array.length;
    const newHovered = new Float32Array(size).fill(0);
    if (hoveredId) {
        const arrayIdIndexedOnZero = hoveredId - 1
        newHovered[arrayIdIndexedOnZero] = 1;
    }

    geometry.setAttribute('hover', new THREE.BufferAttribute(newHovered, 1));
    geometry.attributes.hover.needsUpdate = true;
}
