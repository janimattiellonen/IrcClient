export const IrcReplies = {
  RPL_WELCOME: '001',
  RPL_YOURHOST: '002',
  RPL_CREATED: '003',
  RPL_MYINFO: '004',
  RPL_ISUPPORT: '005',
  RPL_UMODEIS: '221',
  RPL_LUSERCLIENT: '251',
  RPL_LUSEROP: '252',
  RPL_LUSERUNKNOWN: '253',
  RPL_LUSERCHANNELS: '254',
  RPL_LUSERME: '255',
  RPL_LOCALUSERS: '265',
  RPL_GLOBALUSERS: '266',
  ERR_NOMOTD: '422',
} as const;

export type IrcReplyCode = (typeof IrcReplies)[keyof typeof IrcReplies];
export type IrcReplyName = keyof typeof IrcReplies;
