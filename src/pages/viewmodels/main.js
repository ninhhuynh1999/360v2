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

    new InfoModel("Khu A", "/models/dae/a/a.dae", "", false),
    new InfoModel("Khu B", "/models/dae/b/b.dae", "", false),
    new InfoModel("Khu C", "/models/dae/c/c.dae", "", false),
    new InfoModel("Khu D", "/models/dae/d/d.dae", "", false),
    new InfoModel("Khu HB", "/models/dae/hb/hb.dae", "", false),
    new InfoModel("Khu KLF", "/models/dae/klf/klf.dae", "", false),
    // new InfoModel("TRUONG","/models/dae/truong/truong.dae", ""),
]
const gltf_Models = [
    new InfoModel("Khu A", "/models/gltf/khua.gltf", "", false),
    new InfoModel("Khu B", "/models/gltf/khub.gltf", "", false),
    new InfoModel("Khu C", "/models/gltf/khuc.gltf", "", false),
    new InfoModel("Khu D", "/models/gltf/d.gltf", "", false),
    new InfoModel("Khu HB", "/models/gltf/hb.gltf", "", false),
    new InfoModel("Khu KLF", "/models/gltf/klf.gltf", "", false),
    new InfoModel("Truong", "/models/gltf/truong.gltf", "", false),
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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
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
                <img src="data:image/png;base64,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"
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