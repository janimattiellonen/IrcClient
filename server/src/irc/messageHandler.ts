import { type ClientMessage, MESSAGE_JOIN_CHANNEL, MESSAGE_LOGIN, MESSAGE_SEND_MESSAGE } from 'shared/protocol';

import { connect } from './client';
import { Socket } from 'socket.io';

import { IrcConnectionManager } from './IrcConnectionManager';

let connectionManager: IrcConnectionManager;

export function initializeMessageHandler(manager: IrcConnectionManager): void {
  connectionManager = manager;
}

export function handleClientMessage(message: ClientMessage, socket: Socket) {
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
    handleLogin(message.payload, socket);
  } else if (message.type === MESSAGE_SEND_MESSAGE) {
    const connection = connectionManager.getConnection(socket.id);

    if (connection) {
      connection.connection.sendMessage(message.payload.channel, message.payload.message);
    }
  } else {
    const _exhaustive: never = message;
    console.log(`Unhandled message type: ${JSON.stringify(_exhaustive)}`);
  }
}

function handleLogin(payload: { server: string; port: number; nickname: string }, socket: Socket) {
  connectionManager.createConnection(socket, {
    host: payload.server,
    port: payload.port,
    nickname: payload.nickname,
  });
}
