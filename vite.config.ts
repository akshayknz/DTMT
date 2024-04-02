import { defineConfig } from 'vite'
import { VitePWA } from "vite-plugin-pwa";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: {
      esmExternals: true,
    },
  },
  plugins: [react(), VitePWA({
    registerType: "autoUpdate",
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
    manifest: {
      "name": "Deckhouse",
      "short_name": "DH",
      "icons": [
        {
          "src": "/maskable_icon_x512.png",
          "sizes": "200x200",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "/android-chrome-144x144.png",
          "sizes": "144x144",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "/android-chrome-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "/android-chrome-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "/android-chrome-256x256.png",
          "sizes": "256x256",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "/android-chrome-384x384.png",
          "sizes": "384x384",
          "type": "image/png",
          "purpose": "any"
        }
      ],
      "theme_color": "#ffffff",
      "background_color": "#ffffff",
      "description": "DTMT",
      "display": "standalone",
      "scope": "/",
      "start_url": "https://dtmt-project.web.app/"
    }
  })]
})
