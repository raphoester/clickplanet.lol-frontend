uniform float zoom;
uniform vec2 resolution;

attribute vec3 color;
varying vec3 vColor;
varying vec2 vUv;

void main() {
    vColor = color;
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (zoom * 1.5) * (resolution.y / 1000.0);
    gl_Position = projectionMatrix * mvPosition;
}