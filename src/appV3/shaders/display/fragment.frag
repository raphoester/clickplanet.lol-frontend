varying float vCountryIndex;
varying float vHover;

void main() {
    // make them round
    vec2 coordinates = gl_PointCoord - vec2(0.5);
    float dist = length(coordinates);
    if (dist > 0.5) discard;

    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.03);
    if (vHover > 0.5) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.3);
    }
}