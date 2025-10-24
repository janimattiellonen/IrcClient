import './ChannelBar.css';

import { ChannelButton } from './ChannelButton.tsx';
import { useIrcChannelContext } from '../../hooks/useIrcChannelContext.ts';

export function ChannelBar() {
  const { channels, activeChannel, setActiveChannel } = useIrcChannelContext();

  const handleChannelClick = (channelName: string) => {
    setActiveChannel(channelName);
  };

  return (
    <div className={'channel-bar'}>
      {channels.map((channel) => (
        <ChannelButton
          key={channel.name}
          name={channel.name}
          isActive={activeChannel?.name === channel.name}
          onClick={handleChannelClick}
        />
      ))}
    </div>
  );
}
