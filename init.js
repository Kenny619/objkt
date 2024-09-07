const fs = require("fs");
// Update package.json
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
packageJson.type = "module";
packageJson.scripts.test = "vitest";
packageJson.scripts.prebuild = "rimraf dist";
packageJson.scripts.build =
	"tsc --project ./tsconfig.json && tsc-alias -p ./tsconfig.json";
packageJson.scripts.sandbox =
	"tsx --no-warnings --env-file=.env ./tests/sandbox.ts";
fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

// Update tsconfig.json
const tsconfigJson = { compilerOptions: {} };
tsconfigJson.compilerOptions.module = "NodeNext";
tsconfigJson.compilerOptions.moduleResolution = "NodeNext";
tsconfigJson.compilerOptions.strict = true;
tsconfigJson.compilerOptions.esModuleInterop = true;
tsconfigJson.compilerOptions.forceConsistentCasingInFileNames = true;
tsconfigJson.compilerOptions.skipLibCheck = true;
tsconfigJson.compilerOptions.target = "ESNext";
tsconfigJson.compilerOptions.allowJs = true;
tsconfigJson.compilerOptions.baseUrl = ".";
tsconfigJson.compilerOptions.outDir = "dist";
tsconfigJson.compilerOptions.noEmitOnError = true;
tsconfigJson.compilerOptions.removeComments = false;
tsconfigJson.compilerOptions.sourceMap = false;
tsconfigJson.compilerOptions.types = ["vitest/globals"];
tsconfigJson.compilerOptions.paths = {
	"@/*": ["src/*"],
	"@/types/*": ["types/*"],
	"@/utils/*": ["utils/*"],
};
tsconfigJson.include = ["src", "tests"];
tsconfigJson.exclude = ["node_modules", "dist"];
fs.writeFileSync("tsconfig.json", JSON.stringify(tsconfigJson, null, 2));

//Update biome.json
const biomeJson = JSON.parse(fs.readFileSync("biome.json", "utf8"));
biomeJson.organizeImports.enabled = true;
biomeJson.linter.enabled = true;
biomeJson.javascript = {
	formatter: {
		enabled: true,
		lineWidth: 120,
		indentStyle: "tab",
		indentWidth: 2,
		lineEnding: "lf",
		arrowParentheses: "always",
		jsxQuoteStyle: "double",
		semicolons: "always",
		trailingCommas: "all",
		quoteProperties: "asNeeded",
		bracketSpacing: true,
		bracketSameLine: true,
	},
};
biomeJson.formatter = {
	enabled: true,
	formatWithErrors: true,
	indentStyle: "tab",
	indentWidth: 2,
	lineWidth: 120,
	lineEnding: "lf",
	ignore: [],
};
fs.writeFileSync("biome.json", JSON.stringify(biomeJson, null, 2));

//Create vite.config.ts
const viteConfig = `
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths"; // enable tsconfig path in test files.

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
	},
	files: ["./tests/*.test.ts"], // Adjust the pattern to match your test files
	extensions: ["ts"],
	require: ["ts-node/register"], // Use ts-node to execute TypeScript files directly
});`;
fs.writeFileSync("vite.config.ts", viteConfig);

console.log("config files updated.");
