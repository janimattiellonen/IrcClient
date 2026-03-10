# Architecture improvements

Analyze code in this project. Use deep thinking. Create a mental model of how the client and server work, the used 
architecture etc. Create an internal memory for you to use.

Look for improvement oppurtunities. Suggest improvements.

I want to have a clean protocol for communication between the ui (client) and backend (server).


## Channel message fixes

I have a rudimentary channel selection in use. When I join a channel, a new button is added to the button panel.

By default, there is one button titled "Console" where general messages go.

If I join "#foo", a button titled "#foo" is added. When I click the "#foo" button, the main content should show
messages targeted for that channel.

I'm testing with another real IRC client. I joined the same server and #foo channel. When I sent a "Haha" message,
I get 

```
IRC message for Z_YsmUpw47Z_yeSDAAAB: {
  "type": "SERVER_MESSAGE_CHANNEL_USER_MESSAGE",
  "payload": {
    "channel": "#foo",
    "user": {
      "nick": "jme80",
      "user": "~u",
      "host": "epmw7nfq4pm9w.irc"
    },
    "message": "Haha"
  }
}
```

in my cli but the message is never shown in the main content when #foo is active. Can you look for the issue?