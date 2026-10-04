import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

<<<<<<< HEAD
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    // 1. Local Development Mode Settings (Zero Conflict)
    return {
      plugins: [react()],
      base: './',
      server: {
        port: 5173,
        strictPort: true,
        cors: true, // Tells the browser to allow Port 4000 to use this script
        headers: {
          "Access-Control-Allow-Origin": "*", // Allows any local filename to call the bundle
        }
      },
    };
  } else {
    // 2. GitHub Actions / Jekyll Production Build Settings
    return {
      plugins: [react()],
      base: './',
      build: {
        outDir: path.resolve(process.cwd(), '../'),
        emptyOutDir: false,
        rollupOptions: {
          input: path.resolve(__dirname, 'src/main.jsx'),
          output: {
            entryFileNames: 'assets/js/react-editor.js',
            chunkFileNames: 'assets/js/[name].js',
            assetFileNames: (assetInfo) => {
              if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                return 'assets/css/react-editor.[ext]';
              }
              return 'assets/[ext]/[name].[ext]';
            }
=======
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
>>>>>>> parent of d8dee9a (syncing local and production environments)
          }
          return 'assets/[ext]/[name].[ext]';
        }
      }
    }
  }
<<<<<<< HEAD
});
=======
});
>>>>>>> parent of d8dee9a (syncing local and production environments)
