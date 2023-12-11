import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/11.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let col_factor = [...lines[0]].map(_ => 2);
let row_factor: number[] = [];
let galaxies: [number, number][] = [];
lines.forEach((line, i) => {
    let rf = 2;
    for (let j = 0; j < line.length; j++) {
        if (line.charAt(j) == '#') {
            galaxies.push([i, j]);
            rf = 1;
            col_factor[j] = 1;
        }
    }
    row_factor.push(rf);
});

let part1 = 0;
galaxies.forEach(([i1, j1], idx) => {
    galaxies.slice(idx + 1).forEach(([i2, j2]) => {
        let [ii1, ii2] = [Math.min(i1, i2), Math.max(i1, i2)]
        let [jj1, jj2] = [Math.min(j1, j2), Math.max(j1, j2)]
        for (let i = ii1; i < ii2; i++) {
            part1 += row_factor[i];
        }
        for (let j = jj1; j < jj2; j++) {
            part1 += col_factor[j];
        }
    });
});
console.log("Part 1:", part1);
