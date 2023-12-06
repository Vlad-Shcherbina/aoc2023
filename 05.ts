import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/05.in"));
let lines = data.split("\n");

let line = lines[0];
assert(line.startsWith("seeds: "));
let seed_data = line.slice(7).trim().split(" ").map(x => parseInt(x));

for (let part of [1, 2]) {
    let ranges: [number, number][] = seed_data.map(x => [x, x + 1]);
    if (part === 2) {
        ranges = [];
        for (let i = 0; i < seed_data.length; i += 2) {
            ranges.push([seed_data[i], seed_data[i] + seed_data[i + 1]]);
        }
    }
    let i = 2;
    while (i < lines.length) {
        assert(lines[i].endsWith("map:"));
        i += 1;
        let maps: [number, number, number][] = []
        while (lines[i] !== "") {
            let parts = lines[i].split(" ").map(x => parseInt(x));
            assert(parts.length === 3);
            maps.push(parts as any);
            i += 1;
        }
        i += 1;

        let mapped: [number, number][] = [];
        let unmapped = ranges;
        for (let [dst_start, src_start, src_len] of maps) {
            let new_unmapped: [number, number][] = []
            for (let [start, end] of unmapped) {
                let before_end = Math.min(src_start, end);
                if (start < before_end) {
                    new_unmapped.push([start, before_end]);
                }
                let after_start = Math.max(src_start + src_len, start);
                if (after_start < end) {
                    new_unmapped.push([after_start, end]);
                }
                let mapped_start = Math.max(src_start, start);
                let mapped_end = Math.min(src_start + src_len, end);
                if (mapped_start < mapped_end) {
                    mapped.push([dst_start + mapped_start - src_start, dst_start + mapped_end - src_start]);
                }
            }
            unmapped = new_unmapped;
        }
        mapped.push(...unmapped);
        ranges = mapped;
    }
    let starts = ranges.map(x => x[0]);
    console.log(`Part ${part}:`, Math.min(...starts));
}
