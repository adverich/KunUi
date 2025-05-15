import { defineConfig } from 'vite'
import path from "path";
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'KunUI',
      formats: ['es'],
      fileName: (format) => `kun-ui.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        preserveModules: true,  // Mantén esta opción
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
      cssCodeSplit: true,
    },
  },
  resolve: {
    dedupe: ['vue']
  },

  server: {
    host: true,
    cors: true,
    strictPort: false,
    port: 5175,
  },
})
