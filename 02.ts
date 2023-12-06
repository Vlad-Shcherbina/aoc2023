import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

const data = new TextDecoder("utf-8").decode(await Deno.readFile("data/02.in"));
const lines = data.split("\n");
if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
}

let part1 = 0;
let part2 = 0;
for (const line of lines) {
    const [game, sets_str] = line.split(": ");
    assert(game.startsWith("Game "));
    const game_id = parseInt(game.slice(5));
    const min_required = new Map<string, number>();
    for (const set_str of sets_str.split("; ")) {
        const color_to_cnt = new Map<string, number>();
        for (const item of set_str.split(", ")) {
            const [count, color] = item.split(" ");
            assert(!color_to_cnt.has(color));
            color_to_cnt.set(color, parseInt(count));
            min_required.set(color, Math.max(min_required.get(color) ?? 0, parseInt(count)));
        }
    }
    const num_red = min_required.get("red") ?? 0;
    const num_green = min_required.get("green") ?? 0;
    const num_blue = min_required.get("blue") ?? 0;
    if (num_red <= 12 && num_green <= 13 && num_blue <= 14) {
        part1 += game_id;
    }
    part2 += num_red * num_green * num_blue;
}
console.log("Part 1:", part1);
console.log("Part 2:", part2);
