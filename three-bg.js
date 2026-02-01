function createBG(canvasId, speed = 0.0006) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
  camera.position.z = 120;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  function resize() {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  // ===== PARTICLES =====
  const count = 160;
  const positions = new Float32Array(count * 3);
  const velocities = [];

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 400;
    positions[i3 + 1] = (Math.random() - 0.5) * 400;
    positions[i3 + 2] = (Math.random() - 0.5) * 400;

    // fake depth speed
    velocities.push(0.2 + Math.random() * 0.4);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0x3b82f6,
    size: 1.4,
    transparent: true,
    opacity: 0.28
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // ===== MOUSE PARALLAX =====
  let mouseX = 0, mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ===== CONNECTION LINES (projects only) =====
  let lineMesh = null;
  if (canvasId === "projects-bg") {
    const lineGeo = new THREE.BufferGeometry();
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.08
    });
    lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);
  }

  let isVisible = false;

  function animate() {
    if (!isVisible) return;

    const pos = geo.attributes.position.array;

    // rotation + depth motion
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i] * 0.02; // x drift
      if (pos[i3] > 200) pos[i3] = -200;
    }

    geo.attributes.position.needsUpdate = true;

    particles.rotation.y += speed;

    // parallax
    camera.position.x += (mouseX * 20 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 20 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    // dynamic connection lines
    if (lineMesh) {
      const threshold = 45;
      const vertices = [];

      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const ix = i * 3, jx = j * 3;
          const dx = pos[ix] - pos[jx];
          const dy = pos[ix + 1] - pos[jx + 1];
          const dz = pos[ix + 2] - pos[jx + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < threshold) {
            vertices.push(
              pos[ix], pos[ix + 1], pos[ix + 2],
              pos[jx], pos[jx + 1], pos[jx + 2]
            );
          }
        }
      }

      lineMesh.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // ===== VISIBILITY OBSERVER =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible = true;
        animate();
      } else {
        isVisible = false;
      }
    });
  }, { threshold: 0.2 });

  observer.observe(canvas.parentElement);
}
