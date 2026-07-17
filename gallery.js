/* ═══════════════════════════════════════════════════════════════
   PARK CITY 3 & 4 — GALLERY · "THE ARCHIVE"
   Hero collage · Mosaic reveals · Scrollspy index ·
   "View" cursor · Cinematic lightbox (keys + swipe)
   Requires script.js (nav, smooth scroll, footer)
   ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const pad2 = (n) => String(n).padStart(2, '0');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  /* ═══════════════════════════════════════════
     1. FRAME REGISTRY — number every photograph
        01–48 in document order; this index drives
        captions, the sticky counter, and the
        lightbox progress line.
     ═══════════════════════════════════════════ */
  class Registry {
    constructor() {
      this.frames = $$('.gframe');
      this.total = this.frames.length;

      this.frames.forEach((frame, i) => {
        frame.dataset.index = i;
        const chapter = frame.closest('[data-gchapter]');
        frame.dataset.chapter = chapter?.dataset.chapterLabel || '';
        const idx = frame.querySelector('.gframe__idx');
        if (idx) idx.textContent = pad2(i + 1);
        // keyboard access
        frame.setAttribute('tabindex', '0');
        frame.setAttribute('role', 'button');
        frame.setAttribute('aria-label', `View photograph ${i + 1} of ${this.total} — ${frame.dataset.cap || ''}`);
      });
    }
  }

  /* ═══════════════════════════════════════════
     2. HERO — entrance + collage drift
     ═══════════════════════════════════════════ */
  class GalleryHero {
    constructor() {
      this.hero = $('#ghero');
      if (!this.hero) return;

      // entrance
      requestAnimationFrame(() => {
        setTimeout(() => document.body.classList.add('is-hero-in'), 150);
      });

      if (reduceMotion) return;
      this.cards = $$('[data-depth]', this.hero);

      // slow scroll drift per depth
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });

      // gentle mouse parallax on desktop
      if (finePointer) {
        this.hero.addEventListener('mousemove', (e) => this.onMouse(e), { passive: true });
      }
      this.mx = 0; this.my = 0;
    }

    onScroll() {
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) return;
      this.cards.forEach(card => {
        const depth = parseFloat(card.dataset.depth) || 0.5;
        card.style.setProperty('--drift', `${y * depth * -0.18}px`);
      });
    }

    onMouse(e) {
      const cx = (e.clientX / window.innerWidth - 0.5);
      const cy = (e.clientY / window.innerHeight - 0.5);
      this.cards.forEach(card => {
        const depth = parseFloat(card.dataset.depth) || 0.5;
        card.style.translate = `${cx * depth * -22}px ${cy * depth * -16}px`;
      });
    }
  }

  /* ═══════════════════════════════════════════
     3. MOSAIC — staggered clip reveals + img load
     ═══════════════════════════════════════════ */
  class Mosaic {
    constructor(registry) {
      this.frames = registry.frames;
      if (!this.frames.length) return;

      // image load → fade in, kill shimmer
      this.frames.forEach(frame => {
        const img = frame.querySelector('img');
        if (!img) return;
        if (img.complete && img.naturalWidth) img.classList.add('is-loaded');
        else img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
      });

      if (reduceMotion) {
        this.frames.forEach(f => f.classList.add('is-in'));
        return;
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const el = e.target;
          // stagger within the visible batch
          const delay = (parseInt(el.dataset.batch, 10) || 0) * 70;
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('is-in');
          el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
          io.unobserve(el);
        });
        // reset batch counter each tick
        this.batch = 0;
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

      // assign small batch offsets in DOM order
      this.frames.forEach((f, i) => { f.dataset.batch = i % 4; io.observe(f); });
    }
  }

  /* ═══════════════════════════════════════════
     4. STICKY INDEX — show after hero, scrollspy,
        live "frames seen" counter
     ═══════════════════════════════════════════ */
  class ChapterIndex {
    constructor(registry) {
      this.bar = $('#gindex');
      this.hero = $('#ghero');
      if (!this.bar) return;

      this.links = $$('[data-spy]', this.bar);
      this.chapters = $$('[data-gchapter]');
      this.seenEl = $('[data-seen]', this.bar);
      this.total = registry.total;
      this.maxSeen = 1;

      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      this.onScroll();

      // frames-seen counter
      if (this.seenEl && registry.frames.length) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (!e.isIntersecting) return;
            const n = parseInt(e.target.dataset.index, 10) + 1;
            if (n > this.maxSeen) {
              this.maxSeen = n;
              this.seenEl.textContent = pad2(n);
            }
          });
        }, { threshold: 0.4 });
        registry.frames.forEach(f => io.observe(f));
      }
    }

    onScroll() {
      const heroBottom = this.hero ? this.hero.getBoundingClientRect().bottom : 0;
      this.bar.classList.toggle('is-shown', heroBottom < 60);

      // scrollspy
      let activeId = null;
      this.chapters.forEach(ch => {
        const r = ch.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.4 && r.bottom > window.innerHeight * 0.25) {
          activeId = ch.id;
        }
      });
      this.links.forEach(a => a.classList.toggle('is-active', a.dataset.spy === activeId));
    }
  }

  /* ═══════════════════════════════════════════
     5. CURSOR — italic "View" follower on frames
     ═══════════════════════════════════════════ */
  class ViewCursor {
    constructor() {
      if (!finePointer || reduceMotion) return;

      this.el = document.createElement('div');
      this.el.className = 'gcursor';
      this.el.textContent = 'View';
      this.el.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.el);

      this.x = 0; this.y = 0;
      this.tx = 0; this.ty = 0;
      this.active = false;

      document.addEventListener('mousemove', (e) => {
        this.tx = e.clientX; this.ty = e.clientY;
        const overFrame = e.target.closest?.('.gframe');
        this.setActive(!!overFrame);
      }, { passive: true });

      const tick = () => {
        this.x += (this.tx - this.x) * 0.18;
        this.y += (this.ty - this.y) * 0.18;
        this.el.style.left = `${this.x}px`;
        this.el.style.top  = `${this.y}px`;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    setActive(state) {
      if (state === this.active) return;
      this.active = state;
      this.el.classList.toggle('is-active', state);
    }
  }

  /* ═══════════════════════════════════════════
     6. LIGHTBOX — cinematic viewer
        keyboard ← → Esc · swipe · blurred self-
        backdrop · neighbor preload · progress line
     ═══════════════════════════════════════════ */
  class Lightbox {
    constructor(registry) {
      this.box = $('#glb');
      if (!this.box || !registry.frames.length) return;

      this.frames  = registry.frames;
      this.total   = registry.total;
      this.img     = $('#glbImg');
      this.blur    = $('#glbBlur');
      this.title   = $('#glbTitle');
      this.chapter = $('#glbChapter');
      this.count   = $('#glbCount');
      this.progress = $('#glbProgress');
      this.index = 0;
      this.isOpen = false;

      // open from frame (click + Enter/Space)
      this.frames.forEach(frame => {
        frame.addEventListener('click', () => this.open(parseInt(frame.dataset.index, 10)));
        frame.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.open(parseInt(frame.dataset.index, 10));
          }
        });
      });

      // controls
      $$('[data-glb-close]', this.box).forEach(el => el.addEventListener('click', () => this.close()));
      $('[data-glb-prev]', this.box)?.addEventListener('click', () => this.step(-1));
      $('[data-glb-next]', this.box)?.addEventListener('click', () => this.step(1));

      // keyboard
      document.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowLeft') this.step(-1);
        if (e.key === 'ArrowRight') this.step(1);
      });

      // touch swipe
      this.touchX = null;
      this.box.addEventListener('touchstart', (e) => {
        this.touchX = e.touches[0].clientX;
      }, { passive: true });
      this.box.addEventListener('touchend', (e) => {
        if (this.touchX === null) return;
        const dx = e.changedTouches[0].clientX - this.touchX;
        this.touchX = null;
        if (Math.abs(dx) > 48) this.step(dx < 0 ? 1 : -1);
      }, { passive: true });
    }

    open(index) {
      this.index = clamp(index, 0, this.total - 1);
      this.isOpen = true;
      this.box.classList.add('is-open');
      this.box.setAttribute('aria-hidden', 'false');
      // lock scroll (plays nice with Lenis from script.js)
      window.parkCity?.smoothScroll?.lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      this.render();
    }

    close() {
      this.isOpen = false;
      this.box.classList.remove('is-open');
      this.box.setAttribute('aria-hidden', 'true');
      window.parkCity?.smoothScroll?.lenis?.start();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      // return focus to the frame that opened
      this.frames[this.index]?.focus({ preventScroll: true });
    }

    step(dir) {
      const leaving = dir > 0 ? 'is-leaving-next' : 'is-leaving-prev';
      this.img.classList.remove('is-ready');
      this.img.classList.add(leaving);
      setTimeout(() => {
        this.img.classList.remove(leaving);
        this.index = (this.index + dir + this.total) % this.total;
        this.render();
      }, reduceMotion ? 0 : 220);
    }

    render() {
      const frame = this.frames[this.index];
      const src = frame.dataset.full || frame.querySelector('img')?.src;
      const cap = frame.dataset.cap || '';
      const chapter = frame.dataset.chapter || '';

      this.box.classList.add('is-loading');
      this.img.classList.remove('is-ready');

      const loader = new Image();
      loader.onload = () => {
        this.img.src = src;
        this.img.alt = `${cap} — Park City 3 & 4, Rego Park`;
        this.blur.src = src;
        requestAnimationFrame(() => {
          this.box.classList.remove('is-loading');
          this.img.classList.add('is-ready');
        });
      };
      loader.onerror = () => this.box.classList.remove('is-loading');
      loader.src = src;

      this.title.textContent = cap;
      this.chapter.textContent = chapter;
      this.count.textContent = `${pad2(this.index + 1)} / ${pad2(this.total)}`;
      if (this.progress) {
        this.progress.style.width = `${((this.index + 1) / this.total) * 100}%`;
      }

      this.preload(this.index + 1);
      this.preload(this.index - 1);
    }

    preload(i) {
      const idx = (i + this.total) % this.total;
      const src = this.frames[idx]?.dataset.full;
      if (src) { const im = new Image(); im.src = src; }
    }
  }

  /* ═══════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════ */
  ready(() => {
    try {
      const registry = new Registry();
      new GalleryHero();
      new Mosaic(registry);
      new ChapterIndex(registry);
      new ViewCursor();
      new Lightbox(registry);

      console.log(
        '%cThe Archive — 48 frames of home. · Park City 3 & 4',
        'font-family:serif;font-style:italic;font-size:13px;color:#b8956a;'
      );
    } catch (err) {
      console.error('[Park City · Gallery] init error:', err);
    }
  });
})();
