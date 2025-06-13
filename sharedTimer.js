let interval;

function initTimer(displayElementId) {
  const display = document.getElementById(displayElementId);

  function updateDisplay(secondsLeft) {
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');
    display.textContent = `${minutes}:${seconds}`;
  }

  function getState() {
    return JSON.parse(localStorage.getItem("pomodoro-state")) || {
      timeLeft: 1500,
      isRunning: false,
      lastUpdated: Date.now()
    };
  }

  function saveState(state) {
    localStorage.setItem("pomodoro-state", JSON.stringify(state));
  }

  function tick() {
    let state = getState();
    const now = Date.now();
    const elapsed = Math.floor((now - state.lastUpdated) / 1000);
    if (state.isRunning) {
      state.timeLeft = Math.max(0, state.timeLeft - elapsed);
    }
    state.lastUpdated = now;
    saveState(state);
    updateDisplay(state.timeLeft);

    if (state.timeLeft === 0) {
      clearInterval(interval);
      state.isRunning = false;
      saveState(state);
    }
  }

  function syncAndStart() {
    tick(); 
    clearInterval(interval);
    interval = setInterval(tick, 1000);
  }

  syncAndStart();

  const startBtn = document.getElementById("start");
  const pauseBtn = document.getElementById("pause");
  const resetBtn = document.getElementById("reset");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      const state = getState();
      state.isRunning = true;
      state.lastUpdated = Date.now();
      saveState(state);
      syncAndStart();
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      const state = getState();
      tick(); 
      state.isRunning = false;
      saveState(state);
      clearInterval(interval);
    });
  }

  if (resetBtn) {
    const confirmReset = () => {
      const state = { timeLeft: 1500, isRunning: false, lastUpdated: Date.now() };
      saveState(state);
      tick();
    };
    resetBtn.addEventListener("click", confirmReset);
  }
}
