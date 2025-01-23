document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const togglePassword = document.querySelector(".toggle-password")
  const passwordInput = document.getElementById("id_password")
  const loginInput = document.getElementById("id_login")

  // Функция показа ошибки
  const showError = (input, message) => {
    const formGroup = input.closest(".form-group")
    const errorDiv = formGroup.querySelector(".error-message") || document.createElement("div")

    errorDiv.className = "error-message"
    errorDiv.textContent = message

    if (!formGroup.querySelector(".error-message")) {
      formGroup.appendChild(errorDiv)
    }

    input.style.borderColor = "var(--error)"
  }

  // Функция очистки ошибки
  const clearError = (input) => {
    const formGroup = input.closest(".form-group")
    const errorDiv = formGroup.querySelector(".error-message")

    if (errorDiv) {
      errorDiv.remove()
    }

    input.style.borderColor = "var(--border)"
  }

  // Обработчик переключения видимости пароля
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", (e) => {
      e.preventDefault()

      const isPasswordVisible = passwordInput.type === "text"
      passwordInput.type = isPasswordVisible ? "password" : "text"

      const icon = togglePassword.querySelector(".material-symbols-rounded")
      if (icon) {
        icon.textContent = isPasswordVisible ? "visibility" : "visibility_off"
      }
    })

    togglePassword.addEventListener("mousedown", (e) => {
      e.preventDefault()
    })
  }

  // Очистка ошибок при вводе
  if (loginInput) {
    loginInput.addEventListener("input", () => {
      clearError(loginInput)
    })
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      clearError(passwordInput)
    })
  }

  // Базовая валидация перед отправкой формы
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      let hasErrors = false

      if (!loginInput.value.trim()) {
        showError(loginInput, "Логин обязателен")
        hasErrors = true
      }

      if (!passwordInput.value.trim()) {
        showError(passwordInput, "Пароль обязателен")
        hasErrors = true
      }

      if (hasErrors) {
        e.preventDefault()
      }
    })
  }

  // Анимация появления формы
  document.querySelector(".auth-card").style.opacity = "0"
  setTimeout(() => {
    document.querySelector(".auth-card").style.opacity = "1"
    document.querySelector(".auth-card").style.transition = "opacity 0.3s ease"
  }, 100)
})

