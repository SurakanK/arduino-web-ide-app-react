import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

window.MonacoEnvironment = {
  getWorker: (_: string, _label: string) => {
    return new Worker(
      new URL('@codingame/monaco-vscode-api/workers/editor.worker', import.meta.url),
      { type: 'module' }
    )
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
  </StrictMode>
)