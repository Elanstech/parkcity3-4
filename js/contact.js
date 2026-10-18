/* ═══════════════════════════════════════════════════════════════
   PARK CITY 3 & 4 — CONTACT PAGE
   A small enhancement layer over the shared script.js.

   Responsibilities:
     1. AJAX form submission to FormSubmit (so we control the UI)
     2. Loading state on the submit button
     3. Success / error overlay swap with smooth transition
     4. "Send another" / "Try again" reset
     5. Honeypot bot check

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

      // 3. Submit via FormSubmit's AJAX endpoint
      //    (form action: https://formsubmit.co/<email> → https://formsubmit.co/ajax/<email>)
      const action = this.form.getAttribute('action') || '';
      const ajaxUrl = action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      const payload = {};
      new FormData(this.form).forEach((value, key) => {
        if (key !== '_honey') payload[key] = value;
      });
      payload._replyto = payload.email || '';

      this.setLoading(true);

      try {
        const response = await fetch(ajaxUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });

        let data = null;
        try { data = await response.json(); } catch (_) { /* not JSON */ }

        // FormSubmit answers 200 with { success: "false" } for some failures
        if (response.ok && data && String(data.success) === 'true') {
          this.showSuccess();
        } else {
          console.error('[Park City · Contact] FormSubmit rejected the message:', data);
          this.showError();
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
