import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/14.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let grid = lines.map((line => [...line]));
let w = grid[0].length;
let h = grid.length;

let part1 = 0;
for (let j = 0; j < w; j++) {
    let cnt = 0;
    for (let i = h - 1; i >= -1; i--) {
        let c = i >= 0 ? grid[i][j] : "#";
        if (c === "O") {
            grid[i][j] = ".";
            cnt += 1;
        } else if (c === "#") {
            for (let ii = i + 1; ii < i + 1 + cnt; ii++) {
                grid[ii][j] = "O";
                part1 += h - ii;
            }
            cnt = 0;
        } else {
            assert(c === ".");
        }
    }
}
console.log("Part 1:", part1);
