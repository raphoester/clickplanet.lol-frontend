uniform sampler2D img;
uniform vec4 atlasRegion;
uniform vec2 textureSize;

varying float vCountryIndex;
varying float vHover;


void main() {
    // make them round
    vec2 coordinates = gl_PointCoord - vec2(0.5);
    float dist = length(coordinates);
    if (dist > 0.5) discard;

    vec2 uv = gl_PointCoord;

    // normalize the region coordinates to the texture size + flip the y axis
    vec2 normalizedRegionXY = vec2(atlasRegion.x, textureSize.y - atlasRegion.y - atlasRegion.w) / textureSize;
    vec2 normalizedRegionZW = atlasRegion.zw / textureSize;

    vec2 atlasUV = normalizedRegionXY + vec2(uv.x, 1.0 - uv.y) * normalizedRegionZW;
    gl_FragColor = texture2D(img, atlasUV);
    gl_FragColor.a = 0.13;

    //    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.03); // half transparent white (default color for later)

    if (vHover > 0.5) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.3);
    }
}