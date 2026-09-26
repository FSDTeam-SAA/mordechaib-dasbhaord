const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const originalFetch = global.fetch;
after(() => { global.fetch = originalFetch; });
function load(file, deps = {}) {
 const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
 const mod = { exports: {} };
 new Function('require', 'module', 'exports', code)(name => deps[name], mod, mod.exports);
 return mod.exports;
}
const api = load('src/lib/invoices-api.ts');
test('invoice filters encode search and backend enums', () => {
 const url = new URL(api.invoicesPath({ page: 2, limit: 9, search: ' A&B ', planType: 'STARTER', status: 'PAID' }), 'https://example.test');
 assert.equal(url.pathname, '/invoices');
 assert.equal(url.searchParams.get('search'), 'A&B');
 assert.equal(url.searchParams.get('status'), 'PAID');
 assert.equal(url.searchParams.get('page'), '2');
});
test('download URLs reject executable, insecure, and credential-bearing URLs', () => {
 assert.equal(api.safeInvoiceUrl('https://files.stripe.com/invoice.pdf'), 'https://files.stripe.com/invoice.pdf');
 for (const url of ['javascript:alert(1)', 'http://example.com', 'https://user:pass@example.com', '/relative']) assert.throws(() => api.safeInvoiceUrl(url));
});
test('download route authenticates and resolves backend redirect without forwarding credentials', async () => {
 let session = null;
 const route = load('src/app/api/invoices/[id]/download/route.ts', {
  'next-auth': { getServerSession: async () => session },
  'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
  '@/lib/auth': { authOptions: {} }, '@/lib/invoices-api': api,
 });
 const params = { params: Promise.resolve({ id: '6ab0ea84817e482ba1862d1b' }) };
 assert.equal((await route.GET(null, params)).status, 401);
 session = { accessToken: 'test-token' };
 process.env.NEXT_PUBLIC_BACKEND_API_URL = 'https://backend.test/api/v1';
 global.fetch = async (url, options) => {
  assert.equal(url, 'https://backend.test/api/v1/invoices/6ab0ea84817e482ba1862d1b/download');
  assert.equal(options.redirect, 'manual');
  assert.equal(options.headers.Authorization, 'Bearer test-token');
  return new Response(null, { status: 302, headers: { location: 'https://files.stripe.com/invoice.pdf' } });
 };
 const result = await route.GET(null, params);
 assert.deepEqual(await result.json(), { url: 'https://files.stripe.com/invoice.pdf' });
 global.fetch = async () => Response.json({ message: 'Invoice PDF is not available' }, { status: 404 });
 const missing = await route.GET(null, params);
 assert.equal(missing.status, 404);
 assert.equal((await missing.json()).message, 'Invoice PDF is not available');
 assert.equal((await route.GET(null, { params: Promise.resolve({ id: 'invalid' }) })).status, 400);
});
