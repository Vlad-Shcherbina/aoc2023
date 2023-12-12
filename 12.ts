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

function count(mask: string, groups: number[]) {
    let mem = new Map<string, number>();
    function rec(mask: string, groups: number[], i: number, group_idx: number, group_pos: number) {
        let key = `${i},${group_idx},${group_pos}`;
        let cached_res = mem.get(key);
        if (cached_res !== undefined) {
            return cached_res;
        }

        if (i == mask.length) {
            if (group_idx == groups.length ||
                group_idx == groups.length - 1 && group_pos == groups[group_idx]) {
                return 1;
            }
            return 0;
        }
        let c = mask[i];
        let res = 0;
        if (c === "." || c === "?") {
            if (group_pos === 0) {
                res += rec(mask, groups, i + 1, group_idx, group_pos);
            } else if (group_idx < groups.length && group_pos === groups[group_idx]) {
                res += rec(mask, groups, i + 1, group_idx + 1, 0);
            }
        }
        if (c === "#" || c === "?") {
            if (group_idx < groups.length && group_pos < groups[group_idx]) {
                res += rec(mask, groups, i + 1, group_idx, group_pos + 1);
            }
        }
        mem.set(key, res);
        return res;
    }
    return rec(mask, groups, 0, 0, 0);
}

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/12.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let part1 = 0;
let part2 = 0;
for (let line of lines) {
    let [springs, groups_s] = line.split(" ");
    let groups = groups_s.split(",").map(x => parseInt(x));
    part1 += count(springs, groups);
    let springs2 = Array(5).fill(springs).join("?");
    let groups2 = Array(5).fill(groups).flat();
    part2 += count(springs2, groups2);
}
console.log("Part 1:", part1);
console.log("Part 2:", part2);
