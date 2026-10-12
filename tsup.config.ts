import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/react.ts', 'src/vue.ts', 'src/svelte.ts', 'src/auto.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  treeshake: true,
  external: ['react', 'vue', 'svelte']
});
