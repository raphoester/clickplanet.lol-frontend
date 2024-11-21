uniform sampler2D img;
uniform vec2 textureSize;

flat in vec4 vRegionVector;
varying float vHover;

void main() {
    // make them round
    vec2 coordinates = gl_PointCoord - vec2(0.5);
    float dist = length(coordinates);
    if (dist > 0.5) discard;

    vec2 uv = gl_PointCoord;

    // normalize the region coordinates to the texture size + flip the y axis
    vec2 normalizedRegionXY = vec2(vRegionVector.x, textureSize.y - vRegionVector.y - vRegionVector.w) / textureSize;
    vec2 normalizedRegionZW = vRegionVector.zw / textureSize;

    // Calculate aspect ratios
    float regionAspect = normalizedRegionZW.x / normalizedRegionZW.y; // Region aspect ratio (width/height)
    float shapeAspect = 1.0; // Shape aspect ratio (always 1.0 for a square)

    // Adjust UVs to preserve aspect ratio and center the image
    vec2 adjustedUV = vec2(0.0); // Adjusted UVs
    if (regionAspect > shapeAspect) {
        // Region is wider than the shape: fit by height
        float scale = shapeAspect / regionAspect;
        adjustedUV.x = (uv.x - 0.5) * scale + 0.5;
        adjustedUV.y = uv.y; // No scaling needed for height
    } else {
        // Region is taller than the shape: fit by width
        float scale = regionAspect / shapeAspect;
        adjustedUV.x = uv.x; // No scaling needed for width
        adjustedUV.y = (uv.y - 0.5) * scale + 0.5;
    }

    // Flip the Y-axis for texture coordinates
    adjustedUV.y = 1.0 - adjustedUV.y;

    // Scale and translate UVs into the atlas region
    vec2 atlasUV = normalizedRegionXY + adjustedUV * normalizedRegionZW;

    // Sample the texture
    gl_FragColor = texture2D(img, atlasUV);
    gl_FragColor.a = 0.4;

    if (vHover > 0.5) {
        gl_FragColor.a = 0.8;
    }
}
