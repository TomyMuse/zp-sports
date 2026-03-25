import React, { useDeferredValue, useEffect, useRef, useState } from 'react';
import { Product } from '../types';

interface NavSearchProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function NavSearch({ products, onSelectProduct }: NavSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts =
    deferredSearchTerm.trim() === ''
      ? []
      : products
          .filter((product) => {
            const q = deferredSearchTerm.toLowerCase();
            return (
              product.name.toLowerCase().includes(q) ||
              product.category.toLowerCase().includes(q) ||
              product.segment.toLowerCase().includes(q) ||
              product.collection.toLowerCase().includes(q)
            );
          })
          .slice(0, 6);

  return (
    <div className="relative flex items-center" ref={containerRef}>
      {isOpen ? (
        <div className="flex items-center bg-white/10 rounded-full px-4 py-1.5 w-52 sm:w-72 transition-all border border-white/20">
          <span className="material-symbols-outlined text-white/50 text-xl mr-2">search</span>
          <input
            ref={inputRef}
            type="text"
            className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/50"
            placeholder="Buscar paletas, combos o accesorios"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white ml-2 flex items-center">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="text-white hover:text-[#caf300] transition-colors flex items-center justify-center"
          aria-label="Abrir buscador"
        >
          <span className="material-symbols-outlined text-2xl">search</span>
        </button>
      )}

      {isOpen && deferredSearchTerm.trim() !== '' && (
        <div className="absolute top-full right-0 mt-4 w-80 bg-surface-container-low rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50 max-h-96 overflow-y-auto flex flex-col">
          {filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-on-surface-variant text-sm font-body">
              No encontramos esa busqueda. Proba por categoria, carbono o combo.
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left w-full border-b border-white/5 last:border-0 group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover bg-surface-container-highest group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-on-surface text-sm font-bold truncate font-headline">{product.name}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-primary text-[10px] uppercase tracking-wider font-label">{product.category}</span>
                      <span className="text-white/40 text-[10px] uppercase tracking-wider font-label">{product.segment}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
