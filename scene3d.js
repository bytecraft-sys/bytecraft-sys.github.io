// Android Developer 3D Portfolio Scene
(function () {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0e0717, 0.025);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 18);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // ── Lights (Romantic Neon & Electric Cherry Glow) ──
  scene.add(new THREE.AmbientLight(0x200b33, 0.6));

  const keyLight = new THREE.DirectionalLight(0xff2a85, 1.6); // Neon pink
  keyLight.position.set(6, 8, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xa855f7, 1.1); // Electric lavender
  fillLight.position.set(-6, -4, 4);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xff65a3, 1.2, 45); // Rose glow
  rimLight.position.set(-4, 6, -6);
  scene.add(rimLight);

  const accentLight = new THREE.PointLight(0xffd166, 0.7, 30); // Warm gold sparkle
  accentLight.position.set(8, -3, 2);
  scene.add(accentLight);

  // ── 3D Phone (main hero) ──
  const phoneGroup = new THREE.Group();

  // Phone body
  const phoneBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 4.8, 0.26, 4, 4, 1),
    new THREE.MeshPhysicalMaterial({
      color: 0x0a0a1e,
      metalness: 0.85,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })
  );
  phoneGroup.add(phoneBody);

  // Side bezels for depth
  const bezelMat = new THREE.MeshPhysicalMaterial({ color: 0x1e1e3a, metalness: 0.9, roughness: 0.08 });
  [-1.2, 1.2].forEach(x => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.05, 4.6, 0.24), bezelMat);
    b.position.set(x, 0, 0);
    phoneGroup.add(b);
  });

  // Screen
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.05, 4.1),
    new THREE.MeshBasicMaterial({ color: 0x060612, transparent: true, opacity: 0.97 })
  );
  screen.position.z = 0.135;
  phoneGroup.add(screen);

  // Screen edge glow
  const screenGlowMat = new THREE.MeshBasicMaterial({ color: 0xff2a85, transparent: true, opacity: 0.08 });
  const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 4.25), screenGlowMat);
  screenGlow.position.z = 0.13;
  phoneGroup.add(screenGlow);

  // Code lines on screen (Romantic Cyberpunk Palette)
  const codePalette = [
    new THREE.MeshBasicMaterial({ color: 0xff2a85, transparent: true, opacity: 0.85 }), // neon pink
    new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.75 }), // lavender
    new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.70 }), // warm gold
    new THREE.MeshBasicMaterial({ color: 0x38ef7d, transparent: true, opacity: 0.65 }), // mint
    new THREE.MeshBasicMaterial({ color: 0xffa3cb, transparent: true, opacity: 0.50 }), // blush pink
  ];
  const codeLines = [];
  const lineWidths = [1.1, 0.6, 0.9, 0.4, 1.0, 0.5, 0.75, 0.3, 0.85, 0.55, 0.95, 0.4, 0.7, 0.6];
  lineWidths.forEach((w, i) => {
    const indent = i % 3 === 0 ? 0 : i % 3 === 1 ? 0.15 : 0.3;
    const line = new THREE.Mesh(
      new THREE.PlaneGeometry(w, 0.065),
      codePalette[i % codePalette.length]
    );
    line.position.set(-0.55 + indent + w / 2 - 1.0, 1.7 - i * 0.24, 0.14);
    codeLines.push({ mesh: line, baseOp: line.material.opacity, spd: 0.3 + Math.random() * 2 });
    phoneGroup.add(line);
  });

  // Cursor blink line
  const cursor = new THREE.Mesh(
    new THREE.PlaneGeometry(0.08, 0.12),
    new THREE.MeshBasicMaterial({ color: 0xff2a85, transparent: true, opacity: 1 })
  );
  cursor.position.set(-0.72, 1.7 - 14 * 0.24, 0.14);
  phoneGroup.add(cursor);

  // Notch
  const notch = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.1),
    new THREE.MeshBasicMaterial({ color: 0x060612 })
  );
  notch.position.set(0, 2.15, 0.14);
  phoneGroup.add(notch);

  phoneGroup.position.set(3.8, 0.3, 2);
  phoneGroup.rotation.set(0.12, -0.38, 0.04);
  scene.add(phoneGroup);

  // ── Architecture Node Graph (MVVM layers) ──
  // Represents: UI → ViewModel → Repository → DataSource
  const nodeGroup = new THREE.Group();
  nodeGroup.position.set(-4.5, 0, -3);
  scene.add(nodeGroup);

  const nodeMat = (color) => new THREE.MeshPhysicalMaterial({
    color, metalness: 0.5, roughness: 0.3,
    emissive: color, emissiveIntensity: 0.25,
    transparent: true, opacity: 0.9,
  });

  const nodeData = [
    { label: 'UI',         color: 0xff2a85, pos: [0, 2.5, 0],  geo: new THREE.BoxGeometry(0.7, 0.45, 0.12) },
    { label: 'ViewModel',  color: 0xc084fc, pos: [0, 0.8, 0],  geo: new THREE.BoxGeometry(0.8, 0.45, 0.12) },
    { label: 'Repository', color: 0xff65a3, pos: [0, -0.9, 0], geo: new THREE.BoxGeometry(0.9, 0.45, 0.12) },
    { label: 'DataSource', color: 0xffd166, pos: [0, -2.6, 0], geo: new THREE.BoxGeometry(0.7, 0.45, 0.12) },
  ];

  const nodes = [];
  nodeData.forEach((n, i) => {
    const mesh = new THREE.Mesh(n.geo, nodeMat(n.color));
    mesh.position.set(...n.pos);
    nodeGroup.add(mesh);
    nodes.push({ mesh, baseEmissive: n.color });

    // Connector line down to next
    if (i < nodeData.length - 1) {
      const nextY = nodeData[i + 1].pos[1];
      const h = Math.abs(n.pos[1] - nextY) - 0.45;
      const connector = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, h, 6),
        new THREE.MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0.3 })
      );
      connector.position.set(0, (n.pos[1] + nextY) / 2, 0);
      nodeGroup.add(connector);
    }
  });

  // ── Circuit Grid (horizontal floating plane) ──
  const gridGroup = new THREE.Group();
  gridGroup.position.set(0, -6, -4);
  gridGroup.rotation.x = -Math.PI * 0.08;
  scene.add(gridGroup);

  // Grid lines
  const gridMat = new THREE.LineBasicMaterial({ color: 0x1a3a1a, transparent: true, opacity: 0.5 });
  const gridSize = 26, gridStep = 2;
  for (let i = -gridSize; i <= gridSize; i += gridStep) {
    const hGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-gridSize, 0, i), new THREE.Vector3(gridSize, 0, i)
    ]);
    gridGroup.add(new THREE.Line(hGeo, gridMat));
    const vGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(i, 0, -gridSize), new THREE.Vector3(i, 0, gridSize)
    ]);
    gridGroup.add(new THREE.Line(vGeo, gridMat));
  }

  // Grid accent dots at intersections
  const dotPositions = [];
  for (let x = -gridSize; x <= gridSize; x += gridStep * 2) {
    for (let z = -gridSize; z <= gridSize; z += gridStep * 2) {
      dotPositions.push(x, 0, z);
    }
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
  const dotMat = new THREE.PointsMaterial({
    color: 0xff2a85, size: 0.08, transparent: true, opacity: 0.35,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  gridGroup.add(new THREE.Points(dotGeo, dotMat));

  // ── Orbiting Tech Shapes ──
  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  const orbitShapes = [
    { geo: new THREE.OctahedronGeometry(0.32, 0),    color: 0x7f52ff, r: 4.2, spd: 0.32, tilt: 0.5,  ph: 0 },
    { geo: new THREE.SphereGeometry(0.22, 16, 16),   color: 0xffca28, r: 5.0, spd: 0.22, tilt: 0.65, ph: 1.3 },
    { geo: new THREE.BoxGeometry(0.36, 0.36, 0.36),  color: 0x4285f4, r: 3.6, spd: 0.42, tilt: 0.3,  ph: 2.5 },
    { geo: new THREE.TorusGeometry(0.21, 0.07, 8, 20),color: 0xc8f53b, r: 5.4, spd: 0.18, tilt: 0.55, ph: 3.7 },
    { geo: new THREE.TetrahedronGeometry(0.28, 0),   color: 0xff6b9d, r: 3.9, spd: 0.36, tilt: 0.72, ph: 4.9 },
    { geo: new THREE.DodecahedronGeometry(0.2, 0),   color: 0x00d4aa, r: 4.6, spd: 0.27, tilt: 0.25, ph: 5.6 },
  ];

  const orbiters = orbitShapes.map(s => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: s.color, metalness: 0.7, roughness: 0.15,
      emissive: s.color, emissiveIntensity: 0.35, clearcoat: 0.6,
      transparent: true, opacity: 0.9,
    });
    const mesh = new THREE.Mesh(s.geo, mat);
    orbitGroup.add(mesh);
    return { mesh, radius: s.r, speed: s.spd, tilt: s.tilt, phase: s.ph };
  });

  // ── Multi-layer Starfield ──
  function makeStars(count, spread, size, opacity, color) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * spread;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({
      color, size, transparent: true, opacity,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
  }

  const stars1 = makeStars(250, 35, 0.07, 0.55, 0xffffff);
  const stars2 = makeStars(500, 60, 0.035, 0.28, 0xaabbff);
  const stars3 = makeStars(700, 90, 0.018, 0.12, 0x556688);
  scene.add(stars1, stars2, stars3);

  // ── Mouse tracking ──
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  document.addEventListener('mousemove', e => {
    tmx = (e.clientX / window.innerWidth - 0.5) * 2;
    tmy = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Animation ──
  function animate() {
    requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    mx += (tmx - mx) * 0.045;
    my += (tmy - my) * 0.045;

    // Phone floating + mouse tilt
    phoneGroup.position.y = 0.3 + Math.sin(t * 0.5) * 0.35;
    phoneGroup.position.z = 2 + Math.sin(t * 0.28) * 0.4;
    phoneGroup.rotation.y = -0.38 + Math.sin(t * 0.3) * 0.08 + mx * 0.06;
    phoneGroup.rotation.x = 0.12 + Math.cos(t * 0.38) * 0.05 + my * 0.03;

    // Code shimmer
    codeLines.forEach((cl, i) => {
      cl.mesh.material.opacity = cl.baseOp * (0.25 + 0.75 * Math.abs(Math.sin(t * cl.spd + i * 0.6)));
    });
    cursor.material.opacity = Math.round((Math.sin(t * 2.5) + 1) / 2); // blink

    // Screen glow pulse
    screenGlowMat.opacity = 0.025 + 0.02 * Math.sin(t * 1.8);

    // MVVM node graph — gentle float + pulse emissive
    nodeGroup.rotation.y = Math.sin(t * 0.18) * 0.25 + mx * 0.04;
    nodeGroup.position.y = Math.sin(t * 0.35) * 0.3;
    nodes.forEach((n, i) => {
      n.mesh.material.emissiveIntensity = 0.15 + 0.2 * Math.abs(Math.sin(t * 0.6 + i * 0.8));
    });

    // Grid slow drift
    gridGroup.position.z = -4 + Math.sin(t * 0.1) * 0.8;
    gridGroup.rotation.x = -Math.PI * 0.08 + my * 0.015;

    // Orbits — elliptical 3D tilted paths around phone
    orbitGroup.position.set(
      phoneGroup.position.x + 3.8,
      phoneGroup.position.y,
      phoneGroup.position.z
    );
    orbiters.forEach(o => {
      const a = t * o.speed + o.phase;
      o.mesh.position.x = Math.cos(a) * o.radius;
      o.mesh.position.y = Math.sin(a * 0.7) * o.radius * 0.45 * Math.sin(o.tilt);
      o.mesh.position.z = Math.sin(a) * o.radius * 0.55 * Math.cos(o.tilt);
      o.mesh.rotation.x += 0.014;
      o.mesh.rotation.y += 0.018;
      o.mesh.rotation.z += 0.007;
      // depth fade
      const d = (o.mesh.position.z + o.radius) / (o.radius * 2);
      o.mesh.material.opacity = 0.35 + d * 0.65;
    });

    // Stars drift
    stars1.rotation.y += 0.00035;
    stars1.rotation.x += 0.00015;
    stars2.rotation.y -= 0.00018;
    stars2.rotation.z += 0.0001;
    stars3.rotation.y += 0.00008;

    // Dynamic lights
    rimLight.position.set(
      -4 + Math.sin(t * 0.4) * 3,
      6 + Math.cos(t * 0.3) * 2,
      -6
    );
    accentLight.intensity = 0.35 + 0.2 * Math.sin(t * 0.9);

    // Camera parallax
    camera.position.x += (mx * 2.2 - camera.position.x) * 0.03;
    camera.position.y += (-my * 1.4 - camera.position.y) * 0.03;
    camera.position.z = 18 + my * 0.4;
    camera.lookAt(1.5, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
