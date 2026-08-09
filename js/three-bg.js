/* ResumeForge AI — Three.js Animated Background */
(function() {
  var container = document.getElementById('three-bg');
  if (!container || typeof THREE === 'undefined') return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.z = 18;
  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Particles
  var pGeo = new THREE.BufferGeometry();
  var count = 400;
  var positions = new Float32Array(count * 3);
  for (var i = 0; i < count*3; i+=3) {
    positions[i]   = (Math.random() - 0.5) * 35;
    positions[i+1] = (Math.random() - 0.5) * 25;
    positions[i+2] = (Math.random() - 0.5) * 18;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var pMat = new THREE.PointsMaterial({ color: 0xD6B36A, size: 0.035, transparent: true, opacity: 0.55 });
  var particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Rings
  var ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(5, 0.018, 16, 120),
    new THREE.MeshBasicMaterial({ color: 0xD6B36A, transparent: true, opacity: 0.12 })
  );
  ring1.rotation.x = Math.PI / 3;
  scene.add(ring1);

  var ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(6.5, 0.012, 16, 90),
    new THREE.MeshBasicMaterial({ color: 0xF0D89A, transparent: true, opacity: 0.06 })
  );
  ring2.rotation.y = Math.PI / 4;
  scene.add(ring2);

  // Central orb
  var orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0xD6B36A, emissive: 0xD6B36A, emissiveIntensity: 0.25, transparent: true, opacity: 0.5 })
  );
  scene.add(orb);

  var light = new THREE.PointLight(0xD6B36A, 0.6, 25);
  scene.add(light);

  function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.00025;
    particles.rotation.x += 0.0001;
    ring1.rotation.z += 0.0015;
    ring2.rotation.z -= 0.0012;
    orb.rotation.y += 0.004;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
