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

function find_hor_mirror(pattern: string[]) {
    let line_to_id = new Map<string, number>();
    let ids = pattern.map(line => {
        if (line_to_id.has(line)) {
            return line_to_id.get(line);
        } else {
            let id = line_to_id.size;
            line_to_id.set(line, id);
            return id;
        }
    });
    for (let i = 1; i < ids.length; i++) {
        let good = true;
        for (let j = 0; j < ids.length; j++) {
            let j2 = 2 * i - 1 - j;
            if (j2 < 0 || j2 >= ids.length) continue;
            if (ids[j] !== ids[j2]) {
                good = false;
                break;
            }
        }
        if (good) {
            return i;
        }
    }
    return null;
}

let part1 = 0;
let i = 0;
while (i < lines.length) {
    let pattern = [];
    while (lines[i] !== "") {
        pattern.push(lines[i]);
        i++;
    }
    let hor_mirror = find_hor_mirror(pattern);
    if (hor_mirror !== null) {
        part1 += 100 * hor_mirror;
    }
    let ver_mirror = find_hor_mirror(transpose(pattern));
    if (ver_mirror !== null){
        part1 += ver_mirror;
    }
    i++;
}

console.log("Part 1:", part1);
