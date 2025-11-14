import { auth, db, googleProvider } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Register
const registerBtn = document.getElementById('registerBtn');
if(registerBtn){
  registerBtn.addEventListener('click', async (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('r-email').value.trim();
    const password = document.getElementById('r-password').value.trim();
    try{
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      await setDoc(doc(db, 'users', cred.user.uid), { name, email, createdAt: new Date().toISOString(), progress:{}, scores:[], badges:[] });
      document.getElementById('rmsg').style.display='block'; document.getElementById('rmsg').innerText = 'Verification email sent. Check your inbox.';
    }catch(e){ alert('Error: '+ e.message); }
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const msg = document.getElementById('msg');
    try{
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if(!cred.user.emailVerified){
        msg.style.display='block'; msg.innerText='Please verify your email before taking exams.'; return;
      }
      window.location.href = 'dashboard.html';
    }catch(e){ msg.style.display='block'; msg.innerText = e.message; }
  });
}

// Google sign-in
const googleBtn = document.getElementById('googleBtn');
if(googleBtn){
  googleBtn.addEventListener('click', async ()=>{
    try{
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const uref = doc(db, 'users', user.uid);
      const snap = await getDoc(uref);
      if(!snap.exists()){
        await setDoc(uref, { name: user.displayName || '', email: user.email, createdAt: new Date().toISOString(), progress:{}, scores:[], badges:[] });
      }
      window.location.href = 'dashboard.html';
    }catch(e){ alert('Google sign in failed: '+ e.message); }
  });
}

// Logout
const logout = document.getElementById('logout');
if(logout){
  logout.addEventListener('click', async (e)=>{ e.preventDefault(); await signOut(auth); window.location.href='index.html'; });
}

onAuthStateChanged(auth,(u)=>{ /* optional actions */ });
