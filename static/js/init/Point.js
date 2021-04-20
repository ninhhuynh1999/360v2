 import * as THREE from 'three'
import Scene from '../Scene';

export default class Point {
    /**
     * 
     * @param {THREE.Vector3} position - Position of point
     * @param {String} name - name of Point
     * @param {Scene} scene - The scene is storaged in point
     */
    constructor(position,name,scene){
        this.position = position
        this.name=name
        this.scene=scene
    }
}