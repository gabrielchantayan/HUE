# HUE
## A color-changing Discord bot
HUE is a Discord bot that allows for color changing roles

## Requirements
- Node.JS
- A Discord bot account
- A brain

## How to setup the bot
Setup of HUE is simple to do
1. Change `token` in `config.json` to your bot's token
2. Change `owner` to your Discord ID
3. Invite HUE to a server

## How to add roles
1. Type the command `c.roles`
2. Stop the bot with either `c.stop` or by disabling its permissions to modify roles
3. Add the desired role in server settings by naming it exactly how it is in `c.roles`
4. Resume the bot with either `c.resume` or by enabling its permissions to modify roles

## Troubleshooting
**Q: HUE is spamming my server's audit log, is there anything I can do about it?**

A: Sadly, no. Due to the way Discord's moderation logging works, any changed by any user, including bots, will show up in the log


**Q: I can't edit my server's roles**

A: To edit your server's roles, just disable HUE by typing  `c.stop` or by removing its permissions to modify roles


**Q: The `c.stop` command isn't working**

A: This is a known bug that I have been unable to fix. The current workaround is to disable HUE's permissions to modify roles