import {lessons,analyze,gemmaMessages,checkTutorReply} from './lessons.js';
const $=id=>document.getElementById(id);
let active=0,analysis=null,engine=null,loading=false,busy=false;
let completed=new Set();try{const saved=JSON.parse(localStorage.getItem('ghostport-progress')||'[]');if(Array.isArray(saved))completed=new Set(saved.filter(n=>Number.isInteger(n)&&n>=0&&n<4));}catch{}
function text(tag,value,cls){const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;return el;}
function renderProgress(){ $('progress-count').textContent=completed.size+' / 4';$('progress-bar').style.width=completed.size/4*100+'%'; }
$('reset-progress').onclick=()=>{completed.clear();try{localStorage.removeItem('ghostport-progress');}catch{}renderLessons();$('quiz-feedback').textContent='Field notes cleared. You can practice again.';};
function renderLessons(){ $('lesson-list').replaceChildren();lessons.forEach((l,i)=>{const b=text('button','', 'lesson-button'+(i===active?' active':''));b.type='button';if(i===active)b.setAttribute('aria-current','step');b.append(text('span',completed.has(i)?'✓':String(i+1).padStart(2,'0'),'lesson-index'));const d=document.createElement('span');d.append(text('strong',l.name),text('small',l.sub));b.append(d);b.onclick=()=>selectLesson(i);$('lesson-list').append(b);});renderProgress(); }
function renderCommand(){
 try{analysis=analyze($('command').value);$('command-error').hidden=true;$('breakdown').replaceChildren(text('p','THE COMMAND, PIECE BY PIECE','section-label'));
  for(const r of analysis.rows){const row=document.createElement('div');row.className='token-row';row.append(text('code',r.token));const p=text('p',r.text);if(r.url){const a=text('a',' Reference ↗');a.href=r.url;a.target='_blank';a.rel='noreferrer';p.append(a);}row.append(p);$('breakdown').append(row);}
  const facts=document.createElement('div');facts.className='facts';analysis.facts.forEach(f=>facts.append(text('p',f)));$('breakdown').append(facts);
  const custom=analysis.command!==lessons[active].command;$('whisper-text').textContent=custom?'“A command is a question whispered into the dark. Read the pieces above to understand what you are asking. No answers from a real network have arrived.”':lessons[active].whisper;
  return true;
 }catch(e){analysis=null;$('command-error').hidden=false;$('command-error').textContent=e.message;$('breakdown').replaceChildren();$('whisper-text').textContent='“Even ghosts need a clear question. Fix the command above and try again.”';return false;}
}
function selectLesson(i){active=i;const l=lessons[i];$('lesson-number').textContent='LESSON '+String(i+1).padStart(2,'0');$('lesson-kicker').textContent=l.kicker;$('lesson-title').textContent=l.title;$('lesson-intro').textContent=l.intro;$('command').value=l.command;$('quiz-question').textContent=l.question;$('quiz-feedback').textContent='';$('quiz-options').replaceChildren();l.options.forEach((o,j)=>{const b=text('button',o,'answer');b.type='button';b.onclick=()=>{if(j===l.answer){b.classList.add('correct');$('quiz-feedback').textContent=l.feedback;completed.add(i);try{localStorage.setItem('ghostport-progress',JSON.stringify([...completed]));}catch{}renderLessons();}else{b.classList.add('wrong');$('quiz-feedback').textContent='Not quite. Check the explanation above and try again.';}};$('quiz-options').append(b);});$('next-lesson').firstChild.textContent=i===3?'Back to the first door ':'Next door ';renderLessons();renderCommand();}
$('command-form').onsubmit=e=>{e.preventDefault();if(renderCommand()&&engine&&!busy){$('question').value='Explain what this command asks Nmap to do, then give one short spooky analogy. Do not invent results.';$('chat-form').requestSubmit();}};$('next-lesson').onclick=()=>selectLesson((active+1)%4);
$('command').addEventListener('input',()=>{analysis=null;$('breakdown').replaceChildren(text('p','Command changed. Select “Reveal meaning” to update your field notes.','facts'));$('whisper-text').textContent='“A new question is taking shape…”';});
function status(s){$('ai-status').textContent=s;}
$('wake-ai').onclick=async()=>{
 if(loading||engine)return;loading=true;$('wake-ai').disabled=true;$('model-progress').hidden=false;
 try{
  if(!navigator.gpu)throw Error('WebGPU is unavailable. Try a recent Chrome or Edge browser on a supported device. The written lessons still work.');
  status('◌ Loading the open-weight tutor…');
  const {CreateMLCEngine}=await import('https://esm.sh/@mlc-ai/web-llm@0.2.87');
  engine=await CreateMLCEngine('gemma-2-2b-it-q4f16_1-MLC',{initProgressCallback:r=>{status('◌ Loading the ghost · '+Math.round(r.progress*100)+'%');$('model-progress').value=r.progress;}});
  status('● Ghost awake · runs on your device');$('wake-ai').textContent='The ghost is here ✧';$('download-note').textContent='Gemma 2 2B · open weights · WebLLM. Questions are processed on this device.';$('question').disabled=false;$('ask-ai').disabled=false;$('chat').replaceChildren();addMessage('Ghost','I’m here. Reveal a command, then ask me about it. The field notes keep us grounded.');
 }catch(e){engine=null;status('○ Could not wake the ghost');$('download-note').textContent=e.message+' You can retry; the written lessons work independently.';$('wake-ai').disabled=false;$('wake-ai').textContent='Try waking the ghost again';}
 finally{loading=false;$('model-progress').hidden=true;}
};
function addMessage(who,value){const el=text('div','','message'+(who==='You'?' user':''));el.append(text('strong',who),text('span',value));$('chat').append(el);$('chat').scrollTop=$('chat').scrollHeight;return el.lastChild;}
$('chat-form').onsubmit=async e=>{
 e.preventDefault();if(!engine||busy)return;
 if(!analysis&&!renderCommand())return;
 const q=$('question').value.trim();if(!q)return;
 const requestedAnalysis=analysis;busy=true;$('ask-ai').disabled=true;$('wake-ai').disabled=true;$('question').value='';addMessage('You',q);const answer=addMessage('Ghost · '+requestedAnalysis.command,'Listening to the walls…');let response='';
 try{const chunks=await engine.chat.completions.create({messages:gemmaMessages(requestedAnalysis,q),temperature:.4,max_tokens:230,stream:true});for await(const chunk of chunks){response+=chunk.choices[0]?.delta?.content??'';$('chat').scrollTop=$('chat').scrollHeight;}answer.textContent=response?checkTutorReply(requestedAnalysis,response).text:'No answer came through. Please try your question again.';}
 catch(e){answer.textContent='The ghost lost its train of thought. Please try again. '+e.message;}
 finally{busy=false;$('ask-ai').disabled=false;}
};
selectLesson(0);
