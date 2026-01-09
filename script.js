/**
 * ═══════════════════════════════════════════════════════════════
 *                    🏙️ PARK CITY 3&4 APARTMENTS
 *                  FINAL COMPLETE SCRIPT - OPTIMIZED
 *        Video Hero × About Section × All Features × Mobile Perfect
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// 🎥 VIDEO HERO CONTROLLER - OPTIMIZED
// ═══════════════════════════════════════════════════════════════
class VideoHeroController {
    constructor() {
        this.hero = document.querySelector('.luxury-hero');
        this.video = document.querySelector('.hero-video');
        this.videoToggle = document.getElementById('videoToggle');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.buttons = document.querySelectorAll('.hero-btn');
        this.statItems = document.querySelectorAll('.stat-item');
        
        this.isPlaying = true;
        
        if (this.hero && this.video) {
            this.init();
        }
    }
    
    init() {
        console.log('🎥 VIDEO HERO: Initializing...');
        
        this.setupVideo();
        this.bindVideoToggle();
        this.bindScrollIndicator();
        this.bindButtonInteractions();
        this.bindStatInteractions();
        this.addMagneticButtons();
        this.handleVideoErrors();
        
        console.log('✅ Video Hero: Ready & gorgeous');
    }
    
    setupVideo() {
        // Ensure video plays on mobile
        this.video.setAttribute('playsinline', '');
        this.video.setAttribute('muted', '');
        
        // Auto-play
        this.video.play().catch(err => {
            console.log('⚠️ Video autoplay prevented:', err);
            this.isPlaying = false;
            this.updateToggleButton();
        });
        
        // Optimize for mobile
        if (window.innerWidth <= 968) {
            this.video.style.filter = 'brightness(0.7) contrast(1.05)';
        }
    }
    
    bindVideoToggle() {
        if (this.videoToggle) {
            this.videoToggle.addEventListener('click', () => {
                if (this.isPlaying) {
                    this.video.pause();
                    this.isPlaying = false;
                    console.log('⏸️ Video paused');
                } else {
                    this.video.play();
                    this.isPlaying = true;
                    console.log('▶️ Video playing');
                }
                this.updateToggleButton();
            });
        }
    }
    
    updateToggleButton() {
        if (this.videoToggle) {
            const playIcon = this.videoToggle.querySelector('.play-icon');
            const pauseIcon = this.videoToggle.querySelector('.pause-icon');
            
            if (this.isPlaying) {
                playIcon.classList.remove('active');
                pauseIcon.classList.add('active');
            } else {
                playIcon.classList.add('active');
                pauseIcon.classList.remove('active');
            }
        }
    }
    
    handleVideoErrors() {
        this.video.addEventListener('error', (e) => {
            console.error('❌ Video error:', e);
            // Fallback to image background
            const fallbackImg = this.video.querySelector('img');
            if (fallbackImg) {
                const imgSrc = fallbackImg.getAttribute('src');
                this.hero.style.backgroundImage = `url(${imgSrc})`;
                this.hero.style.backgroundSize = 'cover';
                this.hero.style.backgroundPosition = 'center';
            }
        });
    }
    
    bindScrollIndicator() {
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                const nextSection = document.querySelector('.about-premium-section') || 
                                  document.querySelector('#amenities');
                if (nextSection) {
                    window.scrollTo({
                        top: nextSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    this.createScrollRipple();
                }
            });
        }
    }
    
    bindButtonInteractions() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => this.createButtonRipple(e, button));
            button.addEventListener('mouseenter', () => this.createButtonSparkles(button));
        });
    }
    
    bindStatInteractions() {
        this.statItems.forEach(stat => {
            stat.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 968) return; // Skip on mobile
                
                const rect = stat.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;
                stat.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
            
            stat.addEventListener('mouseleave', () => {
                stat.style.transform = '';
            });
        });
    }
    
    addMagneticButtons() {
        if (window.innerWidth <= 968) return; // Skip on mobile
        
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
                button.style.transform = `translate(${x}px, ${y}px) translateY(-4px) scale(1.03)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }
    
    createButtonRipple(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(255,255,255,0.4);top:${event.clientY-rect.top-size/2}px;left:${event.clientX-rect.left-size/2}px;pointer-events:none;transform:scale(0);opacity:1;z-index:0`;
        button.appendChild(ripple);
        requestAnimationFrame(() => {
            ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            ripple.style.transform = 'scale(3)';
            ripple.style.opacity = '0';
        });
        setTimeout(() => ripple.remove(), 600);
    }
    
    createButtonSparkles(button) {
        if (window.innerWidth <= 968) return; // Skip on mobile
        
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('span');
                sparkle.textContent = '✨';
                sparkle.style.cssText = `position:absolute;font-size:12px;pointer-events:none;z-index:10;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:sparkleFloat 1s ease-out forwards`;
                button.style.position = 'relative';
                button.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 1000);
            }, i * 100);
        }
    }
    
    createScrollRipple() {
        const ripple = document.createElement('div');
        ripple.style.cssText = 'position:absolute;top:50%;left:50%;width:80px;height:80px;border-radius:50%;border:2px solid rgba(212,165,116,0.5);transform:translate(-50%,-50%) scale(0);pointer-events:none;z-index:0';
        this.scrollIndicator.appendChild(ripple);
        requestAnimationFrame(() => {
            ripple.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
            ripple.style.transform = 'translate(-50%, -50%) scale(2)';
            ripple.style.opacity = '0';
        });
        setTimeout(() => ripple.remove(), 800);
    }
}

// ═══════════════════════════════════════════════════════════════
// 🧭 NAVIGATION CONTROLLER
// ═══════════════════════════════════════════════════════════════
class HeaderNavigation {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.navToggle = document.getElementById('navToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.menuClose = document.getElementById('menuClose');
        this.navItems = document.querySelectorAll('.nav-item');
        this.menuLinks = document.querySelectorAll('.menu-link');
        this.isMenuOpen = false;
        
        if (!this.nav) return;
        this.init();
    }
    
    init() {
        console.log('🧭 Navigation: Initialized');
        
        this.bindEvents();
        this.handleScroll();
        this.setActiveLink();
        this.initMagneticEffects();
    }
    
    bindEvents() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        if (this.menuClose) {
            this.menuClose.addEventListener('click', () => this.closeMobileMenu());
        }
        
        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.closeMobileMenu(), 300);
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener('click', (e) => {
                if (e.target === this.mobileMenu) {
                    this.closeMobileMenu();
                }
            });
        }
        
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMenuOpen = true;
        this.mobileMenu.classList.add('active');
        this.navToggle.classList.add('active');
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.mobileMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        
        setTimeout(() => {
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }, 400);
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
    }
    
    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === '/' && href === 'index.html')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    initMagneticEffects() {
        if (window.innerWidth <= 968) return; // Skip on mobile
        
        this.menuLinks.forEach(link => {
            link.addEventListener('mousemove', (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const linkWrapper = link.querySelector('.link-wrapper');
                if (linkWrapper) {
                    linkWrapper.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
                }
            });
            
            link.addEventListener('mouseleave', () => {
                const linkWrapper = link.querySelector('.link-wrapper');
                if (linkWrapper) {
                    linkWrapper.style.transform = '';
                }
            });
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎬 ULTRA-SLEEK SLIDESHOW (ABOUT SECTION)
// ═══════════════════════════════════════════════════════════════
class UltraSleekSlideshow {
    constructor() {
        this.container = document.querySelector('.about-slideshow-container');
        this.slides = document.querySelectorAll('.slideshow-image');
        this.dots = document.querySelectorAll('.progress-dot');
        this.progressBar = document.querySelector('.progress-bar-fill');
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayDuration = 4000;
        this.autoPlayTimer = null;
        this.progressInterval = null;
        this.isTransitioning = false;
        
        if (this.container && this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🎬 About Slideshow: Initialized');
        
        this.showSlide(0);
        this.startAutoPlay();
        this.bindDotClicks();
        this.bindHoverPause();
        this.bindKeyboard();
        this.addImageEffects();
    }
    
    addImageEffects() {
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img && window.innerWidth > 968) {
                slide.addEventListener('mouseenter', () => {
                    img.style.transform = 'scale(1.05)';
                    img.style.transition = 'transform 0.8s ease';
                });
                
                slide.addEventListener('mouseleave', () => {
                    img.style.transform = 'scale(1)';
                });
            }
        });
    }
    
    showSlide(index) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        this.currentIndex = index;
        this.resetProgressBar();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 1200);
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        this.showSlide(nextIndex);
    }
    
    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        }, this.autoPlayDuration);
        
        this.startProgressBar();
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
        
        this.stopProgressBar();
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
    
    startProgressBar() {
        if (this.progressBar) {
            let progress = 0;
            const increment = 100 / (this.autoPlayDuration / 50);
            
            this.progressInterval = setInterval(() => {
                progress += increment;
                if (progress >= 100) {
                    progress = 100;
                }
                this.progressBar.style.width = `${progress}%`;
            }, 50);
        }
    }
    
    stopProgressBar() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
    
    resetProgressBar() {
        this.stopProgressBar();
        if (this.progressBar) {
            this.progressBar.style.width = '0%';
        }
        this.startProgressBar();
    }
    
    bindDotClicks() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (index !== this.currentIndex && !this.isTransitioning) {
                    this.showSlide(index);
                    this.resetAutoPlay();
                }
            });
            
            dot.addEventListener('mouseenter', () => {
                dot.style.transform = 'scale(1.3)';
            });
            
            dot.addEventListener('mouseleave', () => {
                dot.style.transform = '';
            });
        });
    }
    
    bindHoverPause() {
        if (this.container) {
            this.container.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }
    }
    
    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            const rect = this.container.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !this.isTransitioning) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
                    this.showSlide(prevIndex);
                    this.resetAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                    this.resetAutoPlay();
                }
            }
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 📊 STAT COUNTER ANIMATOR
// ═══════════════════════════════════════════════════════════════
class StatCounterAnimator {
    constructor() {
        this.statCards = document.querySelectorAll('.about-stat-card');
        this.hasAnimated = false;
        
        if (this.statCards.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('📊 Stat Counter: Ready');
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.hasAnimated = true;
                        this.animateAllStats();
                    }
                });
            },
            { threshold: 0.3 }
        );
        
        this.statCards.forEach(card => observer.observe(card));
    }
    
    animateAllStats() {
        this.statCards.forEach((card, index) => {
            setTimeout(() => {
                this.animateStat(card);
            }, index * 150);
        });
    }
    
    animateStat(card) {
        const valueElement = card.querySelector('.stat-card-value');
        if (!valueElement) return;
        
        const target = parseInt(valueElement.dataset.count);
        
        if (isNaN(target)) {
            valueElement.style.transform = 'scale(1)';
            valueElement.style.opacity = '1';
            return;
        }
        
        const duration = 2000;
        const steps = 60;
        const stepTime = duration / steps;
        const increment = target / steps;
        
        let current = 0;
        
        const counter = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                valueElement.textContent = target;
                clearInterval(counter);
            } else {
                valueElement.textContent = Math.floor(current);
            }
        }, stepTime);
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎯 FEATURE POINT ANIMATOR
// ═══════════════════════════════════════════════════════════════
class FeaturePointAnimator {
    constructor() {
        this.featurePoints = document.querySelectorAll('.about-feature-point');
        this.hasAnimated = false;
        
        if (this.featurePoints.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🎯 Feature Points: Ready');
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.hasAnimated = true;
                        this.animateFeatures();
                    }
                });
            },
            { threshold: 0.2 }
        );
        
        this.featurePoints.forEach(point => observer.observe(point));
        this.addMagneticEffect();
    }
    
    animateFeatures() {
        this.featurePoints.forEach((point, index) => {
            setTimeout(() => {
                point.style.opacity = '0';
                point.style.transform = 'translateX(-40px)';
                
                setTimeout(() => {
                    point.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                    point.style.opacity = '1';
                    point.style.transform = 'translateX(0)';
                }, 50);
            }, index * 200);
        });
    }
    
    addMagneticEffect() {
        if (window.innerWidth <= 968) return; // Skip on mobile
        
        this.featurePoints.forEach(point => {
            point.addEventListener('mousemove', (e) => {
                const rect = point.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const indicator = point.querySelector('.feature-point-indicator');
                if (indicator) {
                    indicator.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
                }
            });
            
            point.addEventListener('mouseleave', () => {
                const indicator = point.querySelector('.feature-point-indicator');
                if (indicator) {
                    indicator.style.transform = '';
                }
            });
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 💎 STAT CARD INTERACTIONS
// ═══════════════════════════════════════════════════════════════
class StatCardInteractions {
    constructor() {
        this.statCards = document.querySelectorAll('.about-stat-card');
        
        if (this.statCards.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('💎 Stat Cards: Interactive');
        
        this.statCards.forEach(card => {
            if (window.innerWidth > 968) {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    card.style.transform = `
                        perspective(1000px) 
                        rotateX(${rotateX}deg) 
                        rotateY(${rotateY}deg) 
                        translateY(-8px) 
                        scale(1.02)
                    `;
                });
            }
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
            
            card.addEventListener('click', (e) => {
                this.createRipple(e, card);
            });
        });
    }
    
    createRipple(event, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212, 165, 116, 0.4) 0%, transparent 70%);
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
            transform: scale(0);
            opacity: 1;
            z-index: 100;
        `;
        
        element.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            ripple.style.transform = 'scale(2)';
            ripple.style.opacity = '0';
        });
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// ═══════════════════════════════════════════════════════════════
// 🌊 ABOUT PARALLAX EFFECTS
// ═══════════════════════════════════════════════════════════════
class AboutParallaxEffects {
    constructor() {
        this.contentSide = document.querySelector('.about-content-side');
        this.gallerySide = document.querySelector('.about-gallery-side');
        
        if (this.contentSide && this.gallerySide && window.innerWidth > 968) {
            this.init();
        }
    }
    
    init() {
        console.log('🌊 Parallax: Active');
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        const section = document.querySelector('.about-premium-section');
        
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            const offset = (scrollY - section.offsetTop) * 0.15;
            
            if (this.contentSide) {
                this.contentSide.style.transform = `translateY(${offset}px)`;
            }
            
            if (this.gallerySide) {
                this.gallerySide.style.transform = `translateY(${-offset}px)`;
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 🌆 LOCATION & LIFESTYLE
// ═══════════════════════════════════════════════════════════════
class LocationLifestyleController {
    constructor() {
        this.bentoCards = document.querySelectorAll('.lifestyle-bento-card');
        this.ctaButton = document.querySelector('.cta-premium-btn');
        this.ctaWrapper = document.querySelector('.lifestyle-cta-wrapper');
        this.section = document.querySelector('.location-lifestyle');
        
        this.animationFrameId = null;
        this.isHovering = false;
        
        if (this.bentoCards.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🌆 Location & Lifestyle: Initializing Rolls-Royce animations...');
        
        this.setupScrollAnimations();
        this.addCardInteractions();
        this.addMagneticEffects();
        this.addParallaxEffect();
        this.addCtaInteractions();
        this.addFloatingParticles();
        this.initIntersectionObserver();
        
        console.log('✅ Location & Lifestyle: Premium animations ready');
    }
    
    setupScrollAnimations() {
        // Stagger the entrance animations
        this.bentoCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.15}s`;
        });
    }
    
    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        // Observe all cards
        this.bentoCards.forEach(card => {
            observer.observe(card);
        });
        
        // Observe CTA wrapper
        if (this.ctaWrapper) {
            observer.observe(this.ctaWrapper);
        }
    }
    
    addCardInteractions() {
        this.bentoCards.forEach(card => {
            // 3D Tilt Effect (Desktop only)
            if (window.innerWidth > 968) {
                card.addEventListener('mousemove', (e) => {
                    this.handleCardTilt(e, card);
                });
                
                card.addEventListener('mouseleave', () => {
                    this.resetCardTilt(card);
                });
            }
            
            // Ripple Effect on Click
            card.addEventListener('click', (e) => {
                this.createLuxuryRipple(e, card);
            });
            
            // Glow Enhancement
            card.addEventListener('mouseenter', () => {
                this.enhanceCardGlow(card);
                this.animateCardContent(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetCardContent(card);
            });
        });
    }
    
    handleCardTilt(event, card) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        
        // Smooth tilt with perspective
        card.style.transform = `
            perspective(1200px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateY(-16px) 
            scale3d(1.03, 1.03, 1.03)
            translateZ(20px)
        `;
        
        // Update glow position based on mouse
        const glow = card.querySelector('.bento-card-glow');
        if (glow) {
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            glow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(212, 165, 116, 0.4), transparent 70%)`;
        }
    }
    
    resetCardTilt(card) {
        card.style.transform = '';
        card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    addMagneticEffects() {
        if (window.innerWidth <= 968) return;
        
        this.bentoCards.forEach(card => {
            const iconWrapper = card.querySelector('.bento-icon-wrapper');
            const icon = card.querySelector('.bento-icon');
            
            if (iconWrapper && icon) {
                card.addEventListener('mousemove', (e) => {
                    this.handleMagneticIcon(e, card, iconWrapper, icon);
                });
                
                card.addEventListener('mouseleave', () => {
                    iconWrapper.style.transform = '';
                    icon.style.transform = '';
                });
            }
        });
    }
    
    handleMagneticIcon(event, card, iconWrapper, icon) {
        const cardRect = card.getBoundingClientRect();
        const iconRect = iconWrapper.getBoundingClientRect();
        
        const mouseX = event.clientX - cardRect.left;
        const mouseY = event.clientY - cardRect.top;
        
        const iconCenterX = iconRect.left - cardRect.left + iconRect.width / 2;
        const iconCenterY = iconRect.top - cardRect.top + iconRect.height / 2;
        
        const deltaX = mouseX - iconCenterX;
        const deltaY = mouseY - iconCenterY;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 200;
        
        if (distance < maxDistance) {
            const strength = (maxDistance - distance) / maxDistance;
            const moveX = (deltaX / distance) * 25 * strength;
            const moveY = (deltaY / distance) * 25 * strength;
            
            iconWrapper.style.transform = `
                translate(${moveX}px, ${moveY}px) 
                scale(${1.15 + strength * 0.15}) 
                rotate(-8deg)
            `;
            
            icon.style.transform = `
                scale(${1.1 + strength * 0.1}) 
                rotate(${8 + strength * 5}deg)
            `;
        }
    }

    addParallaxEffect() {
        if (window.innerWidth <= 968) return;
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                this.animationFrameId = window.requestAnimationFrame(() => {
                    this.handleParallaxScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleParallaxScroll() {
        const scrollY = window.scrollY;
        
        this.bentoCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                // Alternating parallax direction
                const direction = (index % 2 === 0) ? 1 : -1;
                const speed = 0.05 * direction;
                const offset = (scrollY - (card.offsetTop - window.innerHeight / 2)) * speed;
                
                // Only apply if not being hovered
                if (!card.matches(':hover')) {
                    card.style.transform = `translateY(${offset}px)`;
                }
            }
        });
    }

    animateCardContent(card) {
        const title = card.querySelector('.bento-title');
        const description = card.querySelector('.bento-description');
        const features = card.querySelectorAll('.mini-feature');
        const highlight = card.querySelector('.bento-highlight');
        
        // Animate title
        if (title) {
            setTimeout(() => {
                title.style.transform = 'translateX(8px)';
            }, 50);
        }
        
        // Animate description
        if (description) {
            setTimeout(() => {
                description.style.transform = 'translateX(4px)';
            }, 100);
        }
        
        // Stagger animate features
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.transform = 'translateX(12px) scale(1.05)';
            }, 150 + (index * 50));
        });
        
        // Animate highlight
        if (highlight) {
            setTimeout(() => {
                highlight.style.transform = 'translateX(12px) scale(1.05)';
            }, 200);
        }
    }
    
    resetCardContent(card) {
        const title = card.querySelector('.bento-title');
        const description = card.querySelector('.bento-description');
        const features = card.querySelectorAll('.mini-feature');
        const highlight = card.querySelector('.bento-highlight');
        
        [title, description, highlight].forEach(el => {
            if (el) el.style.transform = '';
        });
        
        features.forEach(feature => {
            feature.style.transform = '';
        });
    }
    
    addCtaInteractions() {
        if (!this.ctaButton) return;
        
        // Magnetic effect
        if (window.innerWidth > 968) {
            this.ctaButton.addEventListener('mousemove', (e) => {
                this.handleMagneticCta(e);
            });
            
            this.ctaButton.addEventListener('mouseleave', () => {
                this.ctaButton.style.transform = '';
            });
        }
        
        // Click sparkle effect
        this.ctaButton.addEventListener('click', (e) => {
            this.createCtaSparkles();
            this.createCtaRipple(e);
        });
        
        // Hover glow pulse
        this.ctaButton.addEventListener('mouseenter', () => {
            this.pulseCtaGlow();
        });
    }
    
    handleMagneticCta(event) {
        const rect = this.ctaButton.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.3;
        
        this.ctaButton.style.transform = `
            translate(${x}px, ${y}px) 
            translateY(-6px) 
            scale(1.05)
        `;
    }
    
    pulseCtaGlow() {
        const card = this.ctaButton.closest('.lifestyle-cta-card');
        if (!card) return;
        
        const glow = card.querySelector('.cta-glow');
        if (glow) {
            glow.style.animation = 'ctaGlowPulse 1.5s ease-in-out';
            setTimeout(() => {
                glow.style.animation = 'ctaGlowPulse 5s ease-in-out infinite';
            }, 1500);
        }
    }
    
    createLuxuryRipple(event, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212, 165, 116, 0.5) 0%, rgba(212, 165, 116, 0.2) 40%, transparent 70%);
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
            transform: scale(0);
            opacity: 1;
            z-index: 100;
            filter: blur(4px);
        `;
        
        element.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)';
            ripple.style.transform = 'scale(1)';
            ripple.style.opacity = '0';
        });
        
        setTimeout(() => ripple.remove(), 1000);
    }
    
    createCtaRipple(event) {
        const ripple = document.createElement('div');
        const rect = this.ctaButton.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 70%);
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
            transform: scale(0);
            opacity: 1;
            z-index: 1;
        `;
        
        this.ctaButton.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
            ripple.style.transform = 'scale(2)';
            ripple.style.opacity = '0';
        });
        
        setTimeout(() => ripple.remove(), 800);
    }
    
    createCtaSparkles() {
        if (window.innerWidth <= 968) return;
        
        const sparkleCount = 12;
        
        for (let i = 0; i < sparkleCount; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('span');
                const angle = (Math.PI * 2 * i) / sparkleCount;
                const distance = 60 + Math.random() * 40;
                
                sparkle.textContent = '✨';
                sparkle.style.cssText = `
                    position: absolute;
                    font-size: ${12 + Math.random() * 8}px;
                    pointer-events: none;
                    z-index: 10;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                `;
                
                this.ctaButton.style.position = 'relative';
                this.ctaButton.appendChild(sparkle);
                
                requestAnimationFrame(() => {
                    sparkle.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
                    sparkle.style.transform = `
                        translate(-50%, -50%) 
                        translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)
                        scale(0)
                        rotate(${Math.random() * 720}deg)
                    `;
                    sparkle.style.opacity = '1';
                    
                    setTimeout(() => {
                        sparkle.style.opacity = '0';
                    }, 600);
                });
                
                setTimeout(() => sparkle.remove(), 1200);
            }, i * 40);
        }
    }
    
    enhanceCardGlow(card) {
        const glow = card.querySelector('.bento-card-glow');
        if (glow) {
            glow.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
        }
    }
    
    addFloatingParticles() {
        if (window.innerWidth <= 968 || !this.section) return;
        
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 4 + 2;
            const duration = Math.random() * 20 + 15;
            const delay = Math.random() * 5;
            const x = Math.random() * 100;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(212, 165, 116, 0.3), transparent);
                border-radius: 50%;
                left: ${x}%;
                bottom: -20px;
                pointer-events: none;
                filter: blur(1px);
                animation: floatUp ${duration}s ease-in-out ${delay}s infinite;
                opacity: 0;
            `;
            
            this.section.appendChild(particle);
        }
        
        // Add keyframe animation
        if (!document.getElementById('floatUpAnimation')) {
            const style = document.createElement('style');
            style.id = 'floatUpAnimation';
            style.textContent = `
                @keyframes floatUp {
                    0% {
                        transform: translateY(0) translateX(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}


// ═══════════════════════════════════════════════════════════════
// 🎬 SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════════════════
class ScrollAnimations {
    constructor(options = {}) {
        this.elements = Array.from(document.querySelectorAll('[data-animate]'));
        this.threshold = options.threshold || 0.1;
        this.observerOptions = {
            threshold: this.threshold,
            rootMargin: '0px 0px -100px 0px'
        };
        
        if (this.elements.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🎬 Scroll Animations: Ready');
        
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.observerOptions
        );
        
        this.elements.forEach(el => this.observer.observe(el));
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// ❓ FAQ ACCORDION
// ═══════════════════════════════════════════════════════════════
class FAQAccordion {
    constructor(container) {
        this.container = container;
        this.items = Array.from(container.querySelectorAll('.faq-item'));
        
        if (this.items.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('❓ FAQ Accordion: Ready');
        
        this.items.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => this.toggleItem(item));
        });
    }
    
    toggleItem(item) {
        const isActive = item.classList.contains('active');
        
        this.items.forEach(i => i.classList.remove('active'));
        
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 📧 CONTACT FORM
// ═══════════════════════════════════════════════════════════════
class ContactForm {
    constructor(form) {
        this.form = form;
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        console.log('📧 Contact Form: Ready');
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        if (this.validate(data)) {
            this.submitForm(data);
        }
    }
    
    validate(data) {
        const { name, email, phone, interest, message } = data;
        
        if (!name || !email || !phone || !interest || !message) {
            this.showMessage('Please fill in all fields ✨', 'error');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showMessage('Please enter a valid email 💌', 'error');
            return false;
        }
        
        return true;
    }
    
    async submitForm(data) {
        try {
            console.log('✉️ Form submitted:', data);
            
            this.showMessage('Thank you! We will contact you soon. 🎉', 'success');
            this.form.reset();
        } catch (error) {
            this.showMessage('Something went wrong. Please try again. 😔', 'error');
        }
    }
    
    showMessage(text, type) {
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const message = document.createElement('div');
        message.className = `form-message form-message-${type}`;
        message.textContent = text;
        
        Object.assign(message.style, {
            padding: '16px 20px',
            marginTop: '20px',
            borderRadius: '12px',
            fontSize: '0.938rem',
            fontWeight: '500',
            textAlign: 'center',
            backgroundColor: type === 'success' ? 'rgba(92, 141, 90, 0.15)' : 'rgba(220, 38, 38, 0.15)',
            border: type === 'success' ? '1px solid rgba(92, 141, 90, 0.3)' : '1px solid rgba(220, 38, 38, 0.3)',
            color: type === 'success' ? '#5c8d5a' : '#dc2626'
        });
        
        this.form.appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-10px)';
            message.style.transition = 'all 0.4s ease';
            setTimeout(() => message.remove(), 400);
        }, 5000);
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎯 SMOOTH SCROLL
// ═══════════════════════════════════════════════════════════════
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🎯 Smooth Scroll: Active');
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && href !== '#apply') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// ⏳ PAGE LOADER
// ═══════════════════════════════════════════════════════════════
class PageLoader {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('⏳ Page Loader: Standing by');
        
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            console.log('✅ Page: Fully loaded');
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎨 ANIMATION STYLES
// ═══════════════════════════════════════════════════════════════
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleFloat {
            0% { opacity: 0; transform: translateY(0) scale(0); }
            50% { opacity: 1; transform: translateY(-20px) scale(1); }
            100% { opacity: 0; transform: translateY(-40px) scale(0.5); }
        }
        @keyframes rippleEffect {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ═══════════════════════════════════════════════════════════════
// 🏙️ MAIN PARK CITY APP - COMPLETE WITH ALL SECTIONS
// ═══════════════════════════════════════════════════════════════
class ParkCityApp {
    constructor() {
        this.components = {};
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            console.log('');
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('✨              PARK CITY 3&4 APARTMENTS                      ✨');
            console.log('   Video Hero × Mobile Optimized × Premium Experience');
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('');
            
            addAnimationStyles();
            
            // Video Hero Section
            console.log('🎥 VIDEO HERO SECTION');
            this.components.videoHero = new VideoHeroController();
            console.log('');
            
            // Navigation
            console.log('🧭 NAVIGATION');
            this.components.navigation = new HeaderNavigation();
            console.log('');
            
            // About Section
            console.log('💎 ABOUT SECTION');
            this.components.aboutSlideshow = new UltraSleekSlideshow();
            this.components.statCounter = new StatCounterAnimator();
            this.components.featurePoints = new FeaturePointAnimator();
            this.components.statInteractions = new StatCardInteractions();
            this.components.aboutParallax = new AboutParallaxEffects();
            console.log('');
            
            // Location & Lifestyle Section - ROLLS-ROYCE PREMIUM
            console.log('🌆 LOCATION & LIFESTYLE - ROLLS-ROYCE × APPLE');
            this.components.locationLifestyle = new LocationLifestyleController();
            console.log('');
            
            // Global Features
            console.log('🎨 GLOBAL FEATURES');
            this.components.scrollAnimations = new ScrollAnimations({ threshold: 0.1 });
            
            const faqsContainer = document.querySelector('.faqs-container');
            if (faqsContainer) {
                this.components.faqAccordion = new FAQAccordion(faqsContainer);
            }
            
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                this.components.contactForm = new ContactForm(contactForm);
            }
            
            this.components.smoothScroll = new SmoothScroll();
            this.components.pageLoader = new PageLoader();
            
            console.log('');
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('✅ ALL COMPONENTS: Initialized successfully!');
            console.log('🎥 Video Hero: Background video playing');
            console.log('📱 Mobile: Fully optimized (no overflow!)');
            console.log('🎬 About: Ultra-fast slideshow (4s)');
            console.log('🌆 Location: Rolls-Royce × Apple animations');
            console.log('🎯 Effects: Magnetic, sparkles, 3D tilts');
            console.log('💎 Premium: Apple × Rolls-Royce level');
            console.log('🌟 Park City 3&4: Ready to impress!');
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('');
            
        } catch (error) {
            console.error('❌ Error initializing:', error);
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 🚀 INITIALIZE APPLICATION
// ═══════════════════════════════════════════════════════════════
const parkCityApp = new ParkCityApp();

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    console.log('🎬 Page loaded & scrolled to top');
});

console.log('🌟 Park City 3&4 Final Script: Loaded & ready!');
