document.getElementById('boton-cargar').addEventListener('click', cargarImagen);
document.getElementById('boton-visualizar').addEventListener('click', visualizarImagen);

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

// Configuración del canvas
const canvas = document.createElement('canvas');
canvas.style.width = '100%';
canvas.style.height = '100%';
document.getElementById('visor').appendChild(canvas);

// Configuración de la escena
const scene = new THREE.Scene();

// Configuración de la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 0.1);
scene.add(camera);

// Configuración del renderizador
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth * 0.8, 500);
renderer.xr.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(VRButton.createButton(renderer));

// Configuración de los controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 0.1;
controls.maxDistance = 5;

// Configuración del cielo
const sky = new Sky();
sky.scale.setScalar(10000);
scene.add(sky);

// Configuración de las luces
const light = new THREE.HemisphereLight(0xffffff, 0x444444);
light.position.set(0, 200, 0);
scene.add(light);

const sun = new THREE.Vector3();

const effectComposer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.material.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
effectComposer.addPass(fxaaPass);

function cargarImagen() {
  const imagen = document.getElementById('imagen').files[0];
  const formData = new FormData();
  formData.append('imagen', imagen);

  fetch('http://localhost:8080/api/guardarimagen', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al guardar la imagen');
      }
      console.log('Imagen guardada exitosamente');
    })
    .catch((error) => console.error(error));
}


function visualizarImagen() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:8080/api/verimagen', true);
  xhr.responseType = 'blob';
  xhr.onload = () => {
    if (xhr.status === 200) {
      const blob = xhr.response;
      const objectUrl = URL.createObjectURL(blob);
      const img = document.createElement('img');
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
      document.body.appendChild(img);
    }
  };
  xhr.send();
}




// Función para actualizar el tamaño del canvas al cambiar el tamaño de la ventana
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth * 0.8, 500);
  fxaaPass.material.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

// Función para renderizar la escena
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  sky.material.uniforms['sunPosition'].value.copy(sun);
  effectComposer.render();
}

animate();

