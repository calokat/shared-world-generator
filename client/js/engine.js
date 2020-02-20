import * as THREE from '/three.module.js';
import {TransformControls} from '/TransformControls.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.domElement.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();

let entities = [];

var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
let coneGeometry = new THREE.ConeGeometry(1, 1, 20);
let cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 20);
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// entities.push(new THREE.Mesh(boxGeometry, material));
// scene.add( entities[0] );

// with help from https://threejs.org/docs/#api/en/core/Raycaster
var raycaster = new THREE.Raycaster();
var mouseMovement = new THREE.Vector2();
let mousePos = new THREE.Vector2();

let controls = new TransformControls(camera, renderer.domElement);
scene.add(controls);
function onMouseMove( event ) {
    mouseMovement.x = event.movementX * (1/600);
    mouseMovement.y = event.movementY * (1/600);

    mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    if (event.buttons != 0){
        camera.rotation.y -= mouseMovement.x;
        camera.rotation.x -= mouseMovement.y;
    }
}
window.addEventListener('mousemove', onMouseMove);

function moveCamera(e){
    var cameraFwd = new THREE.Vector3();
    var cameraRight = new THREE.Vector3();
    camera.getWorldDirection(cameraFwd);
    cameraRight.crossVectors(new THREE.Vector3(0, 1, 0), cameraFwd);
    let cameraUp = new THREE.Vector3();
    cameraUp.crossVectors(cameraRight, cameraFwd);
    cameraUp.crossVectors(cameraFwd, cameraRight);
    if (e.key == "w"){
        camera.position = camera.position.add(cameraFwd.multiplyScalar(.1));
    }
    if (e.key == "s"){
        camera.position = camera.position.add(cameraFwd.multiplyScalar(-.1));
    }
    if (e.key == "a"){
        camera.position = camera.position.add(cameraRight.multiplyScalar(.1));
    }
    if (e.key == "d"){
        camera.position = camera.position.add(cameraRight.multiplyScalar(-.1));
    }
}
window.addEventListener('keydown', moveCamera);

function addEntity(geometry, newName) {
    let cameraFwd = new THREE.Vector3();
    let mesh = new THREE.Mesh(geometry, material);
    // let camPos = camera.position.clone();
    mesh.position.add(camera.position).add(camera.getWorldDirection(cameraFwd).multiplyScalar(5));
    mesh.name = newName;
    // camPos.add(camera.getWorldDirection(cameraFwd).multiplyScalar(5)).copy(mesh.position);
    entities.push(mesh);
    scene.add(mesh);
}

document.querySelector("#cubeBtn").addEventListener('click', () => {
    addEntity(boxGeometry, "Cube");
})

document.querySelector("#coneBtn").addEventListener('click', () => {
    addEntity(coneGeometry, "Cone");
})

document.querySelector("#cylinderBtn").addEventListener('click', () => {
    addEntity(cylinderGeometry, "Cylinder");
})

let selected;
let selectedOutline;
renderer.domElement.addEventListener('click', () => {
    scene.remove(selectedOutline);
    raycaster.setFromCamera(mousePos, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length == 0)
    {
        selected = null;
        return;
    }
    let hitMesh = false;
    let firstMeshIndex = 0;
    for (; firstMeshIndex < intersects.length; ++firstMeshIndex){
        if (intersects[firstMeshIndex].object.type == "Mesh"){
            hitMesh = true;
            selected = intersects[firstMeshIndex].object;
            controls.attach(selected);
            selectedOutline = new THREE.LineSegments(selected.geometry, new THREE.LineBasicMaterial({
                color: 0xffffff,
                linewidth: 1,
                linecap: 'round', //ignored by WebGLRenderer
                linejoin:  'round' //ignored by WebGLRenderer
            }));
            // selectedOutline.position = selected.object.position;
            selectedOutline.position.copy(selected.position);
            selected.add(selectedOutline);
            scene.add(selectedOutline);
            return;
        }
    }
    if (!hitMesh){
        selected = null;
    }
})

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'Delete':
            scene.remove(selected);
            scene.remove(selectedOutline);
            let indexToRemove = entities.indexOf(selected);
            entities.splice(indexToRemove, 1);
    }
})

// create grid, with help from https://threejs.org/docs/index.html#api/en/helpers/GridHelper
var size = 10;
var divisions = 10;
var gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

document.querySelector("#saveBtn").addEventListener('click', (e) => {
    let entitiesStr = JSON.stringify(getSimplifiedEntities());
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/addOrUpdateScene');
    xhr.send(`id=${id}&scene=${entitiesStr}`);
})
let id = "";
window.onload = () => {
    id = window.location.href.split('?')[1].split('=')[1];
    document.querySelector('#guid').innerHTML = "ID: " + id;
    // get the scene from the server, if it exists
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/getScene?id=${id}`);
    xhr.onload = () => {
        if (xhr.status == 200) {
            let scene = JSON.parse(xhr.response);
            console.log("About to parse");
            parseScene(scene);
        }
    }
    xhr.send();
    console.log(document.querySelector("#colorInput").value);
}

function parseScene(sceneObj) {
    for (let entity of sceneObj) {
        let geometry;
        switch (entity.name) {
            case 'Cube':
                geometry = boxGeometry;
                break;
            case 'Cone':
                geometry = coneGeometry;
                break;
            case 'Cylinder':
                geometry = cylinderGeometry;
                break;
        }
        let color = entity.color;
        let material = new THREE.MeshBasicMaterial({color});
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = entity.position.x;
        mesh.position.y = entity.position.y;
        mesh.position.z = entity.position.z;
        // mesh.rotation = entity.rotation.clone();
        scene.add(mesh);
        console.log("Added mesh: " + mesh);
        entities.push(mesh);
    }
}
// function getNewId() {
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', '/new');
//     xhr.onload = () => {
//         console.log(xhr.responseText);
//         document.querySelector('#guid').innerHTML = "ID: " + xhr.responseText;
//     }
//     xhr.send();
// }

function getSimplifiedEntities() {
    let simplified = [];
    entities.forEach((ent) => {
        let simpleObj = {};
        simpleObj.name = ent.name;
        simpleObj.color = ent.material.color;
        simpleObj.position = ent.position;
        simpleObj.rotation = ent.rotation;
        simplified.push(simpleObj);
    })
    return simplified;
}
let colorInput = document.querySelector("#colorInput");
colorInput.onchange = () => {
    if (selected) {
        let colorNumber = Number.parseInt(colorInput.value.replace("#", "0x"), 16);
        console.log(colorNumber);
        let newColor = new THREE.Color(colorNumber);
        selected.material = new THREE.MeshBasicMaterial({color: newColor});
    }
}
