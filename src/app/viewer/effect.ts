import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {addDisplayObjects, setupScene} from "./scene.ts";
import {createPoints} from "./points.ts";
import {actOnPick} from "./gpuPicking.ts";
import {regions} from "./atlas.ts";
import {Countries, Country} from "../countries.ts";
import {OwnershipsGetter, TileClicker, UpdatesListener} from "../../backends/backend.ts";
import {getCountryOfVisitor} from "./visitorCountry.ts";
import {Leaderboard} from "./leaderboard.ts";

type Uniforms = {
    zoom: THREE.IUniform,
    resolution: THREE.IUniform
    atlasTexture: THREE.IUniform
    atlasTextureSize: THREE.IUniform
}

const textureLoader = new THREE.TextureLoader();

export function effect(
    tileClicker: TileClicker,
    ownershipsGetter: OwnershipsGetter,
    updatesListener: UpdatesListener,
    updateLeaderboard: (data: { country: Country, tiles: number }[]) => void,
    eventTarget: HTMLElement,
) {
    const {scene, camera, renderer, cleanup} = setupScene();
    const uniforms: Uniforms = {
        zoom: {value: 1.0},
        resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        atlasTexture: {value: textureLoader.load(`/static/countries/atlas.png?ts=${Date.now()}`)},
        atlasTextureSize: {value: new THREE.Vector2(1300, 1232)}, // TODO: retrieve the size from the texture itself
    };

    const {pickingPoints, displayPoints, size} = createPoints(uniforms);
    console.log("running with", size, "points");

    let country: Country = getCountryOfVisitor();

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

    const leaderboard = new Leaderboard(updateLeaderboard)

    eventTarget.addEventListener('click', (event: MouseEvent) => {
        actOnPick_(event, id => {
            const region = regions.get(country.code)
            if (!region) throw new Error(`Region not found for country ${country.code}`)

            tileClicker.clickTile(id, country.code).catch(console.error)

            const arrayIdIndexedOnZero = id - 1
            const arr = displayPoints.geometry.getAttribute('regionVector').array as Float32Array
            arr[arrayIdIndexedOnZero * 4] = region.x
            arr[arrayIdIndexedOnZero * 4 + 1] = region.y
            arr[arrayIdIndexedOnZero * 4 + 2] = region.width
            arr[arrayIdIndexedOnZero * 4 + 3] = region.height

            displayPoints.geometry.getAttribute('regionVector').needsUpdate = true
            // don't register click here or duplicate will be counted from the webhook updates
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
            if (!region) return

            regionVectors[arrayIdIndexedOnZero * 4] = region.x;
            regionVectors[arrayIdIndexedOnZero * 4 + 1] = region.y;
            regionVectors[arrayIdIndexedOnZero * 4 + 2] = region.width;
            regionVectors[arrayIdIndexedOnZero * 4 + 3] = region.height;
        });
        displayPoints.geometry.getAttribute('regionVector').needsUpdate = true;
    }


    // wait for the first render to be done, otherwise some batches get lost
    setTimeout(() => {
        const tilesPerBatch = 10_000
        ownershipsGetter.getCurrentOwnershipsByBatch(
            tilesPerBatch,
            size,
            (ownerships) => {
                leaderboard.registerOwnerships(ownerships)
                updateTilesAccordingToNewBindings(ownerships.bindings)
            },
        ).catch((e) => {
            console.error("Failed to fetch initial ownerships", e)
        })
    }, 1_000)


    const cleanUpdatesListener = updatesListener.listenForUpdates((tile, previousCountry, newCountry) => {
        const country = Countries.get(newCountry)
        if (!country) throw new Error(`Country not found for code ${newCountry}`)

        let oldCountry: Country | undefined = undefined
        if (previousCountry) {
            oldCountry = Countries.get(previousCountry)
            if (!oldCountry) throw new Error(`Country not found for code ${previousCountry}`)
        }

        leaderboard.registerClick(oldCountry, country)
        updateTilesAccordingToNewBindings(new Map([[tile, newCountry]]))
    })


    addDisplayObjects(scene, displayPoints)
    startAnimation(renderer, scene, camera, uniforms);

    return {
        updateCountry: (newCountry: Country) => {
            country = newCountry
        },
        country: country,
        tilesCount: size,
        cleanup: () => {
            // Cleaning up event listeners by replacing the eventTarget with a clone of itself
            // Cannot use removeEventListener because the refs are not fixed (callbacks are created in the effect)
            const newNode = eventTarget.cloneNode(true)
            eventTarget.parentNode?.replaceChild(newNode, eventTarget)
            cleanUpdatesListener()
            cleanup()
        }
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
    // Gives a smooth effect to the action of rotating the sphere with the mouse
    controls.enableDamping = true;

    controls.addEventListener('change', () => {
        controls.autoRotate = camera.zoom === 1;

        // Decreases the speed at which the user can rotate the sphere with the mouse the more he zooms in
        controls.rotateSpeed = (1 / camera.zoom) / 1.5;
    });

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
