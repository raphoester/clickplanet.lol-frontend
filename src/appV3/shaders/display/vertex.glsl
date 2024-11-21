uniform float zoom;
uniform vec2 resolution;

attribute float hover;
attribute vec4 regionVector;

varying float vHover;
flat out vec4 vRegionVector;

void main() {
    vHover = hover;
    vRegionVector = regionVector;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (zoom * 3.7) * (resolution.y / 1000.0);
    gl_Position = projectionMatrix * mvPosition;
}