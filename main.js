import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { Interaction } from 'three.interaction';

var camera, scene, renderer, controls, geometry, raycaster, mouse, square;
var mesh;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1);
    camera.position.z = 400;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const loader = new THREE.TextureLoader();

    const materials = [
        new THREE.MeshBasicMaterial({ map: loader.load('./porta.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('./frente.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('./lateral-direita.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('./lateral-direita.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('./lateral-direita.jpg') }),
        new THREE.MeshBasicMaterial({ map: loader.load('./lateral-direita.jpg') }),
    ];

    var material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    var points = [];
    points.push(new THREE.Vector3(-300, 0, 100));
    points.push(new THREE.Vector3(-300, 100, 100));
    points.push(new THREE.Vector3(-180, 100, 100));
    points.push(new THREE.Vector3(-180, 0, 100));
    // points.push(new THREE.Vector3(-300, 0, 100));




    // points.push(new THREE.Vector3(200, 0, 0));
    // points.push(new THREE.Vector3(0, 0, 0));
    // points.push(new THREE.Vector3(0, 0, -600));
    // points.push(new THREE.Vector3(0, 200, -600));
    // points.push(new THREE.Vector3(0, 200, 0));
    // points.push(new THREE.Vector3(200, 200, 0));
    // points.push(new THREE.Vector3(200, 200, -600));
    // points.push(new THREE.Vector3(0, 200, -600));
    // points.push(new THREE.Vector3(0, 0, -600));
    // points.push(new THREE.Vector3(200, 0, -600));
    // points.push(new THREE.Vector3(200, 200, -600));
    // points.push(new THREE.Vector3(200, 0, -600));
    // points.push(new THREE.Vector3(200, 0, 0));

    //600, 200, 200

    geometry = new THREE.BoxBufferGeometry(600, 200, 200)

    square = new THREE.BufferGeometry().setFromPoints(points);
    raycaster = new THREE.Raycaster();

    var line = new THREE.Line(square, material);
    line.name = 'quadrante-01';
    scene.add(line);

    var planeGeometry = new THREE.PlaneGeometry(120, 120).setFromPoints(points);
    var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = 'plane-01'
    scene.add(plane);

    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        opacity: 0.5,
        transparent: true,
    }));
    scene.add(mesh);

    const gridHelper = new THREE.GridHelper(1000, 20);
    scene.add(gridHelper);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.render(scene, camera);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls = new OrbitControls(camera, renderer.domElement);

    const interaction = new Interaction(renderer, scene, camera);

    mesh.cursor = 'pointer';
    mesh.on('click', x => console.log({
        x: x.data.originalEvent.x,
        y: x.data.originalEvent.y
    }));

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

    console.log(intersects);

    if (intersects.length > 0) {
        var index = Math.floor(intersects[0].faceIndex / 2);
        switch (index) {
            case 0:
                console.log('porta', index, intersects[0]);
                break;
            case 1:
                console.log('frente', index, intersects[0]);
                break;
            case 2:
                console.log('teto', index, intersects[0]);
                break;
            case 3:
                console.log('embaixo', index, intersects[0]);
                break;
            case 4:
                console.log('direito', index, intersects[0]);
                break;
            case 5:
                console.log('esquerdo', index, intersects[0]);
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