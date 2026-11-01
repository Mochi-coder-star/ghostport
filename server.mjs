import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('./dist/',import.meta.url);
const allowed=new Set(['index.html','app.js','lessons.js','style.css']);
export function createApp(){return createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  const path=decodeURIComponent(url.pathname)==='/'?'index.html':decodeURIComponent(url.pathname).slice(1);
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end('Method not allowed');}
  if(!allowed.has(path)){res.writeHead(404);return res.end('Not found');}
  const data=await readFile(new URL(path,root));
  res.writeHead(200,{'Content-Type':path.endsWith('.html')?'text/html; charset=utf-8':path.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(400);res.end('Unable to read this page');}
});}
if(process.argv[1]===fileURLToPath(import.meta.url))createApp().listen(Number(process.env.PORT)||8765,process.env.HOST||'127.0.0.1',()=>console.log('GhostPort: http://localhost:'+(process.env.PORT||8765)));
