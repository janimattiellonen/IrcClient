import {
  ChannelUserListServerMessagePayload,
  GenericServerMessagePayload,
  Message,
  SERVER_MESSAGE_CHANNEL_USER_LIST,
  SERVER_MESSAGE_GENERIC_MESSAGE,
} from 'shared/messageTypes';

type ServerChannelUserListProps = {
  channel: string;
  channelType: string;
  host: string;
  nicks: string[];
  replyCode: string;
};

export function serverChannelUserList(
  params: ServerChannelUserListProps,
): Message<typeof SERVER_MESSAGE_CHANNEL_USER_LIST, ChannelUserListServerMessagePayload> {
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
