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

let pulses1: [string, boolean, string][] = [];
let pulses2: [string, boolean, string][] = [];
let cnt_low = 0;
let cnt_high = 0;
for (let i = 0; i < 1000; i++) {
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
        // console.log(sender_name, is_high, module_name);
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
