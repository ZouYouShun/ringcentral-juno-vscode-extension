import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import {
  findColorField,
  findColorObjectProp,
  findColorProp,
  findPalette2,
} from '../../listeners/finders';

import { askTargetFolder, extensionNamespace, Lib } from '../../utils';
import { OutputChannel } from '../../utils/extension/outputCannel';
import { newToken } from './new-token';
import { tokenMapping } from './token-migrate';

const notExistComment =
  '/* [Juno] !!!This token not exist! CONFIRM with Designer which one should use */';

const getMigrateTemplate = async (
  fileTree: string[],
  cb: (obj: { path: string; source: string; result: string }) => any,
) => {
  for (const filePath of fileTree) {
    const file = fs.readFileSync(filePath);
    const fileDetail = path.parse(filePath);
    const source = file.toString();
    let result = source;

    switch (fileDetail.ext) {
      case '.scss':
        {
          const getPaletteStrings = result.match(/rc-palette.*\)/g) || [];

          getPaletteStrings.forEach((palette) => {
            const key = palette.replace('rc-palette(', '').replace(')', '');

            const mapKey = key
              .replace(/'/g, '')
              .replace(', ', '-')
              .toLocaleLowerCase();

            const targetToken: string | string[] | undefined = (
              tokenMapping as any
            )[mapKey];

            if (targetToken) {
              if (targetToken instanceof Array) {
                result = result.replace(
                  new RegExp(key, 'g'),
                  `'${targetToken[0].split('-').join("', '")}'${
                    targetToken[1]
                  }`,
                );
              } else {
                result = result.replace(
                  new RegExp(key, 'g'),
                  `'${targetToken.split('-').join("', '")}'`,
                );
              }
            } else if (!newToken.includes(mapKey)) {
              result = result.replace(
                new RegExp(key, 'g'),
                `${key}/* !!!This token not exist! CONFIRM with Designer which one should use */`,
              );
            }
          });
        }
        break;

      case '.ts':
      case '.js':
      case '.tsx':
      case '.jsx':
        {
          const switchColor = (cb: Function, isSplitArg: boolean = false) => {
            const resultItems = cb(result, true);

            for (let i = resultItems.length - 1; i >= 0; i--) {
              const { start, end, paletteKeys } = resultItems[i];

              const oldToken = paletteKeys.join('-');
              const toToken: string | string[] = tokenMapping[oldToken];

              const getColorString = (value: string) =>
                isSplitArg
                  ? `'${value.split('-').join("', '")}'`
                  : value.replace('-', '.');

              if (toToken) {
                if (toToken instanceof Array) {
                  result =
                    result.slice(0, start) +
                    getColorString(toToken[0]) +
                    toToken[1] +
                    result.slice(end);
                } else {
                  result =
                    result.slice(0, start) +
                    getColorString(toToken) +
                    result.slice(end);
                }
              } else if (
                ![...newToken, 'initial', 'inherit', 'default'].includes(
                  oldToken,
                ) &&
                !oldToken.includes('#')
              ) {
                result =
                  result.slice(0, end) + notExistComment + result.slice(end);
              }
            }
          };

          switchColor(findColorProp);
          switchColor(findColorField);
          switchColor(findColorObjectProp);
          switchColor(findPalette2, true);
        }

        break;

      default:
        break;
    }

    if (source !== result) {
      await cb({ path: filePath, source, result });
    }
  }
};

// https://docs.google.com/spreadsheets/d/1BYZUI2aDwLyvizO45tpQNylpVpMIkmeWLSz4geeuTP0/edit#gid=0
export const migrateFileTokenCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.migrateFileToken`,
  async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      getMigrateTemplate([editor.document.fileName], ({ source, result }) => {
        editor.edit((editBuilder) => {
          try {
            editBuilder.replace(
              new vscode.Range(
                editor.document.positionAt(0),
                editor.document.positionAt(source.length),
              ),
              result,
            );
          } catch (error) {
            vscode.window.showErrorMessage(error);
          }
        });
      });
    }
  },
);

export const migrateFolderTokenCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.migrateFolderToken`,
  async () => {
    const dirPath = await askTargetFolder();

    if (!dirPath) {
      return;
    }

    await vscode.window.withProgress<string>(
      {
        cancellable: true,
        location: vscode.ProgressLocation.Notification,
        title: `Migrating ......`,
      },
      (progress, token) => {
        return new Promise<string>((resolve, reject) => {
          // token.onCancellationRequested(() => {
          //   console.log('User canceled the long running operation');
          // });

          progress.report({ increment: 0 });

          // for run in next stack
          setTimeout(async () => {
            try {
              const fileTree = Lib.getFileTree(dirPath);

              progress.report({
                increment: 10,
                message: 'Get all file done.',
              });

              await getMigrateTemplate(
                fileTree,
                async ({ path, source, result }) => {
                  await Lib.writeFile(path, result);
                },
              );

              progress.report({
                increment: 100,
                message: 'migrate complete.',
              });

              // delay 100ms
              setTimeout(() => resolve('success'), 100);
            } catch (error) {
              OutputChannel.appendLine(error);
              reject('fail');
            }
          }, 0);
        });
      },
    );
  },
);
