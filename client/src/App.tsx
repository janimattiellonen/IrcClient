import { Routes, Route, Link } from 'react-router';
import { HomePage } from './pages/HomePage';
import { ChannelPage } from './pages/ChannelPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <div>
      <nav style={{
        padding: '10px 20px',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#f5f5f5'
      }}>
        <Link to="/" style={{ marginRight: '20px' }}>Home</Link>
        <Link to="/channel/general" style={{ marginRight: '20px' }}>
          #general
        </Link>
        <Link to="/channel/random" style={{ marginRight: '20px' }}>
          #random
        </Link>
        <Link to="/settings">Settings</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/channel/:channel" element={<ChannelPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
