import http from 'node:http';

// Disposable, synthetic, read-only SSR data. No credentials or upstream requests.
const certs = [
  { id: 50, slug: 'data-analytics-foundations', name: 'Data Analytics Foundations' },
  { id: 10, slug: 'ccna', name: 'CCNA' },
  { id: 36, slug: 'aws-ai-practitioner', name: 'AWS AI Practitioner' },
  { id: 3, slug: 'eipass', name: 'EIPASS 7 Moduli User' },
  { id: 51, slug: 'pl-300-power-bi-data-analyst', name: 'PL-300 Power BI Data Analyst' },
  { id: 34, slug: 'cisco-ccst-cybersecurity', name: 'Cisco CCST Cybersecurity' },
].map(cert => ({ ...cert, questionCount: 100, questionCountByLang: { it: 100, en: 100, fr: 100, es: 100 } }));
const topic = { id: 323, title: 'KPI e dashboard', slug: 'kpi-dashboard-visualizzazione-dati' };
const server = http.createServer((req, res) => {
  res.setHeader('content-type', 'application/json');
  if (req.method !== 'GET') { res.writeHead(405); res.end('{}'); return; }
  const url = new URL(req.url, 'http://127.0.0.1');
  const slug = url.pathname.match(/\/certifications\/(?:by-slug\/)?([^/]+)/)?.[1];
  const cert = certs.find(item => item.slug === slug);
  let body = [];
  if (url.pathname === '/api/certifications') body = certs;
  else if (url.pathname.includes('/certifications/by-slug/')) {
    if (!cert) { res.writeHead(404); res.end('{}'); return; }
    body = cert;
  } else if (url.pathname.endsWith('/resources')) body = {
    certification: cert,
    resources: { quiz: { available: true, questionCount: 100, topicCount: 1 }, reviews: { available: false, topicCount: 0 }, labs: { available: false, totalCount: 0 }, scenarios: { available: false, totalCount: 0 }, guide: { available: false, pageCount: 0 }, maps: { available: false, pageCount: 0 } },
  };
  else if (url.pathname === '/api/topic-pages/by-cert/data-analytics-foundations') body = { topics: [topic] };
  else if (url.pathname.startsWith('/api/topic-pages/') && !url.pathname.includes('/by-cert/')) {
    res.writeHead(404); res.end('{}'); return;
  }
  res.end(JSON.stringify(body));
});
server.listen(Number(process.env.SEO_404_FIXTURE_PORT || 8468), '127.0.0.1', () => console.log('SEO 404 read-only fixture ready'));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
