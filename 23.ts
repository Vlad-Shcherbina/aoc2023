// Run as
//   deno run --allow-read --v8-flags=--stack-size=10000 23.ts

import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/23.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let w = lines.length;
let h = lines[0].length;

let visited = Array.from({ length: w }, () => new Array(h).fill(false));
visited[0][1] = true;
visited[1][1] = true;

let deltas: [number, number][] = [[0, 1], [1, 0], [0, -1], [-1, 0]];

function reachable(i: number, j: number) {
    let q: [number, number][] = [[i, j]];
    let visited2 = Array.from({ length: w }, () => new Array(h).fill(false));
    visited2[i][j] = true;
    while (q.length > 0) {
        let [i, j] = q.pop()!;
        if (i == h - 1) {
            return true;
        }
        for (let [di, dj] of deltas) {
            let i2 = i + di;
            let j2 = j + dj;
            if (visited[i2][j2] || visited2[i2][j2]) {
                continue;
            }
            if (lines[i2][j2] === "#") {
                continue;
            }
            visited2[i2][j2] = true;
            q.push([i2, j2]);
        }
    }
    return false;
}

function rec(i: number, j: number, length: number) {
    if (i === h - 1) {
        if (length > longest) {
            console.log(length, "...");
        }
        longest = Math.max(longest, length);
        return;
    }
    let c = lines[i][j];
    assert(c !== "#");
    let cnt = 0;
    for (let [di, dj] of deltas) {
        if (c === ".") {
            ;
        } else if (c === ">") {
            if (dj != 1) {
                continue;
            }
        } else if (c === "v") {
            if (di != 1) {
                continue;
            }
        } else {
            assert(false, c);
        }
        let i2 = i + di;
        let j2 = j + dj;
        if (visited[i2][j2]) {
            continue;
        }
        if (lines[i2][j2] === "#") {
            continue;
        }
        if (cnt > 0 && !reachable(i2, j2)) {
            continue;
        }
        visited[i2][j2] = true;
        rec(i2, j2, length + 1);
        visited[i2][j2] = false;
        cnt += 1;
    }
}

let start = performance.now();

let longest = 0;
rec(1, 1, 1);
console.log("Part 1:", longest);

lines = lines.map((line) => line.replace(/v|>/g, "."));
longest = 0;
rec(1, 1, 1);
console.log("Part 2:", longest);

console.log(`It took ${performance.now() - start} ms`);
