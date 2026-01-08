/**
 * ═══════════════════════════════════════════════════════════════
 *                    🏙️ PARK CITY 3&4 APARTMENTS
 *            Complete JavaScript - ES6 Architecture
 *        Rolls-Royce Smooth × Apple Premium × Creative Magic
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// 🏆 PERFECTED LUXURY HERO CONTROLLER
// Rolls-Royce Smooth × NO BLACK BARS × GPU Accelerated
// ═══════════════════════════════════════════════════════════════
class PerfectedLuxuryHero {
    constructor() {
        this.hero = document.querySelector('.luxury-hero');
        this.parallaxWrapper = document.querySelector('.hero-parallax-wrapper');
        this.parallaxLayers = document.querySelectorAll('.parallax-layer');
        this.progressIndicators = document.querySelectorAll('.progress-indicator');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.buttons = document.querySelectorAll('.hero-btn');
        this.statItems = document.querySelectorAll('.stat-item');
        
        this.currentIndex = 0;
        this.totalSlides = this.parallaxLayers.length;
        this.autoSwitchInterval = 5000;
        this.autoSwitchTimer = null;
        this.isTransitioning = false;
        this.isHovered = false;
        
        // Performance optimization
        this.rafId = null;
        this.lastScrollY = 0;
        this.ticking = false;
        
        if (this.hero && this.parallaxLayers.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🏆 PERFECTED HERO: Initializing Rolls-Royce smoothness');
        
        this.setActiveSlide(0);
        this.bindParallaxScroll();
        this.bindProgressClicks();
        this.bindScrollIndicator();
        this.bindHoverPause();
        this.bindButtonInteractions();
        this.bindStatInteractions();
        this.bindKeyboardNavigation();
        this.addCursorEffects();
        this.addMagneticButtons();
        this.addNYCIconInteractions();
        
        setTimeout(() => {
            this.startAutoSwitch();
            console.log('▶️ Auto-switch: Buttery smooth (5s)');
        }, 1000);
    }
    
    setActiveSlide(index) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        this.parallaxLayers.forEach((layer, i) => {
            layer.classList.toggle('active', i === index);
        });
        
        this.progressIndicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
            const fill = indicator.querySelector('.indicator-fill');
            if (fill) {
                fill.style.animation = 'none';
                if (i === index) {
                    requestAnimationFrame(() => {
                        fill.style.animation = 'indicatorFill 5s linear forwards';
                    });
                }
            }
        });
        
        this.currentIndex = index;
        this.createSlideChangeRipple();
        
        setTimeout(() => {
            this.isTransitioning = false;
            console.log(`✨ Slide ${index + 1}/${this.totalSlides}: Perfect transition`);
        }, 1800);
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        this.setActiveSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.setActiveSlide(prevIndex);
    }
    
    startAutoSwitch() {
        this.autoSwitchTimer = setInterval(() => {
            if (!this.isTransitioning && !this.isHovered) {
                this.nextSlide();
            }
        }, this.autoSwitchInterval);
    }
    
    stopAutoSwitch() {
        if (this.autoSwitchTimer) {
            clearInterval(this.autoSwitchTimer);
            this.autoSwitchTimer = null;
        }
    }
    
    resetAutoSwitch() {
        this.stopAutoSwitch();
        this.startAutoSwitch();
    }
    
    bindParallaxScroll() {
        window.addEventListener('scroll', () => {
            this.lastScrollY = window.pageYOffset;
            if (!this.ticking) {
                this.rafId = window.requestAnimationFrame(() => {
                    this.handleParallaxScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    }
    
    handleParallaxScroll() {
        const scrollY = this.lastScrollY;
        const heroHeight = this.hero.offsetHeight;
        
        if (scrollY < heroHeight) {
            this.parallaxLayers.forEach((layer) => {
                if (layer.classList.contains('active')) {
                    const speed = parseFloat(layer.dataset.speed) || 0.5;
                    const yPos = -(scrollY * speed);
                    layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
                    layer.style.willChange = 'transform';
                }
            });
        } else {
            this.parallaxLayers.forEach(layer => {
                layer.style.willChange = 'auto';
            });
        }
    }
    
    bindProgressClicks() {
        this.progressIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (!this.isTransitioning && index !== this.currentIndex) {
                    this.setActiveSlide(index);
                    this.resetAutoSwitch();
                    this.createClickSparkle(indicator);
                }
            });
            
            indicator.addEventListener('mouseenter', () => {
                indicator.style.transform = 'scaleY(2) scaleX(1.1)';
            });
            
            indicator.addEventListener('mouseleave', () => {
                indicator.style.transform = '';
            });
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
    
    bindHoverPause() {
        this.hero.addEventListener('mouseenter', () => {
            this.isHovered = true;
            this.stopAutoSwitch();
        });
        
        this.hero.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.startAutoSwitch();
        });
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
    
    bindKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const rect = this.hero.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible && !this.isTransitioning && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                e.preventDefault();
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
                this.resetAutoSwitch();
            }
        });
    }
    
    addCursorEffects() {
        if (window.innerWidth <= 968) return;
        let cursorTimeout;
        this.hero.addEventListener('mousemove', (e) => {
            clearTimeout(cursorTimeout);
            cursorTimeout = setTimeout(() => this.createCursorGlow(e), 50);
        });
    }
    
    createCursorGlow(e) {
        const glow = document.createElement('div');
        glow.style.cssText = `position:fixed;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(212,165,116,0.12),transparent 70%);pointer-events:none;z-index:9;left:${e.clientX}px;top:${e.clientY}px;transform:translate(-50%,-50%);transition:opacity 0.4s;opacity:0`;
        this.hero.appendChild(glow);
        requestAnimationFrame(() => glow.style.opacity = '1');
        setTimeout(() => { glow.style.opacity = '0'; setTimeout(() => glow.remove(), 400); }, 100);
    }
    
    addMagneticButtons() {
        if (window.innerWidth <= 968) return;
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
                button.style.transform = `translate(${x}px, ${y}px) translateY(-4px) scale(1.03)`;
            });
            button.addEventListener('mouseleave', () => button.style.transform = '');
        });
    }
    
    addNYCIconInteractions() {
        document.querySelectorAll('.nyc-icon').forEach((icon, i) => {
            icon.addEventListener('click', () => this.createIconBurst(icon));
            icon.style.animationDelay = `${i * 0.15}s`;
        });
    }
    
    createSlideChangeRipple() {
        const ripple = document.createElement('div');
        ripple.style.cssText = 'position:absolute;top:50%;left:50%;width:100px;height:100px;border-radius:50%;border:2px solid rgba(212,165,116,0.4);transform:translate(-50%,-50%) scale(0);pointer-events:none;z-index:5';
        this.hero.appendChild(ripple);
        requestAnimationFrame(() => {
            ripple.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
            ripple.style.transform = 'translate(-50%, -50%) scale(8)';
            ripple.style.opacity = '0';
        });
        setTimeout(() => ripple.remove(), 1000);
    }
    
    createClickSparkle(element) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('span');
                sparkle.textContent = '✨';
                sparkle.style.cssText = `position:absolute;font-size:14px;pointer-events:none;z-index:20;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:sparkleFloat 1s ease-out forwards`;
                element.style.position = 'relative';
                element.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 1000);
            }, i * 80);
        }
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
    
    createIconBurst(icon) {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            const angle = (360 / 6) * i;
            particle.style.cssText = 'position:absolute;width:4px;height:4px;background:linear-gradient(135deg,#d4a574,#a67c52);border-radius:50%;top:50%;left:50%;pointer-events:none;z-index:10';
            icon.appendChild(particle);
            requestAnimationFrame(() => {
                const radians = (angle * Math.PI) / 180;
                const x = Math.cos(radians) * 60;
                const y = Math.sin(radians) * 60;
                particle.style.transition = 'all 0.6s ease-out';
                particle.style.transform = `translate(${x}px, ${y}px) scale(0)`;
                particle.style.opacity = '0';
            });
            setTimeout(() => particle.remove(), 600);
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 🧭 MODERN NAVIGATION
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
        console.log('🧭 Navigation: Initialized & polished');
        
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
        console.log('📱 Mobile menu: Opened beautifully');
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.mobileMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        
        setTimeout(() => {
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }, 400);
        
        console.log('📱 Mobile menu: Closed gracefully');
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
        
        this.menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === '/' && href === 'index.html')) {
                const wrapper = link.querySelector('.link-wrapper');
                if (wrapper) {
                    wrapper.style.background = 'rgba(212, 165, 116, 0.15)';
                    wrapper.style.borderColor = 'rgba(212, 165, 116, 0.4)';
                }
                const linkText = link.querySelector('.link-text');
                if (linkText) {
                    linkText.style.color = '#d4a574';
                }
            }
        });
    }
    
    initMagneticEffects() {
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
        
        if (this.menuClose) {
            this.menuClose.addEventListener('mousemove', (e) => {
                const rect = this.menuClose.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                this.menuClose.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
            });
            
            this.menuClose.addEventListener('mouseleave', () => {
                this.menuClose.style.transform = '';
            });
        }
        
        const ctaBtn = document.querySelector('.menu-cta-btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('mousemove', (e) => {
                const rect = ctaBtn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                ctaBtn.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px) translateY(-4px) scale(1.02)`;
            });
            
            ctaBtn.addEventListener('mouseleave', () => {
                ctaBtn.style.transform = '';
            });
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎬 ULTRA-SLEEK AUTO-SLIDESHOW (ABOUT SECTION)
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
        console.log('✨ Ultra-Sleek Slideshow: Initialized');
        
        this.showSlide(0);
        this.startAutoPlay();
        this.bindDotClicks();
        this.bindHoverPause();
        this.bindKeyboard();
        this.addCreativeEnhancements();
        
        console.log('▶️ Auto-play: Running (4s intervals)');
    }
    
    addCreativeEnhancements() {
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
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
        
        console.log(`📍 Slide ${index + 1}/${this.totalSlides}`);
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
                console.log('⏸️ Slideshow: Paused');
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.startAutoPlay();
                console.log('▶️ Slideshow: Resumed');
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
// 📊 STAT COUNTER ANIMATOR (ABOUT SECTION)
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
// 🎯 FEATURE POINT ANIMATOR (ABOUT SECTION)
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
// 💎 STAT CARD INTERACTIONS (ABOUT SECTION)
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
        
        if (this.contentSide && this.gallerySide) {
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
// 🏙️ MAIN PARK CITY APP
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
            console.log('   Rolls-Royce Smooth × Apple Premium × Creative Magic');
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('');
            
            addAnimationStyles();
            
            // Hero Section
            console.log('🏆 PERFECTED HERO SECTION');
            this.components.perfectedHero = new PerfectedLuxuryHero();
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
            console.log('🏆 Hero: Rolls-Royce smooth (NO BLACK BARS!)');
            console.log('🎬 About: Ultra-fast slideshow (4s)');
            console.log('🎯 Effects: Magnetic buttons, sparkles, 3D tilts');
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

console.log('🌟 Park City 3&4 Script: Loaded & ready to shine!');
