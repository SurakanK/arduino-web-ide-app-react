import type { EditorApp, TextContents } from 'monaco-languageclient/editorApp'

import { MonacoEditorReactComp } from '@typefox/monaco-editor-react'

import {
  LSP_HOST,
  defaultCode,
  vscodeApiConfig,
  languageClientConfig,
  editorAppConfig,
} from './editorConfig'

function CodeEditor() {
  function syncCode(content: string) {
    fetch(`http://${LSP_HOST}:3000/code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    }).catch(() => {})
  }

  function onEditorStartDone(editorApp?: EditorApp) {
    setTimeout(() => {
      editorApp?.updateCode({ modified: defaultCode })
    }, 300)
  }

  function onTextChanged(textChanges: TextContents) {
    const content = textChanges.modified ?? textChanges.original ?? ''
    syncCode(content)
  }

  function onError(e: Error) {
    console.error('LSP Error:', e)
  }

  return (
    <div className="w-full h-screen">
      <MonacoEditorReactComp
        style={{ width: '100%', height: '100%' }}
        editorAppConfig={editorAppConfig}
        languageClientConfig={languageClientConfig}
        vscodeApiConfig={vscodeApiConfig}
        onEditorStartDone={onEditorStartDone}
        onTextChanged={onTextChanged}
        onError={onError}
      />
    </div>
  )
}

export default CodeEditor
