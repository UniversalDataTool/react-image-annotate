import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import markdownRawPlugin from 'vite-raw-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    markdownRawPlugin({
      fileRegex: /\.md$/
    }),
  ],
  base: './',
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib.js'),
      formats: ['es'],
    },
    rollupOptions: {
      external: [ 'react', 'react-dom' ]
    }
  }
});