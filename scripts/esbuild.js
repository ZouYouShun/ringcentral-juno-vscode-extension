const { build } = require('esbuild');

const args = process.argv.slice(2);

const params = args.reduce((acc, curr) => {
  const key = curr.replace('--', '');
  acc[key] = true;
  return acc;
}, {});

const getWatchMethod = (name) => ({
  onRebuild: (err, result) => {
    if (err) {
      console.error(`[${name}]`, err);
    } else {
      console.log(`[${name}]: build complete.`);
    }
  },
});

build({
  entryPoints: [
    'packages/ringcentral-juno-vscode-extension-client/src/extension.ts',
  ],
  outfile: 'out/client/extension.js',
  external: ['vscode', 'vscode-languageclient/node'],
  format: 'cjs',
  platform: 'node',
  bundle: true,
  ...params,
  ...(params.watch
    ? {
        watch: getWatchMethod('client'),
      }
    : {}),
}).catch((e) => {
  console.error(e);
});

build({
  entryPoints: [
    'packages/ringcentral-juno-vscode-extension-language-server/src/server.ts',
  ],
  outfile: 'out/server/server.js',
  external: ['vscode', 'vscode-languageclient/node'],
  format: 'cjs',
  platform: 'node',
  bundle: true,
  ...params,
  ...(params.watch
    ? {
        watch: getWatchMethod('server'),
      }
    : {}),
}).catch((e) => {
  console.error(e);
});
