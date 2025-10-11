# Ergo IRC Test Server

This is a local IRC server setup for testing your IRC client without risk of k-lines or affecting production servers.

## Quick Start

```bash
# Start the server
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the server
docker-compose down
```

## Connection Details

- **Host:** `localhost` or `127.0.0.1`
- **Port:** `6667` (plain text)
- **Server Name:** `irc.local.test`
- **No password required**

## Test-Friendly Features

This configuration has:
- ✅ **No rate limiting** - spam away for testing
- ✅ **No connection throttling** - reconnect as fast as you want
- ✅ **No email verification** - register accounts instantly
- ✅ **High message limits** - test long messages
- ✅ **Message history** - 1000 messages per channel
- ✅ **IRCv3 capabilities** - test modern IRC features
- ✅ **Debug logging** - see what's happening

## Testing Account Registration

```irc
# Register a nickname
/msg NickServ REGISTER mypassword

# Identify with your account
/msg NickServ IDENTIFY mypassword
```

## Operator Access (for advanced testing)

If you need operator privileges for testing:
```irc
/OPER testoper test123
```

## Resetting the Server

To start with a completely fresh state:
```bash
docker-compose down -v
rm -rf irc-data/ircd.db
docker-compose up -d
```

## Customizing Configuration

Edit `irc-data/ircd.yaml` to customize:
- Server name and MOTD
- Channel modes and limits
- Enable/disable features
- Add more operator accounts

After changing config, restart the server:
```bash
docker-compose restart
```

## Common Test Scenarios

### Testing Reconnection Logic
```bash
# Kill the server suddenly
docker-compose kill

# Start it again
docker-compose up -d
```

### Testing Multiple Clients
Connect multiple instances of your client - no connection limits!

### Testing Channel Operations
- Create channels (no registration required)
- Test ops, voice, bans, etc.
- Test topic changes and modes

## Troubleshooting

**Can't connect?**
```bash
# Check if server is running
docker-compose ps

# Check logs
docker-compose logs
```

**Config errors?**
```bash
# Validate configuration
docker-compose config
```

**Port already in use?**
Change the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "6668:6667"  # Use port 6668 instead
```
