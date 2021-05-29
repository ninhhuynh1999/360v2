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
    constructor(id, image,  name, positionOnMap,updateMiniMap =0 ,points = [], sprites = []) {
        Object.assign(this, {id, image, name,positionOnMap,updateMiniMap ,points, sprites});
        this.scene = null
        this.camera = null
    }

    async createScene(scene_controls) {
        //this.scene = scene
        const load = (t,scene_controls)=>{this.loadTexture(t,scene_controls)}
        const client_view=document.querySelector(".div-scene")
        client_view.classList.add("loading")

        const textureLoader = new THREE.TextureLoader()
        textureLoader.load(

            //resource URK
            this.image,

            //onLoad callback
            function (texture) {
               load(texture,scene_controls)
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
    zoomOut(controls){
        TweenLite.to(this.camera, 0.5, {
            zoom: 1,
            onComplete: () => {
                this.camera.updateProjectionMatrix()
                controls.target.set(0, 0, 0)
            }
        })
    }
    loadTexture(texture,scene_controls){
        const sphere = this.scene.getObjectByName("Sphere1")
        const scene = this.scene

        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = - 1;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture
        //sphere.material.envMap = texture
        sphere.material.map = texture
      
        this.zoomOut(scene_controls)
        this.appear()
        this.points.forEach(point => {
            this.addTooltip(point)
        })
    }
    getPoints() {
        return this.points
    }

}


