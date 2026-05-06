import React, { useState, CSSProperties, useCallback, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const appStyles: CSSProperties = {
  fontFamily: 'Nunito, Arial, sans-serif',
  textAlign: 'center',
  color: '#333',
};

const headerStyles: CSSProperties = {
  background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
  color: 'white',
  padding: '20px 15px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  fontWeight: 'bold',
  borderBottomLeftRadius: '20px',
  borderBottomRightRadius: '20px',
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
};

const headerTitleStyles: CSSProperties = {
  margin: 0,
  fontSize: 'clamp(1.4rem, 5vw, 2.6rem)',
  lineHeight: 1.1,
};

const paletteContainerStyles: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  padding: '20px',
  justifyContent: 'center',
  backgroundColor: '#e8f5e9',
  border: '2px solid #c8e6c9',
  borderRadius: '20px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const colorButtonBaseStyles: CSSProperties = {
  width: '90px',
  height: '90px',
  borderRadius: '50%',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  flexShrink: 0,
  border: '3px solid transparent',
};

const drawingAreaContainerStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '15px',
  backgroundColor: '#fff',
  borderRadius: '15px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
};

const svgBaseStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
  boxSizing: 'border-box',
  touchAction: 'manipulation',
  backgroundColor: '#fdfdff',
  borderRadius: '10px',
};

const svgShapeBaseStyle: CSSProperties = {
  stroke: '#333',
  strokeWidth: 2.5,
  cursor: 'pointer',
  transition: 'fill 0.1s ease-out, stroke 0.1s ease-out',
  outline: 'none',
};

const levelNavigationContainerStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  padding: '15px',
  backgroundColor: '#fdfdff',
  borderTop: '1px solid #eee',
  borderRadius: '20px',
  boxShadow: '0 -2px 5px rgba(0,0,0,0.05)',
  gap: '15px',
};

const levelButtonStyles: CSSProperties = {
  padding: '15px 0',
  fontSize: '1.2em',
  fontWeight: 'bold',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  color: 'white',
  width: '100%',
};

interface ColorPaletteProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, selectedColor, onSelectColor }) => {
  return (
    <div
      className="palette-responsive"
      aria-label="Color palette"
      role="radiogroup"
      style={paletteContainerStyles}
    >
      {colors.map((color) => {
        const isSelected = selectedColor === color;
        const isWhite = color.toUpperCase() === '#FFFFFF';

        return (
          <button
            key={color}
            aria-label={`Select ${color} color`}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelectColor(color)}
            style={{
              ...colorButtonBaseStyles,
              backgroundColor: color,
              backgroundImage: isWhite
                ? 'linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)'
                : undefined,
              backgroundSize: isWhite ? '18px 18px' : undefined,
              backgroundPosition: isWhite ? '0 0, 0 9px, 9px -9px, -9px 0px' : undefined,
              border: `3px solid ${isSelected ? '#6a1b9a' : isWhite ? '#999' : 'transparent'}`,
              boxShadow: isSelected ? '0 0 0 5px #f48fb1' : '0 2px 5px rgba(0,0,0,0.2)',
              transform: isSelected ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        );
      })}
    </div>
  );
};

interface SvgShape {
  id: string;
  type: 'path' | 'rect' | 'circle';
  ariaLabel: string;
  initialColor: string;
  colorMode?: 'fill' | 'stroke';
  props: { [key: string]: string | number };
}

const houseShapes: SvgShape[] = [
  { id: 'roof', type: 'path', ariaLabel: 'Roof', initialColor: '#ccc', props: { d: 'M100 200 L200 100 L300 200 Z' } },
  { id: 'houseBody', type: 'rect', ariaLabel: 'House body', initialColor: '#ccc', props: { x: '100', y: '200', width: '200', height: '150' } },
  { id: 'door', type: 'rect', ariaLabel: 'Door', initialColor: '#ccc', props: { x: '170', y: '270', width: '60', height: '80' } },
  { id: 'windowLeft', type: 'rect', ariaLabel: 'Left window', initialColor: '#ccc', props: { x: '120', y: '220', width: '40', height: '40' } },
  { id: 'windowRight', type: 'rect', ariaLabel: 'Right window', initialColor: '#ccc', props: { x: '240', y: '220', width: '40', height: '40' } },
  { id: 'chimney', type: 'rect', ariaLabel: 'Chimney', initialColor: '#ccc', props: { x: '230', y: '120', width: '40', height: '50' } },
];

const sunShapes: SvgShape[] = [
  { id: 'sunCenter', type: 'circle', ariaLabel: 'Sun center', initialColor: '#ccc', props: { cx: '350', cy: '70', r: '30' } },
  { id: 'sunRay1', type: 'path', ariaLabel: 'Sun ray 1', initialColor: '#ccc', colorMode: 'stroke', props: { d: 'M350 40 L350 20' } },
  { id: 'sunRay2', type: 'path', ariaLabel: 'Sun ray 2', initialColor: '#ccc', colorMode: 'stroke', props: { d: 'M370 50 L385 40' } },
  { id: 'sunRay3', type: 'path', ariaLabel: 'Sun ray 3', initialColor: '#ccc', colorMode: 'stroke', props: { d: 'M380 70 L390 70' } },
  { id: 'sunRay4', type: 'path', ariaLabel: 'Sun ray 4', initialColor: '#ccc', colorMode: 'stroke', props: { d: 'M370 90 L385 100' } },
  { id: 'sunRay5', type: 'path', ariaLabel: 'Sun ray 5', initialColor: '#ccc', colorMode: 'stroke', props: { d: 'M350 100 L350 120' } },
  { id: 'sunRay6', type: 'path', ariaLabel: 'Sun ray 6', initialColor: '#ccc', colorMode: 'stroke', props: { d: 'M330 90 L315 100' } },
  { id: 'sunRay7', type: 'path', ariaLabel: 'Sun ray 7', initialColor: '#ccc', colorMode: 'stroke', props: { d: 'M320 70 L310 70' } },
  { id: 'sunRay8', type: 'path', ariaLabel: 'Sun ray 8', initialColor: '#ccc', colorMode: 'stroke', props: { d: 'M330 50 L315 40' } },
];

const cloudShapes: SvgShape[] = [
  { id: 'cloudMain', type: 'path', ariaLabel: 'Cloud', initialColor: '#ccc', props: { d: 'M50 80 C30 60, 30 20, 70 20 C100 0, 140 20, 160 40 C180 50, 180 80, 150 90 C120 100, 80 100, 50 80 Z' } },
];

const treeShapes: SvgShape[] = [
  { id: 'treeTrunk', type: 'rect', ariaLabel: 'Tree trunk', initialColor: '#ccc', props: { x: '50', y: '250', width: '40', height: '100' } },
  { id: 'treeCanopy1', type: 'circle', ariaLabel: 'Tree canopy part 1', initialColor: '#ccc', props: { cx: '70', cy: '220', r: '35' } },
  { id: 'treeCanopy2', type: 'circle', ariaLabel: 'Tree canopy part 2', initialColor: '#ccc', props: { cx: '100', cy: '230', r: '30' } },
  { id: 'treeCanopy3', type: 'circle', ariaLabel: 'Tree canopy part 3', initialColor: '#ccc', props: { cx: '40', cy: '230', r: '30' } },
];

const fenceShapes: SvgShape[] = [
  { id: 'fencePost1', type: 'rect', ariaLabel: 'Fence post 1', initialColor: '#ccc', props: { x: '20', y: '300', width: '15', height: '50' } },
  { id: 'fencePost2', type: 'rect', ariaLabel: 'Fence post 2', initialColor: '#ccc', props: { x: '45', y: '300', width: '15', height: '50' } },
  { id: 'fencePost3', type: 'rect', ariaLabel: 'Fence post 3', initialColor: '#ccc', props: { x: '70', y: '300', width: '15', height: '50' } },
  { id: 'fenceRail', type: 'rect', ariaLabel: 'Fence rail', initialColor: '#ccc', props: { x: '15', y: '310', width: '80', height: '10' } },
];

const flowerShapes: SvgShape[] = [
  { id: 'flowerStem', type: 'rect', ariaLabel: 'Flower stem', initialColor: '#ccc', props: { x: '320', y: '300', width: '10', height: '50' } },
  { id: 'flowerCenter', type: 'circle', ariaLabel: 'Flower center', initialColor: '#ccc', props: { cx: '325', cy: '280', r: '10' } },
  { id: 'flowerPetal1', type: 'circle', ariaLabel: 'Flower petal 1', initialColor: '#ccc', props: { cx: '325', cy: '265', r: '8' } },
  { id: 'flowerPetal2', type: 'circle', ariaLabel: 'Flower petal 2', initialColor: '#ccc', props: { cx: '338', cy: '272', r: '8' } },
  { id: 'flowerPetal3', type: 'circle', ariaLabel: 'Flower petal 3', initialColor: '#ccc', props: { cx: '338', cy: '288', r: '8' } },
  { id: 'flowerPetal4', type: 'circle', ariaLabel: 'Flower petal 4', initialColor: '#ccc', props: { cx: '325', cy: '295', r: '8' } },
  { id: 'flowerPetal5', type: 'circle', ariaLabel: 'Flower petal 5', initialColor: '#ccc', props: { cx: '312', cy: '288', r: '8' } },
  { id: 'flowerPetal6', type: 'circle', ariaLabel: 'Flower petal 6', initialColor: '#ccc', props: { cx: '312', cy: '272', r: '8' } },
];

const allLevels = [
  { levelTitle: 'Level 1: My House', shapes: [...houseShapes] },
  { levelTitle: 'Level 2: Sunny Day', shapes: [...houseShapes, ...sunShapes, ...cloudShapes] },
  { levelTitle: 'Level 3: Green Garden', shapes: [...houseShapes, ...sunShapes, ...cloudShapes, ...treeShapes] },
  { levelTitle: 'Level 4: Fenced Yard', shapes: [...houseShapes, ...sunShapes, ...cloudShapes, ...treeShapes, ...fenceShapes] },
  { levelTitle: 'Level 5: Flower Power', shapes: [...houseShapes, ...sunShapes, ...cloudShapes, ...treeShapes, ...fenceShapes, ...flowerShapes] },
];

interface DrawingAreaProps {
  selectedColor: string;
  shapes: SvgShape[];
  levelTitle: string;
  fillColors: Record<string, string>;
  onColorPartFill: (partId: string, color: string) => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

const DrawingArea: React.FC<DrawingAreaProps> = ({ selectedColor, shapes, levelTitle, fillColors, onColorPartFill, svgRef }) => {
  const handlePartClick = (partName: string) => {
    onColorPartFill(partName, selectedColor);
  };

  const handlePartKeyDown = (event: React.KeyboardEvent<SVGElement>, partName: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePartClick(partName);
    }
  };

  const svgTitleId = `${levelTitle.replace(/\s/g, '-')}-title`;
  const svgDescId = `${levelTitle.replace(/\s/g, '-')}-desc`;

  return (
    <div
      className="drawing-container-responsive"
      aria-label={`Coloring drawing area for ${levelTitle}`}
      style={drawingAreaContainerStyles}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        aria-labelledby={`${svgTitleId} ${svgDescId}`}
        style={svgBaseStyle}
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={svgTitleId}>{levelTitle}</title>
        <desc id={svgDescId}>An outlined drawing of {levelTitle} for coloring.</desc>

        {shapes.map((shape) => {
          const color = fillColors[shape.id] || shape.initialColor;
          const isStrokeColored = shape.colorMode === 'stroke';
          const commonProps = {
            key: shape.id,
            fill: isStrokeColored ? 'none' : color,
            stroke: isStrokeColored ? color : '#333',
            strokeWidth: isStrokeColored ? 8 : 2.5,
            strokeLinecap: isStrokeColored ? 'round' as const : undefined,
            style: svgShapeBaseStyle,
            onClick: () => handlePartClick(shape.id),
            onKeyDown: (event: React.KeyboardEvent<SVGElement>) => handlePartKeyDown(event, shape.id),
            'aria-label': shape.ariaLabel,
            tabIndex: 0,
            role: 'button',
            ...shape.props,
          };

          if (shape.type === 'path') return <path {...commonProps} />;
          if (shape.type === 'rect') return <rect {...commonProps} />;
          if (shape.type === 'circle') return <circle {...commonProps} />;
          return null;
        })}
      </svg>
    </div>
  );
};

const ColoringBook: React.FC = () => {
  const colors = [
    '#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#800080', '#FFC0CB', '#A52A2A', '#FFFFFF'
  ];
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [levelColoringState, setLevelColoringState] = useState<Record<number, Record<string, string>>>({});
  const [currentLevelColors, setCurrentLevelColors] = useState<Record<string, string>>({});

  const svgRef = useRef<SVGSVGElement | null>(null);

  const currentLevel = allLevels[currentLevelIndex];
  const isFirstLevel = currentLevelIndex === 0;
  const isLastLevel = currentLevelIndex === allLevels.length - 1;

  useEffect(() => {
    if (levelColoringState[currentLevelIndex]) {
      setCurrentLevelColors(levelColoringState[currentLevelIndex]);
    } else {
      const currentLevelShapes = allLevels[currentLevelIndex].shapes;
      const previousLevelIndex = currentLevelIndex - 1;
      const previousLevelColors = levelColoringState[previousLevelIndex] || {};

      const newColorsForCurrentLevel = currentLevelShapes.reduce((acc, shape) => {
        acc[shape.id] = previousLevelColors[shape.id] || shape.initialColor;
        return acc;
      }, {} as Record<string, string>);

      setCurrentLevelColors(newColorsForCurrentLevel);
      setLevelColoringState(prevState => ({
        ...prevState,
        [currentLevelIndex]: newColorsForCurrentLevel,
      }));
    }
  }, [currentLevelIndex, levelColoringState]);

  const handleColorPartFill = useCallback((partId: string, newColor: string) => {
    setCurrentLevelColors(prevCurrentColors => {
      const updated = {
        ...prevCurrentColors,
        [partId]: newColor,
      };
      setLevelColoringState(prevState => ({
        ...prevState,
        [currentLevelIndex]: updated,
      }));
      return updated;
    });
  }, [currentLevelIndex]);

  const goToNextLevel = () => {
    if (!isLastLevel) setCurrentLevelIndex((prevIndex) => prevIndex + 1);
  };

  const goToPreviousLevel = () => {
    if (!isFirstLevel) setCurrentLevelIndex((prevIndex) => prevIndex - 1);
  };

  const handleSaveImage = () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const exportSize = 1200;

    canvas.width = exportSize;
    canvas.height = exportSize;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const encodedSvg = window.btoa(unescape(encodeURIComponent(svgData)));
    img.src = `data:image/svg+xml;base64,${encodedSvg}`;

    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, exportSize, exportSize);

      const a = document.createElement('a');
      a.download = `coloring-level-${currentLevelIndex + 1}.jpg`;
      a.href = canvas.toDataURL('image/jpeg', 0.92);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  };

  return (
    <div className="app-layout" style={appStyles}>
      <header className="app-header" style={headerStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span aria-hidden="true">🎨</span>
          <h1 style={headerTitleStyles}>{currentLevel.levelTitle}</h1>
          <span aria-hidden="true">🖍️</span>
        </div>
      </header>

      <div className="content-wrapper">
        <div className="drawing-section">
          <DrawingArea
            selectedColor={selectedColor}
            shapes={currentLevel.shapes}
            levelTitle={currentLevel.levelTitle}
            fillColors={currentLevelColors}
            onColorPartFill={handleColorPartFill}
            svgRef={svgRef}
          />
        </div>

        <aside className="controls-sidebar" aria-label="Coloring controls">
          <ColorPalette colors={colors} selectedColor={selectedColor} onSelectColor={setSelectedColor} />

          <footer className="nav-responsive" style={levelNavigationContainerStyles}>
            <button
              onClick={goToNextLevel}
              disabled={isLastLevel}
              aria-label="Next Level"
              style={{
                ...levelButtonStyles,
                backgroundColor: '#42a5f5',
                opacity: isLastLevel ? 0.6 : 1,
                cursor: isLastLevel ? 'not-allowed' : 'pointer',
              }}
            >
              Next Level
            </button>
            <button
              onClick={goToPreviousLevel}
              disabled={isFirstLevel}
              aria-label="Previous Level"
              style={{
                ...levelButtonStyles,
                backgroundColor: '#ef5350',
                opacity: isFirstLevel ? 0.6 : 1,
                cursor: isFirstLevel ? 'not-allowed' : 'pointer',
              }}
            >
              Previous Level
            </button>
            <button
              onClick={handleSaveImage}
              aria-label="Save coloring as image"
              style={{
                ...levelButtonStyles,
                backgroundColor: '#66bb6a',
              }}
            >
              💾 Save Image
            </button>
          </footer>
        </aside>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<ColoringBook />);
}
