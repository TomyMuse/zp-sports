import { Product } from '../types';
import { STORE_URL, WHOLESALE_PHONE } from '../data/site';

interface UTMOptions {
  content: string;
  source?: string;
  medium?: string;
  campaign?: string;
}

export function withUTM(url: string, options: UTMOptions): string {
  const trackedUrl = new URL(url, STORE_URL);
  trackedUrl.searchParams.set('utm_source', options.source || 'zp_web');
  trackedUrl.searchParams.set('utm_medium', options.medium || 'referral');
  trackedUrl.searchParams.set('utm_campaign', options.campaign || 'tiendanube_conversion');
  trackedUrl.searchParams.set('utm_content', options.content);
  return trackedUrl.toString();
}

export function getProductUrl(product: Product, surface: string): string {
  return withUTM(product.primaryCtaUrl, {
    content: `${surface}_${product.slug}`,
    source: product.utmSource,
  });
}

export function getStoreUrl(surface: string): string {
  return withUTM(STORE_URL, {
    content: surface,
  });
}

export function getWhatsAppUrl(surface: string, message: string): string {
  const url = new URL(`https://wa.me/${WHOLESALE_PHONE}`);
  url.searchParams.set('text', `${message}\n\nOrigen: ${surface}`);
  return url.toString();
}
