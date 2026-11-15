const http = require('node:http');
// Disposable read-only synthetic SSR source. No upstream requests or credentials.
http.createServer((req,res)=>{
  const u=new URL(req.url,'http://127.0.0.1:8198');
  const slug=u.pathname.match(/by-slug\/([^/]+)/)?.[1] || u.pathname.match(/certifications\/([^/]+)\/resources/)?.[1] || 'ccna';
  const cert={id:34,slug,name:'Fixture certification',name_en:'Fixture certification',name_es:'Certificación de prueba',description:'Synthetic fixture only',questionCountByLang:{it:100,en:100,fr:100,es:100},topics:[]};
  let body=[];
  if(u.pathname.includes('/certifications/by-slug/')) body=cert;
  else if(u.pathname.endsWith('/resources')) body={certification:{id:34,name:'Fixture certification'},resources:{quiz:{available:true,questionCount:100,topicCount:1},reviews:{available:false,topicCount:0},labs:{available:false,totalCount:0},scenarios:{available:false,totalCount:0},guide:{available:false,pageCount:0},maps:{available:false,pageCount:0}}};
  else if(u.pathname==='/api/certifications') body=[];
  res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify(body));
}).listen(Number(process.env.SPRINT2A_FIXTURE_PORT || 8298),'127.0.0.1',()=>console.log('Synthetic SSR fixture on loopback'));
