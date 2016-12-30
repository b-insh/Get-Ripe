function init() {
  createScene();
  createLights();
  createPlane();
  createTree();
  createLeaves();
  createMango();
  createWateringCan();

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
  // objects.push(tree.mesh);
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
    color: 0xffd507,
    shininess: 40,
    map: mangoMap,
  });
  const mango = new THREE.Mesh(geom, mat);

  const domEvents = new THREEx.DomEvents(camera, renderer.domElement);
  domEvents.addEventListener(mango, 'click', function increaseMangoSize(e) {
    mango.scale.multiplyScalar(1.1);
  });
  mango.castShadow = true;
  mango.recieveShadow = true;
  this.mesh.add(mango);
};

let mango;
function createMango() {
  mango = new Mango();
  mango.name = "mango";
  mango.mesh.position.x = 55;
  mango.mesh.position.y = 95;
  mango.mesh.position.z = -145;
  scene.add(mango.mesh);
  // objects.push(mango.mesh);
}

let particleGroup;
const WateringCan = function() {
  const merged = new THREE.Geometry();
  this.mesh = new THREE.Object3D();
  const mat = new THREE.MeshStandardMaterial({ metalness: 0.8, color: 0xadb2bd });

  const geomCan = new THREE.CylinderGeometry(15, 15, 25, 10, 10);
  geomCan.applyMatrix( new THREE.Matrix4().makeScale(1.1, 1.0, 0.6));
  const can = new THREE.Mesh(geomCan);
  can.updateMatrix();
  merged.merge(can.geometry, can.matrix);

  const geomHandle = new THREE.TorusGeometry( 10, 2, 8, 6, Math.PI);
  geomHandle.applyMatrix( new THREE.Matrix4().makeScale(0.9, 1.1, 1.0));
  const handle = new THREE.Mesh(geomHandle);
  handle.rotation.z = 4.5;
  handle.position.x = 13.5;
  handle.updateMatrix();
  merged.merge(handle.geometry, handle.matrix);

  const geomSpout = new THREE.CylinderGeometry(1, 3, 20, 5, 5);
  const spout = new THREE.Mesh(geomSpout);
  spout.rotation.z = 1;
  spout.position.x = -22;
  spout.position.y = 10;
  spout.position.z = 3;
  spout.updateMatrix();
  merged.merge(spout.geometry, spout.matrix);

  merged.castShadow = true;
  merged.receiveShadow = true;
  const merged3D = new THREE.Mesh(merged, mat);
  this.mesh.add(merged3D);
};

let wateringCan;
function createWateringCan() {
  wateringCan = new WateringCan();
  wateringCan.mesh.position.x = 120;
  wateringCan.mesh.position.y = -30;
  wateringCan.mesh.position.z = -10;

  const domEvents = new THREEx.DomEvents(camera, renderer.domElement);
  domEvents.addEventListener(wateringCan.mesh, 'click', () => createParticles());

  scene.add(wateringCan.mesh);
  objects.push(wateringCan.mesh);
}

let options, spawnerOptions;
function createParticles() {
  particleGroup = new THREE.GPUParticleSystem({
    maxParticles: 25000,
  });
  scene.add(particleGroup);

  options = {
    position: new THREE.Vector3(),
    positionRandomness: 1,
    velocity: new THREE.Vector3(0, 0, 0),
    velocityRandomness: 1,
    color: 0x40a4df,
    colorRandomness: 0.4,
    turbulence: 1,
    lifetime: 0.5,
    size: 10,
    sizeRandomness: 3,
  };

  spawnerOptions = {
    spawnRate: 15000,
    horizontalSpeed: 1.5,
    verticalSpeed: 0.3,
    timeScale: 1
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
  mouse3D.unproject(camera);
  raycaster.set(camera.position, mouse3D.sub(camera.position).normalize());
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

// CREATE LOOP SO IT RENDERS
let tick = 0;
function loop() {
  requestAnimationFrame(loop);

  if (typeof spawnerOptions === "object") {

    let delta = clock.getDelta() * spawnerOptions.timeScale;
    tick += delta;


    if (tick < 0) tick = 0;
    particleGroup.position.x = wateringCan.mesh.position.x - 30;
    particleGroup.position.y = wateringCan.mesh.position.y + 17;
    particleGroup.dynamic = true;
    if (delta > 0) {
      for (let i = 0; i < spawnerOptions.spawnRate * delta; i++) {
        particleGroup.spawnParticle(options);
      }
    }

    particleGroup.update(tick);
  }
  renderer.render(scene, camera);
}










window.addEventListener('load', init, false);
