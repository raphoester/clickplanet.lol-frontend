import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import cesium from "vite-plugin-cesium";
import glsl from 'vite-plugin-glsl'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), cesium(), glsl()],
})

