import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/18.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

for (let part of [1, 2]) {
    let x = 0;
    let y = 0;
    let perimeter = 0;
    let area = 0;
    for (let line of lines) {
        // R 6 (#70c710)
        let dist = 0;
        let dx = 0;
        let dy = 0;
        let [dir, dist_s, color] = line.split(" ");
        if (part === 1) {
            dist = parseInt(dist_s);
            if (dir === "R") {
                dx = 1;
            } else if (dir === "L") {
                dx = -1;
            } else if (dir === "U") {
                dy = -1;
            } else if (dir === "D") {
                dy = 1;
            } else {
                assert(false, dir);
            }
        } else {
            assert(color.startsWith("(#"));
            assert(color.endsWith(")"));
            color = color.slice(2, -1);
            dist = parseInt(color.slice(0, -1), 16);
            let dir = color[color.length - 1];
            if (dir === "0") {
                dx = 1;
            } else if (dir === "1") {
                dy = 1;
            } else if (dir === "2") {
                dx = -1;
            } else if (dir === "3") {
                dy = -1;
            } else {
                assert(false, dir);
            }
        }
        perimeter += dist;
        area += dist * dy * x;
        x += dx * dist;
        y += dy * dist;
    }
    assert(area > 0);
    console.log(`Part ${part}:`, area + perimeter / 2 + 1);
}
