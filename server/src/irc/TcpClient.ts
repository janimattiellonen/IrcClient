import * as net from 'node:net';
import { Socket } from 'socket.io';

type EventsType = {
  onConnect: () => void;
  onData: (data: Buffer) => void;
  onError: (error: Error) => void;
  onClose: () => void;
};

type ConnectionParams = {
  host: string;
  port: number;
};

export class TcpClient {
  private socket: net.Socket | null = null;

  connect(params: ConnectionParams, events: EventsType) {
    this.socket = net.createConnection({ host: params.host, port: params.port });

    this.socket.on('connect', events.onConnect);
    this.socket.on('data', events.onData);
    this.socket.on('error', events.onError);
    this.socket.on('close', events.onClose);
  }

  send(data: string): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    this.socket.write(data);
  }

  disconnect(): void {
    this.socket?.end();
    this.socket = null;
  }

  isConnected(): boolean {
    return this.socket !== null && !this.socket.destroyed;
  }
}
