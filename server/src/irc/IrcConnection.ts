import { TcpClient } from './TcpClient';
import { IrcProtocol } from './IrcProtocol';
import { genericServerMessage, serverChannelUserList } from '../messages/serverMessages';
import { AppMessage } from 'shared/messageTypes';

export type IrcConnectionConfig = {
  host: string;
  port: number;
  nickname: string;
};

type IrcConnectionEvents = {
  onRegistered: () => void;
  onMessage: (raw: string, parsed: AppMessage) => void;
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
        // https://www.ietf.org/rfc/rfc1459.txt
        // https://datatracker.ietf.org/doc/html/rfc2812
        console.log(`IrcConnection, onData, start`);

        const lines = data.toString().split('\r\n');

        for (const line of lines) {
          if (!line) {
            continue;
          }

          console.log(`IrcConnection, onData: ${line}`);

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

  private handleIrcMessage(raw: string, events: IrcConnectionEvents) {
    console.log(`handleIrcMessage, raw: ${JSON.stringify(raw, null, 2)}`);

    if (IrcProtocol.isServerCommand(raw)) {
      const parsed = IrcProtocol.parseCommand(raw);

      console.log(`handleIrcMessage, command, parsed: ${JSON.stringify(parsed, null, 2)}`);

      if (parsed.command === 'PING') {
        this.sendPong(parsed.params[0]);
      }
    } else {
      const parsed = IrcProtocol.parseMessage(raw);
      console.log(`handleIrcMessage, message, parsed: ${JSON.stringify(parsed, null, 2)}`);

      switch (parsed.replyCode) {
        case '353': {
          events.onMessage(raw, serverChannelUserList(parsed));
          break;
        }
        default: {
          events.onMessage(raw, genericServerMessage(parsed));
          break;
        }
      }

      console.log(`handleIrcMessage, parsed: ${JSON.stringify(parsed, null, 2)}`);
      //events.onMessage({raw, parsed});
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
