import { Socket } from 'socket.io';
import { IrcConnection } from './IrcConnection';


type ConnectionInfo = {
  connection: IrcConnection;
  nickname: string;
  server: string;
  registered: boolean;
};

export class IrcConnectionManager {
  private socket: Socket | undefined;

  private connections = new Map<string, ConnectionInfo>();

  setSocket(socket: Socket) {
    this.socket = socket;
  }

  createConnection(
    socket: Socket,
    config: {host: string, port: number, nickname: string}
  ) {

    const ircConnection = new IrcConnection({
      host: config.host,
      port: config.port,
      nickname: config.nickname
    });

    const connectionInfo: ConnectionInfo = {
      connection: ircConnection,
      nickname: config.nickname,
      server: config.host,
      registered: false,
    }

    this.connections.set(socket.id, connectionInfo);

    ircConnection.connect({
      onRegistered: () => {
        connectionInfo.registered = true;
        console.log(`IRC registration complete for ${socket.id}`);
        // TODO: Notify web client via Socket.IO
      },
      onMessage: (data) => {
        console.log(`IRC message for ${socket.id}:`, data.raw);
        console.log(`IRC message for ${socket.id}:`, JSON.stringify(data.parsed, null,2));
        // TODO: Forward to web client via Socket.IO

        socket.emit('message_response', {
          data: data.parsed.serverMessage
        });
      },
      onError: (error) => {
        console.error(`IRC error for ${socket.id}:`, error);
        // TODO: Notify web client via Socket.IO
      },
      onDisconnect: () => {
        console.log(`IRC disconnected for ${socket.id}`);
        this.connections.delete(socket.id);
        // TODO: Notify web client via Socket.IO
      }
    });
  }

  closeConnection(clientId: string){
    const connectionInfo = this.connections.get(clientId);

    if (connectionInfo) {
      connectionInfo.connection.close();
      this.connections.delete(clientId);
    }
  }

  getConnection(clientId: string): ConnectionInfo | null {
    return this.connections.get(clientId) ?? null;
  }
}