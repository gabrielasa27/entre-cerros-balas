// HISTORIA «ENTRE CERROS Y BALAS» (César Ochoa · Laboratorio XR)
// Storyline sobre el mapa 3D: cada capítulo trae su lámina, su texto y el encuadre de cámara.
// - Los textos son los de la presentación original (11 láminas en /public/historia/entre-cerros-y-balas/).
// - El recorrido de los mensajeros es ILUSTRATIVO (misión ficticia del videojuego). Sigue a grandes rasgos
//   la Ruta Nacional 9 por la Quebrada de Humahuaca; no reconstruye un itinerario histórico.
// - Único dato histórico ubicado en el mapa: la toma del cuartel realista de Humahuaca (1 de marzo de 1817).
//
// Campos de cada capítulo:
//   camara: { centro:[lng,lat] | seguir:true (centra en los jinetes), zoom, pitch, bearing }
//   progreso: 0..1 sobre el recorrido (hasta dónde avanzaron los mensajeros)
//   jinetes: muestra el marcador de los dos mensajeros; foco: 'rojo' | 'azul' (jugador destacado)
//   lugares: marcadores visibles (ids de LUGARES); alerta: lugar que late en rojo
//   deptos: departamentos resaltados en el mapa

const LAMINAS = '/historia/entre-cerros-y-balas/';
const lamina = (n) => `${LAMINAS}lamina-${String(n).padStart(2, '0')}.jpg`;

export const HISTORIA = {
  id: 'entre-cerros-y-balas',
  titulo: 'Entre Cerros y Balas',
  bajada: 'Aventura histórica en realidad virtual',
  credito: 'César Ochoa · Laboratorio XR'
};

// Recorrido ilustrativo: Humahuaca → San Salvador de Jujuy (RN 9)
export const RUTA = [
  [-65.3497, -23.2054], // Humahuaca
  [-65.3560, -23.3036], // Uquía
  [-65.3497, -23.4370], // Huacalera
  [-65.3700, -23.5100],
  [-65.3960, -23.5770], // Tilcara
  [-65.4080, -23.6240], // Maimará
  [-65.4300, -23.6800],
  [-65.4560, -23.7350], // cruce a Purmamarca
  [-65.4680, -23.8570], // Tumbaya
  [-65.4660, -23.9170], // Volcán
  [-65.4300, -24.0420], // León
  [-65.4030, -24.1210], // Yala
  [-65.2990, -24.1850]  // San Salvador de Jujuy
];
// Tramo final, sólo indicado: hacia Güemes (Salta)
export const RUTA_DESTINO = [[-65.2990, -24.1850], [-65.3300, -24.4300], [-65.4117, -24.7883]];

// Lugares. `en` = posición sobre el recorrido (0..1) o `lngLat` fijo.
export const LUGARES = [
  { id: 'arias', lngLat: [-65.3497, -23.2054], tipo: 'historico', nombre: 'Humahuaca', detalle: 'Toma del cuartel realista · 1/3/1817' },
  { id: 'emboscada', en: 0.46, tipo: 'ficcion', nombre: 'Emboscada realista', detalle: 'Misión ficticia del videojuego' },
  { id: 'guemes', lngLat: [-65.4117, -24.7883], tipo: 'destino', nombre: 'Güemes', detalle: 'Defensa del norte · Salta' }
];

const QUEBRADA = ['humahuaca', 'tilcara', 'tumbaya'];

export const CAPITULOS = [
  {
    id: 'portada', imagen: lamina(1),
    etiqueta: 'Aventura histórica en realidad virtual',
    titulo: 'Entre Cerros y Balas',
    mapa: 'Quebrada de Humahuaca, Jujuy',
    credito: HISTORIA.credito,
    camara: { centro: [-65.40, -23.62], zoom: 8.7, pitch: 62, bearing: -25 },
    progreso: 0, deptos: QUEBRADA
  },
  {
    id: 'contexto', imagen: lamina(2),
    etiqueta: 'Contexto histórico',
    titulo: 'Jujuy, 1817',
    parrafos: ['Las tropas realistas avanzan sobre el norte argentino. Las milicias gauchas resisten y defienden el territorio.'],
    mapa: 'Provincia de Jujuy',
    camara: { centro: [-65.70, -23.45], zoom: 7.3, pitch: 45, bearing: -8 },
    progreso: 0, lugares: ['guemes']
  },
  {
    id: 'protagonistas', imagen: lamina(3),
    titulo: 'Protagonistas de la historia',
    tarjetas: [
      { titulo: 'Manuel Eduardo Arias', lineas: ['Comandante de las milicias gauchas en Jujuy.', 'El 1 de marzo de 1817 encabezó la toma del cuartel realista de Humahuaca.'] },
      { titulo: 'Martín Miguel de Güemes', lineas: ['Referente de la defensa del norte.', 'La comunicación entre las fuerzas patriotas resulta central para la misión ficticia del videojuego.'] }
    ],
    mapa: 'Humahuaca · cuartel realista',
    camara: { centro: [-65.3497, -23.2054], zoom: 11.4, pitch: 66, bearing: 25 },
    progreso: 0, lugares: ['arias', 'guemes'], deptos: ['humahuaca']
  },
  {
    id: 'mision', imagen: lamina(4),
    etiqueta: 'Aventura ficticia inspirada en 1817',
    titulo: 'La misión',
    destacado: 'Un mensaje debe llegar a Güemes.',
    parrafos: [
      'Dos gauchos mensajeros vinculados con las tropas de Arias atraviesan la Quebrada de Humahuaca.',
      'En el camino, una emboscada realista amenaza con detenerlos.'
    ],
    mapa: 'Recorrido ilustrativo por la Ruta 9',
    camara: { centro: [-65.42, -23.66], zoom: 8.9, pitch: 58, bearing: -15 },
    progreso: 0.06, jinetes: true, lugares: ['arias', 'emboscada', 'guemes'], alerta: 'emboscada'
  },
  {
    id: 'jugadores', imagen: lamina(5),
    titulo: 'Dos jugadores. Dos caballos.',
    destacado: 'Un mismo objetivo: atravesar el recorrido y cumplir la misión.',
    parrafos: ['Cada jugador monta su propio caballo. Sus habilidades son diferentes y complementarias.'],
    mapa: 'Entre Uquía y Huacalera',
    camara: { seguir: true, zoom: 12, pitch: 72, bearing: 190 },
    progreso: 0.2, jinetes: true, lugares: ['emboscada']
  },
  {
    id: 'jugador-1', imagen: lamina(6),
    etiqueta: 'Ritmo · Precisión · Recursos',
    titulo: 'Jugador 1 · El recorrido',
    vinetas: ['Mantiene el ritmo del galope.', 'Esquiva piedras y otros obstáculos.', 'Recoge recursos para seguir avanzando.'],
    mapa: 'Llegando a Tilcara',
    camara: { seguir: true, zoom: 12.6, pitch: 74, bearing: 200 },
    progreso: 0.33, jinetes: true, foco: 'rojo', lugares: ['emboscada']
  },
  {
    id: 'jugador-2', imagen: lamina(7),
    etiqueta: 'Atención · Reflejos · Protección',
    titulo: 'Jugador 2 · La defensa',
    vinetas: ['Identifica amenazas a lo largo del camino.', 'Enfrenta los ataques de las tropas realistas.', 'Protege a su compañero.'],
    mapa: 'Maimará · zona de emboscada',
    camara: { seguir: true, zoom: 12.4, pitch: 72, bearing: 160 },
    progreso: 0.43, jinetes: true, foco: 'azul', lugares: ['emboscada'], alerta: 'emboscada'
  },
  {
    id: 'estrategia', imagen: lamina(8),
    titulo: 'Estrategia, táctica y cooperación',
    tarjetas: [
      { titulo: 'Estrategia', lineas: ['Administrar los recursos y tomar decisiones para cumplir la misión.'] },
      { titulo: 'Táctica', lineas: ['Aprovechar el terreno, esquivar obstáculos y responder a las amenazas.'] },
      { titulo: 'Cooperación', lineas: ['Coordinar habilidades distintas para protegerse y avanzar juntos.'] }
    ],
    mapa: 'Cruce a Purmamarca',
    camara: { seguir: true, zoom: 11, pitch: 62, bearing: 120 },
    progreso: 0.56, jinetes: true, lugares: ['emboscada']
  },
  {
    id: 'territorio', imagen: lamina(9),
    etiqueta: 'Inspirado en hechos históricos',
    titulo: 'El territorio también es parte del desafío',
    parrafos: [
      'Los cerros y caminos de la Quebrada de Humahuaca inspiran el recorrido del videojuego.',
      'Las milicias gauchas aprovecharon el conocimiento del terreno, los ataques sorpresivos y la interrupción del abastecimiento enemigo.'
    ],
    mapa: 'Cerros de la Quebrada',
    camara: { centro: [-65.43, -23.70], zoom: 10.6, pitch: 75, bearing: 95 },
    progreso: 0.7, jinetes: true, deptos: ['tilcara', 'tumbaya']
  },
  {
    id: 'aventura', imagen: lamina(10),
    titulo: 'Una aventura para descubrir Jujuy',
    destacado: 'La experiencia busca despertar interés por:',
    vinetas: ['La historia de la independencia en Jujuy.', 'Manuel Eduardo Arias y Martín Miguel de Güemes.', 'El patrimonio y los paisajes de la Quebrada.'],
    tarjetas: [
      { titulo: 'En desarrollo', lineas: ['Videojuego cooperativo de realidad virtual.', 'Herramienta de desarrollo: Unreal Engine.', 'Desarrollador: César Ochoa.', 'Laboratorio XR.'] }
    ],
    mapa: 'Humahuaca, Tilcara y Tumbaya',
    camara: { centro: [-65.42, -23.58], zoom: 8.6, pitch: 55, bearing: -10 },
    progreso: 0.88, jinetes: true, lugares: ['arias'], deptos: QUEBRADA
  },
  {
    id: 'cierre', imagen: lamina(11),
    titulo: 'Entre Cerros y Balas',
    destacado: 'La historia de Jujuy se convierte en una aventura.',
    pregunta: '¿Podrás entregar el mensaje?',
    credito: HISTORIA.credito,
    mapa: 'San Salvador de Jujuy → Güemes',
    camara: { centro: [-65.42, -23.95], zoom: 7.9, pitch: 55, bearing: 10 },
    progreso: 1, jinetes: true, lugares: ['arias', 'guemes'], alerta: 'guemes'
  }
];
