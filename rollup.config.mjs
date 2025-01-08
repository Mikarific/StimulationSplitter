import { definePlugins } from '@gera2ld/plaid-rollup';
import { defineConfig } from 'rollup';
import userscript from 'rollup-plugin-userscript';
import pkg from './package.json' with { type: 'json' };

export default defineConfig([
	{
		input: 'src/index.ts',
		plugins: [
			...definePlugins({
				esm: true,
				minimize: false,
				extensions: ['.ts', '.mjs', '.js'],
				replaceValues: {
					'process.env.VERSION': pkg.version,
					'process.env.AUTHOR': pkg.author,
					'process.env.LICENSE': pkg.license
				},
			}),
			userscript((meta) =>
				meta
					.replace('process.env.VERSION', pkg.version)
					.replace('process.env.AUTHOR', pkg.author)
					.replace('process.env.LICENSE', pkg.license),
			)
		],
		output: {
			format: 'iife',
			indent: false,
			file: `dist/StimulationSplitter.user.js`,
		},
	},
]);
