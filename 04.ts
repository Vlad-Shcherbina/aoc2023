import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/04.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let part1 = 0;
let part2 = 0;
let num_copies = lines.map(() => 1);
let i = 0;
for (let line of lines) {
    part2 += num_copies[i];
    let [_, parts] = line.split(": ");
    let [winning_str, my_str] = parts.split("|");
    let winning = winning_str.trim().split(/\s+/g).map(x => parseInt(x));
    let my = my_str.trim().split(/\s+/g).map(x => parseInt(x));
    let num_matches = 0;
    for (let x of my) {
        if (winning.includes(x)) {
            num_matches += 1;
        }
    }
    if (num_matches > 0) {
        part1 += 1 << (num_matches - 1);
    }
    for (let j = i + 1; j < i + 1 + num_matches; j++) {
        num_copies[j] += num_copies[i];
    }
    i += 1;
}

console.log("Part 1:", part1);
console.log("Part 2:", part2);
