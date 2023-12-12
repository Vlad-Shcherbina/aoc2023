import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

function all_variants(mask: string): string[] {
    if (mask === "") {
        return [""];
    }
    let first = mask[0];
    let rest = mask.slice(1);
    let res = all_variants(rest);
    if (first === "?") {
        return res.map(x => "." + x).concat(res.map(x => "#" + x));
    } else {
        return res.map(x => first + x);
    }
}

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/12.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let part1 = 0;
for (let line of lines) {
    let [springs, groups_s] = line.split(" ");
    let groups = groups_s.split(",").map(x => parseInt(x));
    console.log(part1, groups);
    for (let variant of all_variants(springs)) {
        let gs = [];
        for (let m of variant.matchAll(/#+/g)) {
            gs.push(m[0].length);
        }
        if (JSON.stringify(gs) == JSON.stringify(groups)) {
            part1++;
        }
    }
}
console.log("Part 1:", part1);
