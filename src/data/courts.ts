import { Court } from '../types';

const COURT_IMG_A =
  'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1200&auto=format&fit=crop';
const COURT_IMG_B =
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop';
const COURT_IMG_C =
  'https://images.unsplash.com/photo-1612534847738-b3f2dc52b914?q=80&w=1200&auto=format&fit=crop';

export const COURTS: Court[] = [
  {
    id: 'c1',
    name: 'Set Padel House',
    location: 'San Miguel',
    address: 'Concejal Tribulato 1196, San Miguel, Buenos Aires',
    phone: '+54 9 11 5604-4585',
    features: ['Padel', 'San Miguel', 'Reservas'],
    image: COURT_IMG_A,
    mapsUrl: 'https://maps.google.com/?q=Concejal+Tribulato+1196+San+Miguel+Buenos+Aires',
  },
  {
    id: 'c2',
    name: 'Complejo Pow',
    location: 'Muniz',
    address: 'Pardo 1150, Muniz, Buenos Aires',
    phone: '+54 11 4667-2598',
    features: ['Padel', 'Complejo', 'Muniz'],
    image: COURT_IMG_B,
    mapsUrl: 'https://maps.google.com/?q=Pardo+1150+Muniz+Buenos+Aires',
  },
  {
    id: 'c3',
    name: 'Green Padel Club',
    location: 'Bella Vista',
    address: 'Sourdeaux 1460, Bella Vista, Buenos Aires',
    phone: '',
    features: ['Padel', 'Bella Vista', 'Club'],
    image: COURT_IMG_C,
    mapsUrl: 'https://maps.google.com/?q=Sourdeaux+1460+Bella+Vista+Buenos+Aires',
  },
  {
    id: 'c4',
    name: 'Darwin Paddle',
    location: 'Bella Vista',
    address: 'Sourdeaux 877, Bella Vista, Buenos Aires',
    phone: '',
    features: ['Padel', 'Bella Vista', 'Reservas'],
    image: COURT_IMG_A,
    mapsUrl: 'https://maps.google.com/?q=Sourdeaux+877+Bella+Vista+Buenos+Aires',
  },
  {
    id: 'c5',
    name: 'Toto Padel y Futbol Club',
    location: 'Jose C. Paz',
    address: 'Calle Chile 1275, Jose C. Paz, Buenos Aires',
    phone: '+54 11 3241-6834',
    features: ['Padel', 'Futbol', 'Jose C. Paz'],
    image: COURT_IMG_B,
    mapsUrl: 'https://maps.google.com/?q=Chile+1275+Jose+C.+Paz+Buenos+Aires',
  },
  {
    id: 'c6',
    name: 'La Bandeja Padel',
    location: 'Jose C. Paz',
    address: 'Avenida Hipolito Yrigoyen 1598, Jose C. Paz, Buenos Aires',
    phone: '+54 9 11 6054-8725',
    features: ['Padel', 'Jose C. Paz', 'Club'],
    image: COURT_IMG_C,
    mapsUrl: 'https://maps.google.com/?q=Hipolito+Yrigoyen+1598+Jose+C.+Paz+Buenos+Aires',
  },
];
