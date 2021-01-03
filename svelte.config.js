const { typescript } = require('svelte-preprocess-esbuild');

export const preprocess = typescript({ tsconfig: "./tsconfig.json" });