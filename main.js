import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.123/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.123/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer;


init();

function init() {
	const container = document.getElementById( 'container' );
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
	camera.position.z = 0.01;
	scene = new THREE.Scene();
	const texture = new THREE.TextureLoader().load( 'http://localhost:3000/images/imagen.jpg', render );
	texture.mapping = THREE.EquirectangularReflectionMapping;
	scene.background = texture;
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
	const controls = new OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render );

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}


function render() {

	renderer.render( scene, camera );

}
