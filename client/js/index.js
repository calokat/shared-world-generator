import * as THREE from '/three.module.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.y = 5;
camera.position.z = 5;
camera.rotation.set(-Math.PI / 4, 0, 0, 'XYZ');
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


// create grid, with help from https://threejs.org/docs/index.html#api/en/helpers/GridHelper
var size = 10;
var divisions = 10;
var gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );


let newWorldBtn = document.querySelector('#newWorld');
let enterWorldBtn = document.querySelector("#enterWorld");
let idField = document.querySelector("#idField");
let errorDisplay = document.querySelector("#error");
window.onload = () => {
    newWorldBtn.addEventListener('click', () => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/new');
        xhr.onload = () => {
            // With help from https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage
            //window.location.replace(window.location.href + `engine?id=${xhr.responseText}`);
            window.location.href = window.location.href += `engine?id=${xhr.responseText}`;
        }
        xhr.send();
    });
    enterWorldBtn.addEventListener('click', () => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `/getScene?id=${idField.value}`);
        xhr.onload = () => {
            let jsonResponse = JSON.parse(xhr.response);
            if (!jsonResponse.errorCode) {
                // window.location.replace(window.location.href += `engine?id=${idField.value}`);
                window.location.href = window.location.href += `engine?id=${idField.value}`;
            }
            // Thanks to https://www.w3schools.com/js/tryit.asp?filename=tryjs_visibility for a quick refresher
            else {
                errorDisplay.style.visibility = "visible";
            }
        }
        xhr.send();
    });
}