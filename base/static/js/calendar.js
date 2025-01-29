document.addEventListener('DOMContentLoaded', () => {
  // Текущая дата (устанавливаем на первый день текущего месяца)
  let currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  let selectedDate = new Date()

  let events = []
  let cachedEvents = null
  let eventsByDate = {}

  // Получаем часовой пояс пользователя
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  // Названия месяцев
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]

  // Функция для загрузки событий с сервера
  async function loadEvents() {
    if (cachedEvents) return cachedEvents
    try {
      const response = await fetch('/get_events/')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      cachedEvents = await response.json()
      console.log('Received events:', cachedEvents)
      return cachedEvents
    } catch (error) {
      handleError(error)
      return []
    }
  }

  // Функция обновления календаря
  function updateCalendar(date = currentDate) {
    console.log("Updating calendar for:", date.toISOString())
    if (!events || events.length === 0) {
      console.log("No events to display")
      return
    }

    const year = date.getFullYear()
    const month = date.getMonth()

    // Обновляем заголовок
    document.querySelector('.current-date').textContent = `${months[month]} ${year}`

    // Получаем первый день месяца
    const firstDay = new Date(Date.UTC(year, month, 1))
    const lastDay = new Date(Date.UTC(year, month + 1, 0))

    // Получаем смещение для первого дня (0 - понедельник, 6 - воскресенье)
    let firstDayOffset = firstDay.getUTCDay() - 1
    if (firstDayOffset === -1) firstDayOffset = 6

    // Создаем сетку календаря
    const calendarGrid = document.querySelector('.calendar-grid')
    calendarGrid.innerHTML = ''

    // Добавляем дни предыдущего месяца
    const prevMonthLastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
    for (let i = firstDayOffset - 1; i >= 0; i--) {
      const dayElement = createDayElement(prevMonthLastDay - i, 'other-month')
      calendarGrid.appendChild(dayElement)
    }

    // Добавляем дни текущего месяца
    for (let day = 1; day <= lastDay.getUTCDate(); day++) {
      const isToday = isCurrentDay(year, month, day)
      const dayElement = createDayElement(day, isToday ? 'today' : '')

      // Добавляем события для этого дня
      const dateKey = `${year}-${month}-${day}`
      const dayEvents = eventsByDate[dateKey] || []

      dayEvents.forEach((event) => {
        const eventElement = createEventElement(event)
        dayElement.appendChild(eventElement)
      })

      calendarGrid.appendChild(dayElement)
    }

    // Добавляем дни следующего месяца
    const totalDays = firstDayOffset + lastDay.getUTCDate()
    const remainingDays = 42 - totalDays // 42 = 6 строк * 7 дней
    for (let day = 1; day <= remainingDays; day++) {
      const dayElement = createDayElement(day, 'other-month')
      calendarGrid.appendChild(dayElement)
    }

    // Обновляем список ближайших событий
    updateUpcomingEvents()

    createMiniCalendar()
  }

  // Создание элемента дня
  function createDayElement(day, className = '') {
    const dayElement = document.createElement('div')
    dayElement.className = `calendar-day ${className}`
    dayElement.innerHTML = `<span class="day-number">${day}</span>`
    return dayElement
  }

  // Создание элемента события
  function createEventElement(event) {
    const eventElement = document.createElement('div')
    eventElement.className = `event-item event-${event.type}`
    eventElement.id = `event_${event.id}`
    eventElement.textContent = `${event.title}`
    return eventElement
  }

  // Проверка текущего дня
  function isCurrentDay(year, month, day) {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    )
  }

  // Обновление списка ближайших событий
  function updateUpcomingEvents() {
    const upcomingList = document.querySelector('.event-list')
    const today = new Date()

    // Фильтруем и сортируем события
    const futureEvents = events
      .filter((event) => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5) // Показываем только 5 ближайших событий

    upcomingList.innerHTML = futureEvents
      .map(
        (event) => `
          <div class="event-item event-${event.type}">
            <div class="event-date">${formatDate(event.date)}</div>
            <div class="event-title">${event.title}</div>
            <div class="event-time">${event.time || ''}</div>
          </div>
        `
      )
      .join('')
  }

  // Форматирование даты
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      timeZone: userTimezone
    })
  }

  // Функция для обновления месяца
  function updateMonth(increment) {
    // Создаем новую дату, чтобы не изменять currentDate напрямую
    let newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + increment)
    
    // Обновляем currentDate
    currentDate = newDate
    
    // Обновляем календарь
    updateCalendar(currentDate)
  }

  // Обработчики навигации
  document.querySelectorAll('.calendar-nav .icon-btn').forEach((button) => {
    button.addEventListener('click', () => {
      if (
        button.querySelector('.material-symbols-rounded').textContent ===
        'chevron_left'
      ) {
        updateMonth(-1)
      } else {
        updateMonth(1)
      }
    })
  })

  // Функция создания мини-календаря
  function createMiniCalendar() {
    const miniCalendar = document.querySelector('.mini-calendar')
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Создаем заголовок мини-календаря
    const miniHeader = `
      <div class="mini-calendar-header">
        <div class="mini-weekdays">
          <span>Пн</span>
          <span>Вт</span>
          <span>Ср</span>
          <span>Чт</span>
          <span>Пт</span>
          <span>Сб</span>
          <span>Вс</span>
        </div>
      </div>
    `

    // Получаем первый день месяца
    const firstDay = new Date(Date.UTC(currentYear, currentMonth, 1))
    let firstDayOffset = firstDay.getUTCDay() - 1
    if (firstDayOffset === -1) firstDayOffset = 6

    // Получаем последний день месяца
    const lastDay = new Date(Date.UTC(currentYear, currentMonth + 1, 0))
    const daysInMonth = lastDay.getUTCDate()

    // Создаем сетку дней
    let daysGrid = '<div class="mini-calendar-grid">'

    // Добавляем пустые ячейки для предыдущего месяца
    for (let i = 0; i < firstDayOffset; i++) {
      daysGrid += '<span class="mini-day empty"></span>'
    }

    // Добавляем дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentDay(currentYear, currentMonth, day)
      const isSelected =
        day === selectedDate.getDate() &&
        currentMonth === selectedDate.getMonth() &&
        currentYear === selectedDate.getFullYear()

      daysGrid += `
        <span class="mini-day ${isToday ? 'today' : ''} ${
        isSelected ? 'selected' : ''
      }"
        data-date="${day}">
          ${day}
        </span>
      `
    }

    // Добавляем пустые ячейки для следующего месяца
    const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7
    for (let i = firstDayOffset + daysInMonth; i < totalCells; i++) {
      daysGrid += '<span class="mini-day empty"></span>'
    }

    daysGrid += '</div>'

    // Обновляем содержимое мини-календаря
    miniCalendar.innerHTML = miniHeader + daysGrid

    // Добавляем обработчики событий для дней
    document.querySelectorAll('.mini-day:not(.empty)').forEach((day) => {
      day.addEventListener('click', () => {
        // Убираем предыдущее выделение
        document.querySelectorAll('.mini-day.selected').forEach((el) => {
          el.classList.remove('selected')
        })

        // Добавляем новое выделение
        day.classList.add('selected')

        // Обновляем выбранную дату
        selectedDate = new Date(
          Date.UTC(currentYear, currentMonth, parseInt(day.dataset.date))
        )

        // Обновляем основной календарь
        updateCalendar(selectedDate)
      })
    })
  }

  // Оптимизация фильтрации событий
  function optimizeEvents(events) {
    return events.reduce((acc, event) => {
      const date = new Date(event.date)
      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`
      if (!acc[key]) acc[key] = []
      acc[key].push(event)
      return acc
    }, {})
  }

  // Обработка ошибок
  function handleError(error) {
    console.error('An error occurred:', error)
    const errorElement = document.createElement('div')
    errorElement.className = 'error-message'
    errorElement.textContent = 'Произошла ошибка при загрузке событий. Пожалуйста, попробуйте позже.'
    document.querySelector('.calendar-container').prepend(errorElement)
  }

  // Инициализация календаря
  async function initCalendar() {
    document.getElementById('loading-indicator').style.display = 'block'
    events = await loadEvents()
    eventsByDate = optimizeEvents(events)
    document.getElementById('loading-indicator').style.display = 'none'
    console.log("Loaded events:", events)
    if (events && events.length > 0) {
      updateCalendar(currentDate)
    } else {
      console.log("No events loaded")
      handleError(new Error("No events loaded"))
    }
  }

  initCalendar()
})