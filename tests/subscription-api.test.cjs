const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const source = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/lib/subscription-api.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const loaded = { exports: {} };
new Function('module', 'exports', source)(loaded, loaded.exports);
const { subscriptionRequest, planToCard, percent, usd, SubscriptionApiError } = loaded.exports;
const originalFetch = global.fetch;
const originalUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
after(() => {
  global.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_BACKEND_API_URL;
  else process.env.NEXT_PUBLIC_BACKEND_API_URL = originalUrl;
});
process.env.NEXT_PUBLIC_BACKEND_API_URL = 'https://example.test/api/v1/';

test('analytics and billing filters preserve API prefix, bearer auth, and returned zero/null values', async () => {
  const fixture = { activeSubscriptions: { value: 0, changePercentVsLastMonth: null } };
  const requests = [];
  global.fetch = async (url, options) => { requests.push({ url, ...options }); return Response.json({ success: true, data: fixture }); };
  for (const route of ['/subscription-analytics/overview-cards', '/subscription-analytics/revenue-overview?year=2026', '/subscription-analytics/plan-distribution', '/subscription-plans/admin?billingCycle=month', '/subscription-plans/admin?billingCycle=year']) {
    assert.deepEqual(await subscriptionRequest(route, 'test-token'), fixture);
    const request = requests.at(-1);
    assert.equal(request.url, `https://example.test/api/v1${route}`);
    assert.equal(request.method, 'GET');
    assert.equal(request.headers.Authorization, 'Bearer test-token');
    assert.equal(request.body, undefined);
  }
});

test('create and edit send JSON to POST collection and PATCH specific plan', async () => {
  const body = { planType: 'STARTER', name: 'Starter', priceUsd: 49, annualPriceUsd: 490, billingCycles: ['month', 'year'], isInquiryOnly: false, features: ['API access'], isActive: true };
  let request;
  global.fetch = async (url, options) => { request = { url, ...options }; return Response.json({ success: true, data: { ...body, _id: 'plan-1' } }); };
  await subscriptionRequest('/subscription-plans', 'test-token', { method: 'POST', body });
  assert.equal(request.url, 'https://example.test/api/v1/subscription-plans');
  assert.equal(request.method, 'POST');
  assert.deepEqual(JSON.parse(request.body), body);
  await subscriptionRequest('/subscription-plans/plan-1', 'test-token', { method: 'PATCH', body });
  assert.equal(request.method, 'PATCH');
  assert.equal(request.url, 'https://example.test/api/v1/subscription-plans/plan-1');
  assert.equal(request.headers['Content-Type'], 'application/json');
});

test('auth, admin restrictions, backend validation, and invalid responses produce actionable errors', async () => {
  await assert.rejects(subscriptionRequest('/subscription-plans/admin', ''), error => error instanceof SubscriptionApiError && error.status === 401);
  for (const [status, message] of [[401, /sign in again/], [403, /Platform admin/], [409, /already exists/]]) {
    global.fetch = async () => Response.json({ success: false, message: 'A plan already exists' }, { status });
    await assert.rejects(subscriptionRequest('/subscription-plans', 'test-token'), message);
  }
  global.fetch = async () => Response.json({ success: false, message: ['name is required', 'price must be positive'] }, { status: 400 });
  await assert.rejects(subscriptionRequest('/subscription-plans', 'test-token'), /name is required. price must be positive/);
  global.fetch = async () => new Response('Bad gateway', { status: 502 });
  await assert.rejects(subscriptionRequest('/subscription-plans', 'test-token'), /Unable to load or save/);
  global.fetch = async () => Response.json({ success: true });
  await assert.rejects(subscriptionRequest('/subscription-plans', 'test-token'), /invalid response/);
});

test('request aborts propagate and do not become success', async () => {
  const controller = new AbortController();
  controller.abort();
  global.fetch = async (_url, { signal }) => { assert.equal(signal, controller.signal); signal.throwIfAborted(); };
  await assert.rejects(subscriptionRequest('/subscription-plans', 'test-token', { signal: controller.signal }), error => error.name === 'AbortError');
});

test('card mapping uses real annual prices, preserves zero limits and avoids fictional defaults', () => {
  const card = planToCard({ _id: 'p1', name: 'Starter', tagline: 'A plan', priceUsd: 49, annualPriceUsd: 500, features: ['Feature'], aiActionsPerMonth: 0, usersIncluded: 1, isActive: false, activeSubscriberCount: 2, monthlyRevenueUsd: 98 });
  assert.equal(card.annualPrice, 500);
  assert.equal(card.price, 49);
  assert.deepEqual(card.usage, ['0 AI Actions']);
  assert.deepEqual(card.support, ['1 user included']);
  assert.deepEqual(card.channels, []);
  assert.equal(card.activeSubscriberCount, 2);
  assert.equal(card.monthlyRevenueUsd, 98);
  assert.equal(card.isActive, false);
  assert.equal(planToCard({ _id: 'custom', name: 'Custom', isInquiryOnly: true }).price, null);
  assert.equal(planToCard({ _id: 'free', name: 'Free', priceUsd: 0 }).price, 0);
  assert.equal(percent(null), 'N/A');
  assert.equal(percent(0), '0%');
  assert.equal(percent(-5), '-5%');
  assert.equal(usd(0), '$0.00');
});
