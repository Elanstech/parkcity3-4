/* ═══════════════════════════════════════════════════════════════
   PARK CITY 3 & 4 — GALLERY
   Filmstrip chapters · Drag-scroll · Per-chapter lightbox
   Loads after script.js; reuses window.parkCity for scroll-locking.
   ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════════════════════════════════════════════════════════
     1. FILMSTRIP — drag to scroll, arrow paging, progress line
     ═══════════════════════════════════════════════════════════════ */
  class Filmstrip {
    constructor(section) {
      this.strip    = $('[data-strip]', section);
      this.progress = $('[data-progress]', section);
      this.arrows   = $$('.chapter__arrow', section);
      if (!this.strip) return;

      this.down = false; this.startX = 0; this.startLeft = 0; this.moved = 0;

      // Drag to scroll (mouse). Native touch scrolling is left alone.
      this.strip.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') return;
        this.down = true; this.moved = 0;
        this.startX = e.clientX; this.startLeft = this.strip.scrollLeft;
        this.strip.classList.add('is-dragging');
        this.strip.setPointerCapture(e.pointerId);
      });
      this.strip.addEventListener('pointermove', (e) => {
        if (!this.down) return;
        const dx = e.clientX - this.startX;
        this.moved = Math.max(this.moved, Math.abs(dx));
        this.strip.scrollLeft = this.startLeft - dx;
      });
      const end = () => { this.down = false; this.strip.classList.remove('is-dragging'); };
      this.strip.addEventListener('pointerup', end);
      this.strip.addEventListener('pointercancel', end);
      // swallow the click that follows a real drag so the lightbox doesn't open
      this.strip.addEventListener('click', (e) => {
        if (this.moved > 6) { e.stopPropagation(); e.preventDefault(); }
      }, true);

      // Arrow paging — one page ≈ 80% of the visible width
      this.arrows.forEach(a => a.addEventListener('click', () => {
        const dir = parseInt(a.dataset.dir, 10) || 1;
        this.strip.scrollBy({ left: dir * this.strip.clientWidth * 0.8, behavior: 'smooth' });
      }));

      this.update = this.update.bind(this);
      this.strip.addEventListener('scroll', this.update, { passive: true });
      window.addEventListener('resize', this.update);
      $$('img', this.strip).forEach(img => { if (!img.complete) img.addEventListener('load', this.update, { once: true }); });
      window.addEventListener('load', this.update);
      this.update();
    }

    update() {
      const max = this.strip.scrollWidth - this.strip.clientWidth;
      const pct = max > 2 ? this.strip.scrollLeft / max : 0;
      if (this.progress) this.progress.style.width = (pct * 100).toFixed(2) + '%';
      if (this.arrows.length) {
        const atStart = this.strip.scrollLeft <= 2;
        const atEnd   = this.strip.scrollLeft >= max - 2;
        this.arrows.forEach(a => {
          const dir = parseInt(a.dataset.dir, 10) || 1;
          a.disabled = max <= 2 || (dir < 0 ? atStart : atEnd);
        });
      }
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     2. REVEAL — frames fade in as each strip enters view
     ═══════════════════════════════════════════════════════════════ */
  class Reveal {
    constructor(frames) {
      if (prefersReducedMotion) { frames.forEach(f => f.classList.add('is-in')); return; }
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
      frames.forEach((f, i) => { f.style.transitionDelay = Math.min(i, 8) * 55 + 'ms'; io.observe(f); });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     3. LIGHTBOX — opens a frame, pages within its own chapter
     ═══════════════════════════════════════════════════════════════ */
  class Lightbox {
    constructor() {
      this.lb    = $('#lightbox');
      this.img   = $('#lbImg');
      this.label = $('#lbLabel');
      this.title = $('#lbTitle');
      this.count = $('#lbCount');
      if (!this.lb) return;

      this.list = []; this.idx = 0; this.startX = 0;

      $$('[data-lb-close]', this.lb).forEach(b => b.addEventListener('click', () => this.close()));
      $('[data-lb-prev]', this.lb).addEventListener('click', () => this.go(-1));
      $('[data-lb-next]', this.lb).addEventListener('click', () => this.go(1));
      document.addEventListener('keydown', (e) => {
        if (!this.lb.classList.contains('is-open')) return;
        if (e.key === 'Escape') this.close();
        else if (e.key === 'ArrowLeft')  this.go(-1);
        else if (e.key === 'ArrowRight') this.go(1);
      });
      this.lb.addEventListener('touchstart', (e) => { this.startX = e.changedTouches[0].clientX; }, { passive: true });
      this.lb.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - this.startX;
        if (Math.abs(dx) > 50) this.go(dx < 0 ? 1 : -1);
      }, { passive: true });
    }

    bind(frames) {
      frames.forEach(frame => frame.addEventListener('click', () => {
        this.list = $$('.frame', frame.closest('[data-strip]'));  // stay within the chapter
        this.idx  = this.list.indexOf(frame);
        if (this.idx < 0) return;
        this.open();
      }));
    }

    lockScroll(on) {
      const lenis = window.parkCity && window.parkCity.smoothScroll && window.parkCity.smoothScroll.lenis;
      if (on)  { lenis && lenis.stop();  document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'; }
      else     { lenis && lenis.start(); document.documentElement.style.overflow = '';       document.body.style.overflow = ''; }
    }
    preload(i) { if (i < 0 || i >= this.list.length) return; const im = new Image(); im.src = this.list[i].dataset.full; }

    render() {
      const it = this.list[this.idx];
      this.lb.classList.add('is-loading');
      this.img.classList.remove('is-ready');
      const full = new Image();
      full.onload  = () => { this.img.src = full.src; this.img.classList.add('is-ready'); this.lb.classList.remove('is-loading'); };
      full.onerror = () => this.lb.classList.remove('is-loading');
      full.src = it.dataset.full;
      this.img.alt = it.dataset.cap;
      this.label.textContent = it.dataset.catlabel;
      this.title.textContent = it.dataset.cap;
      this.count.textContent = (this.idx + 1) + ' / ' + this.list.length;
      this.preload(this.idx + 1); this.preload(this.idx - 1);
    }
    open()  { this.lb.classList.add('is-open'); this.lb.setAttribute('aria-hidden', 'false'); this.lockScroll(true); this.render(); }
    close() { this.lb.classList.remove('is-open'); this.lb.setAttribute('aria-hidden', 'true'); this.lockScroll(false); }
    go(d)   { this.idx = (this.idx + d + this.list.length) % this.list.length; this.render(); }
  }

  /* ═══════════════════════════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════════════════════════ */
  const boot = () => {
    const sections = $$('[data-chapter]');
    if (!sections.length) return;
    sections.forEach(s => new Filmstrip(s));
    new Reveal($$('.frame'));
    const lb = new Lightbox();
    lb.bind($$('.frame'));
  };

  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
