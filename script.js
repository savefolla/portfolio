const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const radius = 1;

const geometry = new THREE.SphereGeometry(radius, 32, 32);
const material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  opacity: 1,
  shininess: 100,
  side: THREE.DoubleSide,
  wireframe: false
});
const sphere = new THREE.Mesh(geometry, material);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

camera.position.z = 5;

const light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 0, 0, 5 );
light.castShadow = true;
scene.add( light );

let index = 0;
let allowAnimation = false;

composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera));
glitchPass = new THREE.GlitchPass();
composer.addPass(glitchPass);

const animate = () => {
  requestAnimationFrame(animate);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  if (allowAnimation) {
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

addEventListener('mousedown', e => {
  allowAnimation = true;
});

addEventListener('touchstart', e => {
  allowAnimation = true;
});

addEventListener('mouseup', e => {
  allowAnimation = false;
});

addEventListener('touchend', e => {
  allowAnimation = false;
});
