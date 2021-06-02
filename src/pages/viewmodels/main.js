import * as THREE from 'three'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import Stats from 'three/examples/jsm/libs/stats.module'
import * as dat from 'three/examples/jsm/libs/dat.gui.module'

import './style.css'
import  InfoModel from '../../../static/js/InfoModel.js'

dat.GUI.TEXT_CLOSED = "Đóng Cài đặt"
dat.GUI.TEXT_OPEN = "Mở Cài đặt"



const gltf_Models = [
    new InfoModel("Khu A", "/models/gltf/khua.gltf", "/models/thumbs/a.PNG", false),
    new InfoModel("Khu B", "/models/gltf/khub.gltf", "/models/thumbs/b.PNG", false),
    new InfoModel("Khu C", "/models/gltf/khuc.gltf", "/models/thumbs/c.PNG", false),
    new InfoModel("Khu D", "/models/gltf/khud.gltf", "/models/thumbs/d.PNG", false),
    new InfoModel("Khu HB", "/models/gltf/hb.gltf", "/models/thumbs/hb.PNG", false),
    new InfoModel("Khu KLF", "/models/gltf/klf.gltf", "/models/thumbs/klf.PNG", false),
    new InfoModel("Truong", "/models/gltf/truong.gltf", "/models/thumbs/truong.PNG", false),
]
gltf_Models[5].actived = true
gltf_Models[5].inActive = true


let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false
let moveDown = false

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Canvas
const div_output = document.querySelector(".div-output")
const canvas = document.querySelector('canvas.output')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xf0f0f0);
const textureLoader = new THREE.TextureLoader()
let textureEquirec = textureLoader.load('/images/anh360/Vue1.jpg');
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
scene.background = textureEquirec
//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 250)
camera.position.x = -4
camera.position.y = 10
camera.position.z = -28
camera.rotation.order = 'YXZ';
camera.updateProjectionMatrix()
camera.lookAt(0, 0, 0)
scene.add(camera)

//controls
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());
//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
const sizes = { width: div_output.clientWidth, height: div_output.clientHeight }
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.domElement.ondragstart = function (event) { event.preventDefault(); return false; };
renderer.physicallyCorrectLights = true
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;

//light
const ambientLight = new THREE.AmbientLight(0xf0f0f0)
ambientLight.intensity = 3.5
scene.add(ambientLight);

const light = new THREE.SpotLight("rgb(0,0,0)", 5);
light.position.set(110.0147950246119, 68.462579154026, 10.388334751409673);
light.angle = Math.PI / 9;

light.castShadow = true;
light.shadow.camera.near = 250;
light.shadow.camera.far = 500;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.visible = true
//scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xf0f0f0)
directionalLight.color.set(0xf0f0f0)
directionalLight.intensity = 0.03
directionalLight.castShadow = true
directionalLight.position.x = 65
directionalLight.position.y = 76
directionalLight.position.z = -3

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

scene.add(directionalLight);

const directionHelper = new THREE.DirectionalLightHelper(directionalLight, "red")
scene.add(directionHelper)

// show stats
const stats = Stats()
stats.domElement.className = "stats"
div_output.appendChild(stats.dom)

const onKeyDown = function (event) {

    switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

        case 'Space':
            moveUp = true;
            break;
        case 'KeyF':
            moveDown = true;
            break;

    }

};

const onKeyUp = function (event) {

    switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
        case 'Space':
            moveUp = false;
            break;
        case 'KeyF':
            moveDown = false;
            break;
    }

};
const blocker = document.querySelector("#blocker")
controls.addEventListener('lock', function () {
    blocker.style.display = 'none';
});

controls.addEventListener('unlock', function () {
    blocker.style.display = 'block';
});
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
canvas.addEventListener('mousedown', () => {
    controls.lock()
}, false);
blocker.addEventListener("click", () => {
    blocker.style.display = "none"
    controls.lock()
})
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();
    renderer.setSize(div_output.clientWidth, div_output.clientHeight);
})

document.querySelector("#sidebarCollapse").addEventListener("click", function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();
    renderer.setSize(div_output.clientWidth, div_output.clientHeight);
})
const resize_update = new ResizeObserver(function(entries) {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();
    renderer.setSize(div_output.clientWidth, div_output.clientHeight);
});

// start observing for resize
resize_update.observe(document.querySelector("#instructions"));


//loop renderer
var animate = function () {

    requestAnimationFrame(animate);
    stats.update()
    const time = performance.now();

    if (controls.isLocked === true) {

        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.y = Number(moveDown) - Number(moveUp);
        direction.normalize(); // this ensures consistent movements in all directions
        velocity.y = Math.max(0, velocity.y);
        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
        if (moveUp || moveDown) velocity.y -= direction.y * 400.0 * delta;

        controls.moveRight(- velocity.x * delta);
        controls.moveForward(- velocity.z * delta);
        controls.getObject().position.y += (velocity.y * delta); // new behavior
    }

    prevTime = time;
    renderer.render(scene, camera);
};


animate();

controls.addEventListener("change", () => {
    console.log(camera.position)
})

// Debug dat gui
const gui = new dat.GUI({ autoPlace: true })
gui.closed = true
let mainGui = document.createElement("div")
mainGui.className = "dg ac dat-gui"
mainGui.appendChild(gui.domElement)

div_output.insertBefore(mainGui, div_output.firstChild)

const lightcolor = {
    ambientLight: ambientLight.color.getHex(),
    directionalLight: directionalLight.color.getHex(),
}

let folder2 = gui.addFolder("AmbientLight")
folder2.add(ambientLight, "intensity", 0, 5, 0.001)
folder2.addColor(lightcolor, 'ambientLight').onChange(function (val) {
    ambientLight.color.setHex(val);
    render();
});

let folder3 = gui.addFolder("directionalLight")
folder3.add(directionalLight, "intensity", 0, 1, 0.001)
folder3.add(directionalLight.position, "x", -100, 100, 1)
folder3.add(directionalLight.position, "y", -100, 100, 1)
folder3.add(directionalLight.position, "z", -100, 100, 1)
folder3.addColor(lightcolor, 'directionalLight').onChange(function (val) {
    directionalLight.color.setHex(val);
    render();
});
//end dat gui

function createThumb() {
    const ul = document.querySelector("ul.list-unstyled")
    gltf_Models.forEach(element => {
        if (element.name.trim().valueOf() === "Khu A" || element.name.trim().valueOf() === "Truong") {

        } else {
            ul.innerHTML += `
            <li>
                    <div class="card" data-model="${element.name}">
                        <img src="${element.thumb}"
                            class="card-img-top" alt="...">
                        <div class="card-body">
                            <p class="card-text">${element.name}</p>
                        </div>
                    </div>
            </li>`
        }

    })
    document.querySelectorAll(".card").forEach(x => {
        x.addEventListener("click", () => {
            clickThumb(x)
        }, false)
    })
    document.querySelectorAll(".card").item(4).classList.add('active')
}

/**
 * 
 * @param {HTMLBaseElement} element 
 */
function clickThumb(element) {
    if (element.classList.contains("active")) {
        return
    }
    document.querySelector(".card.active").classList.remove("active")
    element.classList.add("active")
    loadModels(element.getAttribute("data-model"))
}
createThumb()

function loadModels(name) {
    const item = gltf_Models.find(element => element.name == name)
    const curItem = gltf_Models.find(element => element.inActive == true)
    console.log(item)
    console.log(curItem)
    if (typeof curItem != "undefined") {
        if (item.actived) {
            scene.getObjectByProperty("uuid", curItem.model.uuid).visible = false
            scene.getObjectByProperty("uuid", item.model.uuid).visible = true
        } else {
            scene.getObjectByProperty("uuid", curItem.model.uuid).visible = false
            gltf(item.url, item)
        }
        item.inActive = true
        item.actived = true
        curItem.inActive = false
    }
}


function collada(url) {
    const colladaLoader = new ColladaLoader()
    colladaLoader.load(url, function (collada) {
        let dae = collada.scene;

        dae.traverse(function (child) {
            if (child.isMesh) {
                if (child.material.map) {
                    child.castShadow = true
                    child.material.map.anisotropy = 8;

                }
            }
        });
        dae.scale.x = dae.scale.y = dae.scale.z = 0.02;
        dae.updateMatrix();
        console.log(dae)
        scene.add(dae)
        models[dae.name] = true
    })
    console.log(models)
}
//collada('/models/truong/truong.dae')

// obj
function obj(url_MTL, url_OBJ) {
    const loader = new OBJLoader()
    const mtlLoader = new MTLLoader()
    mtlLoader.load(url_MTL, function (mtl) {
        mtl.preload()
        loader.setMaterials(mtl)
        loader.load(url_OBJ, function (obj) {
            obj.scale.set(0.01, 0.01, 0.01)

            scene.add(obj)

        });

    })
}
/**
 * 
 * @param {string} url 
 * @param {InfoModel} item 
 */
function gltf(url, item) {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(url, (gltf) => {
        gltf.scene.traverse(child => {

            if (child.isMesh) {
                child.matrixAutoUpdate = false;
                //child.castShadow = true;
                // child.receiveShadow = true;
                if (child.material.map) {
                    child.material.map.anisotropy = 8;
                }
            }
        });
        // gltf.scene.scale.x = gltf.scene.scale.y = gltf.scene.scale.z = 0.02;
        scene.add(gltf.scene);
        item.model = gltf.scene
        directionalLight.target = gltf.scene
    })
}

gltf("/models/gltf/klf.gltf", gltf_Models[5])