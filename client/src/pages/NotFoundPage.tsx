import { Link } from 'react-router';

export const NotFoundPage = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ color: '#0066cc', textDecoration: 'underline' }}>
        Go back to Home
      </Link>
    </div>
  );
};
