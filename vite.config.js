import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Permite abrir la app en la red local (probar en el celular con la misma wifi)
    host: true,
  },
})
