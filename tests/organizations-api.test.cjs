const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
function load(name) {
  const mod = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, "../src/lib", name + ".ts"), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function("module", "exports", "require", code)(mod, mod.exports, dependency => load(dependency.replace("./", "")));
  return mod.exports;
}
const api = load("organizations-api");
const { subscriptionRequest } = load("subscription-api");
const originalFetch = global.fetch;
const originalUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
after(() => {
  global.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_BACKEND_API_URL;
  else process.env.NEXT_PUBLIC_BACKEND_API_URL = originalUrl;
});
process.env.NEXT_PUBLIC_BACKEND_API_URL = "https://example.test/api/v1/";
test("list requests page 1 with 20 records and encodes backend filters", async () => {
  const defaultPath = api.organizationsPath({ page: 1, limit: 20, search: " ", plan: "all", status: "all" });
  assert.equal(defaultPath, "/organizations-admin?page=1&limit=20");
  const filtered = api.organizationsPath({ page: 2, limit: 20, search: " A&B ", plan: "CUSTOM", status: "SUSPENDED" });
  const params = new URL(filtered, "https://example.test").searchParams;
  assert.equal(params.get("search"), "A&B");
  assert.equal(params.get("planType"), "CUSTOM");
  assert.equal(params.get("status"), "SUSPENDED");
  global.fetch = async (url, options) => {
    assert.equal(url, "https://example.test/api/v1" + defaultPath);
    assert.equal(options.headers.Authorization, "Bearer token");
    return Response.json({ success: true, data: { items: [], total: 0, totalPages: 0 } });
  };
  assert.deepEqual((await subscriptionRequest(defaultPath, "token")).items, []);
});
test("detail route uses the actual organization ID and unwraps the response", async () => {
  const id = "507f1f77bcf86cd799439011";
  const detail = { organization: { id, name: "Real company", status: "ACTIVE" }, subscription: null };
  global.fetch = async (url, options) => {
    assert.equal(url, "https://example.test/api/v1/organizations-admin/" + id);
    assert.equal(options.method, "GET");
    return Response.json({ success: true, data: detail });
  };
  assert.deepEqual(await subscriptionRequest(api.organizationDetailPath(id), "token"), detail);
  assert.equal(api.organizationDetailPath("a/b"), "/organizations-admin/a%2Fb");
});
test("suspend and activate PATCH only the backend status and return saved details", async () => {
  for (const status of ["SUSPENDED", "ACTIVE"]) {
    global.fetch = async (url, options) => {
      assert.equal(url, "https://example.test/api/v1/organizations-admin/org-1/status");
      assert.equal(options.method, "PATCH");
      assert.equal(options.headers.Authorization, "Bearer token");
      assert.deepEqual(JSON.parse(options.body), { status });
      return Response.json({ success: true, data: { organization: { id: "org-1", status } } });
    };
    assert.equal((await api.updateOrganizationStatus("org-1", status, "token")).organization.status, status);
  }
});
test("failed status updates reject, including authorization and missing organizations", async () => {
  for (const status of [401, 403, 404, 500]) {
    global.fetch = async () => Response.json({ success: false, message: "Update failed" }, { status });
    await assert.rejects(api.updateOrganizationStatus("missing", "SUSPENDED", "token"), error => error.status === status);
  }
});
test("list mapping preserves real custom plans and shows missing fields without sample data", () => {
  const row = api.organizationRow({ id: "real-id", name: "Company", status: "SUSPENDED", memberCount: 0, businessSize: "TWO_TO_TEN", owner: null, subscription: { plan: { name: "Custom Gold", planType: "CUSTOM" } } });
  assert.equal(row.id, "real-id");
  assert.equal(row.employees, "2-10 employees");
  assert.equal(row.owner, "—");
  assert.equal(row.joined, "—");
  assert.equal(row.plan, "Custom Gold");
  assert.equal(row.planType, "CUSTOM");
  assert.equal(row.status, "Suspended");
  assert.equal(api.organizationRow({ id: "none", name: "None", status: "ACTIVE", memberCount: 0 }).plan, "—");
});
