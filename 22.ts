import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/22.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

type Brick = {
    x1: number;
    y1: number;
    z1: number;
    x2: number;
    y2: number;
    z2: number;
}

let bricks: Brick[] = [];
for (let line of lines) {
    // "6,9,184~8,9,184"
    let [p1, p2] = line.split("~");
    let [x1, y1, z1] = p1.split(",").map(Number);
    let [x2, y2, z2] = p2.split(",").map(Number);
    bricks.push({x1, y1, z1, x2, y2, z2});
}

let supports: Set<number>[] = bricks.map(_ => new Set());
let supported_by: Set<number>[] = bricks.map(_ => new Set());

let hmap = new Map<string, [number, number]>();
bricks.sort((a, b) => a.z1 - b.z1);
bricks.forEach(({x1, y1, z1, x2, y2, z2}, i) => {
    assert(x2 >= x1);
    assert(y2 >= y1);
    assert(z2 >= z1);
    let max_z = 0;
    for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
            let key = `${x},${y}`;
            let [z, _j] = hmap.get(key) ?? [0, -1];
            max_z = Math.max(max_z, z);
        }
    }
    assert(z1 > max_z);
    for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
            let key = `${x},${y}`;
            let [z, j] = hmap.get(key) ?? [0, -1];
            if (z == max_z && j != -1) {
                supports[j].add(i);
                supported_by[i].add(j);
            }
            hmap.set(key, [max_z + z2 - z1 + 1, i]);
        }
    }
});

let part1 = 0;
supports.forEach(js => {
    if ([...js].every(j => supported_by[j].size > 1)) {
        part1 += 1;
    }
});
console.log("Part 1:", part1);

let part2 = 0;
for (let i = 0; i < bricks.length; i++) {
    let disintegrated = Array(bricks.length).fill(false);
    disintegrated[i] = true;
    let queue = [i];
    while (queue.length > 0) {
        let i = queue.pop()!;
        for (let j of supports[i]) {
            if ([...supported_by[j]].every(j => disintegrated[j])) {
                if (!disintegrated[j]) {
                    disintegrated[j] = true;
                    queue.push(j);
                    part2 += 1;
                }
            }
        }
    }
}
console.log("Part 2:", part2);