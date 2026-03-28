/**
 * ═══════════════════════════════════════════════════════════════
 *                    📋 PARK CITY 3&4 APARTMENTS
 *                    RESIDENT FORMS PAGE - JAVASCRIPT
 *        Paper Document Forms × Animations × FormSubmit.co
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// 🧭 NAVIGATION CONTROLLER (reused from main site)
// ═══════════════════════════════════════════════════════════════

class FormsNavigation {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.navToggle = document.getElementById('navToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.menuClose = document.getElementById('menuClose');
        this.isMenuOpen = false;

        if (!this.nav) return;
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }
        if (this.menuClose) {
            this.menuClose.addEventListener('click', () => this.closeMenu());
        }

        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.closeMenu(), 300);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) this.closeMenu();
        });

        if (this.mobileMenu) {
            this.mobileMenu.addEventListener('click', (e) => {
                if (e.target === this.mobileMenu) this.closeMenu();
            });
        }

        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    toggleMenu() {
        this.isMenuOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.isMenuOpen = true;
        this.mobileMenu.classList.add('active');
        this.navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.mobileMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        setTimeout(() => { document.body.style.overflow = ''; }, 400);
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 📋 PAPER FORM CONTROLLER
// ═══════════════════════════════════════════════════════════════

class PaperFormController {
    constructor() {
        this.form = document.getElementById('bikeRackFormEl');
        this.submitBtn = document.getElementById('paperSubmitBtn');
        this.successOverlay = document.getElementById('formSuccessOverlay');
        this.successDismiss = document.getElementById('successDismiss');

        if (!this.form) return;
        this.init();
    }

    init() {
        console.log('📋 Paper Form: Initializing...');

        this.bindFieldEffects();
        this.bindFormSubmit();
        this.bindSuccessDismiss();
        this.checkForSubmissionReturn();
        this.autoFillDate();

        console.log('✅ Paper Form: Ready');
    }

    // Auto-fill today's date
    autoFillDate() {
        const dateInput = this.form.querySelector('.date-input');
        if (dateInput && !dateInput.value) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            dateInput.value = `${yyyy}-${mm}-${dd}`;
        }
    }

    // Field focus/blur effects
    bindFieldEffects() {
        const fields = this.form.querySelectorAll('.paper-field');

        fields.forEach(field => {
            const input = field.querySelector('.paper-input');
            if (!input) return;

            input.addEventListener('focus', () => {
                field.classList.add('field-active');
                this.createFieldGlow(field);
            });

            input.addEventListener('blur', () => {
                field.classList.remove('field-active');
                if (input.value.trim() !== '') {
                    input.classList.add('filled');
                } else {
                    input.classList.remove('filled');
                }
            });

            // Typewriter placeholder animation on first focus
            input.addEventListener('focus', () => {
                if (input.dataset.focused) return;
                input.dataset.focused = 'true';
                const placeholder = input.getAttribute('placeholder');
                if (placeholder) {
                    input.setAttribute('placeholder', '');
                    let i = 0;
                    const typeInterval = setInterval(() => {
                        if (i < placeholder.length) {
                            input.setAttribute('placeholder', placeholder.substring(0, i + 1));
                            i++;
                        } else {
                            clearInterval(typeInterval);
                        }
                    }, 30);
                }
            }, { once: true });
        });

        // Checkbox click feedback
        const checkboxes = this.form.querySelectorAll('.paper-checkbox');
        checkboxes.forEach(cb => {
            cb.addEventListener('click', () => {
                this.pulseCheckbox(cb);
            });
        });
    }

    // Subtle glow on field focus
    createFieldGlow(field) {
        if (window.innerWidth <= 768) return;

        const glow = document.createElement('div');
        glow.style.cssText = `
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 120%;
            background: radial-gradient(ellipse at left center, rgba(166, 124, 82, 0.06) 0%, transparent 70%);
            transform: translateY(-50%);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.4s ease;
            z-index: 0;
            border-radius: 8px;
        `;

        field.style.position = 'relative';
        field.appendChild(glow);

        requestAnimationFrame(() => { glow.style.opacity = '1'; });

        const input = field.querySelector('.paper-input');
        if (input) {
            const removeGlow = () => {
                glow.style.opacity = '0';
                setTimeout(() => glow.remove(), 400);
            };
            input.addEventListener('blur', removeGlow, { once: true });
        }
    }

    // Checkbox pulse animation
    pulseCheckbox(cb) {
        const box = cb.querySelector('.checkbox-box');
        if (!box) return;

        box.style.transition = 'transform 0.15s ease';
        box.style.transform = 'scale(1.2)';
        setTimeout(() => {
            box.style.transform = 'scale(1)';
        }, 150);
    }

    // Form submission handler
    bindFormSubmit() {
        this.form.addEventListener('submit', (e) => {
            // Validate
            if (!this.form.checkValidity()) {
                e.preventDefault();
                this.highlightErrors();
                this.shakeForm();
                return;
            }

            // Show loading state (form will submit normally to FormSubmit.co)
            this.submitBtn.classList.add('loading');
        });
    }

    // Highlight invalid fields
    highlightErrors() {
        const invalids = this.form.querySelectorAll(':invalid');

        invalids.forEach(input => {
            if (input.type === 'hidden' || input.name === '_honey') return;

            const field = input.closest('.paper-field') ||
                          input.closest('.paper-field-inline') ||
                          input.closest('.paper-agreement');

            if (field) {
                field.style.transition = 'background 0.3s ease';
                field.style.background = 'rgba(220, 38, 38, 0.06)';
                field.style.borderRadius = '6px';

                setTimeout(() => {
                    field.style.background = '';
                }, 2500);
            }

            // Focus first invalid
            if (input === invalids[0]) {
                input.focus();
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Shake animation on validation fail
    shakeForm() {
        const paper = document.querySelector('.paper-document');
        if (!paper) return;

        paper.style.animation = 'formShake 0.5s ease';
        setTimeout(() => {
            paper.style.animation = '';
        }, 500);
    }

    // Check if user was redirected back after FormSubmit
    checkForSubmissionReturn() {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.get('submitted') === 'bike') {
            setTimeout(() => {
                this.showSuccess();
            }, 600);

            // Clean URL
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
    }

    // Show success overlay
    showSuccess() {
        if (this.successOverlay) {
            this.successOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Dismiss success overlay
    bindSuccessDismiss() {
        if (this.successDismiss) {
            this.successDismiss.addEventListener('click', () => {
                this.successOverlay.classList.remove('active');
                document.body.style.overflow = '';
                this.form.reset();
                this.autoFillDate();

                // Remove filled classes
                this.form.querySelectorAll('.filled').forEach(el => {
                    el.classList.remove('filled');
                });
            });
        }

        // Click backdrop to dismiss
        if (this.successOverlay) {
            this.successOverlay.addEventListener('click', (e) => {
                if (e.target === this.successOverlay) {
                    this.successDismiss.click();
                }
            });
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎬 SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════════════════

class FormsScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');
        if (this.elements.length > 0) this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
        );

        this.elements.forEach(el => observer.observe(el));
    }
}

// ═══════════════════════════════════════════════════════════════
// ✨ PAPER DOCUMENT ENTRANCE ANIMATION
// ═══════════════════════════════════════════════════════════════

class PaperEntranceAnimation {
    constructor() {
        this.paper = document.querySelector('.paper-document');
        this.fields = document.querySelectorAll('.paper-field-group');
        this.header = document.querySelector('.paper-header');
        this.title = document.querySelector('.paper-form-title');

        if (!this.paper) return;
        this.init();
    }

    init() {
        // Observe when paper comes into view
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateIn();
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        observer.observe(this.paper);
    }

    animateIn() {
        // Check if GSAP is available
        if (typeof gsap !== 'undefined') {
            this.animateWithGSAP();
        } else {
            this.animateWithCSS();
        }
    }

    animateWithGSAP() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Paper slides up
        tl.from(this.paper, {
            y: 80,
            opacity: 0,
            duration: 1,
            clearProps: 'all'
        });

        // Header fades in
        if (this.header) {
            tl.from(this.header, {
                y: 30,
                opacity: 0,
                duration: 0.7,
                clearProps: 'all'
            }, '-=0.5');
        }

        // Title
        if (this.title) {
            tl.from(this.title, {
                y: 20,
                opacity: 0,
                duration: 0.6,
                clearProps: 'all'
            }, '-=0.4');
        }

        // Fields stagger in
        if (this.fields.length > 0) {
            tl.from(this.fields, {
                y: 25,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                clearProps: 'all'
            }, '-=0.3');
        }

        // Submit button
        const submitArea = document.querySelector('.paper-submit-area');
        if (submitArea) {
            tl.from(submitArea, {
                y: 20,
                opacity: 0,
                duration: 0.5,
                clearProps: 'all'
            }, '-=0.2');
        }
    }

    animateWithCSS() {
        // Fallback CSS animations
        this.paper.style.opacity = '0';
        this.paper.style.transform = 'translateY(60px)';
        this.paper.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        requestAnimationFrame(() => {
            this.paper.style.opacity = '1';
            this.paper.style.transform = 'translateY(0)';
        });

        // Stagger field groups
        this.fields.forEach((group, i) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            group.style.transition = `opacity 0.6s ease ${0.3 + i * 0.1}s, transform 0.6s ease ${0.3 + i * 0.1}s`;

            requestAnimationFrame(() => {
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            });
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 🖨️ PAPER TILT EFFECT (Desktop only)
// ═══════════════════════════════════════════════════════════════

class PaperTiltEffect {
    constructor() {
        this.paper = document.querySelector('.paper-document');
        if (!this.paper || window.innerWidth <= 968) return;
        this.init();
    }

    init() {
        this.paper.addEventListener('mousemove', (e) => {
            const rect = this.paper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * 1.5;
            const rotateY = ((centerX - x) / centerX) * 1.5;

            this.paper.style.transform = `
                perspective(1200px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-4px)
            `;
        });

        this.paper.addEventListener('mouseleave', () => {
            this.paper.style.transform = '';
            this.paper.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => {
                this.paper.style.transition = '';
            }, 600);
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 📊 FORM PROGRESS INDICATOR
// ═══════════════════════════════════════════════════════════════

class FormProgressIndicator {
    constructor() {
        this.form = document.getElementById('bikeRackFormEl');
        if (!this.form) return;
        this.init();
    }

    init() {
        this.createProgressBar();
        this.bindFieldChanges();
    }

    createProgressBar() {
        const bar = document.createElement('div');
        bar.className = 'form-progress-bar';
        bar.innerHTML = `
            <div class="progress-track">
                <div class="progress-fill" id="formProgressFill"></div>
            </div>
            <span class="progress-text" id="formProgressText">0% complete</span>
        `;

        // Insert before the paper document
        const wrapper = document.querySelector('.paper-form-wrapper');
        if (wrapper) {
            wrapper.insertBefore(bar, wrapper.firstChild);
        }

        this.progressFill = document.getElementById('formProgressFill');
        this.progressText = document.getElementById('formProgressText');

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .form-progress-bar {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 24px;
                padding: 0 8px;
            }

            .progress-track {
                flex: 1;
                height: 4px;
                background: rgba(212, 165, 116, 0.15);
                border-radius: 100px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #a67c52, #d4a574);
                border-radius: 100px;
                transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: 0 0 12px rgba(166, 124, 82, 0.4);
            }

            .progress-text {
                font-size: 0.75rem;
                font-weight: 600;
                color: #a67c52;
                white-space: nowrap;
                min-width: 90px;
                text-align: right;
            }
        `;
        document.head.appendChild(style);
    }

    bindFieldChanges() {
        const allInputs = this.form.querySelectorAll(
            'input[required], select[required], textarea[required]'
        );

        allInputs.forEach(input => {
            const events = ['input', 'change', 'blur'];
            events.forEach(evt => {
                input.addEventListener(evt, () => this.updateProgress(allInputs));
            });
        });

        // Initial update
        this.updateProgress(allInputs);
    }

    updateProgress(inputs) {
        let filled = 0;
        const total = inputs.length;

        inputs.forEach(input => {
            if (input.type === 'hidden' || input.name === '_honey') return;

            if (input.type === 'radio') {
                const name = input.name;
                const checked = this.form.querySelector(`input[name="${name}"]:checked`);
                if (checked) filled += 1 / this.form.querySelectorAll(`input[name="${name}"]`).length;
            } else if (input.type === 'checkbox') {
                if (input.checked) filled++;
            } else {
                if (input.value.trim() !== '') filled++;
            }
        });

        const percent = Math.min(100, Math.round((filled / total) * 100));

        if (this.progressFill) {
            this.progressFill.style.width = `${percent}%`;
        }
        if (this.progressText) {
            this.progressText.textContent = `${percent}% complete`;
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 🦶 FOOTER CONTROLLER (reused)
// ═══════════════════════════════════════════════════════════════

class FormsFooterController {
    constructor() {
        this.backToTop = document.getElementById('backToTop');
        if (this.backToTop) this.init();
    }

    init() {
        this.backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Footer reveal animation
        const footer = document.querySelector('.premium-footer');
        if (footer) {
            const cols = footer.querySelectorAll('.footer-brand-col, .footer-links-col, .footer-contact-col');
            const observer = new IntersectionObserver((entries) => {
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
                col.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;
                observer.observe(col);
            });
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎨 INJECT ANIMATION KEYFRAMES
// ═══════════════════════════════════════════════════════════════

function injectFormAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes formShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
            20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
    `;
    document.head.appendChild(style);
}

// ═══════════════════════════════════════════════════════════════
// 🚀 INITIALIZE EVERYTHING
// ═══════════════════════════════════════════════════════════════

class ResidentFormsApp {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.boot());
        } else {
            this.boot();
        }
    }

    boot() {
        try {
            console.log('');
            console.log('═══════════════════════════════════════════════════════════');
            console.log('📋  PARK CITY 3&4 — RESIDENT FORMS PAGE');
            console.log('    Paper Document × Premium Animations × FormSubmit.co');
            console.log('═══════════════════════════════════════════════════════════');
            console.log('');

            injectFormAnimations();

            new FormsNavigation();
            new FormsScrollAnimations();
            new PaperFormController();
            new PaperEntranceAnimation();
            new PaperTiltEffect();
            new FormProgressIndicator();
            new FormsFooterController();

            console.log('');
            console.log('═══════════════════════════════════════════════════════════');
            console.log('✅ ALL COMPONENTS INITIALIZED');
            console.log('📄 Paper Form: Bicycle Rack Application');
            console.log('📧 Email: FormSubmit.co → parkcity3and4@akam.com');
            console.log('🎬 Animations: GSAP + CSS fallback');
            console.log('📊 Progress: Real-time field tracking');
            console.log('📱 Mobile: Fully responsive');
            console.log('═══════════════════════════════════════════════════════════');
            console.log('');

        } catch (error) {
            console.error('❌ Forms page error:', error);
        }
    }
}

// Launch
const formsApp = new ResidentFormsApp();

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});
