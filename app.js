//Variables for setup

let container;
let camera;
let renderer;
let scene;
let house;



function init() {
  container = document.querySelector(".scene");

  //Create scene
  scene = new THREE.Scene();

  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 1000;


  //Camera setup
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 5, 30);

  const ambient = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(50, 50, 100);
  scene.add(light);
  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });


  //renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);
  renderer.setClearColor(new THREE.Color('#000000'), 1);
  //Load Model
  let loader = new THREE.GLTFLoader();
  loader.load("./temple/letemple.glb", function(gltf) {
    scene.add(gltf.scene);
    house = gltf.scene.children[0];
    house.scale.set(0.5,0.5,0.5);
    house.position.set(0,5,0);
    animate();
  });
}


function animate() {

  requestAnimationFrame(animate);
 house.rotation.z += 0.005;

  renderer.render(scene, camera);
}

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);



//* Animate
// */

document.addEventListener('mousemove', onDocumentMouseMove)
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowX)
  mouseY = (event.clientY - windowY)

}


// particle system 
const particlegeo = new THREE.BufferGeometry;
const paticlecount = 7000;

const posarray = new Float32Array(paticlecount * 3 );
for(let i = 0; i < paticlecount * 3; i++) {
  posarray[i] = (Math.random() - 0.5) * 35
}

particlegeo.setAttribute('position', new THREE.BufferAttribute(posarray, 3));




// torus
const geometry = new THREE.TorusGeometry(0.9,0.7,16,100);
const material = new THREE.PointsMaterial({
  size: 0.005
})
const particlemat = new THREE.PointsMaterial({
  size: 0.005,
  color: 'green'
})
const torus = new THREE.Points(geometry,material)
const particlemesh = new THREE.Points(particlegeo, particlemat)

scene.add(torus, particlemesh)




const clock = new THREE.Clock()

const tick = () =>
{
targetX = mouseX * 0.001
targetY = mouseY * 0.001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    torus.rotation.y = .5 * elapsedTime;
    particlemesh.rotation.y = .5 * elapsedTime;
    particlemesh.rotation.y += .5 * (targetX - particlemesh.rotation.x );
    torus.rotation.x += 0.5 * (targetY - torus.rotation.x );

    // Update Orbital Controls
    //controls.update()

    // Render
//renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
