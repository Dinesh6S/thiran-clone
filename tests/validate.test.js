const assert = require('assert');
const { validateRegistration: v } = require('../js/validate.js');
const ok = { name: 'Asha K', email: 'a@b.com', phone: '9884795009', photoType: 'image/png' };

assert.deepStrictEqual(v(ok), []);
assert.deepStrictEqual(v({ ...ok, phone: '+91 98847 95009' }), []);
assert.strictEqual(v({ ...ok, name: '   ' }).length, 1);
assert.strictEqual(v({ ...ok, email: 'a@b' }).length, 1);
assert.strictEqual(v({ ...ok, phone: '123' }).length, 1);
assert.strictEqual(v({ ...ok, photoType: 'application/pdf' }).length, 1);
assert.strictEqual(v({ ...ok, photoType: '' }).length, 1);
console.log('validate: all passed');
