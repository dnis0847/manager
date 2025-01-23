document.addEventListener('DOMContentLoaded', () => {
  const createButtons = document.querySelectorAll(
    '[data-action="create-project"]'
  )
  const popup = document.getElementById('createProjectPopup')
  const closeButtons = popup.querySelectorAll('.close-popup, .btn-secondary')
  const form = document.getElementById('createProjectForm')

  // Открытие popup
  createButtons.forEach((button) => {
    button.addEventListener('click', () => {
      popup.classList.add('active')
      document.body.style.overflow = 'hidden'
    })
  })

  // Закрытие popup
  const closePopup = () => {
    popup.classList.remove('active')
    document.body.style.overflow = ''
    form.reset()
  }

  closeButtons.forEach((button) => {
    button.addEventListener('click', closePopup)
  })

  // Закрытие по клику вне popup
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closePopup()
    }
  })

  // Обработка отправки формы
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    try {
      // Здесь будет отправка данных на сервер
      console.log('Создание проекта:', data)

      // Имитация задержки
      await new Promise((resolve) => setTimeout(resolve, 1000))

      closePopup()
      // Здесь можно добавить обновление списка проектов
    } catch (error) {
      console.error('Ошибка при создании проекта:', error)
    }
  })
})
