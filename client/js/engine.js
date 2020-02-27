import * as THREE from '/three.module.js';
// From https://discourse.threejs.org/t/transformcontrols-rotation-is-not-working/7519/5
import {TransformControls} from '/TransformControls.js';
// set up the scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.y = 5;
camera.position.z = 5;
camera.rotation.set(-Math.PI / 4, 0, 0, 'XYZ');
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// prevent the right click menu from showing up on the canvas
renderer.domElement.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})
// basic update loop
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();
// holds all of the entities in the scene
let entities = [];
// variables that hold various geometry. Used when instantiating the entities.
var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
let coneGeometry = new THREE.ConeGeometry(1, 1, 20);
let cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 20);
// the basic (unlit) material all shapes have. Green is the default, though that can be changed.
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

// with help from https://threejs.org/docs/#api/en/core/Raycaster
var raycaster = new THREE.Raycaster();
var mouseMovement = new THREE.Vector2();
let mousePos = new THREE.Vector2();

let controls = new TransformControls(camera, renderer.domElement);
controls.name = "TransformControls";
// the TransformControls only show up when attached to an object
scene.add(controls);
controls.addEventListener('objectChange',  () => {
    selectedOutline.position.set(selected.position.x, selected.position.y, selected.position.z);
    selectedOutline.rotation.copy(selected.rotation);
    selectedOutline.scale.copy(selected.scale);
});
// updates mousePos. If a mouse button is held down, track the mouse movement to rotate the camera accordingly
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

// moves the camera based on WASD input.
function moveCamera(e){
    var cameraFwd = new THREE.Vector3();
    var cameraRight = new THREE.Vector3();
    camera.getWorldDirection(cameraFwd);
    // Camera knows its forward, we cross product that with the up vector to get the right vector
    cameraRight.crossVectors(new THREE.Vector3(0, 1, 0), cameraFwd);
    if (e.key == "w"){
        camera.position.add(cameraFwd.multiplyScalar(.1));
    }
    if (e.key == "s"){
        camera.position.add(cameraFwd.multiplyScalar(-.1));
    }
    if (e.key == "a"){
        camera.position.add(cameraRight.multiplyScalar(.1));
    }
    if (e.key == "d"){
        camera.position.add(cameraRight.multiplyScalar(-.1));
    }
}
window.addEventListener('keydown', moveCamera);

// this occurs whenever any of the 'Box', 'Cone', or 'Cylinder' buttons are pressed
function addEntity(geometry, newName) {
    let cameraFwd = new THREE.Vector3();
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.add(camera.position).add(camera.getWorldDirection(cameraFwd).multiplyScalar(5));
    mesh.name = newName;
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
// white wireframe of selected
let selectedOutline;
renderer.domElement.addEventListener('mousedown', (e) => {
    // ignore if right mouse button was pressed
    if (e.button == 2) {
        return;
    }
    // removing the grid might help with raycasting
    scene.remove(gridHelper);
    // with help from https://threejs.org/docs/#api/en/core/Raycaster
    raycaster.setFromCamera(mousePos, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    // if nothing is hit, remove selectedOutline, detach the controls, and add back gridHelper
    if (intersects.length == 0)
    {
        selected = null;
        scene.remove(selectedOutline);
        selectedOutline = null;
        controls.detach();
        scene.add(gridHelper);
        return;
    }
    let firstMeshIndex = 0;
    for (; firstMeshIndex < intersects.length; ++firstMeshIndex){
        if (intersects[firstMeshIndex].object.type == "Mesh"){
            selected = intersects[firstMeshIndex].object;
            controls.attach(selected);
            if (selectedOutline) {
                scene.remove(selectedOutline);
            }
            // with the help of https://threejs.org/docs/#api/en/materials/LineBasicMaterial
            selectedOutline = new THREE.LineSegments(selected.geometry, new THREE.LineBasicMaterial({
                color: 0xffffff,
                linewidth: 1,
                linecap: 'round', //ignored by WebGLRenderer
                linejoin:  'round' //ignored by WebGLRenderer
            }));
            selectedOutline.position.copy(selected.position);
            selectedOutline.rotation.copy(selected.rotation);
            selectedOutline.scale.copy(selected.scale);
            if (!selected.children.includes(selectedOutline)) {
                selected.add(selectedOutline);            
            }
            if (!scene.children.includes(selectedOutline)) {
                scene.add(selectedOutline);
            }
            break;
        }
    }
    // add back the grid no matter what happens
    scene.add(gridHelper);
})

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'Delete':
            controls.detach();
            scene.remove(selected);
            scene.remove(selectedOutline);
            selectedOutline = null;
            let indexToRemove = entities.indexOf(selected);
            entities.splice(indexToRemove, 1);
            break;
        case 'w':
            controls.mode = "translate";
            break;
        case 'e':
            controls.mode = "rotate";
            break;
        case 'r':
            controls.mode = "scale";
            break;
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
// parses the url, finds the id, sends id to server, sends json from server to parseScene()
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
// takes json representation of the scene and fills the entities array
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
        mesh.rotation.copy(entity.rotation);
        mesh.scale.copy(entity.scale);
        mesh.name = entity.name;
        scene.add(mesh);
        console.log("Added mesh: " + mesh);
        entities.push(mesh);
    }
}
// takes the entities array and reduces each object to the tracked properties
function getSimplifiedEntities() {
    let simplified = [];
    entities.forEach((ent) => {
        let simpleObj = {};
        simpleObj.name = ent.name;
        simpleObj.color = ent.material.color;
        simpleObj.position = ent.position;
        simpleObj.rotation = ent.rotation;
        simpleObj.scale = ent.scale;
        simplified.push(simpleObj);
    })
    return simplified;
}
let colorInput = document.querySelector("#colorInput");
colorInput.oninput = () => {
    // parse the "color number" into hex, assign it to selected's material
    if (selected) {
        let colorNumber = Number.parseInt(colorInput.value.replace("#", "0x"), 16);
        let newColor = new THREE.Color(colorNumber);
        selected.material = new THREE.MeshBasicMaterial({color: newColor});
    }
}
