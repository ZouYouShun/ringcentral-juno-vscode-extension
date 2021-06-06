import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  CodeAction,
  CodeActionKind,
  Command,
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

import { themeManager, getCompletionResults, requestKeys } from './utils';

const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

const showCompletionCmd = 'juno-server.showCompletion';

const commands = [showCompletionCmd];

let tmpCompletionResult: CompletionItem[] | null;

connection.onInitialize((params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      codeActionProvider: true,
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: { resolveProvider: true },
      executeCommandProvider: { commands },
    },
  };

  return result;
});

connection.onInitialized(() => {
  connection.sendRequest('init').then((inputPalette) => {
    themeManager.palette = inputPalette;
    return 'success';
  });
});

connection.onRequest(requestKeys.themeChange, (inputPalette) => {
  themeManager.palette = inputPalette;
  return 'success';
});

connection.onDidChangeTextDocument(() => {
  // clear tmp every time change value
  tmpCompletionResult = null;
});
connection.onDidChangeWatchedFiles((_change) => {
  // clear tmp every time change view file
  tmpCompletionResult = null;
});

connection.onDidChangeConfiguration((change) => {
  //
});

connection.onCompletion(
  ({
    textDocument,
    position,
  }: TextDocumentPositionParams): CompletionItem[] => {
    // when that have tmp, mean that trigger from onCodeAction
    if (tmpCompletionResult) {
      return tmpCompletionResult;
    }

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

connection.onCodeAction(({ textDocument, range }) => {
  // * clear tmp completion
  tmpCompletionResult = null;

  const document = documents.get(textDocument.uri);

  if (!document) {
    return [];
  }
  const position = range.end;

  const text = document.getText({
    start: { line: position.line, character: 0 },
    end: { line: position.line, character: position.character + 1 },
  });

  const completionResult = getCompletionResults(text, position);

  if (completionResult.length > 0) {
    const title = '[Juno] Show palette choice';
    tmpCompletionResult = completionResult;

    return [
      CodeAction.create(
        title,
        Command.create(title, showCompletionCmd, textDocument.uri),
        CodeActionKind.QuickFix,
      ),
    ];
  }
});

connection.onExecuteCommand(async (params) => {
  console.log('!!onExecuteCommand', params);
});

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
  return item;
});

documents.listen(connection);

connection.listen();
