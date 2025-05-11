import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import {defineConfig} from "vite";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
})
