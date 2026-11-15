// Read-only check against an explicitly supplied backend main source snapshot.
// Does not import the backend, load env files, connect to DB or send requests.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = fs.readFileSync(process.argv[2], 'utf8');
const options = source.slice(source.indexOf('function refreshCookieBaseOptions()'), source.indexOf('function setRefreshCookie('));
const clear = source.slice(source.indexOf('function clearRefreshCookie('), source.indexOf('// (debug opzionale'));
const route = source.match(/router\.post\("\/logout", \(_req, res\) => \{[\s\S]*?\n\}\);/)[0];
assert.ok(options && clear && route);
assert.match(route, /clearRefreshCookie\(res\)/);
assert.doesNotMatch(route, /db\.|UPDATE|DELETE|revoke|blacklist/);
for (const production of [false, true]) {
  let handler, cleared;
  const ctx = { process: { env: { NODE_ENV: production ? 'production' : 'test' } }, COOKIE_SECURE: true, COOKIE_SAMESITE: 'lax', COOKIE_DOMAIN: '.certifyquiz.com', console,
    router: { post: (_path, fn) => { handler = fn; } } };
  vm.runInNewContext(options + clear + route, ctx);
  handler({}, { clearCookie: (name, opts) => { cleared = { name, opts }; }, json: body => assert.equal(body.ok, true) });
  assert.equal(cleared.name, 'rt'); assert.equal(cleared.opts.path, '/'); assert.equal(cleared.opts.httpOnly, true);
  assert.equal(cleared.opts.domain, production ? '.certifyquiz.com' : undefined);
  assert.equal(cleared.opts.secure, production); assert.equal(cleared.opts.sameSite, 'lax');
}
assert.match(source, /jwt\.verify\(rt, JWT_REFRESH_SECRET/);
console.log('PASS: backend main logout clears only current rt cookie with matching attributes; existing stateless JWT model unchanged.');
