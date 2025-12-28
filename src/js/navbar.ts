class NavbarMenu {
    private toggleBtn: HTMLElement | null;
    private closeBtn: HTMLElement | null;
    private menuOverlay: HTMLElement | null;

    constructor() {
        this.toggleBtn = document.getElementById('navbarToggleBtn');
        this.closeBtn = document.getElementById('closeMenuBtn');
        this.menuOverlay = document.getElementById('fullscreenMenu');
        
        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.openMenu());
        }

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeMenu());
        }

        if (this.menuOverlay) {
            // Close menu when clicking outside the content area
            this.menuOverlay.addEventListener('click', (e: MouseEvent) => {
                if (e.target === this.menuOverlay) {
                    this.closeMenu();
                }
            });
        }

        // Close menu on escape key
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape' && this.menuOverlay?.classList.contains('show')) {
                this.closeMenu();
            }
        });
    }

    private openMenu(): void {
        if (this.menuOverlay) {
            this.menuOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    private closeMenu(): void {
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
} else {
    new NavbarMenu();
}

