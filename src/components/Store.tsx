import React, { useEffect, useMemo, useState } from 'react';
import { STORE_CATEGORIES, STORE_SEGMENTS } from '../data/site';
import { getProductUrl, getStoreUrl } from '../lib/commerce';
import { trackEvent } from '../lib/analytics';
import { Product, ProductSegment } from '../types';

interface StoreProps {
  products: Product[];
  initialCategory?: string;
  initialSegment?: ProductSegment | 'Todos';
}

export default function Store({ products, initialCategory, initialSegment = 'Todos' }: StoreProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'Todos');
  const [activeSegment, setActiveSegment] = useState<ProductSegment | 'Todos'>(initialSegment);

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    setActiveSegment(initialSegment);
  }, [initialSegment]);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
        const matchesSegment = activeSegment === 'Todos' || product.segment === activeSegment;
        return matchesCategory && matchesSegment;
      }),
    [activeCategory, activeSegment, products],
  );

  return (
    <div className="min-h-screen bg-surface-container-lowest pt-32 pb-24">
      <div className="container mx-auto px-8 max-w-[1400px]">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            <span className="font-label text-secondary uppercase tracking-[0.25em] text-xs font-bold">Tienda ZP</span>
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface uppercase italic tracking-tighter mt-3 mb-4">
              Elegi sin dar vueltas
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              Paletas y accesorios ordenados para encontrar rapido lo tuyo.
            </p>
          </div>

          <a
            href={getStoreUrl('store_header')}
            onClick={() => trackEvent('view_store_click', { surface: 'store_header' })}
            className="inline-flex items-center gap-2 self-start xl:self-auto bg-[#0055ff] hover:bg-[#0044cc] text-white px-6 py-3 rounded-full font-headline font-bold text-sm uppercase tracking-wider transition-colors"
          >
            Ver tienda completa
            <span className="material-symbols-outlined text-base">north_east</span>
          </a>
        </div>

        <div className="space-y-6 mb-12">
          <div className="flex flex-wrap gap-3 border-b border-white/10 pb-6">
            {STORE_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`font-headline font-bold uppercase tracking-widest text-sm px-5 py-2 rounded-full transition-all ${
                  activeCategory === category
                    ? 'bg-secondary text-black'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {STORE_SEGMENTS.map((segment) => (
              <button
                key={segment}
                onClick={() => setActiveSegment(segment)}
                className={`font-label font-semibold uppercase tracking-[0.18em] text-[11px] px-4 py-2 rounded-full border transition-all ${
                  activeSegment === segment
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                }`}
              >
                {segment}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-8">
          <p className="text-sm text-white/55 uppercase tracking-[0.18em] font-label">
            {filteredProducts.length} productos para mirar ahora
          </p>
          {(activeCategory !== 'Todos' || activeSegment !== 'Todos') && (
            <button
              onClick={() => {
                setActiveCategory('Todos');
                setActiveSegment('Todos');
              }}
              className="text-sm uppercase tracking-[0.18em] font-label text-secondary hover:text-white transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-surface-container-low p-10 text-center">
            <p className="font-headline text-2xl uppercase italic text-white mb-3">No encontramos esa combinacion</p>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              Proba otro filtro o entra a la tienda completa para ver mas opciones.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <a
                key={product.id}
                href={getProductUrl(product, 'store_card')}
                onClick={() =>
                  trackEvent('product_click', {
                    surface: 'store_card',
                    product: product.slug,
                    category: product.category,
                    segment: product.segment,
                  })
                }
                className="group flex flex-col bg-surface-container-low rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-500"
              >
                <div className="relative aspect-square overflow-hidden bg-surface-container-highest p-6 flex items-center justify-center">
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-secondary text-on-secondary-fixed font-label text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full z-10">
                      {product.badge}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="font-label text-primary text-xs uppercase tracking-widest">{product.category}</span>
                    <span className="font-label text-white/40 text-[10px] uppercase tracking-widest">{product.collection}</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold text-on-surface mb-3 uppercase italic">{product.name}</h3>
                  <p className="text-sm text-on-surface-variant mb-6">{product.segment}</p>

                  <div className="mt-auto flex items-center justify-end">
                    <span className="px-4 py-2 rounded-full bg-surface-container-highest text-on-surface group-hover:bg-primary group-hover:text-on-primary transition-colors font-headline text-xs uppercase tracking-widest">
                      Comprar
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
