import React, { useState, CSSProperties, useCallback, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

type ShapeType = 'path' | 'rect' | 'circle' | 'ellipse' | 'polygon';
type ColorMode = 'fill' | 'stroke';

interface SvgShape {
  id: string;
  type: ShapeType;
  ariaLabel: string;
  initialColor: string;
  colorMode?: ColorMode;
  props: Record<string, string | number>;
}

interface ColoringLevel {
  levelTitle: string;
  description: string;
  shapes: SvgShape[];
}

const appStyles: CSSProperties = {
  fontFamily: 'Nunito, Arial, sans-serif',
  textAlign: 'center',
  color: '#333',
};

const headerStyles: CSSProperties = {
  background: 'linear-gradient(135deg, #7b1fa2 0%, #ec407a 100%)',
  color: 'white',
  padding: 'clamp(12px, 3vw, 22px)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.24)',
  fontWeight: 'bold',
  borderBottomLeftRadius: 'clamp(14px, 4vw, 28px)',
  borderBottomRightRadius: 'clamp(14px, 4vw, 28px)',
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const headerTitleStyles: CSSProperties = {
  margin: 0,
  fontSize: 'clamp(1.15rem, 5vw, 2.6rem)',
  lineHeight: 1.1,
};

const levelDescriptionStyles: CSSProperties = {
  margin: '6px 0 0',
  fontSize: 'clamp(0.82rem, 2.5vw, 1rem)',
  fontWeight: 700,
  opacity: 0.92,
};

const paletteContainerStyles: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(44px, 1fr))',
  gap: 'clamp(8px, 2vw, 12px)',
  padding: 'clamp(10px, 3vw, 18px)',
  justifyContent: 'center',
  backgroundColor: '#e8f5e9',
  border: '2px solid #c8e6c9',
  borderRadius: '22px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const colorButtonBaseStyles: CSSProperties = {
  width: '100%',
  minWidth: 44,
  aspectRatio: '1 / 1',
  borderRadius: '50%',
  cursor: 'pointer',
  transition: 'transform 0.16s ease, box-shadow 0.16s ease',
  border: '3px solid transparent',
};

const drawingAreaContainerStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'clamp(8px, 2.5vw, 16px)',
  backgroundColor: '#fff',
  borderRadius: '20px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
  width: '100%',
  height: '100%',
};

const svgBaseStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
  touchAction: 'manipulation',
  backgroundColor: '#fbfdff',
  borderRadius: '14px',
};

const svgShapeBaseStyle: CSSProperties = {
  cursor: 'pointer',
  transition: 'fill 0.1s ease-out, stroke 0.1s ease-out, opacity 0.1s ease-out',
  outline: 'none',
};

const levelNavigationContainerStyles: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  padding: 'clamp(10px, 3vw, 16px)',
  backgroundColor: '#fdfdff',
  borderRadius: '22px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  gap: '12px',
};

const levelButtonStyles: CSSProperties = {
  padding: 'clamp(12px, 3vw, 16px)',
  fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
  fontWeight: 800,
  borderRadius: '14px',
  border: 'none',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, opacity 0.2s ease',
  boxShadow: '0 4px 8px rgba(0,0,0,0.16)',
  color: 'white',
  width: '100%',
};

const colors = [
  '#F44336', '#FF9800', '#FFEB3B', '#4CAF50', '#03A9F4', '#3F51B5',
  '#9C27B0', '#E91E63', '#795548', '#9E9E9E', '#000000', '#FFFFFF'
];

const s = (
  id: string,
  type: ShapeType,
  ariaLabel: string,
  props: Record<string, string | number>,
  initialColor = '#d8d8d8',
  colorMode: ColorMode = 'fill',
): SvgShape => ({ id, type, ariaLabel, props, initialColor, colorMode });

const allLevels: ColoringLevel[] = [
  {
    levelTitle: 'Level 1: Cozy House',
    description: 'A friendly starter scene with large color zones.',
    shapes: [
      s('sky', 'rect', 'Sky background', { x: 0, y: 0, width: 400, height: 250 }, '#d8ecff'),
      s('grass', 'rect', 'Grass field', { x: 0, y: 250, width: 400, height: 150 }, '#d8f4d3'),
      s('sun', 'circle', 'Sun', { cx: 330, cy: 64, r: 34 }, '#f7d46b'),
      s('cloud1', 'path', 'Left cloud', { d: 'M42 86 C38 64 66 52 82 67 C97 40 137 53 135 84 C153 86 160 112 140 120 L55 120 C32 118 22 94 42 86 Z' }, '#eeeeee'),
      s('roof', 'polygon', 'House roof', { points: '100,190 200,95 306,190' }, '#d8d8d8'),
      s('houseBody', 'rect', 'House body', { x: 112, y: 190, width: 176, height: 132, rx: 8 }, '#d8d8d8'),
      s('door', 'rect', 'Front door', { x: 178, y: 248, width: 44, height: 74, rx: 8 }, '#d8d8d8'),
      s('leftWindow', 'rect', 'Left window', { x: 132, y: 215, width: 42, height: 38, rx: 6 }, '#d8d8d8'),
      s('rightWindow', 'rect', 'Right window', { x: 226, y: 215, width: 42, height: 38, rx: 6 }, '#d8d8d8'),
      s('path', 'path', 'Garden path', { d: 'M178 322 L222 322 L255 400 L145 400 Z' }, '#d8d8d8'),
      s('treeTop', 'circle', 'Tree top', { cx: 66, cy: 230, r: 38 }, '#d8d8d8'),
      s('treeTrunk', 'rect', 'Tree trunk', { x: 54, y: 250, width: 24, height: 72, rx: 5 }, '#d8d8d8'),
    ],
  },
  {
    levelTitle: 'Level 2: Garden Friends',
    description: 'Flowers, butterfly, pond, and mushrooms.',
    shapes: [
      s('ground', 'rect', 'Garden ground', { x: 0, y: 230, width: 400, height: 170 }, '#d8f4d3'),
      s('pond', 'ellipse', 'Small pond', { cx: 290, cy: 315, rx: 72, ry: 34 }, '#d8d8d8'),
      s('butterflyBody', 'ellipse', 'Butterfly body', { cx: 200, cy: 115, rx: 10, ry: 36 }, '#d8d8d8'),
      s('leftWingTop', 'ellipse', 'Butterfly left top wing', { cx: 174, cy: 92, rx: 30, ry: 42 }, '#d8d8d8'),
      s('rightWingTop', 'ellipse', 'Butterfly right top wing', { cx: 226, cy: 92, rx: 30, ry: 42 }, '#d8d8d8'),
      s('leftWingBottom', 'ellipse', 'Butterfly left bottom wing', { cx: 177, cy: 143, rx: 24, ry: 32 }, '#d8d8d8'),
      s('rightWingBottom', 'ellipse', 'Butterfly right bottom wing', { cx: 223, cy: 143, rx: 24, ry: 32 }, '#d8d8d8'),
      s('flower1Stem', 'path', 'Tall flower stem', { d: 'M82 328 C84 285 88 260 96 232' }, '#7ecb75', 'stroke'),
      s('flower1Center', 'circle', 'Tall flower center', { cx: 98, cy: 222, r: 12 }, '#d8d8d8'),
      s('flower1Petals', 'path', 'Tall flower petals', { d: 'M98 188 C116 202 120 222 100 234 C80 222 80 202 98 188 Z M64 222 C78 204 98 202 110 222 C98 242 78 242 64 222 Z' }, '#d8d8d8'),
      s('mushroomCap', 'path', 'Mushroom cap', { d: 'M48 312 C56 272 118 272 128 312 Z' }, '#d8d8d8'),
      s('mushroomStem', 'rect', 'Mushroom stem', { x: 78, y: 307, width: 24, height: 45, rx: 10 }, '#d8d8d8'),
      s('rock', 'ellipse', 'Garden rock', { cx: 350, cy: 248, rx: 30, ry: 18 }, '#d8d8d8'),
    ],
  },
  {
    levelTitle: 'Level 3: Friendly Robot',
    description: 'A robot scene for robotics fans.',
    shapes: [
      s('robotHead', 'rect', 'Robot head', { x: 130, y: 72, width: 140, height: 92, rx: 18 }, '#d8d8d8'),
      s('leftEye', 'circle', 'Robot left eye', { cx: 170, cy: 112, r: 14 }, '#d8d8d8'),
      s('rightEye', 'circle', 'Robot right eye', { cx: 230, cy: 112, r: 14 }, '#d8d8d8'),
      s('mouth', 'rect', 'Robot mouth', { x: 170, y: 140, width: 60, height: 10, rx: 5 }, '#d8d8d8'),
      s('antenna', 'path', 'Robot antenna', { d: 'M200 72 L200 36' }, '#d8d8d8', 'stroke'),
      s('antennaBall', 'circle', 'Robot antenna ball', { cx: 200, cy: 28, r: 12 }, '#d8d8d8'),
      s('body', 'rect', 'Robot body', { x: 112, y: 178, width: 176, height: 120, rx: 20 }, '#d8d8d8'),
      s('screen', 'rect', 'Robot chest screen', { x: 155, y: 202, width: 90, height: 44, rx: 8 }, '#d8d8d8'),
      s('leftArm', 'path', 'Robot left arm', { d: 'M112 210 L60 250 L82 274 L128 236' }, '#d8d8d8'),
      s('rightArm', 'path', 'Robot right arm', { d: 'M288 210 L340 250 L318 274 L272 236' }, '#d8d8d8'),
      s('leftWheel', 'circle', 'Left wheel', { cx: 150, cy: 326, r: 28 }, '#d8d8d8'),
      s('rightWheel', 'circle', 'Right wheel', { cx: 250, cy: 326, r: 28 }, '#d8d8d8'),
    ],
  },
  {
    levelTitle: 'Level 4: Space Rocket',
    description: 'Rocket, planets, stars, and moon.',
    shapes: [
      s('space', 'rect', 'Space background', { x: 0, y: 0, width: 400, height: 400 }, '#eeeeee'),
      s('planet', 'circle', 'Planet', { cx: 72, cy: 96, r: 38 }, '#d8d8d8'),
      s('planetRing', 'ellipse', 'Planet ring', { cx: 72, cy: 96, rx: 62, ry: 16 }, '#d8d8d8', 'stroke'),
      s('rocketBody', 'path', 'Rocket body', { d: 'M200 70 C252 118 248 230 200 282 C152 230 148 118 200 70 Z' }, '#d8d8d8'),
      s('window', 'circle', 'Rocket window', { cx: 200, cy: 150, r: 24 }, '#d8d8d8'),
      s('leftFin', 'path', 'Left rocket fin', { d: 'M166 230 L112 292 L170 278 Z' }, '#d8d8d8'),
      s('rightFin', 'path', 'Right rocket fin', { d: 'M234 230 L288 292 L230 278 Z' }, '#d8d8d8'),
      s('flameOuter', 'path', 'Outer rocket flame', { d: 'M170 282 C180 348 220 348 230 282 Z' }, '#d8d8d8'),
      s('flameInner', 'path', 'Inner rocket flame', { d: 'M188 286 C194 330 208 330 214 286 Z' }, '#d8d8d8'),
      s('moon', 'circle', 'Moon', { cx: 326, cy: 76, r: 30 }, '#d8d8d8'),
      s('star1', 'polygon', 'Star one', { points: '325,210 333,229 354,229 337,242 344,262 325,250 306,262 313,242 296,229 317,229' }, '#d8d8d8'),
      s('star2', 'polygon', 'Star two', { points: '82,260 89,274 105,276 93,287 96,303 82,295 68,303 71,287 59,276 75,274' }, '#d8d8d8'),
    ],
  },
  {
    levelTitle: 'Level 5: Underwater World',
    description: 'Fish, turtle, coral, seaweed, and bubbles.',
    shapes: [
      s('water', 'rect', 'Water background', { x: 0, y: 0, width: 400, height: 400 }, '#d8ecff'),
      s('sand', 'path', 'Sandy sea floor', { d: 'M0 330 C80 300 145 360 225 326 C305 292 345 342 400 318 L400 400 L0 400 Z' }, '#d8d8d8'),
      s('fishBody', 'ellipse', 'Fish body', { cx: 142, cy: 150, rx: 62, ry: 36 }, '#d8d8d8'),
      s('fishTail', 'polygon', 'Fish tail', { points: '82,150 34,114 34,186' }, '#d8d8d8'),
      s('fishFin', 'path', 'Fish fin', { d: 'M140 150 L166 126 L176 162 Z' }, '#d8d8d8'),
      s('fishEye', 'circle', 'Fish eye', { cx: 170, cy: 142, r: 8 }, '#ffffff'),
      s('turtleShell', 'ellipse', 'Turtle shell', { cx: 278, cy: 222, rx: 52, ry: 36 }, '#d8d8d8'),
      s('turtleHead', 'circle', 'Turtle head', { cx: 334, cy: 215, r: 20 }, '#d8d8d8'),
      s('turtleFlipper1', 'ellipse', 'Turtle top flipper', { cx: 256, cy: 184, rx: 22, ry: 12 }, '#d8d8d8'),
      s('turtleFlipper2', 'ellipse', 'Turtle bottom flipper', { cx: 256, cy: 258, rx: 22, ry: 12 }, '#d8d8d8'),
      s('coral', 'path', 'Coral', { d: 'M92 346 L92 290 M92 314 L62 286 M92 322 L122 286 M92 306 L104 270' }, '#d8d8d8', 'stroke'),
      s('seaweed', 'path', 'Seaweed', { d: 'M310 350 C280 320 340 286 310 250 M338 350 C312 312 372 292 344 252' }, '#d8d8d8', 'stroke'),
      s('bubble1', 'circle', 'Bubble one', { cx: 236, cy: 102, r: 12 }, '#ffffff'),
      s('bubble2', 'circle', 'Bubble two', { cx: 270, cy: 76, r: 8 }, '#ffffff'),
    ],
  },
  {
    levelTitle: 'Level 6: Safari Jeep',
    description: 'Jeep, mountains, trees, and a lion.',
    shapes: [
      s('skySafari', 'rect', 'Safari sky', { x: 0, y: 0, width: 400, height: 230 }, '#d8ecff'),
      s('mountain1', 'polygon', 'Left mountain', { points: '0,230 94,95 190,230' }, '#d8d8d8'),
      s('mountain2', 'polygon', 'Right mountain', { points: '130,230 260,80 400,230' }, '#d8d8d8'),
      s('plain', 'rect', 'Safari plain', { x: 0, y: 230, width: 400, height: 170 }, '#d8f4d3'),
      s('jeepBody', 'rect', 'Jeep body', { x: 82, y: 250, width: 190, height: 70, rx: 14 }, '#d8d8d8'),
      s('jeepTop', 'path', 'Jeep top', { d: 'M120 250 L150 208 L220 208 L252 250 Z' }, '#d8d8d8'),
      s('jeepWindow', 'rect', 'Jeep window', { x: 154, y: 218, width: 54, height: 26, rx: 5 }, '#d8d8d8'),
      s('wheel1', 'circle', 'Left jeep wheel', { cx: 124, cy: 326, r: 26 }, '#d8d8d8'),
      s('wheel2', 'circle', 'Right jeep wheel', { cx: 234, cy: 326, r: 26 }, '#d8d8d8'),
      s('lionMane', 'circle', 'Lion mane', { cx: 326, cy: 270, r: 36 }, '#d8d8d8'),
      s('lionFace', 'circle', 'Lion face', { cx: 326, cy: 270, r: 24 }, '#d8d8d8'),
      s('tree', 'path', 'Acacia tree', { d: 'M54 262 L70 164 L88 262 Z M28 164 C58 122 126 132 146 166 C104 186 64 186 28 164 Z' }, '#d8d8d8'),
    ],
  },
  {
    levelTitle: 'Level 7: Happy City',
    description: 'Buildings, cars, street, trees, and balloons.',
    shapes: [
      s('citySky', 'rect', 'City sky', { x: 0, y: 0, width: 400, height: 245 }, '#d8ecff'),
      s('road', 'rect', 'Road', { x: 0, y: 300, width: 400, height: 100 }, '#d8d8d8'),
      s('building1', 'rect', 'Tall building', { x: 40, y: 95, width: 78, height: 205, rx: 4 }, '#d8d8d8'),
      s('building2', 'rect', 'Middle building', { x: 138, y: 142, width: 82, height: 158, rx: 4 }, '#d8d8d8'),
      s('building3', 'rect', 'Right building', { x: 240, y: 80, width: 108, height: 220, rx: 4 }, '#d8d8d8'),
      s('windows1', 'path', 'Building windows one', { d: 'M62 120 H92 V145 H62 Z M62 166 H92 V191 H62 Z M62 212 H92 V237 H62 Z' }, '#ffffff'),
      s('windows2', 'path', 'Building windows two', { d: 'M160 166 H196 V190 H160 Z M160 212 H196 V236 H160 Z' }, '#ffffff'),
      s('windows3', 'path', 'Building windows three', { d: 'M264 112 H294 V138 H264 Z M314 112 H334 V138 H314 Z M264 166 H294 V192 H264 Z M314 166 H334 V192 H314 Z' }, '#ffffff'),
      s('carBody', 'path', 'Car body', { d: 'M72 330 L105 294 H210 L250 330 Z' }, '#d8d8d8'),
      s('carBase', 'rect', 'Car base', { x: 62, y: 326, width: 205, height: 42, rx: 16 }, '#d8d8d8'),
      s('carWheel1', 'circle', 'Car left wheel', { cx: 112, cy: 370, r: 18 }, '#d8d8d8'),
      s('carWheel2', 'circle', 'Car right wheel', { cx: 222, cy: 370, r: 18 }, '#d8d8d8'),
      s('balloon1', 'ellipse', 'Balloon one', { cx: 332, cy: 52, rx: 20, ry: 28 }, '#d8d8d8'),
      s('balloon2', 'ellipse', 'Balloon two', { cx: 362, cy: 78, rx: 20, ry: 28 }, '#d8d8d8'),
    ],
  },
  {
    levelTitle: 'Level 8: Magic Castle',
    description: 'Castle towers, flags, clouds, and stars.',
    shapes: [
      s('castleSky', 'rect', 'Castle sky', { x: 0, y: 0, width: 400, height: 270 }, '#d8ecff'),
      s('castleGround', 'rect', 'Castle ground', { x: 0, y: 270, width: 400, height: 130 }, '#d8f4d3'),
      s('towerLeft', 'rect', 'Left tower', { x: 68, y: 150, width: 70, height: 170, rx: 6 }, '#d8d8d8'),
      s('towerRight', 'rect', 'Right tower', { x: 262, y: 150, width: 70, height: 170, rx: 6 }, '#d8d8d8'),
      s('towerLeftTop', 'polygon', 'Left tower roof', { points: '58,150 103,88 148,150' }, '#d8d8d8'),
      s('towerRightTop', 'polygon', 'Right tower roof', { points: '252,150 297,88 342,150' }, '#d8d8d8'),
      s('mainCastle', 'rect', 'Castle center', { x: 132, y: 190, width: 136, height: 130, rx: 8 }, '#d8d8d8'),
      s('gate', 'path', 'Castle gate', { d: 'M174 320 V268 C174 238 226 238 226 268 V320 Z' }, '#d8d8d8'),
      s('flag1', 'path', 'Left flag', { d: 'M104 88 V52 H150 L104 72 Z' }, '#d8d8d8'),
      s('flag2', 'path', 'Right flag', { d: 'M298 88 V52 H346 L298 72 Z' }, '#d8d8d8'),
      s('starCastle1', 'polygon', 'Magic star one', { points: '48,66 54,80 69,80 57,90 62,105 48,96 34,105 39,90 27,80 42,80' }, '#d8d8d8'),
      s('starCastle2', 'polygon', 'Magic star two', { points: '348,204 354,218 369,218 357,228 362,243 348,234 334,243 339,228 327,218 342,218' }, '#d8d8d8'),
    ],
  },
  {
    levelTitle: 'Level 9: Dinosaur Valley',
    description: 'Dinosaur, volcano, eggs, plants, and clouds.',
    shapes: [
      s('dinoSky', 'rect', 'Dinosaur sky', { x: 0, y: 0, width: 400, height: 250 }, '#d8ecff'),
      s('volcano', 'path', 'Volcano', { d: 'M248 250 L306 98 L370 250 Z' }, '#d8d8d8'),
      s('lava', 'path', 'Volcano lava', { d: 'M286 148 L306 98 L326 148 C310 134 302 166 286 148 Z' }, '#d8d8d8'),
      s('groundDino', 'rect', 'Dinosaur ground', { x: 0, y: 250, width: 400, height: 150 }, '#d8f4d3'),
      s('dinoBody', 'ellipse', 'Dinosaur body', { cx: 172, cy: 252, rx: 82, ry: 48 }, '#d8d8d8'),
      s('dinoNeck', 'path', 'Dinosaur neck', { d: 'M218 224 C238 170 278 152 296 180 C274 190 258 210 250 242 Z' }, '#d8d8d8'),
      s('dinoHead', 'ellipse', 'Dinosaur head', { cx: 306, cy: 176, rx: 34, ry: 26 }, '#d8d8d8'),
      s('dinoTail', 'path', 'Dinosaur tail', { d: 'M96 244 C44 226 22 198 20 164 C62 178 104 202 134 230 Z' }, '#d8d8d8'),
      s('dinoLeg1', 'rect', 'Dinosaur front leg', { x: 190, y: 288, width: 26, height: 58, rx: 8 }, '#d8d8d8'),
      s('dinoLeg2', 'rect', 'Dinosaur back leg', { x: 128, y: 288, width: 26, height: 58, rx: 8 }, '#d8d8d8'),
      s('dinoSpots', 'path', 'Dinosaur spots', { d: 'M142 230 A10 10 0 1 0 143 230 M178 216 A12 12 0 1 0 179 216 M214 246 A9 9 0 1 0 215 246' }, '#ffffff'),
      s('egg1', 'ellipse', 'Dinosaur egg one', { cx: 322, cy: 330, rx: 18, ry: 26 }, '#d8d8d8'),
      s('egg2', 'ellipse', 'Dinosaur egg two', { cx: 358, cy: 336, rx: 16, ry: 23 }, '#d8d8d8'),
    ],
  },
  {
    levelTitle: 'Level 10: Music Studio',
    description: 'Guitar, keyboard, headphones, and notes.',
    shapes: [
      s('wall', 'rect', 'Studio wall', { x: 0, y: 0, width: 400, height: 250 }, '#f3e5f5'),
      s('floorStudio', 'rect', 'Studio floor', { x: 0, y: 250, width: 400, height: 150 }, '#d8d8d8'),
      s('guitarBody1', 'ellipse', 'Guitar lower body', { cx: 126, cy: 260, rx: 48, ry: 58 }, '#d8d8d8'),
      s('guitarBody2', 'ellipse', 'Guitar upper body', { cx: 146, cy: 218, rx: 34, ry: 40 }, '#d8d8d8'),
      s('guitarNeck', 'rect', 'Guitar neck', { x: 166, y: 102, width: 22, height: 130, rx: 6, transform: 'rotate(18 177 167)' }, '#d8d8d8'),
      s('soundHole', 'circle', 'Guitar sound hole', { cx: 136, cy: 250, r: 18 }, '#ffffff'),
      s('keyboard', 'rect', 'Keyboard body', { x: 210, y: 255, width: 148, height: 54, rx: 8 }, '#d8d8d8'),
      s('keys', 'path', 'Keyboard keys', { d: 'M222 266 H346 V298 H222 Z M242 266 V298 M262 266 V298 M282 266 V298 M302 266 V298 M322 266 V298' }, '#ffffff'),
      s('headphoneBand', 'path', 'Headphone band', { d: 'M242 144 C244 72 344 72 346 144' }, '#d8d8d8', 'stroke'),
      s('leftCup', 'rect', 'Left headphone cup', { x: 226, y: 132, width: 34, height: 62, rx: 16 }, '#d8d8d8'),
      s('rightCup', 'rect', 'Right headphone cup', { x: 328, y: 132, width: 34, height: 62, rx: 16 }, '#d8d8d8'),
      s('note1', 'path', 'Music note one', { d: 'M70 95 V46 H116 V62 H84 V102' }, '#d8d8d8', 'stroke'),
      s('noteHead1', 'ellipse', 'Music note head one', { cx: 62, cy: 104, rx: 14, ry: 10 }, '#d8d8d8'),
      s('note2', 'path', 'Music note two', { d: 'M318 42 V96' }, '#d8d8d8', 'stroke'),
      s('noteHead2', 'ellipse', 'Music note head two', { cx: 306, cy: 102, rx: 14, ry: 10 }, '#d8d8d8'),
    ],
  },
];

interface ColorPaletteProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ selectedColor, onSelectColor }) => (
  <div className="palette-responsive" aria-label="Color palette" role="radiogroup" style={paletteContainerStyles}>
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
            border: `3px solid ${isSelected ? '#6a1b9a' : isWhite ? '#999' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: isSelected ? '0 0 0 5px #f48fb1' : '0 2px 5px rgba(0,0,0,0.18)',
            transform: isSelected ? 'scale(1.08)' : 'scale(1)',
          }}
        />
      );
    })}
  </div>
);

interface DrawingAreaProps {
  selectedColor: string;
  level: ColoringLevel;
  fillColors: Record<string, string>;
  onColorPartFill: (partId: string, color: string) => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

const DrawingArea: React.FC<DrawingAreaProps> = ({ selectedColor, level, fillColors, onColorPartFill, svgRef }) => {
  const handlePartClick = (partName: string) => onColorPartFill(partName, selectedColor);

  const handlePartKeyDown = (event: React.KeyboardEvent<SVGElement>, partName: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePartClick(partName);
    }
  };

  const svgTitleId = `${level.levelTitle.replace(/\s/g, '-')}-title`;
  const svgDescId = `${level.levelTitle.replace(/\s/g, '-')}-desc`;

  const renderShape = (shape: SvgShape) => {
    const color = fillColors[shape.id] || shape.initialColor;
    const isStrokeColored = shape.colorMode === 'stroke';
    const commonProps = {
      key: shape.id,
      fill: isStrokeColored ? 'none' : color,
      stroke: isStrokeColored ? color : '#262626',
      strokeWidth: isStrokeColored ? 8 : 2.8,
      strokeLinecap: isStrokeColored ? 'round' as const : undefined,
      strokeLinejoin: 'round' as const,
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
    if (shape.type === 'ellipse') return <ellipse {...commonProps} />;
    if (shape.type === 'polygon') return <polygon {...commonProps} />;
    return null;
  };

  return (
    <div className="drawing-container-responsive" aria-label={`Coloring drawing area for ${level.levelTitle}`} style={drawingAreaContainerStyles}>
      <svg ref={svgRef} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-labelledby={`${svgTitleId} ${svgDescId}`} style={svgBaseStyle} preserveAspectRatio="xMidYMid meet">
        <title id={svgTitleId}>{level.levelTitle}</title>
        <desc id={svgDescId}>{level.description}</desc>
        {level.shapes.map(renderShape)}
      </svg>
    </div>
  );
};

const ColoringBook: React.FC = () => {
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
      return;
    }

    const previousLevelColors = levelColoringState[currentLevelIndex - 1] || {};
    const newColorsForCurrentLevel = currentLevel.shapes.reduce((acc, shape) => {
      acc[shape.id] = previousLevelColors[shape.id] || shape.initialColor;
      return acc;
    }, {} as Record<string, string>);

    setCurrentLevelColors(newColorsForCurrentLevel);
    setLevelColoringState(prevState => ({ ...prevState, [currentLevelIndex]: newColorsForCurrentLevel }));
  }, [currentLevelIndex, currentLevel, levelColoringState]);

  const handleColorPartFill = useCallback((partId: string, newColor: string) => {
    setCurrentLevelColors(prevCurrentColors => {
      const updated = { ...prevCurrentColors, [partId]: newColor };
      setLevelColoringState(prevState => ({ ...prevState, [currentLevelIndex]: updated }));
      return updated;
    });
  }, [currentLevelIndex]);

  const goToNextLevel = () => {
    if (!isLastLevel) setCurrentLevelIndex(prevIndex => prevIndex + 1);
  };

  const goToPreviousLevel = () => {
    if (!isFirstLevel) setCurrentLevelIndex(prevIndex => prevIndex - 1);
  };

  const resetCurrentLevel = () => {
    const resetColors = currentLevel.shapes.reduce((acc, shape) => {
      acc[shape.id] = shape.initialColor;
      return acc;
    }, {} as Record<string, string>);
    setCurrentLevelColors(resetColors);
    setLevelColoringState(prevState => ({ ...prevState, [currentLevelIndex]: resetColors }));
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
    img.src = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgData)))}`;
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
        <div style={{ display: 'grid', gap: 4 }}>
          <h1 style={headerTitleStyles}>🎨 {currentLevel.levelTitle}</h1>
          <p style={levelDescriptionStyles}>{currentLevelIndex + 1} / {allLevels.length} · {currentLevel.description}</p>
        </div>
      </header>

      <div className="content-wrapper">
        <main className="drawing-section">
          <DrawingArea selectedColor={selectedColor} level={currentLevel} fillColors={currentLevelColors} onColorPartFill={handleColorPartFill} svgRef={svgRef} />
        </main>

        <aside className="controls-sidebar" aria-label="Coloring controls">
          <ColorPalette selectedColor={selectedColor} onSelectColor={setSelectedColor} />

          <footer className="nav-responsive" style={levelNavigationContainerStyles}>
            <button onClick={goToPreviousLevel} disabled={isFirstLevel} aria-label="Previous Level" style={{ ...levelButtonStyles, backgroundColor: '#ef5350', opacity: isFirstLevel ? 0.55 : 1, cursor: isFirstLevel ? 'not-allowed' : 'pointer' }}>
              Previous
            </button>
            <button onClick={goToNextLevel} disabled={isLastLevel} aria-label="Next Level" style={{ ...levelButtonStyles, backgroundColor: '#42a5f5', opacity: isLastLevel ? 0.55 : 1, cursor: isLastLevel ? 'not-allowed' : 'pointer' }}>
              Next
            </button>
            <button onClick={resetCurrentLevel} aria-label="Reset current level colors" style={{ ...levelButtonStyles, backgroundColor: '#7e57c2' }}>
              Reset Level
            </button>
            <button onClick={handleSaveImage} aria-label="Save coloring as image" style={{ ...levelButtonStyles, backgroundColor: '#66bb6a' }}>
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
