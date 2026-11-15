// Public metadata fixtures only. Never connect this test server to a database.
import http from 'node:http';
import fs from 'node:fs';
const dir = new URL('../fixtures/eipass-user/', import.meta.url);
const read = (name) => JSON.parse(fs.readFileSync(new URL(name, dir), 'utf8'));
const topics = read('topics-before.json');
const cert = read('certification-before.json');
const resources = read('resources-before.json');
let forbiddenWrites = 0;
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if(req.method !== 'GET') { forbiddenWrites++; res.writeHead(405); res.end('{}'); return; }
  const url = new URL(req.url, 'http://127.0.0.1');
  const lang = url.searchParams.get('lang') || url.searchParams.get('locale') || 'it';
  let data;
  if(url.pathname === '/api/test-status') data = {forbiddenWrites};
  else if(url.pathname === '/api/topics/3') data = topics;
  else if(url.pathname === '/api/certifications/by-slug/eipass') data = cert;
  else if(url.pathname === '/api/certifications') data = [cert];
  else if(url.pathname === '/api/certifications/eipass/resources') data = resources;
  else if(url.pathname === '/api/topic-pages/by-cert/eipass') data = {topics:topics.map(t=>({...t,title:t[`title_${lang}`],slug:t[`slug_${lang}`]}))};
  else if(url.pathname.startsWith('/api/topic-pages/eipass/')) {
    const slug = decodeURIComponent(url.pathname.split('/').pop());
    const row = topics.find(t=>['it','en','fr','es'].some(l=>t[`slug_${l}`]===slug));
    if(row) {
      data = read(`page-${row.id}-before.json`);
      data.topic.slug = row[`slug_${lang}`];
      data.questionCount = data.questionCountByLang[lang];
      data.relatedTopics = data.relatedTopics.map(t=>({...t,slug:topics.find(x=>x.id===t.id)?.[`slug_${lang}`] || t.slug}));
    }
  }
  if(data===undefined) {res.writeHead(404);res.end('{}');return;}
  res.end(JSON.stringify(data));
});
server.listen(8459, '127.0.0.1', ()=>console.log('EIPASS read-only metadata fixtures: http://127.0.0.1:8459'));
for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>server.close(()=>process.exit(0)));
