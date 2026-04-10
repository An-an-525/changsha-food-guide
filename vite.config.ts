import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';

// Generate a build timestamp hash to bust browser cache completely
const buildHash = new Date().getTime().toString(36);

// https://vite.dev/config/
export default defineConfig({
  base: '/changsha-food-guide/',
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].${buildHash}.js`,
        chunkFileNames: `assets/[name].${buildHash}.js`,
        assetFileNames: `assets/[name].${buildHash}.[ext]`
      }
    }
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }), 
    tsconfigPaths()
  ],
})
