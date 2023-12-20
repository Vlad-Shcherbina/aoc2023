import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

let data = new TextDecoder("utf-8").decode(await Deno.readFile("data/20.in"));
let lines = data.split("\n");
assert(lines.pop() === "");

type Module = {
    type: "%",
    connections: string[],
    is_on: boolean,
} | {
    type: "&",
    connections: string[],
    incoming: Map<string, boolean>,
} | {
    type: "broadcaster",
    connections: string[],
}

let modules = new Map<string, Module>();
for (let line of lines) {
    let [module, rest] = line.split(" -> ");
    let connections = rest.split(", ");
    if (module.startsWith("%")) {
        modules.set(module.slice(1), {
            type: "%",
            connections,
            is_on: false,
        });
    } else if (module.startsWith("&")) {
        modules.set(module.slice(1), {
            type: "&",
            connections,
            incoming: new Map(),
        });
    } else {
        assert(module === "broadcaster", line);
        modules.set(module, {
            type: "broadcaster",
            connections,
        });
    }
}

for (let [name, module] of modules) {
    for (let dst of module.connections) {
        let dst_module = modules.get(dst);
        if (dst_module === undefined) {
            console.warn("Missing module", dst);
        }
        if (dst_module && dst_module?.type === "&") {
            dst_module.incoming.set(name, false);
        }
    }
}

/*let dot = "digraph {\n";
for (let [name, module] of modules) {
    dot += `    ${name} [label="${module.type + name}"];\n`;
    for (let dst of module.connections) {
        dot += `    ${name} -> ${dst};\n`;
    }
}
dot += "}\n";
await Deno.writeTextFile("20.dot", dot);*/

let pulses1: [string, boolean, string][] = [];
let pulses2: [string, boolean, string][] = [];
let cnt_low = 0;
let cnt_high = 0;
for (let i = 0; i < 10000; i++) {
    pulses1.push(["button", false, "broadcaster"]);
    while (true) {
        if (pulses2.length === 0) {
            while (pulses1.length > 0) {
                pulses2.push(pulses1.pop()!);
            }
        }
        if (pulses2.length === 0) {
            break;
        }
        let [sender_name, is_high, module_name] = pulses2.pop()!;
        // let interesting = ["vd", "bh", "dl", "ns"];
        // if (interesting.includes(module_name)) {
        //     if (is_high) {
        //         console.log(module_name, i);
        //     }
        // }
        // if (module_name === "rx" && !is_high) {
        //     console.log(sender_name, is_high, module_name, i + 1);
        //     assert(false);
        // }
        if (is_high) {
            cnt_high += 1;
        } else {
            cnt_low += 1;
        }
        let module = modules.get(module_name);
        if (module === undefined) {
            continue;
        }
        if (module.type === "%") {
            if (!is_high) {
                module.is_on = !module.is_on;
                for (let dst of module.connections) {
                    pulses1.push([module_name, module.is_on, dst]);
                }
            }
        } else if (module.type === "&") {
            assert(module.incoming.has(sender_name));
            module.incoming.set(sender_name, is_high);
            if (module_name === "zh") {
                // let any_high = false;
                for (let [input_name, is_high] of module.incoming) {
                    if (is_high) {
                        console.log(i, input_name);
                    }
                    // if (is_high) {
                    //     any_high = true;
                    //     break;
                    // }
                }
                // if (any_high) {
                //     console.log(i, module.incoming);
                // }
            }
            let all_high = true;
            for (let [_, is_high] of module.incoming) {
                if (!is_high) {
                    all_high = false;
                    break;
                }
            }
            for (let dst of module.connections) {
                pulses1.push([module_name, !all_high, dst]);
            }
        } else if (module.type === "broadcaster") {
            for (let dst of module.connections) {
                pulses1.push([module_name, is_high, dst]);
            }
        } else {
            assert(false);
        }
    }
}

console.log("Part 1:", cnt_low * cnt_high);

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

/*
bh: 3760 7521 11282 15043
ns: 3766 7533 11300 15067
dl: 3778 7557 11336 15115
vd: 3880 7761 11642 15523
*/
console.log("Part 2:", lcm(3761, 3767, 3779, 3881));
