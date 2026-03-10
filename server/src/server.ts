import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Server as SocketIOServer } from 'socket.io';
import type { ClientMessage } from '../../shared/protocol';
import { handleClientMessage, initializeMessageHandler } from './irc/messageHandler';
import { IrcConnectionManager } from './irc/IrcConnectionManager';

const fastify = Fastify({
  logger: true,
});

// Enable CORS
await fastify.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Vite ports
  credentials: true,
});

// Start Fastify server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server listening on http://localhost:3001');

    // Attach Socket.IO to the Fastify server
    const io = new SocketIOServer(fastify.server, {
      cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
      },
    });

    //let currentSocket = null;
    const connectionManager = new IrcConnectionManager();
    initializeMessageHandler(connectionManager);

    // Socket.IO connection handler
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      //currentSocket = socket;
      //connectionManager.setSocket(socket);

      // Echo handler - receives message and sends back a response
      socket.on('send_message', (data: { message: ClientMessage }) => {
        handleClientMessage(data.message, socket);
        console.log('Received message:', JSON.stringify(data.message, null, 2));

        // parse incoming message
        // find suitable handler
        // process request
        // respond to client
/*
        // Echo back with a response
        socket.emit('message_response', {
          original: data.message,
          response: data.message,
          timestamp: new Date().toISOString(),
        });
        */
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
