import { Link } from 'react-router';

export const SettingsPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Link to="/" style={{ marginBottom: '20px', display: 'inline-block' }}>
        &larr; Back to Home
      </Link>
      <h1>Settings</h1>
      <p>Configure your IRC client settings here.</p>

      <div style={{ marginTop: '20px' }}>
        <h2>Connection Settings</h2>
        <p style={{ color: '#666' }}>Server configuration options will go here.</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>User Preferences</h2>
        <p style={{ color: '#666' }}>User preferences will go here.</p>
      </div>
    </div>
  );
};
