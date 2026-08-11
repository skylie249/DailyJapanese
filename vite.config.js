import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'HaruBite',
        short_name: '하루 한입',
        description: '하루에 한 입씩 부담 없이 씹어먹는 언어',
        theme_color: '#FDFBF7',
        background_color: '#FDFBF7',
        display: 'standalone',
        icons: [
          {
            src: 'Gemini_Generated_Image_192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'Gemini_Generated_Image_512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
