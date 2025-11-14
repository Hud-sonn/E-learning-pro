import { db, auth } from "./firebase-config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
const out = document.getElementById('lessonContent');
const params = new URLSearchParams(location.search);
const id = params.get('id') || 'lesson1';
async function load(){
  try{
    const d = await getDoc(doc(db,'lessons', id));
    const data = d.exists()? d.data() : await fetch('firestore-seed/lessons.json').then(r=>r.json()).then(arr=> arr.find(x=>x.id===id) || arr[0]);
    render(data);
  }catch(e){
    const data = await fetch('firestore-seed/lessons.json').then(r=>r.json()).then(arr=> arr.find(x=>x.id===id) || arr[0]);
    render(data);
  }
}
function render(d){
  out.innerHTML = `<h2>${d.title}</h2><div class="small">${d.description||''}</div><div style="margin-top:12px">${d.text||''}</div><pre style="background:#061426;padding:12px;border-radius:8px;margin-top:12px"><code>${d.code||''}</code></pre><img src="${d.image||'asset/sample.png'}" style="width:100%;margin-top:12px;border-radius:8px">`;
  document.getElementById('toExam').href = 'quiz.html?lesson='+id;
}
document.getElementById('markBtn').addEventListener('click', async ()=>{
  const user = auth.currentUser;
  if(!user){ alert('Please sign in to mark complete'); location.href='login.html'; return; }
  const ref = doc(db,'users', user.uid);
  await updateDoc(ref, { ['progress.'+id]: true });
  alert('Marked complete');
});
load();
