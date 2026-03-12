import {
  type ChannelTopicPayload,
  type ChannelUserJoinPayload,
  type ChannelUserListPayload,
  type ChannelUserMessagePayload,
  type ChannelUserPartPayload,
  type ErrorPayload,
  type GenericServerMessagePayload,
  type Message,
  type PrivateMessagePayload,
  SERVER_MESSAGE_CHANNEL_TOPIC,
  SERVER_MESSAGE_CHANNEL_USER_JOIN,
  SERVER_MESSAGE_CHANNEL_USER_LIST,
  SERVER_MESSAGE_CHANNEL_USER_MESSAGE,
  SERVER_MESSAGE_CHANNEL_USER_PART,
  SERVER_MESSAGE_ERROR,
  SERVER_MESSAGE_GENERIC_MESSAGE,
  SERVER_MESSAGE_PRIVATE_MESSAGE,
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

type ServerChannelUserPartProps = {
  channel: string;
  user: {
    user: string;
    nick: string;
    host: string;
  };
};

export function serverChannelUserPart(
  params: ServerChannelUserPartProps,
): Message<typeof SERVER_MESSAGE_CHANNEL_USER_PART, ChannelUserPartPayload> {
  const { channel, user } = params;

  return {
    type: SERVER_MESSAGE_CHANNEL_USER_PART,
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

type ServerChannelTopicProps = {
  channel: string;
  topic: string;
  changedBy?: string;
};

export function serverChannelTopic(
  params: ServerChannelTopicProps,
): Message<typeof SERVER_MESSAGE_CHANNEL_TOPIC, ChannelTopicPayload> {
  return {
    type: SERVER_MESSAGE_CHANNEL_TOPIC,
    payload: {
      channel: params.channel,
      topic: params.topic,
      changedBy: params.changedBy,
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

type ServerPrivateMessageProps = {
  sender: {
    nick: string;
    user: string;
    host: string;
  };
  recipient: string;
  message: string;
};

export function serverPrivateMessage(
  params: ServerPrivateMessageProps,
): Message<typeof SERVER_MESSAGE_PRIVATE_MESSAGE, PrivateMessagePayload> {
  return {
    type: SERVER_MESSAGE_PRIVATE_MESSAGE,
    payload: {
      sender: params.sender,
      recipient: params.recipient,
      message: params.message,
    },
  };
}
