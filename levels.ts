export type ShapeType = 'path' | 'rect' | 'circle' | 'ellipse' | 'polygon';
export type ColorMode = 'fill' | 'stroke';
export type Shape = { id: string; type: ShapeType; label: string; props: Record<string, string | number>; initial?: string; mode?: ColorMode; sw?: number };
export type Level = { title: string; desc: string; shapes: Shape[] };

const sh = (id: string, type: ShapeType, label: string, props: Shape['props'], initial = '#eeeeee', mode: ColorMode = 'fill', sw?: number): Shape => ({ id, type, label, props, initial, mode, sw });

export const colors = ['#F44336', '#FF9800', '#FFEB3B', '#4CAF50', '#03A9F4', '#3F51B5', '#9C27B0', '#E91E63', '#795548', '#9E9E9E', '#111111', '#FFFFFF'];

export const levels: Level[] = [
  { title: 'Level 1: Big Bear', desc: 'One large friendly bear with soft rounded shapes.', shapes: [
    sh('floor','path','Soft floor',{d:'M18 320 C70 286 326 286 382 320 L382 388 L18 388 Z'},'#f3f3f3'),
    sh('armL','ellipse','Left arm',{cx:116,cy:228,rx:34,ry:64,transform:'rotate(22 116 228)'}),
    sh('armR','ellipse','Right arm',{cx:284,cy:228,rx:34,ry:64,transform:'rotate(-22 284 228)'}),
    sh('body','ellipse','Bear body',{cx:200,cy:236,rx:92,ry:106}),
    sh('belly','ellipse','Belly',{cx:200,cy:250,rx:54,ry:66},'#fff'),
    sh('earL','circle','Left ear',{cx:140,cy:76,r:32}),
    sh('earR','circle','Right ear',{cx:260,cy:76,r:32}),
    sh('earInL','circle','Left inner ear',{cx:140,cy:78,r:16},'#fff'),
    sh('earInR','circle','Right inner ear',{cx:260,cy:78,r:16},'#fff'),
    sh('head','circle','Bear head',{cx:200,cy:132,r:78}),
    sh('snout','ellipse','Snout',{cx:200,cy:150,rx:38,ry:30},'#fff'),
    sh('nose','ellipse','Nose',{cx:200,cy:139,rx:12,ry:9},'#111'),
    sh('smile','path','Smile',{d:'M184 158 C193 170 207 170 216 158'},'#111','stroke',2),
    sh('eyeL','circle','Left eye',{cx:170,cy:122,r:7},'#111'),
    sh('eyeR','circle','Right eye',{cx:230,cy:122,r:7},'#111'),
    sh('footL','ellipse','Left foot',{cx:148,cy:334,rx:42,ry:28}),
    sh('footR','ellipse','Right foot',{cx:252,cy:334,rx:42,ry:28})
  ]},
  { title: 'Level 2: Two Robots Talking', desc: 'Two friendly robots facing each other.', shapes: [
    sh('bubbleL','path','Left speech bubble',{d:'M44 32 H136 C150 32 158 41 158 54 V68 C158 82 149 90 136 90 H88 L62 112 L68 90 H44 C30 90 22 82 22 68 V54 C22 41 30 32 44 32 Z'},'#fff'),
    sh('bubbleR','path','Right speech bubble',{d:'M264 32 H356 C370 32 378 41 378 54 V68 C378 82 370 90 356 90 H332 L338 112 L312 90 H264 C250 90 242 82 242 68 V54 C242 41 250 32 264 32 Z'},'#fff'),
    sh('lArm','path','Left arm',{d:'M54 196 C28 210 28 250 56 262'},'#eee','stroke',12),
    sh('rArm','path','Right arm',{d:'M346 196 C372 210 372 250 344 262'},'#eee','stroke',12),
    sh('lBody','rect','Left robot body',{x:52,y:166,width:112,height:126,rx:20}),
    sh('lHead','rect','Left robot head',{x:62,y:82,width:92,height:74,rx:18}),
    sh('lAnt','path','Left antenna',{d:'M108 82 L108 46'},'#111','stroke',2),
    sh('lBall','circle','Left antenna ball',{cx:108,cy:38,r:10}),
    sh('lEye1','circle','Left robot eye',{cx:88,cy:116,r:7},'#111'),
    sh('lEye2','circle','Left robot eye',{cx:128,cy:116,r:7},'#111'),
    sh('lSmile','path','Left robot smile',{d:'M88 138 C100 148 118 148 130 138'},'#111','stroke',2),
    sh('lScreen','rect','Left screen',{x:82,y:194,width:52,height:38,rx:8},'#fff'),
    sh('lWheel','ellipse','Left wheel base',{cx:108,cy:314,rx:50,ry:18}),
    sh('rBody','rect','Right robot body',{x:236,y:166,width:112,height:126,rx:20}),
    sh('rHead','rect','Right robot head',{x:246,y:82,width:92,height:74,rx:18}),
    sh('rAnt','path','Right antenna',{d:'M292 82 L292 46'},'#111','stroke',2),
    sh('rBall','circle','Right antenna ball',{cx:292,cy:38,r:10}),
    sh('rEye1','circle','Right robot eye',{cx:272,cy:116,r:7},'#111'),
    sh('rEye2','circle','Right robot eye',{cx:312,cy:116,r:7},'#111'),
    sh('rSmile','path','Right robot smile',{d:'M272 138 C284 148 302 148 314 138'},'#111','stroke',2),
    sh('rScreen','rect','Right screen',{x:266,y:194,width:52,height:38,rx:8},'#fff'),
    sh('rWheel','ellipse','Right wheel base',{cx:292,cy:314,rx:50,ry:18})
  ]},
  { title: 'Level 3: House and Tree', desc: 'A storybook house, tree, sky, and cloud.', shapes: [
    sh('sky','rect','Sky',{x:0,y:0,width:400,height:250},'#f7f7f7'),
    sh('grass','rect','Ground',{x:0,y:250,width:400,height:150}),
    sh('cloud','path','Cloud',{d:'M66 84 C58 58 88 42 108 60 C124 30 174 44 174 82 C201 80 216 112 192 128 H76 C48 128 38 96 66 84 Z'},'#fff'),
    sh('sun','circle','Sun',{cx:330,cy:62,r:34},'#fff'),
    sh('trunk','path','Tree trunk',{d:'M70 344 V238 C70 224 94 224 94 238 V344 Z'}),
    sh('chimney','rect','Chimney',{x:278,y:124,width:28,height:52,rx:4}),
    sh('wall','rect','House wall',{x:160,y:196,width:150,height:118,rx:8}),
    sh('roof','path','Roof',{d:'M140 198 L236 112 L330 198 Z'}),
    sh('door','path','Door',{d:'M214 314 V260 C214 236 254 236 254 260 V314 Z'},'#fff'),
    sh('winL','rect','Left window',{x:174,y:220,width:36,height:34,rx:6},'#fff'),
    sh('winR','rect','Right window',{x:260,y:220,width:36,height:34,rx:6},'#fff'),
    sh('path','path','House path',{d:'M214 314 H254 L286 400 H182 Z'},'#f7f7f7'),
    sh('crown','path','Tree crown',{d:'M82 106 C126 106 152 142 140 180 C170 202 148 250 108 244 C84 278 34 256 44 218 C8 202 18 150 56 150 C58 124 66 106 82 106 Z'})
  ]},
  { title: 'Level 4: Big Rocket', desc: 'One bold rocket with simple planets and stars.', shapes: [
    sh('space','rect','Space',{x:0,y:0,width:400,height:400},'#f7f7f7'), sh('body','path','Rocket body',{d:'M200 52 C260 116 252 238 200 294 C148 238 140 116 200 52 Z'}),
    sh('stripe','path','Rocket stripe',{d:'M154 214 C184 230 216 230 246 214 C242 238 226 270 200 294 C174 270 158 238 154 214 Z'},'#fff'),
    sh('winFrame','circle','Window frame',{cx:200,cy:146,r:30}), sh('win','circle','Window glass',{cx:200,cy:146,r:18},'#fff'),
    sh('finL','path','Left fin',{d:'M158 232 L96 308 C126 306 154 294 174 272 Z'}), sh('finR','path','Right fin',{d:'M242 232 L304 308 C274 306 246 294 226 272 Z'}),
    sh('flame','path','Outer flame',{d:'M166 292 C174 360 226 360 234 292 Z'}), sh('flameIn','path','Inner flame',{d:'M188 296 C192 338 208 338 212 296 Z'},'#fff'),
    sh('planet','circle','Planet',{cx:72,cy:92,r:34}), sh('ring','ellipse','Planet ring',{cx:72,cy:92,rx:58,ry:14},'#111','stroke',2),
    sh('moon','circle','Moon',{cx:322,cy:74,r:28}), sh('star1','polygon','Star one',{points:'330,220 337,235 354,236 341,247 345,264 330,255 315,264 319,247 306,236 323,235'},'#fff'),
    sh('star2','polygon','Star two',{points:'82,262 88,274 102,276 92,286 95,300 82,292 69,300 72,286 62,276 76,274'},'#fff')
  ]},
  { title: 'Level 5: Big Whale', desc: 'A friendly whale with calm underwater shapes.', shapes: [
    sh('water','rect','Water',{x:0,y:0,width:400,height:400},'#f7f7f7'), sh('sand','path','Sea floor',{d:'M0 326 C68 300 122 350 202 328 C282 306 330 338 400 314 L400 400 L0 400 Z'}),
    sh('body','path','Whale body',{d:'M72 202 C112 126 274 126 326 198 C354 236 312 282 220 282 H126 C76 282 46 242 72 202 Z'}),
    sh('belly','path','Whale belly',{d:'M126 242 C168 270 250 270 294 242 C272 278 238 294 198 294 C158 294 132 276 126 242 Z'},'#fff'),
    sh('tailTop','path','Top tail',{d:'M318 198 C352 158 386 168 382 218 C358 210 340 202 318 198 Z'}), sh('tailBot','path','Bottom tail',{d:'M318 218 C356 252 386 242 382 196 C358 206 340 214 318 218 Z'}),
    sh('fin','path','Whale fin',{d:'M180 240 C150 260 142 292 188 282 C204 268 198 248 180 240 Z'}), sh('eye','circle','Whale eye',{cx:144,cy:198,r:7},'#111'),
    sh('smile','path','Whale smile',{d:'M134 220 C154 238 186 236 210 222'},'#111','stroke',2), sh('spout','path','Water spout',{d:'M188 136 C174 104 154 94 142 68 M202 136 C204 98 226 82 246 62 M196 134 C196 104 196 78 196 48'},'#111','stroke',2),
    sh('b1','circle','Bubble one',{cx:286,cy:116,r:13},'#fff'), sh('b2','circle','Bubble two',{cx:320,cy:86,r:9},'#fff'),
    sh('weedL','path','Left seaweed',{d:'M72 354 C48 322 96 292 76 252 M96 354 C74 318 126 290 104 250'},'#eee','stroke',5),
    sh('weedLC','path','Left center seaweed',{d:'M128 356 C112 330 146 304 134 270 M150 356 C138 324 170 300 162 262'},'#eee','stroke',5),
    sh('weedC','path','Center seaweed',{d:'M198 360 C182 330 216 304 204 268 M220 360 C206 324 238 296 230 258'},'#eee','stroke',5),
    sh('weedRC','path','Right center seaweed',{d:'M266 356 C250 328 284 304 272 268 M288 356 C274 322 306 296 298 260'},'#eee','stroke',5),
    sh('weedR','path','Right seaweed',{d:'M324 354 C300 322 348 292 328 252 M350 354 C328 318 378 290 356 250'},'#eee','stroke',5)
  ]}
];
