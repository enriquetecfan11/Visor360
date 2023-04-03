import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.123/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.123/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, texture;

init();

function init() {
  const container = document.getElementById('container');
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1100);
  camera.position.z = 0.01;
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);

  // Agregar evento 'change' al input tipo archivo
  const fileInput = document.getElementById('file');
  fileInput.addEventListener('change', subirImagen);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  renderer.render(scene, camera);
}

function subirImagen(event) {
  // Obtener archivo seleccionado por el usuario
  const file = event.target.files[0];

  // Crear una URL temporal para la imagen
  const imageUrl = URL.createObjectURL(file);

  // Crear una nueva textura con la imagen
  const newTexture = new THREE.TextureLoader().load(imageUrl, render);
  newTexture.mapping = THREE.EquirectangularReflectionMapping;

  // Actualizar la escena con la nueva textura
  if (texture) {
    // Si ya hay una textura, eliminarla antes de agregar la nueva
    scene.background.dispose();
  }
  texture = newTexture;
  scene.background = texture;
  render();
}

function verImagen() {
  // Esta función no se utiliza en este código, ya que la imagen se muestra automáticamente después de cargarla
}
