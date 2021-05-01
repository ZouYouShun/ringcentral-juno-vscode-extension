import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import { askTargetFolder, extensionNamespace, Lib } from '../../utils';
import { OutputChannel } from './../../utils/extension/outputCannel';
import { newToken } from './new-token';
import { tokenMapping } from './token-migrate';

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

            const targetToken:
              | string
              | string[]
              | undefined = (tokenMapping as any)[mapKey];

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
          const getPaletteStrings =
            result.match(/color={\[.*\]|color={'.*'|color=".*"/g) || [];

          getPaletteStrings.forEach((x) => {
            const isArray = x.includes('[');
            const key = x
              .replace('color={', '')
              .replace('color="', '')
              .replace('"', '');

            const mapKey = key
              .replace(/\['|'\]/g, '')
              .replace("', '", '-')
              .replace('.', '-');

            const targetToken:
              | string
              | string[]
              | undefined = (tokenMapping as any)[mapKey];

            if (targetToken) {
              if (targetToken instanceof Array) {
                result = result.replace(
                  new RegExp(key, 'g'),
                  `'${targetToken[0].split('-').join('.')}'${targetToken[1]}`,
                );
              } else {
                const sourceTarget = targetToken.split('-').join('.');
                const replaceTarget = isArray
                  ? `'${sourceTarget}'`
                  : sourceTarget;

                result = result.replace(
                  new RegExp(key.replace('[', '\\[').replace(']', '\\]'), 'g'),
                  `${replaceTarget}`,
                );
              }
            } else if (
              ![...newToken, 'primary', 'secondary', 'inherit'].includes(
                mapKey,
              ) ||
              mapKey.includes('#')
            ) {
              result = result.replace(
                new RegExp(key.replace('[', '\\[').replace(']', '\\]'), 'g'),
                `${key}/* !!!This token not exist! CONFIRM with Designer which one should use */`,
              );
            }
          });
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
