import * as THREE from 'three'

import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import Stats from 'three/examples/jsm/libs/stats.module'
import * as dat from 'three/examples/jsm/libs/dat.gui.module'
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

import './style.css'

class InfoModel {
    /**
     * @param {string} name 
     * @param {string} url 
     * @param {string} thumb 
     * @param {boolean} actived 
     * @param {boolean} inActive 
     * @param {THREE.Object3D} model
     */
    constructor(name, url, thumb, actived, inActive = false, model = null) {
        this.name = name
        this.url = url
        this.thumb = thumb
        this.actived = actived
        this.inActive = inActive
        this.model = model
    }
}
const dae_Models = [

    new InfoModel("Khu A", "/models/dae/a/a.dae", "/models/thumbs/a.png", false),
    new InfoModel("Khu B", "/models/dae/b/b.dae", "/models/thumbs/b.png", false),
    new InfoModel("Khu C", "/models/dae/c/c.dae", "/models/thumbs/c.png", false),
    new InfoModel("Khu D", "/models/dae/d/d.dae", "/models/thumbs/d.png", false),
    new InfoModel("Khu HB", "/models/dae/hb/hb.dae", "/models/thumbs/hb.png", false),
    new InfoModel("Khu KLF", "/models/dae/klf/klf.dae", "/models/thumbs/klf.png", false),
    new InfoModel("TRUONG","/models/dae/truong/truong.dae", "/models/thumbs/truong.png",false),
]
const gltf_Models = [
    new InfoModel("Khu A", "/models/gltf/khua.gltf", "/models/thumbs/a.PNG", false),
    new InfoModel("Khu B", "/models/gltf/khub.gltf", "/models/thumbs/b.PNG", false),
    new InfoModel("Khu C", "/models/gltf/khuc.gltf", "/models/thumbs/c.PNG", false),
    new InfoModel("Khu D", "/models/gltf/d.gltf", "/models/thumbs/d.PNG", false),
    new InfoModel("Khu HB", "/models/gltf/hb.gltf", "/models/thumbs/hb.PNG", false),
    new InfoModel("Khu KLF", "/models/gltf/klf.gltf", "/models/thumbs/klf.PNG", false),
    new InfoModel("Truong", "/models/gltf/truong.gltf", "/models/thumbs/truong.PNG", false),
]
gltf_Models[1].actived = true
gltf_Models[1].inActive = true

const playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35);
const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();

const clock = new THREE.Clock();

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
camera.position.x = 65
camera.position.y = 76
camera.position.z = 3
camera.rotation.order = 'YXZ';
camera.updateProjectionMatrix()
scene.add(camera)

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


const pickPosition = { x: 0, y: 0 };
clearPickPosition();
const raycaster = new THREE.Raycaster();

function onClick(event) {
    // const mouse = new THREE.Vector2();
    // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    // mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pickPosition, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
    }

}

function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * canvas.width / rect.width,
        y: (event.clientY - rect.top) * canvas.height / rect.height,
    };
}

function setPickPosition(event) {
    // const pos = getCanvasRelativePosition(event);
    // pickPosition.x = (pos.x / canvas.width) * 2 - 1;
    // pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
    // raycaster.setFromCamera(pickPosition, camera);

    // // calculate objects intersecting the picking ray
    // const intersects = raycaster.intersectObjects(scene.children);

    if (document.pointerLockElement === canvas) {
        camera.rotation.y -= event.movementX / 500;
        camera.rotation.x -= event.movementY / 500;
    }
}

function clearPickPosition() {

    pickPosition.x = -100000;
    pickPosition.y = -100000;
}


const keyStates = {};
function onKeyDown(event) {

    const step = 3
    keyStates[event.code] = true;

}
function onKeyUp(event) {

    keyStates[event.code] = false;
}

function updatePlayer(deltaTime) {
    const damping = Math.exp(- 3 * deltaTime) - 1;
    playerVelocity.addScaledVector(playerVelocity, damping);
    const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
    playerCollider.translate(deltaPosition);
    camera.position.copy(playerCollider.end);
}
function getForwardVector() {

    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    return playerDirection;
}

function getSideVector() {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross(camera.up);
    return playerDirection;
}

function controls(deltaTime) {

    const speed = 20;

    if (true) {

        if (keyStates['KeyW']) {
            playerVelocity.add(getForwardVector().multiplyScalar(speed * deltaTime));

        }

        if (keyStates['KeyS']) {

            playerVelocity.add(getForwardVector().multiplyScalar(- speed * deltaTime));

        }

        if (keyStates['KeyA']) {
            playerVelocity.add(getSideVector().multiplyScalar(- speed * deltaTime));

        }

        if (keyStates['KeyD']) {
            playerVelocity.add(getSideVector().multiplyScalar(speed * deltaTime));

        }

        if (keyStates['Space']) {

            playerVelocity.y = 3;

        }
        if (keyStates['KeyF']) {
            playerVelocity.y = -3;

        }

    }
}
function onWindowResize(){
    renderer.setSize(div_output.clientWidth,div_output.clientHeight)
    
}

document.addEventListener('resize', onWindowResize, false)
document.addEventListener('click', onClick, false)
document.addEventListener('mousemove', setPickPosition);
document.addEventListener('mouseout', clearPickPosition);
document.addEventListener('mouseleave', clearPickPosition);
canvas.addEventListener('mousedown', () => {

    canvas.requestPointerLock();

}, false);

document.addEventListener("keydown", onKeyDown, false)
document.addEventListener("keyup", onKeyUp, false)

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();
    renderer.setSize(div_output.clientWidth, div_output.clientHeight);
})
// show stats
const stats = Stats()
stats.domElement.className = "stats"
div_output.appendChild(stats.dom)

//loop renderer
var animate = function () {

    requestAnimationFrame(animate)
    render()
    stats.update()

};

function render() {
    const deltaTime = Math.min(0.1, clock.getDelta());
    controls(deltaTime);
    updatePlayer(deltaTime);
    renderer.render(scene, camera)
}

animate();
render()

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
    })
    document.querySelectorAll(".card").forEach(x => {
        x.addEventListener("click", () => {
            clickThumb(x)
        }, false)
    })
    //ul.firstElementChild.firstElementChild.classList.add("active")
    document.querySelectorAll(".card").item(1).classList.add('active')
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
        item.activeda = true
        curItem.inActive = false
    }


}


function collada(url) {
    const colladaLoader = new ColladaLoader()
    colladaLoader.load(url, function (collada) {
        let dae = collada.scene;

        dae.traverse(function (child) {
            if (child.isMesh) {
                // model does not have normals
                // child.material.flatShading = true;
                // child.material.wireframe = false
                //child.geometry.normalizeNormals()
                //child.matrixAutoUpdate = false
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
                child.castShadow = true;
                child.receiveShadow = true;

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
// obj('/models/obj/truong/truong.mtl','/models/obj/truong/truong.obj')
// collada("/models/dae/truong.dae")
gltf("/models/gltf/khub.gltf", gltf_Models[1])