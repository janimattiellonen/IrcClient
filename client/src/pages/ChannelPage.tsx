import { useParams, Link } from 'react-router';

export const ChannelPage = () => {
  const { channel } = useParams<{ channel: string }>();

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/" style={{ marginBottom: '20px', display: 'inline-block' }}>
        &larr; Back to Home
      </Link>
      <h1>#{channel}</h1>
      <p>Channel view for: {channel}</p>
      <p style={{ color: '#666' }}>
        This is where the chat messages for this channel would appear.
      </p>
    </div>
  );
};
