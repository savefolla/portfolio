const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const radius = 2.5;

const geometry = new THREE.SphereGeometry(radius, 32, 32);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 5;

let index = 0;
let allowAnimation = false;

composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera));
glitchPass = new THREE.GlitchPass();
composer.addPass(glitchPass);

const animate = () => {
  requestAnimationFrame(animate);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  if (allowAnimation) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (index % 50 === 0) {
      sphere.geometry = new THREE.SphereGeometry(radius, 25 * Math.random(), 25 * Math.random(), 0, Math.PI * 2, 10 * Math.random(), 10 * Math.random());
    }
    index = index + 1;
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
  
};

animate();

const getDays = () => {
  const birthdate = new Date(1995, 12, 25).getTime();
  const today = new Date().getTime();
  const age = (today - birthdate) / 1000 / 60 / 60 / 24 / 365;
  document.getElementById('age').innerHTML = age.toFixed(0);
};

getDays();

addEventListener('mousemove', e => {
  const xFactor = e.clientX / window.innerWidth - .5;
  const yFactor = e.clientY / window.innerHeight - .5;
  camera.position.x = xFactor;
  camera.position.y = yFactor;
});

addEventListener('keydown', e => {
  allowAnimation = true;
});

addEventListener('keyup', e => {
  allowAnimation = false;
});
