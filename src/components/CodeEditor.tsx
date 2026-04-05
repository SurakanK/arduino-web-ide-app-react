import type { EditorAppConfig } from 'monaco-languageclient/editorApp'
import type { LanguageClientConfig } from 'monaco-languageclient/lcwrapper'
import type { MonacoVscodeApiConfig } from 'monaco-languageclient/vscodeApiWrapper'

import { URI } from 'vscode-uri'
import { Box } from '@chakra-ui/react'
import { MonacoEditorReactComp } from '@typefox/monaco-editor-react'
import { configureDefaultWorkerFactory } from 'monaco-languageclient/workerFactory'

const workspaceRoot = '/Users/Surakan/arduino-lsp-server-api/arduino-workspace'
const filePath = `${workspaceRoot}/arduino-workspace.ino`

import '@codingame/monaco-vscode-theme-defaults-default-extension'
import '@codingame/monaco-vscode-cpp-default-extension'
import '@codingame/monaco-vscode-json-default-extension'

import { LogLevel } from '@codingame/monaco-vscode-api'

const defaultCode = 
`void setup() {
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:

}`

function CodeEditor() {
  const vscodeApiConfig: MonacoVscodeApiConfig = {
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

  const languageClientConfig: LanguageClientConfig = {
    languageId: 'cpp',
    connection: {
      options: {
        $type: 'WebSocketUrl',
        url: 'ws://localhost:3000/lsp',
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

  const editorAppConfig: EditorAppConfig = {
    codeResources: {
      modified: {
        text: defaultCode,
        uri: URI.file(filePath).toString(),
        enforceLanguageId: 'cpp',
      },
    },
    useDiffEditor: false,
  }

  return (
    <Box width="100%" height="100vh">
      <MonacoEditorReactComp
        style={{ width: '100%', height: '100%' }}
        editorAppConfig={editorAppConfig}
        languageClientConfig={languageClientConfig}
        vscodeApiConfig={vscodeApiConfig}
        onEditorStartDone={(editorApp) => {
          setTimeout(() => {
            editorApp?.updateCode({ modified: defaultCode })
          }, 300)
        }}
        onError={(e) => console.error('LSP Error:', e)}
      />
    </Box>
  )
}

export default CodeEditor
