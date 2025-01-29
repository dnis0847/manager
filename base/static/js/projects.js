document.addEventListener("DOMContentLoaded", () => {
  const filterTabs = document.querySelectorAll(".filter-tab")
  const projectCards = document.querySelectorAll(".project-card")

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Удаляем класс 'active' у всех вкладок
      filterTabs.forEach((t) => t.classList.remove("active"))
      // Добавляем класс 'active' к текущей вкладке
      tab.classList.add("active")

      // Получаем значение data-status текущей вкладки
      const status = tab.getAttribute("data-status")

      // Фильтруем проекты в зависимости от статуса
      projectCards.forEach((card) => {
        const cardStatus = card.getAttribute("data-status")
        if (status === "all" || status === cardStatus) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    })
  })
})



