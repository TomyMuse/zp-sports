import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const siteUrl = env.VITE_SITE_URL || 'https://tudominio.com';
  process.env.VITE_SITE_URL = siteUrl;
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl),
    },
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            tienda: path.resolve(__dirname, 'tienda/index.html'),
            mayoristas: path.resolve(__dirname, 'mayoristas/index.html'),
            blog: path.resolve(__dirname, 'blog/index.html'),
            blogQuePaleta: path.resolve(__dirname, 'blog/que-paleta-femak-elegir/index.html'),
            blog12k24k: path.resolve(__dirname, 'blog/12k-vs-24k/index.html'),
            blogCombos: path.resolve(__dirname, 'blog/combos-para-salir-a-jugar/index.html'),
            dondeJugar: path.resolve(__dirname, 'donde-jugar/index.html'),
          },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': 'http://localhost:4000',
      },
    },
  };
});
