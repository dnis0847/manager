document.addEventListener('DOMContentLoaded', () => {
  const createButtons = document.querySelectorAll('[data-action="create-project"]');
  const popup = document.getElementById('createProjectPopup');
  const closeButtons = popup.querySelectorAll('.close-popup, .btn-secondary');
  const form = document.getElementById('createProjectForm');

  // Обработка клика на отключенную кнопку
  const disabledBtn = document.querySelector('.disabled-btn');
  if (disabledBtn) {
    disabledBtn.addEventListener('click', () => {
      alert('Вы не можете создать проект, так как у вас нет прав администратора или менеджера проекта.');
    });
    return;
  }

  // Открытие popup
  createButtons.forEach((button) => {
    button.addEventListener('click', () => {
      popup.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Закрытие popup
  const closePopup = () => {
    popup.classList.remove('active');
    document.body.style.overflow = '';
    form.reset();
  };

  closeButtons.forEach((button) => {
    button.addEventListener('click', closePopup);
  });

  // Закрытие по клику вне popup
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closePopup();
    }
  });

  // Обработка отправки формы
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Добавление текущей даты в качестве start_date
    const currentDate = new Date().toISOString().split('T')[0];
    data.start_date = currentDate;

    try {
      // Отправка данных на сервер
      const response = await fetch(form.action, {
        method: form.method,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
      });

      if (response.ok) {
        const newProject = await response.json();
        closePopup();
        location.reload();
      } else {
        const errorData = await response.json();
        console.error('Ошибка при создании проекта:', response.statusText, errorData);
        alert(`Ошибка при создании проекта: ${errorData.errors || response.statusText}`);
      }
    } catch (error) {
      console.error('Ошибка при создании проекта:', error);
      alert('Произошла ошибка при создании проекта. Пожалуйста, попробуйте еще раз.');
    }
  });
});
