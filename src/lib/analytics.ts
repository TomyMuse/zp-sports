import { GA_MEASUREMENT_ID } from '../data/site';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
}

export function initAnalytics() {
  if (!GA_MEASUREMENT_ID || typeof document === 'undefined') {
    return;
  }

  if (document.querySelector(`script[data-ga-id="${GA_MEASUREMENT_ID}"]`)) {
    return;
  }

  ensureDataLayer();

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.dataset.gaId = GA_MEASUREMENT_ID;
  document.head.appendChild(script);

  window.gtag?.('js', new Date());
  window.gtag?.('config', GA_MEASUREMENT_ID);
}

export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') {
    return;
  }
  ensureDataLayer();
  window.gtag?.('event', name, params);
}
