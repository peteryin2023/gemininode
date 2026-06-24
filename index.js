#!/usr/bin/env node

const http = require('http');
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
const UUID = process.env.UUID || '9afd1229-b893-40c1-84dd-51e7ce204913'; 

const server = http.createServer((req, res) => {
  if (req.url === '/sub') {
    const hostName = req.headers.host;
    const vlessLink = `vless://${UUID}@${hostName}:443?encryption=none&security=tls&type=ws&host=${hostName}&path=%2F#DcDeploy-Node`;
    const base64Sub = Buffer.from(vlessLink + '\n').toString('base64');
    
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(base64Sub);
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Welcome to Personal Profile Site</h1><p>Powered by Node.js Express.</p>');
});

server.on('upgrade', (req, socket, head) => {
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() !== 'websocket') {
    socket.destroy();
    return;
  }
  socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: WebSocket\r\nConnection: Upgrade\r\n\r\n');
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
