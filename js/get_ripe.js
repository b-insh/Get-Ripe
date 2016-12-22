function init() {
  createScene();
  createLights();
  createTree();
  createLeaves();
  createMango();
  // createSunshine();
  createWateringCan();
  // createSky();

  loop();
}

// CREATE SCENE
let scene, camera, fieldOfView, aspectRatio, HEIGHT, WIDTH, renderer, container, nearPlane, farPlane, axes;

function createScene() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

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
  tree.mesh.position.y = 30;
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
    const m = new THREE.Mesh(geom, mat);

    // set random position of cube
    m.position.x = Math.random() * 180;
		m.position.y = Math.random() * 150;
		m.position.z = Math.random() * 150;
		m.rotation.z = Math.random() * Math.PI * 2;
		m.rotation.y = Math.random() * Math.PI * 2;

    //set random size of cube
    const s = 1 + Math.random() * 0.9;
    m.scale.set(s, s, s);

    m.castShadow = true;
    m.receiveShadow = true;

    this.mesh.add(m);
  }
};

let leaves;
function createLeaves() {
  leaves = new Leaves();
  leaves.mesh.position.x = -110;
  leaves.mesh.position.y = 160;
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

  this.mesh.add(mango);
};

let mango;
function createMango() {
  mango = new Mango();
  mango.mesh.position.x = 55;
  mango.mesh.position.y = 120;
  mango.mesh.position.z = -145;
  scene.add(mango.mesh);
}

const WateringCan = function() {
  this.mesh = new THREE.Object3D();
  const mat = new THREE.MeshPhongMaterial({ metalness: 1, color: 0xadb2bd });

  // Create the can
  const geomCan = new THREE.CylinderGeometry(15, 15, 25, 10, 10);
  // const hollowCan = new THREE.CylinderGeometry(10, 10, 25, 10, 10);
  geomCan.applyMatrix( new THREE.Matrix4().makeScale(1.1, 1.0, 0.6));
  const can = new THREE.Mesh(geomCan, mat);
  can.castShadow = true;
  can.receiveShadow = true;
  this.mesh.add(can);

  // Create the handle
  const geomHandle = new THREE.TorusGeometry( 10, 2, 8, 6, Math.PI);
  geomHandle.applyMatrix( new THREE.Matrix4().makeScale(0.9, 1.1, 1.0));
  const handle = new THREE.Mesh(geomHandle, mat);
  handle.rotation.z = 4.5;
  handle.position.x = 13.5;
  handle.castShadow = true;
  handle.receiveShadow = true;
  this.mesh.add(handle);

  // Create spout
  const geomSpout = new THREE.CylinderGeometry(1, 3, 20, 5, 5);
  const spout = new THREE.Mesh(geomSpout, mat);
  spout.rotation.z = 1;
  spout.position.x = -22;
  spout.position.y = 10;
  spout.position.z = 3;
  spout.castShadow = true;
  spout.receiveShadow = true;
  this.mesh.add(spout);
};

let wateringCan;
function createWateringCan() {
  wateringCan = new WateringCan();
  wateringCan.mesh.position.x = -400;
  wateringCan.mesh.position.y = 0;
  wateringCan.mesh.position.z = 0;
  scene.add(wateringCan.mesh);
}

// CREATE LOOP SO IT RENDERS
function loop() {
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}




















window.addEventListener('load', init, false);
