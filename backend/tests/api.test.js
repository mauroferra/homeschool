import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { createApp } from '../src/app.js';
import { createConnection, closeConnection } from '../src/db/db.js';
import '../src/db/models/index.js';
import { User } from '../src/db/models/index.js';

let server;
let base;

before(async () => {
  const db = createConnection();
  await db.sync({ force: true });
  const hash = await bcrypt.hash('parent123', 4);
  await User.create({ email: 'parent@test.app', passwordHash: hash, role: 'parent', active: true });
  const app = createApp();
  server = await new Promise((res) => {
    const s = app.listen(0, () => res(s));
  });
  base = `http://localhost:${server.address().port}/api/v1`;
});

after(async () => {
  if (server) await new Promise((res) => server.close(res));
  await closeConnection();
});

async function api(path, { method = 'GET', token, body } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  return { status: res.status, data: text ? JSON.parse(text) : null };
}

async function login(email = 'parent@test.app', password = 'parent123') {
  const r = await api('/auth/login', { method: 'POST', body: { email, password } });
  assert.equal(r.status, 200);
  return r.data.token;
}

test('login rejects bad credentials', async () => {
  const r = await api('/auth/login', { method: 'POST', body: { email: 'parent@test.app', password: 'wrong' } });
  assert.equal(r.status, 401);
});

test('unauthenticated requests are rejected', async () => {
  const r = await api('/themes');
  assert.equal(r.status, 401);
});

test('theme CRUD', async () => {
  const token = await login();
  const created = await api('/themes', { method: 'POST', token, body: { name: 'Italian Cities', start_date: '2026-09-01' } });
  assert.equal(created.status, 201);
  const theme = created.data;
  assert.equal(theme.name, 'Italian Cities');

  const updated = await api(`/themes/${theme.id}`, { method: 'PATCH', token, body: { description: 'Rome' } });
  assert.equal(updated.data.description, 'Rome');

  const list = await api('/themes', { token });
  assert.equal(list.data.length, 1);

  const removed = await api(`/themes/${theme.id}`, { method: 'DELETE', token });
  assert.equal(removed.status, 204);
});

test('activity CRUD', async () => {
  const token = await login();
  const created = await api('/activities', { method: 'POST', token, body: { title: 'Italian Storytime', category: 'Language', estimated_duration: 10, links: ['https://example.com'] } });
  assert.equal(created.status, 201);
  assert.equal(created.data.links.length, 1);

  const updated = await api(`/activities/${created.data.id}`, { method: 'PATCH', token, body: { title: 'Storytime Plus' } });
  assert.equal(updated.data.title, 'Storytime Plus');

  const bad = await api('/activities', { method: 'POST', token, body: { title: 'X', category: 'Nope' } });
  assert.equal(bad.status, 400);
});

test('week + instances + progress flow', async () => {
  const token = await login();
  const week = await api('/weeks', { method: 'POST', token, body: { start_date: '2026-08-10' } });
  assert.equal(week.status, 201);
  const weekId = week.data.id;

  const act = await api('/activities', { method: 'POST', token, body: { title: 'Song', category: 'Language' } });

  const inst = await api(`/weeks/${weekId}/instances`, {
    method: 'POST',
    token,
    body: { day_of_week: 1, block_type: 'Italian Micro-Immersion', activity_id: act.data.id, home_tag: 'Home B' },
  });
  assert.equal(inst.status, 201);

  const updated = await api(`/instances/${inst.data.id}`, { method: 'PATCH', token, body: { status: 'Completed', reflection_text: 'Great day' } });
  assert.equal(updated.data.status, 'Completed');

  const adHoc = await api(`/weeks/${weekId}/instances/ad-hoc`, {
    method: 'POST',
    token,
    body: { day_of_week: 2, block_type: 'Bonding Ritual', title: 'Cuddle', category: 'Ritual' },
  });
  assert.equal(adHoc.status, 201);
  assert.equal(adHoc.data.ad_hoc, true);

  const externalType = await api('/external-types', { method: 'POST', token, body: { name: 'Swimming class' } });
  assert.equal(externalType.status, 201);

  const externalTypes = await api('/external-types', { token });
  assert.equal(externalTypes.data.length, 1);
  const localizedType = await api(`/external-types/${externalType.data.id}`, { method: 'PATCH', token, body: { name: 'Swimming class', name_it: 'Corso di nuoto' } });
  assert.equal(localizedType.data.name_it, 'Corso di nuoto');

  const external = await api(`/weeks/${weekId}/instances/external`, {
    method: 'POST',
    token,
    body: { day_of_week: 3, external_type_id: externalType.data.id },
  });
  assert.equal(external.status, 201);
  assert.equal(external.data.is_external, true);
  assert.equal(external.data.external_type_id, externalType.data.id);
  assert.equal(external.data.activity.title, 'Swimming class');
  assert.equal(external.data.activity.title_it, 'Corso di nuoto');
  const renamed = await api(`/external-types/${externalType.data.id}`, { method: 'PATCH', token, body: { name: 'Swim' } });
  assert.equal(renamed.data.name, 'Swim');
  const renamedInstance = await api(`/instances/${external.data.id}`, { token });
  assert.equal(renamedInstance.data.activity.title, 'Swim');

  const filtered = await api(`/weeks/${weekId}/instances?household=Home%20B`, { token });
  assert.equal(filtered.data.length, 1);

  const stats = await api(`/progress/weekly-stats?week_id=${weekId}`, { token });
  assert.equal(stats.data.total, 2);
  assert.equal(stats.data.completed, 1);

  const reflections = await api('/progress/reflections', { token });
  assert.equal(reflections.data.reflections.length, 1);
});

test('admin user management requires admin role', async () => {
  const parentToken = await login();
  const forbidden = await api('/users', { token: parentToken });
  assert.equal(forbidden.status, 403);

  const hash = await bcrypt.hash('admin123', 4);
  await User.create({ email: 'admin@test.app', passwordHash: hash, role: 'admin', active: true });
  const adminToken = await login('admin@test.app', 'admin123');

  const created = await api('/users', { method: 'POST', token: adminToken, body: { email: 'new@test.app', password: 'password123', role: 'parent' } });
  assert.equal(created.status, 201);

  const list = await api('/users', { token: adminToken });
  assert.equal(list.data.length, 3);
});

test('password change and reset flow', async () => {
  const token = await login();
  const wrong = await api('/auth/me/password', { method: 'PATCH', token, body: { currentPassword: 'nope', newPassword: 'newpassword123' } });
  assert.equal(wrong.status, 400);

  const ok = await api('/auth/me/password', { method: 'PATCH', token, body: { currentPassword: 'parent123', newPassword: 'newpassword123' } });
  assert.equal(ok.status, 200);

  const reset = await api('/auth/reset', { method: 'POST', body: { email: 'parent@test.app' } });
  assert.equal(reset.status, 200);
  assert.ok(reset.data.resetLink);
  const resetToken = new URL(reset.data.resetLink).searchParams.get('token');

  const confirm = await api('/auth/reset/confirm', { method: 'POST', body: { token: resetToken, password: 'resetpassword123' } });
  assert.equal(confirm.status, 200);

  const reLogin = await api('/auth/login', { method: 'POST', body: { email: 'parent@test.app', password: 'resetpassword123' } });
  assert.equal(reLogin.status, 200);
});