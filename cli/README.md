# saycommit

Say commit. AI writes the commit message from your changes.

## Quick start

```
npm i -g saycommit
saycommit setup      # one time: paste a free Groq key (https://console.groq.com/keys)
saycommit            # in any git project
```

Or without installing: `npx saycommit`

## Options

- `saycommit -y` commit without asking
- `saycommit -p` push after committing
- `saycommit --dry-run` only show the message
- `saycommit --hint "fixing login"` give the AI context

## Privacy

Your staged diff (up to 30,000 characters) is sent to the AI provider you choose. Don't use it on code you can't share.

Requires Node 18+ and git. MIT license.