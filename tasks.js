// tasks.js - The new unified task management system

// --- DATA MANAGEMENT ---

// Provides a default set of tasks for the first time a user opens the app.
function getDefaultTasks() {
  return [
    { id: Date.now() + 1, text: "Complete physics lab record", done: false, isToday: true, deadline: '' },
    { id: Date.now() + 2, text: "Practice maths QB", done: false, isToday: true, deadline: '2025-06-20' },
    { id: Date.now() + 3, text: "Work on Web project", done: false, isToday: true, deadline: '' },
    { id: Date.now() + 4, text: "Check new interships", done: false, isToday: true, deadline: '' },
    { id: Date.now() + 5, text: "Digital logic homework", done: false, isToday: false, deadline: '' },
    { id: Date.now() + 6, text: "Complete C note", done: false, isToday: false, deadline: '' },
    { id: Date.now() + 7, text: "Study for lab exam", done: true, isToday: true, deadline: '' },
    { id: Date.now() + 8, text: "Prepare for seminar", done: false, isToday: false, deadline: '2025-06-30' }
  ];
}

// Loads tasks from localStorage or provides defaults. This is the single source of truth.
function loadTasks() {
  const tasksJSON = localStorage.getItem('todo-tasks-unified'); // Using a new key to avoid conflicts
  return tasksJSON ? JSON.parse(tasksJSON) : getDefaultTasks();
}

// Saves the entire task list to localStorage.
function saveTasks(tasks) {
  localStorage.setItem('todo-tasks-unified', JSON.stringify(tasks));
}


// --- CORE TASK ACTIONS (can be called from any page) ---

function addTask(text) {
  const tasks = loadTasks();
  const newTask = {
    id: Date.now(), // Unique ID based on timestamp
    text: text,
    done: false,
    isToday: false, // New tasks don't appear on homepage by default
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


// --- RENDERING LOGIC (for displaying tasks on the pages) ---

// Renders the "What to do today?" list on the homepage.
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


// Renders the full master list on the To-Do page.
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
    li.className = 'task-item'; // Use a different class to avoid style conflicts
    if(task.isToday) li.classList.add('is-today');
    if(task.done) li.classList.add('is-done');

    li.innerHTML = `
      <div class="task-main">
        <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
      </div>
      <div class="task-details">
        <label>Deadline: <input type="date" class="deadline-input" value="${task.deadline}"></label>
      </div>
      <div class="task-actions">
        <button class="today-btn" title="Mark for Today">${task.isToday ? '★' : '☆'}</button>
        <button class="delete-btn" title="Delete Task">✖</button>
      </div>
    `;

    // Add event listeners
    li.querySelector('.task-checkbox').addEventListener('change', () => {
      toggleTaskDone(task.id);
      renderMasterTasks();
    });
    li.querySelector('.today-btn').addEventListener('click', () => {
      toggleIsToday(task.id);
      renderMasterTasks();
    });
    li.querySelector('.delete-btn').addEventListener('click', () => {
      deleteTask(task.id);
      renderMasterTasks();
    });
    li.querySelector('.deadline-input').addEventListener('change', (e) => {
        setDeadline(task.id, e.target.value);
        renderMasterTasks();
    });

    masterTaskList.appendChild(li);
  });
}


// --- PAGE INITIALIZATION ---

// Sets up the event listeners for the To-Do page.
// --- PAGE INITIALIZATION ---

function initializeTodoPage() {
  const addTaskForm = document.getElementById('addTaskForm');
  const taskInput = document.getElementById('taskInput');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');

  console.log("initializeTodoPage is executing..."); // DEBUG

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

// 🔧 EXPOSE THE FUNCTION
window.initializeTodoPage = initializeTodoPage;
