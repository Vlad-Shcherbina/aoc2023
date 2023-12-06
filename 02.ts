import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

const data = new TextDecoder("utf-8").decode(await Deno.readFile("data/02.in"));
const lines = data.split("\n");
if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
}

let sum = 0;
for (const line of lines) {
    const [game, sets_str] = line.split(": ");
    assert(game.startsWith("Game "));
    const game_id = parseInt(game.slice(5));
    let possible = true;
    for (const set_str of sets_str.split("; ")) {
        const color_to_cnt = new Map<string, number>();
        for (const item of set_str.split(", ")) {
            const [count, color] = item.split(" ");
            assert(!color_to_cnt.has(color));
            color_to_cnt.set(color, parseInt(count));
        }
        possible = possible &&
            (color_to_cnt.get("red") ?? 0) <= 12 &&
            (color_to_cnt.get("green") ?? 0) <= 13 &&
            (color_to_cnt.get("blue") ?? 0) <= 14;
        }
    if (possible) {
        sum += game_id;
    }
}
console.log("Part 1:", sum);
