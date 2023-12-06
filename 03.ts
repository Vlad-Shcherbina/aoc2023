import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

const data = new TextDecoder("utf-8").decode(await Deno.readFile("data/03.in"));
const lines = data.split("\n");
if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
}

function is_symbol(i: number, j: number): boolean {
    return ((lines[i]??'').charAt(j) || '.') !== '.';
}

let part1 = 0;
let i = 0;
for (const line of lines) {
    for (const m of line.matchAll(/\d+/g)) {
        assert(m.index !== undefined);
        const j1 = m.index;
        const j2 = m.index + m[0].length;

        let good = false;
        good = good || is_symbol(i, j1 - 1) || is_symbol(i, j2);
        for (let j = j1 - 1; j <= j2; j++) {
            good = good || is_symbol(i - 1, j) || is_symbol(i + 1, j);
        }
        if (good) {
            part1 += parseInt(m[0]);
        }
    }
    i += 1;
}

console.log("Part 1:", part1);
