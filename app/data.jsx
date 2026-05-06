// Mock data for Diariamente — all in Spanish

const CATEGORIES = [
  { id: 'transportes',  label: 'Transportes',  icon: 'bus' },
  { id: 'tiendas',      label: 'Tiendas',      icon: 'shopping-bag' },
  { id: 'publicos',     label: 'Edif. públicos', icon: 'landmark' },
  { id: 'restaurantes', label: 'Restaurantes', icon: 'utensils' },
  { id: 'farmacias',    label: 'Farmacias',    icon: 'pill' },
];

const ACCESS = {
  total:   { id: 'total',   label: 'Totalmente accesible',   color: '#22C55E', short: 'Total' },
  parcial: { id: 'parcial', label: 'Parcialmente accesible', color: '#F5B400', short: 'Parcial' },
  no:      { id: 'no',      label: 'No accesible',           color: '#EF4444', short: 'Ninguna' },
};

// Centred on Paris (lat, lng)
const PARIS = [48.8584, 2.3490];

const PLACES = [
  {
    id: 1, name: 'Parada Châtelet',
    cat: 'transportes', access: 'total',
    coords: [48.8583, 2.3470],
    address: 'Place du Châtelet, 75001',
    eq: { rampa: true, ascensor: true, bano: true, puerta: true, audio: true, brailleo: false },
    rating: 4.6, reviews: 128,
    note: 'Estación renovada en 2024. Ascensores hasta el andén.',
  },
  {
    id: 2, name: 'Café Universal',
    cat: 'restaurantes', access: 'parcial',
    coords: [48.8606, 2.3432],
    address: '14 Rue de Rivoli, 75004',
    eq: { rampa: true, ascensor: false, bano: false, puerta: true, audio: false, brailleo: false },
    rating: 3.8, reviews: 42,
    note: 'Acceso por la entrada principal. Baño en planta baja no adaptado.',
  },
  {
    id: 3, name: 'Tienda Mercurio',
    cat: 'tiendas', access: 'total',
    coords: [48.8550, 2.3520],
    address: '22 Rue Saint-Antoine, 75004',
    eq: { rampa: true, ascensor: true, bano: true, puerta: true, audio: false, brailleo: true },
    rating: 4.9, reviews: 87,
    note: 'Pasillos amplios, caja baja disponible.',
  },
  {
    id: 4, name: 'Ayuntamiento Distrito 4',
    cat: 'publicos', access: 'total',
    coords: [48.8566, 2.3522],
    address: 'Place Baudoyer, 75004',
    eq: { rampa: true, ascensor: true, bano: true, puerta: true, audio: true, brailleo: true },
    rating: 4.4, reviews: 211,
    note: 'Edificio histórico adaptado. Personal formado en lengua de signos.',
  },
  {
    id: 5, name: 'Farmacia del Centro',
    cat: 'farmacias', access: 'parcial',
    coords: [48.8625, 2.3470],
    address: '8 Rue de la Paix, 75002',
    eq: { rampa: false, ascensor: false, bano: false, puerta: true, audio: false, brailleo: false },
    rating: 3.2, reviews: 19,
    note: 'Escalón de 6 cm en la entrada. Sin baño público.',
  },
  {
    id: 6, name: 'Parada Bus 38',
    cat: 'transportes', access: 'no',
    coords: [48.8540, 2.3450],
    address: 'Bd Saint-Michel, 75005',
    eq: { rampa: false, ascensor: false, bano: false, puerta: false, audio: false, brailleo: false },
    rating: 1.8, reviews: 64,
    note: 'Parada estrecha, sin rebaje en la acera. Pendiente de obras.',
  },
  {
    id: 7, name: 'Restaurante La Plaza',
    cat: 'restaurantes', access: 'total',
    coords: [48.8595, 2.3380],
    address: '3 Place Vendôme, 75001',
    eq: { rampa: true, ascensor: true, bano: true, puerta: true, audio: false, brailleo: false },
    rating: 4.7, reviews: 156,
    note: 'Mesas reservadas para sillas de ruedas. Carta en braille.',
  },
  {
    id: 8, name: 'Librería Cervantes',
    cat: 'tiendas', access: 'parcial',
    coords: [48.8550, 2.3410],
    address: '17 Rue de l\u2019Odéon, 75006',
    eq: { rampa: true, ascensor: false, bano: false, puerta: true, audio: false, brailleo: false },
    rating: 4.0, reviews: 33,
    note: 'Planta baja accesible. Primer piso por escalera únicamente.',
  },
  {
    id: 9, name: 'Biblioteca Municipal',
    cat: 'publicos', access: 'total',
    coords: [48.8530, 2.3490],
    address: 'Quai des Célestins, 75004',
    eq: { rampa: true, ascensor: true, bano: true, puerta: true, audio: true, brailleo: true },
    rating: 4.8, reviews: 304,
    note: 'Salas en silencio adaptadas, ordenadores con lector de pantalla.',
  },
  {
    id: 10, name: 'Farmacia Estación',
    cat: 'farmacias', access: 'total',
    coords: [48.8612, 2.3505],
    address: 'Gare de Lyon, 75012',
    eq: { rampa: true, ascensor: true, bano: true, puerta: true, audio: false, brailleo: false },
    rating: 4.5, reviews: 78,
    note: 'Abierta 24h. Mostrador a baja altura disponible.',
  },
  {
    id: 11, name: 'Mercado de Aligre',
    cat: 'tiendas', access: 'no',
    coords: [48.8505, 2.3760],
    address: 'Place d\u2019Aligre, 75012',
    eq: { rampa: false, ascensor: false, bano: false, puerta: false, audio: false, brailleo: false },
    rating: 2.1, reviews: 51,
    note: 'Suelo empedrado irregular. Pasillos estrechos entre puestos.',
  },
  {
    id: 12, name: 'Parada Metro Bastille',
    cat: 'transportes', access: 'parcial',
    coords: [48.8530, 2.3690],
    address: 'Place de la Bastille, 75011',
    eq: { rampa: true, ascensor: false, bano: false, puerta: true, audio: true, brailleo: false },
    rating: 3.4, reviews: 92,
    note: 'Acceso a una sola línea. Ascensor en proyecto para 2027.',
  },
];

const EQUIPMENT = [
  { id: 'rampa',    label: 'Rampa de acceso',    icon: 'ramp' },
  { id: 'ascensor', label: 'Ascensor',           icon: 'elevator' },
  { id: 'bano',     label: 'Baño adaptado',      icon: 'wc' },
  { id: 'puerta',   label: 'Puerta ancha',       icon: 'door' },
  { id: 'audio',    label: 'Señal sonora',       icon: 'audio' },
  { id: 'brailleo', label: 'Braille / táctil',   icon: 'braille' },
];

window.DIARIA = { CATEGORIES, ACCESS, PARIS, PLACES, EQUIPMENT };
