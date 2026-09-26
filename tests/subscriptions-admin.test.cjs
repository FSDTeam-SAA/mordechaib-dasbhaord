const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function load(file) {
  const source = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/lib', file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = { exports: {} };
  new Function('module', 'exports', source)(mod, mod.exports);
  return mod.exports;
}
const { subscriptionsPath, subscriptionDate, billingLabel, paginationPages } = load('subscriptions-admin.ts');
const { subscriptionRequest } = load('subscription-api.ts');
const originalFetch = global.fetch;
const originalUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
after(() => {
  global.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_BACKEND_API_URL;
  else process.env.NEXT_PUBLIC_BACKEND_API_URL = originalUrl;
});
process.env.NEXT_PUBLIC_BACKEND_API_URL = 'https://example.test/api/v1';

test('list filters use backend field names and correctly encode organization search', () => {
  const result = subscriptionsPath({ search: '  A&B / Team  ', planType: 'GROWTH', status: 'PAST_DUE', page: 3, limit: 9 });
  const url = new URL(result, 'https://example.test');
  assert.equal(url.pathname, '/subscriptions-admin');
  assert.equal(url.searchParams.get('search'), 'A&B / Team');
  assert.equal(url.searchParams.get('planType'), 'GROWTH');
  assert.equal(url.searchParams.get('status'), 'PAST_DUE');
  assert.equal(url.searchParams.get('page'), '3');
  assert.equal(url.searchParams.get('limit'), '9');
  assert.equal(subscriptionsPath({ search: ' ', planType: '', status: '', page: 1, limit: 9 }), '/subscriptions-admin?page=1&limit=9');
});

test('list and single detail requests preserve backend pagination and nullable fields', async () => {
  const list = { items: [{ id: 'subscription-1', organizationName: 'Example', mrrUsd: 0, nextRenewal: null }], page: 2, limit: 9, total: 10, totalPages: 2 };
  const details = { id: 'subscription-1', organization: null, plan: null, billingCycle: null, activeAddons: [], pausedUntil: null, cancelAtPeriodEnd: false };
  global.fetch = async (url, options) => {
    assert.equal(options.method, 'GET');
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    if (url.endsWith('/subscriptions-admin/subscription-1')) return Response.json({ success: true, data: details });
    assert.equal(url, 'https://example.test/api/v1/subscriptions-admin?page=2&limit=9');
    return Response.json({ success: true, data: list });
  };
  assert.deepEqual(await subscriptionRequest('/subscriptions-admin?page=2&limit=9', 'test-token'), list);
  assert.deepEqual(await subscriptionRequest('/subscriptions-admin/subscription-1', 'test-token'), details);
});

test('missing detail records remain errors rather than showing another row', async () => {
  global.fetch = async () => Response.json({ success: false, message: 'Subscription not found' }, { status: 404 });
  await assert.rejects(subscriptionRequest('/subscriptions-admin/missing', 'test-token'), /Subscription not found/);
});

test('dates, missing billing intervals, zero pages and pagination boundaries render honestly', () => {
  assert.equal(subscriptionDate(null), '—');
  assert.equal(subscriptionDate('invalid'), '—');
  assert.equal(subscriptionDate('2026-09-26T23:00:00Z'), '26 Sept 2026');
  assert.equal(billingLabel(null), '—');
  assert.equal(billingLabel('month'), 'Monthly');
  assert.equal(billingLabel('year'), 'Annually');
  assert.deepEqual(paginationPages(1, 0), []);
  assert.deepEqual(paginationPages(1, 1), [1]);
  assert.deepEqual(paginationPages(1, 10), [1, 2, 10]);
  assert.deepEqual(paginationPages(5, 10), [1, 4, 5, 6, 10]);
  assert.deepEqual(paginationPages(10, 10), [1, 9, 10]);
});
