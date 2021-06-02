
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TweenLite } from 'gsap/TweenLite.js'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import ListScene from '../static/js/ListScene.js'
import Scene from '../static/js/Scene.js'

import './style.css'
import '../static/css/controls.css'
import data from '../static/js/data.json';

//init variables
const tooltip = document.querySelector('.tooltip')
const div_main1 = document.querySelector(".main1")
const output = document.querySelector('#output')
const divOuputMap = document.querySelector(".map")
const map_output = document.querySelector("#output-map")
let div_thumb
let map_tooltipActive = false
let tooltipActive = false
let img_url = "/images/anh360_lite"

//init scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-42, 9, -24)
camera.rotation.order = "YXZ";
scene.add(camera)
scene.isHidePoint = false

//renderer
const renderer = new THREE.WebGLRenderer({ canvas: output, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

//Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableRotate = true
controls.autoRotate = false
controls.enableKeys = true
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false

// create the sphere
const sphereGeo = new THREE.SphereGeometry(150, 75, 75)
const textureLoader = new THREE.TextureLoader()
let textureEquirec = textureLoader.load('/images/anh360/black.jpg');
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
scene.background = textureEquirec
const sphereMaterial = new THREE.MeshBasicMaterial({
    map: textureEquirec,
    side: THREE.BackSide
})
sphereMaterial.needsUpdate = true;

sphereMaterial.transparent = true
const sphere = new THREE.Mesh(sphereGeo, sphereMaterial)

sphere.name = "Sphere1"
sphere.position.set(0, 0, 0.001)
scene.add(sphere)
sphere.material.transparent = false

//setup map
const map_scene = new THREE.Scene();
map_scene.background = new THREE.Color("white");
let frustumSize = divOuputMap.clientWidth;
let aspect = divOuputMap.clientWidth / divOuputMap.clientHeight

const map_camera = new THREE.OrthographicCamera(divOuputMap.clientWidth * aspect / -2, divOuputMap.clientWidth * aspect / 2, divOuputMap.clientHeight / 2, divOuputMap.clientHeight / -2, 0.1, 1000)
map_camera.updateProjectionMatrix()

const map_renderer = new THREE.WebGLRenderer({ canvas: map_output });
map_camera.position.z = 0;
map_camera.position.x = 0;
map_camera.position.y = 100;
map_camera.zoom = 2.65;
map_camera.updateProjectionMatrix()
map_renderer.setSize(divOuputMap.clientWidth, divOuputMap.clientHeight);
map_renderer.setPixelRatio(window.devicePixelRatio)

// map_controls
const map_controls = new OrbitControls(map_camera, map_renderer.domElement)
map_controls.enableRotate = false
map_controls.enablePan = true
map_controls.minZoom = 2.65;
map_controls.maxZoom = 8;
map_controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE }
map_controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.ROTATE }
map_controls.maxAzimuthAngle = 0.0001
map_controls.maxPolarAngle = 0.00001
map_controls.minAzimuthAngle = 0
map_controls.minPolarAngle = 0

//animation scene
document.body.onload = () => {
    animate()
    map_animate();
}


//init all scene
//read json file
let arr = []
const json_scenes = data.scenes
const json_points = data.points
//data scene
let sceneId = 0
json_scenes.forEach(element => {
    const positionOnMap = new THREE.Vector3(element.positionOnMap[0], element.positionOnMap[1], element.positionOnMap[2])
    const s = new Scene(sceneId, img_url + element.url, element.name, positionOnMap, element.updateMiniMap)
    sceneId++
    arr.push(s)
})
//add point scene 
sceneId = 0
json_points.forEach(element => {
    const s = arr.find(x => x.id == element.sceneId)
    element.points.forEach(point => {
        const info_scene = arr.find(x => x.id == point.sceneId)
        s.addPoint({
            position: new THREE.Vector3(point.position[0], point.position[1], point.position[2]),
            scene: info_scene
        })
    })
})

//init controls, scene ,camera
arr.forEach(x => {
    x.controls = controls
    x.scene = scene
    x.camera = camera
})

//add scene to ListScene 
const listScene = new ListScene(arr, scene, camera)
listScene.scene_controls = controls

//init map to listScene
listScene.map_scene = map_scene
listScene.renderer = map_renderer
listScene.createMap()

//generate frist first scene
listScene.actived = arr[1]
listScene.newActive = 0
listScene.activeScene()
listScene.changeCurrentSprite()
mapCameraLookAt(listScene.activePoint.position.clone())

console.log(listScene)

//DAT GUI
GUI.TEXT_CLOSED = "ĐÓNG CÀI ĐẶT"
GUI.TEXT_OPEN = "MỞ CÀI ĐẶT"
//setup dat GUI
let camera_conf = {
    goOut: false,
    envMap: false,
}

const gui = new GUI({ autoPlace: true })
const cameraFolder = gui.addFolder("Cài đặt Camera")
let camera_fov = cameraFolder.add(camera, "fov", 25, 150, 1).onChange(updateCamera)
let camera_position_x = cameraFolder.add(camera.position, "x", -60, 60, 1).onChange(updateCamera)
let camera_position_y = cameraFolder.add(camera.position, "y", -60, 110, 3).onChange(updateCamera)
let camera_position_z = cameraFolder.add(camera.position, "z", -60, 60, 3).onChange(updateCamera)
let camera_move_out = cameraFolder.add(camera_conf, "goOut").onChange(function (e) {
    if (e == true) {
        controls.enabled = false
        camera.position.z = 350
        controls.enabled = true
    } else {
        controls.enabled = false
        camera.position.set(-44, -4, -30)
        controls.enabled = true
    }
})

camera_move_out.name("Ra ngoài cảnh:")
camera_fov.name("Trường nhìn(fov):")
camera_position_x.name("Vị trí x:")
camera_position_y.name("Vị trí y:")
camera_position_z.name("Vị trí z:")
cameraFolder.open()

gui.closed = true
//config position GUI add
gui.domElement.id = 'gui';
let customContainer = document.querySelector('.main1');
let domElement = gui.domElement
customContainer.insertBefore(domElement, customContainer.firstChild);

function updateCamera() {
    camera.updateProjectionMatrix()
}
// responsive window
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    map_camera.updateProjectionMatrix();
    map_renderer.setSize(divOuputMap.clientWidth, divOuputMap.clientHeight);
}

// event on change controls
controls.addEventListener("change", function () {
    updateBeam()
})

//add event on camera map change
// Limits pan x,y
let maxX = 80
let minX = -80

// State
let positionX
let positionZ
let phi
let theta

// scale sprite
let preCamerazoom = map_camera.zoom
let scaleSprite = 8
const MIN_SCALE = 3
map_controls.addEventListener('change', map_controlsChange)
// map_controls change
function map_controlsChange() {
    let cameraZoom = map_camera.zoom
    console.log(cameraZoom)
    if (cameraZoom > 5) {
        maxX = 100
        minX = -100
    } else {
        maxX = 80
        minX = -80
    }
    let minZoom = map_controls.minZoom
    let maxZoom = map_controls.maxZoom - minZoom
    if (cameraZoom != preCamerazoom) {
        let scale = 8
        if (preCamerazoom < cameraZoom) {
            scale = 8 - (5 * (cameraZoom - minZoom) / maxZoom)
        }
        if (preCamerazoom > cameraZoom) {
            scale = 3 + 5 - (5 * (cameraZoom - minZoom) / maxZoom)
        }

        if (divOuputMap.classList.contains("mini-map")) {
            scale = (scale - 1 < MIN_SCALE) ? (MIN_SCALE) : (scale - 1)
        }

        listScene.map_sprites.forEach(element => {
            element.scale.set(scale, scale, scale)
        })
        preCamerazoom = cameraZoom
        scaleSprite = scale
    }
    limitPanMap()
}

// create thumbs && click event thumb 
listScene.scenes.forEach(element => {
    var a = element
    document.querySelector(".all-thumb").innerHTML += `<div data-name="${a.id}) ${a.name}" class="div-thumb"  elemtype="thumb">'
    <div class="div-thumb-img">
    <img class="img-thumb" alt="${a.id + 1}) ${a.name}" data-sceneId="${a.id}" data-title="${a.name}" src="/images/thumbnails/thumb (${a.id}).jpg" style="width:100%",height:100%;>
    </div>
    </div>`
})

addEventToImgThumb()

function addEventToImgThumb() {
    div_thumb = document.querySelectorAll(".div-thumb")
    div_thumb.item(0).classList.add("active")
    document.querySelectorAll(".img-thumb").forEach(x => {
        const title = document.querySelector(".p-title-thumb")
        const divTitle = document.querySelector(".div-title-thumb")

        x.addEventListener("mouseover", function () {
            title.innerHTML = x.alt
            var rect = x.getBoundingClientRect();
            divTitle.style.top = (rect.top - 105 - 26 - output.getBoundingClientRect().top) + 'px'
            divTitle.style.visibility = "visible"
            divTitle.style.opacity = 1
        })
        x.addEventListener("mouseout", function () {
            divTitle.style.opacity = 0
            divTitle.style.visibility = "hidden"
        })
        x.addEventListener("click", function () {
            let txt = x.getAttribute("data-sceneId")
            listScene.newActive = txt
            listScene.activeScene()
            mapCameraLookAt(listScene.activePoint.position.clone())
            handleChangeThumbActive()
        })
        x.addEventListener("mouseup", function () {
            divTitle.style.opacity = 0
            divTitle.style.visibility = "hidden"
        })
        x.addEventListener("touchstart",(event)=>{
            title.innerHTML = x.alt
            var rect = x.getBoundingClientRect();
            divTitle.style.top = (rect.top - 105 - 26 - output.getBoundingClientRect().top) + 'px'
            divTitle.style.opacity = 1
        })
        x.addEventListener("touchmove",(event)=>{
            title.innerHTML = x.alt
            var rect = x.getBoundingClientRect();
            divTitle.style.top = (rect.top - 105 - 26 - output.getBoundingClientRect().top) + 'px'
            divTitle.style.opacity = 1
        })
        x.addEventListener("touchend",(event)=>{
            divTitle.style.opacity = 0
        })
    })
}

//event Mouse click on main scene
const pickPosition = { x: 0, y: 0 };
clearPickPosition();

function getCanvasRelativePosition(event, element) {
    const rect = element.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * element.width / rect.width,
        y: (event.clientY - rect.top) * element.height / rect.height,
    };
}

function setPickPosition(event, element) {
    const pos = getCanvasRelativePosition(event, element);
    pickPosition.x = (pos.x / element.width) * 2 - 1;
    pickPosition.y = (pos.y / element.height) * -2 + 1;  // note we flip Y
}

function clearPickPosition() {
    pickPosition.x = -100000;
    pickPosition.y = -100000;

}

function onClick(event) {
    if (scene.isHidePoint) return
    document.querySelector("input.form-control").blur();
    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(pickPosition, camera)
    let intersects = rayCaster.intersectObjects(scene.children)
    console.log(intersects[0])
    if (intersects.length > 0 && intersects[0].object.type == "Sprite" && intersects[0].object.onScene) {
        tooltip.classList.remove('isActive')
        controls.enabled = false
        listScene.newActive = intersects[0].object.idScene
        listScene.activeScene(true)
        mapCameraLookAt(listScene.activePoint.position.clone())
        TweenLite.to(controls.target, 0.5, {
            x: intersects[0].point.x,
            y: intersects[0].point.y,
            z: intersects[0].point.z,
        })
        handleChangeThumbActive()
    }
}
//event Mouse move on main scene

function onMouseMove(event) {
    if (scene.isHidePoint) return
    const rayCaster = new THREE.Raycaster();
    setPickPosition(event, output)
    rayCaster.setFromCamera(pickPosition, camera)
    let foundSprite = false
    let newObjectHover = false
    let intersects = rayCaster.intersectObjects(scene.children)
    if (intersects.length > 0) {
        if (intersects[0].object.type == "Sprite") {
            if(controls.autoRotate) {controls.autoRotate= false}
            if (tooltipActive.uuid != intersects[0].object.uuid) {
                newObjectHover = true
            }
            tooltipActive = intersects[0].object
            let p = tooltipActive.position.clone().project(camera)
            tooltip.style.top = ((-1 * p.y + 1) * div_main1.clientHeight / 2 - 5) + 'px'
            tooltip.style.left = ((p.x + 1) * div_main1.clientWidth / 2) + 'px'
            tooltip.classList.add('isActive')
            if (newObjectHover) {
                tooltip.innerHTML = tooltipActive.name
                TweenLite.to(tooltipActive.scale, 0.5, {
                    x: 10,
                    y: 10,
                    z: 10,
                })
            }
            foundSprite = true
        }else{
            const status= document.querySelector(".rotate-control").getAttribute("data-status")
            if(status == "open") {controls.autoRotate= true}
        }
    }
    if (foundSprite == false && tooltipActive) {
        tooltip.classList.remove("isActive")
        TweenLite.to(tooltipActive.scale, 0.5, {
            x: 8,
            y: 8,
            z: 8,
        })
        tooltipActive = false
    }
}

// mouse move on Map scene
function mapHover(event) {
    let foundSprite2 = false
    let newObjectHover = false
    if (typeof map_tooltipActive == "boolean") {
        newObjectHover = true
    }
    let reactMap = divOuputMap.getBoundingClientRect()
    let rectCanvas = output.getBoundingClientRect()
    const ray = new THREE.Raycaster()
    let mouse = new THREE.Vector2(
        ((event.clientX - reactMap.left) / divOuputMap.clientWidth) * 2 - 1,
        - ((event.clientY - reactMap.top) / divOuputMap.clientHeight) * 2 + 1
    )
    ray.setFromCamera(mouse, map_camera)
    let intersects = ray.intersectObjects(map_scene.children)
    if (intersects.length > 0) {
        let a = intersects[0]
        if (a.object.type == "Sprite" && a.object.isPoint == true) {
            if (typeof map_tooltipActive !== "boolean" && map_tooltipActive.name != a.object.name) {
                newObjectHover = true
                map_tooltipActive.scale.set(scaleSprite, scaleSprite, scaleSprite)
                map_tooltipActive.position.y = 1
            }
            map_tooltipActive = a.object
            let p = map_tooltipActive.position.clone().project(map_camera)
            tooltip.style.top = (((-1 * p.y + 1) * divOuputMap.clientHeight) / 2 + reactMap.top - rectCanvas.top) + 'px'
            tooltip.style.left = (((p.x + 1) * divOuputMap.clientWidth) / 2 + reactMap.left - rectCanvas.left) + 'px'
            tooltip.classList.add('mapActive')
            if (newObjectHover) {
                tooltip.innerHTML = map_tooltipActive.name
                const zoomSprite = scaleSprite + scaleSprite * 0.18
                TweenLite.to(map_tooltipActive.scale, 0.5, {
                    x: zoomSprite,
                    y: zoomSprite,
                    z: zoomSprite,
                })
                map_tooltipActive.position.y = 2
            }

            foundSprite2 = true
            // map_tooltipActive = true
        }
    }
    if (foundSprite2 == false && map_tooltipActive) {
        tooltip.classList.remove("mapActive")
        TweenLite.to(map_tooltipActive.scale, 0.5, {
            x: scaleSprite,
            y: scaleSprite,
            z: scaleSprite,
        })
        map_tooltipActive.position.y = 1
    }
}

// mouse click on map scene
function mapClick(event) {
    const ray = new THREE.Raycaster()
    let mouse = new THREE.Vector2(
        ((event.clientX - divOuputMap.getBoundingClientRect().left) / divOuputMap.clientWidth) * 2 - 1,
        - ((event.clientY - divOuputMap.getBoundingClientRect().top) / divOuputMap.clientHeight) * 2 + 1
    )
    ray.setFromCamera(mouse, map_camera)
    let intersects = ray.intersectObjects(map_scene.children)
    if (intersects.length > 0 && intersects[0].object.type == "Sprite") {
        const position = new THREE.Vector3().copy(intersects[0].object.position.clone())
        tooltip.classList.remove('mapActive')
        //update position camera
        intersects[0].object.onClick()
        mapCameraLookAt(position)
        handleChangeThumbActive()
    }
}

//onclick button rotate
document.querySelector(".rotate-control").addEventListener("click", function () {
    if (controls.autoRotate == false) {
        controls.autoRotate = true
    } else {
        controls.autoRotate = false
    }
})

function click_hidePoint() {
    let points = listScene.actived.sprites
    const status = document.querySelector(".hidePoint-control").getAttribute("data-status")
    if (status == "open") {
        points.forEach(sprite => {
            sprite.visible = false
        })
        scene.isHidePoint = true
    }
    if (status == "close") {
        points.forEach(sprite => {
            sprite.visible = true
        })
        scene.isHidePoint = false
    }
}

//update map canvas resize
document.querySelector(".map").addEventListener("transitionend", function () {
    const element = document.querySelector(".map")
    const position = listScene.activePoint.position.clone()
    const beam = map_scene.getObjectByName('beam')
    const parameters = beam.geometry.parameters
    const newcamera = new THREE.OrthographicCamera(divOuputMap.clientWidth * aspect / -2, divOuputMap.clientWidth * aspect / 2, divOuputMap.clientHeight / 2, divOuputMap.clientHeight / -2, 0.1, 1000)
    map_camera.left = newcamera.left
    map_camera.right = newcamera.right
    map_camera.top = newcamera.top
    map_camera.bottom = newcamera.bottom
    beam.geometry.dispose()
    if (element.classList.contains("activeMobile")) {
        console.log("2.65")
        map_controls.minZoom =  2.65
        map_camera.zoom = map_controls.minZoom
        parameters.radiusTop = 30
    } else {
        console.log("2")
        map_controls.minZoom =  2.4 
        parameters.radiusTop = 30
        map_camera.zoom = map_controls.minZoom
    }
    beam.geometry = createCylinder(parameters)
    mapCameraLookAt(position)
    map_controlsChange()
    map_renderer.setSize(divOuputMap.clientWidth, divOuputMap.clientHeight);
})

// event scroll mouse to zoom
function onScroll(event) {
    event.preventDefault()
    let temp = parseInt(slider.value)
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
    resizeBeam((this.value))
}
//add event to object
window.addEventListener("resize", onResize)

output.addEventListener("wheel", onScroll)
output.addEventListener("click", onClick)
output.addEventListener("mousemove", onMouseMove)
output.addEventListener("mousedown",function(event){
    console.log(event)
})
output.addEventListener("mouseup",(event)=>{
    console.log("up")
},false)
output.addEventListener('touchstart', (event) => {
     //event.preventDefault();
     setPickPosition(event.touches[0], output);
     onMouseMove(event.touches[0])
},false);
output.addEventListener('touchmove', (event) => {
    setPickPosition(event.touches[0], output);
    onMouseMove(event.touches[0])
});
output.addEventListener('touchend', (event)=>{
    onClick(event)
},true);

divOuputMap.addEventListener("mousemove", mapHover)
divOuputMap.addEventListener("click", mapClick)
divOuputMap.addEventListener("touchstart", (event) => {
    mapHover(event.touches[0])
})
divOuputMap.addEventListener("touchmove", (event) => {
    mapHover(event.touches[0])
})
divOuputMap.addEventListener("touchend", (event) => {
    mapClick(event.changedTouches[0])
})
divOuputMap.addEventListener("mouseleave", function (e) {
    let hoverElement = document.elementFromPoint(e.clientX, e.clientY)
    if (hoverElement.tagName == "DIV") {
        return
    }
    tooltip.classList.remove("mapActive")
    TweenLite.to(map_tooltipActive.scale, 0.5, {
        x: scaleSprite,
        y: scaleSprite,
        z: scaleSprite,
    })
})
document.querySelector(".hidePoint-control").addEventListener("click", click_hidePoint, true)

//update camera's field of view on map 

function updateBeam() {
    const beam = map_scene.getObjectByName("beam")
    const eu = new THREE.Euler()
    let numberPlus = listScene.actived.updateMiniMap
    eu.copy(camera.rotation)
    beam.rotation.y = eu.y + numberPlus
}

/**
 * Function set camera look at position
 * @param {THREE.Vector3} position 
 */
function mapCameraLookAt(position) {
    TweenLite.to(map_camera.position, 0.5, {
        x: position.x,
        z: position.z,
    })
    map_camera.updateProjectionMatrix()
    map_controls.target.set(position.x, 0, position.z)
}

function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
    //render()
}

//animation map render
function map_animate() {

    requestAnimationFrame(map_animate);
    // cube1.rotation.y += 0.01;
    map_renderer.render(map_scene, map_camera);
}

//limit pan && update scale sprites

function limitPanMap() {
    const x = map_controls.target.x
    const z = map_controls.target.z
    let shallWeUpdateAngle = false

    if (x < minX || x > maxX) {
        map_controls.target.setX(x < minX ? minX : maxX)
        map_camera.position.setX(positionX)
        shallWeUpdateAngle = true
    }
    if (z < minX || z > maxX) {
        map_controls.target.setZ(z < minX ? minX : maxX)
        map_camera.position.setZ(positionZ)
        shallWeUpdateAngle = true
    }

    if (shallWeUpdateAngle) {
        const distance = map_camera.position.distanceTo(map_controls.target)
        map_camera.position.set(
            distance * Math.sin(phi) * Math.sin(theta) + map_controls.target.x,
            distance * Math.cos(phi) + map_controls.target.y,
            distance * Math.sin(phi) * Math.cos(theta) + map_controls.target.z
        )
    }

    // Updating state
    positionX = map_camera.position.x
    positionZ = map_camera.position.z
    phi = map_controls.getPolarAngle()
    theta = map_controls.getAzimuthalAngle()
}
function handleChangeThumbActive() {
    document.querySelector(".div-thumb.active").classList.remove("active")
    const thumbActive = div_thumb.item(listScene.actived.id)
    thumbActive.classList.add("active")
    document.querySelector('.all-thumb').scrollTop = thumbActive.offsetTop;
    resizeBeam(0)
    document.getElementById("myRange").value = 1
}
/**
 * 
 * @param {THREE.CylinderGeometry().parameters} parameters 
 * @param {Number} radiusTop 
 */
function createCylinder(parameters) {
    const geometry = new THREE.CylinderGeometry(
        parameters.radiusTop,
        parameters.radiusTop,
        parameters.height,
        parameters.radialSegments,
        parameters.heightSegments,
        false,
        parameters.thetaStart,
        parameters.thetaLength)
    return geometry
}
function resizeBeam(Percentage) {
    if (Percentage > 90) return
    const beam = map_scene.getObjectByName("beam")
    const parameters = beam.geometry.parameters
    parameters.thetaLength = 1.5 - parameters.thetaLength * Percentage / 100
    parameters.thetaStart = 0 + 0.5 * Percentage / 100

    const geometry = createCylinder(beam.geometry.parameters)
    beam.geometry.dispose()
    beam.geometry = geometry
}