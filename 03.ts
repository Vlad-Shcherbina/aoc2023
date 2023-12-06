import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

const data = new TextDecoder("utf-8").decode(await Deno.readFile("data/03.in"));
const lines = data.split("\n");
if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
}

let gears = new Map<string, number[]>();
let part1 = 0;
let i = 0;
for (const line of lines) {
    for (const m of line.matchAll(/\d+/g)) {
        assert(m.index !== undefined);
        const j1 = m.index;
        const j2 = m.index + m[0].length;
        let part_number = parseInt(m[0]);
        let good = false;
        for (let ii = i - 1; ii <= i + 1; ii++) {
            for (let jj = j1 - 1; jj <= j2; jj++) {
                if (ii == i && jj >= j1 && jj < j2) {
                    continue;
                }
                let s = ((lines[ii] ?? "").charAt(jj) || ".");
                good = good || s !== ".";
                if (s == "*") {
                    let key = `${ii},${jj}`;
                    let parts = gears.get(key) ?? [];
                    parts.push(part_number);
                    gears.set(key, parts);
                }
            }
        }
        if (good) {
            part1 += part_number;
        }
    }
    i += 1;
}
console.log("Part 1:", part1);

let part2 = 0;
for (const [_, parts] of gears.entries()) {
    if (parts.length === 2) {
        part2 += parts[0] * parts[1];
    }
}
console.log("Part 2:", part2);
