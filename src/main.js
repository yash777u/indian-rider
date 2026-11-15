import * as THREE from 'three';
import './style.css';

const $ = (id) => document.getElementById(id);
const ui = {
  game: $('game'), intro: $('intro'), hud: $('hud'), result: $('result'),
  mission: $('mission'), touch: $('touch-controls'), bottom: $('bottom-hint')
};
const mobileQuery = matchMedia('(pointer: coarse), (max-width: 760px)');
let isMobile = mobileQuery.matches;
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: !isMobile, powerPreference: 'high-performance', alpha: false });
} catch (error) {
  ui.game.innerHTML = '<div class="game-error">Your browser could not start WebGL. Try Chrome, update your browser, or enable hardware acceleration.</div>';
  throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, isMobile ? 1.25 : 1.6));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = false;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
ui.game.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x879d9d);
scene.fog = new THREE.Fog(0x879d9d, 35, 155);
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 240);
camera.position.set(0, 6.2, 12.5);
scene.add(new THREE.HemisphereLight(0xdce9e3, 0x3d4b42, 2.1));
const sun = new THREE.DirectionalLight(0xffe2b0, 1.8);
sun.position.set(-12, 25, 15);
scene.add(sun);

const mat = (color, roughness = .9, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, ...extra });
const M = {
  asphalt: mat(0x303638), edge: mat(0xe4d6ad), pavement: mat(0x777d70),
  gold: mat(0xe3b64f, .42, { metalness: .2 }), black: mat(0x15191a),
  rubber: mat(0x101416), cream: mat(0xe6ddc9), red: mat(0xb84a32),
  blue: mat(0x3c7180), green: mat(0x537c5b), glass: mat(0x91b7ba, .24),
  skin: mat(0xb97c55), leaf: mat(0x45684a), sign: mat(0x236b55),
  auto: mat(0xd9a52f), white: mat(0xf0eee5)
};
const box = (parent, w, h, d, material, x, y, z) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z); parent.add(mesh); return mesh;
};
const sphere = (parent, radius, material, x, y, z, sx=1, sy=1, sz=1) => {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 9, 7), material);
  mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); parent.add(mesh); return mesh;
};
const cylinder = (parent, radius, height, material, x, y, z, segments=10) => {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, segments), material);
  mesh.position.set(x, y, z); parent.add(mesh); return mesh;
};

// A compact repeating street corridor keeps the scene visually busy without a huge world.
box(scene, 12, .18, 240, M.asphalt, 0, -.12, -95);
box(scene, 100, .2, 250, M.pavement, 0, -.34, -95);
for (const x of [-6.08, 6.08]) box(scene, .18, .025, 240, M.edge, x, -.015, -95);
const laneMarks = [];
for (let z=-215; z<22; z+=9) {
  for (const x of [-3.15, -1.05, 1.05, 3.15]) laneMarks.push(box(scene, .09, .025, 3.4, M.edge, x, -.005, z));
}
const cityChunks = [];
const facadeMats = [mat(0xc28d67), mat(0xd5c6a4), mat(0x9cae9c), mat(0xb7a58d), mat(0x879a9b), mat(0xd1b87d)];
const shopNames = ['CHAI POINT','PUNJABI DHABA','DESI SWEETS','MEDICAL','MOBILE REPAIR','TANDOOR'];
const shopSignMats = shopNames.map((label, index) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 128;
  const context = canvas.getContext('2d');
  const colors = ['#a8432e','#1f654f','#b17a25','#386b83','#713f62','#8c4c2d'];
  context.fillStyle = colors[index]; context.fillRect(0,0,512,128);
  context.strokeStyle = '#f2d58d'; context.lineWidth = 9; context.strokeRect(7,7,498,114);
  context.fillStyle = '#fff4d7'; context.font = 'bold 48px Arial, sans-serif';
  context.textAlign = 'center'; context.textBaseline = 'middle';
  context.fillText(label,256,66,470);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({ map:texture, side:THREE.DoubleSide, toneMapped:false });
});
function makeChunk(z) {
  const group = new THREE.Group();
  for (const side of [-1, 1]) {
    const width = 4.5 + Math.random() * 3;
    const height = 5 + Math.random() * 9;
    const depth = 7 + Math.random() * 6;
    const x = side * (9 + width / 2);
    const building = new THREE.Group();
    box(building, width, height, depth, facadeMats[Math.floor(Math.random()*facadeMats.length)], 0, height/2, 0);
    box(building, width+ .15, .22, depth+.15, M.red, 0, height+.1, 0);
    const floors = Math.max(2, Math.floor(height/2.6));
    for (let f=0; f<floors; f++) {
      for (const wx of [-width*.27, width*.27]) {
        box(building, .85, .95, .08, M.glass, wx, 1.5+f*2.35, depth/2+.045);
        box(building, .9, .07, .13, M.cream, wx, 1.0+f*2.35, depth/2+.08);
      }
    }
    if (Math.random() > .35) {
      box(building, width*.72, .9, .12, M.sign, 0, 2.1, depth/2+.12);
      const shopFace = new THREE.Mesh(new THREE.PlaneGeometry(width*.68,.72), shopSignMats[Math.floor(Math.random()*shopSignMats.length)]);
      shopFace.position.set(0,2.1,depth/2+.19);
      building.add(shopFace);
      box(building, width*.45, .09, .14, M.gold, 0, 2.2, depth/2+.2);
    }
    building.position.set(x, 0, 0);
    group.add(building);
    // Street tree and a lamp add scale and recognizable roadside detail.
    const tree = new THREE.Group();
    cylinder(tree, .13, 2.4, mat(0x76533a), 0, 1.2, 0);
    sphere(tree, 1.0, M.leaf, 0, 2.75, 0, 1, 1.1, 1);
    sphere(tree, .62, mat(0x667f4f), .42, 3.05, .12);
    tree.position.set(side*7.6, 0, -2.2);
    group.add(tree);
    const lamp = new THREE.Group();
    cylinder(lamp, .055, 5, M.black, 0, 2.5, 0);
    box(lamp, .65, .08, .08, M.black, side*.28, 4.9, 0);
    sphere(lamp, .14, mat(0xffe7a4, .4, { emissive: 0x665022 }), side*-.32, 4.8, 0);
    lamp.position.set(side*7.1, 0, 2.5);
    group.add(lamp);
  }
  group.position.z = z;
  scene.add(group);
  cityChunks.push(group);
}
for (let z=-220; z<20; z+=24) makeChunk(z);

function createScooter() {
  const root = new THREE.Group();
  const body = new THREE.Group(); root.add(body);
  box(body, .76, .42, 1.38, M.gold, 0, .88, 0);
  box(body, .55, .58, .62, M.cream, 0, 1.22, -.18);
  box(body, .66, .13, .48, M.black, 0, 1.55, -.1);
  box(body, .56, .2, .22, M.red, 0, .66, -.72);
  for (const z of [-.72, .72]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.18,16), M.rubber);
    wheel.rotation.z = Math.PI/2; wheel.position.set(0,.34,z); root.add(wheel);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.2,12), M.gold);
    hub.rotation.z = Math.PI/2; hub.position.copy(wheel.position); root.add(hub);
    root.userData.wheels = (root.userData.wheels || []).concat(wheel);
  }
  box(body, 1.0, .07, .08, M.black, 0, 1.58, .4);
  box(body, .12, .45, .12, M.black, 0, 1.32, .4);
  box(body, .38, .65, .34, M.blue, 0, 1.72, -.08).rotation.x = -.18;
  sphere(body, .23, M.skin, 0, 2.17, -.12);
  sphere(body, .25, M.red, 0, 2.29, -.13, 1.06, .72, 1.04);
  root.position.set(0,0,3.4);
  scene.add(root); return root;
}
const player = createScooter();

function makeVehicle(type) {
  const group = new THREE.Group();
  if (type === 'cow') {
    box(group, 1.12, .72, .7, M.cream, 0, .88, 0);
    for (const x of [-.38,.38]) for (const z of [-.22,.22]) cylinder(group,.07,.58,M.black,x,.38,z,7);
    box(group,.42,.48,.42,M.cream,0,1.2,-.48);
    cylinder(group,.035,.28,M.white,-.16,1.48,-.5,6);
    cylinder(group,.035,.28,M.white,.16,1.48,-.5,6);
  } else {
    const bus = type === 'bus', auto = type === 'auto';
    const w = bus ? 2.25 : auto ? 1.4 : 1.55;
    const d = bus ? 4.6 : auto ? 1.9 : 2.8;
    const paint = bus ? M.blue : auto ? M.auto : [M.red,M.green,M.blue,M.cream][Math.floor(Math.random()*4)];
    box(group,w,1.1,d,paint,0,.95,0);
    box(group,w*.86,.62,d*.5,M.glass,0,1.72,-.08);
    for (const x of [-w*.4,w*.4]) for (const z of [-d*.32,d*.32]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.16,10), M.rubber);
      wheel.rotation.z=Math.PI/2; wheel.position.set(x,.32,z); group.add(wheel);
    }
    if (auto) {
      box(group,.92,.12,.12,M.black,0,1.2,-.98);
      box(group,.74,.08,.08,M.gold,0,.47,-.98);
    }
    if (bus) box(group,1.4,.18,.1,M.gold,0,1.22,-d/2-.06);
  }
  return group;
}
const traffic = [];
const lanes = [-4.2,-2.1,0,2.1,4.2];
const trafficTypes = ['car','car','auto','cow','bus'];
function spawnTraffic() {
  const type = trafficTypes[Math.floor(Math.random()*trafficTypes.length)];
  const object = makeVehicle(type);
  object.position.set(lanes[Math.floor(Math.random()*lanes.length)],0,-118);
  scene.add(object);
  const difficultyBoost = state.mode === 'playing' ? state.deliveries * 1.15 : 0;
  traffic.push({object,type,speed:(type==='bus'?8:type==='cow'?6:10+Math.random()*6)+difficultyBoost,hit:false});
}

function makePedestrian(x,z) {
  const person = new THREE.Group();
  const shirt = [M.red,M.blue,M.green,M.gold][Math.floor(Math.random()*4)];
  box(person,.32,.58,.22,shirt,0,1.03,0);
  sphere(person,.17,M.skin,0,1.48,-.02);
  for (const legX of [-.12,.12]) box(person,.1,.55,.12,M.black,legX,.35,0);
  person.position.set(x,0,z);
  scene.add(person);
  return person;
}
const pedestrians = [];
for (let i=0;i<10;i++) pedestrians.push(makePedestrian(i%2?8.1:-8.1,-i*22-12));

function makePickup() {
  const group = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.86,.11,7,20),M.gold);
  ring.rotation.x=Math.PI/2; ring.position.y=.15; group.add(ring);
  const parcel = box(group,.48,.48,.48,M.gold,0,.68,0);
  box(group,.08,.5,.5,M.cream,0,.68,0);
  group.userData.parcel=parcel;
  group.position.set(lanes[Math.floor(Math.random()*lanes.length)],0,-112);
  scene.add(group); return group;
}
let pickup = null;
const rainCount = isMobile ? 220 : 420;
const rainPositions = new Float32Array(rainCount*3);
for(let i=0;i<rainCount;i++){
  rainPositions[i*3]=(Math.random()-.5)*32;
  rainPositions[i*3+1]=Math.random()*18;
  rainPositions[i*3+2]=(Math.random()-.5)*58;
}
const rainGeometry = new THREE.BufferGeometry();
rainGeometry.setAttribute('position',new THREE.BufferAttribute(rainPositions,3));
const rain = new THREE.Points(rainGeometry,new THREE.PointsMaterial({color:0xdce8ed,size:.055,transparent:true,opacity:.52}));
scene.add(rain);

const state = {mode:'menu',lane:2,speed:0,time:90,deliveries:0,cash:0,distance:0,spawn:1,hitCooldown:0,boost:100,toast:0,nitroWasActive:false,shake:0};
let bestScore = 0;
let soundEnabled = true;
let audioContext = null;
try {
  const savedBest = Number(localStorage.getItem('indianRiderBest') || 0);
  bestScore = Number.isFinite(savedBest) ? Math.max(0, savedBest) : 0;
  soundEnabled = localStorage.getItem('indianRiderSound') !== 'off';
} catch {}
const bestBadge = document.createElement('div');
bestBadge.className = 'best-shift';
bestBadge.id = 'best-shift';
bestBadge.textContent = 'PERSONAL BEST  ₹' + bestScore;
ui.intro.appendChild(bestBadge);
const keys = {};
const dynamic = document.createElement('div');
dynamic.className='game-dynamic';
dynamic.innerHTML = '<button class="sound-game" id="sound-game" aria-label="Toggle sound">♫ SOUND ON</button><button class="pause-game" id="pause-game" aria-label="Pause game" hidden>Ⅱ PAUSE</button><div class="game-stats" id="live-stats" hidden><span id="speed-stat">SPEED 0 KM/H</span><span id="boost-stat">NITRO 100%</span><span id="objective-stat">DELIVER 3 PARCELS</span></div><div class="game-toast" id="game-toast"></div><div class="game-modal" id="game-modal" hidden><small>TAKE A BREATHER</small><h2>RIDE <em>PAUSED.</em></h2><p>Your city can wait for a second.</p><button class="start-btn" id="resume-game">BACK TO THE ROAD ↗</button></div>';
document.getElementById('app').appendChild(dynamic);
function initAudio() {
  if (!soundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioContext) audioContext = new AudioContextClass();
    if (audioContext.state === 'suspended') audioContext.resume();
  } catch {}
}
function playSfx(kind) {
  if (!soundEnabled || !audioContext) return;
  const patterns = {
    start: [440, 660],
    pickup: [660, 880, 1175],
    crash: [180, 110],
    boost: [260, 520],
    finish: [523, 659, 784, 1047]
  };
  const notes = patterns[kind] || [];
  const now = audioContext.currentTime;
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const startAt = now + index * (kind === 'finish' ? .11 : .075);
    const duration = kind === 'crash' ? .16 : .12;
    oscillator.type = kind === 'crash' ? 'sawtooth' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(kind === 'crash' ? .045 : .035, startAt + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, startAt + duration);
    oscillator.connect(gain); gain.connect(audioContext.destination);
    oscillator.start(startAt); oscillator.stop(startAt + duration + .02);
  });
}
const soundButton = $('sound-game');
function updateSoundButton() {
  soundButton.textContent = soundEnabled ? '♫ SOUND ON' : '♫ SOUND OFF';
  soundButton.setAttribute('aria-pressed', String(soundEnabled));
}
soundButton.onclick = () => {
  soundEnabled = !soundEnabled;
  try { localStorage.setItem('indianRiderSound', soundEnabled ? 'on' : 'off'); } catch {}
  if (soundEnabled) { initAudio(); playSfx('start'); }
  updateSoundButton();
};
updateSoundButton();
const toast = (message) => { $('game-toast').textContent=message; $('game-toast').classList.add('show'); state.toast=1.25; };
function updateHud() {
  $('timer').textContent=Math.max(0,state.time).toFixed(1);
  $('deliveries').textContent=state.deliveries+' / 3';
  $('score').textContent='₹'+state.cash;
  $('boost-stat').textContent='NITRO '+Math.round(state.boost)+'%';
  $('speed-stat').textContent='SPEED '+Math.round(state.speed*3.6)+' KM/H';
  $('objective-stat').textContent=state.deliveries>=3?'SHIFT COMPLETE':'DELIVER '+(3-state.deliveries)+' MORE';
}
function pause() {
  if(state.mode==='playing'){state.mode='paused';$('game-modal').hidden=false;$('pause-game').textContent='▶ RESUME';}
  else if(state.mode==='paused'){state.mode='playing';$('game-modal').hidden=true;$('pause-game').textContent='Ⅱ PAUSE';}
}
$('pause-game').onclick=pause;
$('resume-game').onclick=pause;
addEventListener('keydown',(event)=>{
  const key=event.key.toLowerCase(); keys[key]=true;
  if(['arrowleft','arrowright','arrowup','arrowdown',' '].includes(key)) event.preventDefault();
  if(key==='escape'||key==='p') pause();
});
addEventListener('keyup',(event)=>{keys[event.key.toLowerCase()]=false;});
function bindHold(id,key) {
  const el=$(id); if(!el)return;
  el.addEventListener('pointerdown',e=>{e.preventDefault();keys[key]=true;el.setPointerCapture?.(e.pointerId);});
  for(const name of ['pointerup','pointercancel','lostpointercapture']) el.addEventListener(name,()=>{keys[key]=false;});
}
bindHold('left','left'); bindHold('right','right'); bindHold('brake','brake');
const extraControls=document.createElement('div');extraControls.className='touch-extra';$('touch-controls').insertBefore(extraControls,$('brake'));
const go=document.createElement('button');go.id='accelerate';go.className='touch-go';go.textContent='GO';extraControls.appendChild(go);bindHold('accelerate','accelerate');
const nitro=document.createElement('button');nitro.id='nitro';nitro.className='touch-nitro';nitro.textContent='N₂O';extraControls.appendChild(nitro);bindHold('nitro','shift');

function clearTraffic() {
  for(const item of traffic) scene.remove(item.object);
  traffic.length=0;
  if(pickup){scene.remove(pickup);pickup=null;}
}
function start() {
  initAudio();
  clearTraffic();
  state.mode='playing';state.lane=2;state.speed=0;state.time=90;state.deliveries=0;state.cash=0;state.distance=0;state.spawn=.6;state.hitCooldown=0;state.boost=100;state.nitroWasActive=false;state.shake=0;
  player.position.set(0,0,3.4);
  $('intro').hidden=true;$('result').hidden=true;$('hud').hidden=false;$('mission').hidden=false;$('touch-controls').hidden=false;$('bottom-hint').hidden=true;
  $('pause-game').hidden=false;$('live-stats').hidden=false;$('game-modal').hidden=true;
  $('mission').querySelector('strong').textContent='Deliver 3 parcels';
  $('result-copy').textContent='The city has tested you. Ready for another run?';
  bestBadge.textContent = 'PERSONAL BEST  ₹' + bestScore;
  playSfx('start');
  updateHud();
}
$('start').onclick=start;$('again').onclick=start;
function finish(won) {
  state.mode='over';
  if (state.cash > bestScore) {
    bestScore = state.cash;
    try { localStorage.setItem('indianRiderBest', String(bestScore)); } catch {}
  }
  bestBadge.textContent = 'PERSONAL BEST  ₹' + bestScore;
  playSfx(won ? 'finish' : 'crash');$('result').hidden=false;$('touch-controls').hidden=true;$('mission').hidden=true;$('pause-game').hidden=true;$('live-stats').hidden=true;
  $('result-title').textContent=won?'DELIVERY BOSS!':'SHIFT OVER.';
  $('result-copy').textContent=won?'Three parcels delivered. The streets are yours.':'The city got the better of you. Ready for another run?';
  $('result-score').textContent='₹'+state.cash;
  $('result-copy').textContent += '  Personal best: ₹' + bestScore + '.';
}
function crash() {
  if(state.hitCooldown>0)return;
  state.hitCooldown=1.35;state.time=Math.max(0,state.time-3.5);state.cash=Math.max(0,state.cash-25);state.speed*=.48;state.shake=.28;
  playSfx('crash');
  if (navigator.vibrate) navigator.vibrate(70);
  toast('TRAFFIC HIT  •  -3.5 SEC'); updateHud();
}
function steer(direction) { state.lane=THREE.MathUtils.clamp(state.lane+direction,0,4); }
let swipeStart = null;
renderer.domElement.addEventListener('pointerdown', event => {
  if (event.pointerType === 'touch' && state.mode === 'playing') swipeStart = { x: event.clientX, y: event.clientY };
});
renderer.domElement.addEventListener('pointerup', event => {
  if (!swipeStart) return;
  const dx = event.clientX - swipeStart.x;
  const dy = event.clientY - swipeStart.y;
  if (Math.abs(dx) > 34 && Math.abs(dx) > Math.abs(dy) * 1.15) {
    const steps = Math.min(2, Math.max(1, Math.round(Math.abs(dx) / 105)));
    for (let i = 0; i < steps; i++) steer(dx < 0 ? -1 : 1);
  }
  swipeStart = null;
});
renderer.domElement.addEventListener('pointercancel', () => { swipeStart = null; });
function collectPickup() {
  state.deliveries++;state.cash+=150;state.time=Math.min(99,state.time+6);state.boost=Math.min(100,state.boost+22);
  playSfx('pickup');
  scene.remove(pickup);pickup=null;toast('PARCEL DELIVERED  •  +₹150');
  $('mission').querySelector('strong').textContent=state.deliveries>=3?'All parcels delivered!':'Parcel '+(state.deliveries+1)+' of 3';
  updateHud();if(state.deliveries>=3)finish(true);
}
function update(dt,now) {
  if(state.mode!=='playing')return;
  state.time-=dt;
  if(state.time<=0){finish(state.deliveries>=3);return;}
  const left=keys.left||keys.a||keys.arrowleft;
  const right=keys.right||keys.d||keys.arrowright;
  if(left&&!keys._left){steer(-1);keys._left=true;} if(!left)keys._left=false;
  if(right&&!keys._right){steer(1);keys._right=true;} if(!right)keys._right=false;
  const braking=keys.brake||keys.s||keys.arrowdown;
  const accelerating=keys.accelerate||keys.w||keys.arrowup||keys[' '];
  const nitroActive=keys.shift&&state.boost>0&&!braking;
  if (nitroActive && !state.nitroWasActive) playSfx('boost');
  state.nitroWasActive = nitroActive;
  if(nitroActive){state.speed=THREE.MathUtils.damp(state.speed,36,2.8,dt);state.boost=Math.max(0,state.boost-24*dt);}
  else state.speed=THREE.MathUtils.damp(state.speed,braking?7:accelerating?26:18,braking?5:2.2,dt);
  if(!nitroActive)state.boost=Math.min(100,state.boost+7*dt);
  const travel=state.speed*dt;
  state.distance+=travel*.42;
  player.position.x=THREE.MathUtils.damp(player.position.x,lanes[state.lane],9,dt);
  player.rotation.z=THREE.MathUtils.damp(player.rotation.z,(lanes[state.lane]-player.position.x)*-.12,8,dt);
  player.rotation.y=THREE.MathUtils.damp(player.rotation.y,(lanes[state.lane]-player.position.x)*.055,7,dt);
  player.position.y=Math.sin(now*.009)*.018;
  for(const wheel of player.userData.wheels) wheel.rotation.x-=travel*1.8;
  for(const mark of laneMarks){mark.position.z+=travel;if(mark.position.z>16)mark.position.z-=234;}
  for(const chunk of cityChunks){chunk.position.z+=travel;if(chunk.position.z>26)chunk.position.z-=240;}
  for(const person of pedestrians){
    person.position.z+=travel*.96;
    person.position.x+=Math.sin(now*.001+person.position.z)*dt*.1;
    if(person.position.z>15)person.position.z-=220;
  }
  state.spawn-=dt;
  if(state.spawn<=0){spawnTraffic();state.spawn=Math.max(.62,1.05+Math.random()*.72-state.deliveries*.11);}
  if(!pickup&&state.deliveries<3&&Math.random()<dt*.12)pickup=makePickup();
  for(let i=traffic.length-1;i>=0;i--){
    const item=traffic[i];item.object.position.z+=travel+item.speed*dt;
    if(item.object.position.z>18){scene.remove(item.object);traffic.splice(i,1);continue;}
    const dx=Math.abs(item.object.position.x-player.position.x);
    const dz=Math.abs(item.object.position.z-player.position.z);
    const width=item.type==='bus'?1.48:item.type==='cow'?1.05:.92;
    if(dx<width&&dz<(item.type==='bus'?2.5:1.55))crash();
  }
  if(pickup){
    pickup.position.z+=travel;pickup.rotation.y+=dt*.8;pickup.userData.parcel.rotation.y=Math.sin(now*.004)*.25;
    if(Math.abs(pickup.position.z-player.position.z)<1.7&&Math.abs(pickup.position.x-player.position.x)<1.15)collectPickup();
    else if(pickup&&pickup.position.z>18){scene.remove(pickup);pickup=null;}
  }
  for(let i=0;i<rainCount;i++){
    const j=i*3;rainPositions[j+1]-=dt*18;rainPositions[j+2]+=travel*.25;
    if(rainPositions[j+1]<0){rainPositions[j+1]=18;rainPositions[j+2]=(Math.random()-.5)*58;}
    if(rainPositions[j+2]>18)rainPositions[j+2]-=60;
  }
  rainGeometry.attributes.position.needsUpdate=true;
  rain.position.x=player.position.x*.25;
  state.hitCooldown=Math.max(0,state.hitCooldown-dt);
  if(state.toast>0){state.toast-=dt;if(state.toast<=0)$('game-toast').classList.remove('show');}
  camera.position.x=THREE.MathUtils.damp(camera.position.x,player.position.x*.38,3.2,dt);
  state.shake=Math.max(0,state.shake-dt);
  if(state.shake>0) camera.position.x += Math.sin(now*.075)*state.shake*.7;
  camera.position.y=THREE.MathUtils.damp(camera.position.y,6.0+(state.speed/34)*.65,2,dt);
  camera.lookAt(player.position.x*.32,1.1,-7.5);
  if(state.distance>1500)state.distance=0;
  updateHud();
}
const mapCanvas=document.createElement('canvas');mapCanvas.width=100;mapCanvas.height=100;mapCanvas.className='minimap';
const mapWrap=document.createElement('div');mapWrap.className='minimap-wrap';mapWrap.appendChild(mapCanvas);$('app').appendChild(mapWrap);
const map=mapCanvas.getContext('2d');
function drawMap(){
  map.fillStyle='#1d2928';map.fillRect(0,0,100,100);
  map.fillStyle='#66716a';map.fillRect(29,0,42,100);
  map.strokeStyle='#d8c89c';map.setLineDash([5,5]);map.beginPath();map.moveTo(50,0);map.lineTo(50,100);map.stroke();map.setLineDash([]);
  map.fillStyle='#e9bd61';map.beginPath();map.arc(50+player.position.x*4.8,77,5,0,Math.PI*2);map.fill();
  if(pickup){map.fillStyle='#f5f1e7';map.fillRect(47+(pickup.position.x-player.position.x)*4,20,6,6);}
}
let last=performance.now(),mapClock=0;
function frame(now){
  requestAnimationFrame(frame);
  const dt=Math.min((now-last)/1000,.04);last=now;
  update(dt,now);mapClock+=dt;if(mapClock>.12){drawMap();mapClock=0;}
  if(state.mode!=='playing'){camera.lookAt(0,1.1,-7);player.rotation.y=Math.sin(now*.0007)*.025;}
  renderer.render(scene,camera);
}
requestAnimationFrame(frame);
addEventListener('resize',()=>{
  isMobile = mobileQuery.matches;
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,isMobile?1.25:1.6));
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.mode==='playing')pause();});
// Keep held controls from sticking if the browser interrupts a touch or keyboard session.
addEventListener('blur',()=>{for(const key of Object.keys(keys))keys[key]=false;if(state.mode==='playing')pause();});
