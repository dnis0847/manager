document.addEventListener('DOMContentLoaded', () => {
  // Анимация появления элементов при скролле
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px',
  }

  const fadeInElements = document.querySelectorAll('.project-card, .stat-card')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  fadeInElements.forEach((element) => {
    element.style.opacity = '0'
    element.style.transform = 'translateY(20px)'
    element.style.transition = 'all 0.5s ease'
    observer.observe(element)
  })

  // Плавное переключение вкладок
  const navItems = document.querySelectorAll('.nav-item')

  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      navItems.forEach((navItem) => navItem.classList.remove('active'))
      item.classList.add('active')
    })
  })

  // Анимация при наведении на карточки проектов
  const projectCards = document.querySelectorAll('.project-card')

  projectCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)'
    })

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)'
    })
  })

  // Анимация для меню проекта
  const projectMenus = document.querySelectorAll('.project-menu')

  projectMenus.forEach((menu) => {
    menu.addEventListener('click', (e) => {
      e.stopPropagation()
      const dropdown = createDropdownMenu()

      // Позиционирование дропдауна
      dropdown.style.position = 'absolute'
      dropdown.style.top = `${e.target.offsetTop + 30}px`
      dropdown.style.right = `${e.target.offsetLeft}px`

      document.body.appendChild(dropdown)

      // Закрытие по клику вне
      const closeDropdown = (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.remove()
          document.removeEventListener('click', closeDropdown)
        }
      }

      setTimeout(() => {
        document.addEventListener('click', closeDropdown)
      }, 0)
    })
  })

  // Создание выпадающего меню
  function createDropdownMenu() {
    const dropdown = document.createElement('div')
    dropdown.className = 'dropdown-menu'
    dropdown.innerHTML = `
            <div class="dropdown-item">
                <span class="material-symbols-rounded">edit</span>
                Редактировать
            </div>
            <div class="dropdown-item">
                <span class="material-symbols-rounded">share</span>
                Поделиться
            </div>
            <div class="dropdown-item">
                <span class="material-symbols-rounded">archive</span>
                Архивировать
            </div>
            <div class="dropdown-item delete">
                <span class="material-symbols-rounded">delete</span>
                Удалить
            </div>
        `
    return dropdown
  }

  // Анимация прогресс-баров
  const progressBars = document.querySelectorAll('.progress-fill')

  progressBars.forEach((bar) => {
    const width = bar.style.width
    bar.style.width = '0'
    setTimeout(() => {
      bar.style.width = width
    }, 100)
  })

  // Добавляем функционал мобильного меню
  const menuToggle = document.createElement('button')
  menuToggle.className = 'menu-toggle'
  menuToggle.innerHTML = '<span class="material-symbols-rounded">menu</span>'
  document.body.appendChild(menuToggle)

  const sidebar = document.querySelector('.sidebar')
  const mainContent = document.querySelector('.main-content')

  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active')
  })

  // Закрываем сайдбар при клике вне его
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove('active')
    }
  })

  // Закрываем сайдбар при изменении размера окна
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1200) {
      sidebar.classList.remove('active')
    }
  })
})
