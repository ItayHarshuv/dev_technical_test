"use strict";
class NavbarMenu {
    constructor() {
        this.toggleBtn = document.getElementById('navbarToggleBtn');
        this.closeBtn = document.getElementById('closeMenuBtn');
        this.menuOverlay = document.getElementById('fullscreenMenu');
        this.initializeEventListeners();
    }
    initializeEventListeners() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.openMenu());
        }
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeMenu());
        }
        if (this.menuOverlay) {
            // Close menu when clicking outside the content area
            this.menuOverlay.addEventListener('click', (e) => {
                if (e.target === this.menuOverlay) {
                    this.closeMenu();
                }
            });
        }
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.menuOverlay?.classList.contains('show')) {
                this.closeMenu();
            }
        });
    }
    openMenu() {
        if (this.menuOverlay) {
            this.menuOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    closeMenu() {
        if (this.menuOverlay) {
            this.menuOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
}
// Initialize navbar menu when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new NavbarMenu();
    });
}
else {
    new NavbarMenu();
}
