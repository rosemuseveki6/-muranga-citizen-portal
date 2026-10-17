let currentUser = JSON.parse(localStorage.getItem('citizenUser') || 'null');
let requests = JSON.parse(localStorage.getItem('citizenRequests') || '[]');

function login() {
  const name = document.getElementById('citizenName').value;
  const email = document.getElementById('citizenEmail').value;
  if (!name || !email) return alert('Fill name and email');
  currentUser = { name, email };
  localStorage.setItem('citizenUser', JSON.stringify(currentUser));
  showApp();
}

function showApp() {
  if (!currentUser) return;
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('userDisplay').innerText = currentUser.name;
  renderMyRequests();
}

function logout() {
  localStorage.removeItem('citizenUser');
  location.reload();
}

function submitRequest() {
  const category = document.getElementById('category').value;
  const location = document.getElementById('location').value;
  const description = document.getElementById('description').value;
  const file = document.getElementById('imageInput').files[0];
  
  if (!category || !location || !description) return alert('Fill all fields');

  const reader = new FileReader();
  reader.onload = function(e) {
    const newReq = {
      id: Date.now(),
      citizenName: currentUser.name,
      citizenEmail: currentUser.email,
      category, location, description,
      image: e.target.result || '',
      status: 'Pending',
      date: new Date().toLocaleString()
    };
    requests.unshift(newReq);
    localStorage.setItem('citizenRequests', JSON.stringify(requests));
    alert('Request Submitted!');
    renderMyRequests();
  };
  if (file) reader.readAsDataURL(file);
  else reader.onload({ target: { result: '' } });
}

function renderMyRequests() {
  const container = document.getElementById('myRequests');
  if (!container) return;
  const myReqs = requests.filter(r => r.citizenEmail === currentUser.email);
  container.innerHTML = myReqs.map(r => `
    <div class="request-item">
      <b>${r.category}</b> - ${r.location} <span class="badge ${r.status}">${r.status}</span>
      <p>${r.description}</p><small>${r.date}</small>
      ${r.image ? `<img class="req-img" src="${r.image}">` : ''}
    </div>`).join('') || '<p>No requests yet</p>';
}

function renderAdmin() {
  const filter = document.getElementById('filterStatus')?.value;
  const list = document.getElementById('adminList');
  if (!list) return;
  
  let filtered = requests;
  if (filter !== 'All') filtered = requests.filter(r => r.status === filter);
  
  document.getElementById('totalAll').innerText = requests.length;
  document.getElementById('totalOpen').innerText = requests.filter(r => r.status === 'Pending').length;
  document.getElementById('totalProgress').innerText = requests.filter(r => r.status === 'In Progress').length;
  document.getElementById('totalResolved').innerText = requests.filter(r => r.status === 'Resolved').length;

  list.innerHTML = filtered.map(r => `
    <div class="request-item">
      <b>${r.category}</b> by ${r.citizenName} (${r.citizenEmail})<br>
      Location: ${r.location} - <span class="badge ${r.status}">${r.status}</span>
      <p>${r.description}</p><small>${r.date}</small>
      ${r.image ? `<img class="req-img" src="${r.image}">` : ''}
      <br><br>
      <select onchange="updateStatus(${r.id}, this.value)">
        <option ${r.status==='Pending'?'selected':''}>Pending</option>
        <option ${r.status==='In Progress'?'selected':''}>In Progress</option>
        <option ${r.status==='Resolved'?'selected':''}>Resolved</option>
      </select>
    </div>`).join('');
}

function updateStatus(id, newStatus) {
  requests = requests.map(r => r.id === id ? { ...r, status: newStatus } : r);
  localStorage.setItem('citizenRequests', JSON.stringify(requests));
  renderAdmin();
}

if (currentUser && document.getElementById('app')) showApp();
if (document.getElementById('adminList')) renderAdmin();
