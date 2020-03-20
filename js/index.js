import * as THREE from './three.module.js';

function setupScene(){
	let scene = new THREE.Scene();
	let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	let geometry = new THREE.BoxGeometry(1, .666, 1);

	let texture = new THREE.TextureLoader().load( 'images/azeroth.jpg' );

	const materials = [
		new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
		new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
		new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
		new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
		new THREE.MeshBasicMaterial({map: texture}),
		new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
	];

	let cube = new THREE.Mesh( geometry, materials );
	scene.add( cube );

	let cameraZ = 5;

	camera.position.z = cameraZ;

	let renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	const renderElement = renderer.domElement;

	renderElement.onwheel = function(event) {
		event.preventDefault();

		const scale = .02 * cameraZ;

		if (event.deltaY < 0) {
			// Zoom in
			cameraZ -= scale;
		}
		else {
			// Zoom out
			cameraZ += scale;
		}

	};

	let raycaster = new THREE.Raycaster();
	let mouse = new THREE.Vector2();

	function onMouseMove( event ) {

		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	}

	renderElement.addEventListener('mousemove', onMouseMove);

	let mouseDown = false;
	renderElement.addEventListener('mousedown', (event) => {
		mouseDown = true;
	});

	renderElement.addEventListener('mouseup', (event) => {
		mouseDown = false;
	});

	document.getElementById('root').appendChild( renderElement );



	function animate() {
		requestAnimationFrame( animate );

		raycaster.setFromCamera( mouse, camera );
		const intersections = raycaster.intersectObjects( scene.children );
		for(let intersection of intersections){
			if(mouseDown){
				intersection.object.position.x = intersection.point.x;
				intersection.object.position.y = intersection.point.y;
			}

		}
		const cameraSpeed = .05;
		const marginOfError = .1;
		if(camera.position.z + marginOfError < cameraZ){
			camera.position.z += cameraSpeed;
		}
		else if (camera.position.z - marginOfError > cameraZ){
			camera.position.z -= cameraSpeed;
		}
		renderer.render( scene, camera );
	}
	animate();
}

window.onload = setupScene;