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
            if (j2 < 0 || j2 >= pattern.length) continue;
            cnt += num_distinct(pattern[j], pattern[j2]);
            if (cnt > 2 * num_smudges) {
                break;
            }
        }
        console.log(i, cnt);
        if (cnt === 2 * num_smudges) {
            return i;
        }
    }
    return null;
}

let part2 = 0;
let i = 0;
while (i < lines.length) {
    let pattern = [];
    while (lines[i] !== "") {
        pattern.push(lines[i]);
        i++;
    }
    let hor_mirror = find_hor_mirror(pattern, 1);
    if (hor_mirror !== null) {
        part2 += 100 * hor_mirror;
    }
    let ver_mirror = find_hor_mirror(transpose(pattern), 1);
    if (ver_mirror !== null) {
        part2 += ver_mirror;
    }
    i++;
}

console.log("Part 2:", part2);
