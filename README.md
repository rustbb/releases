# RustBB

A lightweight bulletin board: categories, forums, topics and posts, with
sign-in through Telegram. One executable with SQLite built in; it runs on a
small VPS in a few tens of megabytes of memory.

The documentation is at <https://rustbb.github.io>: getting started,
configuration, deployment, Docker, upgrading and more. This file is the
short version.

## What is in this archive

| File | What it is |
| --- | --- |
| `rustbb` (`rustbb.exe` on Windows) | The forum: web server, database and command line in one |
| `env.example` | Every setting, as environment variables |
| `deploy/rustbb.service` | A systemd unit |
| `deploy/xenia.conf.js` | A config for the [Xenia](https://xenia-platform.github.io) web server in front of RustBB |
| `deploy/Caddyfile`, `deploy/nginx.conf` | The same for Caddy or Nginx |
| `LICENSE` | The RustBB License: the terms you use RustBB under |
| `CHANGELOG.md` | What changed in each release, and whether it migrates the database |
| `THIRD-PARTY-LICENSES` | The licenses of the open-source components in the binary (`rustbb licenses` prints them too) |

`rustbb --version` prints the version, the build's commit and its date.

## Verify a download

Every release is signed with
[cosign](https://docs.sigstore.dev/cosign/system_config/installation/),
keyless: the signature names the workflow that published the release, so
there is no key to fetch. Check `SHA256SUMS` against its signature, then
the archive against `SHA256SUMS`, both from the release:

```sh
cosign verify-blob SHA256SUMS --bundle SHA256SUMS.sigstore.json \
    --certificate-identity https://github.com/rustbb/rustbb/.github/workflows/publish.yml@refs/heads/main \
    --certificate-oidc-issuer https://token.actions.githubusercontent.com
sha256sum -c --ignore-missing SHA256SUMS    # shasum -a 256 -c on macOS
```

The image is signed the same way: `cosign verify ofkindness/rustbb:VERSION`
with the same two options.

## Install on Linux with systemd

```sh
sudo install -m 755 rustbb /usr/local/bin/rustbb
sudo mkdir -p /etc/rustbb && sudo cp env.example /etc/rustbb/env   # then edit it
sudo cp deploy/rustbb.service /etc/systemd/system/
sudo systemctl enable --now rustbb
```

The database lives in `/var/lib/rustbb/`. Migrations run on every start;
before applying any, RustBB backs the database up next to it.
`env.example` ends with `RUSTBB_DEV_LOGIN`; release builds ignore it.

## Telegram

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy its token.
2. Send BotFather `/setdomain` with the forum's public domain.
3. Set `RUSTBB_TELEGRAM_BOT_TOKEN`, `RUSTBB_TELEGRAM_BOT_USERNAME` and
   `RUSTBB_BASE_URL` (the public `https://` address).
4. Put your own numeric Telegram id in `RUSTBB_ADMIN_TELEGRAM_ID`. That
   account becomes administrator the first time it signs in, and it can
   register without an invitation code, even in `INVITE` or `CLOSED` mode.
   Without this setting, create the first code with `rustbb invite create`
   and promote yourself with `rustbb user role <name> admin`.
5. In `INVITE` mode, people without a code can ask for an invitation from
   the registration form. The bot messages you about each request, and
   messages them when you approve it (Admin, Requests, or
   `rustbb request approve <id>`, which needs the server's settings for the
   bot and the database). The approval applies by itself when they log in.
   The bot can only write to accounts that allowed it at login, which the
   login widget asks for; the Requests page says when it could not. The
   server must be able to reach `api.telegram.org` over HTTPS.

## Docker

The image `ofkindness/rustbb` holds only the binary, for amd64 and arm64.
It keeps the database in the `/var/lib/rustbb` volume and listens on port
8080:

```sh
docker run -d --name rustbb -p 8080:8080 -v rustbb:/var/lib/rustbb \
    --env-file env ofkindness/rustbb:VERSION    # env: the settings from env.example
docker exec rustbb rustbb user list
```

## A web server in front

[Xenia](https://xenia-platform.github.io) is the recommended web server: it
proxies to the forum and gets and renews its HTTPS certificate by itself.
`deploy/xenia.conf.js` is a complete config for Xenia 0.17 or newer: replace
the domain and the email address, install it as `/etc/xenia/xenia.conf.js`,
check it with `xenia check` and reload Xenia. Caddy and Nginx work too, with
`deploy/Caddyfile` or `deploy/nginx.conf`.

Behind any of them set `RUSTBB_TRUST_PROXY=1` and the `https://` address in
`RUSTBB_BASE_URL`.

## Command line

```text
rustbb serve                    # the default
rustbb migrate
rustbb user list
rustbb user role <name> admin   # user | moderator | admin
rustbb user ban <name>
rustbb user unban <name>
rustbb invite create --uses 5 --days 7
rustbb invite create --for alice    # for one Telegram account; no code to type
rustbb invite list
rustbb request list             # people who asked for an invitation
rustbb request approve <id>     # invites them; the bot tells them
rustbb request decline <id>
rustbb backup /path/to/copy.db  # a consistent copy while the forum runs
rustbb licenses
rustbb --version
```

The commands read the same settings as the server and open the same
database. With the systemd unit above, run them the way the service runs,
not as root, so the database files keep their owner:

```sh
sudo systemd-run --pipe --wait --quiet -p DynamicUser=yes -p StateDirectory=rustbb \
    -p EnvironmentFile=/etc/rustbb/env -E RUSTBB_DATABASE_PATH=/var/lib/rustbb/rustbb.db \
    /usr/local/bin/rustbb user list
```

## macOS

The binaries are not notarized. After unpacking, clear the quarantine flag
before the first run: `xattr -d com.apple.quarantine rustbb`.
