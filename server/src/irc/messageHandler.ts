import { AppMessage, MESSAGE_JOIN_CHANNEL, MESSAGE_LOGIN } from 'shared/messageTypes';

import { connect } from './client';
import { Socket } from 'socket.io';

import { IrcConnectionManager } from './IrcConnectionManager';

let connectionManager: IrcConnectionManager;

export function initializeMessageHandler(manager: IrcConnectionManager): void {
  connectionManager = manager;
}

export function handleClientMessage(message: AppMessage, socket: Socket) {
  // example on how to automatically have access to the available properties
  // in payload
  if (message.type === MESSAGE_JOIN_CHANNEL) {
    console.log('handleClientMessage: JOIN_CHANNEL');
    console.log(`Message: ${JSON.stringify(message, null, 2)}`);
    const connection = connectionManager.getConnection(socket.id);

    if (connection) {
      console.log(`Connection FOUND for ${socket.id}`);
      connection.connection.joinChannel(message.payload.channel);
    } else {
      console.log(
        `Trying to join channel ${message.payload.channel}. No connection found for ${socket.id}`
      );
    }
  } else if (message.type === MESSAGE_LOGIN) {
    if (message.type === MESSAGE_LOGIN) {
      handleLogin(message.payload, socket);
    }
  } else {
    console.log(`UUGH`);
  }
}

function handleLogin(payload: { server: string; port: number; nickname: string }, socket: Socket) {
  connectionManager.createConnection(socket, {
    host: payload.server,
    port: payload.port,
    nickname: payload.nickname,
  });
}
