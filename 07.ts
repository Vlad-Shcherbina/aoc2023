import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/07.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let card_strength = "23456789TJQKA";
function hand_strength(hand: string) {
    let cnts_map = new Map<string, number>();
    for (let card of hand) {
        cnts_map.set(card, (cnts_map.get(card) ?? 0) + 1);
    }
    let cnts = [...cnts_map.values()].sort((a, b) => b - a);
    let card_strengths = [...hand].map(card => card_strength.indexOf(card));
    return [cnts, card_strengths];
}

function lex_cmp<T>(a: T[], b: T[], cmp: (a: T, b: T) => number) {
    for (let i = 0; i < a.length && i < b.length; i++) {
        let c = cmp(a[i], b[i]);
        if (c !== 0) {
            return c;
        }
    }
    return a.length - b.length;
}

let hands: { hand: string, bid: number, strength: number[][] }[] = lines.map(line => {
    let [hand, bid] = line.split(" ");
    return { hand, bid: parseInt(bid), strength: hand_strength(hand) };
});
hands.sort((a, b) => lex_cmp(a.strength, b.strength, (a, b) => lex_cmp(a, b, (a, b) => a - b)));

let part1 = 0;
hands.forEach((hand, i) => {
    part1 += hand.bid * (i + 1);
});
console.log("Part 1:", part1);
