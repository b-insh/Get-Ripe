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
let scene, camera, fieldOfView, aspectRatio, HEIGHT, WIDTH, renderer, container, nearPlane, farPlane, raycaster, offset, clock;

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

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);

  raycaster = new THREE.Raycaster();
  offset = new THREE.Vector3();
}

// RESIZE WINDOW
function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

// CREATE LIGHTS
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

	// activate lights
	scene.add(hemisphereLight);
	scene.add(shadowLight);

}

let objects = [];
const Tree = function() {
  this.mesh = new THREE.Object3D();

  const geomTrunk = new THREE.CylinderGeometry(25, 50, 320, 20, 10);
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
  tree.name = "trunk";
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

    // set random position of leaf
    leaf.position.x = Math.random() * 180;
		leaf.position.y = Math.random() * 150;
		leaf.position.z = Math.random() * 150;
		leaf.rotation.z = Math.random() * Math.PI * 2;
		leaf.rotation.y = Math.random() * Math.PI * 2;

    //set random size of leaf
    const s = 1 + Math.random() * 0.9;
    leaf.scale.set(s, s, s);

    leaf.castShadow = true;
    leaf.receiveShadow = true;

    this.mesh.add(leaf);
  }
};

let leaves;
function createLeaves() {
  leaves = new Leaves();
  leaves.name = "leaves";
  leaves.mesh.position.x = -110;
  leaves.mesh.position.y = 130;
  leaves.mesh.position.z = -200;
  scene.add(leaves.mesh);
  // objects.push(leaves.mesh);
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

  geom.applyMatrix( new THREE.Matrix4().makeScale(1.0, 1.3, 0.6));

  const loader = new THREE.TextureLoader();
  const mangoMap = loader.load("images/mangoMap.jpg");
  const mat = new THREE.MeshPhongMaterial({
    // color: 0xffd507,
    // shininess: 40,
    map: mangoMap,
  });
  const mango = new THREE.Mesh(geom, mat);

  mango.castShadow = true;
  mango.recieveShadow = true;
  this.mesh.add(mango);
};

let mango;
function createMango() {
  pouring = false;
  mango = new Mango();
  mango.mesh.position.x = 55;
  mango.mesh.position.y = 95;
  mango.mesh.position.z = -145;
  scene.add(mango.mesh);
}

const WateringCan = function() {
  const mergedCan = new THREE.Geometry();
  this.mesh = new THREE.Object3D();
  const mat = new THREE.MeshStandardMaterial({ metalness: 0.8, color: 0xadb2bd });

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

  const domEvents = new THREEx.DomEvents(camera, renderer.domElement);
  domEvents.addEventListener(wateringCan.mesh, 'click', () => toggleParticles());

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
  sun.mesh.position.x = -220;
  sun.mesh.position.y = 220;
  glow.mesh.position.x = -220;
  glow.mesh.position.y = 220;

  const domEvents = new THREEx.DomEvents(camera, renderer.domElement);
  domEvents.addEventListener(sun.mesh, 'click', () => toggleSunlight());

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
  }
  else {
    scene.remove(particleGroup);
    pourWater = true;
  }
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
  plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(WIDTH, HEIGHT, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, alphaTest: 0, visible: false }));
  scene.add(plane);
}

let selection;
function onDocumentMouseDown(e) {
  e.preventDefault();
  // get mouse position
  const mouseX = (e.clientX / WIDTH) * 2 - 1;
  const mouseY = -(e.clientY / HEIGHT) * 2 + 1;
  // get 3D vector from 3D mouse position using unproject function
  const mouse3D = new THREE.Vector3(mouseX, mouseY, 0.5);
  mouse3D.unproject(camera);
  // set raycaster position
  raycaster.set(camera.position, mouse3D.sub(camera.position).normalize());
  // find intersected objects
  const intersectedObjects = raycaster.intersectObjects(objects, true); // returns array sorted by distance
  if (intersectedObjects.length > 0) {
    // grab the closest object
    selection = intersectedObjects[0].object;
    // calculate the offset
    const intersectPlane = raycaster.intersectObject(plane);
    offset.copy(intersectPlane[0].point).sub(plane.position);
  }
}

function onDocumentMouseMove(e) {
  e.preventDefault();
  const mouseX = (e.clientX / WIDTH) * 2 - 1;
  const mouseY = -(e.clientY / HEIGHT) * 2 + 1;

  const mouse3D = new THREE.Vector3(mouseX, mouseY, 0.5);
  raycaster.setFromCamera( mouse3D.clone(), camera);
  if (selection) {
    const intersectPlane = raycaster.intersectObject(plane);
    selection.position.copy(intersectPlane[0].point);
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
  window.setTimeout( scaleDown, 1000);
}

function scaleUp() {
  const target = {
    x: (mango.mesh.scale.x * 1.2),
    y: (mango.mesh.scale.y * 1.2),
    z: (mango.mesh.scale.z * 1.2) };
  new TWEEN
    .Tween( mango.mesh.scale )
    .to( target, 2000 )
    .easing( TWEEN.Easing.Bounce.Out )
    .start();
}

function scaleDown() {
  const target = {
    x: (mango.mesh.scale.x * 0.8),
    y: (mango.mesh.scale.y * 0.8),
    z: (mango.mesh.scale.z * 0.8) };
    new TWEEN
      .Tween( mango.mesh.scale )
      .to( target, 1000 )
      .easing( TWEEN.Easing.Elastic.In )
      .start();
}

// CREATE LOOP SO IT RENDERS
let tick = 0;
function loop() {
  requestAnimationFrame(loop);

  if (typeof spawnerOptions === "object") {

    let delta = clock.getDelta() * spawnerOptions.timeScale;
    tick += delta;


    if (tick < 0) tick = 0;
      particleGroup.position.x = objects[0].children[0].position.x + 88;
      particleGroup.position.y = objects[0].children[0].position.y - 14;
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
