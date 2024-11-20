import * as THREE from "three";
import {Canvas, useThree} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import {MutableRefObject, useEffect, useMemo, useRef} from "react";
import "./AppV2.css"

const textureLoader = new THREE.TextureLoader();

const vertexShader = `
  varying vec2 vUv;
  attribute float id;

  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 1.0 * (2.99 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D globeTexture;
  uniform vec3 pickingColor;

  void main() {
    if (pickingColor.r > 0.0 || pickingColor.g > 0.0 || pickingColor.b > 0.0) {
      gl_FragColor = vec4(pickingColor, 1.0); // Couleur pour le picking
    } else {
      vec4 textureColor = texture2D(globeTexture, vUv);
      gl_FragColor = vec4(textureColor.rgb, 1.0);
    }
  }
`;

function PointsWithPicking({onPick}: { onPick: (_: number) => void }) {
    const ref = useRef<THREE.Points>() as MutableRefObject<THREE.Points>;
    const {gl, size, scene, camera} = useThree();

    const {positions, uv, ids} = useMemo(() => {
        const geometry = new THREE.IcosahedronGeometry(1, 520);
        const pos = geometry.attributes.position.array;
        console.log(pos.length);
        const uv = geometry.attributes.uv.array;

        // Générer des IDs uniques
        const ids = new Float32Array(pos.length / 3);
        for (let i = 0; i < ids.length; i++) ids[i] = i;

        return {
            positions: new Float32Array(pos),
            uv: new Float32Array(uv),
            ids,
        };
    }, []);

    const pickingTexture = useMemo(() => new THREE.WebGLRenderTarget(size.width, size.height), [size]);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / size.width) * 2 - 1;
            mouse.y = -(event.clientY / size.height) * 2 + 1;

            // Render the picking scene
            gl.setRenderTarget(pickingTexture);
            gl.render(scene, camera);
            gl.setRenderTarget(null);

            // Read the pixel under the cursor
            const pixelBuffer = new Uint8Array(4);
            gl.readRenderTargetPixels(
                pickingTexture,
                Math.floor(((mouse.x + 1) / 2) * size.width), // Correct X coordinate
                Math.floor(((mouse.y + 1) / 2) * size.height), // Correct Y coordinate
                1,
                1,
                pixelBuffer
            );

            // Decode ID from color
            const id = pixelBuffer[0] + pixelBuffer[1] * 256 + pixelBuffer[2] * 256 * 256;
            if (id > 0) onPick(id);
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [gl, scene, camera, pickingTexture, size, onPick]);

    return (
        <>
            <mesh>
                <icosahedronGeometry
                    args={[0.99, 520]}
                />
            </mesh>
            <points ref={ref}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={positions}
                        itemSize={3}
                        count={positions.length / 3}
                    />
                    <bufferAttribute
                        attach="attributes-uv"
                        array={uv}
                        itemSize={2}
                        count={uv.length / 2}
                    />
                    <bufferAttribute
                        attach="attributes-id"
                        array={ids}
                        itemSize={1}
                        count={ids.length}
                    />
                </bufferGeometry>
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={{
                        globeTexture: {value: textureLoader.load("static/earth/3_no_ice_clouds_8k.jpg")},
                        pickingColor: {value: new THREE.Color(0, 0, 0)}, // Défaut : pas de picking
                    }}
                    transparent
                />
            </points>
        </>
    );
}

export default function AppV2() {
    const handlePick = (id: number) => {
        console.log("Point clicked, ID:", id);
    };

    return (
        <Canvas camera={{fov: 50, position: [0, 0, 3]}}>
            <ambientLight intensity={1.5}/>
            <color attach="background" args={["#000000"]}/>
            <PointsWithPicking onPick={handlePick}/>
            <OrbitControls
                minDistance={1.09999999}
                maxDistance={4}
            />
        </Canvas>
    );
}