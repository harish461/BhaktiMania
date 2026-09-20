const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'scratch', 'test-assets');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// 1. Valid 1x1 PNG
const validPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
fs.writeFileSync(path.join(dir, 'valid-image-1.png'), validPng);

// 2. Valid 1x1 JPEG
const validJpg = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64');
fs.writeFileSync(path.join(dir, 'valid-image-2.jpg'), validJpg);

// 3. SVG file
fs.writeFileSync(path.join(dir, 'invalid.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><circle cx="5" cy="5" r="4" fill="red"/></svg>');

// 4. GIF file
const gifHeader = Buffer.from('47494638396101000100800000ffffff00000021f90401000000002c00000000010001000002024401003b', 'hex');
fs.writeFileSync(path.join(dir, 'invalid.gif'), gifHeader);

// 5. PDF file
fs.writeFileSync(path.join(dir, 'invalid.pdf'), '%PDF-1.4\n%...\n%%EOF');

// 6. Oversized file (> 5MB)
const oversized = Buffer.alloc(Math.floor(5.2 * 1024 * 1024), 0);
fs.writeFileSync(path.join(dir, 'oversized.png'), oversized);

// 7. Spoofed binary (text file with .png extension)
fs.writeFileSync(path.join(dir, 'spoofed-fake.png'), 'This is plain text, not a real image binary.');

console.log('Test assets created in', dir);
