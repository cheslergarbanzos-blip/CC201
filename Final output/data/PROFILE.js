window.addEventListener('DOMContentLoaded', () => {
    const profileName = document.getElementById('profile-name')
    const profileEmail = document.getElementById('profile-email')
    const profileBirthday = document.getElementById('profile-birthday')
    const profileDate = document.getElementById('profile-date')
    const profileMessage = document.getElementById('profile-message')
    const editBtn = document.getElementById('edit-btn')
    const deleteBtn = document.getElementById('delete-btn')
    const logoutBtn = document.getElementById('logout-btn')
    const profileContent = document.getElementById('profile-content')

    // Safe parse helper
    function safeParse(item, fallback = null) {
        try {
            const raw = localStorage.getItem(item)
            if (!raw) return fallback
            return JSON.parse(raw)
        } catch (e) {
            return fallback
        }
    }

    const currentUser = safeParse('currentUser', null)
    
    if (!currentUser) {
        if (profileMessage) {
            profileMessage.innerText = 'Please login to view your profile'
            profileMessage.style.color = 'red'
        }
        if (profileContent) profileContent.style.display = 'none'
        return
    }
    
    // Display user information
    if (profileName) profileName.innerText = currentUser.name || ''
    if (profileEmail) profileEmail.innerText = currentUser.email || ''
    if (profileBirthday) profileBirthday.innerText = currentUser.birthday || ''
    
    // Format the creation date
    if (profileDate && currentUser.createdAt) {
        const createdDate = new Date(currentUser.createdAt)
        profileDate.innerText = createdDate.toLocaleDateString()
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser')
            window.location.href = '../html/LOGIN.html'
        })
    }

    // Delete account functionality
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return
            
            const user = safeParse('currentUser', null)
            const users = safeParse('users', [])
            
            if (user && user.email) {
                const updatedUsers = users.filter(u => u.email !== user.email)
                localStorage.setItem('users', JSON.stringify(updatedUsers))
                localStorage.removeItem('currentUser')
                
                if (profileMessage) {
                    profileMessage.innerText = 'Account deleted successfully!'
                    profileMessage.style.color = 'green'
                }
                
                setTimeout(() => {
                    window.location.href = '../html/LOGIN.html'
                }, 2000)
            }
        })
    }

    // Edit profile functionality
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            if (profileMessage) {
                profileMessage.innerText = 'Edit profile feature coming soon!'
                profileMessage.style.color = 'blue'
            }
        })
    }
})