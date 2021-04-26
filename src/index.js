
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TweenLite } from 'gsap/TweenLite.js'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import ListScene from '../static/js/ListScene.js'
import Scene from '../static/js/Scene.js'

import './style.css'

// declared variables
// let output //output of main scene
// let scene, camera, renderer, controls, sphere //property mine scene
// let divOuputMap, map_output //output of map scene
// let map_scene, map_camera, map_renderer, map_controls //property of map scene
// let aspect

//tooltip
const tooltip = document.querySelector('.tooltip')
let tooltipActive = false
let map_tooltipActive = false


//init scene
const output = document.querySelector('#output')
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
//document.body.appendChild(renderer.domElement)

//Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableRotate = true
controls.autoRotate = false
controls.enableKeys = true
controls.enableDamping = true
// controls.dampingFactor = 0.04;
controls.keys = {
    LEFT: 37, //left arrow
    UP: 38, // up arrow
    RIGHT: 39, // right arrow
    BOTTOM: 40 // down arrow
}
controls.enableZoom = true


// create the sphere
const sphereGeo = new THREE.SphereGeometry(150, 75, 75)
const textureLoader = new THREE.TextureLoader()
let textureEquirec = textureLoader.load('/images/anh360/congtruong.jpg');
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


//const sphereGeo = new THREE.IcosahedronGeometry(150, 75)
//const texture = textureLoader.load("/images/anh360/congtruong.jpg")
// texture.wrapS = THREE.RepeatWrapping;
// texture.repeat.x = - 1;
// const sphereMaterial = new THREE.MeshBasicMaterial({
//     map: texture,
//     side: THREE.BackSide,
//     transparent: true,
//     // wireframe: true
// })

//setup map

const divOuputMap = document.querySelector(".map")
const map_output = document.querySelector("#output-map")
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


// map_controls.
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

//create healper XYZ axes
// const axesHelper = new THREE.AxesHelper( 500 );
// map_scene.add( axesHelper );


document.body.onload = animate()
map_animate();


//init all scene

// s0: 4.9475004391
// s1: 2.717005048570
//-22.75123720584515, -1.1683045789250301e-14, 52.6157606630201
const s0 = new Scene(0, "/images/anh360/congtruong.jpg", camera, "Ngoài cổng", scene, new THREE.Vector3(0.5893866497456746, 1, 74.96576104450105), 4.9475004391)
const s1 = new Scene(1, "/images/anh360/truoc-khu-c/vao-cong.jpg", camera, "Vào cổng", scene, new THREE.Vector3(-4.1836143344462196, 1, 64.76574883746466), 2.717005048570)
const s2 = new Scene(2, "/images/anh360/truoc-khu-c/giua-hb-d(0).jpg", camera, "Giữa khu HB và Khu C (1)", scene, new THREE.Vector3(-4.170613350254327, 1, 59.69907810178504),)
const s3 = new Scene(3, "/images/anh360/truoc-khu-c/giua-hb-d.jpg", camera, "Giữa khu HB và Khu C (2)", scene, new THREE.Vector3( -4.1712394946635062,1, 52.18576295183792),)
const s4 = new Scene(4, "/images/anh360/truoc-khu-c/truoc-khu-d.jpg", camera, "Trước khu D", scene, new THREE.Vector3(14.59200559381937, 1, 52.186303499582436),)
const s5 = new Scene(5, "/images/anh360/truoc-khu-c/truoc-khu-hb.jpg", camera, "Trước khu HB", scene, new THREE.Vector3(-22.75123720584515, 1, 52.6157606630201),)
//
const s6 = new Scene(6, "/images/anh360/giua-khu-c-b/khu-c-nhin-khu-b.jpg", camera, "Sân giữa khu B và khu C (1)", scene, new THREE.Vector3(-4.480000305175781, 1, 27.800000000013934),)
const s7 = new Scene(7, "/images/anh360/giua-khu-c-b/giua-san-c-b.jpg", camera, "Sân giữa khu B và khu C (2)", scene, new THREE.Vector3(-4.4872451411697476, 1, 14.526740464849158),)
const s8 = new Scene(8, "/images/anh360/giua-khu-c-b/truoc-klf.jpg", camera, "Sân giữa khu B và khu C (3)", scene, new THREE.Vector3(-23.08000068664551, 1, 14.115624237067632),)
const s9 = new Scene(9, "/images/anh360/giua-khu-c-b/khu-b-nhin-khu-c.jpeg", camera, "Sân giữa khu B và khu C (4)", scene, new THREE.Vector3(-10.544967976550593, 1, 1.7089432774640085),)
//
const s10 = new Scene(10, "/images/anh360/giua-khu-b-a/anh loi.jpg", camera, "Sân giữa khu B và khu A (1)", scene, new THREE.Vector3(-3.3396058310161347, 1, -14.12074311158788),)
const s11 = new Scene(11, "/images/anh360/giua-khu-b-a/truoc-trung-tam-khao-thi.jpg", camera, "Trước trung tam khảo thí (1)", scene, new THREE.Vector3(-17.5357713677974, 1,-14.11075508938375),)
const s12 = new Scene(12, "/images/anh360/giua-khu-b-a/san-co-truoc-cong-trinh.jpg", camera, "Trước trung tam khảo thí (2)", scene, new THREE.Vector3(-17.335770604857945, 1,-18.860755089386128),)
const s13 = new Scene(13, "/images/anh360/giua-khu-b-a/san-co-2.jpg", camera, "Trước phòng Kỹ thuật và bãi xe", scene, new THREE.Vector3(19.69396315163179,  3.2133038503226793e-15, -14.171434022941398),)
const s14 = new Scene(14, "/images/anh360/giua-khu-b-a/giua-khu-a-b.jpeg", camera, "Giữa khu B và khu A", scene, new THREE.Vector3(-3.5313110583807877, 1, -33.65734462848801),)
const s15 = new Scene(15, "/images/anh360/giua-khu-b-a/truoc-A016.jpeg", camera, "Trước phòng A.016", scene, new THREE.Vector3(19.69396315163179, 1, -36.40166799709852),)
const s16 = new Scene(16, "/images/anh360/giua-khu-b-a/truoc-khoa-nghe-thuat.jpg", camera, "Trước phòng A.016", scene, new THREE.Vector3(-40.059427344415866,1, -47.28202139744883),)


// const s5 = new Scene(5, "/images/anh360/klf00.jpg", camera, "Sân giữa khu C và B", scene, new THREE.Vector3(-4.480000305175781, 1, 27.800000000013934),)
// const s77 = new Scene(77, "/images/anh360/klf1.jpg", camera, "KLF1", scene, new THREE.Vector3(-23.08000068664551, 1, 14.115624237067632),)
// const s88 = new Scene(88, "/images/anh360/demo1.jpeg", camera, "KLF 3", scene, new THREE.Vector3(19.69396315163179, 1, -36.40166799709852),)
// const s99 = new Scene(99, "/images/anh360/demo2.jpeg", camera, "KLF 4", scene, new THREE.Vector3(-10.544967976550593, 1, 1.7089432774640085),)
// const s100 = new Scene(100, "/images/anh360/demo3.jpeg", camera, "KLF5", scene, new THREE.Vector3(-3.5313110583807877, 1, -33.65734462848801),)
// const s111 = new Scene(111, "/images/anh360/demo4.jpeg", camera, "KLF 6", scene, new THREE.Vector3(51.618485116, 1, -23.646932590252415),)
// const s122 = new Scene(122, "/images/anh360/demo5.jpeg", camera, "KLF 7", scene, new THREE.Vector3(58.195221225640616, 1, -66.02381438857115),)
const arr = [s0, s1, s2, s3, s4, s5, s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16 ]
//adpoint to scene
s0.addPoint({
    position: new THREE.Vector3(119.082458435241, 9.995027139237752, 90.47797014227162),
    name: 'Sân trước khu C',
    scene: s1
})
s1.addPoint({
    position: new THREE.Vector3(30.176033838123157, -13.002305167391215, 146.24525591443478),
    name: 'point 1',
    scene: s0
})
s1.addPoint(
    {
        position: new THREE.Vector3(-21.33934263449677, -42.32278476744187, -142.27033832592974),
        name: 'point 3',
        scene: s2
    })
s2.addPoint({
    position: new THREE.Vector3(44.753163404782505, -32.496030125482946, 139.26858887352665),
    name: 'point 2',
    scene: s1
})
s2.addPoint(
    {
        position: new THREE.Vector3(-21.33934263449677, -42.32278476744187, -142.27033832592974),
        name: 'point 4',
        scene: s3
    })

s3.addPoint({
    position: new THREE.Vector3(54.16116655803662, -54.144318098304836, 128.81032152202783),
    name: 'point 3',
    scene: s2
})
s3.addPoint({
    position: new THREE.Vector3(-23.943893907680973, -33.95887601280021, -144.0357495645584),
    name: 'point 5',
    scene: s4
})
// x: -147.69018649837903, y: 0.5410808296525467, z: -25.84154589710276
s4.addPoint({
    position: new THREE.Vector3(33.45948536425804, -45.80581727492222, 140.7094528967363),
    name: 'point 4',
    scene: s3
})
s4.addPoint({
    position: new THREE.Vector3(-29.42812748650526, -13.01688911229736, -146.3487597659631),
    name: 'Sân giữa khu C và khu B',
    scene: s5
})

s5.addPoint({
    position: new THREE.Vector3(-149.8530967187371, 3.718728659253739, 2.142723908717267),
    name: 'Sân trước của Khu D',
    scene: s4
})
s6.addPoint({
    position: new THREE.Vector3(-148.1852076913117, -4.71747710395728, -21.964122276485334),
    name: 'Sân giữa khu C và khu BB',
    scene: s5
})
// s7.addPoint({
//     position: new THREE.Vector3(-148.39671217645767, -5.975249156553756, -19.869635759269965),
//     name: 'KLF (1)',
//     scene: s6
// })
// s8.addPoint({
//     position: new THREE.Vector3(-148.39671217645767, -5.975249156553756, -19.869635759269965),
//     name: 'KLF (1)',
//     scene: s6
// })
// s9.addPoint({
//     position: new THREE.Vector3(-148.39671217645767, -5.975249156553756, -19.869635759269965),
//     name: 'KLF (1)',
//     scene: s6
// })
// s10.addPoint({
//     position: new THREE.Vector3(-148.39671217645767, -5.975249156553756, -19.869635759269965),
//     name: 'KLF (1)',
//     scene: s6
// })
// s11.addPoint({
//     position: new THREE.Vector3(-148.39671217645767, -5.975249156553756, -19.869635759269965),
//     name: 'KLF (1)',
//     scene: s6
// })



//add scene to ListScene
const listScene = new ListScene(arr, scene, camera)
//generate frist first scene
listScene.actived = s1
listScene.newActive = 0
listScene.activeScene()
console.log(listScene)
//init map to listScene
listScene.map_scene = map_scene
listScene.renderer = map_renderer
listScene.createMap()
listScene.changeCurrentSprite()
updateBeam()
mapCameraLookAt(listScene.activePoint.position.clone())
// DAT.GUI
// GUI.TEXT_CLOSED = "ĐÓNG"
// GUI.TEXT_OPEN = "MỞ"

//setup dat GUI
// const gui = new GUI()
// // gui.TEXT_CLOSED = "Đống"
// // gui.TEXT_OPEN = "Mở "
// const cubeFolder = gui.addFolder("Chuyển cảnh (chưa làm được)")
// let selectChange = gui.add(listScene, "newActive", { '0.Ngoài Cổng': 0, '1.Khu D': 1, "2.Sân khu B & C": 5, })
// cubeFolder.open()
// // cubeFolder.add(selectChange)

// selectChange.setValue(0)
// selectChange.name("Chọn cảnh:")
// let btChange = gui.add(listScene, "activeScene").name("Chuyển cảnh")
// cubeFolder.add(btChange)


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
    let numberPlus = listScene.actived.updateMiniMap
    // console.log(active.userDate.rotate)
    updateBeam(numberPlus)
})

//add event on camera map change
// Limits
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
// limit the pan && update camera position


// create thumbs && click event thumb 
let thumbs = [0, 4, 5] // id of scene want to show
for (var i = 0; i < thumbs.length; i++) {
    var a = listScene.scenes.find(element => element.id == thumbs[i])
    document.querySelector(".all-thumb").innerHTML += `<div  class="div-thumb"  elemtype="thumb">'
    <div class="div-thumb-img">
    <img class="img-thumb" data-sceneId="`+ a.id + `" data-title="` + a.name + `" data-ordinal="` + i + `" src="` + a.image + `" alt="Paris" style="width:100%",height:100%;>
    </div>
    </div>`
}
addEventToImgThumb()
//
function addEventToImgThumb() {
    document.querySelectorAll(".img-thumb").forEach(x => {
        const title = document.querySelector(".p-title-thumb")
        const divTitle = document.querySelector(".div-title-thumb")

        x.addEventListener("mouseover", function () {
            title.innerHTML = x.getAttribute("data-title")
            // let mul = x.getAttribute("data-ordinal")
            // let curTop = 45
            var rect = x.getBoundingClientRect();
            divTitle.style.top = (rect.top - 105 - output.getBoundingClientRect().top) + 'px'
            divTitle.style.opacity = 1
        })
        x.addEventListener("mouseout", function () {
            divTitle.style.opacity = 0
        })
        x.addEventListener("click", function () {
            let txt = x.getAttribute("data-sceneId")
            listScene.newActive = txt
            listScene.activeScene()
            mapCameraLookAt(listScene.activePoint.position.clone())

        })
        x.addEventListener("mouseup", function () {
            divTitle.style.opacity = 0
        })

    })
}

//event Mouse click on main scene
function onClick(event) {
    const rayCaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2(
        ((event.clientX) / window.innerWidth) * 2 - 1,
        - ((event.clientY) / window.innerHeight) * 2 + 1
    )
    rayCaster.setFromCamera(mouse, camera)
    let intersects = rayCaster.intersectObjects(scene.children)
    console.log(intersects)

    if (intersects.length > 0 && intersects[0].object.type == "Sprite" && intersects[0].object.onScene) {

        listScene.newActive = intersects[0].object.idScene
        listScene.activeScene(true)
        document.getElementById("myRange").value = 1
        mapCameraLookAt(listScene.activePoint.position.clone())
    }
}
//event Mouse move on main scene
function onMouseMove(event) {
    const rayCaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        - (event.clientY / window.innerHeight) * 2 + 1
    )
    rayCaster.setFromCamera(mouse, camera)
    let foundSprite = false
    let intersects = rayCaster.intersectObjects(scene.children)
    if (intersects.length > 0) {

        if (intersects[0].object.type == "Sprite") {

            tooltipActive = intersects[0].object

            let p = tooltipActive.position.clone().project(camera)
            tooltip.style.top = ((-1 * p.y + 1) * window.innerHeight / 2) + 'px'
            tooltip.style.left = ((p.x + 1) * window.innerWidth / 2) + 'px'
            tooltip.classList.add('isActive')
            tooltip.innerHTML = tooltipActive.name
            // tooltip.innerHTML = '<img src="/images/icon-info.png" alt="Girl in a jacket" width="20" height="20">'
            //curTooltip = intersects[0].object
            TweenLite.to(tooltipActive.scale, 0.5, {
                x: 10,
                y: 10,
                z: 10,
            })
            foundSprite = true
            // tooltipActive = true
        }
    }
    if (foundSprite == false && tooltipActive) {
        tooltip.classList.remove("isActive")
        TweenLite.to(tooltipActive.scale, 0.5, {
            x: 8,
            y: 8,
            z: 8,
            onComplete: () => {
                // s.camera.updateProjectionMatrix()
                //tooltip.style.display = "none"
            }
        })
        tooltipActive = false
    }
}

// mouse move on Map scene
function mapHover(event) {
    let foundSprite2 = false

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
                map_tooltipActive.scale.set(scaleSprite, scaleSprite, scaleSprite)
                map_tooltipActive.position.y = 1
                listScene.map_sprites.forEach(element => {
                    if (element.uuid != a.object.uuid) {
                        element.position.y = 1
                    }
                })
            }
            map_tooltipActive = a.object
            let p = map_tooltipActive.position.clone().project(map_camera)
            tooltip.style.top = (((-1 * p.y + 1) * divOuputMap.clientWidth) / 2 + reactMap.top-rectCanvas.y)  + 'px'
            tooltip.style.left = (((p.x + 1) * divOuputMap.clientHeight) / 2+reactMap.left - rectCanvas.left ) + 'px'
            tooltip.classList.add('mapActive')
            tooltip.innerHTML = map_tooltipActive.name
            const zoomSprite = scaleSprite + scaleSprite * 0.18
            //console.log(zoomSprite + "//" + scaleSprite)
            TweenLite.to(map_tooltipActive.scale, 0.5, {
                x: zoomSprite,
                y: zoomSprite,
                z: zoomSprite,
            })
            foundSprite2 = true
            map_tooltipActive.position.y = 2

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
    //console.log(map_tooltipActive)
    ray.setFromCamera(mouse, map_camera)
    let intersects = ray.intersectObjects(map_scene.children)
    console.log(intersects[0].point)
    if (intersects.length > 0 && intersects[0].object.type == "Sprite") {
        const position = new THREE.Vector3().copy(map_tooltipActive.position.clone())
        tooltip.classList.remove('mapActive')
        //update position camera
        map_tooltipActive.onClick()
        console.log(listScene.activePoint)
        mapCameraLookAt(position)

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
    if (element.classList.contains("active")) {
        map_camera.zoom = map_controls.minZoom
        parameters.radiusTop = 30
    } else {
        parameters.radiusTop = 15
        map_camera.zoom = map_controls.maxZoom
    }
    beam.geometry = new THREE.CylinderGeometry(
        parameters.radiusTop,
        parameters.radiusTop,
        parameters.height,
        parameters.radialSegments,
        parameters.heightSegments,
        false,
        parameters.thetaStart,
        parameters.thetaLength
    )
    mapCameraLookAt(position)
    map_controlsChange()
    map_renderer.setSize(divOuputMap.clientWidth, divOuputMap.clientHeight);
})

// event scroll mouse to zoom
function onScroll(event) {

    let temp = parseInt(slider.value)
    console.log(event.deltaY)
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
document.querySelector("#output").addEventListener("wheel", onScroll)
window.addEventListener("resize", onResize)
document.body.querySelector("#output").addEventListener("click", onClick)
document.body.querySelector("#output").addEventListener("mousemove", onMouseMove)
divOuputMap.addEventListener("mousemove", mapHover)
divOuputMap.addEventListener("click", mapClick)
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



//update camera's field of view on map 
/**
 * 
 * @param {Number} numberPlus 
 */
function updateBeam(numberPlus = 0) {
    /*
    s0: 4.9475004391
    s1: 2.717005048570
    s2: 
    s3: 
    s4: 
    s5: 
    s7: 
    s6: 
    s7: 
    s8: 
     */
    const beam = map_scene.getObjectByName("beam")
    const eu = new THREE.Euler()
    eu.copy(camera.rotation)
    beam.rotation.y = eu.y + numberPlus
    // console.log(beam.rotation.y)
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
/**
 * limit pan && update scale sprites
 */
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
