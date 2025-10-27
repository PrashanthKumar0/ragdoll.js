
export default class Point {

    /**
     * @typedef {{(point: Point, dt: number, dir: number) => void}} UpdateFn
     * @typedef {{(point: Point, ctx: CanvasRenderingContext2D) => void}} DrawFn
     * 
     */


    /**@type {UpdateFn | null} */
    #updateFn = null;

    /**@type {DrawFn | null} */
    #drawFn = null;

    /**@type {number} */
    #frames = 0;

    /**@type {number} */
    #dir = +1;


    constructor(x, y, mass = 1.0, pinned = false) {
        this.px = x;
        this.py = y;

        this.x = x;
        this.y = y;

        this.isPinned = false || pinned;

        this.mass = mass || 1.0;

        this.force = {
            x: 0,
            y: 0,
        };
    }

    /**
     * 
     * @param {{
     *     x: number;
     *     y: number;
     * }} force 
     */
    applyForce({ x, y }) {
        this.force.x += x || 0;
        this.force.y += y || 0;
    }

    #resetForce() {
        this.force.x = 0;
        this.force.y = 0;
    }

    update(dt = 0.01) {
        if (this.isPinned) return;
        if (this.#updateFn && (typeof this.#updateFn == 'function')) {
            this.#frames++;
            if(this.#frames > 100) {
                this.#dir *= -1;
                this.#frames = 0;
            }
            this.#updateFn(this, dt, this.#dir);
        }

        // Verlet Integration.
        const ax = this.force.x / this.mass;
        const ay = this.force.y / this.mass;

        const dx = (this.x - this.px);
        const dy = (this.y - this.py);

        this.px = this.x;
        this.py = this.y;

        this.x += dx + ax * dt * dt;
        this.y += dy + ay * dt * dt;

        this.#resetForce();
    }


    /**
     * 
     * @param {UpdateFn} updateFn 
     */
    setUpdateFn(updateFn) {
        this.#updateFn = updateFn;
        return this;
    }

    /**
     * 
     * @param {DrawFn} drawFn 
     */
    setDrawFn(drawFn) {
        this.#drawFn = drawFn;
        return this;
    }
    
    /**
     * 
     * @param {DrawFn} drawFn 
     */
    getDrawFn() {
        return this.#drawFn?.bind(this);
    }

    /**
     * 
     * @param {number} floorY 
     */
    constraintFloor(floorY) {
        if (this.y > floorY) {
            const dy = this.y - this.py;
            this.y = floorY;
            this.py = floorY + dy;
        }
    }
}