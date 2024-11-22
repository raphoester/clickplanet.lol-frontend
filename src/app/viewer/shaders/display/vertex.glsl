uniform float zoom;
uniform vec2 resolution;
uniform sampler2D specularTexture;

attribute float hover;
attribute vec4 regionVector;

varying vec2 vUv;
varying float vHover;
flat out vec4 vRegionVector;

void main() {
    vUv = uv;

    vHover = hover;
    vRegionVector = regionVector;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (zoom * 1.5) * (resolution.y / 1000.0);
    gl_Position = projectionMatrix * mvPosition;
}