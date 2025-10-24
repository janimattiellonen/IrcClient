import { useForm } from 'react-hook-form';
import { useRef, useEffect } from 'react';
import { useSocketContext } from '../hooks/useSocketContext';
import { useIrcSessionContext } from '../hooks/useIrcSessionContext';
import { loginMessage } from '../messages/messages.ts';

interface LoginFormData {
  nickname: string;
  serverAddress: string;
  port: string;
}

function LoginForm() {
  const { connect, disconnect, isConnected, sendMessage } = useSocketContext();
  const { nickname, server, setNickname, setServer, port, setPort } = useIrcSessionContext();
  const pendingLoginRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      nickname: nickname || 'jme',
      serverAddress: server || 'localhost',
      port: port ? String(port) : '6667',
    },
  });

  // Watch for connection establishment after login attempt
  useEffect(() => {
    if (isConnected && pendingLoginRef.current) {
      pendingLoginRef.current = false; // Reset flag immediately

      // Make API call once connection is established
      console.log('Connection established! Making login API request...');
      console.log('Nickname:', nickname);
      console.log('Server:', server);
      console.log('Port:', port);

      const loginMsg = loginMessage(nickname, server, port);

      sendMessage(loginMsg);

      // TODO: Make your actual API call here
      // Example:
      // fetch('/api/irc/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ nickname, server })
      // }).then(response => response.json())
      //   .then(data => console.log('Login successful:', data))
      //   .catch(error => console.error('Login failed:', error));
    }
  }, [isConnected, nickname, server, sendMessage]);

  const onSubmit = async (data: LoginFormData) => {
    console.log('Login form submitted:', data);

    setNickname(data.nickname);
    setServer(data.serverAddress);
    setPort(parseInt(data.port, 10));

    if (!isConnected) {
      pendingLoginRef.current = true; // Set flag before connecting
      connect();
    } else {
      disconnect();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="nickname"
          style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
        >
          Nickname
        </label>
        <input
          id="nickname"
          type="text"
          {...register('nickname', {
            required: 'Nickname is required',
            minLength: {
              value: 2,
              message: 'Nickname must be at least 2 characters',
            },
            maxLength: {
              value: 20,
              message: 'Nickname must be less than 20 characters',
            },
            pattern: {
              value: /^[a-zA-Z0-9_-]+$/,
              message: 'Nickname can only contain letters, numbers, hyphens, and underscores',
            },
          })}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: errors.nickname ? '2px solid #cc0000' : '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
          placeholder="Enter your nickname"
        />
        {errors.nickname && (
          <span style={{ color: '#cc0000', fontSize: '14px', marginTop: '4px', display: 'block' }}>
            {errors.nickname.message}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="serverAddress"
          style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
        >
          Server Address
        </label>
        <input
          id="serverAddress"
          type="text"
          {...register('serverAddress', {
            required: 'Server address is required',
          })}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: errors.serverAddress ? '2px solid #cc0000' : '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
          placeholder="localhost"
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="port" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Port
        </label>
        <input
          id="port"
          type="number"
          {...register('port', {
            required: 'Port is required',
          })}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: errors.port ? '2px solid #cc0000' : '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
          placeholder="6667"
        />

        {errors.port && (
          <span style={{ color: '#cc0000', fontSize: '14px', marginTop: '4px', display: 'block' }}>
            {errors.port.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: isSubmitting ? '#999' : '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
        }}
      >
        {isSubmitting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
      </button>
    </form>
  );
}

export function LoginPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Connect to IRC Server</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Enter your nickname and server address to connect.
      </p>
      <LoginForm />
    </div>
  );
}
