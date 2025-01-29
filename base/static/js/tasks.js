document.addEventListener("DOMContentLoaded", () => {
    const filterTabs = document.querySelectorAll(".filter-tab")
    const taskCards = document.querySelectorAll(".task-card")
    const kanbanColumns = document.querySelectorAll(".kanban-column")
  
    // Фильтрация задач
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        filterTabs.forEach((t) => t.classList.remove("active"))
        tab.classList.add("active")
  
        const status = tab.getAttribute("data-status")
  
        taskCards.forEach((card) => {
          const cardStatus = card.getAttribute("data-status")
          if (status === "all" || status === cardStatus) {
            card.style.display = "block"
          } else {
            card.style.display = "none"
          }
        })
      })
    })
  
    // Drag and drop функциональность
    taskCards.forEach((card) => {
      card.setAttribute("draggable", true)
      card.addEventListener("dragstart", dragStart)
      card.addEventListener("dragend", dragEnd)
    })
  
    kanbanColumns.forEach((column) => {
      column.addEventListener("dragover", dragOver)
      column.addEventListener("dragenter", dragEnter)
      column.addEventListener("dragleave", dragLeave)
      column.addEventListener("drop", drop)
    })
  
    function dragStart() {
      this.classList.add("dragging")
    }
  
    function dragEnd() {
      this.classList.remove("dragging")
    }
  
    function dragOver(e) {
      e.preventDefault()
    }
  
    function dragEnter(e) {
      e.preventDefault()
      this.classList.add("drag-over")
    }
  
    function dragLeave() {
      this.classList.remove("drag-over")
    }
  
    function drop() {
      this.classList.remove("drag-over")
      const card = document.querySelector(".dragging")
      const taskList = this.querySelector(".task-list")
      taskList.appendChild(card)
      updateTaskStatus(card.getAttribute("data-task-id"), this.getAttribute("data-status"))
    }
  
    function updateTaskStatus(taskId, newStatus) {
      fetch("/update-task-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({ taskId: taskId, newStatus: newStatus }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("Task status updated successfully")
            location.reload()
          } else {
            console.error("Error updating task status:", data.message)
            alert(`Error updating task status: ${data.message}`)
            location.reload()
          }
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    }
    
    function getCookie(name) {
      let cookieValue = null
      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";")
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim()
          if (cookie.substring(0, name.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
            break
          }
        }
      }
      return cookieValue
    }    
  })
  
  