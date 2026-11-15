import * as THREE from 'three';

// Original procedural North-Indian street kit. All geometry is generated at runtime.
export function createIndianWorld(scene) {
  const mat = (color, roughness = 0.88, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness, ...extra });
  const materials = {
    asphalt: mat(0x303538), concrete: mat(0xb8b1a0), curb: mat(0xd8d0bd),
    saffron: mat(0xd58b32), teal: mat(0x287b78), red: mat(0xa94132),
    cream: mat(0xe9ddc4), wood: mat(0x79563b), metal: mat(0x42494a),
    leaf: mat(0x496b48), glass: mat(0x6f9da0, .3), skin: mat(0x9a6346)
  };
  const box = (parent, w, h, d, material, x, y, z) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  };
  const cyl = (parent, r1, r2, h, material, x, y, z, sides = 10) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, sides), material);
    mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  };
  const sphere = (parent, r, material, x, y, z, sx=1, sy=1, sz=1) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 9), material);
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); parent.add(mesh); return mesh;
  };

  // Warm atmospheric sky gradient with a low sun and drifting cloud banks.
  const skyGeo = new THREE.SphereGeometry(210, 40, 24);
  const pos = skyGeo.attributes.position;
  const colors = [];
  const top = new THREE.Color(0x456b89), mid = new THREE.Color(0x9db6bd);
  const horizon = new THREE.Color(0xe8b98b);
  for (let i=0; i<pos.count; i++) {
    const t = THREE.MathUtils.clamp((pos.getY(i) / 210 + .12) / 1.05, 0, 1);
    const c = t < .35 ? horizon.clone().lerp(mid, t/.35) : mid.clone().lerp(top, (t-.35)/.65);
    colors.push(c.r,c.g,c.b);
  }
  skyGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors,3));
  const sky = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({
    vertexColors:true, side:THREE.BackSide, depthWrite:false, fog:false
  }));
  sky.renderOrder = -10; scene.add(sky);

  const sun = new THREE.Mesh(new THREE.SphereGeometry(5.2,20,16),
    new THREE.MeshBasicMaterial({color:0xffd39a, fog:false}));
  sun.position.set(-58,48,-145); scene.add(sun);
  const clouds = [];
  for (let i=0;i<9;i++) {
    const cloud = new THREE.Group();
    const cloudMat = new THREE.MeshBasicMaterial({color:0xf3eee2, transparent:true, opacity:.72, fog:false});
    const count = 4 + (i%3);
    for(let j=0;j<count;j++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(3.2+(j%2)*1.1,10,8),cloudMat);
      puff.position.set((j-(count-1)/2)*3.8,Math.sin(j*1.7)*1.1,Math.cos(j)*1.1);
      puff.scale.y=.48; cloud.add(puff);
    }
    cloud.position.set(-70+(i%3)*67,35+(i%4)*6,-35-Math.floor(i/3)*68);
    scene.add(cloud); clouds.push(cloud);
  }

  // Roadside Indian street furniture: vendor carts, fabric awnings, signs and utility poles.
  const streetProps = [];
  const signCanvas = document.createElement('canvas');
  signCanvas.width=512; signCanvas.height=160;
  const ctx=signCanvas.getContext('2d');
  ctx.fillStyle='#15594f';ctx.fillRect(0,0,512,160);
  ctx.strokeStyle='#e7c77e';ctx.lineWidth=10;ctx.strokeRect(7,7,498,146);
  ctx.fillStyle='#fff2d2';ctx.font='bold 54px sans-serif';ctx.textAlign='center';
  ctx.fillText('चाय • नाश्ता',256,68);
  ctx.font='bold 25px sans-serif';ctx.fillText('FRESH • LOCAL • DESI',256,116);
  const signTexture=new THREE.CanvasTexture(signCanvas);
  signTexture.colorSpace=THREE.SRGBColorSpace;
  const signMat=new THREE.MeshBasicMaterial({map:signTexture,side:THREE.DoubleSide});

  for (let i=0;i<10;i++) {
    for (const side of [-1,1]) {
      const z=-i*23-9;
      const x=side*(8.0+(i%2)*.35);
      const stall=new THREE.Group();
      box(stall,2.3,.12,1.45,materials.wood,0,1.05,0);
      box(stall,2.05,.65,1.2,materials.cream,0,.68,0);
      box(stall,2.55,.12,1.7,materials.red,0,1.48,0);
      // Striped canopy with a deep fascia and four slim supports.
      for(let stripe=0;stripe<5;stripe++) {
        const stripeMat=stripe%2?materials.cream:materials.saffron;
        box(stall,.48,.12,1.82,stripeMat,-1.02+stripe*.51,2.02,0);
      }
      for(const sx of [-1,1]) for(const sz of [-.68,.68])
        cyl(stall,.035,.045,1.95,materials.metal,sx*1.12,1.05,sz,7);
      // Cart wheels.
      for(const wx of [-.78,.78]) {
        const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.12,12),materials.metal);
        wheel.rotation.z=Math.PI/2;wheel.position.set(wx,.34,.78);stall.add(wheel);
      }
      const sign=new THREE.Mesh(new THREE.PlaneGeometry(1.9,.58),signMat);
      sign.position.set(0,1.18,.77);stall.add(sign);
      stall.position.set(x,0,z);stall.rotation.y=side<0?Math.PI:0;
      scene.add(stall);streetProps.push(stall);

      // Painted curb bollards and storm-water drain details.
      for(let b=0;b<3;b++) {
        const bollard=cyl(scene,.11,.14,.72,materials.cream,side*6.8,.36,z-2.1-b*.75,8);
        bollard.material=materials.cream;
        const band=cyl(scene,.145,.145,.16,materials.saffron,side*6.8,.49,z-2.1-b*.75,8);
        streetProps.push(bollard,band);
      }
      const pole=new THREE.Group();
      cyl(pole,.09,.12,7.5,materials.metal,0,3.75,0,8);
      box(pole,.95,.08,.08,materials.metal,side*.4,7.3,0);
      sphere(pole,.16,mat(0xffe4ad,.35,{emissive:0x49351a}),side*.82,7.22,0);
      pole.position.set(side*7.1,0,z+5);scene.add(pole);streetProps.push(pole);
    }
  }

  // Thin overhead utility wires, a recognizable feature of many Indian neighbourhoods.
  for (const side of [-1,1]) {
    for(let line=0;line<2;line++) {
      const points=[];
      for(let i=0;i<12;i++) points.push(new THREE.Vector3(side*(7.1+line*.16),6.8-line*.34,-i*20-5));
      const curve=new THREE.CatmullRomCurve3(points);
      const wire=new THREE.Mesh(new THREE.TubeGeometry(curve,80,.018,4,false),materials.metal);
      scene.add(wire);
    }
  }

  // Procedural pedestrian with separate limbs for a subtle walking cycle.
  const outfitPalette=[0x315c70,0x9d4937,0x52734d,0xc28c3d,0x66547c,0xd0c2a4,0x2f6863];
  function makePedestrian(x,z,index=0) {
    const person=new THREE.Group();
    const outfit=mat(outfitPalette[index%outfitPalette.length]);
    const trousers=mat(index%3===0?0x34383b:0x4a4540);
    const skin=mat([0x9a6346,0xb77b56,0x80533d,0xc18a64][index%4]);
    const hair=mat(0x242321);
    // Torso and head, with a slight shoulder silhouette.
    const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.24,.48,4,8),outfit);
    torso.position.y=1.18;person.add(torso);
    sphere(person,.17,skin,0,1.72,-.015,1,.98,.92);
    sphere(person,.175,hair,0,1.84,-.035,1,.48,1);
    // Neck and arms on pivots so they can swing while walking.
    cyl(person,.075,.075,.16,skin,0,1.52,0,8);
    const arms=[];
    for(const side of [-1,1]) {
      const pivot=new THREE.Group();pivot.position.set(side*.29,1.37,0);
      const arm=cyl(pivot,.075,.095,.55,outfit,0,-.27,0,8);
      arm.rotation.z=side*.1;
      sphere(pivot,.075,skin,0,-.57,0);
      person.add(pivot);arms.push(pivot);
    }
    const legs=[];
    for(const side of [-1,1]) {
      const pivot=new THREE.Group();pivot.position.set(side*.115,.83,0);
      cyl(pivot,.085,.105,.57,trousers,0,-.28,0,8);
      const shoe=box(pivot,.18,.1,.28,materials.metal,0,-.58,-.055);
      person.add(pivot);legs.push(pivot);
    }
    // Small cross-body bag on a few commuters.
    if(index%4===1) {
      const bag=box(person,.25,.3,.13,mat(0x493d31),.25,1.13,.15);
      bag.rotation.z=-.2;
    }
    // Dupatta / scarf accent for a subset of characters.
    if(index%5===2) {
      const scarf=box(person,.13,.55,.08,mat(0xd39a4f),-.19,1.2,.12);
      scarf.rotation.z=-.12;
    }
    person.userData.walk={arms,legs,phase:index*1.7};
    person.position.set(x,0,z);scene.add(person);return person;
  }

  return {
    makePedestrian,
    update(dt,now) {
      clouds.forEach((cloud,i)=>{cloud.position.x+=dt*(.22+(i%3)*.08);if(cloud.position.x>95)cloud.position.x=-95;});
      // Keep sky centred on the player-facing origin as the rider moves down the corridor.
      sky.position.x=0;
    }
  };
}
