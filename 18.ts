import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/18.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let cells = new Map<string, [number, number]>();
let hor_spans = new Map<string, [number, number][]>();

let x = 0;
let y = 0;
let perimeter = 0;
for (let line of lines) {
    // R 6 (#70c710)
    let [dir, dist_s, color] = line.split(" ");
    let dist = parseInt(dist_s);
    let dx = 0;
    let dy = 0;
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
    cells.set(`${x},${y}`, [x, y]);
    perimeter += dist;
    for (let i = 0; i < dist; i++) {
        if (dy == 1) {
            if (!hor_spans.has(`${y}`)) {
                hor_spans.set(`${y}`, []);
            }
            hor_spans.get(`${y}`)!.push([x, -1]);
        } else if (dy == -1) {
            if (!hor_spans.has(`${y - 1}`)) {
                hor_spans.set(`${y - 1}`, []);
            }
            hor_spans.get(`${y - 1}`)!.push([x, 1]);
        }
        x += dx;
        y += dy;
        cells.set(`${x},${y}`, [x, y]);
    }
}

let area = 0;
for (let span of hor_spans.values()) {
    span.sort(([x1, d1], [x2, d2]) => x1 - x2);
    let inside = false;
    let last_x = -1;
    for (let [x, d] of span) {
        if (inside) {
            assert(d === -1);
            area += x - last_x;
            inside = false;
        } else {
            assert(d === 1);
            inside = true;
        }
        last_x = x;
    }
}
console.log(area);
console.log(perimeter);
console.log("Part 1:", area + perimeter / 2 + 1);

/*let min_x = Math.min(...Array.from(cells.values()).map(([x, y]) => x));
let max_x = Math.max(...Array.from(cells.values()).map(([x, y]) => x));
let min_y = Math.min(...Array.from(cells.values()).map(([x, y]) => y));
let max_y = Math.max(...Array.from(cells.values()).map(([x, y]) => y));
// console.log(min_x, max_x, min_y, max_y);

for (let x = min_x; x <= max_x; x++) {
    let line = "";
    for (let y = min_y; y <= max_y; y++) {
        if (cells.has(`${x},${y}`)) {
            line += "#";
        } else {
            line += ".";
        }
    }
    console.log(line);
}*/
