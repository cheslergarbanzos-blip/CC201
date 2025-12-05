const form = document.getElementById ('form')
const name_input = document.getElementById ('name-input')
const email_input = document.getElementById ('email-input')
const birthdate_input = document.getElementById ('birthday-input')
const password_input = document.getElementById ('password-input')
const repeatpassword_input = document.getElementById ('repeat-password-input')
const error_message = document.getElementById ('error-message')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    let errors = []

    error_message.innerText = ''
    document.querySelectorAll('.Incorrect').forEach(el => el.classList.remove('Incorrect'))

    if (name_input) {
        errors = getSignupFormErrors(name_input.value, email_input.value, birthdate_input.value, password_input.value, repeatpassword_input.value)
    }
    else {
        errors = getLoginFormErrors(email_input.value, password_input.value)
    }

    if (errors.length > 0) {
        e.preventDefault()
        error_message.innerText = errors.join(". ")
    }
    else {
        // Call registerUser if no errors and it's a signup form
        if (name_input) {
            registerUser()
        }
        else {
            loginUser()
        }
    }
})

function getSignupFormErrors(name, email, birthday, password, repeatPassword) {
    let errors = []

    if (name == '' || name == null) {
        errors.push('Name is required')
        name_input.parentElement.classList.add('Incorrect')
    }
    if (email == '' || email == null) {
        errors.push('Email is required')
        email_input.parentElement.classList.add('Incorrect')
    }
    if (birthday == '' || birthday == null) {
        errors.push('Birthdate is required')
        birthdate_input.parentElement.classList.add('Incorrect')
    }
    if (password == '' || password == null) {
        errors.push('Password is required')
        password_input.parentElement.classList.add('Incorrect')
    }
    if (repeatPassword == '' || repeatPassword == null) {
        errors.push('Repeat password is required')
        repeatpassword_input.parentElement.classList.add('Incorrect')
    }
    if (password.length < 8) {
        errors.push('Password must have 8 characters')
        password_input.parentElement.classList.add('Incorrect')
    }
    if (password != repeatPassword) {
        errors.push('Password does not match')
        repeatpassword_input.parentElement.classList.add('Incorrect')
    }

    return errors;
}

function getLoginFormErrors(email, password) {
    let errors = []

    if (email == '' || email == null) {
        errors.push('Email is required')
        email_input.parentElement.classList.add('Incorrect')
    }
    if (password == '' || password == null) {
        errors.push('Password is required')
        password_input.parentElement.classList.add('Incorrect')
    }
    
    return errors
}

const allInputs = [name_input, email_input, birthdate_input, password_input, repeatpassword_input].filter (input => input != null)

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('Incorrect')) {
            input.parentElement.classList.remove('Incorrect')
            error_message.innerText = ''
        }
    })
}) 

function registerUser() {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Check if email already exists
    if (users.find(u => u.email === email_input.value)) {
        error_message.innerText = 'Email already registered!'
        error_message.classList.add('show')
        email_input.parentElement.classList.add('Incorrect')
        return
    }
    
    // Create new user
    const newUser = {
        name: name_input.value,
        email: email_input.value,
        birthday: birthdate_input.value,
        password: password_input.value,
        createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    // Show success and redirect to login
    error_message.classList.remove('show')
    const successDiv = document.createElement('div')
    successDiv.className = 'success'
    successDiv.textContent = 'Registration successful! Redirecting to login...'
    form.parentElement.insertBefore(successDiv, form)
    
    form.reset()
    
    setTimeout(() => {
        successDiv.remove()
        window.location.href = 'LOGIN.html'
    }, 2000)
}

function loginUser() {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Check if user exists with matching email and password
    const user = users.find(u => u.email === email_input.value && u.password === password_input.value)
    
    if (!user) {
        error_message.innerText = 'Invalid email or password'
        email_input.parentElement.classList.add('Incorrect')
        password_input.parentElement.classList.add('Incorrect')
        return
    }
    
    // Store logged in user
    localStorage.setItem('currentUser', JSON.stringify(user))
    
    // Show success and redirect
    const successDiv = document.createElement('div')
    successDiv.className = 'success'
    successDiv.textContent = 'Login successful! Redirecting...'
    form.parentElement.insertBefore(successDiv, form)
    
    form.reset()
    
    setTimeout(() => {
        successDiv.remove()
        window.location.href = 'HOMEPAGE.html'
    }, 2000)
}