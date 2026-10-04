import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // Direct output into Jekyll's main asset directories
    outDir: path.resolve(process.cwd(), '../'),
    emptyOutDir: false, // Prevent Vite from wiping out the whole Jekyll root folder
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.jsx'), // Path to your React entry point
      output: {
        entryFileNames: 'assets/js/react-editor.js',
        chunkFileNames: 'assets/js/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/css/react-editor.[ext]';
          }
          return 'assets/[ext]/[name].[ext]';
        }
      }
    }
  }
});
