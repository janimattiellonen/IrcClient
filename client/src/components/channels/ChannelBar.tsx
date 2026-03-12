import './ChannelBar.css';

import { ChannelButton } from './ChannelButton.tsx';
import { useIrcChannelContext } from '../../hooks/useIrcChannelContext.ts';
import { useSocketContext } from '../../hooks/useSocketContext.ts';
import { partChannelMessage } from '../../messages/messages.ts';

export function ChannelBar() {
  const { channels, activeChannel, channelsWithUnread, setActiveChannel } = useIrcChannelContext();
  const { sendMessage } = useSocketContext();

  const handleChannelClick = (channelName: string) => {
    setActiveChannel(channelName);
  };

  const handlePart = (channelName: string) => {
    sendMessage(partChannelMessage(channelName));
  };

  return (
    <div className={'channel-bar'}>
      {channels.map((channel) => (
        <ChannelButton
          key={channel.name}
          name={channel.name}
          isActive={activeChannel?.name === channel.name}
          hasUnread={channelsWithUnread.has(channel.name)}
          isPartable={channel.name !== 'Console'}
          onClick={handleChannelClick}
          onPart={handlePart}
        />
      ))}
    </div>
  );
}
