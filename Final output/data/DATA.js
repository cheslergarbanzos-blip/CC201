const DESTINATIONS_DATA = [
  {
    name: 'Molo Church',
    fullName: 'St. Anne Parish Church (Molo Church)',
    description: 'A stunning Gothic-Renaissance church built in 1831, known as the "Feminist Church" because of its all-female saint statues. Features beautiful coral stone architecture and intricate stained glass windows.',
    location: 'Molo District, Iloilo City',
    image: '../assets/molo-church.jpg',
    tags: ['church', 'historical', 'architecture', 'tourist spot']
  },
  {
    name: 'Miagao Church',
    fullName: 'Santo Tomas de Villanueva Parish Church',
    description: 'A UNESCO World Heritage Site built in 1797, featuring a unique fortress-like baroque architecture. The facade showcases an intricate bas-relief of St. Christopher and tropical plants.',
    location: 'Miagao, Iloilo',
    image: '../assets/miagao-church.jpg',
    tags: ['church', 'unesco', 'historical', 'fortress', 'baroque']
  },
  
]

// Search function
function searchDestinations(query) {
  if (!query || query.trim() === '') return []
  
  const q = query.toLowerCase().trim()
  
  return DESTINATIONS_DATA.filter(dest => {
    return dest.name.toLowerCase().includes(q) ||
           dest.fullName.toLowerCase().includes(q) ||
           dest.description.toLowerCase().includes(q) ||
           dest.location.toLowerCase().includes(q) ||
           dest.tags.some(tag => tag.includes(q))
  })
}

// Initialize search on homepage
window.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form')
  const searchField = document.getElementById('search-field')
  const searchResults = document.getElementById('search-results')
  const searchResultsList = document.getElementById('search-results-list')
  const popularSection = document.getElementById('popular-section')
  const clearBtn = document.getElementById('clear-search')

  if (!searchForm) return

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const query = searchField.value.trim()
    
    if (!query) return

    const results = searchDestinations(query)
    
    searchResultsList.innerHTML = ''
    
    if (results.length === 0) {
      searchResultsList.innerHTML = '<p>No destinations found. Try searching for "Molo Church", "Gigantes Islands", or "Esplanade".</p>'
    } else {
      results.forEach(dest => {
        const card = document.createElement('div')
        card.className = 'destination-card'
        card.innerHTML = `
          <img src="${dest.image}" alt="${dest.name}" class="dest-image" onerror="this.style.display='none'">
          <div class="dest-info">
            <h3>${dest.name}</h3>
            <p class="dest-location">📍 ${dest.location}</p>
            <p>${dest.description}</p>
            <a href="REVIEWS.html?destination=${encodeURIComponent(dest.name)}">View Reviews →</a>
          </div>
        `
        searchResultsList.appendChild(card)
      })
    }
    
    popularSection.style.display = 'none'
    searchResults.style.display = 'block'
  })

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchField.value = ''
      searchResults.style.display = 'none'
      popularSection.style.display = 'block'
    })
  }
})