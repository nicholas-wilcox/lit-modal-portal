import { env } from 'node:process';
import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  nodeResolve: true,
  port: Number(env['PORT']) || 8000,
  plugins: [esbuildPlugin({ ts: true, target: 'auto', tsconfig: './tsconfig.json' })],
  middleware: [
    // Based on https://modern-web.dev/docs/dev-server/middleware/#rewriting-request-urls
    function rewriteIndex(context, next) {
      if (context.url === '/' || context.url === '/index.html') {
        context.url = '/dev/index.html';
      }

      return next();
    },
  ],
};
