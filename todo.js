// Load tasks from localStorage
function loadTasks() {
  const saved = localStorage.getItem("todo-tasks");
  if (saved) return JSON.parse(saved);

  // Default tasks (first time only)
  const defaultTasks = [
    { text: "Finish homework", done: true },
    { text: "Practice keyboard", done: false },
    { text: "Read one chapter of CS book", done: false }
  ];
  saveTasks(defaultTasks);
  return defaultTasks;
}

// Save tasks to localStorage
function saveTasks(tasks) {
  localStorage.setItem("todo-tasks", JSON.stringify(tasks));
}

// Render tasks into the list
function renderTasks() {
  const taskList = document.getElementById("taskList");
  const tasks = loadTasks();
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      tasks[index].done = checkbox.checked;
      saveTasks(tasks);
      renderTasks();
    });

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.done) span.style.textDecoration = "line-through";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks(tasks);
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

// Add task on button click
document.getElementById("addTaskBtn").addEventListener("click", () => {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (text !== "") {
    const tasks = loadTasks();
    tasks.push({ text, done: false });
    saveTasks(tasks);
    input.value = "";
    renderTasks();
  }
document.getElementById("clearCompletedBtn").addEventListener("click", () => {
  const tasks = loadTasks().filter(task => !task.done);
  saveTasks(tasks);
  renderTasks();
});
});

// Initial render
window.addEventListener("DOMContentLoaded", renderTasks);
