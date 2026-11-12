import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Maximize2, X } from 'lucide-react';
import { CAPITULOS, HISTORIA } from '../../story/entreCerrosYBalas';

const glass = 'bg-[#07111d]/85 border border-white/12 backdrop-blur-md';

// Panel de la historia. Celular: hoja inferior (52% del alto). Escritorio: columna izquierda.
export default function StoryPanel({ index, onChange, onClose }) {
  const cap = CAPITULOS[index];
  const total = CAPITULOS.length;
  const ultimo = index === total - 1;
  const [ampliada, setAmpliada] = useState(false);
  const scrollRef = useRef(null);
  const toque = useRef(null);

  const ir = (i) => onChange(Math.max(0, Math.min(total - 1, i)));

  // teclado: flechas para avanzar, Escape para salir
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return;
      if (e.key === 'Escape') { if (ampliada) setAmpliada(false); else onClose(); }
      if (ampliada) return;
      if (e.key === 'ArrowRight') ir(index + 1);
      if (e.key === 'ArrowLeft') ir(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // cada capítulo empieza arriba
  useEffect(() => { scrollRef.current?.scrollTo(0, 0); }, [index]);

  // precarga la lámina siguiente
  useEffect(() => {
    const sig = CAPITULOS[index + 1];
    if (sig) { const im = new Image(); im.src = sig.imagen; }
  }, [index]);

  // deslizar a los costados cambia de capítulo
  const onTouchStart = (e) => { const t = e.touches[0]; toque.current = { x: t.clientX, y: t.clientY }; };
  const onTouchEnd = (e) => {
    const s = toque.current; toque.current = null;
    if (!s) return;
    const t = e.changedTouches[0], dx = t.clientX - s.x, dy = t.clientY - s.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) ir(index + (dx < 0 ? 1 : -1));
  };

  return (
    <>
      <section
        className={`${glass} historia-panel fixed z-20 inset-x-2 bottom-2 h-[52svh] rounded-2xl flex flex-col overflow-hidden
          md:absolute md:inset-x-auto md:left-4 md:top-[7.25rem] md:bottom-4 md:h-auto md:w-[390px] md:rounded-xl`}
        aria-label={`Historia: ${HISTORIA.titulo}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      >
        <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-3 text-[11px] tracking-wide">
          <span className="font-bold uppercase text-teal-300 truncate">Historia · {HISTORIA.titulo}</span>
          <span className="flex items-center gap-3 shrink-0">
            <span className="text-slate-400 tabular-nums" aria-live="polite">{index + 1}/{total}</span>
            <button onClick={onClose} aria-label="Salir de la historia" className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </span>
        </div>
        <div className="px-4 flex gap-1" aria-hidden="true">
          {CAPITULOS.map((c, i) => (
            <button key={c.id} tabIndex={-1} onClick={() => ir(i)}
              className={`h-1 flex-1 rounded-full transition-colors ${i <= index ? 'bg-teal-300' : 'bg-white/15'}`} />
          ))}
        </div>

        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pt-3 pb-4">
          <div key={cap.id} className="historia-entra flex flex-col gap-3">
            {cap.etiqueta && <p className="text-[11px] font-bold uppercase tracking-wider text-teal-300">{cap.etiqueta}</p>}
            <div>
              <h2 className="text-2xl font-bold leading-tight">{cap.titulo}</h2>
              {cap.mapa && <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400"><MapPin className="w-3.5 h-3.5 text-amber-400" />{cap.mapa}</p>}
            </div>
            <button onClick={() => setAmpliada(true)} aria-label="Ver la lámina ampliada"
              className="group relative block w-full aspect-video rounded-lg overflow-hidden border border-white/12 bg-[#050d17]">
              <img src={cap.imagen} alt={`Lámina ${index + 1}: ${cap.titulo}`} className="w-full h-full object-cover" />
              <span className="absolute right-2 bottom-2 flex items-center gap-1 rounded-md bg-[#07111d]/85 border border-white/12 px-2 py-1 text-[10px] text-slate-200 opacity-90 group-hover:opacity-100">
                <Maximize2 className="w-3 h-3" /> Lámina {index + 1}
              </span>
            </button>
            {cap.destacado && <p className="text-[15px] font-semibold text-teal-100">{cap.destacado}</p>}
            {cap.parrafos?.map((p) => <p key={p} className="text-[14px] leading-relaxed text-slate-300">{p}</p>)}
            {cap.vinetas && (
              <ul className="space-y-1.5 text-[14px] text-slate-300">
                {cap.vinetas.map((v) => <li key={v} className="flex gap-2"><i className="mt-2 w-1.5 h-1.5 rounded-full shrink-0 bg-amber-400" />{v}</li>)}
              </ul>
            )}
            {cap.tarjetas?.map((t) => (
              <div key={t.titulo} className="rounded-lg border border-white/12 bg-white/[.03] p-3">
                <h3 className="text-[15px] font-bold text-teal-200">{t.titulo}</h3>
                <div className="mt-1.5 space-y-1 text-[13px] leading-relaxed text-slate-300">{t.lineas.map((l) => <p key={l}>{l}</p>)}</div>
              </div>
            ))}
            {cap.pregunta && <p className="text-xl font-bold text-amber-300">{cap.pregunta}</p>}
            {cap.credito && <p className="text-xs text-slate-400">{cap.credito}</p>}
          </div>
        </div>

        <div className="px-3 py-2.5 border-t border-white/10 flex items-center gap-2">
          <button onClick={() => ir(index - 1)} disabled={index === 0}
            className="px-3 py-2 rounded-lg border border-white/15 text-slate-300 text-xs flex items-center gap-1 hover:bg-white/5 disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <span className="flex-1 text-center text-[10px] text-slate-500 md:hidden">Deslizá para cambiar</span>
          <span className="flex-1 hidden md:block" />
          <button onClick={() => (ultimo ? onClose() : ir(index + 1))}
            className="px-4 py-2 rounded-lg bg-teal-400 text-[#04141c] font-bold text-xs flex items-center gap-1 hover:bg-teal-300">
            {ultimo ? 'Volver al mapa' : <>Siguiente <ChevronRight className="w-4 h-4" /></>}
          </button>
        </div>
      </section>

      {ampliada && (
        <div className="fixed inset-0 z-50 bg-[#050d17]/95 flex flex-col items-center justify-center p-3 gap-3" role="dialog" aria-label={`Lámina ${index + 1}`}
          onClick={() => setAmpliada(false)}>
          <img src={cap.imagen} alt={`Lámina ${index + 1}: ${cap.titulo}`} className="max-w-full max-h-[85vh] rounded-lg border border-white/12 object-contain" />
          <p className="text-[11px] text-slate-400 text-center">Girá el teléfono para verla más grande · Tocá para cerrar</p>
        </div>
      )}
    </>
  );
}
