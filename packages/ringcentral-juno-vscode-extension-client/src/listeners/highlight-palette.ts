import * as vscode from 'vscode';

import { DocumentHighlight } from './document-highlight';

const config = { enable: true, languages: '*' };

let instanceMap: DocumentHighlight[] = [];

function isValidDocument(
  config: { enable: boolean; languages: string },
  { languageId }: vscode.TextDocument,
) {
  let isValid = false;

  if (!config.enable) {
    return isValid;
  }

  if (config.languages.indexOf('*') > -1) {
    isValid = true;
  }

  if (config.languages.indexOf(languageId) > -1) {
    isValid = true;
  }
  if (config.languages.indexOf(`!${languageId}`) > -1) {
    isValid = false;
  }

  return isValid;
}

async function doHighlight(documents: vscode.TextDocument[] = []) {
  if (documents.length) {
    const instances = await Promise.all(
      documents.map((document) => {
        if (!document) {
          return;
        }

        const found = instanceMap.find(
          ({ document: refDoc }: any) => refDoc === document,
        );

        if (!found) {
          const instance = new DocumentHighlight(document);
          instanceMap.push(instance);
        }

        return found || instanceMap[instanceMap.length - 1];
      }),
    );

    return instances.map((instance) => instance?.onUpdate());
  }
}

function onOpenEditor(editors: vscode.TextEditor[]) {
  const documents = editors.map(({ document }) => document);

  instanceMap = instanceMap.reduce<DocumentHighlight[]>((acc, curr) => {
    if (documents.indexOf(curr.document) > -1) {
      acc.push(curr);
    } else {
      curr.dispose();
    }
    return acc;
  }, []);

  const validDocuments = documents.filter((doc) =>
    isValidDocument(config, doc),
  );

  doHighlight(validDocuments);
}

export const bindHighlightPaletteListeners = (
  context: vscode.ExtensionContext,
) => {
  vscode.window.onDidChangeVisibleTextEditors(
    onOpenEditor,
    null,
    context.subscriptions,
  );
  onOpenEditor(vscode.window.visibleTextEditors);

  return () => {
    instanceMap.forEach((instance) => instance.dispose());
    (instanceMap as any) = null;
  };
};
