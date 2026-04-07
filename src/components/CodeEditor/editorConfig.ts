import type { EditorAppConfig } from 'monaco-languageclient/editorApp'
import type { LanguageClientConfig } from 'monaco-languageclient/lcwrapper'
import type { MonacoVscodeApiConfig } from 'monaco-languageclient/vscodeApiWrapper'

import { URI } from 'vscode-uri'
import { configureDefaultWorkerFactory } from 'monaco-languageclient/workerFactory'
import { LogLevel } from '@codingame/monaco-vscode-api'

import '@codingame/monaco-vscode-theme-defaults-default-extension'
import '@codingame/monaco-vscode-cpp-default-extension'
import '@codingame/monaco-vscode-json-default-extension'

export const LSP_HOST = import.meta.env.VITE_LSP_HOST ?? 'localhost'

export const workspaceRoot = '/Users/Surakan/arduino-lsp-server-api-nest/arduino-workspace'
export const filePath = `${workspaceRoot}/arduino-workspace.ino`

export const defaultCode =
`void setup() {
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:

}`

export const vscodeApiConfig: MonacoVscodeApiConfig = {
  $type: 'extended',
  viewsConfig: {
    $type: 'EditorService',
  },
  logLevel: LogLevel.Debug,
  userConfiguration: {
    json: JSON.stringify({
      'workbench.colorTheme': 'Default Dark+',
      'editor.fontSize': 16,
      'editor.fontFamily': 'Consolas, monospace',

      'editor.tabSize': 4,
      'editor.wordWrap': 'on',
      'editor.minimap.enabled': true,
      'editor.lineNumbers': 'on',

      'editor.quickSuggestions': true,
      'editor.wordBasedSuggestions': 'off',
      'editor.parameterHints.enabled': true,

      'editor.guides.bracketPairsHorizontal': 'active',
    }),
  },
  monacoWorkerFactory: configureDefaultWorkerFactory,
  extensions: [
    {
      config: {
        name: 'cpp-language',
        publisher: 'vscode',
        version: '1.0.0',
        engines: {
          vscode: '*',
        },
        contributes: {
          languages: [
            {
              id: 'cpp',
              extensions: ['.cpp', '.h', '.ino'],
              aliases: ['C++', 'cpp', 'arduino'],
              mimetypes: ['text/x-c++src'],
            },
          ],
        },
      },
    },
  ],
}

export const languageClientConfig: LanguageClientConfig = {
  languageId: 'cpp',
  connection: {
    options: {
      $type: 'WebSocketUrl',
      url: `ws://${import.meta.env.VITE_LSP_HOST ?? 'localhost'}:3000/lsp`,
    },
  },
  clientOptions: {
    documentSelector: [{ language: 'cpp' }, { language: 'c++' }],
    workspaceFolder: {
      index: 0,
      name: 'arduino-workspace',
      uri: URI.file(workspaceRoot),
    },
  },
}

export const editorAppConfig: EditorAppConfig = {
  codeResources: {
    modified: {
      text: defaultCode,
      uri: URI.file(filePath).toString(),
      enforceLanguageId: 'cpp',
    },
  },
  useDiffEditor: false,
}
