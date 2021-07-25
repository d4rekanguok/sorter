import path from 'path'
import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
    adapter: adapter(),
    vite: {
      resolve: {
        alias: {
          $components: path.resolve('./src/components'),
        }
      }
    }
	},
};

export default config;
