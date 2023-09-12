import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
	treeshake: true,
	splitting: true,
	entry: ["src/**/*.ts"],
	format: ["esm"],
	dts: true,
	minify: true,
	clean: true,
	external: ["react"],
	onSuccess: "pnpm exec tsc",
	...options,
}));
