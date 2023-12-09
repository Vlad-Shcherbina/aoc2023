import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/09.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

function predict(xs: number[]) {
    let diffss = [xs];
    while (true) {
        let last_diffs = diffss[diffss.length - 1];
        if (last_diffs.every(x => x === 0)) {
            break;
        }
        let new_diffs = last_diffs.slice(1).map((x, i) => x - last_diffs[i]);
        diffss.push(new_diffs);
    }
    diffss[diffss.length - 1].push(0);
    for (let i = diffss.length - 1; i > 0; i--) {
        let diffs = diffss[i - 1];
        let prev_diffs = diffss[i];
        diffs.push(diffs[diffs.length - 1] + prev_diffs[prev_diffs.length - 1]);
    }
    return diffss[0][diffss[0].length - 1];
}

for (let part of [1, 2]) {
    let s = 0;
    for (let line of lines) {
        let xs = line.split(/\s+/).map(x => parseInt(x));
        if (part === 2) {
            xs.reverse();
        }
        s += predict(xs);
    }
    console.log(`Part ${part}`, s);
}
