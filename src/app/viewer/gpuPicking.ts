import * as THREE from "three"
import {colorToInteger} from "./pickingColors.ts";
import {innerSphere} from "./sphere.ts";

const innerSphereGeometry = innerSphere()

const skipId1 = colorToInteger([255, 255, 255])
const skipId2 = colorToInteger([0, 0, 0])

function shouldSkipID(id: number): boolean {
    return id === skipId1 || id === skipId2
} // skip clicks on black surfaces (background, inner sphere)

export function actOnPick(
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera,
    event: MouseEvent,
    pickingPoints: THREE.Points,
    callback: (id: number) => void,
    nullIdCallback = () => {
    }
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
    if (shouldSkipID(originalId)) {
        nullIdCallback()
        return
    }
    callback(originalId - 1) // subtract -1 to account for the fact that the id is 1-indexed
}