import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

function hash(s: string) {
    let x = 0;
    for (let c of s) {
        x += c.charCodeAt(0);
        x *= 17;
        x %= 256;
    }
    return x;
}

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/15.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

assert(lines.length === 1);

let part1 = 0;
for (let part of lines[0].split(",")) {
    part1 += hash(part);
}
console.log("Part 1:", part1);

let boxes: {label: string, focus: number}[][] = Array.from({length: 256}, () => []);
for (let part of lines[0].split(",")) {
    if (part.indexOf("=") !== -1) {
        let [label, focus_s] = part.split("=");
        let focus = parseInt(focus_s);
        let found = false;
        let box = boxes[hash(label)];
        for (let len of box) {
            if (len.label === label) {
                len.focus = focus;
                found = true;
                break;
            }
        }
        if (!found) {
            box.push({label, focus});
        }
    } else {
        assert(part.endsWith("-"));
        let label = part.slice(0, -1);
        boxes[hash(label)] = boxes[hash(label)].filter((box) => box.label !== label);
    }
}
let part2 = 0;
boxes.forEach((box, box_idx) => {
    box.forEach((len, len_idx) => {
        part2 += (box_idx + 1) * (len_idx + 1) * len.focus;
    })
});
console.log("Part 2:", part2);
