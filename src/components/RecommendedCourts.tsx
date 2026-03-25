import React from 'react';
import { COURTS } from '../data/courts';
import { getStoreUrl, getWhatsAppUrl } from '../lib/commerce';
import { trackEvent } from '../lib/analytics';

export default function RecommendedCourts() {
  return (
    <section id="canchas" className="py-24 bg-surface-container-lowest border-t border-white/5">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="font-label text-secondary uppercase tracking-[0.25em] text-xs font-bold">San Miguel</span>
            <h2 className="font-headline text-4xl md:text-6xl font-black text-on-surface uppercase tracking-tight mt-3">
              Donde jugar y que llevar
            </h2>
            <div className="h-1.5 w-32 bg-[#caf300] mt-4"></div>
            <p className="text-on-surface-variant font-body mt-6 max-w-2xl">
              Te dejamos canchas cercanas para completar el recorrido: descubrir el producto, hablar con nosotros si
              hace falta y salir a jugar con el equipo resuelto.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={getStoreUrl('courts_store')}
              onClick={() => trackEvent('view_store_click', { surface: 'courts_store' })}
              className="bg-white text-black px-5 py-3 font-headline font-bold uppercase text-sm tracking-widest hover:bg-secondary transition-colors"
            >
              Ver tienda
            </a>
            <a
              href={getWhatsAppUrl('courts_whatsapp', 'Hola, quiero que me recomienden un combo para salir a jugar.')}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('whatsapp_click', { surface: 'courts_whatsapp' })}
              className="border border-white/20 text-white px-5 py-3 font-headline font-bold uppercase text-sm tracking-widest hover:bg-white/10 transition-colors"
            >
              Pedir recomendacion
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COURTS.map((court) => (
            <a
              key={court.id}
              href={court.mapsUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="bg-surface-container-low rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-colors group"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={court.image}
                  alt={court.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#0055ff] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                    {court.location}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-headline text-2xl font-bold text-white uppercase italic mb-2">{court.name}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-on-surface-variant text-sm font-body">
                    <span className="material-symbols-outlined text-lg text-[#caf300]">location_on</span>
                    {court.address}
                  </div>
                  {court.phone && (
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm font-body">
                      <span className="material-symbols-outlined text-lg text-[#caf300]">phone</span>
                      {court.phone}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {court.features.map((feature) => (
                    <span key={feature} className="bg-white/5 text-white/70 text-xs font-label px-2 py-1 rounded border border-white/10">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
