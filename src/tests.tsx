import {useEffect} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

export default function AppV4() {
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('three-container')!.appendChild(renderer.domElement);

        const {positions, size} = generatePositions(130);
        console.log(size)

        const colors = new Float32Array(size * 3);

        for (let i = 0; i < size; i++) {
            const [r, g, b] = integerToColor(i + 1); // add +1 to avoid black color (background)
            colors[i * 3] = r / 255;
            colors[i * 3 + 1] = g / 255;
            colors[i * 3 + 2] = b / 255; // divide by 255 to get a value between 0 and 1 (required by three.js)
        }

        const pickerGeometry = new THREE.BufferGeometry();
        const displayGeometry = new THREE.BufferGeometry();
        displayGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const hovered = new Float32Array(size).fill(0);
        displayGeometry.setAttribute('hover', new THREE.BufferAttribute(hovered, 1));

        pickerGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pickerGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const commonVertexShader = `
                attribute vec3 color;
                attribute float hover;
                
                varying vec3 vColor;
                varying float vHover;
                
                void main() {
                    vColor = color;
                    vHover = hover;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = 1.0 * (2.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `

        const displayPoints = new THREE.Points(displayGeometry, new THREE.ShaderMaterial({
            vertexShader: commonVertexShader,
            fragmentShader: `
                varying float vHover;
                
                void main() {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                    if (vHover > 0.5) {
                        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                    }
                }`
        }))

        const pickingPoints = new THREE.Points(pickerGeometry, new THREE.ShaderMaterial({
            vertexShader: commonVertexShader,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    gl_FragColor = vec4(vColor, 1.0);
                }`
        }));


        function updateHoverEffect(hoveredId: number) { // oof ça va être lourd
            const hoverArr = displayGeometry.attributes.hover.array;
            for (let i = 0; i < hoverArr.length; i++) {
                hoverArr[i - 1] = i === hoveredId ? 1 : 0;
            }
            displayGeometry.attributes.hover.needsUpdate = true;
        }

        function mouseEvent(event: MouseEvent, fn: (_: number) => void) {
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

            const pickingScene = new THREE.Scene();
            pickingScene.add(pickingPoints);
            pickingScene.add(new THREE.Mesh(      // inner sphere
                new THREE.IcosahedronGeometry(0.999, 20),
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
            fn(originalId)
        }

        window.addEventListener('mousemove', (event: MouseEvent) => {
            mouseEvent(event, updateHoverEffect)
        });

        window.addEventListener('click', (event: MouseEvent) => {
            mouseEvent(event, (id) => {
                console.log(id)
            })
        })

        scene.add(new THREE.AmbientLight(0xffffff, 1));
        scene.add(displayPoints)

        scene.add(new THREE.Mesh(      // inner sphere
            new THREE.IcosahedronGeometry(0.999, 50),
            new THREE.MeshStandardMaterial({
                map: new THREE.TextureLoader().load('/static/earth/3_no_ice_clouds_8k.jpg'),
            })
        ))

        camera.position.z = 5;
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.maxDistance = 4
        controls.minDistance = 1.1


        const animate = () => {
            requestAnimationFrame(animate);
            controls.update()
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            renderer.dispose();
            document.getElementById('three-container')!.innerHTML = '';
        };
    }, []);

    return <div id="three-container" style={{width: '100vw', height: '100vh'}}/>;
};

function integerToColor(id: number): [number, number, number] {
    const r = (id >> 16) & 0xff;
    const g = (id >> 8) & 0xff;
    const b = id & 0xff;

    return [r, g, b];
}

function colorToInteger(rgb: [number, number, number]): number {
    return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
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