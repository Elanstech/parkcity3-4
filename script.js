/* ═══════════════════════════════════════════════════════════════
   PARK CITY 3 & 4 — SCRIPT
   ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ──────────── UTILITIES ──────────── */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const lerp  = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => window.innerWidth >= 980;

  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };
  const onLoad = (fn) => {
    if (document.readyState === 'complete') fn();
    else window.addEventListener('load', fn);
  };

  /* ═══════════════════════════════════════════════════════════════
     1. SMOOTH SCROLL (Lenis)
     ═══════════════════════════════════════════════════════════════ */
  class SmoothScroll {
    constructor() {
      if (prefersReducedMotion || typeof Lenis === 'undefined') {
        this.bindAnchors();
        return;
      }

      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 2
      });

      const raf = (time) => {
        this.lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      this.bindAnchors();
    }

    bindAnchors() {
      // Only intercept SAME-PAGE anchor links — page links (.html) navigate normally
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (href === '#' || href === '#top') {
          e.preventDefault();
          this.scrollTo(0);
          return;
        }
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        this.scrollTo(target);
      });
    }

    scrollTo(target, opts = {}) {
      const offset = opts.offset ?? -80;
      if (this.lenis) {
        this.lenis.scrollTo(target, { offset, duration: 1.6 });
      } else {
        const top = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     2. PAGE LOADER
     ═══════════════════════════════════════════════════════════════ */
  class PageLoader {
    constructor() {
      this.el = $('#loader');
      if (!this.el) return;

      onLoad(() => {
        setTimeout(() => {
          this.el.classList.add('is-done');
          document.body.classList.add('is-loaded');
          document.dispatchEvent(new Event('app:loaded'));
        }, 1700);
      });

      // Failsafe — never hold the page hostage
      setTimeout(() => {
        if (!this.el.classList.contains('is-done')) {
          this.el.classList.add('is-done');
          document.dispatchEvent(new Event('app:loaded'));
        }
      }, 4500);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     3. NAVIGATION — scroll state + mobile drawer (no scroll tracker)
     ═══════════════════════════════════════════════════════════════ */
  class Navigation {
    constructor() {
      this.nav    = $('#nav');
      this.toggle = $('#navToggle');
      this.mobile = $('#navMobile');
      this.heroEl = $('#hero');
      if (!this.nav) return;

      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      this.onScroll();

      this.toggle?.addEventListener('click', () => this.toggleMobile());
      this.mobile?.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => this.closeMobile());
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeMobile();
      });
    }

    onScroll() {
      const y = window.scrollY;

      // Solid background after a small scroll
      this.nav.classList.toggle('is-scrolled', y > 60);

      // Light text while sitting over the dark hero video
      if (this.heroEl) {
        const heroBottom = this.heroEl.getBoundingClientRect().bottom;
        this.nav.classList.toggle('is-hero-light', heroBottom > 100 && y < 80);
      }
    }

    toggleMobile() {
      const open = this.mobile.classList.toggle('is-open');
      this.toggle.setAttribute('aria-expanded', String(open));
      this.mobile.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    }

    closeMobile() {
      if (!this.mobile?.classList.contains('is-open')) return;
      this.mobile.classList.remove('is-open');
      this.toggle.setAttribute('aria-expanded', 'false');
      this.mobile.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     4. SCROLL REVEALS  (data-reveal)
     ═══════════════════════════════════════════════════════════════ */
  class Reveals {
    constructor() {
      const items = $$('[data-reveal]');
      if (!items.length) return;

      if (prefersReducedMotion) {
        items.forEach(el => el.classList.add('is-in'));
        return;
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const delay = parseInt(e.target.dataset.revealDelay) || 0;
          if (delay) e.target.style.transitionDelay = delay + 'ms';
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

      items.forEach(el => io.observe(el));
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     5. SPLIT LINES  (philosophy headline)
     ═══════════════════════════════════════════════════════════════ */
  class SplitLines {
    constructor() {
      const targets = $$('[data-split-lines]');
      if (!targets.length) return;

      // Wrap each .line's content in an inner span for the slide-up
      targets.forEach(target => {
        target.querySelectorAll('.line').forEach(line => {
          line.innerHTML = `<span>${line.innerHTML}</span>`;
        });
      });

      if (prefersReducedMotion) {
        targets.forEach(t => {
          t.classList.add('is-in');
          t.querySelectorAll('.line').forEach(l => l.classList.add('is-in'));
        });
        return;
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const lines = e.target.querySelectorAll('.line');
          lines.forEach((line, i) => {
            setTimeout(() => line.classList.add('is-in'), i * 130);
          });
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        });
      }, { threshold: 0.3 });

      targets.forEach(t => io.observe(t));
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     6. WORD REVEAL  (hero title)
     ═══════════════════════════════════════════════════════════════ */
  class WordReveal {
    constructor() {
      const targets = $$('[data-split-words]');
      if (!targets.length) return;

      if (prefersReducedMotion) {
        targets.forEach(t => {
          t.querySelectorAll('.word').forEach(w => {
            w.style.opacity = '1';
            w.style.transform = 'none';
          });
        });
        return;
      }

      targets.forEach(target => {
        const words = target.querySelectorAll('.word');
        const inHero = !!target.closest('.hero');

        const trigger = () => {
          words.forEach((word, i) => {
            word.style.animationDelay = `${i * 110}ms`;
            word.classList.add('is-in');
          });
        };

        if (inHero) {
          document.addEventListener('app:loaded', trigger, { once: true });
          // Failsafe in case loader event never fires
          setTimeout(() => {
            if (!words[0]?.classList.contains('is-in')) trigger();
          }, 5000);
        } else {
          const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
              if (e.isIntersecting) {
                trigger();
                io.disconnect();
              }
            });
          }, { threshold: 0.3 });
          io.observe(target);
        }
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     7. HERO PARALLAX
     ═══════════════════════════════════════════════════════════════ */
  class HeroParallax {
    constructor() {
      this.video   = $('.hero__video');
      this.content = $('.hero__content');
      this.scroll  = $('.hero__scroll');
      if (!this.video || prefersReducedMotion) return;

      window.addEventListener('scroll', () => this.update(), { passive: true });
      this.update();
    }

    update() {
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (y > vh * 1.2) return;

      const progress = clamp(y / vh, 0, 1);

      this.video.style.transform = `scale(${1.04 + progress * 0.06}) translate3d(0, ${y * 0.25}px, 0)`;

      if (this.content) {
        this.content.style.transform = `translate3d(0, ${y * 0.4}px, 0)`;
        this.content.style.opacity   = `${1 - progress * 1.4}`;
      }
      if (this.scroll) {
        this.scroll.style.opacity = `${1 - progress * 2}`;
      }
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     8. ESSENCE — counters + card reveal
     ═══════════════════════════════════════════════════════════════ */
  class Essence {
    constructor() {
      this.cards = $$('[data-essence-card]');
      if (!this.cards.length) return;

      if (prefersReducedMotion) {
        this.cards.forEach(c => {
          c.classList.add('is-in');
          const num = c.querySelector('[data-count]');
          if (num) num.textContent = num.dataset.count;
        });
        return;
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const card = e.target;
          const idx = this.cards.indexOf(card);
          setTimeout(() => {
            card.classList.add('is-in');
            this.animateCount(card.querySelector('[data-count]'));
          }, idx * 130);
          io.unobserve(card);
        });
      }, { threshold: 0.4 });

      this.cards.forEach(c => io.observe(c));
    }

    animateCount(el) {
      if (!el) return;
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;

      const duration = target > 1000 ? 2200 : 1700;
      const start = performance.now();

      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = easeOutCubic(t);
        const val = Math.floor(eased * target);
        el.textContent = val;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     9. LIFESTYLE — horizontally scrubbed pinned rail
     Section height is sized DYNAMICALLY based on rail width.
     ═══════════════════════════════════════════════════════════════ */
  class LifestyleRail {
    constructor() {
      this.section = $('#lifestyle');
      this.rail    = $('[data-lifestyle-rail]');
      this.sticky  = $('.lifestyle__sticky');
      if (!this.section || !this.rail || prefersReducedMotion) return;

      this.maxTranslate = 0;
      this.current = 0;
      this.target  = 0;
      this.active  = false;

      this.calc();
      onLoad(() => this.calc());

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => this.calc(), 150);
      });

      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      this.tick();
    }

    calc() {
      if (!isDesktop()) {
        this.section.style.height = '';
        this.rail.style.transform = '';
        this.active = false;
        this.current = 0;
        this.target = 0;
        return;
      }

      requestAnimationFrame(() => {
        const railWidth = this.rail.scrollWidth;
        const viewport  = window.innerWidth;
        const padX = parseFloat(getComputedStyle(this.sticky).paddingLeft) || 0;

        this.maxTranslate = Math.max(0, railWidth - viewport + padX * 2);

        if (this.maxTranslate <= 0) {
          this.section.style.height = '';
          this.rail.style.transform = '';
          this.active = false;
          return;
        }

        const scrollDistance = this.maxTranslate * 1.1;
        this.section.style.height = `${window.innerHeight + scrollDistance}px`;

        this.active = true;
        this.onScroll();
      });
    }

    onScroll() {
      if (!this.active) return;
      const rect = this.section.getBoundingClientRect();
      const sectionHeight = this.section.offsetHeight;
      const stickyHeight = window.innerHeight;
      const scrollable = sectionHeight - stickyHeight;
      if (scrollable <= 0) return;

      const progress = clamp(-rect.top / scrollable, 0, 1);
      this.target = -this.maxTranslate * progress;
    }

    tick() {
      if (this.active) {
        this.current = lerp(this.current, this.target, 0.12);
        if (Math.abs(this.target - this.current) < 0.3) this.current = this.target;
        this.rail.style.transform = `translate3d(${this.current}px, 0, 0)`;
      }
      requestAnimationFrame(() => this.tick());
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     10. RESIDENCES — index click → scroll to card
     ═══════════════════════════════════════════════════════════════ */
  class ResidencesIndex {
    constructor(smoothScroll) {
      this.smoothScroll = smoothScroll;
      const links = $$('[data-residence-link]');
      if (!links.length) return;

      links.forEach(link => {
        link.addEventListener('click', () => {
          const id = link.dataset.residenceLink;
          const card = document.querySelector(`[data-residence="${id}"]`);
          if (!card) return;
          this.smoothScroll.scrollTo(card, { offset: -120 });
          card.classList.add('is-highlight');
          setTimeout(() => card.classList.remove('is-highlight'), 1800);
        });
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     11. FAQ PREVIEW — close other items when one opens
     ═══════════════════════════════════════════════════════════════ */
  class FAQPreview {
    constructor() {
      this.items = $$('.faq-row details');
      if (!this.items.length) return;

      this.items.forEach(item => {
        item.addEventListener('toggle', () => {
          if (item.open) {
            this.items.forEach(other => {
              if (other !== item && other.open) other.open = false;
            });
          }
        });
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     12. INQUIRE FORM
     ═══════════════════════════════════════════════════════════════ */
  class InquireForm {
    constructor() {
      this.form    = $('#inquireForm');
      this.btn     = $('.inquire__submit');
      this.success = $('#inquireSuccess');
      if (!this.form) return;

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!this.form.checkValidity()) {
          this.form.reportValidity();
          return;
        }

        this.btn.classList.add('is-loading');
        this.btn.disabled = true;

        // Simulated submission
        setTimeout(() => {
          this.btn.classList.remove('is-loading');
          this.btn.disabled = false;
          this.success.classList.add('is-shown');
          this.form.reset();

          setTimeout(() => {
            this.success.classList.remove('is-shown');
          }, 6000);
        }, 1500);
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     13. BACK TO TOP
     ═══════════════════════════════════════════════════════════════ */
  class BackToTop {
    constructor(smoothScroll) {
      const btn = $('#backToTop');
      if (!btn) return;
      btn.addEventListener('click', () => smoothScroll.scrollTo(0));
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     14. APP — orchestration
     ═══════════════════════════════════════════════════════════════ */
  class App {
    constructor() {
      ready(() => this.init());
    }

    init() {
      try {
        // Core
        this.smoothScroll = new SmoothScroll();
        this.loader = new PageLoader();
        this.nav = new Navigation();

        // Reveal system
        this.reveals = new Reveals();
        this.splitLines = new SplitLines();
        this.wordReveal = new WordReveal();

        // Hero
        this.heroParallax = new HeroParallax();

        // Sections
        this.essence = new Essence();
        this.lifestyle = new LifestyleRail();
        this.residencesIndex = new ResidencesIndex(this.smoothScroll);
        this.faqPreview = new FAQPreview();

        // UI
        this.form = new InquireForm();
        this.backToTop = new BackToTop(this.smoothScroll);

        this.signature();
      } catch (err) {
        console.error('[Park City] init error:', err);
      }
    }

    signature() {
      const css = 'font-family: serif; font-size: 14px; font-style: italic; color: #b8956a;';
      console.log('%cPark City 3 & 4 — A residence in Rego Park.', css);
      console.log('%cEstablished 1955 · Six buildings · Managed by AKAM', 'color:#6b5d4f;font-size:11px;letter-spacing:0.16em;');
      console.log('%cDesigned & built by Elan\'s Tech World · elanstechworld.com', 'color:#8a6d4a;font-size:11px;font-style:italic;');
    }
  }

  // Boot
  window.parkCity = new App();
})();
