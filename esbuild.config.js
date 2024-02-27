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

const plugins = [
  {
    name: 'on-rebuild-plugin',
    setup(build) {
      if (shouldWatch) {
        build.onEnd((result) => {
          const timeString = getNowAsString();
          if (error) console.log(`${timeString}: watch build failed`);
          else console.log(`${timeString}: watch build succeeded`);
        });
      }
    },
  },
];

const context = await esbuild.context({
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
  format: 'esm',
  sourcemap: true,
  plugins,
});

if (shouldWatch) {
  await context.watch();
  console.log('watching...');
} else {
  await context.rebuild();
}

await context.dispose();
