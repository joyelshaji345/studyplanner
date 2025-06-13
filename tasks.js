function getDefaultTasks() {
  return [
    { id: 1001, text: "Complete physics lab record", done: false, isToday: true, deadline: '' },
    { id: 1002, text: "Practice maths QB", done: false, isToday: true, deadline: '2025-06-20' },
    { id: 1003, text: "Work on Web project", done: false, isToday: true, deadline: '' },
    { id: 1004, text: "Check new internships", done: false, isToday: true, deadline: '' },
    { id: 1005, text: "Digital logic homework", done: false, isToday: false, deadline: '' },
    { id: 1006, text: "Complete C note", done: false, isToday: false, deadline: '' },
    { id: 1007, text: "Study for lab exam", done: true, isToday: true, deadline: '' },
    { id: 1008, text: "Prepare for seminar", done: false, isToday: false, deadline: '2025-06-30' }
  ];
}

function loadTasks() {
  const tasksJSON = localStorage.getItem('todo-tasks-unified');
  if (tasksJSON) {
    return JSON.parse(tasksJSON);
  } else {
    const defaults = getDefaultTasks();
    saveTasks(defaults);
    return defaults;
  }
}


function saveTasks(tasks) {
  localStorage.setItem('todo-tasks-unified', JSON.stringify(tasks));
}


function addTask(text) {
  const tasks = loadTasks();
  const newTask = {
    id: Date.now(), 
    text: text,
    done: false,
    isToday: false, 
    deadline: ''
  };
  tasks.push(newTask);
  saveTasks(tasks);
}

function toggleTaskDone(taskId) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.done = !task.done;
    saveTasks(tasks);
  }
}

function deleteTask(taskId) {
  let tasks = loadTasks();
  tasks = tasks.filter(t => t.id !== taskId);
  saveTasks(tasks);
}

function toggleIsToday(taskId) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.isToday = !task.isToday;
    saveTasks(tasks);
  }
}

function setDeadline(taskId, deadline) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.deadline = deadline;
        saveTasks(tasks);
    }
}


function renderHomeTasks() {
  const homeTaskList = document.getElementById('home-task-list');
  if (!homeTaskList) return;

  const tasks = loadTasks();
  const todayTasks = tasks.filter(task => task.isToday);
  homeTaskList.innerHTML = '';

  if (todayTasks.length === 0) {
    homeTaskList.innerHTML = `<li class="task task-empty">Nothing marked for today! Go to the To-Do page.</li>`;
    return;
  }

  todayTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task';
    if (task.done) {
        li.style.textDecoration = "line-through";
        li.style.color = "gray";
        li.style.backgroundColor = "#e0e0e0";
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = task.text;
    textSpan.style.flexGrow = '1';

    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.textContent = task.done ? "Undo" : "Completed";
    completeBtn.addEventListener("click", () => {
        toggleTaskDone(task.id);
        renderHomeTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
        deleteTask(task.id);
        renderHomeTasks();
    });

    li.appendChild(textSpan);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    homeTaskList.appendChild(li);
  });
}

function renderMasterTasks() {
  const masterTaskList = document.getElementById('master-task-list');
  if (!masterTaskList) return;

  const tasks = loadTasks();
  masterTaskList.innerHTML = '';

  if (tasks.length === 0) {
    masterTaskList.innerHTML = `<li class="task-item task-empty">No tasks yet. Add one above to get started!</li>`;
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.isToday) li.classList.add('is-today');
    if (task.done) li.classList.add('is-done');

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.done;

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.className = "deadline-input";
    dateInput.value = task.deadline;

    const todayBtn = document.createElement("button");
    todayBtn.className = "today-btn";
    todayBtn.textContent = task.isToday ? '★' : '☆';
    todayBtn.title = "Mark for Today";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✖";
    deleteBtn.title = "Delete Task";

    // Structure the task item
    const mainDiv = document.createElement("div");
    mainDiv.className = "task-main";
    mainDiv.appendChild(checkbox);
    mainDiv.appendChild(span);

    const detailsDiv = document.createElement("div");
    detailsDiv.className = "task-details";
    const label = document.createElement("label");
    label.textContent = "Deadline: ";
    label.appendChild(dateInput);
    detailsDiv.appendChild(label);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";
    actionsDiv.appendChild(todayBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(mainDiv);
    li.appendChild(detailsDiv);
    li.appendChild(actionsDiv);

    // ✅ Attach event listeners
    checkbox.addEventListener("change", () => {
      toggleTaskDone(task.id);
      renderMasterTasks();
    });

    todayBtn.addEventListener("click", () => {
      toggleIsToday(task.id);
      renderMasterTasks();
    });

    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
      renderMasterTasks();
    });

    dateInput.addEventListener("change", (e) => {
      setDeadline(task.id, e.target.value);
      renderMasterTasks();
    });

    masterTaskList.appendChild(li);
  });
}

function initializeTodoPage() {
  const addTaskForm = document.getElementById('addTaskForm');
  const taskInput = document.getElementById('taskInput');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');

  console.log("initializeTodoPage is executing...");

  if (addTaskForm) {
    addTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = taskInput.value.trim();
      if (text) {
        addTask(text);
        taskInput.value = '';
        renderMasterTasks();
      }
    });
  }

  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', () => {
      let tasks = loadTasks();
      tasks = tasks.filter(task => !task.done);
      saveTasks(tasks);
      renderMasterTasks();
    });
  }

  renderMasterTasks();
}

window.initializeTodoPage = initializeTodoPage;
document.addEventListener("DOMContentLoaded", () => {
  initializeTodoPage();
});

