/**
 * ═══════════════════════════════════════════════════════════════
 *        🖼️ PARK CITY 3&4 — GALLERY PAGE CONTROLLER
 *   Masonry Grid × Filtering × Lightbox × Scroll Animations
 * ═══════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🖼️  PARK CITY 3&4 — GALLERY PAGE');
    console.log('═══════════════════════════════════════════════════════');

    new GalleryFilterController();
    new GalleryLightbox();
    new GalleryScrollAnimations();
    new GalleryStickyControls();

    console.log('✅ Gallery: All systems initialized');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
});


/**
 * ═══════════════════════════════════════════════════════════════
 * 🎛️ FILTER CONTROLLER
 * ═══════════════════════════════════════════════════════════════
 */
class GalleryFilterController {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.cards = document.querySelectorAll('.gallery-card');
        this.countEl = document.getElementById('galleryCount');
        this.grid = document.getElementById('masonryGrid');
        this.activeFilter = 'all';

        if (this.filterBtns.length && this.cards.length) {
            this.init();
        }
    }

    init() {
        console.log('🎛️ Filter Controller: Ready');

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                if (filter === this.activeFilter) return;
                this.activeFilter = filter;
                this.updateButtons(btn);
                this.filterCards(filter);
            });
        });
    }

    updateButtons(activeBtn) {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    filterCards(filter) {
        let visibleCount = 0;

        // Fade out all first
        this.cards.forEach(card => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.92)';
        });

        // After fade out, rearrange
        setTimeout(() => {
            this.cards.forEach(card => {
                const category = card.dataset.category;
                const match = filter === 'all' || category === filter;

                if (match) {
                    card.classList.remove('hidden');
                    card.style.display = '';
                    card.style.position = '';
                    card.style.visibility = '';
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });

            // Show empty state if needed
            this.showEmptyState(visibleCount === 0);

            // Update count
            if (this.countEl) {
                this.countEl.textContent = visibleCount;
            }

            // Animate visible cards in with stagger
            requestAnimationFrame(() => {
                const visible = this.grid.querySelectorAll('.gallery-card:not(.hidden)');
                visible.forEach((card, i) => {
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, i * 60);
                });
            });
        }, 300);
    }

    showEmptyState(show) {
        let emptyEl = this.grid.querySelector('.gallery-empty');

        if (show && !emptyEl) {
            emptyEl = document.createElement('div');
            emptyEl.className = 'gallery-empty';
            emptyEl.innerHTML = `
                <div class="gallery-empty-icon">📷</div>
                <h3 class="gallery-empty-title">No photos in this category</h3>
                <p class="gallery-empty-text">Try selecting a different filter above</p>
            `;
            this.grid.appendChild(emptyEl);
        } else if (!show && emptyEl) {
            emptyEl.remove();
        }
    }
}


/**
 * ═══════════════════════════════════════════════════════════════
 * 🔍 LIGHTBOX CONTROLLER
 * ═══════════════════════════════════════════════════════════════
 */
class GalleryLightbox {
    constructor() {
        this.overlay = document.getElementById('lightboxOverlay');
        this.image = document.getElementById('lightboxImage');
        this.caption = document.getElementById('lightboxCaption');
        this.counter = document.getElementById('lightboxCounter');
        this.closeBtn = document.getElementById('lightboxClose');
        this.prevBtn = document.getElementById('lightboxPrev');
        this.nextBtn = document.getElementById('lightboxNext');
        this.cards = [];
        this.currentIndex = 0;
        this.isOpen = false;

        if (this.overlay) {
            this.init();
        }
    }

    init() {
        console.log('🔍 Lightbox: Ready');
        this.buildImageList();
        this.bindEvents();
    }

    buildImageList() {
        this.cards = Array.from(document.querySelectorAll('.gallery-card:not(.hidden)'));
    }

    getVisibleCards() {
        return Array.from(document.querySelectorAll('.gallery-card:not(.hidden):not([style*="display: none"])'));
    }

    bindEvents() {
        // Open on card click
        document.querySelectorAll('.gallery-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't open if clicking zoom btn directly (it should also open)
                const visible = this.getVisibleCards();
                const idx = visible.indexOf(card);
                if (idx !== -1) {
                    this.open(idx, visible);
                }
            });
        });

        // Close
        this.closeBtn.addEventListener('click', () => this.close());
        this.overlay.querySelector('.lightbox-backdrop').addEventListener('click', () => this.close());

        // Navigation
        this.prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prev(); });
        this.nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.next(); });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Touch swipe
        let startX = 0;
        this.overlay.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.overlay.addEventListener('touchend', (e) => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 60) {
                if (diff > 0) this.next();
                else this.prev();
            }
        }, { passive: true });
    }

    open(index, visibleCards) {
        this.cards = visibleCards;
        this.currentIndex = index;
        this.isOpen = true;
        this.updateImage();
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.animateTransition('prev');
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.animateTransition('next');
    }

    animateTransition(direction) {
        this.image.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        this.image.style.opacity = '0';
        this.image.style.transform = direction === 'next'
            ? 'translateX(-30px) scale(0.95)'
            : 'translateX(30px) scale(0.95)';

        setTimeout(() => {
            this.updateImage();
            this.image.style.transform = direction === 'next'
                ? 'translateX(30px) scale(0.95)'
                : 'translateX(-30px) scale(0.95)';

            requestAnimationFrame(() => {
                this.image.style.transition = 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)';
                this.image.style.opacity = '1';
                this.image.style.transform = 'translateX(0) scale(1)';
            });
        }, 200);
    }

    updateImage() {
        const card = this.cards[this.currentIndex];
        if (!card) return;

        const img = card.querySelector('img');
        const title = card.querySelector('.caption-title');

        if (img) {
            // Get high-res version
            let src = img.src;
            // Upgrade unsplash quality
            if (src.includes('unsplash.com') && src.includes('w=800')) {
                src = src.replace('w=800', 'w=1600');
            }
            this.image.src = src;
            this.image.alt = img.alt || 'Gallery Photo';
        }

        if (title) {
            this.caption.textContent = title.textContent;
        }

        this.counter.textContent = `${this.currentIndex + 1} / ${this.cards.length}`;
    }
}


/**
 * ═══════════════════════════════════════════════════════════════
 * 🎬 SCROLL ANIMATIONS
 * ═══════════════════════════════════════════════════════════════
 */
class GalleryScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎬 Scroll Animations: Ready');

        const observerOptions = {
            threshold: 0.08,
            rootMargin: '0px 0px -80px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger based on position
                    const delay = this.getStaggerDelay(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    getStaggerDelay(el) {
        // Cards in the same visual row should stagger
        if (el.classList.contains('gallery-card')) {
            const grid = el.parentElement;
            const siblings = Array.from(grid.querySelectorAll('.gallery-card:not(.hidden)'));
            const idx = siblings.indexOf(el);
            return (idx % 3) * 100; // Stagger within groups of 3
        }
        return 0;
    }
}


/**
 * ═══════════════════════════════════════════════════════════════
 * 📌 STICKY FILTER BAR CONTROLLER
 * ═══════════════════════════════════════════════════════════════
 */
class GalleryStickyControls {
    constructor() {
        this.controls = document.getElementById('galleryControls');
        if (this.controls) {
            this.init();
        }
    }

    init() {
        console.log('📌 Sticky Controls: Ready');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                this.controls.classList.add('scrolled');
            } else {
                this.controls.classList.remove('scrolled');
            }
        }, { passive: true });
    }
}
