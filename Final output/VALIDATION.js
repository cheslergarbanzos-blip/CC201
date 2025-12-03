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
    if (password < 8) {
        errors.push('Password must have 8 characters')
        password_input.parentElement.classList.add('incorrect')
    }
    if (password != repeatPassword) {
        errors.push('Password does not match')
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
        if (input.parentElement.classList.contains('incorrect')) {
            input.parentElement.remove('incorrect')
            error_message.innerText = ''
        }
    })
}) 