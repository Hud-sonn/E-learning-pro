import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
const container = document.getElementById('lessonsGrid');
async function loadLessons(){
  try{
    const snap = await getDocs(collection(db,'lessons'));
    const items = snap.docs.map(d=>({id:d.id,...d.data()}));
    render(items.length?items: await fetch('/firestore seed/lessons.json').then(r=>r.json()));
  }catch(e){
    const items = await fetch('firestore-seed/lessons.json').then(r=>r.json());
    render(items);
  }
}
function render(items){ container.innerHTML=''; items.forEach(l=>{ const c=document.createElement('div'); c.className='card'; c.innerHTML = `<h4 style="margin:0">${l.title}</h4><p class="small">${l.description||''}</p><div style="margin-top:8px"><a class="button" href="lesson-view.html?id=${l.id}">Open</a> <a class="button" href="quiz.html?lesson=${l.id}" style="background:transparent;border:1px solid rgba(255,255,255,0.06">Exam</a></div>`; container.appendChild(c); }); }
loadLessons();
