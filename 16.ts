import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/16.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let w = lines[0].length;
let h = lines.length;

function count_energized(x: number, y: number, dx: number, dy: number) {
    let energized = new Set<string>();
    let queue: [number, number, number, number][] = [[x, y, dx, dy]];
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
    return energized.size;
}

console.log("Part 1:", count_energized(0, 0, 1, 0));

let part2 = 0;
for (let x = 0; x < w; x++) {
    part2 = Math.max(part2, count_energized(x, 0, 0, 1));
    part2 = Math.max(part2, count_energized(x, h - 1, 0, -1));
}
for (let y = 0; y < h; y++) {
    part2 = Math.max(part2, count_energized(0, y, 1, 0));
    part2 = Math.max(part2, count_energized(w - 1, y, -1, 0));
}
console.log("Part 2:", part2);
