function init() {
  createScene();
  createLights();
  createPlane();
  createTree();
  createLeaves();
  createMango();
  createWateringCan();
  createSun();

  loop();
}

// CREATE SCENE
let scene, camera, fieldOfView, aspectRatio, HEIGHT, WIDTH, renderer, container, nearPlane, farPlane, clock, raycaster, mouse, domEvents;


function createScene() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  clock = new THREE.Clock(true);

  scene = new THREE.Scene();

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  camera.position.x = 0;
  camera.position.z = 400;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio( window.devicePixelRatio );

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  domEvents = new THREEx.DomEvents(camera, renderer.domElement);

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
  document.addEventListener('mousedown', onDocumentMouseDown);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);
}

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

let hemisphereLight, shadowLight;
function createLights() {
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, 0.9);

  shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;

  shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	scene.add(hemisphereLight);
	scene.add(shadowLight);
}

let objects = [];
const Tree = function() {
  this.mesh = new THREE.Object3D();

  const geomTrunk = new THREE.CylinderGeometry(20, 30, 320, 20, 10);
  const matTrunk = new THREE.MeshStandardMaterial({
    color: 0x751f1a,
    roughness: 0.7,
    shading: THREE.FlatShading
  });
  const trunk = new THREE.Mesh(geomTrunk, matTrunk);
  trunk.castShadow = true;
  trunk.recieveShadow = true;
  this.mesh.add(trunk);
};

let tree;
function createTree() {
  tree = new Tree();
  tree.mesh.position.y = 0;
  tree.mesh.position.z = -200;
  scene.add(tree.mesh);
}

const Leaves = function() {
  this.mesh = new THREE.Object3D();

  const geom = new THREE.SphereGeometry(20, 20, 20);
  const mat = new THREE.MeshPhongMaterial({
    color: 0x009900,
  });

  const numLeaves = 150 + Math.floor(Math.random() * 150);
  for (let i = 0; i < numLeaves; i++) {
    const leaf = new THREE.Mesh(geom, mat);

    leaf.position.x = Math.random() * 180;
		leaf.position.y = Math.random() * 150;
		leaf.position.z = Math.random() * 150;

    const s = 1 + Math.random() * 0.8;
    leaf.scale.set(s, s, s);

    leaf.castShadow = true;
    leaf.receiveShadow = true;

    this.mesh.add(leaf);
  }
};

let leaves;
function createLeaves() {
  leaves = new Leaves();
  leaves.mesh.position.x = -110;
  leaves.mesh.position.y = 130;
  leaves.mesh.position.z = -200;
  scene.add(leaves.mesh);
}

const Mango = function() {
  this.mesh = new THREE.Object3D();
  const geom = new THREE.BoxGeometry(8, 16, 5, 8, 8, 8);

  for (let i = 0; i< geom.vertices.length; i++) {
    geom.vertices[i].normalize().multiplyScalar(16);
  }

  for (let i = 0; i < geom.faces.length; i ++) {
    let face = geom.faces[i];

    face.vertexNormals[0].copy( geom.vertices[face.a] ).normalize();
    face.vertexNormals[1].copy( geom.vertices[face.b] ).normalize();
    face.vertexNormals[2].copy( geom.vertices[face.c] ).normalize();
  }

  geom.applyMatrix( new THREE.Matrix4().makeScale(1.0, 1.3, 0.8));

  const loader = new THREE.TextureLoader();
  const mangoMap = loader.load("images/mangoMap.jpg");
  const mat = new THREE.MeshPhongMaterial({
    map: mangoMap,
  });
  const mango = new THREE.Mesh(geom, mat);

  mango.castShadow = true;
  mango.recieveShadow = true;
  this.mesh.add(mango);
};

let mango;
function createMango() {
  mango = new Mango();
  mango.mesh.position.x = 55;
  mango.mesh.position.y = 95;
  mango.mesh.position.z = -145;
  scene.add(mango.mesh);

  pouring = false;
}

const WateringCan = function() {
  const mergedCan = new THREE.Geometry();
  this.mesh = new THREE.Object3D();
  const mat = new THREE.MeshStandardMaterial({
    metalness: 0.8,
    color: 0xadb2bd
  });

  const geomCan = new THREE.CylinderGeometry(15, 15, 25, 10, 10);
  geomCan.applyMatrix( new THREE.Matrix4().makeScale(1.1, 1.0, 0.6));
  const can = new THREE.Mesh(geomCan);
  can.updateMatrix();
  mergedCan.merge(can.geometry, can.matrix);

  const geomHandle = new THREE.TorusGeometry( 10, 2, 8, 6, Math.PI);
  geomHandle.applyMatrix( new THREE.Matrix4().makeScale(0.9, 1.1, 1.0));
  const handle = new THREE.Mesh(geomHandle);
  handle.rotation.z = 4.5;
  handle.position.x = 13.5;
  handle.updateMatrix();
  mergedCan.merge(handle.geometry, handle.matrix);

  const geomSpout = new THREE.CylinderGeometry(1, 3, 20, 5, 5);
  const spout = new THREE.Mesh(geomSpout);
  spout.rotation.z = 1;
  spout.position.x = -22;
  spout.position.y = 10;
  spout.position.z = 3;
  spout.updateMatrix();
  mergedCan.merge(spout.geometry, spout.matrix);

  mergedCan.castShadow = true;
  mergedCan.receiveShadow = true;
  const mergedCan3D = new THREE.Mesh(mergedCan, mat);
  this.mesh.add(mergedCan3D);
};

let wateringCan;
function createWateringCan() {
  wateringCan = new WateringCan();
  wateringCan.mesh.position.x = 120;
  wateringCan.mesh.position.y = -30;
  wateringCan.mesh.position.z = -10;

  domEvents.addEventListener(wateringCan.mesh, 'click', toggleParticles);

  scene.add(wateringCan.mesh);
  objects.push(wateringCan.mesh);
}

const Sun = function() {
  const mergedSun = new THREE.Geometry();
  this.mesh = new THREE.Object3D();

  const sunGeom = new THREE.SphereGeometry(30, 10, 10);
  const sunMat = new THREE.MeshPhongMaterial({
    color: 0xffcc33,
    emissive: 0xffeaad,
    emissiveIntensity: 0.4,
    shininess: 10,
  });

  const sun = new THREE.Mesh(sunGeom);

  sun.updateMatrix();
  mergedSun.merge(sun.geometry, sun.matrix);

  mergedSun.castShadow = true;
  mergedSun.receiveShadow = true;
  const mergedSun3D = new THREE.Mesh(mergedSun, sunMat);
  this.mesh.add(mergedSun3D);
};

const Glow = function() {
  this.mesh = new THREE.Object3D();

  const glowGeom = new THREE.SphereGeometry(42, 10, 10);
  const glowMat = new THREEx.createAtmosphereMaterial();
  const glow = new THREE.Mesh(glowGeom, glowMat);
  this.mesh.add(glow);
};

let sun, glow;
function createSun() {
  sun = new Sun();
  glow = new Glow();
  sun.mesh.position.x = -320;
  sun.mesh.position.y = 260;
  glow.mesh.position.x = -320;
  glow.mesh.position.y = 260;

  const domEvents = new THREEx.DomEvents(camera, renderer.domElement);
  domEvents.addEventListener(sun.mesh, 'click', toggleSunlight);

  scene.add(sun.mesh);
  scene.add(glow.mesh);
}

let sunlight;
function createSunlight() {
  sunlight = new THREE.SpotLight( 0xfffff );
  sunlight.position.set( -220, 220, 0);
  sunlight.castShadow = true;

  scene.add(sunlight);
}

let shining = true;
function toggleSunlight() {
  if (shining) {
    createSunlight();
    decreaseMangoSize();
    shining = false;
    window.setTimeout(toggleSunlight, 2000);
  } else {
    scene.remove(sunlight);
    shining = true;
  }
}

let pourWater = true;
function toggleParticles() {
  if (pourWater) {
    createParticles();
    pourWater = false;
    window.setTimeout( removeParticles, 2000);
  }
}

function removeParticles() {
  scene.remove(particleGroup);
  pourWater = true;
}

let particleGroup, options, spawnerOptions, pouring = false;
function createParticles() {
  pouring = true;
  particleGroup = new THREE.GPUParticleSystem({
    maxParticles: 25000,
  });
  scene.add(particleGroup);

  options = {
    position: new THREE.Vector3(),
    positionRandomness: 1,
    velocity: new THREE.Vector3(),
    velocityRandomness: 6,
    color: 0x40a4df,
    colorRandomness: 0.4,
    turbulence: 1,
    lifetime: 0.5,
    size: 10,
    sizeRandomness: 3,
  };

  spawnerOptions = {
    spawnRate: 25000,
    horizontalSpeed: 3,
    verticalSpeed: 0.3,
    timeScale: 1.2
  };
}


let plane;
function createPlane() {
  plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(WIDTH, HEIGHT), new THREE.MeshBasicMaterial({
    color: 0xffffff,
    alphaTest: 0,
    visible: false
  }));
  scene.add(plane);
}

let selection;
function onDocumentMouseDown(e) {
  e.preventDefault();
  mouse.set( ( e.clientX / WIDTH ) * 2 - 1, -( e.clientY / HEIGHT ) * 2 + 1 );
  raycaster.setFromCamera( mouse, camera );
  const intersectedObjects = raycaster.intersectObjects(objects, true);
  if (intersectedObjects.length > 0) {
    selection = intersectedObjects[0].object;
  }
}

function onDocumentMouseMove(e) {
  e.preventDefault();
  mouse.set( ( e.clientX / WIDTH ) * 2 - 1, -( e.clientY / HEIGHT ) * 2 + 1 );
  raycaster.setFromCamera( mouse, camera );

  if (selection) {
    const intersectPlane = raycaster.intersectObject(plane);
    selection.position.copy(intersectPlane[0].point);
    selection.position.x -= 120;
    selection.position.y += 40;
  } else {
    const intersectedObjects = raycaster.intersectObjects(objects);

    if (intersectedObjects.length > 0) {
      plane.position.copy(intersectedObjects[0].object.position);
      plane.lookAt(camera.position);
    }
  }
}

function onDocumentMouseUp(e) {
  selection = null;
}

function increaseMangoSize() {
  pouring = false;
  window.setTimeout( scaleUp, 1000 );
}

function decreaseMangoSize() {
  window.setTimeout( scaleDown, 1000 );
}

function scaleUp() {
  const target = {
    x: (mango.mesh.scale.x * 1.11),
    y: (mango.mesh.scale.y * 1.1),
    z: (mango.mesh.scale.z * 1.1)
  };

  new TWEEN
    .Tween( mango.mesh.scale )
    .to( target, 2000 )
    .easing( TWEEN.Easing.Bounce.Out )
    .start();

  if (mango.mesh.scale.x > 1.6) {
    fallOff();
  }
}

function scaleDown() {
  const target = {
    x: (mango.mesh.scale.x * 0.8),
    y: (mango.mesh.scale.y * 0.8),
    z: (mango.mesh.scale.z * 0.8)
  };

    new TWEEN
      .Tween( mango.mesh.scale )
      .to( target, 1000 )
      .easing( TWEEN.Easing.Elastic.In )
      .start();
}

function fallOff() {
  if (!pourWater) { toggleParticles(); }
  domEvents.removeEventListener(wateringCan.mesh, 'click', toggleParticles);

  const target = { y: -140 };

  new TWEEN
    .Tween( mango.mesh.position )
    .to( target, 500 )
    .easing( TWEEN.Easing.Quartic.In )
    .onComplete( fallOver )
    .start();
}

function fallOver() {
  const target = {
    x: 1.5,
    z: -1
  };

  new TWEEN
    .Tween( mango.mesh.rotation )
    .to( target, 500 )
    .easing( TWEEN.Easing.Quartic.In )
    .onComplete( rollAway )
    .start();

  mango.mesh.updateMatrix();
}

function randomDirs() {
  let xDir = Math.floor(Math.random() * 300) + 1;
  xDir *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  xDir += xDir < 0 ? -200 : 200;

  let zDir = Math.floor(Math.random() * 60) + 1;
  zDir *= Math.floor(Math.random() * 2) == 1 ? -1 : -1;
  zDir += zDir < 0 ? -100 : 100;

  let rotation = Math.floor(Math.random() * 25) + 5;

  return [xDir, zDir, rotation];
}

function rollAway() {
  const timeline = new TimelineLite();
  let rollingDirs = randomDirs();
  let rollingTarget = { x: rollingDirs[2] };
  let positionTarget = {
    x: mango.mesh.position.x + rollingDirs[0],
    z: mango.mesh.position.z + rollingDirs[1],
    ease: Power1.easeOut,
  };

  let rotate = new TweenLite(mango.mesh.rotation, 1, rollingTarget );
  let roll = new TweenLite(mango.mesh.position, 1, positionTarget );

  timeline.add(rotate).add(roll, 0);
  window.setTimeout( newMango, 2000 );
}

function newMango() {
  createMango();
  domEvents.addEventListener(wateringCan.mesh, 'click', toggleParticles);
}

let tick = 0;
function loop() {
  requestAnimationFrame(loop);

  if (typeof spawnerOptions === "object") {

    let delta = clock.getDelta() * spawnerOptions.timeScale;
    tick += delta;

    if (tick < 0) tick = 0;
    particleGroup.position.x = objects[0].children[0].position.x + 90;
    particleGroup.position.y = objects[0].children[0].position.y - 14;
    particleGroup.position.z = objects[0].children[0].position.z -10;
    particleGroup.dynamic = true;
    if (delta > 0) {
      for (let i = 0; i < spawnerOptions.spawnRate * delta; i++) {
        particleGroup.spawnParticle(options);
      }
    }
    particleGroup.update(tick);
  }

  if (pouring) {
    increaseMangoSize();
  }

  TWEEN.update();
  renderer.render(scene, camera);
}

window.addEventListener('load', init, false);
