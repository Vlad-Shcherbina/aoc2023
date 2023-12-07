import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

const dec = new TextDecoder("utf-8");
const enc = new TextEncoder();

let args = Deno.args;
let with_git = true;
if (args.includes("--no-git")) {
    args = args.filter(arg => arg !== "--no-git");
    with_git = false;
}

if (args.length !== 1) {
    console.error("Usage: deno run --allow-read --allow-write --allow-run --allow-net new_day.ts <day>");
    Deno.exit(1);
}

if (with_git) {
    const res = await new Deno.Command("git", { args: ["status", "--porcelain"] }).output();
    if (res.stdout.length > 0 || res.stderr.length > 0) {
        console.log(dec.decode(res.stdout));
        console.error(dec.decode(res.stderr));
        console.error("There are uncommitted changes. Commit them first, or run with --no-git to bypass this check.");
        Deno.exit(1);
    }
}

const day = args[0].padStart(2, '0');
const year = 2023;

const session_cookie = dec.decode(await Deno.readFile("session_cookie.txt"));

const url = `https://adventofcode.com/${year}/day/${parseInt(day)}/input`;
const response = await fetch(url, {
    headers: { "Cookie": `session=${session_cookie}` },
});

if (!response.ok) {
    console.error("Failed to fetch problem input:", response.status);
    Deno.exit(1);
}
const input = await response.text();

await Deno.mkdir("data", { recursive: true });
Deno.writeFile(`data/${day}.in`, enc.encode(input));

const template = dec.decode(await Deno.readFile("template.ts"));
await Deno.writeFile(`${day}.ts`, enc.encode(template.replace("<day>", day)));

if (with_git) {
    let res = new Deno.Command("git", { args: ["add", `${day}.ts`, `data/${day}.in`] }).spawn().output();
    assert((await res).success);
    res = new Deno.Command("git", { args: ["commit", "-m", `Day ${day} init`] }).spawn().output();
    assert((await res).success);
}
console.log(`Day ${day} stuff initialized. Now solve!`);
