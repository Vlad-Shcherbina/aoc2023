import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/08.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let directions = lines[0];
let nodes = lines.slice(2).map(line => {
    // "AAA = (BBB, CCC)"
    let [name, rest] = line.split(" = (");
    assert(rest.endsWith(")"));
    rest = rest.slice(0, -1);
    let [left, right] = rest.split(", ");
    return {name, left, right};
});
let line_to_node = new Map<string, {name: string, left: string, right: string}>();
nodes.forEach(node => {
    line_to_node.set(node.name, node);
});

let part1 = 0;
let cur = 'AAA';
while (cur !== 'ZZZ') {
    let dir = directions[part1 % directions.length];
    if (dir === 'L') {
        cur = line_to_node.get(cur)!.left;
    } else if (dir === 'R') {
        cur = line_to_node.get(cur)!.right;
    } else {
        assert(false);
    }
    part1 += 1;
}
console.log("Part 1:", part1);
