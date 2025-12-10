const destInput = document.getElementById('destination-input')
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
  } catch {
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
  try { return JSON.parse(raw) } catch { return null }
}

// Simple id generator
function makeId() {
  return 'r' + Math.random().toString(36).substring(2, 9)
}

// Escape text for safety
function escapeHtml(str) {
  if (!str) return ''
  return str.replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]))
}

// Show reviews for typed destination
function renderReviews() {
  const dest = destInput.value.trim().toLowerCase()

  if (!dest) {
    listEl.textContent = 'Enter a destination to see reviews.'
    return
  }

  const all = loadReviews().filter(r =>
    (r.destination || '').toLowerCase() === dest
  )

  // Sort
  const sort = sortSelect ? sortSelect.value : 'newest'
  if (sort === 'newest') {
    all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sort === 'oldest') {
    all.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  } else if (sort === 'highest') {
    all.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }

  listEl.innerHTML = ''

  if (all.length === 0) {
    listEl.textContent = 'No reviews yet for this destination.'
    return
  }

  const user = getCurrentUser()

  all.forEach(r => {
    const card = document.createElement('div')
    card.className = 'review-card'

    const rating = Number(r.rating) || 0

    const h = document.createElement('div')
    h.innerHTML = `<strong>${escapeHtml(r.title)}</strong> — ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`
    card.appendChild(h)

    const meta = document.createElement('div')
    meta.className = 'review-meta'
    meta.textContent = `${r.authorName || 'Anonymous'} · ${new Date(r.createdAt).toLocaleString()}`
    card.appendChild(meta)

    const p = document.createElement('p')
    p.textContent = r.body
    card.appendChild(p)

    const actions = document.createElement('div')

    // Like button
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

    // Delete button (owner only)
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

// Post a new review
postBtn.addEventListener('click', () => {
  errorEl.textContent = ''

  const dest = destInput.value.trim()
  const title = titleInput.value.trim()
  const body = bodyInput.value.trim()
  const rating = parseInt(ratingSelect.value, 10)
  const user = getCurrentUser()

  if (!dest) { errorEl.textContent = 'Enter a destination.'; return }
  if (!title) { errorEl.textContent = 'Title is required.'; return }
  if (!body) { errorEl.textContent = 'Write something.'; return }
  if (!rating || rating < 1 || rating > 5) { errorEl.textContent = 'Pick a rating.'; return }

  const reviews = loadReviews()

  const newReview = {
    id: makeId(),
    destination: dest.toLowerCase(),
    title,
    rating,
    body,
    likes: 0,
    authorName: user ? (user.name || user.email) : 'Anonymous',
    authorEmail: user ? user.email : '',
    createdAt: new Date().toISOString()
  }

  reviews.push(newReview)
  saveReviews(reviews)

  // Clear form
  titleInput.value = ''
  ratingSelect.value = '5'
  bodyInput.value = ''

  renderReviews()
})

// Live re-render
destInput.addEventListener('input', renderReviews)
if (sortSelect) sortSelect.addEventListener('change', renderReviews)

// Start
window.addEventListener('DOMContentLoaded', renderReviews)


// Function to display popular reviews on homepage
function displayPopularReviews() {
  const container = document.getElementById('popular-reviews')
  if (!container) return

  const reviews = loadReviews()
  
  if (reviews.length === 0) {
    container.innerHTML = '<p>No reviews yet. Be the first to post one!</p>'
    return
  }

  // Sort by likes (most liked first), then take top 3
  const popular = reviews
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 3)

  container.innerHTML = ''

  popular.forEach(r => {
    const card = document.createElement('div')
    card.className = 'popular-review-card'
    
    const title = document.createElement('h3')
    title.textContent = r.title
    card.appendChild(title)

    const rating = document.createElement('div')
    rating.className = 'review-rating'
    rating.textContent = '★'.repeat(r.rating) + '☆'.repeat(5-r.rating)
    card.appendChild(rating)

    const dest = document.createElement('p')
    dest.innerHTML = `<strong>Destination:</strong> ${escapeHtml(r.destination)}`
    card.appendChild(dest)

    const body = document.createElement('p')
    const preview = r.body.length > 150 ? r.body.substring(0, 150) + '...' : r.body
    body.textContent = preview
    card.appendChild(body)

    const meta = document.createElement('p')
    meta.className = 'review-meta'
    meta.textContent = `By ${r.authorName || 'Anonymous'} · ${r.likes || 0} likes`
    card.appendChild(meta)

    const link = document.createElement('a')
    link.href = 'REVIEWS.html?destination=' + encodeURIComponent(r.destination)
    link.textContent = 'View all reviews for this destination →'
    card.appendChild(link)

    container.appendChild(card)
  })
}

// If on homepage, show popular reviews
if (document.getElementById('popular-reviews')) {
  window.addEventListener('DOMContentLoaded', displayPopularReviews)
}