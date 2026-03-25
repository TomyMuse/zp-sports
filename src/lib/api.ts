import { BlogPost, Court, Product } from '../types';
import { BLOG_POSTS } from '../data/blogs';
import { COURTS } from '../data/courts';
import { PRODUCTS } from '../data/products';

export async function fetchProducts(params?: {
  category?: string;
  q?: string;
  featured?: boolean;
  segment?: string;
}): Promise<Product[]> {
  let items = PRODUCTS.slice();
  if (params?.category && params.category !== 'Todos') {
    items = items.filter((product) => product.category === params.category);
  }
  if (typeof params?.featured === 'boolean') {
    items = items.filter((product) => product.featured === params.featured);
  }
  if (params?.segment) {
    items = items.filter((product) => product.segment === params.segment);
  }
  if (params?.q) {
    const q = params.q.toLowerCase();
    items = items.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.collection.toLowerCase().includes(q) ||
        product.segment.toLowerCase().includes(q)
    );
  }
  return Promise.resolve(items);
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  return Promise.resolve(BLOG_POSTS);
}

export async function fetchBlogPost(id: string): Promise<BlogPost> {
  const post = BLOG_POSTS.find((item) => item.id === id);
  if (!post) {
    throw new Error('Post not found');
  }
  return Promise.resolve(post);
}

export async function fetchCourts(): Promise<Court[]> {
  return Promise.resolve(COURTS);
}
