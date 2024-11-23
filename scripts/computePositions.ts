import {PositionsGenerator} from "../src/app/viewer/positionsComputer";
import sharp from "sharp";

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error('Usage: node computePoints.js <detail> <mapFilePath> [threshold]');
    process.exit(1);
}

const detail = parseInt(args[0]);
const mapFilePath = args[1];
const threshold = args[2] ? parseInt(args[2]) : 128;

const positions = new PositionsGenerator(mapFilePath, threshold).generateBasePositions(detail);

(async function (): Promise<{ pixels: Uint8Array; width: number; height: number }> {
    const {data, info} = await sharp(mapFilePath).raw().toBuffer({resolveWithObject: true});
    return {pixels: data.reverse(), width: info.width, height: info.height};
})().catch((err) => {
    console.error(err);
    process.exit(1);
}).then(({pixels, width, height}) => {

    const newPositions = [];
    const newUVs = [];

    for (let i = 0; i < positions.positions.length / 3; i++) {
        if (isLand(positions.uvs[i * 2], positions.uvs[i * 2 + 1], pixels, width, height)) {
            newPositions.push(
                positions.positions[i * 3],
                positions.positions[i * 3 + 1],
                positions.positions[i * 3 + 2]
            );
            newUVs.push(
                positions.uvs[i * 2],
                positions.uvs[i * 2 + 1]
            );
        }
    }

    positions.positions = newPositions;
    positions.uvs = newUVs;
    positions.length = newPositions.length / 3; // Mettre à jour la longueur

    console.log(JSON.stringify({
        positions: Array.from(positions.positions),
        uvs: Array.from(positions.uvs),
        length: positions.length
    }));
}).catch(err => {
    console.error("err", err);
    process.exit(1);
});

function isLand(u: number, v: number, pixels: Uint8Array, width: number, height: number): boolean {
    const x = Math.floor(u * width);
    const y = Math.floor(v * height);
    const index = (y * width + x) * 3;
    return pixels[index] < 128
}