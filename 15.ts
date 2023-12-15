import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

function hash(s: string) {
    let x = 0;
    for (let c of s) {
        x += c.charCodeAt(0);
        x *= 17;
        x %= 256;
    }
    return x;
}

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/15.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

assert(lines.length === 1);

let part1 = 0;
for (let part of lines[0].split(",")) {
    part1 += hash(part);
}
console.log("Part 1:", part1);
