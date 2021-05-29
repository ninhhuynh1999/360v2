import TweenLite from 'gsap/TweenLite'
import * as THREE from 'three'

export  default  class Scene {
  
    /**
     * Assign the project to an employee.
     * @param {number} id 
     * @param {string} image 
     * @param {THREE.PerspectiveCamera} camera  
     * @param {string} name  
     * @param {THREE.Scene} scene  
     * @param {[]} points
     * @param {[]} sprites
     * @param {Number} updateMiniMap
     * @param {THREE.Vector3} positionOnMap
     */
    constructor(id, image, camera, name, scene,positionOnMap,updateMiniMap =0 ,points = [], sprites = []) {

        // this.id = id
        // this.image = image
        // this.camera = camera
        // this.name = name
        // this.scene = scene
        // this.points = points
        // this.sprites = sprites
        // this.updateMiniMap = updateMiniMap
        // this.positionOnMap = positionOnMap
         
        Object.assign(this, {id, image, camera, name, scene,positionOnMap,updateMiniMap ,points, sprites});
        this.controls = null
    }

    async createScene() {
        //this.scene = scene
        const load = (t)=>{this.loadTexture(t)}
        const client_view=document.querySelector(".div-scene")
        client_view.classList.add("loading")

        const textureLoader = new THREE.TextureLoader()
        textureLoader.load(

            //resource URK
            this.image,

            //onLoad callback
            function (texture) {
               load(texture)
               client_view.classList.remove("loading")
            },

            //onProgress callback
            undefined,
            //onError callback
            function (err) {
                console.error('An error happened while load texture.');
            }
        )
        
       
        
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
        if(this.scene.isHidePoint) {
            sprite.visible = false
        }
        sprite.name = point.scene.id +") "+point.scene.name
        sprite.position.copy(point.position.clone().normalize().multiplyScalar(140))
        sprite.scale.multiplyScalar(8)
        this.scene.add(sprite)
        sprite.onClick = () => {
            this.spriteClick()
        }
        sprite.idScene = point.scene.id
        this.sprites.push(sprite)
    }

    spriteClick() {
       
    }


     destroy() {
        this.sprites.forEach((sprite) => {
            this.scene.remove(sprite)
            //  console.log("da xoa"+sprite.name)
        })


    }
    appear() {
        this.sprites.forEach((sprite) => {
            sprite.scale.set(8, 8, 8)
            // console.log("da hien"+sprite.name)
        })

    }
    zoomOut(){
        TweenLite.to(this.camera, 0.5, {
            zoom: 1,
            onComplete: () => {
                this.camera.updateProjectionMatrix()
                this.controls.enabled = true
                this.controls.target.set(0, 0, 0)
            }
        })
    }
    loadTexture(texture){
        const sphere = this.scene.getObjectByName("Sphere1")
        const scene = this.scene

        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = - 1;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture
        //sphere.material.envMap = texture
        sphere.material.map = texture
      
        this.zoomOut()
        this.appear()
        this.points.forEach(point => {
            this.addTooltip(point)
        })
    }
    getPoints() {
        return this.points
    }

}


