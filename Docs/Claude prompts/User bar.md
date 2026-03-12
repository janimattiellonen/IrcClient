# User bar

When in a channel, I want to show all channel users in a vertical bar on the right side of the main content.

The attached image shows the current layout (relevant parts):
- left side (gray):  vertical bar contains console and open channels
- right side (red): display contents of console and channels
- bottom (green): input field

Add a slot for the user bar. I'd like to have it on the right side of the window. It should be contained in the 
same area as the area colored in red.


## Context menu

Enter plan mode.

Certain channel user based actions would benefit from a context menu. For example, if I want to kick a user, 
give a user channel operator rights, send private message etc, I would select a user, and select a wanted action 
from the context menu.

## Implementation

I don't want to create an own context menu. I'd rather use an existing component. Suggest a modern npm package that 
provides an accessible context menu and preferrably other accessible ui comkponents that we may have use for later
on

## Initial (dummy) context menu

