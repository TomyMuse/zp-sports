import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(process.cwd());
const publicDir = path.join(rootDir, 'public');
const siteUrl = (process.env.VITE_SITE_URL || 'https://tudominio.com').replace(/\/+$/, '');

const pages = [
  '/',
  '/tienda/',
  '/mayoristas/',
  '/blog/',
  '/blog/que-paleta-femak-elegir/',
  '/blog/12k-vs-24k/',
  '/blog/combos-para-salir-a-jugar/',
  '/donde-jugar/',
];

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const robots = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page}</loc>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const llms = `# ZP Sports

> ZP Sports es una landing comercial enfocada en paletas Femak, accesorios de padel, contenido de compra y consultas mayoristas.

## Paginas clave
- ${siteUrl}/
- ${siteUrl}/tienda/
- ${siteUrl}/mayoristas/
- ${siteUrl}/blog/
- ${siteUrl}/donde-jugar/

## Temas principales
- paletas de padel Femak
- comparativas 12K vs 24K
- canal mayorista para clubes, profesores y revendedores
- recomendaciones para jugar en San Miguel
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8');
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(publicDir, 'llms.txt'), llms, 'utf8');

if (siteUrl.includes('tudominio.com')) {
  console.warn('[generate-seo] VITE_SITE_URL no esta configurada. Actualizala antes de deploy para canonical, sitemap y robots.');
}
