import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/19.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

type Cond = {
    attr_name: string,
    threshold: number,
    op: "<" | ">",
}

type Rule = {
    cond: Cond | null,
    dst: string,
}

let name_to_rules = new Map<string, Rule[]>();
let i = 0;
while (lines[i] !== "") {
    // "px{a<2006:qkq,m>2090:A,rfg}"
    let [name, rest] = lines[i].split("{");
    assert(rest.endsWith("}"));
    let rule_ss = rest.slice(0, -1).split(",");
    let rules: Rule[] = rule_ss.map((rule_s, i) => {
        if (i === rule_ss.length - 1) {
            assert(!rule_s.includes(":"));
            return { cond: null, dst: rule_s };
        }
        let [cond_s, dst] = rule_s.split(":");
        if (cond_s.includes("<")) {
            let [attr_name, threshold_s] = cond_s.split("<");
            return { cond: { attr_name, threshold: parseInt(threshold_s), op: "<" }, dst };
        } else if (cond_s.includes(">")) {
            let [attr_name, threshold_s] = cond_s.split(">");
            return { cond: { attr_name, threshold: parseInt(threshold_s), op: ">" }, dst };
        } else {
            assert(false, rule_s);
        }
    });
    name_to_rules.set(name, rules);
    i += 1;
}
i += 1;
let parts: Record<string, number>[] = [];
lines.slice(i).forEach((line) => {
    // "{x=787,m=2655,a=1222,s=2876}"
    assert(line.startsWith("{") && line.endsWith("}"));
    let pieces = line.slice(1, -1).split(",");
    let obj: Record<string, number> = {};
    for (let piece of pieces) {
        let [key, value_s] = piece.split("=");
        obj[key] = parseInt(value_s);
    }
    parts.push(obj);
});

let part1 = 0;
for (let part of parts) {
    let workflow = "in";
    while (true) {
        if (workflow === "A") {
            for (let k in part) {
                part1 += part[k];
            }
            break;
        }
        if (workflow === "R") {
            break;
        }
        let rules = name_to_rules.get(workflow);
        assert(rules !== undefined);
        for (let rule of rules) {
            let matches = false;
            if (rule.cond === null) {
                matches = true;
            } else if (rule.cond.op === "<") {
                matches = part[rule.cond.attr_name] < rule.cond.threshold;
            } else if (rule.cond.op === ">") {
                matches = part[rule.cond.attr_name] > rule.cond.threshold;
            }
            if (matches) {
                workflow = rule.dst;
                break;
            }
        }
    }
}
console.log("Part 1:", part1);

type Box = Record<string, [number, number]>;

function split(box: Box, cond: Cond | null): [Box | null, Box | null] {
    if (cond === null) {
        return [box, null];
    }
    if (cond.op === "<") {
        let [min, max] = box[cond.attr_name];
        if (min >= cond.threshold) {
            return [null, box];
        } else if (max <= cond.threshold) {
            return [box, null];
        } else {
            return [
                { ...box, [cond.attr_name]: [min, cond.threshold] },
                { ...box, [cond.attr_name]: [cond.threshold, max] }];
        }
    }
    if (cond.op === ">") {
        let [min, max] = box[cond.attr_name];
        if (min >= cond.threshold + 1) {
            return [box, null];
        } else if (max <= cond.threshold + 1) {
            return [null, box];
        } else {
            return [
                { ...box, [cond.attr_name]: [cond.threshold + 1, max] },
                { ...box, [cond.attr_name]: [min, cond.threshold + 1] }];
        }
    }
    assert(false);
}

let box: Box = {};
for (let a of "xmas") {
    box[a] = [1, 4001];
}
let part2 = 0;
let queue: [Box, string][] = [[box, "in"]];
while (queue.length > 0) {
    let [box, name] = queue.pop()!;
    if (name === "A") {
        let volume = 1;
        for (let k in box) {
            let [min, max] = box[k];
            volume *= max - min;
        }
        part2 += volume;
        continue;
    }
    if (name === "R") {
        continue;
    }
    for (let rule of name_to_rules.get(name)!) {
        let [box1, box2] = split(box, rule.cond);
        if (box1 !== null) {
            queue.push([box1, rule.dst]);
        }
        if (box2 === null) {
            break;
        }
        box = box2;
    }
}
console.log("Part 2:", part2);
