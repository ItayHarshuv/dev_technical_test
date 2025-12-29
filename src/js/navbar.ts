// Initialize navbar menu when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
  });
} else {
  initNavbar();
}

function openMenu(): void {
  const menuOverlay = document.getElementById("fullscreenMenu");
  if (menuOverlay) {
    menuOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

function closeMenu(): void {
  const menuOverlay = document.getElementById("fullscreenMenu");
  if (menuOverlay) {
    menuOverlay.classList.remove("show");
    document.body.style.overflow = "";
  }
}

function initializeEventListeners(): void {
  const toggleBtn = document.getElementById("navbarToggleBtn");
  const closeBtn = document.getElementById("closeMenuBtn");
  const menuOverlay = document.getElementById("fullscreenMenu");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => openMenu());
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeMenu());
  }

  if (menuOverlay) {
    // Close menu when clicking outside the content area
    menuOverlay.addEventListener("click", (e: MouseEvent) => {
      if (e.target === menuOverlay) {
        closeMenu();
      }
    });
  }

  // Close menu on escape key
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    const menuOverlay = document.getElementById("fullscreenMenu");
    if (e.key === "Escape" && menuOverlay?.classList.contains("show")) {
      closeMenu();
    }
  });
}

function initNavbar(): void {
  initializeEventListeners();
}


