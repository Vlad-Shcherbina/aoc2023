import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/25.in"));
let lines = data.split("\n");
assert(lines.pop() === "");


let adj = new Map<string, string[]>();
for (let line of lines) {
    // "jqt: rhn xhk nvd"
    let [left, rights] = line.split(": ");
    for (let right of rights.split(" ")) {
        if (!adj.has(left)) {
            adj.set(left, []);
        }
        adj.get(left)!.push(right);

        if (!adj.has(right)) {
            adj.set(right, []);
        }
        adj.get(right)!.push(left);
    }
}

let nodes = [...adj.keys()];
let node_to_idx = new Map<string, number>();
nodes.forEach((node, i) => node_to_idx.set(node, i));

let adj_idx = nodes.map(node => adj.get(node)!.map(dst => node_to_idx.get(dst)!));
console.log(adj_idx);


let marked = Array(nodes.length).fill(false);
let num_marked = 0;
let num_cross_edges = 0;

function toggle(i: number) {
    let mi = marked[i] = !marked[i];
    if (mi) {
        num_marked++;
    } else {
        num_marked--;
    }
    for (let j of adj_idx[i]) {
        if (mi === marked[j]) {
            num_cross_edges--;
        } else {
            num_cross_edges++;
        }
    }
}

for (let i = 0; i < nodes.length; i++) {
    if (Math.random() < 0.5) {
        toggle(i);
    }
}
while (true) {
    let i = Math.floor(Math.random() * nodes.length);
    let old = num_cross_edges;
    toggle(i);
    if (num_cross_edges > old) {
        toggle(i);
    }
    if (num_cross_edges < old) {
        console.log(num_cross_edges);
    }
    if (num_cross_edges === 3) {
        console.log("Part 1", num_marked * (nodes.length - num_marked));
        break;
    }
}
