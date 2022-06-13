import esbuild from 'esbuild';
import parser from 'yargs-parser';

function isBooleanAndTrue(value) {
  return typeof value === 'boolean' && Boolean(value);
}

const localeTimeStringOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

function getNowAsString() {
  return new Date().toLocaleTimeString([], localeTimeStringOptions);
}

const argv = parser(process.argv.slice(2));
const shouldWatch = isBooleanAndTrue(argv.w) || isBooleanAndTrue(argv.watch);
const shouldMinify = isBooleanAndTrue(argv.m) || isBooleanAndTrue(argv.minify);

const baseConfig = shouldMinify
  ? {
      entryPoints: {
        'lit-modal-portal-core.min': 'src/index.ts',
        'lit-modal-portal-lib.min': 'src/lib/index.ts',
      },
      outdir: './',
      minify: true,
      bundle: true,
      target: 'es6',
    }
  : {
      entryPoints: [
        'src/index.ts',
        'src/modal-portal.ts',
        'src/modal-controller.ts',
        'src/portal.ts',
        'src/lib/index.ts',
        'src/lib/lit-dialog.ts',
        'src/lib/confirm-modal.ts',
        'src/lib/with-lit-dialog.ts',
        'src/lib/uuid.ts',
        'src/lib/state.ts',
      ],
      outdir: './',
      bundle: false,
    };

esbuild
  .build(
    Object.assign(baseConfig, {
      format: 'esm',
      sourcemap: true,
      watch: shouldWatch
        ? {
            onRebuild(error, result) {
              const timeString = getNowAsString();
              if (error) console.log(`${timeString}: watch build failed`);
              else console.log(`${timeString}: watch build succeeded`);
            },
          }
        : false,
    })
  )
  .then((result) => {
    if (shouldWatch) console.log('watching...');
  });
