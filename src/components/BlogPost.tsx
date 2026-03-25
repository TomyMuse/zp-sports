import React from 'react';
import { getStoreUrl, withUTM } from '../lib/commerce';
import { trackEvent } from '../lib/analytics';
import { BlogPost as BlogPostType } from '../types';

interface BlogPostProps {
  post: BlogPostType;
  onBack: () => void;
}

export default function BlogPost({ post, onBack }: BlogPostProps) {
  const ctaUrl = post.ctaUrl ? withUTM(post.ctaUrl, { content: `blog_post_${post.id}` }) : getStoreUrl(`blog_post_${post.id}`);

  return (
    <div className="min-h-screen bg-surface-container-lowest pt-32 pb-24">
      <div className="container mx-auto px-8 max-w-[1000px]">
        <button
          onClick={onBack}
          className="font-label text-sm uppercase tracking-widest text-secondary hover:text-white transition-all flex items-center gap-2 mb-12"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Volver al archivo
        </button>

        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="font-label text-primary text-xs uppercase font-black tracking-widest px-3 py-1 bg-primary/10 rounded-full">
              {post.category}
            </span>
            <span className="font-label text-on-surface-variant text-xs uppercase tracking-widest">{post.date}</span>
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-black text-on-surface uppercase tracking-tight mb-6">
            {post.title}
          </h1>
          <p className="font-body text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">{post.excerpt}</p>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-2xl mb-16 bg-surface-container-highest">
          <img className="w-full h-full object-cover" alt={post.title} src={post.image} />
        </div>

        <article className="max-w-none font-body text-on-surface-variant leading-relaxed text-lg">
          {post.content.map((paragraph, index) => (
            <p key={index} className="mb-6">
              {paragraph}
            </p>
          ))}
        </article>

        <div className="mt-14 p-8 rounded-3xl bg-surface-container-low border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-label text-secondary uppercase tracking-[0.25em] text-xs font-bold mb-2">Siguiente paso</p>
            <h2 className="font-headline text-3xl font-black uppercase italic text-white">
              {post.ctaLabel || 'Seguir viendo la seleccion'}
            </h2>
          </div>
          <a
            href={ctaUrl}
            onClick={() => trackEvent('blog_cta_click', { post: post.id })}
            className="inline-flex items-center justify-center gap-2 bg-secondary text-black px-6 py-3 font-headline font-bold uppercase tracking-widest text-sm"
          >
            Comprar
            <span className="material-symbols-outlined text-base">north_east</span>
          </a>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <button
            onClick={onBack}
            className="font-label text-sm uppercase tracking-widest text-primary hover:text-secondary transition-colors"
          >
            Volver a todos los articulos
          </button>
          <a
            href={getStoreUrl('blog_footer')}
            onClick={() => trackEvent('view_store_click', { surface: 'blog_footer' })}
            className="font-label text-sm uppercase tracking-widest text-white/70 hover:text-white transition-colors"
          >
            Ver tienda completa
          </a>
        </div>
      </div>
    </div>
  );
}
