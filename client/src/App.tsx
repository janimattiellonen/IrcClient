import { Routes, Route, Link } from 'react-router';
import { IrcPage } from './pages/IrcPage.tsx';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage.tsx';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <nav
        style={{
          padding: '10px 20px',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-dark)',
          flexShrink: 0,
        }}
      >
        <Link to="/" style={{ marginRight: '20px' }}>
          Home
        </Link>
        <Link to="/login" style={{ marginRight: '20px' }}>
          Login
        </Link>
        <Link to="/settings">Settings</Link>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 }}>
        <Routes>
          <Route path="/" element={<IrcPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
