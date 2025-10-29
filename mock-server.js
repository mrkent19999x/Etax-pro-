const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API routes
  if (pathname === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { mst, password } = JSON.parse(body);

        if (mst === '00109202830' && password === 'test123') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            user: {
              name: 'TỬ XUÂN CHIẾN',
              mst: '00109202830',
              role: 'user'
            },
            token: 'mock-jwt-token'
          }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'Invalid credentials'
          }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (pathname === '/api/notifications' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([
      {
        id: 1,
        title: 'Thông báo hành chính',
        content: 'Nội dung thông báo hành chính...',
        date: '2025-10-30',
        type: 'admin'
      },
      {
        id: 2,
        title: 'Biến động nghĩa vụ thuế',
        content: 'Nội dung biến động nghĩa vụ thuế...',
        date: '2025-10-29',
        type: 'tax'
      }
    ]));
    return;
  }

  // Serve static files
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);

  // Handle root path
  if (pathname === '/') {
    filePath = path.join(__dirname, 'public', 'index.html');
  } else if (pathname === '/login') {
    filePath = path.join(__dirname, 'public', 'login.html');
  } else if (pathname === '/thong-bao') {
    filePath = path.join(__dirname, 'public', 'thong-bao.html');
  }

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }

    // Read and serve file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error');
        return;
      }

      const ext = path.extname(filePath);
      let contentType = 'text/html';

      switch (ext) {
        case '.css':
          contentType = 'text/css';
          break;
        case '.js':
          contentType = 'application/javascript';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
          contentType = 'image/jpeg';
          break;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(port, () => {
  console.log(`🚀 Mock server running at http://localhost:${port}`);
  console.log(`📱 Ready for manual testing!`);
  console.log(`🌐 Open browser and navigate to http://localhost:${port}/login`);
});
