import * as net from 'net';
import { Socket } from 'socket.io';

type ConnectionParams = {
  host: string;
  port: number;
  nickname: string;
  socket: Socket;
}

export function connect(params: ConnectionParams): net.Socket {
  const tcpSocket = net.createConnection({ host: params.host, port: params.port });


  const nickname = params.nickname;

  tcpSocket.on('connect', () => {
    // create actual irc commands in another place
    tcpSocket.write(`NICK ${nickname}\r\n`);
    tcpSocket.write('USER myuser 0 * :Real Name\r\n');
  });

  tcpSocket.on('data', (data) => {
    // Parse IRC protocol messages
  });

  return tcpSocket;

}