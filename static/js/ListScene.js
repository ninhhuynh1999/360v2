import * as THREE from 'three'
import Scene from './Scene';

export default class ListScene {
    /**
     * 
     * @param {Scene} scenes -all scene infomation
     * @param {THREE.Scene} scene -scene of THREE
     * @param {THREE.PerspectiveCamera} camera -camera map
     * @param {Scene} actived -id scene is active
     * @param {Number} newActive -storage temp new id active
     * @param {THREE.Scene} map_scene -scene of THREE for map
     * @param {THREE.Sprite} activePoint -the point(THREE.Sprite) active in map
     * @param {THREE.WebGLRenderer} renderer -renderer of THREE
     * @param {[]} map_sprites -all Sprite in Map scene
     * @param {OrbitControls} map_sprites -all Sprite in Map scene
     */
    constructor(scenes, scene, camera, actived, newActive = null, map_scene = null, activePoint = null, renderer = null, map_sprites = [], scene_controls = null) {
        this.scenes = scenes;
        this.scene = scene;
        this.camera = camera
        this.actived = actived;
        this.newActive = newActive;
        this.map_scene = map_scene
        this.activePoint = activePoint
        this.renderer = renderer
        this.map_sprites = map_sprites
        this.scene_controls = scene_controls
    }

    addScene(scene) {
        this.scenes.push(scene);
    }

    removeScene(scene) {
        this.scenes.remove(scene);
    }

    /**
     * 
     * @param {Boolean} zoom - if set true camera will zoom on change scene. Defaut is false 
     */
    activeScene(zoom = false) {
        if (this.newActive != null && this.newActive != this.actived.id) {

            let sc = this.actived;

            var x = sc.destroy();

            var find = this.scenes.find(element => element.id == this.newActive)
            if (zoom) {
                TweenLite.to(this.camera, 1, {
                    zoom: 3,
                    onUpdate: () => {
                        this.camera.updateProjectionMatrix()
                    },
                    onComplete: () => {
                        //point.scene.createScene()
                        x = find.createScene();
                    }
                })
                TweenLite.to(this.camera, 0.5, {
                    zoom: 1,
                    onComplete: () => {
                        this.camera.updateProjectionMatrix()
                        this.scene_controls.target.set(0, 0, 0)
                    }
                }).delay(1)
            } else {
                TweenLite.to(this.camera, 0.5, {
                    zoom: 1,
                    onComplete: () => {
                        //point.scene.createScene()
                        x = find.createScene();
                    }
                })
                TweenLite.to(this.camera, 0.5, {
                    zoom: 1,
                }).delay(0.5)
            }

            find.appear();
            this.actived = find
            this.newActive = null;
            this.changeCurrentSprite()
            this.updateBeam()
        }

    }
    updateBeam() {
        const beam = this.map_scene.getObjectByName("beam")
        const eu = new THREE.Euler()
        let numberPlus = this.actived.updateMiniMap
        //console.log(camera.rotation.y)
        eu.copy(this.camera.rotation)
        beam.rotation.y = eu.y + numberPlus
    }
    changeCurrentSprite() {
        this.map_sprites.forEach(sprite => {
            if (sprite.userData.mapScene == this.actived.id) {
                let scale = sprite.scale
                sprite.material.map = new THREE.TextureLoader().load("/images/icons/icons8-info-active.png")
                sprite.scale.set(scale.x, scale.x, scale.x)
                const beam = this.map_scene.getObjectByName("beam")
                beam.position.copy(sprite.position.clone())
                beam.position.y = -2.4
                this.activePoint = sprite
            } else {
                sprite.material.map = new THREE.TextureLoader().load("/images/icons/icons8-info-48.png")
            }
        })

        this.camera.updateProjectionMatrix()

    }

    createMap() {
        //create plane
        let geometry1 = new THREE.PlaneGeometry(150, 150, 50, 50);
        let material1 = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load("/images/map/bando.png"),
        });
        let plane = new THREE.Mesh(geometry1, material1);
        plane.name = "mapPlane"
        plane.rotation.x = - Math.PI / 2
        this.map_scene.add(plane);

        //create sprite
        let material = new THREE.MeshBasicMaterial({
            // map: texture,
            color: 'rgb(231, 240, 41)',
            transparent: true,
            opacity: 0.75,
            depthWrite: false,
        });

        let geometry = new THREE.CylinderGeometry(30, 30, 5, 32, 10, false, 0, 1.5)
        const circle = new THREE.Mesh(geometry, material);
        circle.name = "beam"
        circle.position.y = 15
        circle.position.z = 25
        circle.position.x = 25
        this.map_scene.add(circle);

        this.scenes.forEach(element => {
            const material2 = new THREE.SpriteMaterial({
                map: new THREE.TextureLoader().load("/images/icons/icons8-info-48.png"),
                depthWrite: false
            });
            const sprite = new THREE.Sprite(material2);
            sprite.position.copy(element.positionOnMap)
            sprite.name = element.id + ")" + element.name
            sprite.scale.set(8, 8, 8)
            sprite.isPoint = true
            sprite.userData.mapScene = element.id
            this.map_scene.add(sprite);
            sprite.onClick = () => {
                //console.log(this.scenes[element.scene].name)
                this.newActive = element.id
                this.activeScene()
            }
            this.map_sprites.push(sprite)
        });
    }
}
