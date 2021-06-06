import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  CompletionItem,
  createConnection,
  DidChangeConfigurationNotification,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  TextDocumentPositionParams,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node';

import { getCompletionResults } from './utils';

const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;

connection.onInitialize((params: InitializeParams) => {
  const capabilities = params.capabilities;

  // Does the client support the `workspace/configuration` request?
  // If not, we fall back using global settings.
  hasConfigurationCapability = !!(
    capabilities.workspace && !!capabilities.workspace.configuration
  );
  hasWorkspaceFolderCapability = !!(
    capabilities.workspace && !!capabilities.workspace.workspaceFolders
  );

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: {
        resolveProvider: true,
      },
    },
  };
  if (hasWorkspaceFolderCapability) {
    result.capabilities.workspace = {
      workspaceFolders: {
        supported: true,
      },
    };
  }
  return result;
});

connection.onInitialized(() => {
  if (hasConfigurationCapability) {
    // Register for all configuration changes.
    connection.client.register(
      DidChangeConfigurationNotification.type,
      undefined,
    );
  }
  if (hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders((_event) => {
      connection.console.log('Workspace folder change event received.');
    });
  }
});

connection.onDidChangeConfiguration((change) => {
  //
});

connection.onDidChangeWatchedFiles((_change) => {
  // Monitored files have change in VSCode
  connection.console.log('We received an file change event');
});

connection.onCompletion(
  ({
    textDocument,
    position,
  }: TextDocumentPositionParams): CompletionItem[] => {
    const document = documents.get(textDocument.uri);

    if (!document) {
      return [];
    }

    const text = document.getText({
      start: { line: position.line, character: 0 },
      end: { line: position.line, character: position.character + 1 },
    });

    return getCompletionResults(text, position);
  },
);

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
  return item;
});

documents.listen(connection);

connection.listen();
