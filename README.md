## Ringcnetral Juno UI library

Make you use Juno more efficient.

## Quick Select palette and view color first

![](https://raw.githubusercontent.com/ZouYouShun/ringcentral-juno-vscode-extension/master/doc/assets/quick-select.gif)

## Palette highlight
![](https://raw.githubusercontent.com/ZouYouShun/ringcentral-juno-vscode-extension/master/doc/assets/highlight-palette.png)

![](https://raw.githubusercontent.com/ZouYouShun/ringcentral-juno-vscode-extension/master/doc/assets/highlight-prop.png)

## Theme switch in code

![](https://raw.githubusercontent.com/ZouYouShun/ringcentral-juno-vscode-extension/master/doc/assets/switch-theme.gif)

Support set custom theme json file, set config in `.vscode/settings.json` or global `setting`

> remember **reload** vscode after update `themeMap`

```json
{
  ...,
  "ringcentral-juno.defaultTheme": "default", // default theme when vscode open
  "ringcentral-juno.themeMap": {
    "dark": "./src/foundation/styles/ThemeSwitcherProvider/dark.json", // theme file relative path
    "highContrast": "./src/foundation/styles/ThemeSwitcherProvider/highContrast.json"
  }
}
```
