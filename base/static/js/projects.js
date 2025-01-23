document.addEventListener('DOMContentLoaded', () => {
  // Обновленные данные проектов
  const projects = [
    {
      title: 'Редизайн платформы',
      category: 'Дизайн',
      description:
        'Обновление пользовательского интерфейса и улучшение UX основной платформы',
      tags: ['UI/UX', 'Web Design', 'Figma'],
      progress: 75,
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-03-15',
      team: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      ],
      deadline: '2 дня',
    },
    {
      title: 'Мобильное приложение',
      category: 'Разработка',
      description:
        'Разработка нативного мобильного приложения для iOS и Android',
      tags: ['React Native', 'Mobile', 'API'],
      progress: 45,
      status: 'paused',
      startDate: '2024-01-15',
      endDate: '2024-04-01',
      team: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      ],
      deadline: '5 дней',
    },
    {
      title: 'Аналитическая платформа',
      category: 'Аналитика',
      description: 'Разработка системы аналитики и отчетности',
      tags: ['Python', 'Data Analysis', 'Dashboard'],
      progress: 100,
      status: 'completed',
      startDate: '2023-12-01',
      endDate: '2024-02-15',
      team: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      ],
      deadline: 'Завершен',
    },
  ]

  // Функция форматирования даты
  function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    return new Date(dateString).toLocaleDateString('ru-RU', options)
  }

  // Функция получения статуса проекта
  function getStatusInfo(status) {
    const statusMap = {
      active: {
        label: 'Активный',
        class: 'status-active',
      },
      completed: {
        label: 'Завершен',
        class: 'status-completed',
      },
      paused: {
        label: 'Приостановлен',
        class: 'status-paused',
      },
    }
    return statusMap[status] || statusMap.active
  }

  // Функция создания карточки проекта
  function createProjectCard(project) {
    const statusInfo = getStatusInfo(project.status)

    return `
            <div class="project-card">
                <div class="project-header">
                    <div>
                        <h3 class="project-title">${project.title}</h3>
                        <span class="project-category">${
                          project.category
                        }</span>
                    </div>
                    <span class="project-status ${statusInfo.class}">${
      statusInfo.label
    }</span>
                </div>
                
                <div class="project-content">
                    <p class="project-description">${project.description}</p>
                    
                    <div class="project-dates">
                        <div class="date-item">
                            <span class="date-label">Начало:</span>
                            <span class="date-value">${formatDate(
                              project.startDate
                            )}</span>
                        </div>
                        <div class="date-item">
                            <span class="date-label">Окончание:</span>
                            <span class="date-value">${formatDate(
                              project.endDate
                            )}</span>
                        </div>
                    </div>
                    
                    <div class="project-tags">
                        ${project.tags
                          .map(
                            (tag) => `<span class="project-tag">${tag}</span>`
                          )
                          .join('')}
                    </div>
                    
                    <div class="project-progress">
                        <div class="progress-header">
                            <span class="progress-label">Прогресс</span>
                            <span class="progress-value">${
                              project.progress
                            }%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${
                              project.progress
                            }%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="project-footer">
                    <div class="team-members">
                        ${project.team
                          .map(
                            (avatar) => `
                            <img src="${avatar}" alt="Team member" class="member-avatar">
                        `
                          )
                          .join('')}
                        <span class="more-members">+2</span>
                    </div>
                    <div class="project-deadline">
                        <span class="material-symbols-rounded deadline-icon">schedule</span>
                        ${project.deadline}
                    </div>
                </div>
            </div>
        `
  }

  // Отрисовка проектов
  const projectsGrid = document.querySelector('.projects-grid')
  if (projectsGrid) {
    projectsGrid.innerHTML = projects
      .map((project) => createProjectCard(project))
      .join('')
  }
})
