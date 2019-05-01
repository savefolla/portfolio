const getRandomGeometryConfig = () => {
  return new THREE.SphereBufferGeometry(radius, 25 * Math.random() + 5, 25 * Math.random() + 5, 0, Math.PI * 2, 10 * Math.random() + 5, 10 * Math.random() + 5)
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const radius = 2;

const geometry = getRandomGeometryConfig();
const material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  shininess: 10,
  side: THREE.DoubleSide,
  flatShading: true
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const light1 = new THREE.PointLight(0xffffff, 1, 100);
light1.position.set(0, 0, 5);
light1.castShadow = true;
scene.add(light1);
const light2 = new THREE.PointLight(0xfffff, 1, 100);
light2.position.set(0, 0, -5);
light2.castShadow = true;
scene.add(light2);

pivot = new THREE.Group();
pivot.position.set(0, 0, 0);
pivot.rotation.y = 1;
pivot.add(camera);
scene.add(pivot);

controls = new THREE.DeviceOrientationControls(pivot);

let index = 0;
let allowAnimation = false;
let animationStartedAt = undefined;
let contentHidden = false;
const animationDuration = 1000;

composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera));
const dotScreenEffect = new THREE.ShaderPass(THREE.DotScreenShader);
dotScreenEffect.uniforms['scale'].value = 2;
composer.addPass(dotScreenEffect);
const glitchEffect = new THREE.GlitchPass();
glitchEffect.enabled = false;
composer.addPass(glitchEffect);

const animate = () => {
  requestAnimationFrame(animate);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  if (allowAnimation) {
    if (!contentHidden) {
      const progress = (new Date() - animationStartedAt) / animationDuration;
      document.querySelector('.call-to-action--desktop__progress').setAttribute('style', `width: ${98 * progress}px`);
      document.querySelector('#mobile-progress-bar').setAttribute('style', `stroke-dashoffset: ${28 - 28 * progress}px`)
    } else {
      if (index % 30 === 0) {
        sphere.geometry = getRandomGeometryConfig();
        glitchEffect.enabled = true;
      }
      index = index + 1;
    }
  }

  if (window.orientation !== undefined) {
    controls.update();
  } else {
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    sphere.rotation.z += 0.01;
  }
  composer.render();

  if (!contentHidden && (new Date() - animationStartedAt) > animationDuration) {
    contentHidden = true;
    document.querySelector('.content').classList.add('hidden');
    document.querySelector('.call-to-action').classList.add('hidden');
    document.querySelector('.info').classList.remove('hidden');
    anime({
      targets: '.info',
      translateY: -10,
      duration: 500,
      opacity: 1,
      easing: 'easeOutSine'
    });
  }

};

animate();

const onTouchStart = () => {
  allowAnimation = true;
  animationStartedAt = new Date();
};

const onTouchEnd = () => {
  allowAnimation = false;
  animationStartedAt = undefined;
  document.querySelector('.content').classList.remove('hidden');
  document.querySelector('.call-to-action').classList.remove('hidden');
  document.querySelector('.info').classList.add('hidden');
  document.querySelector('.info').removeAttribute('style');
  document.querySelector('.call-to-action--desktop__progress').removeAttribute('style');
  document.querySelector('#mobile-progress-bar').removeAttribute('style');
  contentHidden = false;
  glitchEffect.enabled = false;
};

addEventListener('mousedown', e => {
  if (e.button === 0) onTouchStart();
});

addEventListener('touchstart', onTouchStart);

addEventListener('mouseup', onTouchEnd);

addEventListener('touchend', onTouchEnd);
