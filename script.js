new THREE.OBJLoader().load('models/Steampunk_skull.obj', (object) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const cameraDistance = 500;
    camera.position.z = cameraDistance;

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      flatShading: true,
      wireframe: false
    });
    const sphere = object;
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
    sphere.rotation.x = -1.5;
    sphere.position.y = -120;
    scene.add(sphere);

    const light1 = new THREE.PointLight(0xffffff, cameraDistance / 40, cameraDistance);
    light1.position.set(0, 0, cameraDistance);
    light1.castShadow = true;
    scene.add(light1);
    const light2 = new THREE.PointLight(0xfffff, cameraDistance / 40, cameraDistance);
    light2.position.set(0, 0, -cameraDistance);
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
            // todo animate position of vertices
            glitchEffect.enabled = true;
          }
          index = index + 1;
        }
      }

      if (window.orientation !== undefined) controls.update();
      else pivot.rotation.y += 0.01;
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

    const getDays = () => {
      const birthdate = new Date(1995, 12, 25).getTime();
      const today = new Date().getTime();
      const age = (today - birthdate) / 1000 / 60 / 60 / 24 / 365;
      document.getElementById('age').innerHTML = age.toFixed(0);
    };

    getDays();

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

  }
);
