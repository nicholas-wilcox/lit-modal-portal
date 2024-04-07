import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  nodeResolve: true,
  files: ['src/**/*.test.ts'],
  plugins: [esbuildPlugin({ ts: true, target: 'auto', tsconfig: './tsconfig.json' })],
};
