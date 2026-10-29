// RustBB behind xenia, with HTTPS certificates from Let's Encrypt.
//
// Install as /etc/xenia/xenia.conf.js on a host with the xenia-server
// package (xenia 0.17 or newer). The packaged service already listens on
// port 80, which Let's Encrypt's HTTP-01 challenges need, so this config only
// adds the HTTPS listeners. Point the domain's DNS at the host first, then:
//
//   sudo xenia check /etc/xenia/xenia.conf.js && sudo systemctl reload xenia
//
// RustBB itself listens on 127.0.0.1:8080 (RUSTBB_BIND) with
// RUSTBB_BASE_URL=https://forum.example.com and RUSTBB_TRUST_PROXY=1.

import { defineConfig } from 'xenia';

export default defineConfig({
  server: {
    listen: [
      { address: '0.0.0.0:443', tls: true },
      { address: '[::]:443', tls: true },
    ],
  },
  tls: {
    acme: {
      email: 'ops@example.com',
      // Try the setup against staging first: its limits are far higher.
      // directory: 'https://acme-staging-v02.api.letsencrypt.org/directory',
    },
    redirect: true, // plain HTTP gets 308 to https://, challenges first
    hsts: true,
  },
  upstreams: {
    rustbb: { servers: ['127.0.0.1:8080'] },
  },
  routes: [
    { host: 'forum.example.com', prefix: '/', proxy: 'rustbb', compress: true },
  ],
});
