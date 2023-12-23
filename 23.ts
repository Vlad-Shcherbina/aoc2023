import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/23.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let w = lines.length;
let h = lines[0].length;

let visited = new Set<string>();
visited.add("0,1");
visited.add("1,1");
let path: [number, number][] = [[1, 1]];

let part1 = 0;
function rec() {
    let [i, j] = path[path.length - 1];
    if (i === h - 1) {
        part1 = Math.max(part1, path.length);
        return;
    }
    let c = lines[i][j];
    assert(c !== "#");
    let deltas: [number, number][];
    if (c === ".") {
        deltas = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    } else if (c === ">") {
        deltas = [[0, 1]];
    } else if (c === "v") {
        deltas = [[1, 0]];
    } else {
        assert(false, c);
    }
    for (let [di, dj] of deltas) {
        let i2 = i + di;
        let j2 = j + dj;
        let key = `${i2},${j2}`;
        if (visited.has(key)) {
            continue;
        }
        if (lines[i2][j2] === "#") {
            continue;
        }
        visited.add(key);
        path.push([i2, j2]);
        rec();
        path.pop();
        visited.delete(key);
    }
}
rec();

console.log("Part 1:", part1);
