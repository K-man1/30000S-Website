import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

console.log("robot viewer running (module)");

const container = document.getElementById("robot-viewer");
if (!container) {
  console.warn("robot-viewer: #robot-viewer not found");
} else {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1);
  keyLight.position.set(5, 5, 5);
  scene.add(keyLight);

  const loader = new GLTFLoader();
  let robot = null;

  loader.load(
    "robot.glb",
    (gltf) => {
      robot = gltf.scene;

      const box = new THREE.Box3().setFromObject(robot);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      
      robot.position.sub(center);
      robot.scale.setScalar(15 / size);
      
      // Tilt forward to show front, right-side up
      robot.rotation.x = -Math.PI / 2; // -90 degrees forward tilt
      robot.rotation.z = Math.PI; // Flip 180 degrees to be right-side up

      scene.add(robot);
      camera.position.set(16, 0, 4); // Center the view better
    },
    undefined,
    (err) => console.error("GLB load error:", err)
  );

  function animate() {
    requestAnimationFrame(animate);
    if (robot) robot.rotation.z -= 0.002; // Spin the other direction
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}