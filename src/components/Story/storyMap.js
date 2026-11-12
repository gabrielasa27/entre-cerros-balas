// Capa de la historia sobre el mapa: recorrido de los mensajeros, marcadores y cámara por capítulo.
// Módulo JS (no componente React), igual que el motor de Map3D. Se crea una vez cuando el mapa está listo.
import maplibregl from 'maplibre-gl';
import { RUTA, RUTA_DESTINO, LUGARES } from '../../story/entreCerrosYBalas';

const LAYERS = ['historia-ruta-base', 'historia-ruta-destino', 'historia-ruta-brillo', 'historia-ruta-hecha'];
const AMBAR = '#f59e0b';

// distancias acumuladas (en grados corregidos por latitud: alcanza para interpolar)
const seg = (a, b) => Math.hypot((b[0] - a[0]) * Math.cos((a[1] * Math.PI) / 180), b[1] - a[1]);
const acum = RUTA.reduce((acc, p, i) => { acc.push(i ? acc[i - 1] + seg(RUTA[i - 1], p) : 0); return acc; }, []);
const TOTAL = acum[acum.length - 1];

export function puntoEn(t) {
  const d = Math.max(0, Math.min(1, t)) * TOTAL;
  let i = 1;
  while (i < acum.length - 1 && acum[i] < d) i++;
  const k = (d - acum[i - 1]) / (acum[i] - acum[i - 1] || 1);
  const a = RUTA[i - 1], b = RUTA[i];
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
}
function tramoHasta(t) {
  const d = Math.max(0, Math.min(1, t)) * TOTAL;
  const out = [RUTA[0]];
  for (let i = 1; i < RUTA.length && acum[i] < d; i++) out.push(RUTA[i]);
  out.push(puntoEn(t));
  return out;
}
const linea = (coords) => ({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } });
const suave = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function crearMarcadorLugar(l) {
  const el = document.createElement('div');
  el.className = 'historia-lugar';
  el.dataset.tipo = l.tipo;
  el.hidden = true;
  el.innerHTML = '<span class="historia-lugar__punto"></span><span class="historia-lugar__texto"><b></b><small></small></span>';
  el.querySelector('b').textContent = l.nombre;
  el.querySelector('small').textContent = l.detalle;
  const lngLat = l.lngLat || puntoEn(l.en);
  return { id: l.id, el, marker: new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat(lngLat) };
}

export function createStoryMap(map) {
  map.addSource('historia-ruta', { type: 'geojson', data: linea(RUTA) });
  map.addSource('historia-destino', { type: 'geojson', data: linea(RUTA_DESTINO) });
  map.addSource('historia-hecha', { type: 'geojson', data: linea([RUTA[0], RUTA[0]]) });
  const oculto = { visibility: 'none', 'line-cap': 'round', 'line-join': 'round' };
  map.addLayer({ id: 'historia-ruta-base', type: 'line', source: 'historia-ruta', layout: oculto,
    paint: { 'line-color': '#fde68a', 'line-opacity': 0.45, 'line-width': 2, 'line-dasharray': [1.5, 2] } });
  map.addLayer({ id: 'historia-ruta-destino', type: 'line', source: 'historia-destino', layout: oculto,
    paint: { 'line-color': '#fde68a', 'line-opacity': 0.35, 'line-width': 1.6, 'line-dasharray': [0.6, 2.4] } });
  map.addLayer({ id: 'historia-ruta-brillo', type: 'line', source: 'historia-hecha', layout: oculto,
    paint: { 'line-color': AMBAR, 'line-opacity': 0.35, 'line-width': 10, 'line-blur': 6 } });
  map.addLayer({ id: 'historia-ruta-hecha', type: 'line', source: 'historia-hecha', layout: oculto,
    paint: { 'line-color': AMBAR, 'line-width': 3.5 } });

  // los dos mensajeros (rojo y azul, como en las láminas)
  const jinetesEl = document.createElement('div');
  jinetesEl.className = 'historia-jinetes';
  jinetesEl.hidden = true;
  jinetesEl.innerHTML = '<span class="historia-jinetes__par"><i data-j="rojo"></i><i data-j="azul"></i></span><span class="historia-jinetes__texto">Mensajeros</span>';
  const jinetes = new maplibregl.Marker({ element: jinetesEl, anchor: 'center' }).setLngLat(RUTA[0]).addTo(map);

  const lugares = LUGARES.map(crearMarcadorLugar);
  lugares.forEach((l) => l.marker.addTo(map));

  let progreso = 0;
  let raf = 0;
  let activa = false;

  const fijarProgreso = (p) => {
    progreso = p;
    map.getSource('historia-hecha')?.setData(linea(tramoHasta(p)));
    jinetes.setLngLat(puntoEn(p));
  };

  function mostrar(cap, { padding, reducir = false } = {}) {
    activa = true;
    LAYERS.forEach((id) => map.getLayer(id) && map.setLayoutProperty(id, 'visibility', 'visible'));

    const visibles = new Set(cap.lugares || []);
    lugares.forEach((l) => {
      l.el.hidden = !visibles.has(l.id);
      l.el.classList.toggle('is-alerta', cap.alerta === l.id);
    });
    jinetesEl.hidden = !cap.jinetes;
    jinetesEl.dataset.foco = cap.foco || '';

    // avance animado del recorrido
    cancelAnimationFrame(raf);
    const desde = progreso, hasta = cap.progreso ?? 0;
    const dur = reducir ? 0 : 2400 + Math.abs(hasta - desde) * 1600;
    const t0 = performance.now();
    const paso = (now) => {
      const k = dur ? Math.min(1, (now - t0) / dur) : 1;
      fijarProgreso(desde + (hasta - desde) * suave(k));
      if (k < 1 && activa) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);

    const c = cap.camara;
    map.flyTo({
      center: c.seguir ? puntoEn(hasta) : c.centro,
      zoom: c.zoom, pitch: c.pitch, bearing: c.bearing,
      padding, duration: reducir ? 0 : 2800, curve: 1.3, essential: true
    });
  }

  function ocultar() {
    activa = false;
    cancelAnimationFrame(raf);
    LAYERS.forEach((id) => map.getLayer(id) && map.setLayoutProperty(id, 'visibility', 'none'));
    lugares.forEach((l) => { l.el.hidden = true; });
    jinetesEl.hidden = true;
    fijarProgreso(0);
  }

  function destruir() {
    cancelAnimationFrame(raf);
    jinetes.remove();
    lugares.forEach((l) => l.marker.remove());
  }

  return { mostrar, ocultar, destruir };
}
