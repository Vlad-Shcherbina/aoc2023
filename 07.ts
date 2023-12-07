import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/07.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

let card_strength = "23456789TJQKA";
let card_strength2 = "J23456789TQKA";
function hand_strength(hand: string) {
    let cnts_map = new Map<string, number>();
    for (let card of hand) {
        cnts_map.set(card, (cnts_map.get(card) ?? 0) + 1);
    }
    let cnts = [...cnts_map.values()].sort((a, b) => b - a);
    let card_strengths = [...hand].map(card => card_strength.indexOf(card));
    return [cnts, card_strengths];
}

function hand_strength2(hand: string) {
    let cnts_map = new Map<string, number>();
    for (let card of hand) {
        cnts_map.set(card, (cnts_map.get(card) ?? 0) + 1);
    }
    let j_cnt = cnts_map.get("J") ?? 0;
    let cnts = [...cnts_map].filter(([card, cnt]) => card !== "J").map(([card, cnt]) => cnt).sort((a, b) => b - a);
    if (cnts.length === 0) {
        cnts.push(0);
    }
    cnts[0] += j_cnt;
    let card_strengths = [...hand].map(card => card_strength2.indexOf(card));
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

for (let part of [1, 2]) {
    let strength_fn = part === 1 ? hand_strength : hand_strength2;
    let hands: { hand: string, bid: number, strength: number[][] }[] = lines.map(line => {
        let [hand, bid] = line.split(" ");
        return { hand, bid: parseInt(bid), strength: strength_fn(hand) };
    });

    hands.sort((a, b) => lex_cmp(a.strength, b.strength, (a, b) => lex_cmp(a, b, (a, b) => a - b)));
    let part1 = 0;
    hands.forEach((hand, i) => {
        part1 += hand.bid * (i + 1);
    });
    console.log(`Part ${part}:`, part1);
}
