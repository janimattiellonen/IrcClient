import './IrcView.css';
import { useCallback } from 'react';
import { Input } from '../components/Input.tsx';
import { ConversationBar } from '../components/channels/ConversationBar.tsx';
import { UserBar } from '../components/users/UserBar.tsx';
import type { UserAction } from '../components/users/UserContextMenu.tsx';
import { useIrcConversationContext } from '../hooks/useIrcConversationContext.ts';
import type { TimestampedEvent } from '../contexts/SocketContextDefinition.ts';
import { isChannel, type ConversationMessage, type User } from '../utils/ConversationManager.ts';
import { formatTimestamp } from '../utils/formatTimestamp.ts';

type IrcViewProps = {
  handleInput: (message: string) => void;
  messages: TimestampedEvent[];
};

function renderGenericMessage({ event, timestamp }: TimestampedEvent) {
  if (event.type === 'SERVER_MESSAGE_GENERIC_MESSAGE') {
    return <span>{formatTimestamp(timestamp)} {event.payload.message}</span>;
  }

  return null;
}

function renderConversationMessage(message: ConversationMessage) {
  return (
    <span>
      {formatTimestamp(message.timestamp)} <strong>{message.source}</strong>: {message.message}
    </span>
  );
}

export function IrcView({ handleInput, messages }: IrcViewProps) {
  const { activeConversation, addConversation, setActiveConversation, getConversation } = useIrcConversationContext();

  const isConsole = !activeConversation || activeConversation.name === 'Console';
  const showUserBar = activeConversation && isChannel(activeConversation) && !isConsole;
  const showTopic = activeConversation && isChannel(activeConversation) && !isConsole && activeConversation.topic;

  const handleUserAction = useCallback((action: UserAction, user: User) => {
    if (action === 'private_message') {
      const existing = getConversation(user.nick);

      if (!existing) {
        addConversation({
          kind: 'private',
          name: user.nick,
          messages: [],
        });
      }

      setActiveConversation(user.nick);
      return;
    }

    console.log(`User action: ${action} on ${user.nick}`);
  }, [addConversation, setActiveConversation, getConversation]);

  return (
    <div className={'irc-view'}>
      <div className={'irc-view-channel-bar'}>
        <ConversationBar />
      </div>

      <div className={'irc-view-content'}>
        {showTopic && (
          <div className={'irc-view-topic'}>{activeConversation.topic}</div>
        )}

        <div className={'irc-view-main'}>
          <div className={'irc-view-output'}>
            {isConsole
              ? messages.map((message, i) => (
                  <p key={i}>{renderGenericMessage(message)}</p>
                ))
              : activeConversation.messages.map((message) => (
                  <p key={message.id}>{renderConversationMessage(message)}</p>
                ))}
          </div>

          {showUserBar && <UserBar users={activeConversation.users} onUserAction={handleUserAction} />}
        </div>

        <div className={'irc-view-input'}>
          <Input handleInput={handleInput} />
        </div>
      </div>
    </div>
  );
}
