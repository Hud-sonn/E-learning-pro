import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const newsList = document.getElementById('newsList');
const featured = document.getElementById('featured');

async function loadSeedOrFirestore(){
  try{
    const newsSnap = await getDocs(collection(db,'news'));
    const news = newsSnap.docs.map(d=> ({id:d.id, ...d.data()}));
    renderNews(news.length?news: await fetchSeed('firestore-seed/news.json'));
    const lessonsSnap = await getDocs(collection(db,'lessons'));
    const lessons = lessonsSnap.docs.map(d=> ({id:d.id, ...d.data()}));
    renderLessons(lessons.length?lessons: await fetchSeed('firestore-seed/lessons.json'));
  }catch(e){
    const news = await fetchSeed('firestore-seed/news.json');
    const lessons = await fetchSeed('firestore-seed/lessons.json');
    renderNews(news); renderLessons(lessons);
  }
}

async function fetchSeed(path){ const res = await fetch(path); return res.json(); }
function renderNews(items){ newsList.innerHTML=''; items.forEach(n=>{ const d=document.createElement('div'); d.className='news-item card'; d.innerHTML=`<strong>${n.title}</strong><div class="small">${n.date||''}</div><p class="small">${n.description}</p><a href="news.html">Read more</a>`; newsList.appendChild(d); }); }
function renderLessons(items){ featured.innerHTML=''; items.slice(0,6).forEach(l=>{ const card=document.createElement('div'); card.className='card'; card.innerHTML=`<h4 style="margin:0">${l.title}</h4><p class="small">${l.description||''}</p><div style="margin-top:8px"><a class="button" href="lesson-view.html?id=${l.id}">Open</a> <a class="button" href="quiz.html?lesson=${l.id}" style="background:transparent;border:1px solid rgba(255,255,255,0.06">Exam</a></div>`; featured.appendChild(card); }); }

loadSeedOrFirestore();
