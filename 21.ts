import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/21.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let w = lines[0].length;
let h = lines.length;

let start: [number, number] = [-1, -1];
lines.map((line, i) => {
    [...line].map((c, j) => {
        if (c === "S") {
            start = [i, j];
        }
    });
});

let zone = new Map<string, [number, number]>();
zone.set(`${start[0]},${start[1]}`, start);
for (let step = 0; step < 64; step++) {
    let new_zone = new Map<string, [number, number]>();
    for (let [_, [i, j]] of zone) {
        for (let [di, dj] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            let i2 = i + di;
            let j2 = j + dj;
            if (i2 < 0 || i2 >= h || j2 < 0 || j2 >= w) {
                continue;
            }
            if (lines[i2][j2] === "#") {
                continue;
            }
            let key = `${i2},${j2}`;
            new_zone.set(key, [i2, j2]);
        }
    }
    zone = new_zone;
}

console.log("Part 1:", zone.size);

let ns: number[] = [];
zone = new Map<string, [number, number]>();
zone.set(`${start[0]},${start[1]}`, start);
for (let step = 0; step < 2000; step++) {
    ns.push(zone.size);
    let new_zone = new Map<string, [number, number]>();
    for (let [_, [i, j]] of zone) {
        for (let [di, dj] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            let i2 = i + di;
            let j2 = j + dj;
            if (lines[(i2 + 10000 * h) % h][(j2 + 10000 * w) % w] === "#") {
                continue;
            }
            let key = `${i2},${j2}`;
            new_zone.set(key, [i2, j2]);
        }
    }
    zone = new_zone;
}
console.log(ns[0]);
let ds = ns.slice(1).map((n, i) => n - ns[i]);
console.log(ds[0]);
let ds2 = ds.slice(1).map((n, i) => n - ds[i]);
// console.log(ds2);
for (let i = 0; i < ds2.length; i += 10) {
    console.log(ds2.slice(i, i + 10).join(", "));
}
