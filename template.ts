import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

const data = new TextDecoder("utf-8").decode(await Deno.readFile("data/<day>.in"));
const lines = data.split("\n");
if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
}

let part1 = 42;

console.log("Part 1:", part1);
