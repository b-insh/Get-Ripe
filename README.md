# Get Ripe!

[Play Get Ripe!](https://b-insh.github.io/Get-Ripe/)

Get Ripe is an interactive 3D environment populated by a tree with a mango, a watering can, and a glowing sun.

### Features  

* Drag and drop 3D objects in space
* Trigger particle system to "water" tree
* Toggle sun spotlight to shine
* Animate mango

### Technologies Used

* JavaScript
* Three.js
* Tween.js
* CSS

### Feature Implementations

#### Drag and Drop in 3D

The fundamental issue with drag and drop in 3D is that we are limited to using the mouse or trackpad. Both interact with the screen in 2D, having only an x- and y-axis travel on. I had to find a way to access the third dimension.

First I created a transparent 3D plane that lays across my entire page. I placed a `mousedown` event listener on the entire document which triggers a raycaster, a tool that essentially fires a "ray" from the mouse's position on the screen out to the plane. The raycaster then calculates its ray's intersection point with the plane in 3D space.

So now I had a way to give my mouse 3D access, but I needed to have it be able to grab objects and drop them elsewhere in the scene.

I placed all the objects I wanted to be able to move into an array. In my `mousedown` callback, I fed the objects to the raycaster and had it check to see if it's ray had intersected with any of them after passing through the plane. I then made the first element of that result my 'selection'.

I created another document event listener on `mousemove` that found the mouse's location in relation to the plane again. I set the selected object's position to the intersection point of the ray and the mouse allowing the object to move as the mouse moves.

On `mouseup` I clear the selection letting the object "drop".

```javascript
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
```

I created the water pouring from the watering can using a `GPUParticleSystem`. I was interested in this kind of particle emitter as it puts the majority of the calculations on the GPU. The kind of calculations that are needed for thousands of particles would be very cumbersome for the CPU to handle and would slow rendering time considerably.

In my animation loop I update the position of the entire particle group as well as the spawning and death of the particles themselves according to the parameters I gave it on construction.

A problem that I had initially was updating the position of the particle system if the watering can was being dragged and dropped while the particles were turned on. I had originally set the particle system's position to correspond to the watering can's mesh, or blueprint, but quickly learned that the blueprint stays in the same place permanently while the actual object moves around the scene. I had to look back into my raycaster at the object is was intersecting with on drag and drop and set the particle system's position to that instead.

```javascript
let delta = clock.getDelta() * spawnerOptions.timeScale;
tick += delta;

if (tick < 0) tick = 0;
particleGroup.position.x = objects[0].children[0].position.x + 90;
particleGroup.position.y = objects[0].children[0].position.y - 14;
particleGroup.position.z = objects[0].children[0].position.z;
particleGroup.dynamic = true;
if (delta > 0) {
  for (let i = 0; i < spawnerOptions.spawnRate * delta; i++) {
    particleGroup.spawnParticle(options);
  }
}
particleGroup.update(tick);
```

#### Toggle Sunshine

I was interested in the sun having a glow or a shine to make the scene more interesting and emphasize that the beam of light was "shrinking" the mango on the tree.

To accomplish this I set a spotlight at the position of the sun and installed a `click` handler on the object itself. Its callback function toggles a boolean variable connected to the creation and removal of the spotlight in the scene.

```javascript
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
```

#### Animate Mango

When the tree is watered, the mango grows, and when the sun beams on the mango, the mango shrinks. On my first implementation of this functionality using `multiplyScalar()`, the mango grew and shrank but it did so abruptly, changing sizes between one render cycle and the next. I was interested in having the mango's change in size be animated and a bit bouncy to fit in with the scene's general cartoon aesthetic.

Another issue I had was having the mango continue to grow, or continue to shrink based on a given percentage. For example, if I increased the mango's size by 120%, it would only increase one time no matter how many times I tried to change it. I realized was because my code was keeping a reference to the mango's original size rather than continuing to increase it by 120% of its current size every time.

To handle the transition of the mango between sizes, I used Tween.js which creates an object that moves be"tween" the initial and target values it is given. I chained an easing method with animation onto the Tween object and the mango now shrinks and grows smoothly.

As for having the mango continuously grow and shrink based on its current size, I decided to keep a reference to the mango's current size inside of the target value I gave to the Tween. With this implementation the mango changes size based on the size it is at the time the grow or shrink is triggered.

```javascript
function increaseMangoSize() {
  pouring = false;
  window.setTimeout( scaleUp, 1000 );
}

function decreaseMangoSize() {
  window.setTimeout( scaleDown, 1000 );
}

function scaleUp() {
  const target = {
    x: (mango.mesh.scale.x * 1.2),
    y: (mango.mesh.scale.y * 1.2),
    z: (mango.mesh.scale.z * 1.2)
  };
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
    z: (mango.mesh.scale.z * 0.8)
  };
    new TWEEN
      .Tween( mango.mesh.scale )
      .to( target, 1000 )
      .easing( TWEEN.Easing.Elastic.In )
      .start();
}

```
### Future Plans

#### Create More Interactive Tools

Users should be able to choose from a wider variety of tools to manipulate the scene.

#### Create World

Construct an entire 'world', for example, a park or backyard that users can navigate through to find a variety of scenes. 
