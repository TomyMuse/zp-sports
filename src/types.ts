export type ProductCategory =
  | 'Paletas'
  | 'Combos'
  | 'Pelotas'
  | 'Overgrips'
  | 'Fundas y accesorios';

export type ProductSegment =
  | 'Potencia'
  | 'Control'
  | 'Versatilidad'
  | 'Primera compra'
  | 'Accesorios'
  | 'Mayorista';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  collection: string;
  segment: ProductSegment;
  image: string;
  badge?: string | null;
  featured: boolean;
  primaryCtaUrl: string;
  secondaryCtaUrl?: string;
  utmSource: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content: string[];
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface Court {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  features: string[];
  image: string;
  mapsUrl?: string;
}
