/* ═══════════════════════════════════════════════════════════════
   PARK CITY 3 & 4 — SCRIPT
   Cinematic interactions · Smooth scroll · Map · Form
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
     3. NAVIGATION
     ═══════════════════════════════════════════════════════════════ */
  class Navigation {
    constructor() {
      this.nav      = $('#nav');
      this.toggle   = $('#navToggle');
      this.mobile   = $('#navMobile');
      this.heroEl   = $('#hero');
      this.menuLinks = $$('.nav__menu a');
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

      this.observeSections();
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

    observeSections() {
      const ids = ['philosophy', 'residences', 'amenities-overview', 'lifestyle', 'location', 'voices', 'inquire'];
      const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
      if (!sections.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = '#' + entry.target.id;
            this.menuLinks.forEach(link => {
              link.classList.toggle('is-active', link.getAttribute('href') === id);
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

      sections.forEach(s => observer.observe(s));
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
     7. HERO PARALLAX  (subtle scale + content fade)
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
     ★ FIX: Section height is now sized DYNAMICALLY based on the rail's
       actual width. No more hardcoded 500vh dead-scroll.
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

      // Wait for layout/fonts to settle, then measure
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
      // Mobile: let the section flow naturally (CSS handles vertical stack)
      if (!isDesktop()) {
        this.section.style.height = '';
        this.rail.style.transform = '';
        this.active = false;
        this.current = 0;
        this.target = 0;
        return;
      }

      // Measure rail and viewport
      requestAnimationFrame(() => {
        const railWidth = this.rail.scrollWidth;
        const viewport  = window.innerWidth;
        const padX = parseFloat(getComputedStyle(this.sticky).paddingLeft) || 0;

        // How far the rail needs to translate horizontally
        this.maxTranslate = Math.max(0, railWidth - viewport + padX * 2);

        if (this.maxTranslate <= 0) {
          // Rail fits in viewport — no horizontal scrub needed
          this.section.style.height = '';
          this.rail.style.transform = '';
          this.active = false;
          return;
        }

        // ★ Section height = sticky stage (1 viewport) + scroll distance
        // Scroll distance is proportional to how much the rail must move,
        // with a small multiplier for comfortable pacing. NO MORE DEAD SCROLL.
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

      // 0 when section top reaches viewport top, 1 when sticky stage ends
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
     11. INQUIRE FORM
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
     12. BACK TO TOP
     ═══════════════════════════════════════════════════════════════ */
  class BackToTop {
    constructor(smoothScroll) {
      const btn = $('#backToTop');
      if (!btn) return;
      btn.addEventListener('click', () => smoothScroll.scrollTo(0));
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     13. LOCATION MAP — Leaflet with custom theming
     ═══════════════════════════════════════════════════════════════ */
  const BUILDINGS = [
    { id: 1, address: '97-07 63rd Road',  coords: [40.7300, -73.8616] },
    { id: 2, address: '97-10 62nd Drive', coords: [40.7302, -73.8618] },
    { id: 3, address: '97-37 63rd Road',  coords: [40.7310, -73.8612] },
    { id: 4, address: '97-40 62nd Drive', coords: [40.7311, -73.8615] },
    { id: 5, address: '98-05 63rd Road',  coords: [40.7320, -73.8610] },
    { id: 6, address: '98-20 62nd Drive', coords: [40.7322, -73.8613] }
  ];

  const ATTRACTIONS = [
    // Transit
    { name: '63 Dr–Rego Park Station',     cat: 'transit',   icon: 'M', meta: 'M, R lines',           dist: '2 min walk',  coords: [40.72992, -73.86176] },
    { name: 'Forest Hills–71 Av',          cat: 'transit',   icon: 'F', meta: 'E, F, M, R',           dist: '15 min walk', coords: [40.72144, -73.84466] },
    { name: 'LIRR Forest Hills',           cat: 'transit',   icon: 'L', meta: 'Long Island Rail Road', dist: '17 min walk', coords: [40.71969, -73.84482] },
    // Shopping
    { name: 'Trader Joe\'s',               cat: 'shopping',  icon: 'T', meta: 'Grocery',              dist: '5 min walk',  coords: [40.7330, -73.8650] },
    { name: 'Rego Center',                 cat: 'shopping',  icon: 'R', meta: 'Shopping mall',        dist: '7 min walk',  coords: [40.7280, -73.8620] },
    { name: 'CTown Supermarkets',          cat: 'shopping',  icon: 'C', meta: 'Grocery',              dist: '3 min walk',  coords: [40.7289, -73.8610] },
    // Dining
    { name: 'Austin Street',               cat: 'dining',    icon: 'A', meta: 'Restaurants & cafés',  dist: '12 min walk', coords: [40.7202, -73.8462] },
    { name: 'Rego Park Cafe',              cat: 'dining',    icon: 'R', meta: 'Coffee · 7am–9pm',     dist: '4 min walk',  coords: [40.72894, -73.86273] },
    { name: 'Il Primo',                    cat: 'dining',    icon: 'I', meta: 'Italian',              dist: '6 min walk',  coords: [40.72636, -73.86505] },
    // Parks
    { name: 'Forest Park',                 cat: 'parks',     icon: 'P', meta: '538-acre park',        dist: '15 min walk', coords: [40.7000, -73.8500] },
    { name: 'Flushing Meadows',            cat: 'parks',     icon: 'F', meta: 'Iconic Queens park',   dist: '18 min walk', coords: [40.7407, -73.8496] },
    { name: 'Juniper Valley Park',         cat: 'parks',     icon: 'J', meta: 'Neighborhood park',    dist: '22 min walk', coords: [40.72048, -73.87967] },
    // Education
    { name: 'P.S. 206 Horace Harding',     cat: 'education', icon: 'S', meta: 'Elementary school',    dist: '5 min walk',  coords: [40.73412, -73.86097] },
    { name: 'J.H.S. 157 Stephen A. Halsey',cat: 'education', icon: 'J', meta: 'Middle school',        dist: '10 min walk', coords: [40.73227, -73.85342] },
    { name: 'Forest Hills High School',    cat: 'education', icon: 'H', meta: 'Public high school',   dist: '15 min walk', coords: [40.72973, -73.84493] }
  ];

  class LocationMap {
    constructor() {
      this.container = $('#leafletMap');
      if (!this.container || typeof L === 'undefined') return;

      this.tab = 'buildings';
      this.category = 'all';
      this.buildingMarkers = [];
      this.attractionMarkers = [];

      this.initMap();
      this.addBuildingMarkers();
      this.addAttractionMarkers();
      this.bindTabs();
      this.bindFilters();
      this.renderList();
      this.showBuildings();
    }

    initMap() {
      this.map = L.map(this.container, {
        center: [40.7311, -73.8614],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true
      });

      // Carto Voyager — clean, light cartography matching the cream theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap · © CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(this.map);

      // Wheel zoom only after focus — prevents accidental zoom while page-scrolling
      this.map.on('focus', () => this.map.scrollWheelZoom.enable());
      this.map.on('blur',  () => this.map.scrollWheelZoom.disable());
      this.container.addEventListener('mouseleave', () => this.map.scrollWheelZoom.disable());
    }

    addBuildingMarkers() {
      BUILDINGS.forEach(b => {
        const marker = L.marker(b.coords, {
          icon: L.divIcon({
            className: 'pc-marker pc-marker--building',
            html: `<div class="pc-marker__pin">${b.id}</div>`,
            iconSize: [42, 42],
            iconAnchor: [21, 21]
          })
        });

        marker.bindPopup(`
          <div class="pc-popup">
            <div class="pc-popup__name">${b.address}</div>
            <div class="pc-popup__meta">Building ${b.id} of 6</div>
            <div class="pc-popup__addr">Rego Park, NY 11374 · 14 stories · Private terraces</div>
          </div>
        `, { closeButton: false, offset: [0, -10], maxWidth: 260 });

        marker.buildingId = b.id;
        this.buildingMarkers.push(marker);
      });
    }

    addAttractionMarkers() {
      ATTRACTIONS.forEach(a => {
        const marker = L.marker(a.coords, {
          icon: L.divIcon({
            className: `pc-marker pc-marker--around pc-marker--${a.cat}`,
            html: `<div class="pc-marker__pin">${a.icon}</div>`,
            iconSize: [38, 38],
            iconAnchor: [19, 19]
          })
        });

        marker.bindPopup(`
          <div class="pc-popup">
            <div class="pc-popup__name">${a.name}</div>
            <div class="pc-popup__meta">${a.meta}</div>
            <div class="pc-popup__addr">${a.dist} from Park City</div>
          </div>
        `, { closeButton: false, offset: [0, -10], maxWidth: 260 });

        marker.attractionData = a;
        marker.category = a.cat;
        this.attractionMarkers.push(marker);
      });
    }

    bindTabs() {
      $$('.location__tab').forEach(tab => {
        tab.addEventListener('click', () => {
          this.tab = tab.dataset.locTab;
          $$('.location__tab').forEach(x => x.classList.toggle('is-active', x === tab));

          const filters = $('[data-loc-filters]');
          if (this.tab === 'around') {
            filters?.removeAttribute('hidden');
            this.showAttractions();
          } else {
            filters?.setAttribute('hidden', '');
            this.showBuildings();
          }
          this.renderList();
        });
      });
    }

    bindFilters() {
      $$('.loc-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          this.category = chip.dataset.locCat;
          $$('.loc-chip').forEach(x => x.classList.toggle('is-active', x === chip));
          this.showAttractions();
          this.renderList();
        });
      });
    }

    showBuildings() {
      this.attractionMarkers.forEach(m => this.map.removeLayer(m));
      this.buildingMarkers.forEach(m => m.addTo(this.map));
      const group = L.featureGroup(this.buildingMarkers);
      this.map.flyToBounds(group.getBounds().pad(0.4), { duration: 1.2 });
    }

    showAttractions() {
      this.buildingMarkers.forEach(m => this.map.removeLayer(m));
      this.attractionMarkers.forEach(m => this.map.removeLayer(m));

      const filtered = this.attractionMarkers.filter(m =>
        this.category === 'all' || m.category === this.category
      );
      filtered.forEach(m => m.addTo(this.map));

      // Keep buildings visible as faint context
      this.buildingMarkers.forEach(m => m.addTo(this.map));

      if (filtered.length) {
        const group = L.featureGroup([...filtered, ...this.buildingMarkers]);
        this.map.flyToBounds(group.getBounds().pad(0.25), { duration: 1.2 });
      }
    }

    renderList() {
      const list = $('#locList');
      if (!list) return;

      if (this.tab === 'buildings') {
        list.innerHTML = BUILDINGS.map(b => `
          <button class="loc-item" data-building="${b.id}">
            <span class="loc-item__num">${b.id}</span>
            <span class="loc-item__body">
              <span class="loc-item__name">${b.address}</span>
              <span class="loc-item__meta">Rego Park · 14 stories · Private terraces</span>
            </span>
          </button>
        `).join('');

        list.querySelectorAll('.loc-item').forEach(item => {
          item.addEventListener('click', () => {
            const id = parseInt(item.dataset.building, 10);
            const m = this.buildingMarkers.find(x => x.buildingId === id);
            if (m) {
              this.map.flyTo(m.getLatLng(), 18, { duration: 1 });
              setTimeout(() => m.openPopup(), 600);
            }
            list.querySelectorAll('.loc-item').forEach(x => x.classList.remove('is-active'));
            item.classList.add('is-active');
          });
        });
      } else {
        const filtered = ATTRACTIONS.filter(a =>
          this.category === 'all' || a.cat === this.category
        );
        list.innerHTML = filtered.map(a => `
          <button class="loc-item loc-item--around" data-attraction="${a.name}">
            <span class="loc-item__num">${a.icon}</span>
            <span class="loc-item__body">
              <span class="loc-item__name">${a.name}</span>
              <span class="loc-item__meta">${a.meta}</span>
            </span>
            <span class="loc-item__dist">${a.dist}</span>
          </button>
        `).join('');

        list.querySelectorAll('.loc-item').forEach(item => {
          item.addEventListener('click', () => {
            const name = item.dataset.attraction;
            const m = this.attractionMarkers.find(x => x.attractionData.name === name);
            if (m) {
              this.map.flyTo(m.getLatLng(), 16, { duration: 1 });
              setTimeout(() => m.openPopup(), 600);
            }
            list.querySelectorAll('.loc-item').forEach(x => x.classList.remove('is-active'));
            item.classList.add('is-active');
          });
        });
      }
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

        // UI
        this.form = new InquireForm();
        this.backToTop = new BackToTop(this.smoothScroll);

        // Map after window load (Leaflet needs final layout)
        onLoad(() => {
          this.locationMap = new LocationMap();
        });

        this.signature();
      } catch (err) {
        console.error('[Park City] init error:', err);
      }
    }

    signature() {
      const css = 'font-family: serif; font-size: 14px; font-style: italic; color: #b8956a;';
      console.log('%cPark City 3 & 4 — A residence in Rego Park.', css);
      console.log('%cEstablished 1955 · Six buildings · Managed by AKAM', 'color:#6b5d4f;font-size:11px;letter-spacing:0.16em;');
    }
  }

  // Boot
  window.parkCity = new App();
})();
