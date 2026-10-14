const assert = require('assert');
const { faceToCrop } = require('../js/photo.js');
const R = 7 / 9;

// face in the middle of a big photo: box is 7:9, centered on the face, inside the image
let c = faceToCrop({ x: 400, y: 300, width: 200, height: 200 }, 1000, 1000);
assert.ok(Math.abs(c.width / c.height - R) < 1e-9);
assert.ok(c.x >= 0 && c.y >= 0 && c.x + c.width <= 1000 && c.y + c.height <= 1000);
assert.ok(c.x < 500 && c.x + c.width > 500);

// face at the very corner: box is clamped inside the image
c = faceToCrop({ x: 0, y: 0, width: 300, height: 300 }, 800, 600);
assert.ok(c.x >= 0 && c.y >= 0 && c.x + c.width <= 800 + 1e-9 && c.y + c.height <= 600 + 1e-9);

// face bigger than the photo allows: box shrinks to fit, ratio kept
c = faceToCrop({ x: 10, y: 10, width: 400, height: 400 }, 500, 500);
assert.ok(c.height <= 500 && c.width <= 500);
assert.ok(Math.abs(c.width / c.height - R) < 1e-9);
console.log('photo: all passed');
