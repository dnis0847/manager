document.addEventListener('DOMContentLoaded', () => {
  const projectPopup = document.getElementById('projectPopup')
  const taskPopup = document.getElementById('taskPopup')
  const createProjectBtn = document.querySelector(
    '[data-action="create-project"]'
  )
  const createTaskBtn = document.querySelector('[data-action="create-task"]')
  const closeBtns = document.querySelectorAll('.close')
  const disabledBtn = document.querySelector('.disabled-btn')


  function openPopup(popup) {
    if (popup) {
      popup.style.display = 'flex'
      popup.style.opacity = '1'
      popup.style.visibility = 'visible'
    }
  }

  function closePopup(popup) {
    if (popup) {
      popup.style.display = 'none'
      popup.style = ''
    }
  }

  // Обработка клика на отключенную кнопку
  
  if (disabledBtn) {
    disabledBtn.addEventListener('click', () => {
      alert(
        'Вы не можете создать задачу, так как у вас нет прав администратора или менеджера проекта.'
      )
    })
    return
  }

  if (createProjectBtn) {
    createProjectBtn.addEventListener('click', () => openPopup(projectPopup))
  }

  if (createTaskBtn) {
    createTaskBtn.addEventListener('click', () => openPopup(taskPopup))
  }

  if (closeBtns.length > 0) {
    closeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (projectPopup) closePopup(projectPopup)
        if (taskPopup) closePopup(taskPopup)
      })
    })
  }

  if (projectPopup) {
    window.addEventListener('click', (event) => {
      if (event.target === projectPopup) closePopup(projectPopup)
    })
  }

  if (taskPopup) {
    window.addEventListener('click', (event) => {
      if (event.target === taskPopup) closePopup(taskPopup)
    })
  }

  const projectForm = document.getElementById('projectForm')
  if (projectForm) {
    projectForm.addEventListener('submit', handleFormSubmit)
  }

  const taskForm = document.getElementById('taskForm')
  if (taskForm) {
    taskForm.addEventListener('submit', handleFormSubmit)
  }

  function handleFormSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const url = event.target.action

    fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          location.reload()
        } else {
          console.error('Error:', data.errors)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }
})
