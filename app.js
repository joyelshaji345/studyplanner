// app.js - Global script for sidebar and dark mode functionality

document.addEventListener('DOMContentLoaded', () => {

  // --- Sidebar Toggle Logic ---
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const mainContent = document.querySelector('.main');
  
  if (sidebar && sidebarToggle) {
    // Open sidebar by default ONLY on homepage
    if (document.body.classList.contains('home-page')) {
      sidebar.classList.add('active');
      const tip = document.getElementById('sidebar-tip');
      if (tip) {
      // Automatically hide it after 5s already handled by CSS animation
      // You could remove it from DOM if you want:
        setTimeout(() => tip.remove(), 8000);
      }
      // ⏱️ Auto-close after 5 seconds
      setTimeout(() => {
        sidebar.classList.remove('active');
      }, 2000); // 5000ms = 5 seconds
    }

    // Toggle manually
    sidebarToggle.addEventListener('click', (event) => {
      event.stopPropagation(); 
      sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside
    mainContent.addEventListener('click', () => {
      if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
      }
    });
  }

  // --- Dark Mode Logic ---
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
