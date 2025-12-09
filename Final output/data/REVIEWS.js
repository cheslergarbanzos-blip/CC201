// List of places in Iloilo
const DESTINATIONS = [
  { id: 'iloilo-river', name: 'Iloilo River Esplanade' },
  { id: 'miagao-church', name: 'Miagao Church' },
  { id: 'molo-church', name: 'Molo Church' },
  { id: 'jaro-cathedral', name: 'Jaro Cathedral' },
  { id: 'gigantes-islands', name: 'Gigantes Islands' },
  { id: 'guimaras-island', name: 'Guimaras Island' }
]

// Find elements on the page
const destSelect = document.getElementById('destination-select')
const titleInput = document.getElementById('review-title')
const ratingSelect = document.getElementById('review-rating')
const bodyInput = document.getElementById('review-body')
const postBtn = document.getElementById('post-review')
const errorEl = document.getElementById('reviews-error')
const listEl = document.getElementById('reviews-list')
const sortSelect = document.getElementById('sort-select')

// Helper: read reviews from localStorage
function loadReviews() {
  const raw = localStorage.getItem('reviews')
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

// Helper: save reviews to localStorage
function saveReviews(arr) {
  localStorage.setItem('reviews', JSON.stringify(arr))
}

// Helper: get logged in user (if any)
function getCurrentUser() {
  const raw = localStorage.getItem('currentUser')
  if (!raw) return null
  try { return JSON.parse(raw) } catch (e) { return null }
}

// Simple id generator
function makeId() {
  return 'r' + Math.random().toString(36).substring(2, 9)
}

// Put destinations in the select box
function fillDestinations() {
  destSelect.innerHTML = ''
  DESTINATIONS.forEach(d => {
    const o = document.createElement('option')
    o.value = d.id
    o.textContent = d.name
    destSelect.appendChild(o)
  })

  // If page URL has ?destination=id, select it
  const p = new URLSearchParams(window.location.search)
  const d = p.get('destination')
  if (d && DESTINATIONS.some(x => x.id === d)) destSelect.value = d
}

// Show reviews for selected destination
function renderReviews() {
  const dest = destSelect.value
  const all = loadReviews().filter(r => r.destination === dest)

  // sort
  const sort = sortSelect ? sortSelect.value : 'newest'
  if (sort === 'newest') all.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  else if (sort === 'oldest') all.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
  else if (sort === 'highest') all.sort((a,b) => (b.rating||0) - (a.rating||0))

  listEl.innerHTML = ''
  if (all.length === 0) {
    listEl.textContent = 'No reviews yet for this place.'
    return
  }

  const user = getCurrentUser()

  all.forEach(r => {
    const card = document.createElement('div')
    card.className = 'review-card'

    const h = document.createElement('div')
    h.innerHTML = `<strong>${escapeHtml(r.title)}</strong> — ${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}`
    card.appendChild(h)

    const meta = document.createElement('div')
    meta.className = 'review-meta'
    meta.textContent = `${r.authorName || 'Anonymous'} · ${new Date(r.createdAt).toLocaleString()}`
    card.appendChild(meta)

    const p = document.createElement('p')
    p.textContent = r.body
    card.appendChild(p)

    const actions = document.createElement('div')

    // Like button (simple)
    const likeBtn = document.createElement('button')
    likeBtn.textContent = `Like (${r.likes || 0})`
    likeBtn.addEventListener('click', () => {
      const allReviews = loadReviews()
      const found = allReviews.find(x => x.id === r.id)
      if (found) {
        found.likes = (found.likes || 0) + 1
        saveReviews(allReviews)
        renderReviews()
      }
    })
    actions.appendChild(likeBtn)

    // If current user wrote this, show delete
    if (user && user.email && r.authorEmail === user.email) {
      const del = document.createElement('button')
      del.textContent = 'Delete'
      del.style.marginLeft = '8px'
      del.addEventListener('click', () => {
        if (!confirm('Delete this review?')) return
        const remaining = loadReviews().filter(x => x.id !== r.id)
        saveReviews(remaining)
        renderReviews()
      })
      actions.appendChild(del)
    }

    card.appendChild(actions)
    listEl.appendChild(card)
  })
}

// Escape text for safety
function escapeHtml(str) {
  if (!str) return ''
  return str.replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]))
}

// Post a new review
postBtn.addEventListener('click', () => {
  errorEl.textContent = ''
  const dest = destSelect.value
  const title = titleInput.value.trim()
  const body = bodyInput.value.trim()
  const rating = parseInt(ratingSelect.value, 10)
  const user = getCurrentUser()

  if (!dest) { errorEl.textContent = 'Choose a destination.'; destSelect.focus(); return }
  if (!title) { errorEl.textContent = 'Title is required.'; titleInput.focus(); return }
  if (!body) { errorEl.textContent = 'Write something.'; bodyInput.focus(); return }
  if (!rating || rating < 1 || rating > 5) { errorEl.textContent = 'Pick a rating.'; ratingSelect.focus(); return }

  const reviews = loadReviews()
  const newReview = {
    id: makeId(),
    destination: dest,
    title: title,
    rating: rating,
    body: body,
    likes: 0,
    authorName: user ? (user.name || user.email) : 'Anonymous',
    authorEmail: user ? user.email : '',
    createdAt: new Date().toISOString()
  }
  reviews.push(newReview)
  saveReviews(reviews)

  // clear form
  titleInput.value = ''
  ratingSelect.value = '5'
  bodyInput.value = ''

  // re-render
  renderReviews()
})

// When destination or sort changes, re-render
destSelect.addEventListener('change', () => {
  // update url so users can share
  history.replaceState(null, '', location.pathname + '?destination=' + destSelect.value)
  renderReviews()
})
if (sortSelect) sortSelect.addEventListener('change', renderReviews)

// Start
window.addEventListener('DOMContentLoaded', () => {
  fillDestinations()
  renderReviews()
})