const apiBase = '/api';

const fields = {
  title: document.getElementById('book-title'),
  author: document.getElementById('book-author'),
  genre: document.getElementById('book-genre'),
  year: document.getElementById('book-year'),
  rating: document.getElementById('book-rating')
};
const saveBtn = document.getElementById('book-save');
const resetBtn = document.getElementById('book-reset');
const tbody = document.querySelector('#books-table tbody');
let editingId = null;

async function loadBooks(){
  const res = await fetch(apiBase + '/books');
  const items = await res.json();
  tbody.innerHTML = items.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${escapeHtml(b.title)}</td>
      <td>${escapeHtml(b.author)}</td>
      <td>${escapeHtml(b.genre)}</td>
      <td>${b.year}</td>
      <td>${Number(b.rating).toFixed(1)}</td>
      <td class="actions">
        <button class="action-btn edit" onclick="editBook(${b.id})">Edit</button>
        <button class="action-btn delete" onclick="deleteBook(${b.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.editBook = async function(id){
  const r = await fetch(apiBase + '/books/' + id);
  if (!r.ok) return alert('Cannot load book');
  const b = await r.json();
  editingId = id;
  fields.title.value = b.title;
  fields.author.value = b.author;
  fields.genre.value = b.genre;
  fields.year.value = b.year;
  fields.rating.value = b.rating;
  saveBtn.textContent = 'Update Book';
};

resetBtn.addEventListener('click', ()=>{
  editingId = null;
  fields.title.value=''; fields.author.value=''; fields.genre.value=''; fields.year.value=''; fields.rating.value='';
  saveBtn.textContent = 'Save Book';
});

saveBtn.addEventListener('click', async ()=>{
  const payload = {
    title: fields.title.value.trim(),
    author: fields.author.value.trim(),
    genre: fields.genre.value.trim(),
    year: Number(fields.year.value),
    rating: Number(fields.rating.value)
  };
  try {
    if (editingId) {
      const r = await fetch(`/api/books/${editingId}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if (!r.ok) { const e = await r.json(); return alert('Error: ' + JSON.stringify(e)); }
    } else {
      const r = await fetch('/api/books', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if (!r.ok) { const e = await r.json(); return alert('Error: ' + JSON.stringify(e)); }
    }
    resetBtn.click();
    await loadBooks();
  } catch (e) {
    alert('Network error');
  }
});

window.deleteBook = async function(id){
  if (!confirm('Delete book #' + id + '?')) return;
  const r = await fetch('/api/books/' + id, { method:'DELETE' });
  if (r.status === 204) await loadBooks();
  else alert('Delete failed');
};

function escapeHtml(s){ if (s===undefined || s===null) return ''; return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }

loadBooks();