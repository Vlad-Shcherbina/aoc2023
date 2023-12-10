import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/10.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let start_i = -1;
let start_j = -1;
lines.forEach((line, i) => {
    if (line.includes("S")) {
        start_i = i;
        start_j = line.indexOf("S");
    }
});
assert(start_i !== -1);
assert(start_j !== -1);

// Input-specific:
lines[start_i] = lines[start_i].replace("S", "|");
let di = 1;
let dj = 0;

let i = start_i + di;
let j = start_j + dj;
let len = 1;
while (i != start_i || j != start_j) {
    let dss;
    let c = lines[i][j];
    if (c == '|') {
        dss = [{ di: 1, dj: 0}, { di: -1, dj: 0}];
    } else if (c == '-') {
        dss = [{ di: 0, dj: 1}, { di: 0, dj: -1}];
    } else if (c == 'L') {
        dss = [{ di: -1, dj: 0}, { di: 0, dj: 1}];
    } else if (c == 'J') {
        dss = [{ di: -1, dj: 0}, { di: 0, dj: -1}];
    } else if (c == '7') {
        dss = [{ di: 1, dj: 0}, { di: 0, dj: -1}];
    } else if (c == 'F') {
        dss = [{ di: 1, dj: 0}, { di: 0, dj: 1}];
    } else {
        assert(false);
    }
    let idx = -1;
    dss.forEach((ds, i) => {
        if (ds.di == -di && ds.dj == -dj) {
            idx = i;
        }
    });
    assert(idx != -1);
    di = dss[1 - idx].di;
    dj = dss[1 - idx].dj;
    i += di;
    j += dj;
    len += 1;
}

console.log("Part 1:", len / 2);
