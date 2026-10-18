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
