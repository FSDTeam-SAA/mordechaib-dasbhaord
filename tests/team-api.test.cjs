const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const mod = { exports: {} };
const code = ts.transpileModule(fs.readFileSync('src/lib/team-api.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
new Function('module','exports',code)(mod,mod.exports);
const { teamPayload } = mod.exports;
test('invite sends required normalized fields and backend permission literals without password or status',()=>{
 assert.deepEqual(teamPayload({ name:' Admin User ',email:' ADMIN@example.com ',role:'SUB_ADMIN',permissions:['Dashborad','Dashborad'],status:'SUSPENDED'},false),{name:'Admin User',email:'admin@example.com',role:'SUB_ADMIN',permissions:['Dashborad']});
});
test('edit only sends role permissions and status',()=>{
 assert.deepEqual(teamPayload({ name:'ignored',email:'ignored',role:'ADMIN',permissions:['Meeting Calender'],status:'ACTIVE'},true),{role:'ADMIN',permissions:['Meeting Calender'],status:'ACTIVE'});
});
test('empty or invalid permissions and invalid invitations are rejected',()=>{
 assert.throws(()=>teamPayload({role:'ADMIN',permissions:[]},true),/at least one/);
 assert.throws(()=>teamPayload({role:'ADMIN',permissions:['Dashboard']},true),/valid/);
 assert.throws(()=>teamPayload({name:'x',email:'invalid',role:'ADMIN',permissions:['All Access']},false),/Name/);
});
