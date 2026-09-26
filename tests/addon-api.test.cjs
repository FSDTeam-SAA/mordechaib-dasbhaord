const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function load(file, dependencies = {}) {
  const source = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/lib', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', source)(name => dependencies[name], mod, mod.exports);
  return mod.exports;
}
const api = load('subscription-api.ts');
const { addonPayload, saveAddon, deleteAddon } = load('addon-api.ts', { './subscription-api': api });
const originalFetch = global.fetch;
const originalUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
after(() => {
  global.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_BACKEND_API_URL;
  else process.env.NEXT_PUBLIC_BACKEND_API_URL = originalUrl;
});
process.env.NEXT_PUBLIC_BACKEND_API_URL = 'https://example.test/api/v1';
const input = {
  name: 'AI Actions', category: 'AI_ACTIONS', description: 'Extra actions', isInquiryOnly: false,
  isActive: true, sortOrder: 0, tiers: [{ label: '1,000 Actions', quantity: 1000, priceUsd: 25 }],
};
const original = { ...input, _id: 'pack-1', tiers: [{ ...input.tiers[0], stripePriceId: 'private-price', stripeProductId: 'private-product' }] };

test('admin list includes inactive add-ons and uses bearer authentication', async () => {
  global.fetch = async (url, options) => {
    assert.equal(url, 'https://example.test/api/v1/addon-products/admin?includeInactive=true');
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    return Response.json({ success: true, data: [{ ...original, isActive: false }] });
  };
  const result = await api.subscriptionRequest('/addon-products/admin?includeInactive=true', 'test-token');
  assert.equal(result[0].isActive, false);
});

test('create uses POST and excludes server-managed IDs from tier DTOs', async () => {
  global.fetch = async (url, options) => {
    assert.equal(url, 'https://example.test/api/v1/addon-products');
    assert.equal(options.method, 'POST');
    assert.deepEqual(JSON.parse(options.body), input);
    return Response.json({ success: true, data: original });
  };
  assert.equal((await saveAddon('test-token', original))._id, 'pack-1');
});

test('metadata edits omit unchanged tiers so existing Stripe prices are preserved', async () => {
  global.fetch = async (url, options) => {
    assert.equal(url, 'https://example.test/api/v1/addon-products/pack-1');
    assert.equal(options.method, 'PATCH');
    const body = JSON.parse(options.body);
    assert.equal(body.name, 'Updated pack');
    assert.equal(Object.hasOwn(body, 'tiers'), false);
    return Response.json({ success: true, data: { ...original, name: body.name } });
  };
  await saveAddon('test-token', { ...input, name: 'Updated pack' }, original);
});

test('tier price changes, tier removal and inquiry transitions send the intended replacement', () => {
  const changed = { ...input, tiers: [{ ...input.tiers[0], priceUsd: 0 }] };
  assert.deepEqual(addonPayload(changed, original).tiers, changed.tiers);
  assert.deepEqual(addonPayload({ ...input, tiers: [] }, original).tiers, []);
  assert.deepEqual(addonPayload({ ...input, isInquiryOnly: true }, original).tiers, input.tiers);
  assert.deepEqual(addonPayload(input, { ...original, isInquiryOnly: true }).tiers, input.tiers);
});

test('invalid quantities, prices, labels and categories fail before an API call', () => {
  for (const quantity of [0, -1, 1.5, NaN]) {
    assert.throws(() => addonPayload({ ...input, tiers: [{ ...input.tiers[0], quantity }] }), /quantity/);
  }
  for (const priceUsd of [-1, NaN, Infinity]) {
    assert.throws(() => addonPayload({ ...input, tiers: [{ ...input.tiers[0], priceUsd }] }), /price/);
  }
  assert.throws(() => addonPayload({ ...input, name: ' ' }), /title/);
  assert.throws(() => addonPayload({ ...input, category: 'unknown' }), /category/);
  assert.throws(() => addonPayload({ ...input, tiers: [{ ...input.tiers[0], label: 'x' }] }), /label/);
});

test('delete uses the item endpoint and propagates failure for the confirmation dialog', async () => {
  global.fetch = async (url, options) => {
    assert.equal(url, 'https://example.test/api/v1/addon-products/pack-1');
    assert.equal(options.method, 'DELETE');
    assert.equal(options.body, undefined);
    return Response.json({ success: true, data: { message: 'Add-on product deleted' } });
  };
  assert.equal((await deleteAddon('test-token', 'pack-1')).message, 'Add-on product deleted');
  global.fetch = async () => Response.json({ success: false, message: 'Add-on product not found' }, { status: 404 });
  await assert.rejects(deleteAddon('test-token', 'pack-1'), /not found/);
  global.fetch = async () => Response.json({ success: false, message: 'Category already exists' }, { status: 409 });
  await assert.rejects(saveAddon('test-token', input), /Category already exists/);
});
