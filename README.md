# ZP Sports - Landing Comercial + Tiendanube

Este proyecto es una web estatica pensada para vender mejor sin backend propio.

Hace cuatro trabajos:
- presenta una seleccion curada de productos Femak y accesorios,
- envia cada CTA retail a Tiendanube con UTM,
- abre un camino separado para mayoristas,
- suma contenido SEO y seccion local de canchas para mejorar confianza y conversion.

Tienda activa: `https://zonapadeloficial.com.ar/`

## Desarrollo local

1. Instalar dependencias:
   `npm install`
2. Levantar el sitio:
   `npm run dev`
3. Generar build:
   `npm run build`

## Datos locales

- Productos: `E:\PROYECTOS\zp-sports\src\data\products.ts`
- Blog: `E:\PROYECTOS\zp-sports\src\data\blogs.ts`
- Canchas: `E:\PROYECTOS\zp-sports\src\data\courts.ts`
- Configuracion comercial: `E:\PROYECTOS\zp-sports\src\data\site.ts`

## Variables opcionales

- `VITE_GA_MEASUREMENT_ID`
  Activa GA4 en la web estatica.
- `VITE_SITE_URL`
  Dominio final del sitio. Se usa para canonical, sitemap, robots y metadatos sociales.
- `VITE_WHATSAPP_NUMBER`
  Reemplaza el numero usado en los enlaces de WhatsApp.
- `VITE_WHOLESALE_FORM_URL`
  URL de Google Forms, Tally u otro formulario mayorista.
- `VITE_WHOLESALE_CATALOG_URL`
  PDF o catalogo mayorista externo.

## Deploy

Este sitio puede subirse a cualquier hosting estatico: Hostinger, Netlify, Vercel, Cloudflare Pages, GitHub Pages.

No requiere:
- backend propio,
- Node.js en produccion,
- base de datos,
- sincronizacion de stock o precios.

## Medicion recomendada

- GA4 en la web estatica con `VITE_GA_MEASUREMENT_ID`
- GA4 y Pixel de Meta dentro de Tiendanube
- UTMs desde esta web hacia Tiendanube
- Search Console y Microsoft Clarity para SEO y mapas de calor

## SEO tecnico incluido

- URLs estaticas para:
  `E:\PROYECTOS\zp-sports\index.html`
  `E:\PROYECTOS\zp-sports\tienda\index.html`
  `E:\PROYECTOS\zp-sports\mayoristas\index.html`
  `E:\PROYECTOS\zp-sports\blog\index.html`
  `E:\PROYECTOS\zp-sports\donde-jugar\index.html`
- Metadatos `title`, `description`, `canonical`, `Open Graph` y `Twitter`
- JSON-LD en runtime para `Organization`, `WebSite`, `FAQPage` y `Article`
- Generacion automatica de:
  `E:\PROYECTOS\zp-sports\public\robots.txt`
  `E:\PROYECTOS\zp-sports\public\sitemap.xml`
  `E:\PROYECTOS\zp-sports\public\llms.txt`
