import { BlogPost, ProductSegment } from '../types';

export function normalizePath(pathname: string) {
  if (!pathname) {
    return '/';
  }
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return normalized === '//' ? '/' : normalized;
}

export function getStorePageHref(category: string = 'Todos', segment: ProductSegment | 'Todos' = 'Todos') {
  const params = new URLSearchParams();
  if (category !== 'Todos') {
    params.set('categoria', category);
  }
  if (segment !== 'Todos') {
    params.set('segmento', segment);
  }
  const query = params.toString();
  return `/tienda/${query ? `?${query}` : ''}`;
}

export function getSectionPageHref(section: 'home' | 'mayoristas' | 'blog' | 'canchas') {
  if (section === 'home') {
    return '/';
  }
  if (section === 'canchas') {
    return '/donde-jugar/';
  }
  return `/${section}/`;
}

export function getBlogPostHref(post: Pick<BlogPost, 'slug'>) {
  return `/blog/${post.slug}/`;
}

export function resolveRoute(
  pathname: string,
  search: string,
  blogPosts: BlogPost[],
): {
  view: 'home' | 'store' | 'blog';
  section?: 'blog' | 'mayoristas' | 'canchas';
  blogId?: string | null;
  category: string;
  segment: ProductSegment | 'Todos';
} {
  const path = normalizePath(pathname);
  const params = new URLSearchParams(search);

  if (path === '/tienda/') {
    return {
      view: 'store',
      category: params.get('categoria') || 'Todos',
      segment: (params.get('segmento') as ProductSegment | 'Todos') || 'Todos',
      blogId: null,
    };
  }

  if (path === '/mayoristas/') {
    return { view: 'home', section: 'mayoristas', category: 'Todos', segment: 'Todos', blogId: null };
  }

  if (path === '/donde-jugar/') {
    return { view: 'home', section: 'canchas', category: 'Todos', segment: 'Todos', blogId: null };
  }

  if (path === '/blog/') {
    return { view: 'home', section: 'blog', category: 'Todos', segment: 'Todos', blogId: null };
  }

  const matchedPost = blogPosts.find((post) => `/blog/${post.slug}/` === path);
  if (matchedPost) {
    return {
      view: 'blog',
      blogId: matchedPost.id,
      category: 'Todos',
      segment: 'Todos',
    };
  }

  return { view: 'home', category: 'Todos', segment: 'Todos', blogId: null };
}
