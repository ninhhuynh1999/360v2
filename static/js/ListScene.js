import * as THREE from 'three'
import Scene from './Scene';

export default class ListScene {
    /**
     * 
     * @param {Scene} scenes -all scene infomation
     * @param {THREE.Scene} scene -scene of THREE
     * @param {THREE.PerspectiveCamera} camera -camera map
     * @param {Number} actived -id scene is active
     * @param {Number} newActive -storage temp new id active
     * @param {THREE.Scene} map_scene -scene of THREE for map
     * @param {THREE.Sprite} activePoint -the point(THREE.Sprite) active in map
     * @param {THREE.WebGLRenderer} renderer -renderer of THREE
     * @param {[]} map_sprites -all Sprite in Map scene
     */
    constructor(scenes, scene, camera,actived =0,newActive=null,map_scene=null,activePoint=null,renderer=null,map_sprites=[]) { 
        this.scenes = scenes;   
        this.scene = scene;     
        this.camera = camera    
        this.actived = actived;        
        this.newActive = newActive; 
        this.map_scene = map_scene   
        this.activePoint = activePoint 
        this.renderer = renderer    
        this.map_sprites = map_sprites   
    }

    addScene(scene) {
        this.scenes.push(scene);
    }

    removeScene(scene) {
        this.scenes.remove(scene);
    }

    async activeScene(zoom = false) {
        if (this.newActive != null && this.newActive != this.actived) {
            let sc = this.scenes[this.actived];
            var x =  sc.destroy();
            
            // var chil = this.scene.children
            // var c = await chil.forEach(e => {
            //     this.scene.remove(e)
            // });
           
            var find = this.scenes.find(element => element.id == this.newActive)
            if(zoom){
                TweenLite.to(this.camera, 1, {
                    zoom: 3,
                    onUpdate: () => {
                        this.camera.updateProjectionMatrix()
                    },
                    onComplete: () => {
                        //point.scene.createScene()
                        x =  find.createScene();
    
                    }
                })
                TweenLite.to(this.camera, 0.5, {
                    zoom: 1,
                    onComplete: () => {
                        this.camera.updateProjectionMatrix()
                    }
                }).delay(1)
            }else{
                x =  find.createScene();
            }
            
            //x = await find.createScene();
            find.appear();
            this.actived = this.newActive;
            this.newActive = null;  
            this.changeCurrentSprite()
        }

    }

    changeCurrentSprite() {
        this.map_sprites.forEach(sprite => {
            if (sprite.userData.mapScene == this.actived) {
                let scale = sprite.scale
                console.log("change size"+ scale)
                sprite.material.map = new THREE.TextureLoader().load("/images/icons/icons8-info-active.png")
                sprite.scale.set(scale.x,scale.x,scale.x)
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
        //-4.570613350254327, y: -2.746671292670145e-14, z: 59.69907810178504
        const arr = [
            {
                point: new THREE.Vector3(0.5893866497456746, 1, 74.96576104450105),
                name: "Cổng chính trường",
                scene: 0,
            },
            {
                point: new THREE.Vector3(-4.1836143344462196,  1,  64.76574883746466),
                name: "Phòng bảo vệ cổng trước (1)",
                scene: 1,
            },
            {
                point: new THREE.Vector3(-4.170613350254327, 1,  59.69907810178504),
                name: "Phòng bảo vệ cổng trước (2)",
                scene: 2,
            },
            {
                point: new THREE.Vector3(-4.056558065291135,  1,  55.278199513554945),
                name: "Sân giữa khu C, D, Hiệu bộ (1)",
                scene: 3,
            },//x: -2.2486094134867476, y: -2.657853450700089e-14, z: 55.69907810178307
            {
                point: new THREE.Vector3(-5.3106129687846, 1,  51.34076104448941),
                name: "Sân giữa khu C, D, Hiệu bộ (2)",
                scene: 4,
            },
            {
                point: new THREE.Vector3(-4.480000305175781, 1, 27.800000000013934),
                name: "Sân giữa khu C và khu B",
                scene: 5,
            },// x: 23.71999855041504, y: -2.729066633594901e-15, z: 12.29062347412725
            {
                point: new THREE.Vector3( -23.08000068664551, 1,  14.115624237067632),
                name: "KLF (1)",
                scene: 6,
            },
            {
                point: new THREE.Vector3(19.69396315163179, 1,  -36.40166799709852),
                name: "Sân trước khu A (1)",
                scene: 7,
            },
            {
                point: new THREE.Vector3(-10.544967976550593, 1,  1.7089432774640085),
                name: "Sân trước khu A (2)",
                scene: 8,//58.195221225640616, y: 4.493770663518756e-16, z: -66.02381438857115
            }, 
            {
                point: new THREE.Vector3(-3.531319583807877, 1,  -33.65734462848801),
                name: "Sân trước khu A (3)",
                scene: 9,
            },
            {
                point: new THREE.Vector3(51.6184851196816,  5.250673804691445e-15,  -23.646932590252415),
                name: "Khu giữ xe khu E",
                scene: 10,
            },  
            {
                point: new THREE.Vector3(58.195221225640616, 1,  -66.02381438857115),
                name: "Khu E",
                scene: 11,
            },  
        ]
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

        // let geometry = new THREE.SphereGeometry(30, 32, 1, 0, 1.5, 0.2, 1.5);
        let geometry = new THREE.CylinderGeometry(30, 30, 5, 32, 10, false, 0, 1.5)

        const circle = new THREE.Mesh(geometry, material);
        circle.name = "beam"
        circle.position.y = 15
        circle.position.z = 25
        circle.position.x = 25
        this.map_scene.add(circle);

        arr.forEach(element => {
            const material2 = new THREE.SpriteMaterial({
                map: new THREE.TextureLoader().load("/images/icons/icons8-info-48.png"),
                depthWrite: false
            });
            const sprite = new THREE.Sprite(material2);
            sprite.position.copy(element.point)
            sprite.name = element.name
            sprite.scale.set(8, 8, 8)
            sprite.isPoint = true
            sprite.userData.mapScene = element.scene
            this.map_scene.add(sprite);
            sprite.onClick = () => {
                //console.log(this.scenes[element.scene].name)
                this.newActive = element.scene
                this.activeScene()
            }
            this.map_sprites.push(sprite)
        });
    }
}
