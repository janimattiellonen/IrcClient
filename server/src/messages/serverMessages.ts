import {
  type ChannelUserJoinPayload,
  type ChannelUserListPayload,
  type ChannelUserMessagePayload,
  type ErrorPayload,
  type GenericServerMessagePayload,
  type Message,
  SERVER_MESSAGE_CHANNEL_USER_JOIN,
  SERVER_MESSAGE_CHANNEL_USER_LIST,
  SERVER_MESSAGE_CHANNEL_USER_MESSAGE,
  SERVER_MESSAGE_ERROR,
  SERVER_MESSAGE_GENERIC_MESSAGE,
} from 'shared/protocol';

type ServerChannelUserListProps = {
  channel: string;
  channelType: string;
  host: string;
  nicks: string[];
  replyCode: string;
};

export function serverChannelUserList(
  params: ServerChannelUserListProps,
): Message<typeof SERVER_MESSAGE_CHANNEL_USER_LIST, ChannelUserListPayload> {
  const { channel, channelType, host, nicks, replyCode } = params;

  return {
    type: SERVER_MESSAGE_CHANNEL_USER_LIST,
    payload: {
      host,
      replyCode,
      channel,
      channelType,
      nicks,
    },
  };
}

type ServerChannelJoinProps = {
  channel: string;
  user: {
    user: string;
    nick: string;
    host: string;
  };
};

export function serverChannelUserJoin(
  params: ServerChannelJoinProps,
): Message<typeof SERVER_MESSAGE_CHANNEL_USER_JOIN, ChannelUserJoinPayload> {
  const { channel, user } = params;

  return {
    type: SERVER_MESSAGE_CHANNEL_USER_JOIN,
    payload: {
      channel,
      user
    },
  };
}

type ServerChannelUserMessageProps = {
  channel: string;
  user: {
    user: string;
    nick: string;
    host: string;
  };
  message: string;
};


export function serverChannelUserMessage(
  params: ServerChannelUserMessageProps,
): Message<typeof SERVER_MESSAGE_CHANNEL_USER_MESSAGE, ChannelUserMessagePayload> {
  const { channel, user, message } = params;

  return {
    type: SERVER_MESSAGE_CHANNEL_USER_MESSAGE,
    payload: {
      channel,
      user,
      message
    },
  };
}

type GenericServerMessageProps = {
  host: string;
  replyCode: string;
  serverMessage: string;
};


export function genericServerMessage(
  params: GenericServerMessageProps,
): Message<typeof SERVER_MESSAGE_GENERIC_MESSAGE, GenericServerMessagePayload> {
  const { host, replyCode, serverMessage } = params;

  return {
    type: SERVER_MESSAGE_GENERIC_MESSAGE,
    payload: {
      host,
      replyCode,
      message: serverMessage,
    },
  };
}

type ServerErrorProps = {
  code?: string;
  message: string;
};

export function serverError(
  params: ServerErrorProps,
): Message<typeof SERVER_MESSAGE_ERROR, ErrorPayload> {
  return {
    type: SERVER_MESSAGE_ERROR,
    payload: {
      code: params.code,
      message: params.message,
    },
  };
}
