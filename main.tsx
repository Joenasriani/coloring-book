import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { colors, levels, Shape } from './levels';

const ui = {
  app: { fontFamily: 'Nunito, Arial, sans-serif', textAlign: 'center' as const, color: '#2f2f2f' },
  header: { background: 'linear-gradient(135deg, #7b1fa2 0%, #ec407a 100%)', color: 'white', padding: 'clamp(12px, 3vw, 22px)', boxShadow: '0 4px 12px rgba(0,0,0,0.22)', fontWeight: 800, borderBottomLeftRadius: 'clamp(14px, 4vw, 28px)', borderBottomRightRadius: 'clamp(14px, 4vw, 28px)', display: 'flex', justifyContent: 'center' },
  title: { margin: 0, fontSize: 'clamp(1.12rem, 5vw, 2.35rem)', lineHeight: 1.08 },
  desc: { margin: '6px 0 0', fontSize: 'clamp(0.78rem, 2.5vw, 0.98rem)', fontWeight: 700, opacity: 0.92 },
  card: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(8px, 2.5vw, 16px)', backgroundColor: '#fff', borderRadius: 20, boxShadow: '0 6px 18px rgba(0,0,0,0.12)', width: '100%', height: '100%' },
  svg: { width: '100%', height: '100%', display: 'block', touchAction: 'manipulation' as const, backgroundColor: '#fbfdff', borderRadius: 14 },
  palette: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(44px, 1fr))', gap: 'clamp(8px, 2vw, 12px)', padding: 'clamp(10px, 3vw, 18px)', backgroundColor: '#e8f5e9', border: '1.5px solid #c8e6c9', borderRadius: 22, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
  swatch: { width: '100%', minWidth: 44, aspectRatio: '1 / 1', borderRadius: '50%', cursor: 'pointer', border: '3px solid transparent' },
  nav: { display: 'grid', gridTemplateColumns: '1fr', padding: 'clamp(10px, 3vw, 16px)', backgroundColor: '#fdfdff', borderRadius: 22, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', gap: 12 },
  btn: { padding: 'clamp(12px, 3vw, 16px)', fontSize: 'clamp(0.95rem, 3vw, 1.1rem)', fontWeight: 800, borderRadius: 14, border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.16)', color: 'white', width: '100%' },
};

function Palette({ selected, setSelected }: { selected: string; setSelected: (c: string) => void }) {
  return <div className="palette-responsive" role="radiogroup" aria-label="Color palette" style={ui.palette}>{colors.map(c => {
    const white = c === '#FFFFFF';
    return <button key={c} aria-label={`Select ${c}`} role="radio" aria-checked={selected === c} onClick={() => setSelected(c)} style={{ ...ui.swatch, backgroundColor: c, border: `3px solid ${selected === c ? '#6a1b9a' : white ? '#999' : 'rgba(0,0,0,0.08)'}`, boxShadow: selected === c ? '0 0 0 5px #f48fb1' : '0 2px 5px rgba(0,0,0,0.18)', transform: selected === c ? 'scale(1.08)' : 'scale(1)', backgroundImage: white ? 'linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)' : undefined, backgroundSize: white ? '18px 18px' : undefined }} />;
  })}</div>;
}

function ShapeNode({ shape, color, selected, setFill }: { shape: Shape; color: string; selected: string; setFill: (id:string,c:string)=>void }) {
  const strokeOnly = shape.mode === 'stroke';
  const common = { fill: strokeOnly ? 'none' : color, stroke: strokeOnly ? color : '#242424', strokeWidth: shape.sw ?? (strokeOnly ? 2.5 : 1.7), strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, vectorEffect: 'non-scaling-stroke' as const, style: { cursor: 'pointer', outline: 'none' }, onClick: () => setFill(shape.id, selected), onKeyDown: (e: React.KeyboardEvent<SVGElement>) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFill(shape.id, selected); } }, 'aria-label': shape.label, tabIndex: 0, role: 'button', ...shape.props };
  if (shape.type === 'path') return <path {...common} />;
  if (shape.type === 'rect') return <rect {...common} />;
  if (shape.type === 'circle') return <circle {...common} />;
  if (shape.type === 'ellipse') return <ellipse {...common} />;
  return <polygon {...common} />;
}

function App() {
  const [selected, setSelected] = useState(colors[0]);
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState<Record<number, Record<string, string>>>({});
  const [fills, setFills] = useState<Record<string, string>>({});
  const svgRef = useRef<SVGSVGElement | null>(null);
  const level = levels[index];

  useEffect(() => {
    const initial = saved[index] || Object.fromEntries(level.shapes.map(x => [x.id, x.initial || '#eeeeee']));
    setFills(initial);
    setSaved(prev => ({ ...prev, [index]: initial }));
  }, [index]);

  const setFill = useCallback((id: string, color: string) => {
    setFills(prev => {
      const next = { ...prev, [id]: color };
      setSaved(all => ({ ...all, [index]: next }));
      return next;
    });
  }, [index]);

  const reset = () => {
    const next = Object.fromEntries(level.shapes.map(x => [x.id, x.initial || '#eeeeee']));
    setFills(next);
    setSaved(prev => ({ ...prev, [index]: next }));
  };

  const saveImage = () => {
    if (!svgRef.current) return;
    const svg = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.src = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`;
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1200, 1200);
      ctx.drawImage(img, 0, 0, 1200, 1200);
      const a = document.createElement('a');
      a.download = `coloring-level-${index + 1}.jpg`;
      a.href = canvas.toDataURL('image/jpeg', 0.92);
      a.click();
    };
  };

  const titleId = level.title.replace(/\s/g, '-') + '-title';
  const descId = level.title.replace(/\s/g, '-') + '-desc';

  return <div className="app-layout" style={ui.app}>
    <header className="app-header" style={ui.header}><div><h1 style={ui.title}>🎨 {level.title}</h1><p style={ui.desc}>{index + 1} / {levels.length} · {level.desc}</p></div></header>
    <div className="content-wrapper"><main className="drawing-section"><div className="drawing-container-responsive" style={ui.card}><svg ref={svgRef} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-labelledby={`${titleId} ${descId}`} style={ui.svg}><title id={titleId}>{level.title}</title><desc id={descId}>{level.desc}</desc>{level.shapes.map(x => <ShapeNode key={x.id} shape={x} color={fills[x.id] || x.initial || '#eeeeee'} selected={selected} setFill={setFill} />)}</svg></div></main>
      <aside className="controls-sidebar"><Palette selected={selected} setSelected={setSelected}/><footer className="nav-responsive" style={ui.nav}><button onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0} style={{...ui.btn, backgroundColor:'#ef5350', opacity:index===0?.55:1}}>Previous</button><button onClick={() => setIndex(Math.min(levels.length - 1, index + 1))} disabled={index === levels.length - 1} style={{...ui.btn, backgroundColor:'#42a5f5', opacity:index===levels.length-1?.55:1}}>Next</button><button onClick={reset} style={{...ui.btn, backgroundColor:'#7e57c2'}}>Reset Level</button><button onClick={saveImage} style={{...ui.btn, backgroundColor:'#66bb6a'}}>💾 Save Image</button></footer></aside></div>
  </div>;
}

const rootEl = document.getElementById('root');
if (rootEl) createRoot(rootEl).render(<App />);
