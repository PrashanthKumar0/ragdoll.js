import Point from "./Point.js";

export default class Link {

    /**
     * @typedef {{(link: Link, ctx: CanvasRenderingContext2D) => void}} DrawFn
     * 
     */


    /**@type {DrawFn | null} */
    #drawFn = null;

    /**
     * 
     * @param {Point} p0 
     * @param {Point} p1 
     * @param {number | undefined} distance 
     */
    constructor(p0, p1, distance) {
        this.p0 = p0;
        this.p1 = p1;
        this.distance = distance || Math.hypot(this.p0.x - this.p1.x, this.p0.y - this.p1.y);
    }

    constrain() {
        if (this.p0.isPinned && this.p1.isPinned) return;

        const diff_x = this.p1.x - this.p0.x;
        const diff_y = this.p1.y - this.p0.y;
        const dist = Math.hypot(diff_x, diff_y);
        if (dist != 0) {
            const dx = (diff_x) / dist;
            const dy = (diff_y) / dist;
            const diff_dist = this.distance - dist;
            if (this.p0.isPinned) {
                this.p1.x += dx * diff_dist;
                this.p1.y += dy * diff_dist;
                return;
            }
            if (this.p1.isPinned) {
                this.p0.x -= dx * diff_dist;
                this.p0.y -= dy * diff_dist;
                return;
            }

            const sum_mass = this.p0.mass + this.p1.mass;

            const fac0 = diff_dist * (sum_mass <= 0 ? 1 : this.p0.mass / sum_mass);
            const fac1 = diff_dist * (sum_mass <= 0 ? 1 : this.p1.mass / sum_mass);

            this.p0.x -= dx * fac0;
            this.p0.y -= dy * fac0;

            this.p1.x += dx * fac1;
            this.p1.y += dy * fac1;
        }
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

}