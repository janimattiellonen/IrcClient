export type Command<T extends string, P> = {
  type: T;
  payload: P;
  originalInput: string;
  isValid: boolean;
};

export const COMMAND_JOIN = 'JOIN';
export const COMMAND_PRIVMSG = 'PRIVMSG';
// Add more commands as needed

export type JoinPayload = {
  channel: string | null;
};

export type PrivMsgPayload = {
  recipient: string;
  message: string;
};

export type CommandRegistry = {
  [COMMAND_JOIN]: JoinPayload;
  [COMMAND_PRIVMSG]: PrivMsgPayload;
  // Add new commands here
};

export type IrcCommand = {
  [K in keyof CommandRegistry]: Command<K, CommandRegistry[K]>;
}[keyof CommandRegistry];

// For invalid commands
export type InvalidCommand = {
  type: 'INVALID';
  originalInput: string;
  isValid: false;
  payload: Record<string, never>;
};
