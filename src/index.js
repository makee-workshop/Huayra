import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import * as serviceWorker from './serviceWorker'

// HelmetProvider 為 react-helmet-async 必要的根節點 context provider
const root = createRoot(document.getElementById('root'))
root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
)

serviceWorker.unregister()
