import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  CompletionItem,
  CompletionItemKind,
  createConnection,
  DidChangeConfigurationNotification,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  TextDocumentPositionParams,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node';

import { getPaletteChoice } from './paletteChoice';

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

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.

connection.onDidChangeWatchedFiles((_change) => {
  // Monitored files have change in VSCode
  connection.console.log('We received an file change event');
});

const paletteItems = getPaletteChoice((value) => value.join('.'));

connection.onCodeAction((...e) => {
  console.log('onCodeAction', e);
  return null;
});

connection.onDocumentColor((...e) => {
  console.log('onDocumentColor', e);
  return null;
});

connection.onColorPresentation((...e) => {
  console.log('onColorPresentation', e);
  return null;
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
  ({
    textDocument,
    position,
  }: TextDocumentPositionParams): CompletionItem[] => {
    const document = documents.get(textDocument.uri);

    if (document) {
      const text = document.getText({
        start: { line: position.line, character: 0 },
        end: position,
      });
      console.log(text);
    }

    // The pass parameter contains the position of the text document in
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.
    return paletteItems.map((x) => {
      return {
        label: x.key,
        kind: CompletionItemKind.Color,
        documentation: x.value,
        sortText: '0',
      };
    });
  },
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
  // if (item.data === 1) {
  // 	item.detail = 'TypeScript details';
  // 	item.documentation = 'TypeScript documentation';
  // } else if (item.data === 2) {
  // 	item.detail = 'JavaScript details';
  // 	item.documentation = 'JavaScript documentation';
  // }
  return item;
});

// connection.onShutdown(() => {
// 	this.dispose()
// })

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
