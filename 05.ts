import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/05.in"));
let lines = data.split("\n");

let line = lines[0];
assert(line.startsWith("seeds: "));
let seeds = line.slice(7).trim().split(" ").map(x => parseInt(x));
let i = 2;
while (i < lines.length) {
    i += 1;
    let maps: [number, number, number][] = []
    while (lines[i] !== "") {
        let parts = lines[i].split(" ").map(x => parseInt(x));
        assert(parts.length === 3);
        maps.push(parts as any);
        i += 1;
    }
    i += 1;

    for (let j = 0; j < seeds.length; j++) {
        for (let [dst_start, src_start, src_len] of maps) {
            if (seeds[j] >= src_start && seeds[j] < src_start + src_len) {
                seeds[j] = dst_start + seeds[j] - src_start;
                break;
            }
        }
    }
}
console.log("Part 1:", Math.min(...seeds));
