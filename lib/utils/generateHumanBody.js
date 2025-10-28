import Link from "../Link.js";
import Point from "../Point.js";
import SpriteManager from "../SpriteManager.js";

/**
 * @param {number} center_x
 * @param {number} center_y
 * @param {number} scale
 * 
 * @returns {{
 *     points: Array<Point>
 * }}
 */
export default function _generateHumanBody(center_x, center_y, head_scale) {
    const h = head_scale;
    const points = [
        new Point(0, -h).setUpdateFn((point, dt, dir) => {       // Head     : 0
            point.y -= 20 * dt;
            point.x += 5 * dt * dir;
        }).setDrawFn((point, ctx) => {
            // ctx.fillStyle = "#FF8888";
            // ctx.beginPath();
            // ctx.arc(point.x, point.y, head_scale / 2, 0, Math.PI * 2);
            // ctx.fill();
        }),
        new Point(0, 0).setUpdateFn((point, dt, dir) => {        // Chest    : 1
            point.y -= 10 * dt;
            // move towards center x 
            const dx = center_x - point.x;
            if (dx == 0) return;
            point.x += dx / Math.abs(dx) * dt;
        }),
        new Point(0, 3 * h).setUpdateFn((point, dt, dir) => {    // Abdomen  : 2
            point.y += 8 * dt;
            point.x += 5 * dt * dir;
        }),
        // Left Body
        new Point(h / 2, h / 2).setUpdateFn((point, dt, dir) => {    // Left Shoulder : 3
            point.y += 2 * dt * dir;
            point.x += 2 * dt;
        }),
        new Point(3 * h / 2, 0).setUpdateFn((point, dt, dir) => {    // Left Elbow   : 4
            point.x += 2 * dt;
            // point.y -= 2 * dt;
        }),
        new Point(7 * h / 2, 0).setUpdateFn((point, dt, dir) => {    // Left Wrist   : 5
            if (dir < 0) {
                point.y -= 2 * dt;
            }
            point.x += 0.5 * dt;
        }).setDrawFn((point, ctx) => {
            ctx.fillStyle = "ghostwhite";
            ctx.beginPath();
            ctx.arc(point.x, point.y, head_scale / 4, 0, Math.PI * 2);
            ctx.fill();
        }),
        new Point(2 * h, 5 * h).setUpdateFn((point, dt, dir) => {    // Left Knee    : 6
            point.y -= 4 * dt;
            point.x += 2 * dt;
        }),
        new Point(2 * h, 7 * h).setUpdateFn((point, dt, dir) => {    // Left feet    : 7
            if (dir > 0) {
                point.y += 30 * dt;
            } else {
                point.y += 8 * dt;
            }
        }).setDrawFn((point, ctx) => {
            ctx.fillStyle = "ghostwhite";
            ctx.beginPath();
            ctx.arc(point.x, point.y, head_scale / 4, 0, Math.PI * 2);
            ctx.fill();
        }),
        // Right Body
        new Point(-h / 2, h / 2).setUpdateFn((point, dt, dir) => {       // Right Shoulder : 8
            point.y -= 2 * dt * dir;
            point.x -= 2 * dt;
        }),
        new Point(-3 * h / 2, 0).setUpdateFn((point, dt, dir) => {    // Right Elbow   : 9
            point.x -= 2 * dt;
            // point.y -= 2 * dt;
        }),
        new Point(-7 * h / 2, 0).setUpdateFn((point, dt, dir) => {    // Right Wrist   : 10
            if (dir < 0) {
                point.y -= 2 * dt;
            }
            point.x -= 0.5 * dt;
        }).setDrawFn((point, ctx) => {
            ctx.fillStyle = "ghostwhite";
            ctx.beginPath();
            ctx.arc(point.x, point.y, head_scale / 4, 0, Math.PI * 2);
            ctx.fill();
        }),
        new Point(-2 * h, 5 * h).setUpdateFn((point, dt, dir) => {    // Right Knee    : 11
            point.y -= 4 * dt;
            point.x -= 2 * dt;
        }),
        new Point(-2 * h, 7 * h).setUpdateFn((point, dt, dir) => {    // Right feet    : 12
            if (dir < 0) {
                point.y += 30 * dt;
            } else {
                point.y += 8 * dt;
            }
        }).setDrawFn((point, ctx) => {
            ctx.fillStyle = "ghostwhite";
            ctx.beginPath();
            ctx.arc(point.x, point.y, head_scale / 4, 0, Math.PI * 2);
            ctx.fill();
        }),
    ].map(point => {
        point.px += center_x;
        point.py += center_y;
        point.x += center_x;
        point.y += center_y;
        return point;
    });




    const links = [
        // Left Body
        new Link(points[1], points[3]), // chest to left shoulder
        new Link(points[3], points[2]), // left shoulder to abdomen
        
        new Link(points[2], points[6]).setDrawFn(({ p0, p1 }, ctx) => {
            const left_thigh = SpriteManager.getSprite('left_thigh');
            if (left_thigh) {
                const dy = p1.y - p0.y;
                const dx = p1.x - p0.x;
                const angle = Math.atan2(dy, dx);
                const w = head_scale * 1.2;
                const h = w * left_thigh.height / left_thigh.width;
                ctx.save();
                ctx.translate(p0.x, p0.y);
                ctx.rotate(angle - Math.PI / 2);
                ctx.drawImage(left_thigh, - w / 2, -head_scale * 0.5, w, h);
                ctx.restore();
            }
        }), // abdomen to left knee
        new Link(points[6], points[7]).setDrawFn(({ p0, p1 }, ctx) => {
            const left_feet = SpriteManager.getSprite('left_feet');
            if (left_feet) {
                const dy = p1.y - p0.y;
                const dx = p1.x - p0.x;
                const angle = Math.atan2(dy, dx);
                const w = head_scale * 1.0;
                const h = w * left_feet.height / left_feet.width;
                ctx.save();
                ctx.translate(p0.x, p0.y);
                ctx.rotate(angle - Math.PI / 2);
                ctx.drawImage(left_feet, - w / 2, -head_scale * 0.3, w, h);
                ctx.restore();
            }
        }), // left knee to left feet





        // Right Body
        new Link(points[1], points[8]), // chest to right shoulder
        new Link(points[8], points[2]), // right shoulder to abdomen

        new Link(points[2], points[11]).setDrawFn(({ p0, p1 }, ctx) => {
            const right_thigh = SpriteManager.getSprite('right_thigh');
            if (right_thigh) {
                const dy = p1.y - p0.y;
                const dx = p1.x - p0.x;
                const angle = Math.atan2(dy, dx);
                const w = head_scale * 1.5;
                const h = w * right_thigh.height / right_thigh.width;
                ctx.save();
                ctx.translate(p0.x, p0.y);
                ctx.rotate(angle - Math.PI / 2);
                ctx.drawImage(right_thigh, - w / 2, -head_scale * 0.5, w, h);
                ctx.restore();
            }
        }), // abdomen to right knee
        new Link(points[11], points[12]).setDrawFn(({ p0, p1 }, ctx) => {
            const right_feet = SpriteManager.getSprite('right_feet');
            if (right_feet) {
                const dy = p1.y - p0.y;
                const dx = p1.x - p0.x;
                const angle = Math.atan2(dy, dx);
                const w = head_scale * 0.8;
                const h = w * right_feet.height / right_feet.width;
                ctx.save();
                ctx.translate(p0.x, p0.y);
                ctx.rotate(angle - Math.PI / 2);
                ctx.drawImage(right_feet, - w / 2, -head_scale * 0.3, w, h);
                ctx.restore();
            }
        }), // right knee to right feet   








        new Link(points[1], points[2]).setDrawFn(({ p0, p1 }, ctx) => {
            const body = SpriteManager.getSprite('body');
            if (body) {
                const dy = p1.y - p0.y;
                const dx = p1.x - p0.x;
                const angle = Math.atan2(dy, dx);
                const w = head_scale * 2;
                const h = w * body.height / body.width;
                ctx.save();
                ctx.translate(p0.x, p0.y);
                // // ctx.rotate(0.5);
                ctx.rotate(angle - Math.PI / 2);
                // // ctx.drawImage(head,  , , w, h);
                ctx.drawImage(body, - w / 2, -head_scale * 0.3, w, h);
                ctx.restore();
            }
        }), // chest to abdomen

        new Link(points[0], points[1]).setDrawFn(({ p0, p1 }, ctx) => {
            const head = SpriteManager.getSprite('head');
            if (head) {
                const dy = p1.y - p0.y;
                const dx = p1.x - p0.x;
                const angle = Math.atan2(dy, dx);
                const w = head_scale * 2;
                const h = w * head.height / head.width;
                ctx.save();
                ctx.translate(p0.x, p0.y);
                // ctx.rotate(0.5);
                ctx.rotate(angle - Math.PI / 2);
                // ctx.drawImage(head,  , , w, h);
                ctx.drawImage(head, - w / 2, - head_scale, w, h);
                ctx.restore();
            }
        }), // Head to chest








        // HANDS



        new Link(points[3], points[4]).setDrawFn(({ p0, p1 }, ctx) => {
            const left_arm = SpriteManager.getSprite('left_arm');
            if (left_arm) {
                const dy = p1.y - p0.y;
                const dx = p1.x - p0.x;
                const angle = Math.atan2(dy, dx);
                const w = head_scale * 0.8;
                const h = w * left_arm.height / left_arm.width;
                ctx.save();
                ctx.translate(p0.x, p0.y);
                ctx.rotate(angle - Math.PI / 2);
                ctx.drawImage(left_arm, - w / 2, -head_scale * 0, w, h);
                ctx.restore();
            }
        }), // left shoulder to left elbow
        new Link(points[4], points[5]).setDrawFn(({ p0, p1 }, ctx) => {
            const left_forearm = SpriteManager.getSprite('left_forearm');
            if (left_forearm) {
                const dy = p1.y - p0.y;
                const dx = p1.x - p0.x;
                const angle = Math.atan2(dy, dx);
                const w = head_scale * 1.0;
                const h = w * left_forearm.height / left_forearm.width;
                ctx.save();
                ctx.translate(p0.x, p0.y);
                ctx.rotate(angle - Math.PI / 2);
                ctx.drawImage(left_forearm, - w / 2, -head_scale * 0, w, h);
                ctx.restore();
            }
        }), // left elbow to left wrist

        new Link(points[8], points[9]).setDrawFn(({ p0, p1 }, ctx) => {
            const right_arm = SpriteManager.getSprite('right_arm');
            if (right_arm) {
                const dy = p1.y - p0.y;
                const dx = p1.x - p0.x;
                const angle = Math.atan2(dy, dx);
                const w = head_scale * 0.8;
                const h = w * right_arm.height / right_arm.width;
                ctx.save();
                ctx.translate(p0.x, p0.y);
                ctx.rotate(angle - Math.PI / 2);
                ctx.drawImage(right_arm, - w / 2, -head_scale * 0, w, h);
                ctx.restore();
            }
        }), // right shoulder to right elbow
        new Link(points[9], points[10]).setDrawFn(({ p0, p1 }, ctx) => {
            const right_forearm = SpriteManager.getSprite('right_forearm');
            if (right_forearm) {
                const dy = p1.y - p0.y;
                const dx = p1.x - p0.x;
                const angle = Math.atan2(dy, dx);
                const w = head_scale * 1.0;
                const h = w * right_forearm.height / right_forearm.width;
                ctx.save();
                ctx.translate(p0.x, p0.y);
                ctx.rotate(angle - Math.PI / 2);
                ctx.drawImage(right_forearm, - w / 2, -head_scale * 0, w, h);
                ctx.restore();
            }
        }), // right elbow to right wrist
    ];

    // console.log('gen');

    return {
        points,
        links,
    };
}