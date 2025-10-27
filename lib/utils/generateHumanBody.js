import Link from "../Link.js";
import Point from "../Point.js";

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
            ctx.fillStyle = "#FF8888";
            ctx.beginPath();
            ctx.arc(point.x, point.y, head_scale / 2, 0, Math.PI * 2);
            ctx.fill();
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
        new Point(h / 2, 0).setUpdateFn((point, dt, dir) => {    // Left Shoulder : 3
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
        new Point(-h / 2, 0).setUpdateFn((point, dt, dir) => {       // Right Shoulder : 8
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
        new Link(points[0], points[1]), // Head to chest
        new Link(points[1], points[2]), // chest to abdomen

        // Left Body
        new Link(points[1], points[3]), // chest to left shoulder
        new Link(points[3], points[2]), // left shoulder to abdomen
        new Link(points[3], points[4]), // left shoulder to left elbow
        new Link(points[4], points[5]), // left elbow to left wrist
        new Link(points[2], points[6]), // abdomen to left knee
        new Link(points[6], points[7]), // left knee to left feet

        // Right Body
        new Link(points[1], points[8]), // chest to right shoulder
        new Link(points[8], points[2]), // right shoulder to abdomen
        new Link(points[8], points[9]), // right shoulder to right elbow
        new Link(points[9], points[10]), // right elbow to right wrist
        new Link(points[2], points[11]), // abdomen to right knee
        new Link(points[11], points[12]), // right knee to right feet        
    ];

    // console.log('gen');

    return {
        points,
        links,
    };
}