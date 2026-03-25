/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import BlogPost from './components/BlogPost';
import NavSearch from './components/NavSearch';
import RecommendedCourts from './components/RecommendedCourts';
import Store from './components/Store';
import {
  BUYING_GUIDES,
  CHOOSE_STEPS,
  CONTACT_EMAIL,
  FOOTWEAR_GUIDE,
  FAQS,
  PRO_MODELS_2026,
  PROOF_POINTS,
  SITE_URL,
  TECH_EXPLAINERS,
  VALUE_PILLARS,
  WHOLESALE_BENEFITS,
  WHOLESALE_ARGUMENTS,
  WHOLESALE_CATALOG_URL,
  WHOLESALE_FIELDS,
  WHOLESALE_FORM_URL,
  BALANCE_GUIDE,
} from './data/site';
import { fetchBlogPosts, fetchProducts } from './lib/api';
import { initAnalytics, trackEvent } from './lib/analytics';
import { getProductUrl, getStoreUrl, getWhatsAppUrl, withUTM } from './lib/commerce';
import { getBlogPostHref, getSectionPageHref, getStorePageHref, resolveRoute } from './lib/routes';
import { applySeo } from './lib/seo';
import { BlogPost as BlogPostType, Product, ProductSegment } from './types';

type View = 'home' | 'store' | 'blog';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1612534847738-b3f2dc52b914?q=80&w=1600&auto=format&fit=crop';
const DETAIL_IMAGE =
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop';
const HOME_SPOTLIGHTS = [
  {
    label: 'Potencia',
    title: 'Carbono con salida rapida',
    description: 'Modelos para acelerar el punto y sentir una respuesta firme cuando subis el ritmo.',
    href: getStorePageHref('Paletas', 'Potencia'),
  },
  {
    label: 'Control',
    title: 'Mas precision, menos dudas',
    description: 'Opciones equilibradas para defender mejor, leer el punto y jugar con mas margen.',
    href: getStorePageHref('Paletas', 'Control'),
  },
  {
    label: 'Primer equipo',
    title: 'Entrar bien al juego',
    description: 'Paletas nobles y selecciones simples para empezar sin perderte entre demasiadas variantes.',
    href: getStorePageHref('Paletas', 'Primera compra'),
  },
];

const HERO_NOTES = ['Best sellers Femak', 'Ediciones limitadas', 'Asesoramiento directo'];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [storeCategory, setStoreCategory] = useState<string>('Todos');
  const [storeSegment, setStoreSegment] = useState<ProductSegment | 'Todos'>('Todos');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostType[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const [heroCarouselIndex, setHeroCarouselIndex] = useState(0);

  useEffect(() => {
    initAnalytics();

    fetchProducts()
      .then(setProducts)
      .catch(() => setDataError('No se pudieron cargar los productos'));

    fetchBlogPosts()
      .then(setBlogPosts)
      .catch(() => setDataError('No se pudieron cargar las notas'));
  }, []);

  useEffect(() => {
    trackEvent('view_change', { view: currentView });
  }, [currentView]);

  const featuredProducts = useMemo(() => products.filter((product) => product.featured).slice(0, 8), [products]);
  const heroProduct = featuredProducts[0] || products[0] || null;
  const heroProducts = useMemo(() => featuredProducts.slice(0, 5), [featuredProducts]);
  const selectedBlog = blogPosts.find((post) => post.id === selectedBlogId) || null;
  const collectionHighlights = useMemo(
    () => Array.from(new Set(featuredProducts.map((product) => product.collection))).slice(0, 4),
    [featuredProducts],
  );

  useEffect(() => {
    if (heroProducts.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setHeroCarouselIndex((current) => (current + 1) % heroProducts.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, [heroProducts.length]);

  useEffect(() => {
    const route = resolveRoute(window.location.pathname, window.location.search, blogPosts);
    setCurrentView(route.view);
    setSelectedBlogId(route.blogId || null);
    setStoreCategory(route.category);
    setStoreSegment(route.segment);

    if (route.section) {
      window.setTimeout(() => {
        const target = route.section === 'canchas' ? 'canchas' : route.section;
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, [blogPosts]);

  useEffect(() => {
    if (selectedBlog) {
      applySeo({
        title: `${selectedBlog.title} | ZP Sports`,
        description: selectedBlog.excerpt,
        path: getBlogPostHref(selectedBlog),
        image: selectedBlog.image,
        article: selectedBlog,
      });
      return;
    }

    if (currentView === 'store') {
      applySeo({
        title: 'Tienda de Padel | ZP Sports',
        description: 'Paletas, accesorios, pelotas y selecciones por estilo de juego para comprar mas rapido.',
        path: '/tienda/',
      });
      return;
    }

    const path = window.location.pathname;
    if (path.startsWith('/mayoristas')) {
      applySeo({
        title: 'Mayoristas de Padel | ZP Sports',
        description: 'Propuestas para clubes, profesores y revendedores con seguimiento directo y catalogo mayorista.',
        path: '/mayoristas/',
      });
      return;
    }

    if (path.startsWith('/donde-jugar')) {
      applySeo({
        title: 'Donde Jugar Padel En San Miguel | ZP Sports',
        description: 'Canchas recomendadas en San Miguel y una seleccion de productos para salir a jugar mejor equipado.',
        path: '/donde-jugar/',
      });
      return;
    }

    if (path.startsWith('/blog')) {
      applySeo({
        title: 'Blog de Padel | ZP Sports',
        description: 'Guias para elegir paletas, entender 12K vs 24K y comprar con mas criterio.',
        path: '/blog/',
      });
      return;
    }

    applySeo({
      title: 'ZP Sports | Paletas Femak y Equipamiento de Padel',
      description: 'Paletas Femak, accesorios, guias de compra y un canal mayorista pensado para jugadores, clubes y revendedores.',
      path: '/',
    });
  }, [currentView, selectedBlog]);

  const scrollToSection = (sectionId: string) => {
    const targetPath =
      sectionId === 'blog'
        ? getSectionPageHref('blog')
        : sectionId === 'mayoristas'
          ? getSectionPageHref('mayoristas')
          : getSectionPageHref('canchas');
    window.location.assign(new URL(targetPath, SITE_URL).pathname);
  };

  const handleStoreClick = (category: string = 'Todos', segment: ProductSegment | 'Todos' = 'Todos') => {
    window.location.assign(getStorePageHref(category, segment));
  };

  const handleBlogClick = (id: string) => {
    const post = blogPosts.find((item) => item.id === id);
    if (!post) {
      return;
    }
    window.location.assign(getBlogPostHref(post));
  };

  const handleProductSelect = (product: Product) => {
    trackEvent('product_click', {
      surface: 'nav_search',
      product: product.slug,
      category: product.category,
    });
    window.location.assign(getProductUrl(product, 'nav_search'));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <a href="/" className="z-50 flex shrink-0 items-center gap-2 lg:gap-3">
            <img
              src="/logo.png"
              alt="ZP Sports Logo"
              className="h-8 w-8 object-contain lg:h-10 lg:w-10"
              referrerPolicy="no-referrer"
            />
            <span className="flex gap-1 font-headline text-xl font-black italic uppercase tracking-widest lg:gap-2 lg:text-2xl">
              <span className="text-white">ZP</span>
              <span className="text-[#caf300]">Sports</span>
            </span>
          </a>

          <div className="hidden xl:flex flex-1 items-center justify-center gap-8">
            <a href={getStorePageHref('Paletas')} className="font-headline text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:text-[#caf300]">Paletas</a>
            <a href={getStorePageHref('Combos')} className="font-headline text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:text-[#caf300]">Indumentaria</a>
            <a href={getStorePageHref('Pelotas')} className="font-headline text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:text-[#caf300]">Pelotas</a>
            <a href={getSectionPageHref('mayoristas')} className="font-headline text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:text-[#caf300]">Mayoristas</a>
            <a href={getSectionPageHref('blog')} className="font-headline text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:text-[#caf300]">Blog</a>
            <a href={getSectionPageHref('canchas')} className="font-headline text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:text-[#caf300]">Donde jugar</a>
          </div>

          <div className="z-50 flex shrink-0 items-center gap-3 lg:gap-5">
            <NavSearch products={products} onSelectProduct={handleProductSelect} />
            <a href={getSectionPageHref('mayoristas')} className="hidden rounded-full border border-white/15 px-4 py-2 font-headline text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-[#caf300] hover:text-[#caf300] lg:block">Mayorista</a>
            <a href={getStorePageHref('Todos')} className="hidden rounded-full bg-[#0055ff] px-5 py-2.5 font-headline text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0044cc] sm:block">Tienda</a>
            <button className="xl:hidden text-white transition-colors hover:text-[#caf300]" onClick={() => setIsMobileMenuOpen((value) => !value)} aria-label="Abrir menu">
              <span className="material-symbols-outlined text-3xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-white/10 bg-black px-4 py-6 xl:hidden">
            <div className="flex flex-col gap-5">
              <a href={getStorePageHref('Paletas')} className="text-left font-headline text-lg font-bold uppercase tracking-[0.18em] text-white">Paletas</a>
              <a href={getStorePageHref('Combos')} className="text-left font-headline text-lg font-bold uppercase tracking-[0.18em] text-white">Indumentaria</a>
              <a href={getStorePageHref('Pelotas')} className="text-left font-headline text-lg font-bold uppercase tracking-[0.18em] text-white">Pelotas</a>
              <a href={getSectionPageHref('mayoristas')} className="text-left font-headline text-lg font-bold uppercase tracking-[0.18em] text-white">Mayoristas</a>
              <a href={getSectionPageHref('blog')} className="text-left font-headline text-lg font-bold uppercase tracking-[0.18em] text-white">Blog</a>
              <a href={getSectionPageHref('canchas')} className="text-left font-headline text-lg font-bold uppercase tracking-[0.18em] text-white">Donde jugar</a>
              <a href={getStorePageHref('Todos')} className="rounded-full bg-[#0055ff] px-5 py-3 text-center font-headline text-sm font-bold uppercase tracking-[0.18em] text-white">Abrir tienda</a>
            </div>
          </div>
        )}
      </nav>

      {dataError && <div className="bg-red-600 py-2 text-center text-sm text-white">{dataError}</div>}

      {currentView === 'home' ? (
        <>
          <header className="relative overflow-hidden border-b border-white/10 bg-surface-container-lowest pt-24">
            <div className="absolute inset-0">
              <img src={HERO_IMAGE} alt="Jugador de padel en accion" className="h-full w-full object-cover opacity-25" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(202,243,0,0.16),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(0,85,255,0.2),_transparent_30%)]" />
            </div>
            <div className="relative mx-auto grid min-h-[calc(100svh-96px)] w-full max-w-[1440px] items-center gap-12 px-4 py-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,420px)] lg:px-8">
              <div className="max-w-3xl">
                <p className="mb-5 font-label text-xs font-bold uppercase tracking-[0.35em] text-[#caf300]">Femak exclusiva en Zona Padel</p>
                <h1 className="font-headline text-5xl font-black uppercase italic leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-[6.5rem]">
                  Mas criterio.
                  <br />
                  Mas juego.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/72">
                  Paletas Femak y accesorios elegidos para encontrar rapido lo que mejor va con tu juego.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={heroProduct ? getProductUrl(heroProduct, 'hero_primary') : getStoreUrl('hero_primary')}
                    onClick={() =>
                      trackEvent('hero_click', {
                        surface: 'hero_primary',
                        destination: heroProduct ? heroProduct.slug : 'store',
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 bg-[#caf300] px-7 py-3.5 font-headline text-sm font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#b5d900]"
                  >
                    Comprar online
                    <span className="material-symbols-outlined text-base">north_east</span>
                  </a>
                  <button
                    onClick={() => scrollToSection('mayoristas')}
                    className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-3.5 font-headline text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
                  >
                    Mayoristas
                  </button>
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  {BUYING_GUIDES.map((guide) => (
                    <a
                      key={guide.title}
                      href={getStorePageHref('Paletas', guide.segment as ProductSegment)}
                      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm transition-colors hover:border-white/35 hover:text-white"
                    >
                      {guide.title}
                    </a>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-6">
                  {HERO_NOTES.map((note) => (
                    <span
                      key={note}
                      className="font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto h-[580px] w-full max-w-[560px] lg:mr-0">
                <div className="absolute -left-10 top-6 h-28 w-28 rounded-full border border-[#caf300]/25" />
                <div className="absolute -right-8 bottom-16 h-40 w-40 rounded-full border border-white/10" />
                <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_58%)]" />
                {heroProducts.map((product, index) => {
                  const total = heroProducts.length;
                  const relative = (index - heroCarouselIndex + total) % total;
                  const slot = [
                    { x: 0, y: 0, scale: 1, opacity: 1, z: 50 },
                    { x: 132, y: 36, scale: 0.88, opacity: 0.75, z: 40 },
                    { x: 170, y: 92, scale: 0.76, opacity: 0.44, z: 30 },
                    { x: -170, y: 92, scale: 0.76, opacity: 0.44, z: 20 },
                    { x: -132, y: 36, scale: 0.88, opacity: 0.75, z: 35 },
                  ][relative];

                  return (
                    <a
                      key={product.id}
                      href={getProductUrl(product, 'hero_product')}
                      onClick={() => trackEvent('product_click', { surface: 'hero_product', product: product.slug })}
                      className="group absolute left-1/2 top-1/2 block w-[320px] overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition-all duration-700 ease-out"
                      style={{
                        transform: `translate(-50%, -50%) translate(${slot.x}px, ${slot.y}px) scale(${slot.scale})`,
                        opacity: slot.opacity,
                        zIndex: slot.z,
                      }}
                    >
                      <div className="aspect-[4/5] overflow-hidden rounded-[26px] bg-black/30">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="absolute inset-x-8 bottom-8">
                        <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#caf300]">
                          {product.badge || 'Destacado'}
                        </p>
                        <h2 className="mt-2 max-w-xs font-headline text-3xl font-black uppercase italic leading-none text-white">
                          {product.name}
                        </h2>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </header>

          <section className="border-b border-white/10 bg-[#070707]">
            <div className="mx-auto flex max-w-[1440px] flex-wrap gap-x-10 gap-y-4 px-4 py-5 lg:px-8">
              {PROOF_POINTS.map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#caf300]" />
                  <span className="font-label text-xs font-semibold uppercase tracking-[0.18em] text-white/75">{point}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="border-b border-white/10 bg-[linear-gradient(180deg,#070707_0%,#0b0d14_100%)] py-14">
            <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-4 lg:grid-cols-3 lg:px-8">
              {HOME_SPOTLIGHTS.map((spotlight) => (
                <a
                  key={spotlight.title}
                  href={spotlight.href}
                  className="group border-t border-white/15 pt-5 transition-colors hover:border-primary"
                >
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#caf300]">{spotlight.label}</p>
                  <h2 className="mt-3 font-headline text-3xl font-black uppercase italic text-white transition-colors group-hover:text-primary">
                    {spotlight.title}
                  </h2>
                  <p className="mt-3 max-w-sm text-white/60">{spotlight.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-label text-xs font-semibold uppercase tracking-[0.2em] text-white/72 transition-colors group-hover:text-white">
                    Ver seleccion
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </span>
                </a>
              ))}
            </div>
          </section>

          <section className="border-b border-white/10 bg-[#05070d] py-20">
            <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p className="font-label text-xs font-bold uppercase tracking-[0.35em] text-[#caf300]">Para comprar ya</p>
                  <h2 className="mt-4 font-headline text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
                    Destacados
                  </h2>
                  <p className="mt-4 max-w-2xl text-white/62">
                    Los articulos que mas nos piden.
                  </p>
                </div>
                <a
                  href={getStoreUrl('home_featured_strip')}
                  onClick={() => trackEvent('view_store_click', { surface: 'home_featured_strip' })}
                  className="inline-flex items-center gap-2 font-label text-xs font-semibold uppercase tracking-[0.22em] text-white/75 transition-colors hover:text-white"
                >
                  Ver tienda completa
                  <span className="material-symbols-outlined text-base">north_east</span>
                </a>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {featuredProducts.slice(0, 4).map((product) => (
                  <a
                    key={product.id}
                    href={getProductUrl(product, 'home_featured_strip')}
                    onClick={() =>
                      trackEvent('product_click', {
                        surface: 'home_featured_strip',
                        product: product.slug,
                        category: product.category,
                      })
                    }
                    className="group overflow-hidden rounded-[28px] border border-white/10 bg-surface-container-low"
                  >
                    <div className="relative aspect-[4/4.6] overflow-hidden">
                      {product.badge && (
                        <span className="absolute left-4 top-4 z-10 rounded-full bg-[#caf300] px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-black">
                          {product.badge}
                        </span>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                          {product.category}
                        </span>
                        <span className="font-label text-[10px] uppercase tracking-[0.18em] text-white/35">
                          {product.collection}
                        </span>
                      </div>
                      <h3 className="mt-4 font-headline text-2xl font-black uppercase italic text-white">{product.name}</h3>
                      <div className="mt-6 flex items-center justify-between gap-4">
                        <span className="text-sm text-white/60">{product.segment}</span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-headline text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors group-hover:border-primary group-hover:text-primary">
                          Comprar
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest py-24">
            <div className="mx-auto grid w-full max-w-[1440px] gap-16 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,540px)] lg:px-8">
              <div>
                <p className="font-label text-xs font-bold uppercase tracking-[0.35em] text-[#caf300]">Lo mejor de ZP</p>
                <h2 className="mt-4 max-w-2xl font-headline text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
                  Lo que mas sale.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/68">
                  Una seleccion corta, clara y facil de elegir.
                </p>

                <div className="mt-10 space-y-8">
                  {VALUE_PILLARS.map((pillar, index) => (
                    <div key={pillar.title} className="grid gap-3 border-t border-white/10 pt-6 md:grid-cols-[80px_minmax(0,1fr)]">
                      <span className="font-label text-xs font-bold uppercase tracking-[0.3em] text-white/35">0{index + 1}</span>
                      <div>
                        <h3 className="font-headline text-2xl font-black uppercase italic text-white">{pillar.title}</h3>
                        <p className="mt-3 max-w-xl text-white/62">{pillar.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[36px] border border-white/10">
                <img src={DETAIL_IMAGE} alt="Pelotitas y paleta listas para salir a jugar" className="h-full w-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#caf300]">Colecciones activas</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {collectionHighlights.map((collection) => (
                      <span key={collection} className="rounded-full border border-white/15 bg-black/35 px-4 py-2 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                        {collection}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-white/10 bg-[#05070d] py-24">
            <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-8">
              <div className="max-w-3xl">
                <p className="font-label text-xs font-bold uppercase tracking-[0.35em] text-[#caf300]">Segun tu juego</p>
                <h2 className="mt-4 font-headline text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
                  Elegi segun como jugas.
                </h2>
              </div>

              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {BUYING_GUIDES.map((guide) => (
                  <a key={guide.title} href={getStorePageHref('Paletas', guide.segment as ProductSegment)} className="group border-t border-white/15 pt-6 text-left">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#caf300]">{guide.badge}</p>
                    <h3 className="mt-4 font-headline text-3xl font-black uppercase italic text-white transition-colors group-hover:text-primary">{guide.title}</h3>
                    <p className="mt-4 max-w-sm text-white/62">{guide.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-label text-xs font-semibold uppercase tracking-[0.22em] text-white/75 transition-colors group-hover:text-white">
                      Ver seleccion
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-white/10 bg-[#080808] py-24">
            <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-8">
              <div className="max-w-3xl">
                <p className="font-label text-xs font-bold uppercase tracking-[0.35em] text-[#caf300]">Guia tecnica</p>
                <h2 className="mt-4 font-headline text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
                  Guia tecnica
                </h2>
                <p className="mt-5 max-w-2xl text-lg text-white/64">
                  Nucleo, carbono, forma y balance: lo importante es lo que vas a sentir en cancha.
                </p>
              </div>

              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {TECH_EXPLAINERS.map((item) => (
                  <div key={item.title} className="rounded-[28px] border border-white/10 bg-surface-container-low p-6">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.28em] text-[#caf300]">{item.eyebrow}</p>
                    <h3 className="mt-4 font-headline text-3xl font-black uppercase italic text-white">{item.title}</h3>
                    <p className="mt-4 text-white/66">{item.description}</p>
                    <p className="mt-5 border-t border-white/10 pt-4 text-sm text-white/52">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-3">
                {BALANCE_GUIDE.map((item) => (
                  <div key={item.title} className="border-t border-white/12 pt-5">
                    <h3 className="font-headline text-2xl font-black uppercase italic text-white">{item.title}</h3>
                    <p className="mt-3 max-w-sm text-white/60">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest py-24">
            <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p className="font-label text-xs font-bold uppercase tracking-[0.35em] text-[#caf300]">Lo mas pedido</p>
                  <h2 className="mt-4 font-headline text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
                    Mas buscados
                  </h2>
                </div>
                <a
                  href={getStoreUrl('featured_header')}
                  onClick={() => trackEvent('view_store_click', { surface: 'featured_header' })}
                  className="inline-flex items-center gap-2 font-label text-xs font-semibold uppercase tracking-[0.22em] text-white/75 transition-colors hover:text-white"
                >
                  Ver tienda completa
                  <span className="material-symbols-outlined text-base">north_east</span>
                </a>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {featuredProducts.map((product) => (
                  <a
                    key={product.id}
                    href={getProductUrl(product, 'featured_grid')}
                    onClick={() =>
                      trackEvent('product_click', {
                        surface: 'featured_grid',
                        product: product.slug,
                        category: product.category,
                      })
                    }
                    className="group overflow-hidden rounded-[28px] border border-white/10 bg-surface-container-low"
                  >
                    <div className="relative aspect-[4/4.8] overflow-hidden">
                      {product.badge && (
                        <span className="absolute left-4 top-4 z-10 rounded-full bg-[#caf300] px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-black">
                          {product.badge}
                        </span>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">{product.category}</span>
                        <span className="font-label text-[10px] uppercase tracking-[0.18em] text-white/35">{product.collection}</span>
                      </div>
                      <h3 className="mt-4 font-headline text-2xl font-black uppercase italic text-white">{product.name}</h3>
                      <div className="mt-6 flex items-center justify-between gap-4">
                        <span className="text-sm text-white/60">{product.segment}</span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-headline text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors group-hover:border-primary group-hover:text-primary">
                          Comprar
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="border-y border-white/10 bg-[#071018] py-24">
            <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] lg:px-8">
              <div>
                <p className="font-label text-xs font-bold uppercase tracking-[0.35em] text-[#caf300]">Salud y superficie</p>
                <h2 className="mt-4 font-headline text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
                  Salud y superficie
                </h2>
                <p className="mt-5 max-w-2xl text-lg text-white/64">
                  Peso, balance, dureza y suela cambian la sensacion y tambien la exigencia sobre brazo y hombro.
                </p>

                <div className="mt-10 rounded-[28px] border border-white/10 bg-black/20 p-6">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.28em] text-[#caf300]">Dato clave</p>
                  <p className="mt-4 text-lg leading-relaxed text-white/78">
                    Una pala con balance alto puede sentirse mas exigente que otra mas pesada con el peso cerca del puno.
                    En muchas molestias articulares, el balance pesa mas que el numero total de gramos.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {FOOTWEAR_GUIDE.map((item) => (
                  <div key={item.sole} className="rounded-[24px] border border-white/10 bg-surface-container-low p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-headline text-2xl font-black uppercase italic text-white">{item.sole}</h3>
                      <span className="font-label text-[10px] uppercase tracking-[0.22em] text-primary">{item.court}</span>
                    </div>
                    <p className="mt-4 text-white/62">{item.benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-b border-white/10 bg-[#050505] py-24">
            <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-8">
              <div className="max-w-3xl">
                <p className="font-label text-xs font-bold uppercase tracking-[0.35em] text-[#caf300]">Como elegir tu pala</p>
                <h2 className="mt-4 font-headline text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
                  Como elegir tu pala
                </h2>
                <p className="mt-5 max-w-2xl text-lg text-white/64">
                  Con tres preguntas ya filtras mucho mejor.
                </p>
              </div>

              <div className="mt-12 grid gap-8 lg:grid-cols-3">
                {CHOOSE_STEPS.map((item) => (
                  <div key={item.step} className="border-t border-white/12 pt-5">
                    <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-[#caf300]">{item.step}</p>
                    <h3 className="mt-4 font-headline text-3xl font-black uppercase italic text-white">{item.title}</h3>
                    <p className="mt-4 max-w-sm text-white/62">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest py-24">
            <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-8">
              <div className="max-w-3xl">
                <p className="font-label text-xs font-bold uppercase tracking-[0.35em] text-[#caf300]">Radar 2026</p>
                <h2 className="mt-4 font-headline text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
                  Radar 2026
                </h2>
                <p className="mt-5 max-w-2xl text-lg text-white/64">
                  Referencias para entender que se esta buscando hoy.
                </p>
              </div>

              <div className="mt-12 grid gap-5 lg:grid-cols-5">
                {PRO_MODELS_2026.map((model) => (
                  <div key={model.name} className="border-t border-white/12 pt-5">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.26em] text-[#caf300]">{model.player}</p>
                    <h3 className="mt-3 font-headline text-2xl font-black uppercase italic text-white">{model.name}</h3>
                    <p className="mt-3 text-white/58">{model.profile}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="mayoristas" className="border-y border-white/10 bg-[#050505] py-24">
            <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,460px)] lg:px-8">
              <div>
                <p className="font-label text-xs font-bold uppercase tracking-[0.35em] text-[#caf300]">Camino mayorista</p>
                <h2 className="mt-4 max-w-3xl font-headline text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
                  Mayoristas
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/68">
                  Precios y atencion para clubes, profes y revendedores.
                </p>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                  {WHOLESALE_BENEFITS.map((benefit) => (
                    <div key={benefit} className="border-t border-white/10 pt-5">
                      <p className="text-sm leading-relaxed text-white/72">{benefit}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                  {WHOLESALE_ARGUMENTS.map((item) => (
                    <div key={item.title} className="rounded-[24px] border border-white/10 bg-surface-container-low p-5">
                      <h3 className="font-headline text-2xl font-black uppercase italic text-white">{item.title}</h3>
                      <p className="mt-3 text-white/60">{item.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Datos que conviene pedir</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {WHOLESALE_FIELDS.map((field) => (
                      <span key={field} className="rounded-full border border-white/12 px-4 py-2 font-label text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-[#caf300]">Accion directa</p>
                <h3 className="mt-4 font-headline text-3xl font-black uppercase italic text-white">Hablemos</h3>
                <p className="mt-4 text-white/66">
                  Dejanos tus datos o escribinos por WhatsApp y te respondemos rapido.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  <a
                    href={withUTM(WHOLESALE_FORM_URL, { content: 'wholesale_form' })}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('wholesale_click', { surface: 'wholesale_form' })}
                    className="inline-flex items-center justify-center gap-2 bg-[#caf300] px-6 py-3 font-headline text-sm font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#b5d900]"
                  >
                    Completar formulario
                    <span className="material-symbols-outlined text-base">north_east</span>
                  </a>
                  <a
                    href={getWhatsAppUrl('wholesale_whatsapp', 'Hola, quiero informacion mayorista para Femak y linea exclusiva ZP.')}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('whatsapp_click', { surface: 'wholesale_whatsapp' })}
                    className="inline-flex items-center justify-center gap-2 border border-white/20 px-6 py-3 font-headline text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
                  >
                    Hablar por WhatsApp
                  </a>
                  <a
                    href={WHOLESALE_CATALOG_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('wholesale_click', { surface: 'wholesale_catalog' })}
                    className="inline-flex items-center justify-center gap-2 border border-white/20 px-6 py-3 font-headline text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
                  >
                    Descargar catalogo PDF
                  </a>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">Contacto directo</p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="mt-3 block text-lg text-white transition-colors hover:text-[#caf300]">{CONTACT_EMAIL}</a>
                </div>
              </div>
            </div>
          </section>

          <section id="blog" className="bg-surface-container-lowest py-24">
            <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p className="font-label text-xs font-bold uppercase tracking-[0.35em] text-[#caf300]">Para elegir mejor</p>
                  <h2 className="mt-4 font-headline text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
                    Blog
                  </h2>
                </div>
                <button onClick={() => handleStoreClick('Todos')} className="inline-flex items-center gap-2 font-label text-xs font-semibold uppercase tracking-[0.22em] text-white/75 transition-colors hover:text-white">
                  Ver tienda ZP
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>

              <div className="mt-12 grid gap-8 md:grid-cols-3">
                {blogPosts.map((post) => (
                  <a key={post.id} href={getBlogPostHref(post)} className="group cursor-pointer">
                    <div className="aspect-[16/10] overflow-hidden rounded-[28px] border border-white/10 bg-surface-container-low">
                      <img src={post.image} alt={post.title} className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" referrerPolicy="no-referrer" />
                    </div>
                    <p className="mt-5 font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#caf300]">{post.category}</p>
                    <h3 className="mt-3 font-headline text-2xl font-black uppercase italic text-white transition-colors group-hover:text-primary">{post.title}</h3>
                    <p className="mt-4 max-w-sm text-white/62">{post.excerpt}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <RecommendedCourts />
          <section className="border-t border-white/10 bg-[#040404] py-24">
            <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-8">
              <div className="max-w-3xl">
                <p className="font-label text-xs font-bold uppercase tracking-[0.35em] text-[#caf300]">FAQ comercial</p>
                <h2 className="mt-4 font-headline text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
                  Lo que mas nos preguntan.
                </h2>
              </div>

              <div className="mt-12 grid gap-4">
                {FAQS.map((item) => (
                  <details key={item.question} className="group rounded-[24px] border border-white/10 bg-surface-container-low px-6 py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-headline text-xl font-bold uppercase italic text-white">
                      {item.question}
                      <span className="material-symbols-outlined text-white/50 transition-transform group-open:rotate-45">add</span>
                    </summary>
                    <p className="pt-4 text-white/68">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : currentView === 'blog' && selectedBlog ? (
        <BlogPost
          post={selectedBlog}
          onBack={() => {
            window.location.assign(getSectionPageHref('blog'));
          }}
        />
      ) : (
        <Store products={products} initialCategory={storeCategory} initialSegment={storeSegment} />
      )}

      <a
        href={getWhatsAppUrl('sticky_whatsapp', 'Hola, quiero que me recomienden una paleta o una propuesta mayorista.')}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackEvent('whatsapp_click', { surface: 'sticky_whatsapp' })}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-5 py-3 font-headline text-xs font-bold uppercase tracking-[0.18em] text-black shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.02]"
      >
        <span className="material-symbols-outlined text-base">chat</span>
        WhatsApp
      </a>

      <footer className="border-t border-white/10 bg-black pb-14 pt-16">
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))] lg:px-8">
          <div>
            <p className="font-headline text-2xl font-black uppercase italic text-white">ZP Sports</p>
            <p className="mt-4 max-w-sm text-white/58">
              Paletas, accesorios y asesoramiento para comprar mejor desde el primer click.
            </p>
          </div>

          <div>
            <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-white/40">Retail</p>
            <div className="mt-5 flex flex-col gap-3">
              <a href={getStorePageHref('Paletas')} className="text-left text-white/72 transition-colors hover:text-white">Paletas</a>
              <a href={getStorePageHref('Combos')} className="text-left text-white/72 transition-colors hover:text-white">Indumentaria</a>
              <a href={getStoreUrl('footer_store')} className="text-white/72 transition-colors hover:text-white">Ver tienda completa</a>
            </div>
          </div>

          <div>
            <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-white/40">Mayorista</p>
            <div className="mt-5 flex flex-col gap-3">
              <a href={getSectionPageHref('mayoristas')} className="text-left text-white/72 transition-colors hover:text-white">Formulario y condiciones</a>
              <a href={WHOLESALE_CATALOG_URL} target="_blank" rel="noreferrer" className="text-white/72 transition-colors hover:text-white">Catalogo PDF</a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-white/72 transition-colors hover:text-white">{CONTACT_EMAIL}</a>
            </div>
          </div>

          <div>
            <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-white/40">Contenido</p>
            <div className="mt-5 flex flex-col gap-3">
              <a href={getSectionPageHref('blog')} className="text-left text-white/72 transition-colors hover:text-white">Blog de compra</a>
              <a href={getSectionPageHref('canchas')} className="text-left text-white/72 transition-colors hover:text-white">Donde jugar</a>
              <a href={getWhatsAppUrl('footer_whatsapp', 'Hola, quiero asesoramiento para comprar una paleta.')} target="_blank" rel="noreferrer" className="text-white/72 transition-colors hover:text-white">WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 flex w-full max-w-[1440px] flex-col gap-3 border-t border-white/10 px-4 pt-8 text-xs uppercase tracking-[0.2em] text-white/35 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <span>Zona Padel Oficial</span>
          <span>Paletas Femak, asesoramiento y mayoristas</span>
        </div>
      </footer>
    </div>
  );
}
