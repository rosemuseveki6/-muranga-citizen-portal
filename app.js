const STORAGE_KEY = 'muranga_requests';

function getRequests(){ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
function saveRequests(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('requestForm');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const category = document.getElementById('category').value;
      const location = document.getElementById('location').value.trim();
      const description = document.getElementById('description').value.trim();
      const imageInput = document.getElementById('image');
      if(!location || !description){ alert('Fill all fields'); return; }
      let imageData = '';
      if(imageInput && imageInput.files[0]){
        const reader = new FileReader();
        reader.onload = function(ev){
          imageData = ev.target.result;
          createRequest(category, location, description, imageData);
        };
        reader.readAsDataURL(imageInput.files[0]);
      } else {
        createRequest(category, location, description, '');
      }
    });
  }
  renderCitizen();
  renderAdmin();
});

function createRequest(category, location, description, image){
  const requests = getRequests();
  const newReq = {
    id: 'REQ-' + Date.now(),
    category, location, description, image,
    status: 'Pending',
    date: new Date().toLocaleDateString()
  };
  requests.unshift(newReq);
  saveRequests(requests);
  alert('Request Submitted: ' + newReq.id);
  document.getElementById('requestForm').reset();
  document.getElementById('imagePreview').innerHTML = '';
  renderCitizen();
}

function renderCitizen(){
  const container = document.getElementById('myRequests');
  if(!container) return;
  const requests = getRequests();
  if(requests.length === 0){ container.innerHTML = '<p>No requests yet</p>'; return; }
  container.innerHTML = requests.map(r=>`
    <div class="request-card">
      <span class="badge ${r.status.replace(' ','')}">${r.status}</span>
      <h4>${r.category} - ${r.location}</h4>
      <p>${r.description}</p>
      <small>${r.id} | ${r.date}</small>
      ${r.image ? `<br><img src="${r.image}" style
// === CITIZEN AUTH SYSTEM ===
function showRegister(){
  document.getElementById('loginCard').classList.add('hidden');
  document.getElementById('registerCard').classList.remove('hidden');
}
function showLogin(){
  document.getElementById('registerCard').classList.add('hidden');
  document.getElementById('loginCard').classList.remove('hidden');
}

function registerCitizen(){
  const name = document.getElementById('regName').value;
  const id = document.getElementById('regId').value;
  const phone = document.getElementById('regPhone').value;
  const pass = document.getElementById('regPass').value;
  if(!name || !id || !pass){ alert("Fill all required fields"); return; }
  let citizens = JSON.parse(localStorage.getItem('citizens') || "[]");
  if(citizens.find(c=>c.id===id)){ alert("ID already registered"); return; }
  citizens.push({name,id,phone,pass});
  localStorage.setItem('citizens', JSON.stringify(citizens));
  alert("Registration successful! Now login.");
  showLogin();
}

function loginCitizen(){
  const id = document.getElementById('citizenId').value;
  const pass = document.getElementById('citizenPass').value;
  let citizens = JSON.parse(localStorage.getItem('citizens') || "[]");
  const user = citizens.find(c=>c.id===id && c.pass===pass);
  if(!user){ alert("Invalid ID or Password"); return; }
  localStorage.setItem('currentCitizen', JSON.stringify(user));
  checkLogin();
}

function logoutCitizen(){
  localStorage.removeItem('currentCitizen');
  location.reload();
}

function checkLogin(){
  const current = JSON.parse(localStorage.getItem('currentCitizen') || "null");
  if(current){
    document.getElementById('loginCard').classList.add('hidden');
    document.getElementById('registerCard').classList.add('hidden');
    document.getElementById('welcomeCard').classList.remove('hidden');
    document.getElementById('welcomeMsg').innerText = "Welcome, " + current.name + " (" + current.id + ")";
  }
}
// auto check on load
checkLogin();

// Remove hint from admin
// Replace any prompt with Hint - secure version
const originalPrompt = window.prompt;
