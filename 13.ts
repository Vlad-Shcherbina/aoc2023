import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/13.in"));
let lines = data.split("\n");

function transpose(pattern: string[]) {
    let res = [];
    for (let i = 0; i < pattern[0].length; i++) {
        let line = "";
        for (let j = 0; j < pattern.length; j++) {
            line += pattern[j][i];
        }
        res.push(line);
    }
    return res;
}

function num_distinct(s1: string, s2: string) {
    let res = 0;
    assert(s1.length === s2.length);
    for (let i = 0; i < s1.length; i++) {
        if (s1[i] !== s2[i]) {
            res += 1;
        }
    }
    return res;
}

function find_hor_mirror(pattern: string[], num_smudges: number) {
    console.log();
    for (let i = 1; i < pattern.length; i++) {
        let cnt = 0;
        for (let j = 0; j < pattern.length; j++) {
            let j2 = 2 * i - 1 - j;
            if (j2 < 0 || j2 > j) continue;
            cnt += num_distinct(pattern[j], pattern[j2]);
            if (cnt > num_smudges) {
                break;
            }
        }
        console.log(i, cnt);
        if (cnt === num_smudges) {
            return i;
        }
    }
    return null;
}

function mirror_score(pattern: string[], num_smudges: number) {
    let hor_mirror = find_hor_mirror(pattern, num_smudges);
    let ver_mirror = find_hor_mirror(transpose(pattern), num_smudges);
    if (hor_mirror !== null) {
        assert(ver_mirror === null);
        return 100 * hor_mirror;
    } else {
        assert(ver_mirror !== null);
        return ver_mirror;
    }
}

let part1 = 0;
let part2 = 0;
let i = 0;
while (i < lines.length) {
    let pattern = [];
    while (lines[i] !== "") {
        pattern.push(lines[i]);
        i++;
    }
    i++;
    part1 += mirror_score(pattern, 0);
    part2 += mirror_score(pattern, 1);
}

console.log("Part 1:", part1);
console.log("Part 2:", part2);
