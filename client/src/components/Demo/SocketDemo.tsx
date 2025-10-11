import { useState, FormEvent } from 'react';
import { useSocket } from '../../hooks/useSocket';

export const SocketDemo = () => {
  const [message, setMessage] = useState('');
  const { isConnected, sendMessage, responses } = useSocket();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Socket.IO Demo</h1>

      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong>{' '}
        <span style={{ color: isConnected ? 'green' : 'red' }}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a message..."
          style={{
            padding: '10px',
            width: '70%',
            marginRight: '10px',
            fontSize: '16px'
          }}
          disabled={!isConnected}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: isConnected ? 'pointer' : 'not-allowed'
          }}
          disabled={!isConnected}
        >
          Send
        </button>
      </form>

      <div>
        <h2>Responses:</h2>
        <div style={{
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '200px',
          maxHeight: '400px',
          overflowY: 'auto',
          backgroundColor: '#f5f5f5'
        }}>
          {responses.length === 0 ? (
            <p style={{ color: '#999' }}>No responses yet...</p>
          ) : (
            responses.map((resp, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '10px',
                  padding: '10px',
                  backgroundColor: 'white',
                  borderRadius: '4px'
                }}
              >
                <div><strong>You sent:</strong> {resp.original}</div>
                <div style={{ color: '#0066cc' }}>
                  <strong>Server response:</strong> {resp.response}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {new Date(resp.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
