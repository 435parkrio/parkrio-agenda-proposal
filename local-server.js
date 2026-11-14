const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = 8765;
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, `http://localhost:${port}`).pathname); }
  catch { response.writeHead(400).end(); return; }
  const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) { response.writeHead(404).end(); return; }
    response.setHeader('Content-Type', mime[path.extname(file).toLowerCase()] || 'application/octet-stream');
    fs.createReadStream(file).pipe(response);
  });
}).listen(port, '127.0.0.1', () => console.log(`Local site: http://localhost:${port}/\nPress Ctrl+C to stop.`));
