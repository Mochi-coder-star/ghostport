import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server.mjs';
test('preview serves the app and rejects private files, APIs and mutations',async t=>{
 const server=createApp();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
 const base='http://127.0.0.1:'+server.address().port;
 for(const path of ['/','/app.js','/lessons.js','/style.css'])assert.equal((await fetch(base+path)).status,200);
 for(const path of ['/.env','/server.mjs','/.openai/hosting.json','/api/memory/enable'])assert.equal((await fetch(base+path)).status,404);
 assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
 const js=await(await fetch(base+'/app.js')).text();assert.match(js,/gemma-2-2b-it/);assert.doesNotMatch(js,/backboard|Qwen|cloudNotes|api\/memory/i);
});
