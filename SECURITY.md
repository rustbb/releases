# Security policy

## Reporting a vulnerability

Report it privately, not in an issue: on this repository's **Security** tab, choose **Report a vulnerability** ([GitHub's private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)). Only the maintainers see it.

Say what you found and how to reproduce it: the RustBB version (`rustbb --version`), the settings that matter (never a token or a secret), and the requests or steps that show it. A proof of concept helps; a fix is not expected.

## What happens next

- We acknowledge the report within 3 working days, and say what we make of it within 10.
- A confirmed vulnerability gets a fix in a new release, an advisory on this repository with a CVE where one applies, and credit to you unless you prefer otherwise. The [changelog](CHANGELOG.md) says which release fixes it.
- We ask that you keep it private until the release is out, or for 90 days, whichever comes first.

## Supported versions

Fixes go into the newest release, as a new version; earlier versions are not patched, before 1.0 or after. From 1.0 on, upgrading within 1.x keeps settings, commands and addresses working, as [Stability](https://rustbb.github.io/stability/) promises; [Upgrading](https://rustbb.github.io/upgrading/) explains how.

## Scope

RustBB itself, as published here and as `ofkindness/rustbb` on Docker Hub: the server and its pages, signing in and sessions, permissions, uploads, the admin area, the command line, the phpBB importer, the packages and the install script. Vulnerabilities in a component it contains (see [THIRD-PARTY-LICENSES](THIRD-PARTY-LICENSES)) are in scope when RustBB's use of it is affected; we then update the component in a new release. The operator's own server, web server and TLS setup are not.
