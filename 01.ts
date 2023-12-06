import { assert } from "https://deno.land/std@0.208.0/assert/mod.ts";

function find_index_any_of(haystack: string, needles: string[]): number | null {
    for (let i = 0; i <= haystack.length; i++) {
        let needle_idx = 0;
        for (const needle of needles) {
            if (haystack.slice(i, i + needle.length) === needle) {
                return needle_idx;
            }
            needle_idx += 1;
        }
    }
    return null;
}

function find_last_index_any_of(haystack: string, needles: string[]): number | null {
    for (let i = haystack.length; i >= 0; i--) {
        let needle_idx = 0;
        for (const needle of needles) {
            if (haystack.slice(i, i + needle.length) === needle) {
                return needle_idx;
            }
            needle_idx += 1;
        }
    }
    return null;
}

const data = new TextDecoder("utf-8").decode(await Deno.readFile("data/01.in"));
const lines = data.split("\n");
if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
}

for (const part of [1, 2]) {
    const digits = [];
    for (let i = 0; i < 10; i++) {
        digits.push(i.toString());
    }
    if (part === 2) {
        digits.push(...["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]);
    }

    let sum = 0;
    for (const line of lines) {
        const first = find_index_any_of(line, digits);
        assert(first !== null);
        const last = find_last_index_any_of(line, digits);
        assert(last !== null);
        sum += first % 10 * 10 + last % 10;
    }
    console.log(`Part ${part}:`, sum);
}
