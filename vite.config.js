import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 4000,
    open: true,
  },
  build: {
    lib: {
      entry: 'src/lib/index.ts',
      name: 'Sorter',
    }
  }
})
