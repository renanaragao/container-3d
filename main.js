import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { Interaction } from 'three.interaction';

var camera, scene, renderer, controls, geometry, raycaster, mouse;
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
    points.push(new THREE.Vector3(- 10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));

    geometry = new THREE.BoxBufferGeometry(600, 200, 200).setFromPoints(points);
    geometry.translate(25, 0, 25);
    raycaster = new THREE.Raycaster();

    var line = new THREE.Line(geometry, material);
    scene.add(line);
    
    mesh = new THREE.Mesh(geometry, materials);
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

function GridBoxGeometry(geometry, independent) {
    // @author prisoner849
    if (!(geometry instanceof THREE.BoxBufferGeometry)) {
        console.log("GridBoxGeometry: the parameter 'geometry' has to be of the type THREE.BoxBufferGeometry");
        return geometry;
    }
    independent = independent !== undefined ? independent : false;

    let newGeometry = new THREE.BoxBufferGeometry();
    let position = geometry.attributes.position;
    newGeometry.attributes.position = independent === false ? position : position.clone();

    let segmentsX = geometry.parameters.widthSegments || 1;
    let segmentsY = geometry.parameters.heightSegments || 1;
    let segmentsZ = geometry.parameters.depthSegments || 1;

    let startIndex = 0;
    let indexSide1 = indexSide(segmentsZ, segmentsY, startIndex);
    startIndex += (segmentsZ + 1) * (segmentsY + 1);
    let indexSide2 = indexSide(segmentsZ, segmentsY, startIndex);
    startIndex += (segmentsZ + 1) * (segmentsY + 1);
    let indexSide3 = indexSide(segmentsX, segmentsZ, startIndex);
    startIndex += (segmentsX + 1) * (segmentsZ + 1);
    let indexSide4 = indexSide(segmentsX, segmentsZ, startIndex);
    startIndex += (segmentsX + 1) * (segmentsZ + 1);
    let indexSide5 = indexSide(segmentsX, segmentsY, startIndex);
    startIndex += (segmentsX + 1) * (segmentsY + 1);
    let indexSide6 = indexSide(segmentsX, segmentsY, startIndex);

    let fullIndices = [];
    fullIndices = fullIndices.concat(indexSide1);
    fullIndices = fullIndices.concat(indexSide2);
    fullIndices = fullIndices.concat(indexSide3);
    fullIndices = fullIndices.concat(indexSide4);
    fullIndices = fullIndices.concat(indexSide5);
    fullIndices = fullIndices.concat(indexSide6);

    newGeometry.setIndex(fullIndices);

    function indexSide(x, y, shift) {
        let indices = [];
        for (let i = 0; i < y + 1; i++) {
            let index11 = 0;
            let index12 = 0;
            for (let j = 0; j < x; j++) {
                index11 = (x + 1) * i + j;
                index12 = index11 + 1;
                let index21 = index11;
                let index22 = index11 + (x + 1);
                indices.push(shift + index11, shift + index12);
                if (index22 < ((x + 1) * (y + 1) - 1)) {
                    indices.push(shift + index21, shift + index22);
                }
            }
            if ((index12 + x + 1) <= ((x + 1) * (y + 1) - 1)) {
                indices.push(shift + index12, shift + index12 + x + 1);
            }
        }
        return indices;
    }
    return newGeometry;
};