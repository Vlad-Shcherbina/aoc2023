import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/14.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

function tilt_north(grid: string[][]) {
    grid = JSON.parse(JSON.stringify(grid));
    let w = grid[0].length;
    let h = grid.length;
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
                }
                cnt = 0;
            } else {
                assert(c === ".");
            }
        }
    }
    return grid;
}

function rot_clockwise(grid: string[][]) {
    let w = grid[0].length;
    let h = grid.length;
    let new_grid = [];
    for (let j = 0; j < w; j++) {
        let row = [];
        for (let i = 0; i < h; i++) {
            row.push(grid[h - 1 - i][j]);
        }
        new_grid.push(row);
    }
    return new_grid;
}

function spin_cycle(grid: string[][]) {
    for (let i = 0; i < 4; i++) {
        grid = tilt_north(grid);
        grid = rot_clockwise(grid);
    }
    return grid;
}

function total_load(grid: string[][]) {
    let w = grid[0].length;
    let h = grid.length;
    let res = 0;
    for (let i = 0; i < h; i++) {
        for (let c of grid[i]) {
            if (c === "O") {
                res += h - i;
            }
        }
    }
    return res
}

let grid = lines.map((line => [...line]));

console.log("Part 1:", total_load(tilt_north(grid)));

let period = 0;
let tortoise = grid;
let hare = grid;
while (true) {
    tortoise = spin_cycle(tortoise);
    hare = spin_cycle(spin_cycle(hare));
    period += 1;
    if (JSON.stringify(tortoise) === JSON.stringify(hare)) {
        break;
    }
}
let n = 1000000000;
assert(n >= period);
for (let i = 0; i < n % period; i++) {
    tortoise = spin_cycle(tortoise);
}
console.log("Part 2:", total_load(tortoise));
