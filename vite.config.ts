// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'three',
              test: /node_modules[\\/]three/,
            },
            {
              name: 'vendor',
              test: /node_modules[\\/](react|react-dom)/,
            },
          ],
        },
      },
    },
  },
});