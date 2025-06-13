// --- Universal Timer Script (Works Locally and Hosted) ---
// This script is designed to be robust in all environments.

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60;    // 5 minutes in seconds

// This is the one and only interval for the timer. It's a global variable.
let timerInterval = null;

// --- Core Timer Logic ---

/**
 * Starts or resumes the timer.
 * This function is safe to call at any time.
 */
function startTimer() {
  clearInterval(timerInterval); // Always clear any old timer to prevent duplicates.

  let state = JSON.parse(localStorage.getItem('pomodoroState')) || {};

  // Only start if it's not already running.
  if (!state.isRunning) {
    state.isRunning = true;
    
    // Determine how many seconds are left to run.
    // If it was paused, use the saved remaining time. Otherwise, start a fresh timer.
    const duration = state.mode === 'break' ? BREAK_DURATION : POMODORO_DURATION;
    const timeToRun = state.timeRemaining || duration;
    
    // The KEY to making it robust: We don't count down. We set a future end point.
    // This works perfectly even if the browser tab is inactive for a while.
    state.endTime = Date.now() + (timeToRun * 1000);
    
    // We no longer need the 'timeRemaining' value since we now have 'endTime'.
    delete state.timeRemaining; 

    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }

  // Start the 'tick' loop, which checks the time every quarter of a second.
  timerInterval = setInterval(tick, 250);

  // If on the homepage, redirect to the main timer page for a better user experience.
  if (window.location.pathname.includes("index.html")) {
    setTimeout(() => { window.location.href = "timer.html"; }, 100);
  }
}

/**
 * Pauses the currently running timer.
 */
function pauseTimer() {
  clearInterval(timerInterval); // Stop the 'tick' loop.
  let state = JSON.parse(localStorage.getItem('pomodoroState')) || {};

  if (state.isRunning) {
    state.isRunning = false;
    // Calculate and save the exact seconds left so we can resume later.
    const secondsLeft = Math.round((state.endTime - Date.now()) / 1000);
    state.timeRemaining = Math.max(0, secondsLeft);
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }
}

/**
 * Resets the timer to the full duration of the current mode (Pomodoro or Break).
 */
function resetTimer() {
  clearInterval(timerInterval); // Stop any running timer.
  let state = JSON.parse(localStorage.getItem('pomodoroState')) || {};
  
  const duration = state.mode === 'break' ? BREAK_DURATION : POMODORO_DURATION;
  
  // Create a clean, paused state object.
  const newState = {
    isRunning: false,
    mode: state.mode || 'pomodoro',
    timeRemaining: duration
  };
  localStorage.setItem('pomodoroState', JSON.stringify(newState));
  
  // Immediately update the clock display.
  updateDisplay(duration);
}

/**
 * The main 'tick' function that runs every 250ms.
 * It calculates the remaining time and updates the display.
 */
function tick() {
  const state = JSON.parse(localStorage.getItem('pomodoroState')) || {};
  
  // If for any reason the state says we shouldn't be running, stop.
  if (!state.isRunning) {
    clearInterval(timerInterval);
    return;
  }
  
  // The core calculation: how much time is left until the end point?
  const secondsLeft = Math.round((state.endTime - Date.now()) / 1000);

  // When the timer hits zero...
  if (secondsLeft < 0) {
    clearInterval(timerInterval);
    alert("Time's up!");
    resetTimer(); // Reset the timer for the next session.
    return;
  }
  
  updateDisplay(secondsLeft);
}

/**
 * Updates the time on the webpage (e.g., "24:59").
 * @param {number} seconds - The total seconds to display.
 */
function updateDisplay(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  
  const displayElements = document.querySelectorAll("#home-time, #time");
  displayElements.forEach(el => {
    if (el) el.textContent = `${minutes}:${secs}`;
  });
}

// --- Mode Switching ---

/**
 * Switches the timer mode between 'pomodoro' and 'break'.
 * @param {string} mode - The new mode ('pomodoro' or 'break').
 */
function setMode(mode) {
  pauseTimer(); // Always stop the timer before changing its fundamental state.

  const duration = mode === 'break' ? BREAK_DURATION : POMODORO_DURATION;
  
  // Create a new, clean state for the chosen mode.
  const newState = {
    isRunning: false,
    mode: mode,
    timeRemaining: duration
  };
  
  localStorage.setItem('pomodoroState', JSON.stringify(newState));
  updateDisplay(duration);
  updateModeButtons();
}

/**
 * Updates the visual style of the mode buttons to show which is active.
 */
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

// --- Page Load Logic ---

// This event listener ensures the script runs only after the full page is loaded.
document.addEventListener('DOMContentLoaded', () => {
  // Attach all the button click events.
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
  
  // --- Initial Page Setup ---
  let state = JSON.parse(localStorage.getItem('pomodoroState'));
  // If this is the very first time the user opens the app, set up a default state.
  if (!state) {
    resetTimer();
    state = JSON.parse(localStorage.getItem('pomodoroState'));
  }

  // Based on what's in localStorage, set the display to the correct time.
  const initialSeconds = state.timeRemaining || (state.mode === 'break' ? BREAK_DURATION : POMODORO_DURATION);
  updateDisplay(initialSeconds);
  updateModeButtons();
  
  // This is the magic for page navigation: if the state says the timer should be running,
  // we restart the 'tick' loop immediately upon loading the new page.
  if (state.isRunning) {
    timerInterval = setInterval(tick, 250);
  }
});