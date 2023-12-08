import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

function gcd2(x: number, y: number) {
    while (y !== 0) {
        [x, y] = [y, x % y];
    }
    return x;
}

function lcm2(x: number, y: number) {
    return x * y / gcd2(x, y);
}

function lcm(...nums: number[]) {
    return nums.reduce(lcm2);
}

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

for (let part of [1, 2]) {
    let start_nodes = part == 1 ? ["AAA"] : nodes.map(node => node.name).filter(name => name.endsWith("A"));
    console.log(start_nodes);
    let is_end_node = part == 1 ? (name: string) => name === "ZZZ" : (name: string) => name.endsWith("Z");

    let lens = start_nodes.map(name => {
        let i = 0;
        let cur = name;
        while (!is_end_node(cur)) {
            let dir = directions[i % directions.length];
            if (dir === "L") {
                cur = line_to_node.get(cur)!.left;
            } else if (dir === "R") {
                cur = line_to_node.get(cur)!.right;
            } else {
                assert(false);
            }
            i += 1;
        }
        return i;
    });
    console.log(`Part ${part}:`, lcm(...lens));
}
