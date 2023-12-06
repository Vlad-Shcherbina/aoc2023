const dec = new TextDecoder("utf-8");
const enc = new TextEncoder();

if (Deno.args.length !== 1) {
    console.error("Usage: deno run --allow-read --allow-write --allow-net new_day.ts <day>");
    Deno.exit(1);
}
const day = Deno.args[0].padStart(2, '0');
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

console.log(`Day ${day} stuff initialized. Now solve!`);
