import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('public/models/original');
fs.mkdirSync(outDir, { recursive: true });

const C = {
  cream:[0.88,0.81,0.67], ivory:[0.94,0.9,0.78], white:[0.91,0.91,0.85],
  brick:[0.56,0.23,0.16], terracotta:[0.72,0.32,0.2], red:[0.72,0.1,0.08],
  saffron:[0.92,0.48,0.08], mustard:[0.78,0.56,0.16], teal:[0.08,0.36,0.36],
  blue:[0.12,0.3,0.52], sky:[0.25,0.55,0.68], green:[0.16,0.38,0.25],
  mint:[0.42,0.64,0.49], pink:[0.68,0.36,0.38], purple:[0.36,0.22,0.42],
  charcoal:[0.12,0.14,0.15], dark:[0.07,0.08,0.09], glass:[0.18,0.35,0.4],
  gold:[0.83,0.62,0.22], concrete:[0.48,0.49,0.46], sand:[0.72,0.62,0.45],
  leaf:[0.16,0.34,0.18], leaf2:[0.29,0.46,0.22], steel:[0.38,0.42,0.42],
  orange:[0.91,0.29,0.06], black:[0.035,0.04,0.045]
};

function tri(out,a,b,c,color) {
  const ab=b.map((v,i)=>v-a[i]), ac=c.map((v,i)=>v-a[i]);
  let n=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];
  const l=Math.hypot(...n)||1; n=n.map(v=>v/l);
  for(const p of [a,b,c]) { out.p.push(...p); out.n.push(...n); out.c.push(...color); }
}
function quad(out,a,b,c,d,color) { tri(out,a,b,c,color); tri(out,a,c,d,color); }
function box(out,x,y,z,w,h,d,color) {
  const x0=x-w/2,x1=x+w/2,y0=y-h/2,y1=y+h/2,z0=z-d/2,z1=z+d/2;
  quad(out,[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],color);
  quad(out,[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],color);
  quad(out,[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],color);
  quad(out,[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],color);
  quad(out,[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],color);
  quad(out,[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],color);
}
function cylinder(out,x,y,z,r,h,color,segments=12,axis='y') {
  for(let i=0;i<segments;i++){
    const a=i*Math.PI*2/segments,b=(i+1)*Math.PI*2/segments;
    let p1,p2,p3,p4,lo1,lo2,hi1,hi2;
    if(axis==='x'){
      lo1=[x-h/2,y+Math.cos(a)*r,z+Math.sin(a)*r]; lo2=[x-h/2,y+Math.cos(b)*r,z+Math.sin(b)*r];
      hi1=[x+h/2,y+Math.cos(a)*r,z+Math.sin(a)*r]; hi2=[x+h/2,y+Math.cos(b)*r,z+Math.sin(b)*r];
      p1=[x-h/2,y,z];p2=[x+h/2,y,z];
    } else if(axis==='z'){
      lo1=[x+Math.cos(a)*r,y+Math.sin(a)*r,z-h/2]; lo2=[x+Math.cos(b)*r,y+Math.sin(b)*r,z-h/2];
      hi1=[x+Math.cos(a)*r,y+Math.sin(a)*r,z+h/2]; hi2=[x+Math.cos(b)*r,y+Math.sin(b)*r,z+h/2];
      p1=[x,y,z-h/2];p2=[x,y,z+h/2];
    } else {
      lo1=[x+Math.cos(a)*r,y-h/2,z+Math.sin(a)*r]; lo2=[x+Math.cos(b)*r,y-h/2,z+Math.sin(b)*r];
      hi1=[x+Math.cos(a)*r,y+h/2,z+Math.sin(a)*r]; hi2=[x+Math.cos(b)*r,y+h/2,z+Math.sin(b)*r];
      p1=[x,y-h/2,z];p2=[x,y+h/2,z];
    }
    quad(out,lo1,lo2,hi2,hi1,color); tri(out,p1,lo2,lo1,color); tri(out,p2,hi1,hi2,color);
  }
}
function sphere(out,x,y,z,rx,ry,rz,color,segments=10,rings=7){
  for(let j=0;j<rings;j++){
    const v0=-Math.PI/2+j*Math.PI/rings,v1=-Math.PI/2+(j+1)*Math.PI/rings;
    for(let i=0;i<segments;i++){
      const a=i*2*Math.PI/segments,b=(i+1)*2*Math.PI/segments;
      const pt=(v,u)=>[x+rx*Math.cos(v)*Math.cos(u),y+ry*Math.sin(v),z+rz*Math.cos(v)*Math.sin(u)];
      quad(out,pt(v0,a),pt(v0,b),pt(v1,b),pt(v1,a),color);
    }
  }
}
function roof(out, width, depth, y, height, color, style='gable') {
  if(style==='gable'){
    const x=width/2,d=depth/2;
    quad(out,[-x,y,-d],[0,y+height,-d],[0,y+height,d],[-x,y,d],color);
    quad(out,[0,y+height,-d],[x,y,-d],[x,y,d],[0,y+height,d],color);
    quad(out,[-x,y,-d],[x,y,-d],[0,y+height,-d],[0,y+height,-d],color);
    quad(out,[x,y,d],[-x,y,d],[0,y+height,d],[0,y+height,d],color);
  } else if(style==='dome') {
    sphere(out,0,y,0,width*.45,height,depth*.45,color,16,8);
  } else if(style==='pyramid') {
    const x=width/2,d=depth/2;
    const p=[0,y+height,0], a=[-x,y,-d],b=[x,y,-d],c=[x,y,d],e=[-x,y,d];
    tri(out,a,b,p,color);tri(out,b,c,p,color);tri(out,c,e,p,color);tri(out,e,a,p,color);
  }
}
function windowBox(out,x,y,z,w=.8,h=1.05,color=C.glass){
  box(out,x,y,z,w+.18,h+.18,.13,C.cream);
  box(out,x,y,z+.08,w,h,.1,color);
  box(out,x,y,z+.15,.09,h,.05,C.steel);
  box(out,x,y,z+.15,w,.08,.05,C.steel);
}
function sign(out,x,y,z,w,h,bg,labelColor=C.ivory){
  box(out,x,y,z,w,h,.22,bg);
  // Raised sign lettering is abstracted into a legible stripe-and-glyph motif, not a texture.
  box(out,x,y+.06,z+.13,w*.72,.07,.035,labelColor);
  box(out,x-w*.25,y-.12,z+.13,.055,.13,.035,labelColor);
  box(out,x,y-.12,z+.13,.055,.13,.035,labelColor);
  box(out,x+w*.25,y-.12,z+.13,.055,.13,.035,labelColor);
}
function stairs(out,x,z,steps,width,color){
  for(let i=0;i<steps;i++) box(out,x,.08+i*.08,z-i*.18,width,.16,.32,color);
}
function buildingBase(name,wall,accent,roofColor,height=9){
  const o={p:[],n:[],c:[]};
  box(o,0,.3,0,8,.6,7,C.concrete);
  box(o,0,height/2+.6,0,7.6,height,6.6,wall);
  box(o,0,height+.68,0,8.1,.28,7.1,accent);
  box(o,0,height+.9,0,7.7,.18,6.8,roofColor);
  return o;
}
const buildingDefs = [
 {id:'01_scooter_garage',name:'Scooter Garage',w:C.charcoal,a:C.orange,r:C.steel,h:7,kind:'garage'},
 {id:'02_kirana_store',name:'Kirana Store',w:C.cream,a:C.green,r:C.terracotta,h:6.5,kind:'shop'},
 {id:'03_chai_tapri',name:'Chai Tapri',w:C.sand,a:C.saffron,r:C.charcoal,h:5.2,kind:'tapri'},
 {id:'04_medical_store',name:'Medical Store',w:C.white,a:C.green,r:C.white,h:7,kind:'medical'},
 {id:'05_punjabi_dhaba',name:'Punjabi Dhaba',w:C.terracotta,a:C.gold,r:C.brick,h:6.8,kind:'dhaba'},
 {id:'06_sweet_shop',name:'Sweet Shop',w:C.pink,a:C.gold,r:C.cream,h:7,kind:'sweet'},
 {id:'07_mobile_shop',name:'Mobile Shop',w:C.blue,a:C.saffron,r:C.charcoal,h:7.5,kind:'mobile'},
 {id:'08_bank',name:'Bank Branch',w:C.ivory,a:C.blue,r:C.steel,h:10,kind:'bank'},
 {id:'09_atm_kiosk',name:'ATM Kiosk',w:C.blue,a:C.sky,r:C.charcoal,h:4.6,kind:'atm'},
 {id:'10_police_station',name:'Police Station',w:C.cream,a:C.blue,r:C.blue,h:9,kind:'police'},
 {id:'11_city_hospital',name:'City Hospital',w:C.white,a:C.red,r:C.white,h:13,kind:'hospital'},
 {id:'12_public_school',name:'Public School',w:C.sand,a:C.blue,r:C.terracotta,h:10,kind:'school'},
 {id:'13_hindu_temple',name:'Temple',w:C.terracotta,a:C.gold,r:C.saffron,h:12,kind:'temple'},
 {id:'14_mosque',name:'Mosque',w:C.ivory,a:C.teal,r:C.gold,h:11,kind:'mosque'},
 {id:'15_gurdwara',name:'Gurdwara',w:C.cream,a:C.gold,r:C.ivory,h:10,kind:'gurdwara'},
 {id:'16_bus_stand',name:'Bus Stand',w:C.blue,a:C.saffron,r:C.steel,h:6,kind:'bus'},
 {id:'17_petrol_pump',name:'Petrol Pump',w:C.ivory,a:C.orange,r:C.orange,h:6,kind:'petrol'},
 {id:'18_cinema',name:'Cinema',w:C.purple,a:C.red,r:C.charcoal,h:11,kind:'cinema'},
 {id:'19_shopping_complex',name:'Shopping Complex',w:C.sky,a:C.orange,r:C.blue,h:14,kind:'mall'},
 {id:'20_residential_apartment',name:'Residential Apartment',w:C.sand,a:C.brick,r:C.terracotta,h:16,kind:'apartment'}
];
function makeBuilding(d,index){
  const o=buildingBase(d.name,d.w,d.a,d.r,d.h), k=d.kind, h=d.h;
  if(['temple','mosque','gurdwara'].includes(k)){
    box(o,0,h+1,0,4.2,2.1,3.9,d.w);
    if(k==='temple'){
      roof(o,4.4,4.2,h+2.05,3.2,C.saffron,'pyramid');
      cylinder(o,0,h+6.0,0,.12,1.2,C.gold,10);
      for(const x of [-1.4,0,1.4]) cylinder(o,x,h+1.2,2.05,.16,2.2,C.gold,8);
      box(o,0,1.8,3.42,1.2,2.5,.16,C.dark);
    } else if(k==='mosque'){
      for(const x of [-1.6,1.6]) { cylinder(o,x,h+3,0,.72,3,C.cream,16); sphere(o,x,h+4.7,0,.14,.3,.14,C.gold); }
      roof(o,4.5,4.2,h+2,2.1,C.gold,'dome');
      for(const x of [-2.6,2.6]) { cylinder(o,x,h+3.5,0,.18,7,C.cream,12); roof(o,.7,.7,h+7,1.3,C.gold,'pyramid'); }
      box(o,0,1.8,3.42,1.2,2.5,.16,C.teal);
    } else {
      roof(o,4.6,4.2,h+2.1,2.1,C.gold,'dome');
      for(const x of [-2.4,2.4]) { cylinder(o,x,h+2.4,0,.22,4,C.gold,12); sphere(o,x,h+4.6,0,.16,.35,.16,C.gold); }
      box(o,0,1.9,3.42,1.3,2.7,.18,C.dark);
    }
    stairs(o,0,.2,5,4.4,C.cream);
  } else if(k==='garage'){
    box(o,0,2.5,3.36,5.5,4.4,.25,C.charcoal);
    box(o,0,2.4,3.53,4.9,3.9,.08,C.dark);
    sign(o,0,h-.2,3.5,5.8,.8,C.orange);
    for(const x of [-2.4,2.4]) cylinder(o,x,1.2,2.7,.12,2.4,C.gold);
  } else if(k==='tapri'){
    for(const x of [-3,3]) cylinder(o,x,2.9,0,.1,5.2,C.charcoal,8);
    roof(o,8.2,7.2,5.4,0,C.orange,'flat');
    box(o,0,1.25,2.9,5.8,1.5,.9,C.terracotta);
    for(const x of [-2,0,2]) cylinder(o,x,.85,2.2,.18,.7,C.gold,10);
    sign(o,0,4.5,3.15,5.6,.65,C.saffron);
  } else if(k==='shop'||k==='medical'||k==='dhaba'||k==='sweet'||k==='mobile'||k==='atm'){
    const frontZ=3.38;
    box(o,0,1.7,frontZ,3.2,3.2,.16,C.dark);
    box(o,0,1.7,frontZ+.1,2.85,2.85,.08,C.glass);
    box(o,0,.32,frontZ+.2,3.3,.18,.22,C.gold);
    sign(o,0,h-.5,3.55,6.5,.8,d.a);
    if(k==='medical') { box(o,0,h-.5,3.72,.18,.5,.05,C.white);box(o,0,h-.5,3.72,.5,.18,.05,C.white); }
    if(k==='dhaba'){ for(let x=-2;x<=2;x+=2) cylinder(o,x,1.3,4,.22,.5,C.gold); }
    if(k==='sweet'){ for(let x=-2;x<=2;x+=2) sphere(o,x,2.2,3.9,.35,.24,.2,C.gold); }
    if(k==='atm') box(o,0,1.6,3.5,1.5,2.6,.25,C.charcoal);
  } else if(k==='bank'||k==='police'||k==='hospital'||k==='school'||k==='bus'||k==='petrol'||k==='cinema'||k==='mall'||k==='apartment'){
    const floors=Math.max(2,Math.floor(h/3));
    for(let f=0;f<floors;f++){
      for(let x=-2.5;x<=2.5;x+=2.5) windowBox(o,x,1.8+f*2.7,3.38,.85,1.25,(f+x)%2?C.glass:C.sky);
      box(o,0,1.8+f*2.7,3.36,7.6,.12,.08,d.a);
    }
    sign(o,0,h-.8,3.55,6.7,.85,d.a);
    if(k==='hospital') { box(o,0,h-.8,3.74,.22,.55,.06,C.white);box(o,0,h-.8,3.74,.55,.22,.06,C.white); }
    if(k==='police') { for(const x of [-2.4,2.4]) cylinder(o,x,h+1,0,.55,1.6,C.blue,12); }
    if(k==='school') { box(o,0,1.5,3.55,1.2,2.5,.16,C.dark); }
    if(k==='bus') { box(o,0,3.1,0,7.2,.18,6.2,C.steel);for(const x of [-3,3])cylinder(o,x,1.8,0,.12,3.6,C.steel); }
    if(k==='petrol') { box(o,0,4.5,0,8,.3,7,C.orange);for(const x of [-2.5,2.5])box(o,x,2.5,0,.16,5,.16,C.steel); }
    if(k==='cinema') { box(o,0,4,3.55,4.2,3.5,.15,C.dark);for(const x of [-1.4,0,1.4])box(o,x,4,3.68,.1,2.8,.04,C.gold); }
    if(k==='mall') { box(o,0,h+.9,0,8.3,.5,7.3,C.blue); }
    if(k==='apartment') { for(const x of [-3.2,3.2])box(o,x,h/2,0,.18,h,6.5,C.brick); }
  }
  // Rooftop water tank, vents, parapets and a solar panel distinguish the silhouette.
  box(o,0,h+1.2,-2.4,7.8,.3,.25,d.a);
  cylinder(o,2.7,h+2.0,-1.8,.65,1.35,C.steel,12);
  box(o,-2.4,h+1.45,-1.8,1.5,.12,1.1,C.charcoal);
  return o;
}
function writeGlb(filename, meshes, extras={}) {
  const binParts=[], views=[], accessors=[], gltfMeshes=[], nodes=[];
  let offset=0;
  function addView(buf,target){
    const pad=(4-(offset%4))%4;if(pad){binParts.push(Buffer.alloc(pad));offset+=pad;}
    const start=offset;binParts.push(buf);offset+=buf.length;
    const v={buffer:0,byteOffset:start,byteLength:buf.length};if(target)v.target=target;views.push(v);return views.length-1;
  }
  function addAccessor(view,componentType,count,type,min,max){
    const a={bufferView:view,componentType,count,type};if(min)a.min=min;if(max)a.max=max;accessors.push(a);return accessors.length-1;
  }
  for(const m of meshes){
    if(!m.p.length)continue;
    const pos=Float32Array.from(m.p),norm=Float32Array.from(m.n),col=Float32Array.from(m.c);
    const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
    for(let i=0;i<pos.length;i+=3)for(let k=0;k<3;k++){min[k]=Math.min(min[k],pos[i+k]);max[k]=Math.max(max[k],pos[i+k]);}
    const pa=addAccessor(addView(Buffer.from(pos.buffer),34962),5126,pos.length/3,'VEC3',min,max);
    const na=addAccessor(addView(Buffer.from(norm.buffer),34962),5126,norm.length/3,'VEC3');
    const ca=addAccessor(addView(Buffer.from(col.buffer),34962),5126,col.length/3,'VEC3');
    const mi=gltfMeshes.length;
    gltfMeshes.push({name:m.name,primitives:[{attributes:{POSITION:pa,NORMAL:na,COLOR_0:ca},mode:4,material:0}]});
    nodes.push({name:m.name,mesh:mi,...(m.translation?{translation:m.translation}:{})});
  }
  const bin=Buffer.concat(binParts);
  const gltf={asset:{version:'2.0',generator:'Indian Rider Original Asset Forge'},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes:gltfMeshes,accessors,bufferViews:views,buffers:[{byteLength:bin.length}],materials:[{name:'Paint and material palette',pbrMetallicRoughness:{baseColorFactor:[1,1,1,1],metallicFactor:.18,roughnessFactor:.72},doubleSided:true}],extras};
  let json=Buffer.from(JSON.stringify(gltf));const jp=(4-json.length%4)%4;json=Buffer.concat([json,Buffer.alloc(jp,0x20)]);
  const bp=(4-bin.length%4)%4,binPadded=Buffer.concat([bin,Buffer.alloc(bp)]);
  const total=12+8+json.length+8+binPadded.length;
  const header=Buffer.alloc(12);header.write('glTF',0);header.writeUInt32LE(2,4);header.writeUInt32LE(total,8);
  const jh=Buffer.alloc(8);jh.writeUInt32LE(json.length,0);jh.writeUInt32LE(0x4e4f534a,4);
  const bh=Buffer.alloc(8);bh.writeUInt32LE(binPadded.length,0);bh.writeUInt32LE(0x004e4942,4);
  fs.writeFileSync(path.join(outDir,filename),Buffer.concat([header,jh,json,bh,binPadded]));
}
for(let i=0;i<buildingDefs.length;i++){
  const d=buildingDefs[i], mesh=makeBuilding(d,i);
  writeGlb(d.id+'.glb',[{name:d.name,...mesh}],{assetType:'building',original:true,footprint:[8,7],designIndex:i+1});
}

// Original Rider 125 scooter: separately named parts so wheels, steering and lean can be animated in Three.js.
function makeScooter(){
  const parts=[];
  const add=(name,fn,pivot=[0,0,0])=>{const o={name,p:[],n:[],c:[]};fn(o);for(let i=0;i<o.p.length;i+=3){o.p[i]-=pivot[0];o.p[i+1]-=pivot[1];o.p[i+2]-=pivot[2];}o.translation=pivot;parts.push(o);};
  const B=(o,x,y,z,w,h,d,c)=>box(o,x,y,z,w,h,d,c);
  add('Frame and floorboard',o=>{
    B(o,0,.66,.08,.72,.2,1.22,C.charcoal);B(o,0,.78,.1,.88,.13,.85,C.orange);
    B(o,0,.92,.56,.78,.9,.28,C.orange);B(o,0,1.12,.64,.62,.48,.18,C.orange);
    sphere(o,0,1.12,.54,.43,.46,.42,C.orange,14,9);
    B(o,0,1.2,.76,.38,.28,.1,C.black);
    B(o,0,.82,-.42,.65,.16,.68,C.black);
  });
  add('Front apron and cowl',o=>{
    B(o,0,1.12,-.64,.82,.92,.3,C.orange);B(o,0,1.52,-.69,.72,.38,.25,C.orange);
    B(o,0,1.0,-.82,.66,.32,.16,C.black);
    sphere(o,0,1.48,-.85,.29,.2,.08,C.ivory,14,8);
    B(o,-.34,1.18,-.83,.09,.24,.08,C.gold);B(o,.34,1.18,-.83,.09,.24,.08,C.gold);
    B(o,-.18,1.48,-.91,.2,.12,.055,C.white);B(o,.18,1.48,-.91,.2,.12,.055,C.white);
    B(o,0,1.3,-.92,.1,.08,.04,C.gold);
    B(o,0,.92,-.86,.55,.08,.12,C.charcoal);
  });
  add('Seat',o=>{
    B(o,0,1.52,.27,.72,.22,1.02,C.black);B(o,0,1.63,.3,.66,.08,.88,C.charcoal);
    B(o,0,1.42,.64,.55,.16,.22,C.black);
  });
  add('Handlebar assembly',o=>{
    cylinder(o,0,1.72,-.55,.08,.52,C.steel,12);
    cylinder(o,0,1.98,-.55,.055,1.02,C.charcoal,14,'x');
    for(const x of [-.58,.58]){cylinder(o,x,1.98,-.55,.07,.24,C.black,12,'x');sphere(o,x*1.25,2.0,-.55,.12,.09,.09,C.steel);}
    B(o,0,1.8,-.58,.34,.12,.25,C.charcoal);
  });
  add('Left and right mirrors',o=>{
    for(const x of [-.57,.57]){cylinder(o,x*.55,2.0,-.58,.025,.42,C.steel,8);sphere(o,x,2.22,-.58,.17,.12,.08,C.black,12,8);sphere(o,x,2.22,-.62,.13,.085,.025,C.glass,12,8);}
  });
  add('Rear wheel',o=>{
    cylinder(o,0,.36,.78,.36,.18,C.black,24,'x');cylinder(o,0,.36,.78,.23,.2,C.steel,20,'x');
    cylinder(o,0,.36,.78,.1,.22,C.gold,16,'x');
    for(let i=0;i<8;i++){const a=i*Math.PI/4;B(o,0,.36+Math.cos(a)*.17,.78+Math.sin(a)*.17,.2,.035,.035,C.steel);}
  },[0,.36,.78]);
  add('Front wheel',o=>{
    cylinder(o,0,.36,-.98,.36,.18,C.black,24,'x');cylinder(o,0,.36,-.98,.23,.2,C.steel,20,'x');
    cylinder(o,0,.36,-.98,.1,.22,C.gold,16,'x');
    cylinder(o,-.105,.36,-.98,.24,.025,C.steel,24,'x');
    cylinder(o,-.13,.42,-.86,.055,.25,C.red,10);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;B(o,0,.36+Math.cos(a)*.17,-.98+Math.sin(a)*.17,.2,.035,.035,C.steel);}
  },[0,.36,-.98]);
  add('Front suspension and mudguard',o=>{
    for(const x of [-.2,.2])cylinder(o,x,.72,-.94,.045,.82,C.steel,10);
    B(o,0,.77,-1.04,.84,.12,.62,C.orange);
  });
  add('Rear suspension and exhaust',o=>{
    cylinder(o,-.28,.7,.65,.065,.78,C.steel,10);
    cylinder(o,.32,.42,.72,.12,.92,C.charcoal,12,'z');
    cylinder(o,.32,.42,.24,.14,.12,C.steel,12,'z');
    sphere(o,.32,.42,.2,.16,.14,.12,C.steel,12,8);
    B(o,.28,.78,.72,.2,.12,.52,C.orange);
  });
  add('Tail and number plate',o=>{
    B(o,0,1.1,1.0,.5,.2,.18,C.red);B(o,0,.84,1.12,.42,.25,.06,C.white);
    B(o,0,1.16,1.1,.3,.08,.05,C.red);
    B(o,0,.86,1.16,.28,.04,.02,C.charcoal);
    B(o,0,1.02,1.12,.16,.08,.05,C.red);
  });
  add('Side body panels and trim',o=>{
    for(const side of [-1,1]){
      B(o,side*.39,.98,.12,.12,.48,.72,C.orange);
      B(o,side*.455,1.04,.12,.035,.22,.42,C.gold);
      B(o,side*.4,.72,-.15,.12,.12,.58,C.charcoal);
    }
  });
  add('Foot pegs and brake details',o=>{
    for(const x of [-.5,.5]){cylinder(o,x,.56,.2,.07,.3,C.steel,10,'x');}
    cylinder(o,-.12,.42,-.98,.25,.035,C.gold,20,'x');
  });
  return parts;
}
writeGlb('rider125_scooter.glb',makeScooter(),{assetType:'vehicle',original:true,design:'Rider 125',parts:'named meshes for animation',frontDirection:'-Z',upAxis:'Y'});

// Original blue sport-bike for Indian Rider. Front points toward -Z; wheel pivots are separate nodes.
function makeR15SportBike(){
  const parts=[];
  const add=(name,fn,pivot=[0,0,0])=>{
    const o={name,p:[],n:[],c:[]}; fn(o);
    for(let i=0;i<o.p.length;i+=3){o.p[i]-=pivot[0];o.p[i+1]-=pivot[1];o.p[i+2]-=pivot[2];}
    o.translation=pivot;parts.push(o);
  };
  const B=(o,x,y,z,w,h,d,c)=>box(o,x,y,z,w,h,d,c);
  const CY=(o,x,y,z,r,h,c,seg=16,axis='y')=>cylinder(o,x,y,z,r,h,c,seg,axis);
  const SP=(o,x,y,z,rx,ry,rz,c)=>sphere(o,x,y,z,rx,ry,rz,c,16,10);

  // Main chassis, subframe, engine and swingarm.
  add('01 Trellis frame and subframe',o=>{
    for(const side of [-1,1]){
      CY(o,side*.27,1.0,0,.065,1.35,C.steel,10,'z');
      CY(o,side*.27,1.0,.52,.055,.92,C.steel,10,'z');
      CY(o,side*.27,1.28,.3,.05,.88,C.steel,10,'z');
      CY(o,side*.27,1.05,.72,.045,.72,C.charcoal,10,'z');
    }
    B(o,0,.72,.08,.72,.16,1.15,C.charcoal);
    B(o,0,1.2,.72,.55,.12,.75,C.steel);
  });
  add('02 Engine block and crankcase',o=>{
    SP(o,0,.91,.12,.42,.48,.48,C.charcoal);
    CY(o,0,1.02,-.12,.29,.48,C.steel,16,'z');
    SP(o,0,1.05,-.34,.3,.31,.19,C.dark);
    B(o,0,1.38,-.08,.48,.12,.34,C.steel);
    for(let i=0;i<5;i++) B(o,0,1.42+i*.055,-.24,.42,.025,.3,C.charcoal);
    CY(o,.36,.93,.08,.09,.25,C.gold,12,'x');
  });
  add('03 Rear swingarm',o=>{
    for(const side of [-1,1]){
      CY(o,side*.18,.54,.75,.065,1.02,C.steel,10,'z');
      CY(o,side*.18,.54,.75,.04,.95,C.charcoal,10,'z');
    }
    B(o,0,.53,.75,.48,.12,.16,C.steel);
  });

  // Wheels have their own origins so Three.js can animate their rotation.
  add('04 Rear wheel rotating pivot',o=>{
    CY(o,0,0,0,.49,.23,C.black,32,'x');
    CY(o,0,0,0,.38,.245,C.steel,32,'x');
    CY(o,0,0,0,.29,.26,C.charcoal,24,'x');
    CY(o,0,0,0,.095,.28,C.gold,16,'x');
    for(let i=0;i<10;i++){
      const a=i*Math.PI*2/10;
      CY(o,0,Math.cos(a)*.235,Math.sin(a)*.235,.025,.19,C.steel,8,'x');
    }
    CY(o,0,0,0,.27,.012,C.gold,32,'x');
    for(let i=0;i<36;i++){
      const a=i*Math.PI*2/36;
      CY(o,0,Math.cos(a)*.325,Math.sin(a)*.325,.012,.014,C.steel,6,'x');
    }
  },[0,.49,.83]);
  add('05 Front wheel rotating pivot',o=>{
    CY(o,0,0,0,.49,.23,C.black,32,'x');
    CY(o,0,0,0,.38,.245,C.steel,32,'x');
    CY(o,0,0,0,.29,.26,C.charcoal,24,'x');
    CY(o,0,0,0,.095,.28,C.gold,16,'x');
    for(let i=0;i<10;i++){
      const a=i*Math.PI*2/10;
      CY(o,0,Math.cos(a)*.235,Math.sin(a)*.235,.025,.19,C.steel,8,'x');
    }
    CY(o,0,0,0,.27,.012,C.gold,32,'x');
    for(let i=0;i<36;i++){
      const a=i*Math.PI*2/36;
      CY(o,0,Math.cos(a)*.325,Math.sin(a)*.325,.012,.014,C.steel,6,'x');
    }
  },[0,.49,-1.02]);

  // Blue bodywork, tank and aggressive sport-bike silhouette.
  add('06 Fuel tank sculpted blue',o=>{
    SP(o,0,1.78,.03,.47,.43,.66,C.blue);
    SP(o,0,1.91,-.04,.4,.27,.53,C.sky);
    CY(o,0,2.18,.02,.16,.035,C.steel,20,'y');
    CY(o,0,2.205,.02,.105,.018,C.black,20,'y');
  });
  add('07 Left blue side fairing',o=>{
    SP(o,-.39,1.16,-.35,.2,.48,.68,C.blue);
    SP(o,-.48,1.27,-.52,.12,.32,.45,C.sky);
    B(o,-.49,.94,-.48,.045,.12,.62,C.charcoal);
    B(o,-.48,1.42,-.7,.035,.08,.26,C.white);
    B(o,-.46,1.05,-.05,.04,.08,.32,C.gold);
  });
  add('08 Right blue side fairing',o=>{
    SP(o,.39,1.16,-.35,.2,.48,.68,C.blue);
    SP(o,.48,1.27,-.52,.12,.32,.45,C.sky);
    B(o,.49,.94,-.48,.045,.12,.62,C.charcoal);
    B(o,.48,1.42,-.7,.035,.08,.26,C.white);
    B(o,.46,1.05,-.05,.04,.08,.32,C.gold);
  });
  add('09 Lower belly pan',o=>{
    SP(o,0,.75,-.18,.43,.17,.62,C.charcoal);
    B(o,0,.65,-.32,.72,.12,.58,C.black);
    B(o,0,.72,-.62,.62,.08,.18,C.blue);
  });
  add('10 Tail cowl and rear seat',o=>{
    SP(o,0,1.66,.91,.34,.25,.56,C.blue);
    SP(o,0,1.79,1.02,.27,.16,.39,C.sky);
    SP(o,0,1.58,.47,.34,.13,.45,C.charcoal);
    SP(o,0,1.72,1.26,.2,.11,.23,C.red);
    B(o,0,.96,1.23,.36,.24,.08,C.charcoal);
  });
  add('11 Rider seat',o=>{
    SP(o,0,1.78,.55,.31,.12,.52,C.black);
    SP(o,0,1.82,.42,.28,.07,.38,C.charcoal);
  });
  add('12 Windscreen and front cowl',o=>{
    SP(o,0,2.0,-.86,.43,.32,.29,C.blue);
    SP(o,0,2.18,-.99,.31,.28,.17,C.glass);
    B(o,0,2.02,-1.1,.58,.1,.13,C.charcoal);
    SP(o,-.19,1.9,-1.06,.17,.11,.06,C.white);
    SP(o,.19,1.9,-1.06,.17,.11,.06,C.white);
    B(o,-.2,1.78,-1.1,.12,.045,.05,C.gold);
    B(o,.2,1.78,-1.1,.12,.045,.05,C.gold);
  });
  add('13 Front fender',o=>{
    SP(o,0,1.0,-1.05,.34,.1,.52,C.blue);
    B(o,0,1.04,-1.05,.5,.06,.62,C.sky);
  });
  add('14 Front fork and gold USD tubes',o=>{
    for(const side of [-1,1]){
      CY(o,side*.22,1.0,-.94,.07,.92,C.gold,14,'z');
      CY(o,side*.22,.94,-.94,.045,.92,C.steel,12,'z');
      CY(o,side*.22,1.38,-.83,.09,.16,C.charcoal,12,'z');
    }
    B(o,0,1.44,-.72,.55,.12,.16,C.steel);
  });
  add('15 Rear monoshock and linkage',o=>{
    CY(o,.12,.91,.54,.075,.65,C.gold,12,'z');
    CY(o,.12,.91,.54,.12,.13,C.steel,12,'z');
    for(let i=0;i<8;i++) CY(o,.12,.91,.54-i*.045,.105,.018,C.gold,12,'z');
  });
  add('16 Front and rear brake discs',o=>{
    for(const z of [-1.02,.83]){
      CY(o,-.145,.49,z,.29,.025,C.steel,32,'x');
      CY(o,-.145,.49,z,.21,.03,C.charcoal,24,'x');
      for(let i=0;i<20;i++){
        const a=i*Math.PI*2/20;
        CY(o,-.16,.49+Math.cos(a)*.25,z+Math.sin(a)*.25,.012,.03,C.gold,6,'x');
      }
    }
    CY(o,.15,.49,-1.02,.25,.025,C.steel,28,'x');
  });
  add('17 Exhaust header and muffler',o=>{
    CY(o,.24,.75,-.15,.075,.65,C.steel,12,'z');
    CY(o,.31,.63,.43,.11,.58,C.steel,12,'z');
    CY(o,.39,.69,.78,.14,.76,C.charcoal,16,'z');
    CY(o,.39,.69,1.17,.12,.06,C.steel,16,'z');
    CY(o,.39,.69,1.205,.075,.025,C.black,16,'z');
  });
  add('18 Handlebar controls and mirrors',o=>{
    CY(o,0,2.02,-.78,.055,.82,C.steel,14,'x');
    for(const side of [-1,1]){
      CY(o,side*.48,2.02,-.78,.065,.28,C.black,12,'x');
      CY(o,side*.34,2.04,-.78,.08,.14,C.steel,12,'x');
      CY(o,side*.28,2.27,-.83,.025,.34,C.steel,10,'z');
      SP(o,side*.28,2.45,-.83,.16,.09,.08,C.black);
      SP(o,side*.28,2.45,-.87,.12,.06,.025,C.glass);
    }
    B(o,0,2.03,-.8,.32,.14,.18,C.charcoal);
  });
  add('19 Chain sprocket and chain',o=>{
    CY(o,.22,.52,.83,.19,.06,C.gold,24,'x');
    for(let i=0;i<30;i++){
      const a=i*Math.PI*2/30;
      CY(o,.22,.52+Math.cos(a)*.2,.83+Math.sin(a)*.2,.018,.07,C.steel,6,'x');
    }
    for(let i=0;i<18;i++) B(o,.23,.48+i*.004,.25+i*.033,.045,.045,.04,C.steel);
  });
  add('20 Foot pegs, levers and side stand',o=>{
    for(const side of [-1,1]){
      CY(o,side*.48,.65,.22,.055,.3,C.steel,10,'x');
      B(o,side*.48,.63,.22,.24,.06,.12,C.black);
    }
    CY(o,.26,.36,.38,.035,.48,C.steel,10,'z');
  });
  add('21 Rear LED tail and indicators',o=>{
    SP(o,0,1.73,1.48,.22,.12,.07,C.red);
    for(const side of [-1,1]) CY(o,side*.32,1.34,1.32,.055,.12,C.orange,12,'x');
  });
  add('22 Number plate and rear mudguard',o=>{
    B(o,0,.8,1.43,.34,.24,.035,C.white);
    B(o,0,.8,1.46,.24,.035,.02,C.charcoal);
    B(o,0,.58,1.31,.28,.34,.06,C.black);
  });
  return parts;
}
writeGlb('r15_sport_bike.glb',makeR15SportBike(),{
  assetType:'vehicle',original:true,design:'R15-inspired blue sport motorcycle',
  note:'Original stylised game mesh, not a manufacturer CAD replica',
  frontDirection:'-Z',upAxis:'Y',
  animatedParts:['04 Rear wheel rotating pivot','05 Front wheel rotating pivot'],
  components:'22 separately named mesh groups'
});

const manifest = {
  format: 'glTF 2.0 binary (.glb)',
  generator: 'Indian Rider Original Asset Forge',
  buildings: buildingDefs.map(({id,name},index)=>({id,name,file:id+'.glb',designIndex:index+1})),
  playerVehicle: { id:'r15_sport_bike', name:'R15-inspired Blue Sport Bike', file:'r15_sport_bike.glb', namedParts:true, wheelPivots:true },
  legacyVehicle: { id:'rider125_scooter', name:'Rider 125 Original Scooter', file:'rider125_scooter.glb' },
  materialWorkflow: 'PBR metallic-roughness with per-vertex colour; no external texture dependencies'
};
fs.writeFileSync(path.join(outDir,'manifest.json'), JSON.stringify(manifest,null,2)+'\n');
console.log('Generated',buildingDefs.length,'original buildings, an R15-inspired sport bike and a legacy scooter in',outDir);
