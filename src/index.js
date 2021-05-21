
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TweenLite } from 'gsap/TweenLite.js'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import ListScene from '../static/js/ListScene.js'
import Scene from '../static/js/Scene.js'


import './style.css'
import '../static/css/controls.css'
// declared variables
// let output //output of main scene
// let scene, camera, renderer, controls, sphere //property mine scene
// let divOuputMap, map_output //output of map scene
// let map_scene, map_camera, map_renderer, map_controls //property of map scene
// let aspect

//tooltip
const tooltip = document.querySelector('.tooltip')
const div_main1 = document.querySelector(".main1")
const output = document.querySelector('#output')
const divOuputMap = document.querySelector(".map")
const map_output = document.querySelector("#output-map")

let map_tooltipActive = false
let tooltipActive = false

//init scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(40, 40, 40)
camera.rotation.order = "YXZ";
scene.add(camera)
scene.isHidePoint = false
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
controls.enableZoom = false
controls.enablePan = false
// controls.dampingFactor = 0.04;
controls.keys = {
    LEFT: 37, //left arrow
    UP: 38, // up arrow
    RIGHT: 39, // right arrow
    BOTTOM: 40 // down arrow
}


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
//this.sphere.rotation.y = 3.9

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

//-1.635077939209397

const s0 = new Scene(0, "/images/anh360/congtruong.jpg", camera, "Ngoài cổng", scene, new THREE.Vector3(0.5893866497456746, 1, 74.96576104450105), 4.9475004391)
const s1 = new Scene(1, "/images/anh360/truoc-khu-c/vao-cong.jpg", camera, "Vào cổng", scene, new THREE.Vector3(-4.1836143344462196, 1, 64.76574883746466), 3.993400099918637)
const s2 = new Scene(2, "/images/anh360/truoc-khu-c/giua-hb-d(0).jpg", camera, "Giữa khu HB và Khu C (1)", scene, new THREE.Vector3(-4.170613350254327, 1, 59.69907810178504), 4.056037835757044)
const s3 = new Scene(3, "/images/anh360/truoc-khu-c/giua-hb-d.jpg", camera, "Giữa khu HB và Khu C (2)", scene, new THREE.Vector3(-4.1712394946635062, 1, 52.18576295183792), 3.962936954853368)
const s4 = new Scene(4, "/images/anh360/truoc-khu-c/truoc-khu-d.jpg", camera, "Trước khu D", scene, new THREE.Vector3(14.59200559381937, 1, 52.186303499582436), -4.1323269486552912)
const s5 = new Scene(5, "/images/anh360/truoc-khu-c/truoc-khu-hb.jpg", camera, "Trước khu HB", scene, new THREE.Vector3(-22.75123720584515, 1, 52.6157606630201), -0.5278661113898819)
//
const s6 = new Scene(6, "/images/anh360/giua-khu-c-b/khu-c-nhin-khu-b.jpg", camera, "Sân giữa khu B và khu C (1)", scene, new THREE.Vector3(-4.480000305175781, 1, 27.800000000013934), 3.7935468107790233)
const s7 = new Scene(7, "/images/anh360/giua-khu-c-b/giua-san-c-b.jpg", camera, "Sân giữa khu B và khu C (2)", scene, new THREE.Vector3(-4.4872451411697476, 1, 14.526740464849158), 3.8250613400611837)
const s8 = new Scene(8, "/images/anh360/giua-khu-c-b/truoc-klf.jpg", camera, "Trước KLF", scene, new THREE.Vector3(-23.08000068664551, 1, 14.115624237067632), 3.746275016855796,)
const s9 = new Scene(9, "/images/anh360/giua-khu-c-b/khu-b-nhin-khu-c.jpeg", camera, "Sân giữa khu B và khu C (3)", scene, new THREE.Vector3(-10.544967976550593, 1, 1.7089432774640085), 0.89816062827589086)
//
const s10 = new Scene(10, "/images/anh360/giua-khu-b-a/khu-b-nhin-khu-a.jpeg", camera, "Sân giữa khu B và khu A (1)", scene, new THREE.Vector3(-3.3396058310161347, 1, -14.12074311158788),)
const s11 = new Scene(11, "/images/anh360/giua-khu-b-a/truoc-trung-tam-khao-thi.jpg", camera, "Trước trung tam khảo thí (1)", scene, new THREE.Vector3(-17.5357713677974, 1, -14.11075508938375), -0.72940453778854409)
const s12 = new Scene(12, "/images/anh360/giua-khu-b-a/san-co-truoc-cong-trinh.jpg", camera, "Trước trung tam khảo thí (2)", scene, new THREE.Vector3(-17.335770604857945, 1, -18.860755089386128), 1.016515391017462)
const s13 = new Scene(13, "/images/anh360/giua-khu-b-a/san-co-2.jpg", camera, "Trước phòng Kỹ thuật và bãi xe", scene, new THREE.Vector3(19.69396315163179, 1, -14.171434022941398), 2.5640870575458819)
const s14 = new Scene(14, "/images/anh360/giua-khu-b-a/giua-khu-a-b-2.jpeg", camera, "Giữa khu B và khu A", scene, new THREE.Vector3(-3.5313110583807877, 1, -33.65734462848801), 0.7113779244342634)
const s15 = new Scene(15, "/images/anh360/giua-khu-b-a/truoc-A016.jpeg", camera, "Trước phòng A.016", scene, new THREE.Vector3(19.69396315163179, 1, -36.40166799709852), -1.4383899878200255)
const s16 = new Scene(16, "/images/anh360/giua-khu-b-a/truoc-khoa-nghe-thuat.jpg", camera, "Trước VP khoa Ngệ thuật", scene, new THREE.Vector3(-40.059427344415866, 1, -47.28202139744883), 4.1490519811884534)
//
const s17 = new Scene(17, "/images/anh360/cong-khu-e/vao-bai-xe.jpg", camera, "Bãi giữ xe khu E (1)", scene, new THREE.Vector3(41.2978812500057, 1, -16.328114631825642), 2.368653610977309715)
const s18 = new Scene(18, "/images/anh360/cong-khu-e/bai-xe-trai.jpg", camera, "Bãi giữ xe khu E (2)", scene, new THREE.Vector3(41.84788239441488, 1, -65.87811005421378), -2.2982974509295153)
const s19 = new Scene(19, "/images/anh360/cong-khu-e/cong-khu-e.jpg", camera, "Cổng khu E", scene, new THREE.Vector3(40.94069299664302, 1, -70.64192427713209), -2.2670281292993237)
const s20 = new Scene(20, "/images/anh360/cong-khu-e/truoc-khu-e.jpg", camera, "Trước Khu E", scene, new THREE.Vector3(67.03096090906818, 1, -66.71809319276714), -3.8129060654203966)
//
const s21 = new Scene(21, "/images/anh360/san-bong/san-bong-da(0).jpg", camera, "Sân bóng đá", scene, new THREE.Vector3(65.2776487434876, 1, 46.25711049148522), 2.3295666234558236)
const s22 = new Scene(22, "/images/anh360/san-bong/san-bong-ro.jpg", camera, "Sân bóng rổ", scene, new THREE.Vector3(52.920521032029576, 1, 27.582163873808565), 2.2963426989729457)

//aray of all scene
const arr = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22]
//add point to scene (position of sprite)
s0.addPoint({
    position: new THREE.Vector3(119.082458435241, 9.995027139237752, 90.47797014227162),
    scene: s1
})
s1.addPoint({
    position: new THREE.Vector3(-148.81812694586452, -0.52096241137655, -17.479650077968667),
    scene: s0
})
s1.addPoint(
    {
        position: new THREE.Vector3(147.91606892767774, -23.24395524030091, 7.6298611113481245),
        scene: s2
    })
s2.addPoint({
    position: new THREE.Vector3(-149.75523445416007, -5.346723038716707, 2.850621888385917),
    scene: s1
})
s2.addPoint(
    {
        position: new THREE.Vector3(149.5285449495513, -9.94477854762541, 1.7090881555240123),
        scene: s3
    })

s2.addPoint(
    {
        position: new THREE.Vector3(93.65609400771531, -0.19086069226432897, 117.02254605908068),
        scene: s4
    })
s2.addPoint(
    {
        position: new THREE.Vector3(81.01356464310713, -1.7533340591720101, -126.0475579974873),
        scene: s5
    })
s3.addPoint({
    position: new THREE.Vector3(-148.966064878636, -16.923834119279945, -1.3111230488109633),
    scene: s2
})
s3.addPoint({
    position: new THREE.Vector3(-0.3069320379437328, -2.5391223769809375, -149.86099936801256),
    scene: s5
})
s3.addPoint({
    position: new THREE.Vector3(-6.970251780650603, -3.867082081760203, 149.69301917034102),
    scene: s4
})

s3.addPoint({
    position: new THREE.Vector3(149.69750049582956, 6.438151652206899, 3.8039942741929216),
    scene: s6
})
s4.addPoint({
    position: new THREE.Vector3(-149.1854058235806, -11.354524288557803, 8.495716228094587),
    scene: s3
})
s5.addPoint({
    position: new THREE.Vector3(-147.39257807687608, -2.8626846304010183, -27.24068345917134),
    scene: s3
})

s5.addPoint({
    position: new THREE.Vector3(-108.6040637692513, 12.818063445457295, 102.59582371027813),
    scene: s6
})
s6.addPoint({
    position: new THREE.Vector3(149.83555603027344, -1.9361317072133806, 1.9298749802129425),
    scene: s7
})
s6.addPoint({
    position: new THREE.Vector3(-149.83211667964764, 2.709228396437713, 3.221656615476403),
    scene: s3
})
s6.addPoint({
    position: new THREE.Vector3(87.07322423294886, 0.5156327976719801, -122.01721838283987),
    scene: s8
})
s6.addPoint({
    position: new THREE.Vector3(147.4189192801223, 2.8480345365645983, -26.869026299150608),
    scene: s9
})
s7.addPoint({
    position: new THREE.Vector3(-149.88759983864128, -4.614246168004618, -0.42298935637734886),
    scene: s6
})

s7.addPoint({
    position: new THREE.Vector3(-5.0698953325023295, -4.266101295415246, -149.71411611768778),
    scene: s8
})
s7.addPoint({
    position: new THREE.Vector3(142.50490592680072, -9.889179240347442, -45.47317343171973),
    scene: s9
})
s7.addPoint({
    position: new THREE.Vector3(149.80161463632572, 3.9518889453683435, -2.1217529182323323),
    scene: s10
})

s8.addPoint({
    position: new THREE.Vector3(-94.54257756360454, -2.4600244873919004, 116.25058954627777),
    scene: s6
})
s8.addPoint({
    position: new THREE.Vector3(32.19101964565116, -3.5781744607556303, 146.33368989089124),
    scene: s7
})
s8.addPoint({
    position: new THREE.Vector3(120.58730703974211, -5.425528242803196, 88.92738027219521),
    scene: s9
})
s8.addPoint({
    position: new THREE.Vector3(115.66240009643643, 5.786877281575937, 95.11670250090945),
    scene: s10
})
s9.addPoint({
    position: new THREE.Vector3(149.4031315131067, -1.1718148074483639, -11.428547014039296),
    scene: s6
})
s9.addPoint({
    position: new THREE.Vector3(139.37651392531998, -8.0745846310535, -54.747904147530534),
    scene: s7
})
s9.addPoint({
    position: new THREE.Vector3(89.67651259288643, -10.237963905358853, 119.62690020711193),
    scene: s8
})
s9.addPoint({
    position: new THREE.Vector3(-91.44822938174059, 1.3088294026530143, -118.80845734337824),
    scene: s10
})
s10.addPoint({
    position: new THREE.Vector3(-149.77539378555917, 1.7169690211934503, -4.573025225428476),
    scene: s9
})
s10.addPoint({
    position: new THREE.Vector3(7.756807915156445, 0.9398262711222838, -149.64279488715937),
    scene: s11
})
s10.addPoint({
    position: new THREE.Vector3(36.44697312189721, 3.886526957277905, -148.3202023357695),
    scene: s12
})
s10.addPoint({
    position: new THREE.Vector3(149.58929338056498, -9.022155266075787, 5.713378339627928),
    scene: s14
})
s10.addPoint({
    position: new THREE.Vector3(-7.5540340891818705, 1.4681080448491137, 149.71118804400422),
    scene: s13
})
s11.addPoint({
    position: new THREE.Vector3(1.9732150763772738, -17.471011837955622, 148.89625877632554),
    scene: s12
})
s11.addPoint({
    position: new THREE.Vector3(-148.87804148942317, -2.7764918625970063, 58.78490186451747),
    scene: s14
})
s11.addPoint({
    position: new THREE.Vector3(-148.87804148942317, -2.7764918625970063, 58.78490186451747),
    scene: s14
})

s12.addPoint({
    position: new THREE.Vector3(50.33336770551446, 0.5446967981429189, -149.19112377996595),
    scene: s10
})

s13.addPoint({
    position: new THREE.Vector3(-149.68241370177188, -3.794794882050912, -6.138035461153658),
    scene: s10
})
s13.addPoint({
    position: new THREE.Vector3(32.92441089619419, 3.5512313864087055, -146.16083344211808),
    scene: s15
})
s13.addPoint({
    position: new THREE.Vector3(149.4661618037447, 5.867995998505368, 9.315441905033653),
    scene: s17
})

s14.addPoint({
    position: new THREE.Vector3(149.58831161044273, -9.045600097201065, 5.042923053503089),
    scene: s10
})
s14.addPoint({
    position: new THREE.Vector3(72.13332038959162, 3.891547169913153, -131.32893652232084),
    scene: s13
})
s14.addPoint({
    position: new THREE.Vector3(-58.577555451660714, -0.4076468506963832, -138.03029034680517),
    scene: s15
})
s14.addPoint({
    position: new THREE.Vector3(-30.127413017254167, 9.179735264329878, 146.53388682476552),
    scene: s16
})
s15.addPoint({
    position: new THREE.Vector3(-76.2380209449156, 5.554501791589643, -128.8814719962447),
    scene: s13
})
s15.addPoint({
    position: new THREE.Vector3(64.48419672826782, 4.438170401059122, -135.30197160293778),
    scene: s14
})

//s16
s17.addPoint({
    position: new THREE.Vector3(-25.209274148826157, 7.99157428012301, -147.52072086910786),
    scene: s18
})
s17.addPoint({
    position: new THREE.Vector3(31.701969042008947, 11.215431469209719, 146.04233795743406),
    scene: s22
})
s18.addPoint({
    position: new THREE.Vector3(-149.70908060250022, 3.0467705288839517, 6.157211427670404),
    scene: s17
})
s18.addPoint({
    position: new THREE.Vector3(147.75419143686514, -1.5187478474826157, 24.88877717695003),
    scene: s19
})
s18.addPoint({
    position: new THREE.Vector3(50.7493352284624, 4.206440520990926, 141.01107127111536),
    scene: s20
})

s19.addPoint({
    position: new THREE.Vector3(-149.3689683762136, 10.162074440684579, -6.5031629356355705),
    scene: s18
})
s20.addPoint({
    position: new THREE.Vector3(-149.04774052842845, -0.3664151103024838, 15.664065437495376),
    scene: s18
})
s21.addPoint({
    position: new THREE.Vector3(-46.23486510573507, -10.530074711379017, -142.28622689618498),
    scene: s22
})
s22.addPoint({
    position: new THREE.Vector3(35.88937827384574, -8.003002769935929, 145.27592605624386),
    scene: s21
})
s22.addPoint({
    position: new THREE.Vector3(-42.86407527175825, 4.169616768460883, -143.55265185765833),
    scene: s17
})

//add scene to ListScene 
const listScene = new ListScene(arr, scene, camera)
listScene.scene_controls = controls

//init map to listScene
listScene.map_scene = map_scene
listScene.renderer = map_renderer
listScene.createMap()

//generate frist first scene
listScene.actived = s1
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
    envMap: false
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
        gui.removeFolder("Cài đặt Cảnh")
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
    //console.log(camera.rotation.y)
    updateBeam()
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

// create thumbs && click event thumb 
listScene.scenes.forEach(element => {
    var a = element
    document.querySelector(".all-thumb").innerHTML += `<div data-name="${a.id}) ${a.name}" class="div-thumb"  elemtype="thumb">'
    <div class="div-thumb-img">
    <img class="img-thumb" alt="${a.id}) ${a.name}" data-sceneId="${a.id}" data-title="${a.name}" src="/images/thumbnails/thumb (${a.id}).png" style="width:100%",height:100%;>
    </div>
    </div>`
})

addEventToImgThumb()

function addEventToImgThumb() {
    document.querySelectorAll(".img-thumb").forEach(x => {
        const title = document.querySelector(".p-title-thumb")
        const divTitle = document.querySelector(".div-title-thumb")

        x.addEventListener("mouseover", function () {
            title.innerHTML = x.alt
            var rect = x.getBoundingClientRect();
            divTitle.style.top = (rect.top - 105 - 26 - output.getBoundingClientRect().top) + 'px'
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
        listScene.newActive = intersects[0].object.idScene
        listScene.activeScene(true)
        document.getElementById("myRange").value = 1
        mapCameraLookAt(listScene.activePoint.position.clone())
        TweenLite.to(controls.target, 0.5, {
            x: intersects[0].point.x,
            y: intersects[0].point.y,
            z: intersects[0].point.z,
        })

    }
}
//event Mouse move on main scene
console.log(scene.children)
function onMouseMove(event) {
    if (scene.isHidePoint) return
    const rayCaster = new THREE.Raycaster();
    //const main1Rect = div_main1.getBoundingClientRect()
    // let mouse = new THREE.Vector2(
    //     ((event.clientX - main1Rect.left) / div_main1.clientWidth) * 2 - 1,
    //     - ((event.clientY - main1Rect.top) / div_main1.clientHeight) * 2 + 1
    // )
    setPickPosition(event, output)
    rayCaster.setFromCamera(pickPosition, camera)
    let foundSprite = false
    let newObjectHover = false
    let intersects = rayCaster.intersectObjects(scene.children)
    if (intersects.length > 0) {
        if (intersects[0].object.type == "Sprite") {
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
                //tooltip.innerHTML += '<img src="/images/icon-info.png" alt="Girl in a jacket" width="20" height="20">'
                //curTooltip = intersects[0].object
                TweenLite.to(tooltipActive.scale, 0.5, {
                    x: 10,
                    y: 10,
                    z: 10,
                })
            }


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
                // listScene.map_sprites.forEach(element => {
                //     if (element.uuid != a.object.uuid) {
                //         element.position.y = 1
                //     }
                // })
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
    //console.log(map_tooltipActive)
    ray.setFromCamera(mouse, map_camera)
    let intersects = ray.intersectObjects(map_scene.children)
    console.log(intersects[0])
    if (intersects.length > 0 && intersects[0].object.type == "Sprite") {
        const position = new THREE.Vector3().copy(intersects[0].object.position.clone())
        tooltip.classList.remove('mapActive')
        //update position camera
        intersects[0].object.onClick()
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
document.querySelector(".hidePoint-control").addEventListener("click", click_hidePoint, true)

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
function checkHidePoint() {
    const status = document.querySelector(".hidePoint-control").getAttribute("data-status")
    if (status == "open") {
        return false
    }
    if (status == "close") {
        return true
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
    if (element.classList.contains("active")) {
        map_camera.zoom = map_controls.minZoom
        parameters.radiusTop = 30
    } else {
        parameters.radiusTop = 30
        map_camera.zoom = map_controls.minZoom
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
    event.preventDefault()
    let temp = parseInt(slider.value)
    // console.log(event.deltaY)
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
window.addEventListener("resize", onResize)

output.addEventListener("wheel", onScroll)
output.addEventListener("click", onClick)
output.addEventListener("mousemove", onMouseMove)

output.addEventListener('touchstart', (event) => {
    // prevent the window from scrolling
    event.preventDefault();
    setPickPosition(event.touches[0], output);
    onClick(event)
});

output.addEventListener('touchmove', (event) => {
    setPickPosition(event.touches[0], output);
});
output.addEventListener('touchend', clearPickPosition);

divOuputMap.addEventListener("mousemove", mapHover)
divOuputMap.addEventListener("click", mapClick)
divOuputMap.addEventListener("touchstart", (event) => {
    mapClick(event.touches[0])
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

//update camera's field of view on map 

function updateBeam() {
    const beam = map_scene.getObjectByName("beam")
    const eu = new THREE.Euler()
    let numberPlus = listScene.actived.updateMiniMap
    //console.log(camera.rotation.y)
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
