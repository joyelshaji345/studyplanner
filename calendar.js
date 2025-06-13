const monthYear = document.getElementById("month-year");
const calendarGrid = document.getElementById("calendar-grid");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentDate = new Date();

// Unique key for each month
function getMonthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

// Extended default events for multiple months
function getDefaultEvents() {
  return {
    "2025-5": {
      9: "C lab exam+record",
      10: "Hardware lab exam",
      15: "Web Project Deadline"
    },
    "2025-6": {
      12: "Last working day",
      20: "Sem exam"
    },
  };
}

// Load events from localStorage
function loadEvents() {
  return JSON.parse(localStorage.getItem("calendarEvents") || "{}");
}

// Save events to localStorage
function saveEvents(events) {
  localStorage.setItem("calendarEvents", JSON.stringify(events));
}

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  monthYear.textContent = `${monthNames[month]} ${year}`;
  calendarGrid.innerHTML = "";

  const events = loadEvents();
  const monthKey = getMonthKey(date);
  const defaultEvents = getDefaultEvents();

  if (!events[monthKey]) {
    events[monthKey] = defaultEvents[monthKey] || {};
    saveEvents(events);
  }

  const currentMonthEvents = events[monthKey];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach(day => {
    const div = document.createElement("div");
    div.className = "day-name";
    div.textContent = day;
    calendarGrid.appendChild(div);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day";
    empty.style.visibility = "hidden";
    calendarGrid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.dataset.day = day;

    if (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    ) {
      dayEl.style.border = "2px solid #000";
      dayEl.style.boxShadow = "0 0 10px #000000aa";
    }

    const eventText = currentMonthEvents[day];
    dayEl.innerHTML = `<strong>${day}</strong><div class="event-text">${eventText || ""}</div>`;
    if (eventText) {
      dayEl.style.backgroundColor = "#ff3e3e96";
      dayEl.style.border = "2px solid #1f8700";
    }

    dayEl.addEventListener("click", () => {
      let input = prompt(`Event for ${day} ${monthNames[month]}\n(Leave empty to delete)`, eventText || "");
      if (input !== null) {
        if (input.trim() === "") {
          delete currentMonthEvents[day];
        } else {
          currentMonthEvents[day] = input;
        }
        events[monthKey] = currentMonthEvents;
        saveEvents(events);
        renderCalendar(currentDate);
      }
    });

    calendarGrid.appendChild(dayEl);
  }

  renderUpcomingEvents();
}

function renderUpcomingEvents() {
  const listEl = document.getElementById("event-list");
  if (!listEl) return;

  const events = loadEvents();
  const keys = Object.keys(events);
  const future = [];

  keys.forEach(monthKey => {
    const [year, month] = monthKey.split("-").map(Number);
    Object.entries(events[monthKey]).forEach(([day, text]) => {
      const date = new Date(year, month, parseInt(day));
      future.push({ date, text });
    });
  });

  future.sort((a, b) => a.date - b.date);

  listEl.innerHTML = future
    .map(e => {
      const d = e.date.toDateString();
      return `<li><strong>${d}:</strong> ${e.text}</li>`;
    })
    .join("");
}

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

renderCalendar(currentDate);
