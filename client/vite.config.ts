import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import {defineConfig} from "vite";
import * as path from "node:path";

export default defineConfig({
    css: {
        postcss: {
            plugins: [tailwindcss(), autoprefixer()],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
