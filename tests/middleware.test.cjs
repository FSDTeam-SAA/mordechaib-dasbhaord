const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { NextRequest } = require('next/server');
const { encode } = require('next-auth/jwt');
const originalSecret = process.env.NEXTAUTH_SECRET;
process.env.NEXTAUTH_SECRET = 'middleware-test-secret-only';
after(() => {
  if (originalSecret === undefined) delete process.env.NEXTAUTH_SECRET;
  else process.env.NEXTAUTH_SECRET = originalSecret;
});
const mod = { exports: {} };
const source = ts.transpileModule(fs.readFileSync('src/middleware.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
new Function('module', 'exports', 'require', source)(mod, mod.exports, require);
const { middleware, config } = mod.exports;
const request = (path, cookie) => new NextRequest('https://dashboard.test' + path, {
  headers: cookie ? { cookie: 'next-auth.session-token-delivaryboy=' + cookie } : {},
});
const session = (token = { id: 'admin-1', accessToken: 'backend-token' }, maxAge = 3600) => encode({ token, secret: process.env.NEXTAUTH_SECRET, maxAge });
test('anonymous visitors are redirected from dashboard pages and nested routes', async () => {
  for (const path of ['/', '/organizations', '/organizations/507f1f77bcf86cd799439011', '/subscription/edit/abc', '/role-permission', '/change-password']) {
    const result = await middleware(request(path));
    assert.equal(result.status, 307);
    assert.equal(result.headers.get('location'), 'https://dashboard.test/signin');
  }
});
test('sign-in and password recovery stay public without redirect loops', async () => {
  for (const path of ['/signin', '/signin/', '/forgot-password', '/reset-password?token=test', '/verify-email']) {
    assert.equal((await middleware(request(path))).headers.get('x-middleware-next'), '1');
  }
});
test('valid encrypted custom session cookie permits dashboard access', async () => {
  const cookie = await session();
  assert.equal((await middleware(request('/organizations', cookie))).headers.get('x-middleware-next'), '1');
});
test('tampered, expired and incomplete sessions fail closed; cleared cookie blocks access after logout', async () => {
  for (const cookie of ['invalid-cookie', await session(undefined, -60), await session({ id: 'admin-1' }), await session({ accessToken: 'token' }), undefined]) {
    assert.equal((await middleware(request('/', cookie))).status, 307);
  }
});
test('matcher keeps auth API and assets available while protecting page requests', () => {
  const matcher = new RegExp('^' + config.matcher[0] + '$');
  for (const path of ['/api/auth/session', '/api/auth/signout', '/_next/static/main.js', '/images/auth_logo.png', '/favicon.ico', '/next.svg']) assert.equal(matcher.test(path), false, path);
  for (const path of ['/', '/organizations', '/subscription/edit/abc', '/role-permission']) assert.equal(matcher.test(path), true, path);
});
