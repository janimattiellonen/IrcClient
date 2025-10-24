import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { SocketProvider } from './contexts/SocketContext';
import { IrcSessionProvider } from './contexts/IrcSessionContext';
import { IrcChannelProvider } from './contexts/IrcChannelContext.tsx';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <IrcSessionProvider>
        <IrcChannelProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </IrcChannelProvider>
      </IrcSessionProvider>
    </BrowserRouter>
  </StrictMode>
);
