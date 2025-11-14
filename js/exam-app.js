import { db, auth } from "./firebase-config.js";
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
const params = new URLSearchParams(location.search);
const lessonId = params.get('lesson') || 'lesson1';
const wrap = document.getElementById('questionWrap');
const timerEl = document.getElementById('timer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const result = document.getElementById('result');
let questions = []; let index = 0; let secondsLeft = 60 * 10; let answers = [];
async function loadQuestions(){
  try{
    const snap = await getDocs(collection(db,'quizzes', lessonId, 'questions'));
    questions = snap.docs.map(d=> ({id:d.id, ...d.data()}));
  }catch(e){
    const seed = await fetch('firestore-seed/quizzes.json').then(r=>r.json());
    questions = seed;
  }
  if(questions.length===0){ const seed = await fetch('firestore-seed/quizzes.json').then(r=>r.json()); questions = seed; }
  renderQuestion(); startTimer(); loadSaved();
}
function renderQuestion(){
  if(questions.length===0){ wrap.innerHTML='<div class="small">No questions available</div>'; return; }
  const q = questions[index];
  wrap.innerHTML = `<div class="question"><strong>Q${index+1}.</strong> ${q.question}<div class="options">${q.choices.map((c,i)=>`<div class="option" data-i="${i}">${c}</div>`).join('')}</div></div>`;
  document.querySelectorAll('.option').forEach(o=> o.addEventListener('click', ()=>{ document.querySelectorAll('.option').forEach(x=> x.classList.remove('selected')); o.classList.add('selected'); answers[index] = Number(o.dataset.i); }));
}
prevBtn.addEventListener('click', ()=>{ if(index>0){ index--; renderQuestion(); } });
nextBtn.addEventListener('click', ()=>{ if(index<questions.length-1){ index++; renderQuestion(); } });
submitBtn.addEventListener('click', async ()=>{
  let score = 0;
  questions.forEach((q,i)=>{ if(answers[i]!==undefined && answers[i]===q.correctAnswer) score++; });
  const percent = Math.round((score/questions.length)*100);
  result.style.display='block'; result.innerHTML = `<div class="card">Score: ${score}/${questions.length} (${percent}%)</div>`;
  try{ const user = auth.currentUser; if(user){ const uref = doc(db,'users',user.uid); const snap = await getDoc(uref); const currentScores = snap.exists()? (snap.data().scores||[]) : []; await updateDoc(uref, { scores: currentScores.concat([percent]) }); }else{ localStorage.setItem('lastScore', percent); } }catch(e){ console.error(e); }
});
function startTimer(){ setInterval(()=>{ secondsLeft--; const m=String(Math.floor(secondsLeft/60)).padStart(2,'0'); const s=String(secondsLeft%60).padStart(2,'0'); timerEl.innerText = `Time: ${m}:${s}`; if(secondsLeft<=0){ submitBtn.click(); } },1000); }
async function loadSaved(){ try{ const user = auth.currentUser; if(!user) return; const docId = user.uid + '_' + lessonId; const snap = await getDoc(doc(db,'examProgress',docId)); if(snap.exists()){ const d = snap.data(); answers = d.answers || []; secondsLeft = d.secondsLeft || secondsLeft; } }catch(e){} }
setInterval(async ()=>{ try{ const user = auth.currentUser; if(!user) return; const docId = user.uid + '_' + lessonId; await setDoc(doc(db,'examProgress',docId), { answers, secondsLeft, updatedAt: new Date().toISOString() }); }catch(e){} },15000);
loadQuestions();
