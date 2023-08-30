# Rotate Right (Playbook Plugin)

An example plugin that rotates PNGs right by 90°.

## Development

Edit `src/plugin.mjs` to change the behavior of the plugin. Try making it rotate left!

Development works out of the box with a Node server and ngrok.

```
yarn dev # starts a server listening at localhost:3000

ngrok http 3000 # exposes port 3000 to the internet, giving you a public invocation URL
```

When you create your Sandbox plugin from https://www.playbook.com/account, set your
`ngrok` URL as the invocation URL. You can develop your plugin by triggering it from
your Playbook workspace with any test files you've uploaded.

## Releasing a public version

There are two ways to release your plugin (making it available to everyone):

### Run on Playbook infrastructure

Submit your Github repository to the Playbook team. We'll audit your code, then deploy
your plugin using our infrastructure. You'll still be listed as the plugin author,
and the plugin will get a verified badge. Playbook will subtract the operational
costs out of your proceeds.

To apply, email alex@playbook.com with a link to your Github repository.

### Deploy on your own infrastructure

You deploy your plugin in any way you like. Your plugin won't have a verified badge,
but you'll remain in full control of your costs and infrastructure.

Note that your plugin still must comply with the Playbook Developer Terms of Service.

The Playbook team will still need to review your plugin to mark it as live. Email
alex@playbook.com with a short description of what your plugin does, and the email
on your Playbook Developer account.