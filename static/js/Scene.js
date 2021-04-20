import TweenLite from 'gsap/TweenLite'
import * as THREE from 'three'
export default class Scene {
    /**
     * Assign the project to an employee.
     * @param {number} id -
     * @param {string} image -
     * @param {THREE.PerspectiveCamera} camera - 
     * @param {string} name - 
     * @param {THREE.Scene} scene - 
     * @param {[]} points
     * @param {[]} sprites
     */
    constructor(id, image, camera, name, scene,points=[],sprites=[]) {

        this.id = id
        this.image = image
        this.camera = camera
        this.name = name
        this.scene = scene

        this.points = points
        this.sprites = sprites
        
    }

    createScene() {
        //this.scene = scene
        // const sphereGeo = new THREE.SphereGeometry(150, 75, 75)
        const sphere = this.scene.getObjectByName("Sphere1")

        const textureLoader = new THREE.TextureLoader()
        textureLoader.load(

            //resource URK
            this.image,

            //onLoad callback
            function(texture){
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = - 1;
        sphere.material.map =  texture
            },

            //onProgress callback
            function(event){
                console.log(event)
            },
            //onError callback
            function(err){
                console.error( 'An error happened while load texture.' );
            }
        )
      
        // const sphereMaterial = new THREE.MeshBasicMaterial({
        //     map: texture,
        //     side: THREE.BackSide,
        //     transparent: true,
        //     // wireframe: true
        // })
        // sphereMaterial.transparent = true
        // this.sphere = new THREE.Mesh(sphereGeo, sphereMaterial)
        // //this.sphere.rotation.y = 3.9
        // this.sphere.name = "Sphere1"
        // this.scene.add(this.sphere)
        // this.sphere.material.transparent = false
      
        this.points.forEach(point => {
            this.addTooltip(point)
        })

    }
   
    addPoint(point) {
        this.points.push(point)
    }

    addTooltip(point) {
        let spriteMap = new THREE.TextureLoader().load("/images/icons/icon-info.png")
        let spriteMaterial = new THREE.SpriteMaterial({
            map: spriteMap,
          
        })
        let sprite = new THREE.Sprite(spriteMaterial)
        sprite.onScene = true
        sprite.name = point.name
        sprite.position.copy(point.position.clone().normalize().multiplyScalar(140))
        sprite.scale.multiplyScalar(8)
        this.scene.add(sprite)
        sprite.onClick = () => {
            this.spriteClick(sprite, point)
        }
        sprite.idScene = point.scene.id
        this.sprites.push(sprite)
    }

    spriteClick(sprite, point) {
        this.camera.zoom = this.camera.zoom >= 1 ? 1 : 1
        TweenLite.to(this.camera, 1, {
            zoom: 3,
            onStart: () => {
                //this.destroy()
            },
            onUpdate: () => {
                this.camera.updateProjectionMatrix()
            },
            onComplete: () => {
                //point.scene.createScene()
            }
        })

        TweenLite.to(this.camera, 0.5, {
            zoom: 1,
            onStart: () => {
                //this.appear()
            },
            // onUpdate: () => {
            //     this.camera.updateProjectionMatrix()
            // }, 
            onComplete: () => {
                this.camera.updateProjectionMatrix()
            }
        }).delay(1)
    }


    async destroy() {
        this.sprites.forEach((sprite) => {
            this.scene.remove(sprite)
            //  console.log("da xoa"+sprite.name)
        })
        
     
    }
    async appear() {
        
        this.sprites.forEach((sprite) => {
            sprite.scale.set(8, 8, 8)
            // console.log("da hien"+sprite.name)
        })

    }
    getPoints() {
        return this.points
    }

}
