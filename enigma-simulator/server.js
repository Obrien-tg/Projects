// Simple static file server (ESM)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, 'public');
const ENIGMA_DIR = path.join(__dirname, 'enigma');

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    default: return 'application/octet-stream';
  }
}

const server = http.createServer((req, res) => {
  // Map root to index.html
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  // Normalize the requested path and remove any leading slash so join() behaves
  const trimmed = urlPath.replace(/^\//, '');

  // Try public dir first (use trimmed to avoid absolute path overriding join)
  let filePath = path.join(PUBLIC_DIR, trimmed);

  // If not found in public, try enigma folder (special-case requests under /enigma/)
  if (!fs.existsSync(filePath)) {
    if (trimmed.startsWith('enigma/')) {
      // map /enigma/Enigma.js -> <project>/enigma/Enigma.js
      filePath = path.join(ENIGMA_DIR, trimmed.replace(/^enigma\//, ''));
    } else {
      filePath = path.join(ENIGMA_DIR, trimmed);
    }
  }

  // Prevent path traversal
  if (!filePath.startsWith(PUBLIC_DIR) && !filePath.startsWith(ENIGMA_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    res.setHeader('Content-Type', contentType(filePath));
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', () => {
      res.statusCode = 500;
      res.end('Server error');
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
