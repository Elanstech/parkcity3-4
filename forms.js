/**
 * ═══════════════════════════════════════
 *   PARK CITY 3&4 — RESIDENT FORMS JS
 *   Login Gate × Tile Grid × Multi-Form
 *   Overlay × FormSubmit.co × Animations
 * ═══════════════════════════════════════
 */


// ═══════════════════════════════════════
// LOGIN GATE CONTROLLER
// ═══════════════════════════════════════

class LoginGateController {
    constructor() {
        this.gate = document.getElementById('loginGate');
        this.card = document.getElementById('loginCard');
        this.passwordInput = document.getElementById('loginPassword');
        this.submitBtn = document.getElementById('loginSubmitBtn');
        this.fieldWrap = document.getElementById('loginFieldWrap');
        this.errorMsg = document.getElementById('loginError');
        this.eyeBtn = document.getElementById('loginEyeBtn');

        this.correctPassword = 'iamaresident';
        this.sessionKey = 'pc34_forms_auth';
        this.showingPassword = false;

        if (!this.gate) return;
        this.init();
    }

    init() {
        // Check if already authenticated this session
        if (sessionStorage.getItem(this.sessionKey) === 'true') {
            this.gate.style.display = 'none';
            document.body.style.overflow = '';
            return;
        }

        // Lock scroll while login is showing
        document.body.style.overflow = 'hidden';

        // Bind submit button
        this.submitBtn.addEventListener('click', () => {
            this.attemptLogin();
        });

        // Bind enter key
        this.passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.attemptLogin();
            }
        });

        // Clear error on input
        this.passwordInput.addEventListener('input', () => {
            this.fieldWrap.classList.remove('error');
        });

        // Eye toggle
        if (this.eyeBtn) {
            this.eyeBtn.addEventListener('click', () => {
                this.togglePasswordVisibility();
            });
        }
    }

    attemptLogin() {
        const value = this.passwordInput.value.trim().toLowerCase();

        if (value === this.correctPassword) {
            // Success — save to session and hide gate
            sessionStorage.setItem(this.sessionKey, 'true');
            this.gate.classList.add('hidden');
            document.body.style.overflow = '';

            // Remove gate from DOM after animation
            setTimeout(() => {
                this.gate.style.display = 'none';
            }, 700);
        } else {
            // Error — shake and show message
            this.fieldWrap.classList.add('error');
            this.passwordInput.focus();
            this.passwordInput.select();
        }
    }

    togglePasswordVisibility() {
        this.showingPassword = !this.showingPassword;

        if (this.showingPassword) {
            this.passwordInput.type = 'text';
            this.eyeBtn.querySelector('.eye-open').style.display = 'none';
            this.eyeBtn.querySelector('.eye-closed').style.display = 'block';
        } else {
            this.passwordInput.type = 'password';
            this.eyeBtn.querySelector('.eye-open').style.display = 'block';
            this.eyeBtn.querySelector('.eye-closed').style.display = 'none';
        }

        this.passwordInput.focus();
    }
}


// ═══════════════════════════════════════
// NAV CONTROLLER
// ═══════════════════════════════════════

class FormsNav {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.toggle = document.getElementById('navToggle');
        this.menu = document.getElementById('mobileMenu');
        this.close = document.getElementById('menuClose');
        this.open = false;

        if (!this.nav) return;
        this.init();
    }

    init() {
        // Toggle button
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.flip());
        }

        // Close button
        if (this.close) {
            this.close.addEventListener('click', () => this.shut());
        }

        // Menu links close menu
        document.querySelectorAll('.menu-link').forEach(l => {
            l.addEventListener('click', () => {
                setTimeout(() => this.shut(), 300);
            });
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.open) {
                this.shut();
            }
        });

        // Click outside
        if (this.menu) {
            this.menu.addEventListener('click', (e) => {
                if (e.target === this.menu) this.shut();
            });
        }

        // Scroll effect
        window.addEventListener('scroll', () => {
            this.nav.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    flip() {
        this.open ? this.shut() : this.show();
    }

    show() {
        this.open = true;
        this.menu.classList.add('active');
        this.toggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    shut() {
        this.open = false;
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 400);
    }
}


// ═══════════════════════════════════════
// TILE → OVERLAY CONTROLLER (MULTI-FORM)
// ═══════════════════════════════════════

class FormOverlayController {
    constructor() {
        this.overlay = document.getElementById('formOverlay');
        this.backdrop = document.getElementById('formOverlayBackdrop');
        this.closeBtn = document.getElementById('formOverlayClose');
        this.tiles = document.querySelectorAll('.form-tile[data-form]');
        this.progressFill = document.getElementById('formProgressFill');
        this.progressText = document.getElementById('formProgressText');
        this.allFormPages = document.querySelectorAll('.paper-form-page');
        this.currentFormId = null;

        if (!this.overlay) return;
        this.init();
    }

    init() {
        // Tile clicks open overlay with the right form
        this.tiles.forEach(tile => {
            tile.addEventListener('click', () => {
                const formId = tile.dataset.form;
                this.openOverlay(formId);
            });
        });

        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeOverlay());
        }

        // Backdrop click
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.closeOverlay());
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.closeOverlay();
            }
        });

        // Bind progress tracking on all forms
        this.bindProgressTracking();
    }

    openOverlay(formId) {
        this.currentFormId = formId;

        // Hide all form pages first
        this.allFormPages.forEach(page => {
            page.classList.remove('active-form');
            page.style.display = 'none';
        });

        // Show the selected form
        const targetForm = document.getElementById('form-' + formId);
        if (targetForm) {
            targetForm.style.display = 'block';
            targetForm.classList.add('active-form');
        }

        // Show overlay
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Scroll overlay container to top
        const container = document.querySelector('.form-overlay-container');
        if (container) {
            container.scrollTop = 0;
        }

        // Reset progress
        this.updateProgress();

        // Auto-fill date fields in the active form
        if (targetForm) {
            const dateInputs = targetForm.querySelectorAll('.date-input');
            dateInputs.forEach(input => {
                if (!input.value) {
                    const d = new Date();
                    const yyyy = d.getFullYear();
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const dd = String(d.getDate()).padStart(2, '0');
                    input.value = `${yyyy}-${mm}-${dd}`;
                }
            });
        }
    }

    closeOverlay() {
        this.overlay.classList.remove('active');
        this.currentFormId = null;

        setTimeout(() => {
            document.body.style.overflow = '';
        }, 300);
    }

    bindProgressTracking() {
        // Listen to all inputs inside all forms
        const allForms = this.overlay.querySelectorAll('form');

        allForms.forEach(form => {
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            const events = ['input', 'change', 'blur'];

            inputs.forEach(input => {
                events.forEach(evt => {
                    input.addEventListener(evt, () => this.updateProgress());
                });
            });
        });
    }

    updateProgress() {
        // Find the currently active form
        const activeForm = document.querySelector('.paper-form-page.active-form form');
        if (!activeForm) return;

        const required = activeForm.querySelectorAll('input[required], select[required], textarea[required]');
        let filled = 0;
        const radioGroups = new Set();
        const uniqueFields = new Set();

        required.forEach(input => {
            // Skip hidden fields and honeypot
            if (input.type === 'hidden' || input.name === '_honey') return;

            if (input.type === 'radio') {
                if (!radioGroups.has(input.name)) {
                    radioGroups.add(input.name);
                    uniqueFields.add(input.name);
                    if (activeForm.querySelector(`input[name="${input.name}"]:checked`)) {
                        filled++;
                    }
                }
            } else if (input.type === 'checkbox') {
                uniqueFields.add(input.name || Math.random());
                if (input.checked) filled++;
            } else {
                uniqueFields.add(input.name || input.id || Math.random());
                if (input.value.trim()) filled++;
            }
        });

        const total = uniqueFields.size;
        const pct = total > 0 ? Math.min(100, Math.round((filled / total) * 100)) : 0;

        if (this.progressFill) {
            this.progressFill.style.width = pct + '%';
        }

        if (this.progressText) {
            this.progressText.textContent = pct + '%';
        }
    }
}


// ═══════════════════════════════════════
// PAPER FORM CONTROLLER (ALL FORMS)
// ═══════════════════════════════════════

class PaperFormController {
    constructor() {
        this.forms = document.querySelectorAll('.paper-form-page form');
        this.successOverlay = document.getElementById('formSuccessOverlay');
        this.successDismiss = document.getElementById('successDismiss');

        if (!this.forms.length) return;
        this.init();
    }

    init() {
        // Setup each form
        this.forms.forEach(form => {
            this.bindFieldEffects(form);
            this.bindFormSubmit(form);
            this.syncReplyTo(form);
        });

        // Success dismiss
        this.bindSuccessDismiss();

        // Check if returning from a FormSubmit redirect
        this.checkReturnFromSubmit();
    }

    // --- Field Focus Effects ---
    bindFieldEffects(form) {
        form.querySelectorAll('.paper-field').forEach(field => {
            const input = field.querySelector('.paper-input, .paper-textarea, .paper-select');
            if (!input) return;

            input.addEventListener('focus', () => {
                field.classList.add('field-active');
            });

            input.addEventListener('blur', () => {
                field.classList.remove('field-active');
                if (input.value && input.value.trim() !== '') {
                    input.classList.add('filled');
                } else {
                    input.classList.remove('filled');
                }
            });
        });
    }

    // --- Form Submit Handling ---
    bindFormSubmit(form) {
        form.addEventListener('submit', (e) => {
            // Validate
            if (!form.checkValidity()) {
                e.preventDefault();
                this.highlightErrors(form);
                return;
            }

            // Show loading state on the submit button
            const submitBtn = form.querySelector('.paper-submit-btn');
            if (submitBtn) {
                submitBtn.classList.add('loading');
            }
        });
    }

    // --- Highlight Errors ---
    highlightErrors(form) {
        const invalids = form.querySelectorAll(':invalid');

        invalids.forEach((input, i) => {
            // Skip hidden/honeypot
            if (input.type === 'hidden' || input.name === '_honey') return;

            // Find wrapping element
            const wrap = input.closest('.paper-field')
                || input.closest('.paper-field-inline')
                || input.closest('.paper-agreement')
                || input.closest('.paper-checkbox-group');

            if (wrap) {
                wrap.style.background = 'rgba(220, 38, 38, .06)';
                wrap.style.borderRadius = '6px';
                wrap.style.transition = 'background .3s ease';

                setTimeout(() => {
                    wrap.style.background = '';
                }, 2500);
            }

            // Focus first invalid
            if (i === 0) {
                input.focus();
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        // Shake the paper
        const paper = form.closest('.paper-document');
        if (paper) {
            paper.style.animation = 'formShake .5s ease';
            setTimeout(() => {
                paper.style.animation = '';
            }, 500);
        }
    }

    // --- Sync email to _replyto hidden field ---
    syncReplyTo(form) {
        const emailInput = form.querySelector('input[name="email"]');
        const replyTo = form.querySelector('input[name="_replyto"]');

        if (emailInput && replyTo) {
            emailInput.addEventListener('input', () => {
                replyTo.value = emailInput.value;
            });
        }
    }

    // --- Check Return From FormSubmit ---
    checkReturnFromSubmit() {
        const params = new URLSearchParams(window.location.search);

        if (params.get('submitted')) {
            setTimeout(() => {
                if (this.successOverlay) {
                    this.successOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }, 500);

            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // --- Success Dismiss ---
    bindSuccessDismiss() {
        const dismiss = () => {
            if (this.successOverlay) {
                this.successOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            // Close the form overlay too
            const formOverlay = document.getElementById('formOverlay');
            if (formOverlay) {
                formOverlay.classList.remove('active');
            }

            // Reset all forms
            this.forms.forEach(form => {
                form.reset();

                // Re-fill date inputs
                form.querySelectorAll('.date-input').forEach(input => {
                    const d = new Date();
                    const yyyy = d.getFullYear();
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const dd = String(d.getDate()).padStart(2, '0');
                    input.value = `${yyyy}-${mm}-${dd}`;
                });

                // Remove loading state from submit buttons
                const submitBtn = form.querySelector('.paper-submit-btn');
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                }

                // Remove filled classes
                form.querySelectorAll('.filled').forEach(el => {
                    el.classList.remove('filled');
                });
            });
        };

        // Dismiss button
        if (this.successDismiss) {
            this.successDismiss.addEventListener('click', dismiss);
        }

        // Click outside card
        if (this.successOverlay) {
            this.successOverlay.addEventListener('click', (e) => {
                if (e.target === this.successOverlay) {
                    dismiss();
                }
            });
        }
    }
}


// ═══════════════════════════════════════
// SCROLL ANIMATIONS (Intersection Observer)
// ═══════════════════════════════════════

class FormsScrollAnim {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');

        if (!this.elements.length) return;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        this.elements.forEach(el => observer.observe(el));
    }
}


// ═══════════════════════════════════════
// SMOOTH SCROLL FOR ANCHOR LINKS
// ═══════════════════════════════════════

class FormsSmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                if (href && href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);

                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}


// ═══════════════════════════════════════
// FOOTER CONTROLLER
// ═══════════════════════════════════════

class FormsFooter {
    constructor() {
        this.init();
    }

    init() {
        // Back to top
        const btn = document.getElementById('backToTop');
        if (btn) {
            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Footer column reveal
        const footer = document.querySelector('.premium-footer');
        if (!footer) return;

        const cols = footer.querySelectorAll('.footer-brand-col, .footer-links-col, .footer-contact-col');

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cols.forEach((col, i) => {
            col.style.opacity = '0';
            col.style.transform = 'translateY(30px)';
            col.style.transition = `all .8s cubic-bezier(.16, 1, .3, 1) ${i * .1}s`;
            observer.observe(col);
        });
    }
}


// ═══════════════════════════════════════
// HERO PARALLAX (subtle orb movement)
// ═══════════════════════════════════════

class HeroParallax {
    constructor() {
        this.hero = document.querySelector('.forms-page-hero');
        this.orbs = document.querySelectorAll('.fh-orb');

        if (!this.hero || !this.orbs.length) return;

        // Only on desktop
        if (window.innerWidth > 968) {
            this.init();
        }
    }

    init() {
        this.hero.addEventListener('mousemove', (e) => {
            const rect = this.hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            this.orbs.forEach((orb, i) => {
                const speed = (i + 1) * 15;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });

        this.hero.addEventListener('mouseleave', () => {
            this.orbs.forEach(orb => {
                orb.style.transform = '';
                orb.style.transition = 'transform 0.8s ease';

                setTimeout(() => {
                    orb.style.transition = '';
                }, 800);
            });
        });
    }
}


// ═══════════════════════════════════════
// TILE HOVER SOUND FEEDBACK (optional)
// ═══════════════════════════════════════

class TileInteractions {
    constructor() {
        this.tiles = document.querySelectorAll('.form-tile');

        if (!this.tiles.length) return;

        // Only on desktop
        if (window.innerWidth > 968) {
            this.init();
        }
    }

    init() {
        this.tiles.forEach(tile => {
            // Magnetic tilt on hover
            tile.addEventListener('mousemove', (e) => {
                const rect = tile.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                tile.style.transform = `
                    perspective(800px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-8px)
                `;
            });

            tile.addEventListener('mouseleave', () => {
                tile.style.transform = '';
            });
        });
    }
}


// ═══════════════════════════════════════
// PHONE INPUT FORMATTER
// ═══════════════════════════════════════

class PhoneFormatter {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');

                if (value.length > 10) {
                    value = value.substring(0, 10);
                }

                if (value.length >= 7) {
                    value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
                } else if (value.length >= 4) {
                    value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
                } else if (value.length >= 1) {
                    value = `(${value}`;
                }

                e.target.value = value;
            });
        });
    }
}


// ═══════════════════════════════════════
// BOOT — Initialize Everything
// ═══════════════════════════════════════

function boot() {
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('📋  PARK CITY 3&4 — RESIDENT FORMS');
    console.log('    Login × 9 Forms × Animations');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Core systems
    new LoginGateController();
    new FormsNav();
    new FormOverlayController();
    new PaperFormController();

    // Animations & interactions
    new FormsScrollAnim();
    new FormsSmoothScroll();
    new FormsFooter();
    new HeroParallax();
    new TileInteractions();
    new PhoneFormatter();

    console.log('✅ All systems ready');
    console.log('');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

// Scroll to top on full page load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});
