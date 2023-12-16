import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/16.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let w = lines[0].length;
let h = lines.length;

let energized = new Set<string>();
let queue: [number, number, number, number][] = [[0, 0, 1, 0]];
let visited = new Set<string>();
while (queue.length > 0) {
    let [x, y, dx, dy] = queue.pop()!;
    let key = `${x},${y},${dx},${dy}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    energized.add(`${x},${y}`);
    let c = lines[y][x];
    if (c === ".") {
        queue.push([x + dx, y + dy, dx, dy]);
    } else if (c === "/") {
        queue.push([x - dy, y - dx, -dy, -dx]);
    } else if (c === "\\") {
        queue.push([x + dy, y + dx, dy, dx]);
    } else if (c === "-") {
        if (dy === 0) {
            queue.push([x + dx, y + dy, dx, dy]);
        } else {
            queue.push([x - 1, y, -1, 0]);
            queue.push([x + 1, y, 1, 0]);
        }
    } else if (c === "|") {
        if (dx === 0) {
            queue.push([x + dx, y + dy, dx, dy]);
        } else {
            queue.push([x, y - 1, 0, -1]);
            queue.push([x, y + 1, 0, 1]);
        }
    } else {
        assert(false, c);
    }
}

console.log("Part 1:", energized.size);
