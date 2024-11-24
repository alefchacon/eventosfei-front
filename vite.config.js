import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/eventosfei-front/', // Important! Must match your repo name exactly
  server: {
    port: 3000,
  },
})
