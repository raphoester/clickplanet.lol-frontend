import * as THREE from "three"
import {colorToInteger} from "./pickingColors.ts";
import {innerSphere} from "./sphere.ts";

export function setupEventListeners(
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera,
    uniforms: { [key: string]: THREE.IUniform },
    pickingPoints: THREE.Points,
    displayPoints: THREE.Points,
) {
    window.addEventListener('mousemove', (event: MouseEvent) => {
        actOnPick(renderer, camera, event, pickingPoints, id => updateHoverEffect(displayPoints.geometry, id));
    });

    window.addEventListener('click', (event: MouseEvent) => {
        actOnPick(renderer, camera, event, pickingPoints, id => console.log("clicked on", id));
    });

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    });
}

function updateHoverEffect(geometry: THREE.BufferGeometry, hoveredId: number) {
    const size = geometry.attributes.hover.array.length;
    const newHovered = new Float32Array(size).fill(0);
    newHovered[hoveredId - 1] = 1;
    geometry.setAttribute('hover', new THREE.BufferAttribute(newHovered, 1));
    geometry.attributes.hover.needsUpdate = true;
}

const innerSphereGeometry = innerSphere()

function actOnPick(
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera,
    event: MouseEvent,
    pickingPoints: THREE.Points,
    callback: (id: number) => void
) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

    const pickingScene = new THREE.Scene();
    pickingScene.add(pickingPoints);
    pickingScene.add(new THREE.Mesh(
        innerSphereGeometry,
        new THREE.MeshBasicMaterial({ // basic material to avoid lighting
            color: 0xffffff,
        })
    ))

    renderer.setRenderTarget(renderTarget);
    renderer.render(pickingScene, camera);
    renderer.setRenderTarget(null);

    const pixelBuffer = new Uint8Array(4);
    renderer.readRenderTargetPixels(
        renderTarget,
        Math.floor(((mouse.x + 1) / 2) * window.innerWidth),
        Math.floor(((mouse.y + 1) / 2) * window.innerHeight),
        1, 1, pixelBuffer
    )

    const originalId = colorToInteger([pixelBuffer[0], pixelBuffer[1], pixelBuffer[2]]);
    callback(originalId)
}