# Changelog

What changed in each RustBB release, for the people who run a forum. Each
release says whether it migrates the database; a migrating release cannot be
rolled back without the backup taken before the upgrade.

A release tag `vX.Y.Z` needs a `## X.Y.Z` section here.

## 0.2.0

The first public release. RustBB is a classic forum (categories, forums,
topics and posts) in one executable with SQLite built in: sign-in through
Telegram with no passwords or email, user, moderator and administrator
roles, open, invitation-only or closed registration, Markdown posts,
moderation, rate limits and bans, administration pages and a command line.
Archives for Linux (static, x86_64 and arm64), macOS (arm64 and x86_64) and
Windows (x86_64), and an image for amd64 and arm64.

Database: a new forum's database is created on first start; no migration
from the 0.1.0 proof of concept.

Since the proof of concept:

- RustBB is distributed under the RustBB License (`LICENSE` in every
  archive, `/licenses` in the image): free to use for any purpose,
  including hosting forums for others, closed source.
- Releases are signed with cosign: `SHA256SUMS` and the image can be
  verified as the README describes. The image is `ofkindness/rustbb`, for
  amd64 and arm64.
- `rustbb --version` prints the version, the commit it was built from and
  the build date, and the server logs the same line when it starts.
- The footer shows the running version, for example "Powered by RustBB
  0.2.0". `RUSTBB_SHOW_VERSION=0` hides it.
- `rustbb licenses` prints the licenses of the open-source components built
  into the binary; every archive has them as `THIRD-PARTY-LICENSES` too.
- The static Linux binaries use the mimalloc allocator, which holds up
  better than musl's under concurrent load.
