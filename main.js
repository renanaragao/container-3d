import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { Interaction } from 'three.interaction';

var camera, scene, renderer, controls, geometry, raycaster, mouse;
var mesh;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    scene = new THREE.Scene();

    const loader = new THREE.TextureLoader();

    const materials = [
        new THREE.MeshBasicMaterial({ map: loader.load('./porta.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('./lateral-direita.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('./lateral-direita.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('./lateral-direita.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('./lateral-direita.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('./frente.jpg') }),
    ];

    geometry = new THREE.BoxBufferGeometry(600, 200, 200);
    raycaster = new THREE.Raycaster();


    mesh = new THREE.Mesh(geometry, materials);

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls = new OrbitControls(camera, renderer.domElement);

    const interaction = new Interaction(renderer, scene, camera);

    mesh.cursor = 'pointer';
    // mesh.on('click', x => console.log(x));

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousedown', onDocumentMouseDown, false);

}

function onDocumentMouseDown(event) {

    const vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(camera);

    raycaster.setFromCamera(vector, camera);

    raycaster.set(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        var index = Math.floor(intersects[0].faceIndex / 2);
        switch (index) {
            case 0:
                console.log('porta', index, intersects[0].faceIndex);
                break;
            case 1:
                console.log('frente', index, intersects[0].faceIndex);
                break;
            case 2:
                console.log('teto', index, intersects[0].faceIndex);
                break;
            case 3:
                console.log('embaixo', index, intersects[0].faceIndex);
                break;
            case 4:
                console.log('direito', index, intersects[0].faceIndex);
                break;
            case 5:
                console.log('esquerdo', index, intersects[0].faceIndex);
                break;
        }

    }

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);

}