import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  build: {
    lib: {
      entry: './src/index.js',
      name: 'KunUI',
      fileName: (format) => `kun-ui.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        preserveModules: true, // 🔥 MUY IMPORTANTE
        preserveModulesRoot: 'src', // 🔥 para que no se pierda la estructura de rutas
      },
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
