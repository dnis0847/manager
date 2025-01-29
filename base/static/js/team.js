document.addEventListener('DOMContentLoaded', () => {
  // Данные участников команды
  const teamMembers = [
    {
      id: 1,
      name: 'Александр Иванов',
      role: 'Ведущий дизайнер',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      status: 'online',
      activeTasks: 8,
      completedTasks: 47,
      skills: ['UI/UX', 'Figma', 'Prototyping'],
      department: 'design',
    },
    {
      id: 2,
      name: 'Елена Петрова',
      role: 'Frontend разработчик',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      status: 'online',
      activeTasks: 5,
      completedTasks: 32,
      skills: ['React', 'TypeScript', 'SASS'],
      department: 'development',
    },
    {
      id: 3,
      name: 'Михаил Сидоров',
      role: 'Project Manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      status: 'offline',
      activeTasks: 12,
      completedTasks: 84,
      skills: ['Agile', 'Scrum', 'Team Lead'],
      department: 'management',
    },
    {
      id: 4,
      name: 'Анна Козлова',
      role: 'UI дизайнер',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      status: 'online',
      activeTasks: 6,
      completedTasks: 28,
      skills: ['UI Design', 'Illustration', 'Branding'],
      department: 'design',
    },
    {
      id: 5,
      name: 'Дмитрий Волков',
      role: 'Backend разработчик',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
      status: 'offline',
      activeTasks: 4,
      completedTasks: 51,
      skills: ['Python', 'Django', 'PostgreSQL'],
      department: 'development',
    },
    {
      id: 6,
      name: 'Мария Соколова',
      role: 'Product Manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      status: 'online',
      activeTasks: 9,
      completedTasks: 63,
      skills: ['Product Strategy', 'Analytics', 'UX Research'],
      department: 'management',
    },
  ]

  // Функция создания карточки участника
  function createMemberCard(member) {
    return `
            <div class="team-card">
                <div class="member-header">
                    <img src="${member.avatar}" alt="${
      member.name
    }" class="member-avatar">
                    <div class="member-info">
                        <h3 class="member-name">${member.name}</h3>
                        <p class="member-role">${member.role}</p>
                        <span class="member-status status-${member.status}">
                            <span class="status-dot"></span>
                            ${
                              member.status === 'online'
                                ? 'В сети'
                                : 'Не в сети'
                            }
                        </span>
                    </div>
                </div>

                <div class="member-stats">
                    <div class="stat-item">
                        <div class="stat-value">${member.activeTasks}</div>
                        <div class="stat-label">Активные задачи</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${member.completedTasks}</div>
                        <div class="stat-label">Завершенные</div>
                    </div>
                </div>

                <div class="member-tags">
                    ${member.skills
                      .map(
                        (skill) => `
                        <span class="member-tag">${skill}</span>
                    `
                      )
                      .join('')}
                </div>

                <div class="member-actions">
                    <button class="action-btn">
                        <span class="material-symbols-rounded">mail</span>
                    </button>
                    <button class="action-btn">
                        <span class="material-symbols-rounded">chat</span>
                    </button>
                    <button class="action-btn">
                        <span class="material-symbols-rounded">more_vert</span>
                    </button>
                </div>
            </div>
        `
  }

  // Отрисовка участников
  const teamGrid = document.querySelector('.team-grid')
  if (teamGrid) {
    teamGrid.innerHTML = teamMembers
      .map((member) => createMemberCard(member))
      .join('')
  }

  // Фильтрация по отделам
  const filterTabs = document.querySelectorAll('.filter-tab')
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'))
      tab.classList.add('active')

      const department = tab.textContent.toLowerCase()
      const filteredMembers =
        department === 'все участники'
          ? teamMembers
          : teamMembers.filter((member) => {
              if (department === 'дизайнеры')
                return member.department === 'design'
              if (department === 'разработчики')
                return member.department === 'development'
              if (department === 'менеджеры')
                return member.department === 'management'
              return true
            })

      teamGrid.innerHTML = filteredMembers
        .map((member) => createMemberCard(member))
        .join('')
    })
  })

  // Поиск по команде
  const searchInput = document.querySelector('.search-bar input')
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase()
    const filteredMembers = teamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm) ||
        member.role.toLowerCase().includes(searchTerm) ||
        member.skills.some((skill) => skill.toLowerCase().includes(searchTerm))
    )
    teamGrid.innerHTML = filteredMembers
      .map((member) => createMemberCard(member))
      .join('')
  })
})
