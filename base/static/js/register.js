document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm')
  const passwordInput = document.getElementById('password')
  const confirmPasswordInput = document.getElementById('confirmPassword')
  const strengthBar = document.querySelector('.strength-bar')
  const strengthText = document.querySelector('.strength-text')

  // Функция проверки силы пароля
  const checkPasswordStrength = (password) => {
    let strength = 0

    // Длина
    if (password.length >= 8) strength += 1

    // Буквы разного регистра
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1

    // Цифры
    if (password.match(/\d/)) strength += 1

    // Специальные символы
    if (password.match(/[^a-zA-Z\d]/)) strength += 1

    return strength
  }

  // Обновление индикатора силы пароля
  const updatePasswordStrength = (password) => {
    const strength = checkPasswordStrength(password)

    strengthBar.className = 'strength-bar'

    if (password.length === 0) {
      strengthText.textContent = 'Надежность пароля'
      return
    }

    switch (strength) {
      case 1:
        strengthBar.classList.add('weak')
        strengthText.textContent = 'Слабый пароль'
        break
      case 2:
      case 3:
        strengthBar.classList.add('medium')
        strengthText.textContent = 'Средний пароль'
        break
      case 4:
        strengthBar.classList.add('strong')
        strengthText.textContent = 'Сильный пароль'
        break
    }
  }

  // Обработчики для показа/скрытия пароля
  document.querySelectorAll('.toggle-password').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault()
      const input = button.parentElement.querySelector('input')
      const type = input.type === 'password' ? 'text' : 'password'
      input.type = type

      const icon = button.querySelector('.material-symbols-rounded')
      icon.textContent = type === 'password' ? 'visibility' : 'visibility_off'
    })

    button.addEventListener('mousedown', (e) => {
      e.preventDefault()
    })
  })

  // Проверка совпадения паролей
  const checkPasswordsMatch = () => {
    if (
      confirmPasswordInput.value &&
      passwordInput.value !== confirmPasswordInput.value
    ) {
      showError(confirmPasswordInput, 'Пароли не совпадают')
      return false
    }
    clearError(confirmPasswordInput)
    return true
  }

  // Валидация email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Показ ошибки
  const showError = (input, message) => {
    const formGroup = input.closest('.form-group')
    const errorDiv =
      formGroup.querySelector('.error-message') || document.createElement('div')
    errorDiv.className = 'error-message'
    errorDiv.textContent = message

    if (!formGroup.querySelector('.error-message')) {
      formGroup.appendChild(errorDiv)
    }

    input.style.borderColor = 'var(--error)'
  }

  // Очистка ошибки
  const clearError = (input) => {
    const formGroup = input.closest('.form-group')
    const errorDiv = formGroup.querySelector('.error-message')
    if (errorDiv) {
      errorDiv.remove()
    }
    input.style.borderColor = ''
  }

  // Слушатели событий
  passwordInput.addEventListener('input', () => {
    updatePasswordStrength(passwordInput.value)
    if (confirmPasswordInput.value) {
      checkPasswordsMatch()
    }
  })

  confirmPasswordInput.addEventListener('input', checkPasswordsMatch)

  // Обработка отправки формы
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    let hasErrors = false

    // Проверка email
    const email = document.getElementById('email')
    if (!isValidEmail(email.value)) {
      showError(email, 'Введите корректный email')
      hasErrors = true
    }

    // Проверка силы пароля
    if (checkPasswordStrength(passwordInput.value) < 3) {
      showError(passwordInput, 'Пароль недостаточно надежный')
      hasErrors = true
    }

    // Проверка совпадения паролей
    if (!checkPasswordsMatch()) {
      hasErrors = true
    }

    // Проверка согласия с условиями
    const terms = document.querySelector('input[name="terms"]')
    if (!terms.checked) {
      showError(terms, 'Необходимо принять условия использования')
      hasErrors = true
    }

    if (hasErrors) return

    try {
      const submitButton = registerForm.querySelector('button[type="submit"]')
      submitButton.disabled = true
      submitButton.innerHTML =
        '<span class="material-symbols-rounded">sync</span> Регистрация...'

      // Здесь будет запрос к API для регистрации
      await mockRegisterRequest({
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: email.value,
        password: passwordInput.value,
      })

      // Перенаправление на страницу входа
      window.location.href = '/login.html'
    } catch (error) {
      console.error('Ошибка регистрации:', error)
      showError(email, 'Произошла ошибка при регистрации. Попробуйте позже.')
    } finally {
      submitButton.disabled = false
      submitButton.innerHTML =
        '<span class="material-symbols-rounded">person_add</span> Создать аккаунт'
    }
  })

  // Имитация запроса к серверу
  const mockRegisterRequest = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Регистрация:', data)
        resolve({ success: true })
      }, 1500)
    })
  }
})
