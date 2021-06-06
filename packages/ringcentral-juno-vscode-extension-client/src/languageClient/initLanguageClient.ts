import { workspace } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

const DEFAULT_LANGUAGES = [
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
];

export const initLanguageClient = ({ serverPath }: { serverPath: string }) => {
  let client: LanguageClient;
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverPath, transport: TransportKind.ipc },
    debug: {
      module: serverPath,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };
  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: DEFAULT_LANGUAGES.map((language) => ({
      scheme: 'file',
      language,
    })),
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'JunoLanguageServer',
    'Juno Language Server',
    serverOptions,
    clientOptions,
  );

  // Start the client. This will also launch the server
  client.start();

  return () => {
    if (!client) {
      return undefined;
    }
    return client.stop();
  };
};
