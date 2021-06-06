import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  RevealOutputChannelOn,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

import { executeCommand } from '../utils';

const DEFAULT_LANGUAGES = [
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
];

export let languageClient: LanguageClient;

export const initLanguageClient = ({ serverPath }: { serverPath: string }) => {
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

  const clientOptions: LanguageClientOptions = {
    documentSelector: DEFAULT_LANGUAGES.map((language) => ({
      scheme: 'file',
      language,
    })),
    middleware: {
      executeCommand: async (command, args, next) => {
        executeCommand('editor.action.triggerSuggest');

        return next(command, args);
      },
    },
  };

  languageClient = new LanguageClient(
    'JunoLanguageServer',
    'Juno Language Server',
    serverOptions,
    clientOptions,
  );

  return () => {
    if (!languageClient) {
      return undefined;
    }
    return languageClient.stop();
  };
};
