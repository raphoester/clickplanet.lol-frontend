import sharp from "sharp";
import * as THREE from "three";

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error('Usage: node computePoints.js <detail> <mapFilePath> [threshold]');
    process.exit(1);
}

const detail = parseInt(args[0]);
const mapFilePath = args[1];
const threshold = args[2] ? parseInt(args[2]) : 128;

loadMap().then(({pixels, width, height}) => {
    const baseCoordinates = generateBaseCoordinates(detail);
    const landCoordinates = filterOutCoordinatesNotOnLand(baseCoordinates, pixels, width, height);
    console.log(JSON.stringify(landCoordinates));
})

type Coordinates = {
    positions: number[];
    uvs: number[];
    length: number;
}

async function loadMap(): Promise<{ pixels: Uint8Array; width: number; height: number }> {
    const {data, info} = await sharp(mapFilePath).raw().toBuffer({resolveWithObject: true});
    return {pixels: data.reverse(), width: info.width, height: info.height};
}

function generateBaseCoordinates(detail: number): Coordinates {
    const geometry = new THREE.IcosahedronGeometry(1, detail);
    const pos = geometry.attributes.position.array;
    const uvs = geometry.attributes.uv.array;

    const retPositions: number[] = [];
    const retUVs: number[] = [];
    const uniqueVertices = new Map<string, { index: number }>();

    for (let i = 0; i < pos.length; i += 3) {
        const x = pos[i].toFixed(6);
        const y = pos[i + 1].toFixed(6);
        const z = pos[i + 2].toFixed(6);

        const key = `${x},${y},${z}`;
        if (!uniqueVertices.has(key)) {
            uniqueVertices.set(key, {index: retPositions.length / 3});
            retPositions.push(pos[i], pos[i + 1], pos[i + 2]);

            const uvIndex = (i / 3) * 2;
            retUVs.push(uvs[uvIndex], uvs[uvIndex + 1]);
        }
    }

    return {
        positions: retPositions,
        uvs: retUVs,
        length: retPositions.length / 3,
    };
}

function filterOutCoordinatesNotOnLand(coordinates: Coordinates, pixels: Uint8Array, width: number, height: number): Coordinates {
    const newPositions = [];
    const newUVs = [];

    for (let i = 0; i < coordinates.positions.length / 3; i++) {
        if (isLand(coordinates.uvs[i * 2], coordinates.uvs[i * 2 + 1], pixels, width, height)) {
            newPositions.push(
                coordinates.positions[i * 3],
                coordinates.positions[i * 3 + 1],
                coordinates.positions[i * 3 + 2]
            );
            newUVs.push(
                coordinates.uvs[i * 2],
                coordinates.uvs[i * 2 + 1]
            );
        }
    }

    coordinates.positions = newPositions;
    coordinates.uvs = newUVs;
    coordinates.length = newPositions.length / 3; // Mettre à jour la longueur

    return {
        positions: Array.from(coordinates.positions),
        uvs: Array.from(coordinates.uvs),
        length: coordinates.length
    }
}

function isLand(u: number, v: number, pixels: Uint8Array, width: number, height: number): boolean {
    const x = Math.floor(u * width);
    const y = Math.floor(v * height);
    const index = (y * width + x) * 3;
    return pixels[index] < threshold
}