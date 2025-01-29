document.addEventListener('DOMContentLoaded', function () {
  const menuToggles = document.querySelectorAll('.task-menu-toggle')

  menuToggles.forEach((toggle) => {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation()
      const menu = this.nextElementSibling
      closeAllMenus()
      menu.classList.add('show')
    })
  })

  document.addEventListener('click', closeAllMenus)

  function closeAllMenus() {
    document.querySelectorAll('.task-menu').forEach((menu) => {
      menu.classList.remove('show')
    })
  }

  // Task menu toggle
  document.querySelectorAll('.task-menu-toggle').forEach((button) => {
    button.addEventListener('click', function (e) {
      e.stopPropagation()
      const menu = this.nextElementSibling
      menu.classList.toggle('hidden')
    })
  })

  // Close menu when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.task-menu').forEach((menu) => {
      menu.classList.add('hidden')
    })
  })

  // Edit task
  document.querySelectorAll('.edit-task').forEach((button) => {
    button.addEventListener('click', function () {
      const taskId = this.dataset.taskId
      editTask(taskId)
    })
  })

  // Delete task
  document.querySelectorAll('.delete-task').forEach((button) => {
    button.addEventListener('click', function () {
      const taskId = this.dataset.taskId
      deleteTask(taskId)
    })
  })
})

function editTask(taskId) {
  fetch(`/api/tasks/${taskId}/edit/`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const task = data.task
        document.getElementById('editTaskId').value = task.id
        document.getElementById('editTaskTitle').value = task.title
        document.getElementById('editTaskDescription').value = task.description
        document.getElementById('editTaskPriority').value = task.priority
        document.getElementById('editTaskStatus').value = task.status
        document.getElementById('editTaskStartDate').value = task.start_date
        document.getElementById('editTaskEndDate').value = task.end_date
        document.getElementById('editTaskAssignedTo').value =
          task.assigned_to || ''

        // Показываем модальное окно
        document.getElementById('editTaskModal').classList.remove('hidden')
      } else {
        alert('Не удалось загрузить данные задачи')
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      alert('Произошла ошибка при загрузке данных задачи')
    })
}

function getCookie(name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

document
  .getElementById('editTaskForm')
  .addEventListener('submit', function (e) {
    e.preventDefault()
    const formData = new FormData(this)
    const taskId = formData.get('id')

    fetch(`/api/tasks/${taskId}/edit/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Задача успешно обновлена')
          document.getElementById('editTaskModal').classList.add('hidden')
          // Обновите карточку задачи на странице или перезагрузите список задач
          location.reload()
        } else {
          alert('Не удалось обновить задачу: ' + JSON.stringify(data.errors))
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        alert('Произошла ошибка при обновлении задачи')
      })
  })

function deleteTask(taskId) {
  if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
    fetch(`/api/tasks/${taskId}/delete/`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Задача успешно удалена')
          // Удалите карточку задачи из DOM или перезагрузите список задач
          location.reload() // Это перезагрузит страницу. В идеале, вы бы удалили только нужный элемент из DOM
        } else {
          alert(
            'Не удалось удалить задачу: ' + (data.error || 'Неизвестная ошибка')
          )
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        alert('Произошла ошибка при удалении задачи')
      })
  }
}

// Добавьте обработчик для закрытия модального окна
document
  .querySelector('#editTaskModal .close')
  .addEventListener('click', function () {
    document.getElementById('editTaskModal').classList.add('hidden')
  })
