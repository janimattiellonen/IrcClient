import { useForm } from 'react-hook-form';
import { useSocketContext } from '../contexts/SocketContext';

interface LoginFormData {
  nickname: string;
  serverAddress: string;
}

function LoginForm() {
  const { connect } = useSocketContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      serverAddress: 'localhost:3000',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Login form submitted:', data);
    // TODO: Connect to IRC server with nickname
    connect();
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
          placeholder="localhost:3000"
        />
        {errors.serverAddress && (
          <span style={{ color: '#cc0000', fontSize: '14px', marginTop: '4px', display: 'block' }}>
            {errors.serverAddress.message}
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
        {isSubmitting ? 'Connecting...' : 'Connect'}
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