import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/06.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

assert(lines[0].startsWith("Time:"));
let times = lines[0].slice(5).trim().split(/\s+/).map(x => parseInt(x));
assert(lines[1].startsWith("Distance:"));
let distances = lines[1].slice(9).trim().split(/\s+/).map(x => parseInt(x));
assert(times.length === distances.length);

let part1 = 1;
for (let i = 0; i < times.length; i++) {
    let cnt = 0;
    for (let v = 1; v < times[i]; v++) {
        let d = v * (times[i] - v);
        if (d > distances[i]) {
            cnt++;
        }
    }
    part1 *= cnt;
}
console.log("Part 1:", part1);

let time = parseInt(lines[0].slice(5).replaceAll(/\s+/g, ""));
let distance = parseInt(lines[1].slice(9).replaceAll(/\s+/g, ""));
let part2 = 0;
for (let v = 1; v < time; v++) {
    let d = v * (time - v);
    if (d > distance) {
        part2++;
    }
}
console.log("Part 2:", part2);
