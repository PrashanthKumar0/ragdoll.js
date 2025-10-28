class Sprite {
    /** @type {HTMLImageElement | null} */
    #image = null;

    /** @type {boolean} */
    #loaded = false;

    /**
     * 
     * @param {string} path 
     * @param {()=>void} onloadCallback 
     */
    constructor(path, onloadCallback) {
        this.#image = new Image();
        this.#image.src = path;
        this.#image.onload = () => {
            this.#loaded = true;
            if (onloadCallback) {
                onloadCallback();
            }
        }
    }

    /**
     * 
     * @returns {boolean}
     */
    isLoaded() {
        return this.#loaded;
    }

    /**
     * 
     * @returns {HTMLImageElement | null}
     */
    get() {
        if(!this.#loaded) return null;
        return this.#image
    }
}

export default class SpriteManager {

    /** @type {Record<string, Sprite>} */
    static #spriteMap = {};

    /**
     * 
     * @param {string} name 
     * @param {string} path 
     * 
     * @returns {Sprite}
     */
    static addSprite(name, path) {
        this.#spriteMap[name] = new Sprite(`/assets/sprites/${path}`);
    }
    
    /**
     * 
     * @param {string} name 
     * @returns 
     */
    static getSprite(name) {
        if(name in this.#spriteMap) {
            return this.#spriteMap[name].get();
        }
        return null;        
    }

    static async loadAll() {
        // will be useful to show some loading progress bar...
        // TODO: implement this later ;P im lazy for now
    }

}