/* ═══════════════════════════════════════════════════════════════
   PARK CITY 3 & 4 — FORMS PAGE SCRIPT
   Pairs with script.js (loaded first).
   Handles: overlay, paper switching, progress, FormSubmit AJAX, success.
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
     1. PAPER PROGRESS — counts required fields & updates the bar
     ═══════════════════════════════════════════════════════════════ */
  class PaperProgress {
    constructor(form, fillEl, textEl) {
      this.form   = form;
      this.fillEl = fillEl;
      this.textEl = textEl;

      this.handler = () => this.calc();
      this.form.addEventListener('input', this.handler);
      this.form.addEventListener('change', this.handler);

      this.calc();
    }

    /* Returns a list of "fields" — each scalar field is itself, radios are grouped by name */
    collectRequired() {
      const fields = [];
      const radioNames = new Set();

      Array.from(this.form.elements).forEach((el) => {
        if (!el.required || el.disabled) return;
        if (el.type === 'hidden') return;

        if (el.type === 'radio') {
          if (radioNames.has(el.name)) return;
          radioNames.add(el.name);
          fields.push({ kind: 'radio', name: el.name });
        } else if (el.type === 'checkbox') {
          fields.push({ kind: 'checkbox', el });
        } else {
          fields.push({ kind: 'value', el });
        }
      });
      return fields;
    }

    isFilled(field) {
      if (field.kind === 'radio') {
        return !!this.form.querySelector(`input[name="${field.name}"]:checked`);
      }
      if (field.kind === 'checkbox') {
        return field.el.checked;
      }
      const v = field.el.value;
      return typeof v === 'string' ? v.trim() !== '' : !!v;
    }

    calc() {
      const fields = this.collectRequired();
      const total  = fields.length;
      const filled = fields.filter((f) => this.isFilled(f)).length;
      const ratio  = total ? filled / total : 0;
      const pct    = Math.round(ratio * 100);

      if (this.fillEl) this.fillEl.style.transform = `scaleX(${ratio})`;
      if (this.textEl) this.textEl.textContent = `${pct}%`;
    }

    destroy() {
      this.form.removeEventListener('input', this.handler);
      this.form.removeEventListener('change', this.handler);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     2. FORM OVERLAY — orchestrates everything
     ═══════════════════════════════════════════════════════════════ */
  class FormOverlay {
    constructor() {
      this.overlay     = $('#formOverlay');
      this.backdrop    = $('#formOverlayBackdrop');
      this.closeBtn    = $('#formOverlayClose');
      this.progressEl  = $('#formProgressFill');
      this.progressTxt = $('#formProgressText');

      this.successOverlay = $('#formSuccess');
      this.successBtn     = $('#formSuccessDismiss');

      this.papers = $$('.paper[data-paper]');
      this.tiles  = $$('.form-tile[data-form]');

      this.currentPaper    = null;
      this.currentProgress = null;
      this.savedScrollY    = 0;

      if (!this.overlay) return;

      this.bindTiles();
      this.bindClose();
      this.bindCancels();
      this.bindForms();
      this.bindSuccess();
      this.checkSubmittedParam();
    }

    /* ── tile click → open paper ── */
    bindTiles() {
      this.tiles.forEach((tile) => {
        tile.addEventListener('click', (e) => {
          e.preventDefault();
          const id = tile.dataset.form;
          this.open(id);
        });
      });
    }

    /* ── close button + backdrop + ESC ── */
    bindClose() {
      this.closeBtn?.addEventListener('click', () => this.close());
      this.backdrop?.addEventListener('click', () => this.close());
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (this.successOverlay?.classList.contains('is-shown')) {
          this.dismissSuccess();
        } else if (this.overlay.classList.contains('is-open')) {
          this.close();
        }
      });
    }

    /* ── per-paper cancel buttons ── */
    bindCancels() {
      $$('[data-form-cancel]').forEach((btn) => {
        btn.addEventListener('click', () => this.close());
      });
    }

    /* ── intercept all form submits ── */
    bindForms() {
      this.papers.forEach((paper) => {
        const form = paper.querySelector('form');
        if (!form) return;
        form.addEventListener('submit', (e) => this.submit(e, form));
      });
    }

    /* ── success dismiss ── */
    bindSuccess() {
      this.successBtn?.addEventListener('click', () => this.dismissSuccess());
    }

    /* ═══ OPEN ═══ */
    open(formId) {
      const paper = this.papers.find((p) => p.dataset.paper === formId);
      if (!paper) return;

      // Show only this paper
      this.papers.forEach((p) => { p.hidden = (p !== paper); });
      this.currentPaper = paper;

      // Pre-fill today's date in any "Date" field that's empty
      paper.querySelectorAll('input[type="date"]').forEach((d) => {
        if (!d.value && d.name === 'Date') {
          d.value = new Date().toISOString().split('T')[0];
        }
      });

      // Spin up progress tracker
      const form = paper.querySelector('form');
      if (this.currentProgress) this.currentProgress.destroy();
      this.currentProgress = new PaperProgress(form, this.progressEl, this.progressTxt);

      // Lock body scroll (compatible with Lenis if running)
      this.lockScroll();

      // Show overlay
      this.overlay.classList.add('is-open');
      this.overlay.setAttribute('aria-hidden', 'false');

      // Reset overlay scroll to top so paper appears from top
      this.overlay.scrollTop = 0;

      // Focus first real input after the entrance animation
      setTimeout(() => {
        const firstField = paper.querySelector(
          'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), select, textarea'
        );
        firstField?.focus({ preventScroll: true });
      }, 700);
    }

    /* ═══ CLOSE ═══ */
    close() {
      if (!this.overlay.classList.contains('is-open')) return;

      this.overlay.classList.remove('is-open');
      this.overlay.setAttribute('aria-hidden', 'true');

      this.unlockScroll();

      // Hide papers after the close transition completes (so it animates out)
      setTimeout(() => {
        if (!this.overlay.classList.contains('is-open')) {
          this.papers.forEach((p) => { p.hidden = true; });
          if (this.currentProgress) {
            this.currentProgress.destroy();
            this.currentProgress = null;
          }
          this.currentPaper = null;
        }
      }, 650);
    }

    /* ═══ SCROLL LOCK ═══ */
    lockScroll() {
      this.savedScrollY = window.scrollY;
      document.body.classList.add('form-open');

      // Stop Lenis if it's running on this page
      const lenis = window.parkCity?.smoothScroll?.lenis;
      if (lenis && typeof lenis.stop === 'function') lenis.stop();
    }

    unlockScroll() {
      document.body.classList.remove('form-open');

      const lenis = window.parkCity?.smoothScroll?.lenis;
      if (lenis && typeof lenis.start === 'function') lenis.start();
    }

    /* ═══ SUBMIT (AJAX → FormSubmit) ═══ */
    async submit(e, form) {
      e.preventDefault();

      // Native validity gate
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('.paper__submit');
      const cancelBtn = form.querySelector('.paper__cancel');

      // Honeypot — if bots filled it, silently bail
      const honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value.trim() !== '') {
        console.warn('[Park City Forms] Honeypot tripped — submission ignored.');
        return;
      }

      // Auto-fill _replyto with the email field's value
      const emailEl = form.querySelector('input[name="email"]');
      const replyEl = form.querySelector('input[name="_replyto"]');
      if (emailEl && replyEl) replyEl.value = emailEl.value;

      // UI: loader on
      submitBtn?.classList.add('is-loading');
      if (submitBtn) submitBtn.disabled = true;
      if (cancelBtn) cancelBtn.disabled = true;

      try {
        const ok = await this.postFormSubmit(form);

        if (ok) {
          this.handleSuccess(form);
        } else {
          // AJAX returned non-ok — fall back to native submit (full page navigation)
          form.submit();
        }
      } catch (err) {
        console.error('[Park City Forms] AJAX submit failed, falling back to native:', err);
        form.submit();
      } finally {
        // If we're still on the page (i.e. AJAX worked), restore the buttons
        submitBtn?.classList.remove('is-loading');
        if (submitBtn) submitBtn.disabled = false;
        if (cancelBtn) cancelBtn.disabled = false;
      }
    }

    /* ═══ POST to FormSubmit's AJAX endpoint ═══ */
    async postFormSubmit(form) {
      // Derive recipient email from form action
      // action looks like: https://formsubmit.co/parkcity3and4@akam.com
      let recipient = '';
      try {
        const actionUrl = new URL(form.action);
        recipient = actionUrl.pathname.replace(/^\//, '').replace(/^ajax\//, '');
      } catch (_) {
        return false;
      }
      if (!recipient) return false;

      const ajaxUrl = `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`;

      // Build payload from FormData. Multiple values for the same name → array.
      const fd = new FormData(form);
      const payload = {};
      for (const [key, val] of fd.entries()) {
        if (key === '_honey') continue; // never send the honeypot
        if (payload[key] === undefined) {
          payload[key] = val;
        } else if (Array.isArray(payload[key])) {
          payload[key].push(val);
        } else {
          payload[key] = [payload[key], val];
        }
      }

      const res = await fetch(ajaxUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // FormSubmit returns 200 with JSON { success: "true", ... } on success.
      // First-ever submission to a new email returns an "activation" message — still a 200.
      // Either way, treat 2xx as success for UI purposes.
      return res.ok;
    }

    /* ═══ SUCCESS FLOW ═══ */
    handleSuccess(form) {
      this.close();
      // Tiny delay so the close animation gets out of the way before success card slides in
      setTimeout(() => {
        this.showSuccess();
        form.reset();
      }, 300);
    }

    showSuccess() {
      if (!this.successOverlay) return;
      this.successOverlay.classList.add('is-shown');
      this.successOverlay.setAttribute('aria-hidden', 'false');

      // Auto-dismiss after a long beat in case they don't click
      clearTimeout(this._successTimer);
      this._successTimer = setTimeout(() => this.dismissSuccess(), 9000);
    }

    dismissSuccess() {
      if (!this.successOverlay) return;
      this.successOverlay.classList.remove('is-shown');
      this.successOverlay.setAttribute('aria-hidden', 'true');
      clearTimeout(this._successTimer);
    }

    /* ═══ Detect ?submitted= redirect from FormSubmit native fallback ═══ */
    checkSubmittedParam() {
      const params = new URLSearchParams(window.location.search);
      if (!params.has('submitted')) return;

      // Show the success overlay
      // Wait a tick so loader is gone
      setTimeout(() => this.showSuccess(), 300);

      // Clean the URL so a refresh doesn't re-trigger
      const url = new URL(window.location.href);
      url.searchParams.delete('submitted');
      window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     3. BOOT
     ═══════════════════════════════════════════════════════════════ */
  ready(() => {
    try {
      window.parkCityForms = new FormOverlay();

      // Console signature
      const css = 'font-family: serif; font-size: 13px; font-style: italic; color: #b8956a;';
      console.log('%cPark City 3 & 4 — Resident Forms ready.', css);
      console.log('%c9 forms · FormSubmit · AJAX · parkcity3and4@akam.com', 'color:#6b5d4f;font-size:11px;letter-spacing:0.14em;');
    } catch (err) {
      console.error('[Park City Forms] init error:', err);
    }
  });
})();
