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
