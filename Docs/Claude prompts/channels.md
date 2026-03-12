# Channels

## Message timestamps

I'd like to keep track of the time when a message was sent/received. Format would be hh:mm (24h format). 
For example:
- 09:45
- 19:57

The timestamp should be visible on every line before the actual message. The time should be displayed in a 
similar fashion both in the console window and in the channel window.

## Notification on new messages

Let's say I'm on channel #foo, but the channel is not currently open. If the channel #foo receives a new message, I'd
like the channel button for #foo indicate this. WHen I click on the #foo channel button, the indication should be 
removed.


## Channel topic

If the channel has a topic set, display it above the main content (red background). I'm not sure the client handles
topics yet (topic is set when joining channel or if someone changes the topic while I'm in the channel).


## Leaving channel

I want to be able to leave the channel either by clicking on a small cross icon in the channel button, or by typing the
/part command (or whatever the actual command is). Add the cross icon to the right side of the channel button. 

Make sure the indicator ball and check box both fit.

## Channel users

