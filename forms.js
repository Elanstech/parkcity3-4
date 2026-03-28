/**
 * ═══════════════════════════════════════
 *   PARK CITY 3&4 — RESIDENT FORMS JS
 *   Tile Grid × Overlay × FormSubmit.co
 * ═══════════════════════════════════════
 */

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
        this.toggle?.addEventListener('click', () => this.flip());
        this.close?.addEventListener('click', () => this.shut());
        document.querySelectorAll('.menu-link').forEach(l => l.addEventListener('click', () => setTimeout(() => this.shut(), 300)));
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && this.open) this.shut(); });
        this.menu?.addEventListener('click', e => { if (e.target === this.menu) this.shut(); });
        window.addEventListener('scroll', () => this.nav.classList.toggle('scrolled', window.scrollY > 50), { passive: true });
    }
    flip() { this.open ? this.shut() : this.show(); }
    show() { this.open = true; this.menu.classList.add('active'); this.toggle.classList.add('active'); document.body.style.overflow = 'hidden'; }
    shut() { this.open = false; this.menu.classList.remove('active'); this.toggle.classList.remove('active'); setTimeout(() => document.body.style.overflow = '', 400); }
}

// ═══════════════════════════════════════
// TILE → OVERLAY CONTROLLER
// ═══════════════════════════════════════
class FormOverlayController {
    constructor() {
        this.overlay = document.getElementById('formOverlay');
        this.backdrop = document.getElementById('formOverlayBackdrop');
        this.closeBtn = document.getElementById('formOverlayClose');
        this.tiles = document.querySelectorAll('.form-tile:not(.form-tile-disabled)');
        this.progressFill = document.getElementById('formProgressFill');
        this.progressText = document.getElementById('formProgressText');
        this.currentForm = null;
        if (!this.overlay) return;
        this.init();
    }

    init() {
        // Tile clicks open overlay
        this.tiles.forEach(tile => {
            tile.addEventListener('click', () => {
                const formId = tile.dataset.form;
                this.openOverlay(formId);
            });
        });

        // Close button
        this.closeBtn?.addEventListener('click', () => this.closeOverlay());
        this.backdrop?.addEventListener('click', () => this.closeOverlay());

        // Escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.closeOverlay();
            }
        });

        // Bind form field tracking for progress
        this.bindProgressTracking();
    }

    openOverlay(formId) {
        this.currentForm = formId;
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Scroll overlay to top
        const container = document.querySelector('.form-overlay-container');
        if (container) container.scrollTop = 0;

        // Reset progress
        this.updateProgress();

        // Auto-fill date
        const dateInput = this.overlay.querySelector('.date-input');
        if (dateInput && !dateInput.value) {
            const d = new Date();
            dateInput.value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        }
    }

    closeOverlay() {
        this.overlay.classList.remove('active');
        setTimeout(() => document.body.style.overflow = '', 300);
    }

    bindProgressTracking() {
        const form = this.overlay?.querySelector('form');
        if (!form) return;

        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        const events = ['input', 'change', 'blur'];

        inputs.forEach(input => {
            events.forEach(evt => input.addEventListener(evt, () => this.updateProgress()));
        });
    }

    updateProgress() {
        const form = this.overlay?.querySelector('form');
        if (!form) return;

        const required = form.querySelectorAll('input[required], select[required], textarea[required]');
        let filled = 0;
        const radioGroups = new Set();

        required.forEach(input => {
            if (input.type === 'hidden' || input.name === '_honey') return;

            if (input.type === 'radio') {
                if (!radioGroups.has(input.name)) {
                    radioGroups.add(input.name);
                    if (form.querySelector(`input[name="${input.name}"]:checked`)) filled++;
                }
            } else if (input.type === 'checkbox') {
                if (input.checked) filled++;
            } else {
                if (input.value.trim()) filled++;
            }
        });

        const total = radioGroups.size + required.length - Array.from(required).filter(i => i.type === 'radio').length + radioGroups.size;
        // Simplified: count unique required fields
        const uniqueTotal = new Set();
        required.forEach(i => {
            if (i.type === 'hidden' || i.name === '_honey') return;
            if (i.type === 'radio') uniqueTotal.add(i.name);
            else uniqueTotal.add(i.name || i.id || Math.random());
        });

        const pct = uniqueTotal.size > 0 ? Math.min(100, Math.round((filled / uniqueTotal.size) * 100)) : 0;

        if (this.progressFill) this.progressFill.style.width = `${pct}%`;
        if (this.progressText) this.progressText.textContent = `${pct}%`;
    }
}

// ═══════════════════════════════════════
// PAPER FORM CONTROLLER
// ═══════════════════════════════════════
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
        this.bindFieldEffects();
        this.bindFormSubmit();
        this.bindSuccessDismiss();
        this.checkReturnFromSubmit();

        // Sync email to _replyto
        const emailInput = this.form.querySelector('input[name="email"]');
        const replyTo = this.form.querySelector('input[name="_replyto"]');
        if (emailInput && replyTo) {
            emailInput.addEventListener('input', () => replyTo.value = emailInput.value);
        }
    }

    bindFieldEffects() {
        this.form.querySelectorAll('.paper-field').forEach(field => {
            const input = field.querySelector('.paper-input, .paper-textarea, .paper-select');
            if (!input) return;
            input.addEventListener('focus', () => field.classList.add('field-active'));
            input.addEventListener('blur', () => {
                field.classList.remove('field-active');
                input.classList.toggle('filled', input.value.trim() !== '');
            });
        });
    }

    bindFormSubmit() {
        this.form.addEventListener('submit', e => {
            if (!this.form.checkValidity()) {
                e.preventDefault();
                this.highlightErrors();
                return;
            }
            this.submitBtn?.classList.add('loading');
        });
    }

    highlightErrors() {
        const invalids = this.form.querySelectorAll(':invalid');
        invalids.forEach((input, i) => {
            if (input.type === 'hidden' || input.name === '_honey') return;
            const wrap = input.closest('.paper-field') || input.closest('.paper-field-inline') || input.closest('.paper-agreement');
            if (wrap) {
                wrap.style.background = 'rgba(220,38,38,.06)';
                wrap.style.borderRadius = '6px';
                wrap.style.transition = 'background .3s ease';
                setTimeout(() => wrap.style.background = '', 2500);
            }
            if (i === 0) { input.focus(); input.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        });

        const paper = document.getElementById('paperDocument');
        if (paper) { paper.style.animation = 'formShake .5s ease'; setTimeout(() => paper.style.animation = '', 500); }
    }

    checkReturnFromSubmit() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('submitted')) {
            setTimeout(() => {
                if (this.successOverlay) {
                    this.successOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }, 500);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    bindSuccessDismiss() {
        const dismiss = () => {
            this.successOverlay?.classList.remove('active');
            document.body.style.overflow = '';
            this.form.reset();
            // Re-auto-fill date
            const d = new Date();
            const dateInput = this.form.querySelector('.date-input');
            if (dateInput) dateInput.value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        };

        this.successDismiss?.addEventListener('click', dismiss);
        this.successOverlay?.addEventListener('click', e => { if (e.target === this.successOverlay) dismiss(); });
    }
}

// ═══════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════
class FormsScrollAnim {
    constructor() {
        const els = document.querySelectorAll('[data-animate]');
        if (!els.length) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); obs.unobserve(e.target); } });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
        els.forEach(el => obs.observe(el));
    }
}

// ═══════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════
class FormsFooter {
    constructor() {
        const btn = document.getElementById('backToTop');
        btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        const footer = document.querySelector('.premium-footer');
        if (!footer) return;
        const cols = footer.querySelectorAll('.footer-brand-col,.footer-links-col,.footer-contact-col');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; obs.unobserve(e.target); } });
        }, { threshold: 0.1 });
        cols.forEach((c, i) => { c.style.opacity = '0'; c.style.transform = 'translateY(30px)'; c.style.transition = `all .8s cubic-bezier(.16,1,.3,1) ${i*.1}s`; obs.observe(c); });
    }
}

// ═══════════════════════════════════════
// BOOT
// ═══════════════════════════════════════
function boot() {
    new FormsNav();
    new FormsScrollAnim();
    new FormOverlayController();
    new PaperFormController();
    new FormsFooter();
    console.log('📋 Park City Forms: All systems ready');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

window.addEventListener('load', () => window.scrollTo(0, 0));
