import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/24.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let hailstones: [[number, number, number], [number, number, number]][] = [];
for (let line of lines) {
    // "212542581053874, 357959731032403, 176793474286781 @ -88, -256, -240"
    let [p, v] = line.split(" @ ");
    let [x, y, z] = p.split(", ").map(Number);
    let [vx, vy, vz] = v.split(", ").map(Number);
    hailstones.push([[x, y, z], [vx, vy, vz]]);
}

let min = 200000000000000;
let max = 400000000000000;
// let min = 7;
// let max = 27;

let part1 = 0;
hailstones.forEach(([[x1, y1, _z1], [vx1, vy1, _vz1]], i) => {
    hailstones.slice(i + 1).forEach(([[x2, y2, _z2], [vx2, vy2, _vz2]]) => {
        // console.log();
        assert(vx1 !== 0);
        assert(vy1 !== 0);
        let d = vy2 * vx1 - vy1 * vx2;
        // console.log(x1, y1, vx1, vy1, " vs ", x2, y2, vx2, vy2, " => ", d);
        if (d === 0) {
            // console.log("collinear");
            return;
        }

        let d1 = vx1 * (x2 * vy2 - y2 * vx2) - vx2 * (x1 * vy1 - y1 * vx1);
        let d2 = vy1 * (x2 * vy2 - y2 * vx2) - vy2 * (x1 * vy1 - y1 * vx1);
        // console.log(d1 / d, d2 / d);
        if (d1 * Math.sign(d) < min * Math.abs(d) || d1 * Math.sign(d) > max * Math.abs(d)) {
            // console.log("out of x range");
            return;
        }
        if (d2 * Math.sign(d) < min * Math.abs(d) || d2 * Math.sign(d) > max * Math.abs(d)) {
            // console.log("out of y range");
            return;
        }
        if ((d1 * Math.sign(d) - x1 * Math.abs(d)) * vx1 < 0) {
            // console.log("in the past of a");
            return;
        }
        if ((d1 * Math.sign(d) - x2 * Math.abs(d)) * vx2 < 0) {
            // console.log("in the past of b");
            return;
        }
        part1 += 1;
    });
});
console.log("Part 1:", part1);
