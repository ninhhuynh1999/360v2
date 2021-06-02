export default class InfoModel {
  /**
     * @param {string} name 
     * @param {string} url 
     * @param {string} thumb 
     * @param {boolean} actived 
     * @param {boolean} inActive 
     * @param {THREE.Object3D} model
     */
    constructor(name, url, thumb, actived, inActive = false, model = null) {
        this.name = name
        this.url = url
        this.thumb = thumb
        this.actived = actived
        this.inActive = inActive
        this.model = model
    }
}