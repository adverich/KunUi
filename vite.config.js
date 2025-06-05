import { defineConfig } from 'vite'
import path from "path";
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    vueDevTools(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'KunUI',
      formats: ['es'],
      fileName: (format) => `kun-ui.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
        },
        preserveModules: true,  // Mantén esta opción
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    dedupe: ['vue']
  },

  server: {
    host: true,
    cors: true,
    strictPort: false,
    port: 5170,
  },
})
