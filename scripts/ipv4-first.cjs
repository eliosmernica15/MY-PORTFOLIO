/**
 * Preload script: monkey-patch Node's `dns.lookup` to prefer IPv4 addresses.
 *
 * Why: on this Windows machine, `fonts.googleapis.com` resolves to both A and AAAA
 * records. `next/font/google` uses the bundled `node-fetch` (which doesn't expose
 * the `family` option) and Node's default `https.get` honours the OS resolver order
 * (IPv6 first), which times out for the broken IPv6 path. Forcing IPv4 here makes
 * the build complete reliably.
 *
 * Scope: only `dns.lookup` is patched; the rest of Node's networking is untouched.
 * This is opt-in via `node --require ./scripts/ipv4-first.cjs` in the `build` script.
 */
'use strict';

const dns = require('dns');
const originalLookup = dns.lookup;

dns.lookup = function patchedLookup(hostname, options, callback) {
  // Normalize args — the second arg may be a callback or an options object.
  let opts = options;
  let cb = callback;
  if (typeof opts === 'function') {
    cb = opts;
    opts = undefined;
  }
  const merged = Object.assign({ verbatim: true }, opts || {}, { family: 4 });
  return originalLookup.call(dns, hostname, merged, cb);
};

// Also patch the `family: 6` calls inside `dns.promises` if anyone uses it.
if (dns.promises && dns.promises.lookup) {
  const originalPromised = dns.promises.lookup;
  dns.promises.lookup = function patchedPromisedLookup(hostname, options) {
    const merged = Object.assign({ verbatim: true }, options || {}, { family: 4 });
    return originalPromised.call(dns.promises, hostname, merged);
  };
}
