const profileName = document.getElementById('profile-name')
const profileEmail = document.getElementById('profile-email')
const profileBirthday = document.getElementById('profile-birthday')
const profileDate = document.getElementById('profile-date')
const profileMessage = document.getElementById('profile-message')
const editBtn = document.getElementById('edit-btn')
const deleteBtn = document.getElementById('delete-btn')
const logoutBtn = document.getElementById('logout-btn')

// Load user profile on page load
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    
    if (!currentUser) {
        profileMessage.innerText = 'Please login to view your profile'
        profileMessage.style.color = 'red'
        document.getElementById('profile-content').style.display = 'none'
        return
    }
    
    // Display user information
    profileName.innerText = currentUser.name
    profileEmail.innerText = currentUser.email
    profileBirthday.innerText = currentUser.birthday
    
    // Format the creation date
    const createdDate = new Date(currentUser.createdAt)
    profileDate.innerText = createdDate.toLocaleDateString()
})

// Logout functionality
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser')
    window.location.href = 'LOGIN.html'
})

// Delete account functionality
deleteBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        
        // Remove user from users array
        const updatedUsers = users.filter(u => u.email !== currentUser.email)
        localStorage.setItem('users', JSON.stringify(updatedUsers))
        
        // Clear current user
        localStorage.removeItem('currentUser')
        
        profileMessage.innerText = 'Account deleted successfully!'
        profileMessage.style.color = 'green'
        
        setTimeout(() => {
            window.location.href = 'LOGIN.html'
        }, 2000)
    }
})

// Edit profile functionality
editBtn.addEventListener('click', () => {
    profileMessage.innerText = 'Edit profile feature coming soon!'
    profileMessage.style.color = 'blue'
})