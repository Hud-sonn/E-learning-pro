import { auth, db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
const progressEl = document.getElementById('progress');
onAuthStateChanged(auth, async (user)=>{
  if(!user){ progressEl.innerText = 'Please login to see your dashboard.'; return; }
  const snap = await getDoc(doc(db,'users',user.uid));
  const data = snap.exists()? snap.data() : {};
  const completed = data.progress? Object.values(data.progress).filter(Boolean).length:0;
  const avg = data.scores && data.scores.length? Math.round(data.scores.reduce((a,b)=>a+b,0)/data.scores.length):0;
  progressEl.innerHTML = `<div><strong>Lessons Completed:</strong> ${completed}</div><div style="margin-top:8px"><strong>Average Score:</strong> ${avg}%</div><div style="margin-top:8px"><strong>Badges:</strong> ${(data.badges||[]).join(', ') || 'None'}</div>`;
});
