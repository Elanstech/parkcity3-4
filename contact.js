/* ═══════════════════════════════════════════════════════════════
   PARK CITY 3 & 4 — CONTACT PAGE
   A small enhancement layer over the shared script.js.

   Responsibilities:
     1. AJAX form submission to Formspree (so we control the UI)
     2. Loading state on the submit button
     3. Success / error overlay swap with smooth transition
     4. "Send another" / "Try again" reset
     5. Honeypot bot check
     6. Configuration guard — fail gracefully if the Formspree
        ID hasn't been replaced yet

   Anchor smooth-scroll, loader, nav, marquee, reveals — all handled
   by script.js.
   ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ──────────── UTILITIES ──────────── */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  /* ═══════════════════════════════════════════════════════════════
     CONTACT FORM
     ═══════════════════════════════════════════════════════════════ */
  class ContactForm {
    constructor() {
      this.form = $('#contactForm');
      if (!this.form) return;

      this.submitBtn    = $('.contact-form__submit', this.form);
      this.honeypot     = $('.contact-form__honeypot', this.form);
      this.success      = $('#contactSuccess');
      this.error        = $('#contactError');
      this.errorMsg     = $('#contactErrorMessage');
      this.successBack  = $('#contactSuccessBack');
      this.errorBack    = $('#contactErrorBack');
      this.formWrap     = $('.contact-form-wrap');

      // Default error copy — kept verbatim so we can restore it
      // after a custom message is shown
      this.defaultErrorHTML = this.errorMsg ? this.errorMsg.innerHTML : '';

      this.bind();
    }

    bind() {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.send();
      });

      this.successBack && this.successBack.addEventListener('click', () => this.reset(true));
      this.errorBack   && this.errorBack.addEventListener('click',   () => this.reset(false));

      // Allow Esc to dismiss success/error overlays
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (this.success && this.success.classList.contains('is-shown')) {
          this.reset(true);
        } else if (this.error && this.error.classList.contains('is-shown')) {
          this.reset(false);
        }
      });
    }

    /* ──────────── SEND ──────────── */
    async send() {
      // 1. Browser-native validation (required, type=email, etc.)
      if (!this.form.checkValidity()) {
        this.form.reportValidity();
        return;
      }

      // 2. Honeypot check — if a bot filled the hidden field,
      // pretend it succeeded. Don't actually submit.
      if (this.honeypot && this.honeypot.value) {
        this.showSuccess();
        return;
      }

      // 3. Configuration guard — if the form action still has the
      // placeholder ID, fail with a helpful message
      const action = this.form.getAttribute('action') || '';
      if (!action || action.indexOf('YOUR_FORMSPREE_ID') !== -1) {
        this.showError(
          'The contact form isn\'t connected yet. While we sort that out, ' +
          'please write to <a href="mailto:parkcity3and4@akam.com">parkcity3and4@akam.com</a> ' +
          'or call <a href="tel:5551234567">(555) 123-4567.</a>'
        );
        console.warn(
          '[Park City · Contact] Formspree is not configured. ' +
          'Replace YOUR_FORMSPREE_ID in contact.html with your real form ID. ' +
          'See https://formspree.io/ for setup.'
        );
        return;
      }

      // 4. Submit
      this.setLoading(true);

      try {
        const response = await fetch(action, {
          method: 'POST',
          body: new FormData(this.form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          this.showSuccess();
        } else {
          // Try to surface a useful error from Formspree
          let message;
          try {
            const data = await response.json();
            if (data && Array.isArray(data.errors) && data.errors.length) {
              message = data.errors
                .map(e => (e && e.message) ? e.message : null)
                .filter(Boolean)
                .join(' · ');
            }
          } catch (_) {
            // Response wasn't JSON — fall through to generic error
          }
          this.showError(message);
        }
      } catch (err) {
        console.error('[Park City · Contact] Network error:', err);
        this.showError(); // generic
      } finally {
        this.setLoading(false);
      }
    }

    /* ──────────── UI STATE ──────────── */
    setLoading(loading) {
      if (!this.submitBtn) return;
      this.submitBtn.classList.toggle('is-loading', !!loading);
      this.submitBtn.disabled = !!loading;
      this.submitBtn.setAttribute('aria-busy', loading ? 'true' : 'false');
    }

    showSuccess() {
      this.error && this.error.classList.remove('is-shown');
      this.success && this.success.classList.add('is-shown');
      this.scrollToForm();
      // Move focus to the action button after the overlay transitions in
      setTimeout(() => {
        this.successBack && this.successBack.focus({ preventScroll: true });
      }, 600);
    }

    showError(customMessageHTML) {
      this.success && this.success.classList.remove('is-shown');
      if (this.errorMsg) {
        this.errorMsg.innerHTML = customMessageHTML || this.defaultErrorHTML;
      }
      this.error && this.error.classList.add('is-shown');
      this.scrollToForm();
      setTimeout(() => {
        this.errorBack && this.errorBack.focus({ preventScroll: true });
      }, 600);
    }

    reset(clearForm) {
      this.success && this.success.classList.remove('is-shown');
      this.error && this.error.classList.remove('is-shown');

      if (clearForm) {
        this.form.reset();
      }

      // Focus the first field after the overlay fades out
      setTimeout(() => {
        const firstField = this.form.querySelector(
          'input:not([type="hidden"]):not(.contact-form__honeypot), textarea, select'
        );
        if (firstField) firstField.focus({ preventScroll: true });
      }, 600);
    }

    /* ──────────── SCROLL HELPER ──────────── */
    scrollToForm() {
      if (!this.formWrap) return;

      // Only scroll if the form is meaningfully out of view
      const rect = this.formWrap.getBoundingClientRect();
      const inView = rect.top > 0 && rect.top < window.innerHeight * 0.5;
      if (inView) return;

      const smooth = window.parkCity && window.parkCity.smoothScroll;
      if (smooth && typeof smooth.scrollTo === 'function') {
        smooth.scrollTo(this.formWrap, { offset: -100 });
      } else {
        this.formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     CONSOLE SIGNATURE
     ═══════════════════════════════════════════════════════════════ */
  function signature() {
    const css = 'font-family: serif; font-style: italic; color: #b8956a;';
    console.log('%cPark City 3 & 4 — The office is listening.', css);
  }

  /* ═══════════════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════════════ */
  ready(() => {
    try {
      new ContactForm();
      signature();
    } catch (err) {
      console.error('[Park City · Contact] init error:', err);
    }
  });

})();
