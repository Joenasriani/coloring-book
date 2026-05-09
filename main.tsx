import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { colors, levels, Shape } from './levels';

const MUSIC_SRC = './music/Color%20Parade.mp3';

const ui = {
  app: { fontFamily: 'Nunito, Arial, sans-serif', textAlign: 'center' as const, color: '#2f2f2f' },
  header: { background: 'linear-gradient(135deg, #7b1fa2 0%, #ec407a 100%)', color: 'white', padding: 'clamp(7px, 1.8vmin, 14px) var(--header-button-space) clamp(7px, 1.8vmin, 14px) clamp(10px, 2.2vmin, 18px)', boxShadow: '0 4px 12px rgba(0,0,0,0.22)', fontWeight: 800, borderBottomLeftRadius: 'clamp(12px, 3vmin, 24px)', borderBottomRightRadius: 'clamp(12px, 3vmin, 24px)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' as const, minWidth: 0 },
  musicButton: { position: 'absolute' as const, top: '50%', right: 'calc(env(safe-area-inset-right, 0px) + clamp(8px, 2vmin, 14px))', transform: 'translateY(-50%)', zIndex: 20, width: 'clamp(42px, 8vmin, 50px)', height: 'clamp(42px, 8vmin, 50px)', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.72)', background: 'rgba(255,255,255,0.92)', color: '#7b1fa2', boxShadow: '0 6px 18px rgba(0,0,0,0.22)', cursor: 'pointer', fontSize: 'clamp(18px, 4vmin, 22px)', display: 'grid', placeItems: 'center', backdropFilter: 'blur(8px)', flex: '0 0 auto' },
  title: { margin: 0, fontSize: 'clamp(0.95rem, 3.8vmin, 2rem)', lineHeight: 1.05, overflowWrap: 'anywhere' as const },
  desc: { margin: 'clamp(2px, 0.7vmin, 5px) 0 0', fontSize: 'clamp(0.68rem, 1.9vmin, 0.92rem)', fontWeight: 700, opacity: 0.92, lineHeight: 1.15, overflowWrap: 'anywhere' as const },
  card: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(5px, 1.5vmin, 12px)', backgroundColor: '#fff', borderRadius: 'clamp(14px, 3vmin, 22px)', boxShadow: '0 6px 18px rgba(0,0,0,0.12)', width: '100%', height: '100%', minWidth: 0, minHeight: 0 },
  svg: { width: '100%', height: '100%', display: 'block', touchAction: 'manipulation' as const, backgroundColor: '#fbfdff', borderRadius: 'clamp(10px, 2.4vmin, 16px)' },
  palette: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(var(--swatch-size), var(--swatch-size)))', justifyContent: 'center', gap: 'clamp(6px, 1.4vmin, 11px)', padding: 'clamp(7px, 1.8vmin, 14px)', backgroundColor: '#e8f5e9', border: '1.5px solid #c8e6c9', borderRadius: 'clamp(16px, 3vmin, 22px)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', alignContent: 'center' },
  swatch: { width: 'var(--swatch-size)', height: 'var(--swatch-size)', minWidth: 'var(--swatch-size)', minHeight: 'var(--swatch-size)', aspectRatio: '1 / 1', borderRadius: '50%', cursor: 'pointer', border: '4px solid transparent' },
  nav: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', padding: 'clamp(6px, 1.6vmin, 12px)', backgroundColor: '#fdfdff', borderRadius: 'clamp(16px, 3vmin, 22px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', gap: 'clamp(6px, 1.4vmin, 10px)', alignContent: 'center' },
  btn: { padding: 'clamp(8px, 1.8vmin, 14px)', fontSize: 'clamp(0.72rem, 2vmin, 0.98rem)', fontWeight: 800, borderRadius: 'clamp(12px, 2.5vmin, 16px)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.16)', color: 'white', width: '100%', lineHeight: 1.05, minWidth: 0 },
};

function Palette({ selected, setSelected }: { selected: string; setSelected: (c: string) => void }) {
  return <div className="palette-responsive" role="radiogroup" aria-label="Color palette" style={ui.palette}>{colors.map(c => {
    const white = c === '#FFFFFF';
    return <button key={c} aria-label={`Select ${c}`} role="radio" aria-checked={selected === c} onClick={() => setSelected(c)} style={{ ...ui.swatch, backgroundColor: c, border: `4px solid ${selected === c ? '#6a1b9a' : white ? '#999' : 'rgba(0,0,0,0.08)'}`, boxShadow: selected === c ? '0 0 0 clamp(4px, 1vmin, 6px) #f48fb1' : '0 2px 5px rgba(0,0,0,0.18)', transform: selected === c ? 'scale(1.06)' : 'scale(1)', backgroundImage: white ? 'linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)' : undefined, backgroundSize: white ? '18px 18px' : undefined }} />;
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
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [musicNeedsTap, setMusicNeedsTap] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const level = levels[index];

  useEffect(() => {
    const initial = saved[index] || Object.fromEntries(level.shapes.map(x => [x.id, x.initial || '#eeeeee']));
    setFills(initial);
    setSaved(prev => ({ ...prev, [index]: initial }));
  }, [index]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.45;
    audio.loop = true;

    audio.play()
      .then(() => {
        setIsMusicOn(true);
        setMusicNeedsTap(false);
      })
      .catch(() => {
        setIsMusicOn(false);
        setMusicNeedsTap(true);
      });
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play()
        .then(() => {
          setIsMusicOn(true);
          setMusicNeedsTap(false);
        })
        .catch(() => setMusicNeedsTap(true));
      return;
    }

    audio.pause();
    setIsMusicOn(false);
    setMusicNeedsTap(false);
  };

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
  const musicLabel = isMusicOn ? 'Turn music off' : 'Turn music on';

  return <div className="app-layout" style={ui.app}>
    <audio ref={audioRef} src={MUSIC_SRC} preload="auto" playsInline />
    <header className="app-header" style={ui.header}>
      <button type="button" onClick={toggleMusic} aria-label={musicLabel} title={musicNeedsTap ? 'Tap to start music' : musicLabel} style={{...ui.musicButton, opacity: musicNeedsTap ? 1 : 0.94}}>
        {isMusicOn ? '🔊' : '🎵'}
      </button>
      <div className="header-copy"><h1 style={ui.title}>🎨 {level.title}</h1><p className="level-description" style={ui.desc}>{index + 1} / {levels.length} · {level.desc}</p></div>
    </header>
    <div className="content-wrapper"><main className="drawing-section"><div className="drawing-container-responsive" style={ui.card}><svg ref={svgRef} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-labelledby={`${titleId} ${descId}`} style={ui.svg}><title id={titleId}>{level.title}</title><desc id={descId}>{level.desc}</desc>{level.shapes.map(x => <React.Fragment key={x.id}><ShapeNode shape={x} color={fills[x.id] || x.initial || '#eeeeee'} selected={selected} setFill={setFill} /></React.Fragment>)}</svg></div></main>
      <aside className="controls-sidebar"><Palette selected={selected} setSelected={setSelected}/><footer className="nav-responsive" style={ui.nav}><button onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0} style={{...ui.btn, backgroundColor:'#ef5350', opacity: index === 0 ? 0.55 : 1}}>Previous</button><button onClick={() => setIndex(Math.min(levels.length - 1, index + 1))} disabled={index === levels.length - 1} style={{...ui.btn, backgroundColor:'#42a5f5', opacity: index === levels.length - 1 ? 0.55 : 1}}>Next</button><button onClick={reset} style={{...ui.btn, backgroundColor:'#7e57c2'}}>Reset</button><button onClick={saveImage} style={{...ui.btn, backgroundColor:'#66bb6a'}}>💾 Save</button></footer></aside></div>
  </div>;
}

const rootEl = document.getElementById('root');
if (rootEl) createRoot(rootEl).render(<App />);
