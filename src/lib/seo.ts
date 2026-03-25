import { FAQS, SITE_URL } from '../data/site';
import { BlogPost } from '../types';

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  article?: BlogPost | null;
}

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!element) {
    element = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

export function applySeo({ title, description, path, image = '/logo.png', article }: SeoOptions) {
  if (typeof document === 'undefined') {
    return;
  }

  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  document.title = title;
  upsertMeta('meta[name="description"]', { name: 'description', content: description });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });
  upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: url });

  document.querySelectorAll('script[data-seo-jsonld="true"]').forEach((node) => node.remove());

  const graph: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ZP Sports',
      url: SITE_URL,
      logo: absoluteUrl('/logo.png'),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ZP Sports',
      url: SITE_URL,
      description,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];

  if (article) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      image: [article.image],
      author: {
        '@type': 'Organization',
        name: 'ZP Sports',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ZP Sports',
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/logo.png'),
        },
      },
      mainEntityOfPage: url,
      datePublished: article.date,
    });
  }

  graph.forEach((entry) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.seoJsonld = 'true';
    script.textContent = JSON.stringify(entry);
    document.head.appendChild(script);
  });
}
