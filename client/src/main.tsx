import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { SocketProvider } from './contexts/SocketContext'
import { IrcSessionProvider } from './contexts/IrcSessionContext';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <IrcSessionProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </IrcSessionProvider>
    </BrowserRouter>
  </StrictMode>,
)
