document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm")
  const passwordInput = document.getElementById("id_password")
  const confirmPasswordInput = document.getElementById("id_confirmPassword")
  const strengthBar = document.querySelector(".strength-bar")
  const strengthText = document.querySelector(".strength-text")

  // Функция проверки силы пароля
  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1
    if (password.match(/\d/)) strength += 1
    if (password.match(/[^a-zA-Z\d]/)) strength += 1
    return strength
  }

  // Обновление индикатора силы пароля
  const updatePasswordStrength = (password) => {
    const strength = checkPasswordStrength(password)
    strengthBar.className = "strength-bar"
    if (password.length === 0) {
      strengthText.textContent = "Надежность пароля"
      return
    }
    switch (strength) {
      case 1:
        strengthBar.classList.add("weak")
        strengthText.textContent = "Слабый пароль"
        break
      case 2:
      case 3:
        strengthBar.classList.add("medium")
        strengthText.textContent = "Средний пароль"
        break
      case 4:
        strengthBar.classList.add("strong")
        strengthText.textContent = "Сильный пароль"
        break
    }
  }

  // Обработчики для показа/скрытия пароля
  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const input = button.parentElement.querySelector("input")
      const type = input.type === "password" ? "text" : "password"
      input.type = type
      const icon = button.querySelector(".material-symbols-rounded")
      icon.textContent = type === "password" ? "visibility" : "visibility_off"
    })
    button.addEventListener("mousedown", (e) => e.preventDefault())
  })

  // Проверка совпадения паролей
  const checkPasswordsMatch = () => {
    if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
      showError(confirmPasswordInput, "Пароли не совпадают")
      return false
    }
    clearError(confirmPasswordInput)
    return true
  }

  // Валидация email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // Показ ошибки
  const showError = (input, message) => {
    const formGroup = input.closest(".form-group")
    let errorDiv = formGroup.querySelector(".error-message")
    if (!errorDiv) {
      errorDiv = document.createElement("div")
      errorDiv.className = "error-message"
      formGroup.appendChild(errorDiv)
    }
    errorDiv.textContent = message
    input.style.borderColor = "var(--error)"
  }

  // Очистка ошибки
  const clearError = (input) => {
    const formGroup = input.closest(".form-group")
    const errorDiv = formGroup.querySelector(".error-message")
    if (errorDiv) errorDiv.remove()
    input.style.borderColor = ""
  }

  // Слушатели событий
  passwordInput.addEventListener("input", () => {
    updatePasswordStrength(passwordInput.value)
    if (confirmPasswordInput.value) checkPasswordsMatch()
  })

  confirmPasswordInput.addEventListener("input", checkPasswordsMatch)

  // Обработка отправки формы
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    let hasErrors = false

    // Проверка email
    const email = document.getElementById("id_email")
    if (!isValidEmail(email.value)) {
      showError(email, "Введите корректный email")
      hasErrors = true
    } else {
      clearError(email)
    }

    // Проверка силы пароля
    if (checkPasswordStrength(passwordInput.value) < 3) {
      showError(passwordInput, "Пароль недостаточно надежный")
      hasErrors = true
    } else {
      clearError(passwordInput)
    }

    // Проверка совпадения паролей
    if (!checkPasswordsMatch()) {
      hasErrors = true
    }

    // Проверка согласия с условиями
    const terms = document.getElementById("id_terms")
    if (!terms.checked) {
      showError(terms, "��еобходимо принять условия использования")
      hasErrors = true
    } else {
      clearError(terms)
    }

    if (hasErrors) return

    // Отправка формы
    const submitButton = registerForm.querySelector('button[type="submit"]')
    submitButton.disabled = true
    submitButton.innerHTML = '<span class="material-symbols-rounded">sync</span> Регистрация...'

    try {
      await registerForm.submit()
    } catch (error) {
      console.error("Ошибка регистрации:", error)
      showError(email, "Произошла ошибка при регистрации. Попробуйте позже.")
    } finally {
      submitButton.disabled = false
      submitButton.innerHTML = '<span class="material-symbols-rounded">person_add</span> Создать аккаунт'
    }
  })
})

