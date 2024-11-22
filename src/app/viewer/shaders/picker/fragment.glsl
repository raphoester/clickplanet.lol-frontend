uniform sampler2D specularTexture;

varying vec3 vColor;
varying vec2 vUv;

void main() {
    float altitude = 1.0 - texture2D(specularTexture, vUv).r;
    if (altitude < 0.5) {
        discard;
    }

    gl_FragColor = vec4(vColor, 1.0);
}