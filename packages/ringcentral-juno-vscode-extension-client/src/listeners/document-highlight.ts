import * as vscode from 'vscode';

import {
  findColorField,
  findColorObjectProp,
  findColorProp,
  findPalette2,
  findScssRcPalette,
} from './finders/findPalette2';
import { DecorationMap } from './libs';

export class DocumentHighlight {
  disposed = false;
  decorations = new DecorationMap();
  listener = vscode.workspace.onDidChangeTextDocument(({ document }) =>
    this.onUpdate(document),
  );

  strategies = [
    findPalette2,
    findColorProp,
    findColorObjectProp,
    findColorField,
    findScssRcPalette,
  ];

  constructor(public document: vscode.TextDocument) {}

  onUpdate(document = this.document) {
    if (
      this.disposed ||
      this.document.uri.toString() !== document.uri.toString()
    ) {
      return;
    }

    const text = this.document.getText();
    const version = this.document.version.toString();

    return this.updateRange(text, version);
  }

  updateRange(text: string, version: string) {
    return Promise.all(this.strategies.map((fn) => fn(text)))
      .then((result) => {
        const actualVersion = this.document.version.toString();
        if (actualVersion !== version) {
          throw new Error('Document version already has changed');
        }

        return result;
      })
      .then(concatAll)
      .then(groupByColor)
      .then((colorRanges) => {
        if (this.disposed) {
          return false;
        }

        const updateStack = this.decorations
          .keys()
          .reduce<any>((state, color) => {
            state[color] = [];
            return state;
          }, {});

        for (const color in colorRanges) {
          updateStack[color] = colorRanges[color].map((item: any) => {
            const option: vscode.DecorationOptions = {
              range: new vscode.Range(
                this.document.positionAt(item.start),
                this.document.positionAt(item.end),
              ),
              hoverMessage: new vscode.MarkdownString(
                color,
                // TODO: seems color is not work, find way to replace that
                // `<span style="color: '${color}'">${color}</span>`,
              ),
            };

            return option;
          });
        }

        for (const color in updateStack) {
          const decoration = this.decorations.get(color);

          vscode.window.visibleTextEditors
            .filter(({ document }) => document.uri === this.document.uri)
            .forEach((editor) => {
              editor.setDecorations(decoration, updateStack[color]);
            });
        }
      })
      .catch((error) => console.log(error));
  }

  dispose() {
    this.disposed = true;
    this.decorations.dispose();
    this.listener.dispose();

    (this as any).decorations = null;
    (this as any).document = null;
    (this as any).listener = null;
  }
}

function groupByColor(results: any) {
  return results.reduce((collection: any, item: any) => {
    if (!collection[item.color]) {
      collection[item.color] = [];
    }

    collection[item.color].push(item);

    return collection;
  }, {});
}

function concatAll(arr: any) {
  return arr.reduce((result: any, item: any) => result.concat(item), []);
}
