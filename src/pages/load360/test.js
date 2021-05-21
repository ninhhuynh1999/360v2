import { Scene } from "three"

const sphereGeometry = new THREE.SphereGeometry(150, 75, 75)
const sphereMaterial = new THREE.MeshBasicMaterial()

const textureLoader = new THREE.TextureLoader()
const map = textureLoader.load('../images/anh360/1.jpg')

sphereMaterial.map = map

const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)

scene.add(sphere)

