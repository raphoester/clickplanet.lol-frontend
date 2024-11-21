uniform float zoom;
uniform vec2 resolution;

attribute vec3 color;
varying vec3 vColor;

void main() {
    vColor = color;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (zoom * 3.7) * (resolution.y / 1000.0);
    gl_Position = projectionMatrix * mvPosition;
}