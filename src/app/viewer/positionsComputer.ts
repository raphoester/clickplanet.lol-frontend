import * as THREE from "three";
import sharp from "sharp";

export class PositionsGenerator {
    private readonly threshold: number;

    constructor(
        private readonly specularMap: string,
        threshold: number
    ) {
        if (threshold < 0) threshold = 0;
        if (threshold > 255) threshold = 255;

        this.threshold = threshold;
    }

    private async loadMap(): Promise<{ pixels: Uint8Array; width: number; height: number }> {
        const {data, info} = await sharp(this.specularMap).raw().toBuffer({resolveWithObject: true});
        return {pixels: data, width: info.width, height: info.height};
    }

    private isLand(u: number, v: number, pixels: Uint8Array, width: number, height: number): boolean {
        const x = Math.floor(u * width);
        const y = Math.floor(v * height);
        const index = (y * width + x) * 4; // Assuming RGBA
        return pixels[index] < this.threshold;
    }

    public generateBasePositions(detail: number) {
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

    public async generatePositions(
        detail: number,
    ) {
        if (detail < 0) detail = 0;

        const {pixels, width, height} = await this.loadMap();
        const {positions, uvs} = this.generateBasePositions(detail);

        const filteredPositions: number[] = [];
        const filteredUVs: number[] = [];

        for (let i = 0; i < positions.length; i++) {
            const posI = i * 3;
            const vuI = i * 2;

            const x = positions[posI];
            const y = positions[posI + 1];
            const z = positions[posI + 2];
            const u = uvs[vuI];
            const v = uvs[vuI + 1];

            if (this.isLand(u, v, pixels, width, height)) {
                filteredPositions.push(x, y, z);
                filteredUVs.push(u, v);
            }
        }

        // return {
        //     positions: filteredPositions,
        //     uvs: filteredUVs,
        //     length: filteredPositions.length / 3,
        // }

        return {
            positions: positions,
            uvs: uvs,
            length: positions.length / 3,
        };
    }
}
