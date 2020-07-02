// https://github.com/mrdoob/three.js/blob/dev/build/three.module.js
import * as THREE from '/three.module.js';
// From https://discourse.threejs.org/t/transformcontrols-rotation-is-not-working/7519/5
import {TransformControls} from '/TransformControls.js';
import SessionHandler from '/SessionHandler.js';
import {XRControllerModelFactory} from '/XRControllerModelFactory.js';
// set up the scene, camera, and renderer
// From https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.y = 5;
camera.position.z = 5;
camera.rotation.set(-Math.PI / 4, 0, 0, 'XYZ');
let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// prevent the right click menu from showing up on the canvas
renderer.domElement.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})
renderer.xr.enabled = true;
// onSelectStart/End and buildController from https://github.com/mrdoob/three.js/blob/dev/examples/webxr_vr_ballshooter.html
function onSelectStart() {
    this.userData.isSelecting = true;
    selectObjectVR(this.position, this.quaternion);
}

function onSelectEnd() {
    this.userData.isSelecting = false;
}

function buildController( data ) {

    switch ( data.targetRayMode ) {

        case 'tracked-pointer':

            var geometry = new THREE.BufferGeometry();
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
            geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

            var material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

            return new THREE.Line( geometry, material );

        case 'gaze':

            var geometry = new THREE.RingBufferGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
            var material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
            return new THREE.Mesh( geometry, material );

    }

}

// declare controllers: https://github.com/mrdoob/three.js/blob/master/examples/webxr_vr_ballshooter.html#L24
let controller1, controller2;
let controllerGrip1, controllerGrip2;
let controlRay1, controlRay2;

controller1 = renderer.xr.getController(0);
controller1.addEventListener( 'selectstart', onSelectStart );
controller1.addEventListener( 'selectend', onSelectEnd );
controller1.addEventListener( 'connected', function ( event ) {
    controlRay1 = buildController( event.data );
    this.add( controlRay1 );

} );
controller1.addEventListener( 'disconnected', function () {

    this.remove( this.children[ 0 ] );

} );
scene.add( controller1 );

controller2 = renderer.xr.getController( 1 );
controller2.addEventListener( 'selectstart', onSelectStart );
controller2.addEventListener( 'selectend', onSelectEnd );
controller2.addEventListener( 'connected', function ( event ) {
    controlRay2 = buildController( event.data )
    this.add( controlRay2 );

} );
controller2.addEventListener( 'disconnected', function () {

    this.remove( this.children[ 0 ] );

} );
scene.add( controller2 );

var controllerModelFactory = new XRControllerModelFactory();

controllerGrip1 = renderer.xr.getControllerGrip( 0 );
controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
scene.add( controllerGrip1 );

controllerGrip2 = renderer.xr.getControllerGrip( 1 );
controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
scene.add( controllerGrip2 );
// basic update loop
function animate() {
    renderer.render( scene, camera );
}
var _sessionHandler = new SessionHandler(renderer, camera);
// animate();
renderer.setAnimationLoop( function () {
	animate();
} );
// holds all of the entities in the scene
let entities = [];
// variables that hold various geometry. Used when instantiating the entities.
let boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
let coneGeometry = new THREE.ConeGeometry(1, 1, 20);
let cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 20);
// the basic (unlit) material all shapes have. Green is the default, though that can be changed.
let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

// with help from https://threejs.org/docs/#api/en/core/Raycaster
let raycaster = new THREE.Raycaster();
let mouseMovement = new THREE.Vector2();
let mousePos = new THREE.Vector2();

let controls = new TransformControls(camera, renderer.domElement);
controls.name = "TransformControls";
// the TransformControls only show up when attached to an object
scene.add(controls);
//changes the object the transform controls are attached to
controls.addEventListener('objectChange',  () => {
    selectedOutline.position.set(selected.position.x, selected.position.y, selected.position.z);
    selectedOutline.rotation.copy(selected.rotation);
    selectedOutline.scale.copy(selected.scale);
});
// updates mousePos. If a mouse button is held down, track the mouse movement to rotate the camera accordingly
function onMouseMove( event ) {
    mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
window.addEventListener('mousemove', onMouseMove);

// moves the camera based on WASD input.
function moveCamera(e){
    let cameraFwd = new THREE.Vector3();
    let cameraRight = new THREE.Vector3(1, 0, 0);
    camera.getWorldDirection(cameraFwd);
    cameraRight.applyQuaternion(camera.quaternion);
    if (e.key == "w"){
        camera.position.add(cameraFwd.multiplyScalar(.1));
    }
    if (e.key == "s"){
        camera.position.add(cameraFwd.multiplyScalar(-.1));
    }
    if (e.key == "a"){
        camera.position.add(cameraRight.multiplyScalar(-.1));
    }
    if (e.key == "d"){
        camera.position.add(cameraRight.multiplyScalar(.1));
    }
}

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

// create grid, with help from https://threejs.org/docs/index.html#api/en/helpers/GridHelper
let size = 10;
let divisions = 10;
let gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

let selected;
// white wireframe of selected
let selectedOutline;
// selects objects in the scene when a user clicks on them
function selectObject() {
    // removing the grid might help with raycasting
    scene.remove(gridHelper);
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
    // loop through the objects hit by the raycast.
    for (; firstMeshIndex < intersects.length; ++firstMeshIndex){
        // if a mesh is hit
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
}

function selectObjectVR(controlPosition, controlRotation) {
    raycaster.set(controlPosition, new THREE.Vector3(0, 0, -1).applyQuaternion(controlRotation));
    selectObject();
}

function selectObject2D(e) {
    // ignore if right mouse button was pressed
    if (e.button == 2) {
        return;
    }
    // with help from https://threejs.org/docs/#api/en/core/Raycaster
    raycaster.setFromCamera(mousePos, camera);
    selectObject();

}

renderer.domElement.addEventListener('mousedown', selectObject2D);

window.addEventListener('keydown', (e) => {
    moveCamera(e);
    // handle miscellaneous keys
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

// creates a JSON representation of all entities, sends that and the id to the server
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
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = () => {
        if (xhr.status == 200) {
            let scene = JSON.parse(xhr.response);
            parseScene(scene);
        }
    }
    xhr.send();
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
