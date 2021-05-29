import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'

import "./load360.css"
import '../../../static/css/controls.css'



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
// renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio)

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
const sphereMaterial = new THREE.MeshBasicMaterial({ map: textureEquirec,side:THREE.DoubleSide })
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

    const textureLoader = new THREE.TextureLoader()
    let textureEquirec = textureLoader.load(URL.createObjectURL(event.target.files[0]),
        function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.repeat.x = - 1;
            scene.background = texture
            texture.mapping = THREE.EquirectangularReflectionMapping;
            sphere.material.map = texture
            sphere.material.needsUpdate = true;
console.log(sphere)
        }, function () {

        }, function (error) {
            console.log(error)
        }
    );


    // URL.revokeObjectURL(output.src) // free memory

};

document.querySelector("#input-file").addEventListener('change', function (e) {
    loadFile(e)

})

window.addEventListener("resize", function () {
    let x = div_output.clientWidth
    let y = div_output.clientHeight
    camera.aspect = x / y
    camera.updateProjectionMatrix()
    renderer.setSize(x, y)
})


GUI.TEXT_CLOSED = "ĐÓNG CÀI ĐẶT"
GUI.TEXT_OPEN = "MỞ CÀI ĐẶT"
//setup dat GUI
const gui = new GUI({ autoPlace: true })
const cameraFolder = gui.addFolder("Cài đặt Camera")
let camera_fov = cameraFolder.add(camera, "fov", 25, 80).onChange(updateCamera)
let camera_position_x = cameraFolder.add(camera.position, "x", -60, 60).onChange(updateCamera)
let camera_position_y = cameraFolder.add(camera.position, "y", -60, 80).onChange(updateCamera)
let camera_position_z = cameraFolder.add(camera.position, "z", -60, 80).onChange(updateCamera)

camera_fov.name("Trường nhìn(fov)")
camera_position_x.name("Vị trí x:")
camera_position_y.name("Vị trí y:")
camera_position_z.name("Vị trí z:")
cameraFolder.open()
gui.closed = true
//config position GUI add
let mainGui = document.createElement("div")
mainGui.className = "dg ac dat-gui"
mainGui.appendChild(gui.domElement)
div_output.insertBefore(mainGui, div_output.firstChild)

function updateCamera() {
    camera.updateProjectionMatrix()
}

// event scroll mouse to zoom
function onScroll(event) {
    event.preventDefault()
    let temp = parseInt(slider.value)
    //console.log(event.deltaY)
    if (event.deltaY < 0) {
        if (temp == 100) {
            return
        }
        slider.value = temp + 5
        slider.oninput()
    } else {
        if (temp == 1) {
            return
        }
        slider.value = temp - 5
        slider.oninput()
    }
}
//on change slider zoom
const slider = document.getElementById("myRange");
slider.oninput = function () {
    camera.zoom = 1 + this.value * 3 / 100;
    camera.updateProjectionMatrix()
}
//add event to object
div_output.addEventListener("wheel", onScroll)

document.querySelector(".rotate-control").addEventListener("click", function () {
    const clicked = document.querySelector(".rotate-control").getAttribute("data-status")
    if (clicked == "open") {
       controls.autoRotate = true
        
    }
    if (clicked == "close") {
        controls.autoRotate = false
       

    }
})
