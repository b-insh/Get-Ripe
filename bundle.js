/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
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
	var scene = void 0,
	    camera = void 0,
	    fieldOfView = void 0,
	    aspectRatio = void 0,
	    HEIGHT = void 0,
	    WIDTH = void 0,
	    renderer = void 0,
	    container = void 0,
	    nearPlane = void 0,
	    farPlane = void 0,
	    raycaster = void 0,
	    offset = void 0,
	    clock = void 0;
	
	function createScene() {
	  HEIGHT = window.innerHeight;
	  WIDTH = window.innerWidth;
	
	  clock = new THREE.Clock(true);
	
	  scene = new THREE.Scene();
	
	  aspectRatio = WIDTH / HEIGHT;
	  fieldOfView = 60;
	  nearPlane = 1;
	  farPlane = 10000;
	  camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
	
	  camera.position.x = 0;
	  camera.position.z = 400;
	  camera.position.y = 100;
	
	  renderer = new THREE.WebGLRenderer({
	    alpha: true,
	    antialias: true
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
	
	function handleWindowResize() {
	  HEIGHT = window.innerHeight;
	  WIDTH = window.innerWidth;
	  renderer.setSize(WIDTH, HEIGHT);
	  camera.aspect = WIDTH / HEIGHT;
	  camera.updateProjectionMatrix();
	}
	
	var hemisphereLight = void 0,
	    shadowLight = void 0;
	function createLights() {
	  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
	
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
	
	var objects = [];
	var Tree = function Tree() {
	  this.mesh = new THREE.Object3D();
	
	  var geomTrunk = new THREE.CylinderGeometry(25, 50, 320, 20, 10);
	  var matTrunk = new THREE.MeshStandardMaterial({
	    color: 0x751f1a,
	    roughness: 0.7,
	    shading: THREE.FlatShading
	  });
	  var trunk = new THREE.Mesh(geomTrunk, matTrunk);
	  trunk.castShadow = true;
	  trunk.recieveShadow = true;
	  this.mesh.add(trunk);
	};
	
	var tree = void 0;
	function createTree() {
	  tree = new Tree();
	  tree.mesh.position.y = 0;
	  tree.mesh.position.z = -200;
	  scene.add(tree.mesh);
	}
	
	var Leaves = function Leaves() {
	  this.mesh = new THREE.Object3D();
	
	  var geom = new THREE.SphereGeometry(20, 20, 20);
	  var mat = new THREE.MeshPhongMaterial({
	    color: 0x009900
	  });
	
	  var numLeaves = 150 + Math.floor(Math.random() * 150);
	  for (var i = 0; i < numLeaves; i++) {
	    var leaf = new THREE.Mesh(geom, mat);
	
	    leaf.position.x = Math.random() * 180;
	    leaf.position.y = Math.random() * 150;
	    leaf.position.z = Math.random() * 150;
	
	    var s = 1 + Math.random() * 0.8;
	    leaf.scale.set(s, s, s);
	
	    leaf.castShadow = true;
	    leaf.receiveShadow = true;
	
	    this.mesh.add(leaf);
	  }
	};
	
	var leaves = void 0;
	function createLeaves() {
	  leaves = new Leaves();
	  leaves.mesh.position.x = -110;
	  leaves.mesh.position.y = 130;
	  leaves.mesh.position.z = -200;
	  scene.add(leaves.mesh);
	}
	
	var Mango = function Mango() {
	  this.mesh = new THREE.Object3D();
	  var geom = new THREE.BoxGeometry(8, 16, 5, 8, 8, 8);
	
	  for (var i = 0; i < geom.vertices.length; i++) {
	    geom.vertices[i].normalize().multiplyScalar(16);
	  }
	
	  for (var _i = 0; _i < geom.faces.length; _i++) {
	    var face = geom.faces[_i];
	
	    face.vertexNormals[0].copy(geom.vertices[face.a]).normalize();
	    face.vertexNormals[1].copy(geom.vertices[face.b]).normalize();
	    face.vertexNormals[2].copy(geom.vertices[face.c]).normalize();
	  }
	
	  geom.applyMatrix(new THREE.Matrix4().makeScale(1.0, 1.3, 0.6));
	
	  var loader = new THREE.TextureLoader();
	  var mangoMap = loader.load("images/mangoMap.jpg");
	  var mat = new THREE.MeshPhongMaterial({
	    map: mangoMap
	  });
	  var mango = new THREE.Mesh(geom, mat);
	
	  mango.castShadow = true;
	  mango.recieveShadow = true;
	  this.mesh.add(mango);
	};
	
	var mango = void 0;
	function createMango() {
	  mango = new Mango();
	  mango.mesh.position.x = 55;
	  mango.mesh.position.y = 95;
	  mango.mesh.position.z = -145;
	  scene.add(mango.mesh);
	
	  pouring = false;
	}
	
	var WateringCan = function WateringCan() {
	  var mergedCan = new THREE.Geometry();
	  this.mesh = new THREE.Object3D();
	  var mat = new THREE.MeshStandardMaterial({
	    metalness: 0.8,
	    color: 0xadb2bd
	  });
	
	  var geomCan = new THREE.CylinderGeometry(15, 15, 25, 10, 10);
	  geomCan.applyMatrix(new THREE.Matrix4().makeScale(1.1, 1.0, 0.6));
	  var can = new THREE.Mesh(geomCan);
	  can.updateMatrix();
	  mergedCan.merge(can.geometry, can.matrix);
	
	  var geomHandle = new THREE.TorusGeometry(10, 2, 8, 6, Math.PI);
	  geomHandle.applyMatrix(new THREE.Matrix4().makeScale(0.9, 1.1, 1.0));
	  var handle = new THREE.Mesh(geomHandle);
	  handle.rotation.z = 4.5;
	  handle.position.x = 13.5;
	  handle.updateMatrix();
	  mergedCan.merge(handle.geometry, handle.matrix);
	
	  var geomSpout = new THREE.CylinderGeometry(1, 3, 20, 5, 5);
	  var spout = new THREE.Mesh(geomSpout);
	  spout.rotation.z = 1;
	  spout.position.x = -22;
	  spout.position.y = 10;
	  spout.position.z = 3;
	  spout.updateMatrix();
	  mergedCan.merge(spout.geometry, spout.matrix);
	
	  mergedCan.castShadow = true;
	  mergedCan.receiveShadow = true;
	  var mergedCan3D = new THREE.Mesh(mergedCan, mat);
	  this.mesh.add(mergedCan3D);
	};
	
	var wateringCan = void 0;
	function createWateringCan() {
	  wateringCan = new WateringCan();
	  wateringCan.mesh.position.x = 120;
	  wateringCan.mesh.position.y = -30;
	  wateringCan.mesh.position.z = -10;
	
	  var domEvents = new THREEx.DomEvents(camera, renderer.domElement);
	  domEvents.addEventListener(wateringCan.mesh, 'click', function () {
	    return toggleParticles();
	  });
	
	  scene.add(wateringCan.mesh);
	  objects.push(wateringCan.mesh);
	}
	
	var Sun = function Sun() {
	  var mergedSun = new THREE.Geometry();
	  this.mesh = new THREE.Object3D();
	
	  var sunGeom = new THREE.SphereGeometry(30, 10, 10);
	  var sunMat = new THREE.MeshPhongMaterial({
	    color: 0xffcc33,
	    emissive: 0xffeaad,
	    emissiveIntensity: 0.4,
	    shininess: 10
	  });
	
	  var sun = new THREE.Mesh(sunGeom);
	
	  sun.updateMatrix();
	  mergedSun.merge(sun.geometry, sun.matrix);
	
	  mergedSun.castShadow = true;
	  mergedSun.receiveShadow = true;
	  var mergedSun3D = new THREE.Mesh(mergedSun, sunMat);
	  this.mesh.add(mergedSun3D);
	};
	
	var Glow = function Glow() {
	  this.mesh = new THREE.Object3D();
	
	  var glowGeom = new THREE.SphereGeometry(42, 10, 10);
	  var glowMat = new THREEx.createAtmosphereMaterial();
	  var glow = new THREE.Mesh(glowGeom, glowMat);
	  this.mesh.add(glow);
	};
	
	var sun = void 0,
	    glow = void 0;
	function createSun() {
	  sun = new Sun();
	  glow = new Glow();
	  sun.mesh.position.x = -220;
	  sun.mesh.position.y = 220;
	  glow.mesh.position.x = -220;
	  glow.mesh.position.y = 220;
	
	  var domEvents = new THREEx.DomEvents(camera, renderer.domElement);
	  domEvents.addEventListener(sun.mesh, 'click', function () {
	    return toggleSunlight();
	  });
	
	  scene.add(sun.mesh);
	  scene.add(glow.mesh);
	}
	
	var sunlight = void 0;
	function createSunlight() {
	  sunlight = new THREE.SpotLight(0xfffff);
	  sunlight.position.set(-220, 220, 0);
	  sunlight.castShadow = true;
	
	  scene.add(sunlight);
	}
	
	var shining = true;
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
	
	var pourWater = true;
	function toggleParticles() {
	  if (pourWater) {
	    createParticles();
	    pourWater = false;
	  } else {
	    scene.remove(particleGroup);
	    pourWater = true;
	  }
	}
	
	var particleGroup = void 0,
	    options = void 0,
	    spawnerOptions = void 0,
	    pouring = false;
	function createParticles() {
	  pouring = true;
	  particleGroup = new THREE.GPUParticleSystem({
	    maxParticles: 25000
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
	    sizeRandomness: 3
	  };
	
	  spawnerOptions = {
	    spawnRate: 25000,
	    horizontalSpeed: 3,
	    verticalSpeed: 0.3,
	    timeScale: 1.2
	  };
	}
	
	var plane = void 0;
	function createPlane() {
	  plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(WIDTH, HEIGHT, 8, 8), new THREE.MeshBasicMaterial({
	    color: 0xffffff,
	    alphaTest: 0,
	    visible: false
	  }));
	  scene.add(plane);
	}
	
	var selection = void 0;
	function onDocumentMouseDown(e) {
	  e.preventDefault();
	  // get mouse position
	  var mouseX = e.clientX / WIDTH * 2 - 1;
	  var mouseY = -(e.clientY / HEIGHT) * 2 + 1;
	  // get 3D vector from 3D mouse position using unproject function
	  var mouse3D = new THREE.Vector3(mouseX, mouseY, 0.5);
	  mouse3D.unproject(camera);
	  // set raycaster position
	  raycaster.set(camera.position, mouse3D.sub(camera.position).normalize());
	  // find intersected objects
	  var intersectedObjects = raycaster.intersectObjects(objects, true); // returns array sorted by distance
	  if (intersectedObjects.length > 0) {
	    // grab the closest object
	    selection = intersectedObjects[0].object;
	    // calculate the offset
	    var intersectPlane = raycaster.intersectObject(plane);
	    offset.copy(intersectPlane[0].point).sub(plane.position);
	  }
	}
	
	function onDocumentMouseMove(e) {
	  e.preventDefault();
	  var mouseX = e.clientX / WIDTH * 2 - 1;
	  var mouseY = -(e.clientY / HEIGHT) * 2 + 1;
	
	  var mouse3D = new THREE.Vector3(mouseX, mouseY, 0.5);
	  raycaster.setFromCamera(mouse3D.clone(), camera);
	
	  if (selection) {
	    var intersectPlane = raycaster.intersectObject(plane);
	    selection.position.copy(intersectPlane[0].point);
	  } else {
	    var intersectedObjects = raycaster.intersectObjects(objects);
	
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
	  window.setTimeout(scaleUp, 1000);
	}
	
	function decreaseMangoSize() {
	  window.setTimeout(scaleDown, 1000);
	}
	
	function scaleUp() {
	  var target = {
	    x: mango.mesh.scale.x * 1.2,
	    y: mango.mesh.scale.y * 1.2,
	    z: mango.mesh.scale.z * 1.2
	  };
	  new TWEEN.Tween(mango.mesh.scale).to(target, 2000).easing(TWEEN.Easing.Bounce.Out).start();
	}
	
	function scaleDown() {
	  var target = {
	    x: mango.mesh.scale.x * 0.8,
	    y: mango.mesh.scale.y * 0.8,
	    z: mango.mesh.scale.z * 0.8
	  };
	  new TWEEN.Tween(mango.mesh.scale).to(target, 1000).easing(TWEEN.Easing.Elastic.In).start();
	}
	
	var tick = 0;
	function loop() {
	  requestAnimationFrame(loop);
	
	  if ((typeof spawnerOptions === 'undefined' ? 'undefined' : _typeof(spawnerOptions)) === "object") {
	
	    var delta = clock.getDelta() * spawnerOptions.timeScale;
	    tick += delta;
	
	    if (tick < 0) tick = 0;
	    particleGroup.position.x = objects[0].children[0].position.x + 92;
	    particleGroup.position.y = objects[0].children[0].position.y - 14;
	    particleGroup.position.z = objects[0].children[0].position.z;
	    particleGroup.dynamic = true;
	    if (delta > 0) {
	      for (var i = 0; i < spawnerOptions.spawnRate * delta; i++) {
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

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map