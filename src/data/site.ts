export const STORE_URL = 'https://zonapadeloficial.com.ar/';
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://tudominio.com';
export const CONTACT_URL =
  'https://www.zonapadeloficial.com.ar/contacto?order_cancellation_without_id=true';
export const CONTACT_EMAIL = 'zonapadeloficial@gmail.com';
export const WHOLESALE_PHONE = import.meta.env.VITE_WHATSAPP_NUMBER || '541178437278';
export const WHOLESALE_FORM_URL = import.meta.env.VITE_WHOLESALE_FORM_URL || CONTACT_URL;
export const WHOLESALE_CATALOG_URL =
  import.meta.env.VITE_WHOLESALE_CATALOG_URL ||
  '/femak_descripcion_mayoristas.pdf_20260310_212305_0000.pdf';
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

export const STORE_CATEGORIES = [
  'Todos',
  'Paletas',
  'Combos',
  'Pelotas',
  'Overgrips',
  'Fundas y accesorios',
] as const;

export const STORE_SEGMENTS = [
  'Todos',
  'Potencia',
  'Control',
  'Versatilidad',
  'Primera compra',
  'Accesorios',
] as const;

export const PROOF_POINTS = [
  'Envios a todo el pais',
  '6 cuotas en productos seleccionados',
  'Asesoramiento personalizado',
  'Garantia oficial de fabrica',
];

export const VALUE_PILLARS = [
  {
    title: 'Lo mas pedido',
    description:
      'Paletas, combos y accesorios que hoy salen mas y se eligen mas facil.',
  },
  {
    title: 'Compra simple',
    description:
      'Entr?s al producto y encontr?s r?pido lo que necesit?s.',
  },
  {
    title: 'Mayorista',
    description:
      'Si compras para club, profe o reventa, tenes una via aparte para pedir volumen.',
  },
];

export const BUYING_GUIDES = [
  {
    title: 'Quiero potencia',
    description: 'Paletas rigidas, salida rapida y modelos 12K/24K para un juego agresivo.',
    segment: 'Potencia',
    badge: 'Remate y ataque',
  },
  {
    title: 'Quiero control',
    description: 'Opciones equilibradas para defensa, precision y punto dulce mas amable.',
    segment: 'Control',
    badge: 'Juego tactico',
  },
  {
    title: 'Estoy empezando',
    description: 'Modelos nobles y combos para entrar al padel sin elegir a ciegas.',
    segment: 'Primera compra',
    badge: 'Primer equipo',
  },
];

export const TECH_EXPLAINERS = [
  {
    title: 'EVA',
    eyebrow: 'Nucleo',
    description:
      'Mas rigida, durable y firme al impacto. Suele encajar mejor en jugadores que ya generan su propia salida de bola.',
    note: 'Buena para potencia y control cuando ya tenes tecnica.',
  },
  {
    title: 'FOAM',
    eyebrow: 'Nucleo',
    description:
      'Mas blanda, comoda y con efecto muelle. Facilita la salida de bola con menos esfuerzo y baja la sensacion de vibracion.',
    note: 'Muy util para primeras compras o molestias de codo.',
  },
  {
    title: '3K, 18K y 24K',
    eyebrow: 'Carbono',
    description:
      'Mas K suele empujar una respuesta mas seca y rigida, pero el tacto final tambien depende del nucleo y del armado general.',
    note: 'No conviene elegir solo por el numero.',
  },
];

export const BALANCE_GUIDE = [
  {
    title: 'Redonda / balance bajo',
    description: 'Control, agilidad y una sensacion mas llevadera para defender y jugar con margen.',
  },
  {
    title: 'Lagrima / balance medio',
    description: 'El punto medio mas buscado: mezcla salida, manejo e inercia para un juego versatil.',
  },
  {
    title: 'Diamante / balance alto',
    description: 'Mas palanca para rematar y acelerar arriba, con mayor exigencia en hombro y antebrazo.',
  },
];

export const FOOTWEAR_GUIDE = [
  {
    sole: 'Omni',
    court: 'Poca arena / indoor',
    benefit: 'Agarre mas directo y traccion inmediata en cesped mas limpio.',
  },
  {
    sole: 'Espiga',
    court: 'Mucha arena',
    benefit: 'Deslizamiento controlado y menos frenadas secas en esquinas exigidas.',
  },
  {
    sole: 'Mixta',
    court: 'Superficies variables',
    benefit: 'Versatilidad para clubes donde el mantenimiento y la arena cambian bastante.',
  },
];

export const PRO_MODELS_2026 = [
  {
    name: 'Bullpadel Neuron 02 Edge',
    player: 'Fede Chingotto',
    profile: 'Estabilidad alta en bloqueos, contragolpes y ritmo competitivo.',
  },
  {
    name: 'Siux Electra Elite',
    player: 'Franco Stupaczuk',
    profile: 'Lagrima, carbono 3K y tacto pensado para control fino y efectos.',
  },
  {
    name: 'Nox AT10 Luxury Genius 18K Alum',
    player: 'Agustin Tapia',
    profile: 'Tacto reactivo, carbono aluminizado y balance personalizable.',
  },
  {
    name: 'Bullpadel Hack 04 26',
    player: 'Paquito Navarro',
    profile: 'Diamante y aerodinamica para smash y juego ofensivo.',
  },
  {
    name: 'Siux Fenix',
    player: 'Leo Augsburger',
    profile: 'Potencia bruta para perfiles agresivos que juegan arriba.',
  },
];

export const CHOOSE_STEPS = [
  {
    step: '01',
    title: 'Define tu momento de juego',
    description:
      'No arranques por el nombre del carbono. Arranca por tu nivel, por cuanto jugas y por si hoy buscas potencia, control o una respuesta mas amable.',
  },
  {
    step: '02',
    title: 'Mira nucleo y balance juntos',
    description:
      'Una EVA firme con balance alto puede ser una gran aliada o una muy mala idea, segun tu brazo y tu tecnica. La combinacion importa mas que la etiqueta sola.',
  },
  {
    step: '03',
    title: 'Escucha el cuerpo',
    description:
      'Si una pala termina demasiado cabezona o dura para vos, lo vas a sentir rapido en hombro, antebrazo o codo. Elegir bien tambien es prevenir.',
  },
];

export const WHOLESALE_ARGUMENTS = [
  {
    title: 'Surtido que rota',
    description:
      'Modelos claros por nivel de juego ayudan a vender mejor y equivocarse menos.',
  },
  {
    title: 'Entradas claras',
    description:
      'Combos, primeras compras y palas faciles de explicar hacen que la rueda se mueva mas rapido.',
  },
  {
    title: 'Asesoramiento real',
    description:
      'Cuando la recomendacion esta bien hecha, el cierre llega mucho mas facil.',
  },
];

export const FAQS = [
  {
    question: 'Donde se paga y se confirma la compra?',
    answer:
      'Al avanzar con la compra vas a ver el stock, las cuotas y los medios de envio actualizados antes de cerrar el pedido.',
  },
  {
    question: 'Puedo pedir asesoramiento antes de comprar?',
    answer:
      'Si. Tambien podes escribirnos por WhatsApp para que te recomendemos segun nivel, presupuesto y estilo de juego.',
  },
  {
    question: 'Hacen ventas para clubes o revendedores?',
    answer:
      'Si. El recorrido mayorista esta separado para que puedas pedir volumen, catalogo y condiciones sin mezclarte con el flujo retail.',
  },
  {
    question: 'Que pasa con garantias, cambios y envios?',
    answer:
      'Garantias, cambios y envios se resuelven por los canales habituales de compra y contacto, con la informacion actualizada al momento de cerrar el pedido.',
  },
  {
    question: 'Que conviene si me molesta el codo o siento mucha vibracion?',
    answer:
      'En general conviene mirar paletas mas livianas, de balance bajo o medio y con tacto mas amable. Si una pala termina muy cabezona o demasiado dura para tu nivel, suele sentirse mas exigente de lo que parece en la ficha.',
  },
  {
    question: 'Importa mas el peso o el balance?',
    answer:
      'Los dos importan, pero el balance cambia mucho la sensacion real en brazo y hombro. Una pala no tan pesada con balance alto puede sentirse mas dura que otra mas pesada con el peso mas cerca del puno.',
  },
];

export const WHOLESALE_BENEFITS = [
  'Atencion para clubes, profesores y revendedores.',
  'Catalogo mayorista con productos faciles de mover.',
  'Respuesta rapida por WhatsApp para avanzar sin demoras.',
];

export const WHOLESALE_FIELDS = [
  'Nombre y apellido',
  'Club, local o proyecto',
  'Zona de trabajo',
  'Volumen estimado',
  'WhatsApp',
  'Productos de interes',
];
