import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/04.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let part1 = 0;
for (let line of lines) {
    let [_, parts] = line.split(": ");
    let [winning_str, my_str] = parts.split("|");
    let winning = winning_str.trim().split(/\s+/g).map(x => parseInt(x));
    let my = my_str.trim().split(/\s+/g).map(x => parseInt(x));
    let score = 0;
    for (let x of my) {
        if (winning.includes(x)) {
            if (score === 0) {
                score = 1;
            } else {
                score *= 2;
            }
        }
    }
    part1 += score;
}

console.log("Part 1:", part1);
