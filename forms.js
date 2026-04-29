/* ═══════════════════════════════════════════════════════════════
   PARK CITY 3 & 4 — FORMS PAGE SCRIPT
   Pairs with script.js (loaded first).
   Handles: overlay, paper switching, progress, FormSubmit AJAX, success.
   ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ──────────── UTILITIES ──────────── */
  const $ = (sel, root) => (root || document).querySelector(sel);
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
      const elements = this.form.elements;

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (!el.required || el.disabled) continue;
        if (el.type === 'hidden') continue;

        if (el.type === 'radio') {
          if (radioNames.has(el.name)) continue;
          radioNames.add(el.name);
          fields.push({ kind: 'radio', name: el.name });
        } else if (el.type === 'checkbox') {
          fields.push({ kind: 'checkbox', el });
        } else {
          fields.push({ kind: 'value', el });
        }
      }
      return fields;
    }

    isFilled(field) {
      if (field.kind === 'radio') {
        return !!this.form.querySelector('input[name="' + field.name + '"]:checked');
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
      let filled = 0;
      for (let i = 0; i < fields.length; i++) {
        if (this.isFilled(fields[i])) filled++;
      }
      const ratio = total ? filled / total : 0;
      const pct   = Math.round(ratio * 100);

      if (this.fillEl) this.fillEl.style.transform = 'scaleX(' + ratio + ')';
      if (this.textEl) this.textEl.textContent = pct + '%';
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
      this.closeBtn    = $('#formOverlayClose');
      this.progressEl  = $('#formProgressFill');
      this.progressTxt = $('#formProgressText');

      this.successOverlay = $('#formSuccess');
      this.successBtn     = $('#formSuccessDismiss');

      this.currentPaper    = null;
      this.currentProgress = null;
      this.savedScrollY    = 0;

      if (!this.overlay) return;

      // Tell Lenis (the smooth-scroller from script.js) to leave this overlay alone.
      this.overlay.setAttribute('data-lenis-prevent', '');

      this.bindTiles();
      this.bindClose();
      this.bindCancels();
      this.bindForms();
      this.bindSuccess();
      this.checkSubmittedParam();
    }

    /* ── tile click → open paper ── */
    bindTiles() {
      const tiles = document.querySelectorAll('.form-tile[data-form]');
      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        tile.addEventListener('click', (e) => {
          e.preventDefault();
          this.open(tile.dataset.form);
        });
      }
    }

    /* ── close button + click-outside-paper + ESC ── */
    bindClose() {
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      this.overlay.addEventListener('click', (e) => {
        if (e.target.closest('.paper')) return;
        if (e.target.closest('.form-overlay__close')) return;
        if (e.target.closest('.form-overlay__progress')) return;
        this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (this.successOverlay && this.successOverlay.classList.contains('is-shown')) {
          this.dismissSuccess();
        } else if (this.overlay.classList.contains('is-open')) {
          this.close();
        }
      });
    }

    /* ── per-paper cancel buttons ── */
    bindCancels() {
      const cancels = document.querySelectorAll('[data-form-cancel]');
      for (let i = 0; i < cancels.length; i++) {
        cancels[i].addEventListener('click', () => this.close());
      }
    }

    /* ── intercept all form submits ── */
    bindForms() {
      const papers = document.querySelectorAll('.paper[data-paper]');
      for (let i = 0; i < papers.length; i++) {
        const form = papers[i].querySelector('form');
        if (!form) continue;
        form.addEventListener('submit', (e) => this.submit(e, form));
      }
    }

    /* ── success dismiss ── */
    bindSuccess() {
      if (this.successBtn) {
        this.successBtn.addEventListener('click', () => this.dismissSuccess());
      }
    }

    /* Helper — find a paper by its data-paper id */
    findPaper(formId) {
      return document.querySelector('.paper[data-paper="' + formId + '"]');
    }

    /* ═══ OPEN ═══ */
    open(formId) {
      const paper = this.findPaper(formId);
      if (!paper) {
        console.warn('[Park City Forms] No paper found for form id:', formId);
        return;
      }

      // Hide all papers, then show this one
      const allPapers = document.querySelectorAll('.paper[data-paper]');
      for (let i = 0; i < allPapers.length; i++) {
        allPapers[i].hidden = (allPapers[i] !== paper);
      }
      this.currentPaper = paper;

      // Pre-fill today's date in any empty Date field
      const dates = paper.querySelectorAll('input[type="date"]');
      for (let i = 0; i < dates.length; i++) {
        const d = dates[i];
        if (!d.value && d.name === 'Date') {
          d.value = new Date().toISOString().split('T')[0];
        }
      }

      // Spin up progress tracker
      const form = paper.querySelector('form');
      if (this.currentProgress) this.currentProgress.destroy();
      if (form) {
        this.currentProgress = new PaperProgress(form, this.progressEl, this.progressTxt);
      }

      // Lock body scroll
      this.lockScroll();

      // Show overlay
      this.overlay.classList.add('is-open');
      this.overlay.setAttribute('aria-hidden', 'false');

      // Reset overlay scroll to top
      this.overlay.scrollTop = 0;

      // Focus first text-like input after entrance animation
      setTimeout(() => {
        const firstField = paper.querySelector(
          'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), select, textarea'
        );
        if (firstField && typeof firstField.focus === 'function') {
          firstField.focus({ preventScroll: true });
        }
      }, 700);
    }

    /* ═══ CLOSE ═══ */
    close() {
      if (!this.overlay.classList.contains('is-open')) return;

      this.overlay.classList.remove('is-open');
      this.overlay.setAttribute('aria-hidden', 'true');

      this.unlockScroll();

      setTimeout(() => {
        if (!this.overlay.classList.contains('is-open')) {
          const allPapers = document.querySelectorAll('.paper[data-paper]');
          for (let i = 0; i < allPapers.length; i++) {
            allPapers[i].hidden = true;
          }
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
      // body { overflow: hidden } in CSS handles the lock.
      // data-lenis-prevent on the overlay lets the overlay scroll natively.
    }

    unlockScroll() {
      document.body.classList.remove('form-open');
    }

    /* ═══ SUBMIT (AJAX → FormSubmit, native fallback) ═══ */
    submit(e, form) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('.paper__submit');
      const cancelBtn = form.querySelector('.paper__cancel');

      // Honeypot — if a bot filled it, silently bail
      const honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value && honey.value.trim() !== '') {
        console.warn('[Park City Forms] Honeypot tripped — submission ignored.');
        return;
      }

      // Auto-fill _replyto with the email field's value
      const emailEl = form.querySelector('input[name="email"]');
      const replyEl = form.querySelector('input[name="_replyto"]');
      if (emailEl && replyEl) replyEl.value = emailEl.value;

      // UI: loader on
      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
      }
      if (cancelBtn) cancelBtn.disabled = true;

      // Build AJAX url
      let recipient = '';
      try {
        const actionUrl = new URL(form.action);
        recipient = actionUrl.pathname.replace(/^\//, '').replace(/^ajax\//, '');
      } catch (_) {
        // bad URL — fall back to native submit
        form.submit();
        return;
      }
      if (!recipient) {
        form.submit();
        return;
      }

      const ajaxUrl = 'https://formsubmit.co/ajax/' + encodeURIComponent(recipient);

      // Build payload
      const fd = new FormData(form);
      const payload = {};
      const entries = fd.entries();
      let entry = entries.next();
      while (!entry.done) {
        const key = entry.value[0];
        const val = entry.value[1];
        if (key !== '_honey') {
          if (payload[key] === undefined) {
            payload[key] = val;
          } else if (Array.isArray(payload[key])) {
            payload[key].push(val);
          } else {
            payload[key] = [payload[key], val];
          }
        }
        entry = entries.next();
      }

      const restoreUI = () => {
        if (submitBtn) {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
        }
        if (cancelBtn) cancelBtn.disabled = false;
      };

      fetch(ajaxUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then((res) => {
          if (res.ok) {
            this.handleSuccess(form);
            restoreUI();
          } else {
            // AJAX failed — fall back to native submit
            form.submit();
          }
        })
        .catch((err) => {
          console.error('[Park City Forms] AJAX submit failed, falling back:', err);
          form.submit();
        });
    }

    /* ═══ SUCCESS FLOW ═══ */
    handleSuccess(form) {
      this.close();
      const self = this;
      setTimeout(() => {
        self.showSuccess();
        form.reset();
      }, 300);
    }

    showSuccess() {
      if (!this.successOverlay) return;
      this.successOverlay.classList.add('is-shown');
      this.successOverlay.setAttribute('aria-hidden', 'false');

      clearTimeout(this._successTimer);
      const self = this;
      this._successTimer = setTimeout(() => self.dismissSuccess(), 9000);
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

      const self = this;
      setTimeout(() => self.showSuccess(), 300);

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

      const css = 'font-family: serif; font-size: 13px; font-style: italic; color: #b8956a;';
      console.log('%cPark City 3 & 4 — Resident Forms ready.', css);
      console.log('%c9 forms · FormSubmit · AJAX', 'color:#6b5d4f;font-size:11px;letter-spacing:0.14em;');
    } catch (err) {
      console.error('[Park City Forms] init error:', err);
    }
  });
})();
