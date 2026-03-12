import './ConversationBar.css';

import { ConversationButton } from './ConversationButton.tsx';
import { useIrcConversationContext } from '../../hooks/useIrcConversationContext.ts';
import { useSocketContext } from '../../hooks/useSocketContext.ts';
import { partChannelMessage } from '../../messages/messages.ts';
import { isChannel, isPrivateConversation } from '../../utils/ConversationManager.ts';

export function ConversationBar() {
  const { conversations, activeConversation, conversationsWithUnread, setActiveConversation, removeConversation } = useIrcConversationContext();
  const { sendMessage } = useSocketContext();

  const handleClick = (name: string) => {
    setActiveConversation(name);
  };

  const handleClose = (name: string) => {
    const conversation = conversations.find((c) => c.name === name);

    if (conversation && isChannel(conversation)) {
      sendMessage(partChannelMessage(name));
    } else {
      removeConversation(name);
    }
  };

  const consoleConversation = conversations.find((c) => c.name === 'Console');
  const channels = conversations
    .filter((c) => isChannel(c) && c.name !== 'Console')
    .sort((a, b) => a.name.localeCompare(b.name));
  const privateConversations = conversations
    .filter((c) => isPrivateConversation(c))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={'conversation-bar'}>
      {consoleConversation && (
        <ConversationButton
          key={consoleConversation.name}
          name={consoleConversation.name}
          isActive={activeConversation?.name === consoleConversation.name}
          hasUnread={conversationsWithUnread.has(consoleConversation.name)}
          isClosable={false}
          onClick={handleClick}
          onClose={handleClose}
        />
      )}

      {channels.length > 0 && (
        <>
          <div className="conversation-bar-section-label">Channels</div>
          {channels.map((conversation) => (
            <ConversationButton
              key={conversation.name}
              name={conversation.name}
              isActive={activeConversation?.name === conversation.name}
              hasUnread={conversationsWithUnread.has(conversation.name)}
              isClosable={true}
              onClick={handleClick}
              onClose={handleClose}
            />
          ))}
        </>
      )}

      {privateConversations.length > 0 && (
        <>
          <div className="conversation-bar-section-label">Messages</div>
          {privateConversations.map((conversation) => (
            <ConversationButton
              key={conversation.name}
              name={conversation.name}
              isActive={activeConversation?.name === conversation.name}
              hasUnread={conversationsWithUnread.has(conversation.name)}
              isClosable={true}
              onClick={handleClick}
              onClose={handleClose}
            />
          ))}
        </>
      )}
    </div>
  );
}
