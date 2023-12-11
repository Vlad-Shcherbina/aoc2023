import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/11.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let part1 = 0;

console.log("Part 1:", part1);
