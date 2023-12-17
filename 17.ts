import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/17.in"));
let lines = data.split("\n");
assert(lines.pop() === "");
let w = lines[0].length;
let h = lines.length;

type Node = { x: number, y: number, dx: number, dy: number, l: number }
function node_key(node: Node) {
  return `${node.x},${node.y},${node.dx},${node.dy},${node.l}`;
}

for (let part of [1, 2]) {
    let unvisited = new Map<string, [Node, number]>();
    let dist_to_nodes: Map<string, Node>[] = [];

    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            for (let [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
                for (let l = 0; l <= 10; l++) {
                    let node: Node = { x, y, dx, dy, l };
                    let key = node_key(node);
                    unvisited.set(key, [node, Infinity]);
                }
            }
        }
    }

    let current: Node = { x: 0, y: 0, dx: 0, dy: 0, l: part === 1 ? 0 : 4 };
    let current_dist = 0;
    while (true) {
        if (current.x === w - 1 && current.y === h - 1 && (part === 1 || current.l >= 4)) {
            console.log("Part 1:", current_dist);
            break;
        }
        for (let [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
            if (part === 2 && current.l < 4) {
                if (dx !== current.dx || dy !== current.dy) continue;
            }
            if (dx === -current.dx && dy === -current.dy) continue;
            let l = dx === current.dx && dy === current.dy ? current.l + 1 : 1;
            if (l > (part === 1 ? 3 : 10)) continue;
            let x = current.x + dx;
            let y = current.y + dy;
            if (x < 0 || x >= w || y < 0 || y >= h) continue;
            let new_node = { x: current.x + dx, y: current.y + dy, dx, dy, l };
            let dist = current_dist + parseInt(lines[y][x]);

            let key = node_key(new_node);
            if (unvisited.has(key)) {
                let [_, old_dist] = unvisited.get(key)!;
                if (dist < old_dist) {
                    if (old_dist !== Infinity) {
                        assert(dist_to_nodes[old_dist].has(key));
                        dist_to_nodes[old_dist].delete(key);
                    }
                    unvisited.set(key, [new_node, dist]);
                    dist_to_nodes[dist] = dist_to_nodes[dist] || new Map<string, number>();
                    dist_to_nodes[dist].set(key, new_node);
                }
            }
        }
        current_dist = -1;
        for (let i = 0; i < dist_to_nodes.length; i++) {
            let nodes = dist_to_nodes[i];
            if (nodes && nodes.size > 0) {
                current = nodes.values().next().value;
                current_dist = i;
                let key = node_key(current);
                unvisited.delete(key);
                nodes.delete(key);
                break;
            }
        }
        if (current_dist === -1) {
            console.log("No path found");
            break;
        }
    }
}
