document.addEventListener('DOMContentLoaded', () => {

  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const mainContent = document.querySelector('.main');
  
  if (sidebar && sidebarToggle) {
    if (document.body.classList.contains('home-page')) {
      sidebar.classList.add('active');
      const tip = document.getElementById('sidebar-tip');
      if (tip) {
        setTimeout(() => tip.remove(), 8000);
      }
      setTimeout(() => {
        sidebar.classList.remove('active');
      }, 2000);
    }

    sidebarToggle.addEventListener('click', (event) => {
      event.stopPropagation(); 
      sidebar.classList.toggle('active');
    });

    mainContent.addEventListener('click', () => {
      if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
      }
    });
  }

  const darkToggle = document.getElementById("darkToggle");

  function applyTheme() {
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark");
      if (darkToggle) darkToggle.checked = true;
    } else {
      document.body.classList.remove("dark");
      if (darkToggle) darkToggle.checked = false;
    }
  }

  if (darkToggle) {
    darkToggle.addEventListener("change", () => {
      if (darkToggle.checked) {
        localStorage.setItem("darkMode", "enabled");
      } else {
        localStorage.setItem("darkMode", "disabled");
      }
      applyTheme();
    });
  }

  applyTheme();
});
