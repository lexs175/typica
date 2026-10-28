const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.avif':'image/avif','.ttf':'font/ttf','.mp4':'video/mp4','.webp':'image/webp'};
http.createServer((req,res) => {
  const url = new URL(req.url,'http://localhost');
  let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
    const stat = fs.statSync(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-store'});
    fs.createReadStream(file).pipe(res);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4323,'127.0.0.1',()=>console.log('Typica: http://127.0.0.1:4323'));
