import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true, target: 'es2020', tsconfig: './tsconfig.json' })],
};
