
const POMODORO_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60; 

let timerInterval = null;

function startTimer() {
  clearInterval(timerInterval); 

  let state = JSON.parse(localStorage.getItem('pomodoroState')) || {};

  if (!state.isRunning) {
    state.isRunning = true;
    
    const duration = state.mode === 'break' ? BREAK_DURATION : POMODORO_DURATION;
    const timeToRun = state.timeRemaining || duration;
    state.endTime = Date.now() + (timeToRun * 1000);
    delete state.timeRemaining; 

    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }

  timerInterval = setInterval(tick, 250);
  if (window.location.pathname.includes("index.html")) {
    setTimeout(() => { window.location.href = "timer.html"; }, 100);
  }
}

function pauseTimer() {
  clearInterval(timerInterval);
  let state = JSON.parse(localStorage.getItem('pomodoroState')) || {};

  if (state.isRunning) {
    state.isRunning = false;
    const secondsLeft = Math.round((state.endTime - Date.now()) / 1000);
    state.timeRemaining = Math.max(0, secondsLeft);
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  let state = JSON.parse(localStorage.getItem('pomodoroState')) || {};  
  const duration = state.mode === 'break' ? BREAK_DURATION : POMODORO_DURATION;
  const newState = {
    isRunning: false,
    mode: state.mode || 'pomodoro',
    timeRemaining: duration
  };
  localStorage.setItem('pomodoroState', JSON.stringify(newState));
  updateDisplay(duration);
}
function tick() {
  const state = JSON.parse(localStorage.getItem('pomodoroState')) || {};
  if (!state.isRunning) {
    clearInterval(timerInterval);
    return;
  }
  const secondsLeft = Math.round((state.endTime - Date.now()) / 1000);
  if (secondsLeft < 0) {
    clearInterval(timerInterval);
    alert("Time's up!");
    resetTimer();
    return;
  }
  
  updateDisplay(secondsLeft);
}

function updateDisplay(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  
  const displayElements = document.querySelectorAll("#home-time, #time");
  displayElements.forEach(el => {
    if (el) el.textContent = `${minutes}:${secs}`;
  });
}

function setMode(mode) {
  pauseTimer();
  const duration = mode === 'break' ? BREAK_DURATION : POMODORO_DURATION;
  const newState = {
    isRunning: false,
    mode: mode,
    timeRemaining: duration
  };
  
  localStorage.setItem('pomodoroState', JSON.stringify(newState));
  updateDisplay(duration);
  updateModeButtons();
}

function updateModeButtons() {
    const state = JSON.parse(localStorage.getItem('pomodoroState')) || {};
    const pomodoroBtn = document.getElementById('pomodoro-mode');
    const breakBtn = document.getElementById('break-mode');

    if (pomodoroBtn && breakBtn) {
        if (state.mode === 'break') {
            breakBtn.classList.add('active');
            pomodoroBtn.classList.remove('active');
        } else {
            pomodoroBtn.classList.add('active');
            breakBtn.classList.remove('active');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById("start");
  const pauseBtn = document.getElementById("pause");
  const resetBtn = document.getElementById("reset");
  if (startBtn) startBtn.addEventListener("click", startTimer);
  if (pauseBtn) pauseBtn.addEventListener("click", pauseTimer);
  if (resetBtn) resetBtn.addEventListener("click", resetTimer);
  
  const pomodoroModeBtn = document.getElementById('pomodoro-mode');
  const breakModeBtn = document.getElementById('break-mode');
  if (pomodoroModeBtn) pomodoroModeBtn.addEventListener('click', () => setMode('pomodoro'));
  if (breakModeBtn) breakModeBtn.addEventListener('click', () => setMode('break'));
  let state = JSON.parse(localStorage.getItem('pomodoroState'));
  if (!state) {
    resetTimer();
    state = JSON.parse(localStorage.getItem('pomodoroState'));
  }
  const initialSeconds = state.timeRemaining || (state.mode === 'break' ? BREAK_DURATION : POMODORO_DURATION);
  updateDisplay(initialSeconds);
  updateModeButtons();
  if (state.isRunning) {
    timerInterval = setInterval(tick, 250);
  }
});
