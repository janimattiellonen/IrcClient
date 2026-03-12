import { TcpClient } from './TcpClient';
import { IrcProtocol } from './IrcProtocol';
import { toServerEvent } from './MessageFactory';
import type { ServerEvent } from 'shared/protocol';

export type IrcConnectionConfig = {
  host: string;
  port: number;
  nickname: string;
};

type IrcConnectionEvents = {
  onRegistered: () => void;
  onMessage: (raw: string, parsed: ServerEvent) => void;
  onError: (error: Error) => void;
  onDisconnect: () => void;
};

export class IrcConnection {
  private tcpClient: TcpClient;
  private config: IrcConnectionConfig;
  private registered = false;

  constructor(config: IrcConnectionConfig) {
    this.config = config;
    this.tcpClient = new TcpClient();
  }

  connect(events: IrcConnectionEvents) {
    this.tcpClient.connect(this.config, {
      onConnect: () => {
        this.sendNick(this.config.nickname);
        this.sendUser(this.config.nickname);
      },
      onData: (data: Buffer) => {
        const lines = data.toString().split('\r\n');

        for (const line of lines) {
          if (!line) {
            continue;
          }

          this.handleIrcMessage(line, events);
        }
      },
      onError: events.onError,
      onClose: events.onDisconnect,
    });
  }

  joinChannel(channel: string) {
    this.tcpClient.send(`JOIN ${channel}\r\n`);
  }

  sendMessage(channel: string, message: string) {
    this.tcpClient.send(`PRIVMSG ${channel} :${message}\r\n`);
  }

  partChannel(channel: string) {
    this.tcpClient.send(`PART ${channel}\r\n`);
  }

  private handleIrcMessage(raw: string, events: IrcConnectionEvents) {
    const parsed = IrcProtocol.parseMessage(raw);

    if (!parsed) {
      return;
    }

    // Handle PING internally
    if (parsed.kind === 'command' && parsed.command === 'PING') {
      this.sendPong(parsed.params[0]);
      return;
    }

    // Convert to ServerEvent and forward to client
    const serverEvent = toServerEvent(parsed, raw);

    if (serverEvent) {
      events.onMessage(raw, serverEvent);
    }
  }

  private sendNick(nick: string) {
    this.tcpClient.send(IrcProtocol.formatNick(nick));
  }

  private sendPong(ping: string) {
    this.tcpClient.send(IrcProtocol.formatPong(ping));
  }

  private sendUser(nick: string) {
    this.tcpClient.send(IrcProtocol.formatUser(nick, 'Irc User'));
  }

  close() {
    this.tcpClient.disconnect();
  }
}
