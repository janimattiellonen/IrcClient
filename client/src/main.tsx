import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { SocketProvider } from './contexts/SocketContext'
import {IrcSessionProvide} from './contexts/IrcSessionContext.tsx';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <IrcSessionProvide>
        <SocketProvider>
          <App />
        </SocketProvider>
      </IrcSessionProvide>
    </BrowserRouter>
  </StrictMode>,
)
