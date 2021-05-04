import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import "./load360.css"
//init scene
const div_output = document.querySelector(".show360")
const output = document.querySelector('#output-threejs')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1, 1, 1)
camera.rotation.order = "YXZ";
console.log(camera)
scene.add(camera)

//renderer
const renderer = new THREE.WebGLRenderer({ canvas: output, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio)

//Controls
const controls = new OrbitControls(camera, output)
controls.enableRotate = true
controls.autoRotate = false
controls.enableDamping = true
controls.enableZoom = false

// create the sphere
const sphereGeo = new THREE.SphereGeometry(150, 75, 75)
const textureLoader = new THREE.TextureLoader()
let textureEquirec = textureLoader.load('../images/anh360/1.jpg');
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
scene.background = textureEquirec
const sphereMaterial = new THREE.MeshBasicMaterial({ envMap: textureEquirec })
sphereMaterial.needsUpdate = true;

sphereMaterial.transparent = true
const sphere = new THREE.Mesh(sphereGeo, sphereMaterial)
//this.sphere.rotation.y = 3.9

sphere.name = "Sphere1"
scene.add(sphere)
sphere.material.transparent = false

document.body.onload = animate()


function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
    //render()
}

var loadFile = function (event) {

    //cach 1
    // var reader = new FileReader();
    // reader.onload = function(){
    //   var output = document.getElementById('output-img');
    //   output.src = reader.result;
    //   console.log(reader)
    // };
    // reader.readAsDataURL(event.target.files[0]);

    //cach 2
    //var output = document.getElementById('output-img');
    //console.log(event.target.files[0])
    const textureLoader = new THREE.TextureLoader()
    let textureEquirec = textureLoader.load(URL.createObjectURL(event.target.files[0]),
    function(texture){
        scene.background = texture
        texture.mapping = THREE.EquirectangularReflectionMapping;
    
    sphere.material.envMap = texture
    },function(){

    },function(error){
        console.log(error)
    }
    );
    
    
        // URL.revokeObjectURL(output.src) // free memory
    
};
function onScroll(event){
   
    event.preventDefault();
    if (event.deltaY < 0 && camera.zoom < 3.5) {
        camera.zoom +=0.1
        camera.updateProjectionMatrix()
    } 
    if (event.deltaY > 0 && camera.zoom > 0.7) {
        camera.zoom -=0.1
        camera.updateProjectionMatrix()
    }
    console.log(camera.zoom)
}
document.querySelector("#input-file").addEventListener('change', function (e) {
        loadFile(e)
        
})
div_output.onwheel = onScroll
window.addEventListener("resize",function(){
    let x = div_output.clientWidth
    let y =div_output.clientHeight
   
    camera.aspect=x/y
    camera.updateProjectionMatrix()
    renderer.setSize(x,y)
})
