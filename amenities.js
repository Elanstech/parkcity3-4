/* ═══════════════════════════════════════════════════════════════
   🏠 AMENITIES PAGE CONTROLLER
   ═══════════════════════════════════════════════════════════════ */

class AmenitiesPageController {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🏠 AMENITIES PAGE: Initializing...');
        
        this.initScrollAnimations();
        this.initCardHoverEffects();
        this.initCategoryAnimations();
        this.initParallaxEffects();
        this.initImageGridEffects();
        
        console.log('✅ Amenities Page: Ready');
    }
    
    // ═══════════════════════════════════════
    // SCROLL ANIMATIONS
    // ═══════════════════════════════════════
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -80px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Elements to animate
        const animateElements = document.querySelectorAll(`
            .featured-header,
            .featured-card,
            .category-section,
            .highlight-stat,
            .highlights-text,
            .highlights-visual,
            .cta-content
        `);
        
        animateElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s`;
            observer.observe(el);
        });
    }
    
    // ═══════════════════════════════════════
    // CARD HOVER EFFECTS
    // ═══════════════════════════════════════
    initCardHoverEffects() {
        const featuredCards = document.querySelectorAll('.featured-card');
        const amenityCards = document.querySelectorAll('.amenity-card');
        
        // 3D tilt effect for featured cards (desktop only)
        if (window.innerWidth > 968) {
            featuredCards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 30;
                    const rotateY = (centerX - x) / 30;
                    
                    card.style.transform = `
                        perspective(1000px) 
                        rotateX(${rotateX}deg) 
                        rotateY(${rotateY}deg) 
                        translateY(-8px)
                    `;
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                });
            });
        }
        
        // Magnetic effect for amenity cards
        amenityCards.forEach(card => {
            card.addEventListener('click', () => {
                this.createRipple(card);
            });
        });
    }
    
    // ═══════════════════════════════════════
    // CATEGORY ANIMATIONS
    // ═══════════════════════════════════════
    initCategoryAnimations() {
        const categories = document.querySelectorAll('.category-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.amenity-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        categories.forEach(category => {
            const cards = category.querySelectorAll('.amenity-card');
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            });
            observer.observe(category);
        });
    }
    
    // ═══════════════════════════════════════
    // PARALLAX EFFECTS
    // ═══════════════════════════════════════
    initParallaxEffects() {
        if (window.innerWidth <= 968) return;
        
        const visualCard = document.querySelector('.visual-card');
        const accentCard = document.querySelector('.visual-accent-card');
        
        if (visualCard && accentCard) {
            window.addEventListener('scroll', () => {
                const rect = visualCard.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                    const parallaxOffset = (scrollProgress - 0.5) * 40;
                    
                    accentCard.style.transform = `translateY(${parallaxOffset}px)`;
                }
            });
        }
    }
    
    // ═══════════════════════════════════════
    // IMAGE GRID EFFECTS
    // ═══════════════════════════════════════
    initImageGridEffects() {
        const gridImages = document.querySelectorAll('.hero-img-item');
        
        gridImages.forEach(img => {
            img.addEventListener('mouseenter', () => {
                // Dim other images
                gridImages.forEach(other => {
                    if (other !== img) {
                        other.style.opacity = '0.6';
                        other.style.filter = 'brightness(0.7)';
                    }
                });
            });
            
            img.addEventListener('mouseleave', () => {
                // Reset all images
                gridImages.forEach(other => {
                    other.style.opacity = '1';
                    other.style.filter = '';
                });
            });
        });
    }
    
    // ═══════════════════════════════════════
    // UTILITY: CREATE RIPPLE
    // ═══════════════════════════════════════
    createRipple(element) {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(212, 165, 116, 0.3) 0%, transparent 70%);
            border-radius: 20px;
            transform: translate(-50%, -50%) scale(0);
            pointer-events: none;
            animation: amenityRipple 0.6s ease-out forwards;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// Add animation styles
function addAmenitiesAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        @keyframes amenityRipple {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addAmenitiesAnimationStyles();
    new AmenitiesPageController();
});

// GSAP ScrollTrigger Animations (if GSAP is loaded)
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Featured cards stagger animation
    gsap.fromTo('.featured-card', 
        { y: 60, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.featured-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );
    
    // Category numbers animation
    gsap.fromTo('.category-number',
        { x: -50, opacity: 0 },
        {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.amenities-categories',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        }
    );
    
    // Highlight stats counter animation
    const statValues = document.querySelectorAll('.highlight-stat .stat-value');
    statValues.forEach(stat => {
        const text = stat.textContent;
        const hasNumber = /\d/.test(text);
        
        if (hasNumber) {
            const number = parseFloat(text.replace(/[^\d.]/g, ''));
            const suffix = text.replace(/[\d.]/g, '');
            
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 85%',
                onEnter: () => {
                    gsap.fromTo(stat,
                        { textContent: '0' + suffix },
                        {
                            duration: 2,
                            ease: 'power2.out',
                            snap: { textContent: 1 },
                            textContent: number,
                            onUpdate: function() {
                                stat.textContent = Math.round(this.targets()[0].textContent) + suffix;
                            }
                        }
                    );
                }
            });
        }
    });
}

console.log('🏠 Amenities.js loaded');
