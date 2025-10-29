import Link from "./Link.js";
import Point from "./Point.js";
import SpriteManager from "./SpriteManager.js";
import { Utils } from "./utils/index.js";

export class Ragdoll {

    /** @type {CanvasRenderingContext2D | null} */
    #ctx = null;

    /** @type {Array<Point>} */
    #points = [];

    /** @type {Array<Link>} */
    #links = [];

    #then = 0;
    #floorY = 0;
    #numFrames = 0;
    #avgFps = 0;

    /**
     * 
     * @param {CanvasRenderingContext2D} context
     */
    constructor(context) {
        this.#ctx = context;

        this.#onCanvasWindowResize();

        const { points, links } = Utils.generateHumanBody(this.#ctx.canvas.width / 2, this.#ctx.canvas.height / 8, 40.0);
        this.#initPoints(points);
        this.#initLinks(links);
        this.#initSprites();

        {
            const { points, links } = Utils.generateHumanBody(this.#ctx.canvas.width / 2 - 300, this.#ctx.canvas.height / 8, 40.0);
            this.#initPoints(points);
            this.#initLinks(links);
        }
        {
            const { points, links } = Utils.generateHumanBody(this.#ctx.canvas.width / 2 + 300, this.#ctx.canvas.height / 8, 40.0);
            this.#initPoints(points);
            this.#initLinks(links);
        }

        addEventListener('resize', this.#onCanvasWindowResize.bind(this))
    }


    #initSprites() {
        SpriteManager.addSprite('head', 'kiko/head-zoomed.png');
        SpriteManager.addSprite('body', 'kiko/body.png');
        SpriteManager.addSprite('right_thigh', 'kiko/right_thigh.png');
        SpriteManager.addSprite('right_feet', 'kiko/right_feet.png');
        SpriteManager.addSprite('left_thigh', 'kiko/left_thigh.png');
        SpriteManager.addSprite('left_feet', 'kiko/left_feet.png');
        SpriteManager.addSprite('right_arm', 'kiko/right_arm.png');
        SpriteManager.addSprite('right_forearm', 'kiko/right_forearm.png');
        SpriteManager.addSprite('left_arm', 'kiko/left_arm.png');
        SpriteManager.addSprite('left_forearm', 'kiko/left_forearm.png');
    }
    /**
     * 
     * @param {Array<Point>} points 
     */
    #initPoints(points) {
        this.#points.push(
            ...points,
        );
    }

    /**
     * 
     * @param {Array<Link>} links 
     */
    #initLinks(links) {
        this.#links.push(
            ...links,
        );
    }


    async start() {
        await SpriteManager.loadAll();

        this.#then = performance.now();

        this.#animationLoop();
        // setInterval(this.#animationLoop.bind(this), 1000 / 60);
        requestAnimationFrame(this.#animationLoop.bind(this));
    }

    #animationLoop() {
        requestAnimationFrame(this.#animationLoop.bind(this));

        const now = performance.now();
        const dt = Math.min((now - this.#then) / 1000, 60 / 1000);
        this.#then = performance.now();
        this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

        // 1 frame => dt s
        // 1/dt frame => 1s
        this.#numFrames++;
        const fps = dt == 0 ? 0 : 1 / dt;
        this.#avgFps = (this.#avgFps * (this.#numFrames - 1) + fps) / (this.#numFrames);
        this.#ctx.fillStyle = "white";
        this.#ctx.font = "20px monospace"
        this.#ctx.fillText(`${Math.floor(this.#avgFps)} FPS`, 10, 40);

        // origin
        this.#ctx.fillRect(0, this.#ctx.canvas.height / 8, innerWidth, 2);

        // floor
        this.#ctx.fillRect(0, this.#floorY, innerWidth, 2);


        //---[ Physics Pass ]---------------------------------------------
        for (const point of this.#points) {
            point.applyForce({ y: 100 });
            point.update(dt);
            point.constraintFloor(this.#floorY);
        }

        for (const link of this.#links) {
            link.constrain()
        }

        // Drawing
        //---[ Wireframe Pass ]---------------------------------------------
        // Bones
        for (const link of this.#links) {
            this.#ctx.strokeStyle = "white";
            this.#ctx.lineWidth = 5;
            this.#ctx.beginPath();
            this.#ctx.moveTo(link.p0.x, link.p0.y);
            this.#ctx.lineTo(link.p1.x, link.p1.y);
            this.#ctx.stroke();
        }
        // Joints
        // for (const point of this.#points) {
        //     this.#ctx.fillStyle = "#FF5555";
        //     this.#ctx.beginPath();
        //     this.#ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
        //     this.#ctx.fill();
        // }


        //---[ Sprite Pass ]---------------------------------------------
        // Joints
        for (const point of this.#points) {
            const drawFn = point.getDrawFn();
            if (drawFn) {
                drawFn(point, this.#ctx);
            }
        }

        // Bones / skin
        for (const link of this.#links) {
            const drawFn = link.getDrawFn();
            if (drawFn) {
                drawFn(link, this.#ctx);
            }
        }
    }

    #onCanvasWindowResize() {
        this.#ctx.canvas.width = innerWidth;
        this.#ctx.canvas.height = innerHeight;
        this.#floorY = this.#ctx.canvas.height * 7 / 8;
    }
}