/**
 * jsr has no built-in way to get css file, so I make this to download css file to local machine.
 * 
 * ```sh
 * deno run -A jsr:@cvnc/_download.ts react-float-menu.css static/style.css
 * ```
 * 
 * @module
 */

const [filename, targetPath] = Deno.args

await fetch(import.meta.resolve(`./${filename}`))
    .then(async res => Deno.writeFile(targetPath, await res.bytes()));
