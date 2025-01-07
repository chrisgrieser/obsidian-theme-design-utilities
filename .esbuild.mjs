import { appendFileSync } from "node:fs";
import builtins from "builtin-modules";
import esbuild from "esbuild";

const banner = `/* THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
If you want to view the source, please visit the GitHub repository of this plugin. */`;

const production = process.argv[2] === "production";
const analyze = process.argv[2] === "analyze";

//──────────────────────────────────────────────────────────────────────────────

const result = await esbuild
	.build({
		entryPoints: ["src/main.ts"],
		banner: { js: banner + "\n" },
		outfile: "main.js",
		bundle: true,
		// biome-ignore format: no need to inspect this regularly
		external: ["obsidian", "electron", "@codemirror/autocomplete", "@codemirror/collab", "@codemirror/commands", "@codemirror/language", "@codemirror/lint", "@codemirror/search", "@codemirror/state", "@codemirror/view", "@lezer/common", "@lezer/highlight", "@lezer/lr", ...builtins],
		format: "cjs",
		target: "es2022",
		sourcemap: production || analyze ? false : "inline",
		minify: production || analyze,
		drop: [], // not dropping `debugger` since required for this plugin to work
		treeShaking: true,
		logLevel: analyze ? "silent" : "info",
		metafile: analyze,
	})
	.catch(() => process.exit(1));

//──────────────────────────────────────────────────────────────────────────────

// DOCS https://esbuild.github.io/api/index#metafile
if (result.metafile) {
	const sizes = await esbuild.analyzeMetafile(result.metafile, { verbose: false });
	console.info(sizes);
}

// FIX prevent Obsidian from removing the source map when using dev build
// https://forum.obsidian.md/t/source-map-trimming-in-dev-builds/87612
if (!production) appendFileSync(import.meta.dirname + "/main.js", "\n/* nosourcemap */");