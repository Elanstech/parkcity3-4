// ═══════════════════════════════════════════════════════════════
// 🎬 LUXURY HERO CONTROLLER
// ═══════════════════════════════════════════════════════════════
class FixedLuxuryHero {
    constructor() {
        this.hero = document.querySelector('.luxury-hero');
        this.parallaxLayers = document.querySelectorAll('.parallax-image-layer');
        this.progressItems = document.querySelectorAll('.progress-item');
        this.scrollIndicator = document.querySelector('.luxury-scroll-indicator');
        
        this.currentIndex = 0;
        this.totalImages = this.parallaxLayers.length;
        this.autoSwitchInterval = 5000;
        this.autoSwitchTimer = null;
        this.isTransitioning = false;
        
        if (this.hero && this.parallaxLayers.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('✨ Luxury Hero: Initialized with sparkles');
        console.log(`📸 Found ${this.totalImages} gorgeous images`);
        
        this.setActiveLayer(0);
        this.updateProgress(0);
        this.bindParallaxScroll();
        this.bindProgressClicks();
        this.bindScrollIndicator();
        
        setTimeout(() => {
            console.log('🔄 Auto-switching engaged...');
            this.startAutoSwitch();
        }, 1000);
        
        this.bindHoverPause();
        this.addCreativeEnhancements();
    }
    
    addCreativeEnhancements() {
        // Add subtle cursor trail effect on hero
        if (window.innerWidth > 968) {
            this.hero.addEventListener('mousemove', (e) => {
                this.createCursorGlow(e);
            });
        }
    }
    
    createCursorGlow(e) {
        const glow = document.createElement('div');
        glow.className = 'hero-cursor-glow';
        glow.style.cssText = `
            position: fixed;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212, 165, 116, 0.15), transparent 70%);
            pointer-events: none;
            z-index: 4;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            opacity: 0;
        `;
        
        this.hero.appendChild(glow);
        
        requestAnimationFrame(() => {
            glow.style.opacity = '1';
        });
        
        setTimeout(() => {
            glow.style.opacity = '0';
            setTimeout(() => glow.remove(), 300);
        }, 100);
    }
    
    startAutoSwitch() {
        this.autoSwitchTimer = setInterval(() => {
            if (!this.isTransitioning) {
                const nextIndex = (this.currentIndex + 1) % this.totalImages;
                console.log(`🎬 Gracefully transitioning from ${this.currentIndex} → ${nextIndex}`);
                this.switchToImage(nextIndex);
            }
        }, this.autoSwitchInterval);
        
        console.log('✅ Auto-switch: Running smoothly (5s intervals)');
    }
    
    stopAutoSwitch() {
        if (this.autoSwitchTimer) {
            clearInterval(this.autoSwitchTimer);
            this.autoSwitchTimer = null;
            console.log('⏸️ Auto-switch: Paused gracefully');
        }
    }
    
    resetAutoSwitch() {
        this.stopAutoSwitch();
        this.startAutoSwitch();
        console.log('🔄 Auto-switch: Reset & refreshed');
    }
    
    bindHoverPause() {
        this.hero.addEventListener('mouseenter', () => {
            this.stopAutoSwitch();
        });
        
        this.hero.addEventListener('mouseleave', () => {
            this.startAutoSwitch();
        });
    }
    
    switchToImage(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        
        console.log(`🎭 Switching to slide ${index + 1}`);
        this.isTransitioning = true;
        
        this.setActiveLayer(index);
        this.updateProgress(index);
        this.currentIndex = index;
        
        setTimeout(() => {
            this.isTransitioning = false;
            console.log('✨ Transition complete & beautiful');
        }, 1500);
    }
    
    setActiveLayer(index) {
        this.parallaxLayers.forEach((layer, i) => {
            if (i === index) {
                layer.classList.add('active');
            } else {
                layer.classList.remove('active');
            }
        });
    }
    
    updateProgress(index) {
        this.progressItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
                const fill = item.querySelector('.progress-fill');
                if (fill) {
                    fill.style.animation = 'none';
                    setTimeout(() => {
                        fill.style.animation = 'progressFill 5s linear forwards';
                    }, 10);
                }
            } else {
                item.classList.remove('active');
                const fill = item.querySelector('.progress-fill');
                if (fill) fill.style.animation = 'none';
            }
        });
    }
    
    bindProgressClicks() {
        this.progressItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (!this.isTransitioning && index !== this.currentIndex) {
                    console.log(`👆 Manual selection: Image ${index + 1}`);
                    this.switchToImage(index);
                    this.resetAutoSwitch();
                }
            });
        });
    }
    
    bindParallaxScroll() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleParallaxScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleParallaxScroll() {
        const scrolled = window.pageYOffset;
        const heroHeight = this.hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            this.parallaxLayers.forEach((layer) => {
                const speed = parseFloat(layer.dataset.speed) || 0.5;
                const yPos = -(scrolled * speed);
                layer.style.transform = `translateY(${yPos}px)`;
            });
        }
    }
    
    bindScrollIndicator() {
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                const nextSection = document.querySelector('.about-premium-section') || 
                                  document.querySelector('#amenities');
                if (nextSection) {
                    const offsetTop = nextSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 💎 BUTTON INTERACTIONS WITH SPARKLE EFFECTS
// ═══════════════════════════════════════════════════════════════
class ButtonInteractions {
    constructor() {
        this.buttons = document.querySelectorAll('.luxury-btn');
        this.init();
    }
    
    init() {
        console.log('🎨 Button Interactions: Active & gorgeous');
        
        this.buttons.forEach(button => {
            // Hover effects
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px) scale(1.02)';
                this.createSparkles(button);
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
            
            // Click ripple
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }
    
    createSparkles(button) {
        // Subtle sparkle effect on hover
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('span');
                sparkle.textContent = '✨';
                sparkle.style.cssText = `
                    position: absolute;
                    font-size: 12px;
                    pointer-events: none;
                    animation: sparkleFloat 1s ease-out forwards;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    z-index: 10;
                `;
                
                button.style.position = 'relative';
                button.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 1000);
            }, i * 100);
        }
    }
    
    createRipple(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
            animation: rippleEffect 0.6s ease-out;
            z-index: 0;
        `;
        
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
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
        this.autoPlayDuration = 4000; // 4 seconds - snappy!
        this.autoPlayTimer = null;
        this.progressInterval = null;
        this.isTransitioning = false;
        
        if (this.container && this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('✨ Ultra-Sleek Slideshow: Initialized with elegance');
        console.log(`📸 ${this.totalSlides} stunning images loaded`);
        
        this.showSlide(0);
        this.startAutoPlay();
        this.bindDotClicks();
        this.bindHoverPause();
        this.bindKeyboard();
        this.addCreativeEnhancements();
        
        console.log('▶️ Auto-play: Running smoothly (4s intervals)');
    }
    
    addCreativeEnhancements() {
        // Add subtle image scale animation
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
        
        // Update slides
        this.slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update dots
        this.dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        this.currentIndex = index;
        this.resetProgressBar();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 1200);
        
        console.log(`📍 Displaying: Slide ${index + 1}/${this.totalSlides}`);
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
            
            // Add cute hover effect
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
                console.log('⏸️ Slideshow: Paused gracefully');
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.startAutoPlay();
                console.log('▶️ Slideshow: Resumed smoothly');
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
        console.log('📊 Stat Counter: Armed & ready to count');
        
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
            }, index * 150); // Staggered for cuteness
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
        
        // Smooth counting animation
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
                console.log(`🎯 Counted to: ${target}!`);
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
        console.log('🎯 Feature Points: Locked & loaded');
        
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
        
        console.log('✨ Features: Animated beautifully');
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
        console.log('💎 Stat Cards: Interactive & gorgeous');
        
        this.statCards.forEach(card => {
            // 3D tilt effect
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
            
            // Ripple on click
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
        console.log('🌊 Parallax: Flowing gracefully');
        
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
        console.log('🎬 Scroll Animations: Observing with precision');
        
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
        console.log('❓ FAQ Accordion: Ready to answer');
        
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
        console.log('📧 Contact Form: Ready to submit');
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
            this.showMessage('Please enter a valid email address 💌', 'error');
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
// 🌊 PARALLAX EFFECTS
// ═══════════════════════════════════════════════════════════════
class ParallaxEffects {
    constructor() {
        this.elements = Array.from(document.querySelectorAll('.amenities-parallax'));
        if (this.elements.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🌊 Parallax Effects: Flowing');
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const offset = (scrollY - el.offsetTop) * 0.3;
                el.style.transform = `translateY(${offset}px)`;
            }
        });
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
        console.log('🎯 Smooth Scroll: Gliding gracefully');
        
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
            console.log('✅ Page: Fully loaded & gorgeous');
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎨 CREATIVE ANIMATION STYLES
// ═══════════════════════════════════════════════════════════════
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Sparkle Float */
        @keyframes sparkleFloat {
            0% {
                opacity: 0;
                transform: translateY(0) scale(0);
            }
            50% {
                opacity: 1;
                transform: translateY(-20px) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-40px) scale(0.5);
            }
        }
        
        /* Ripple Effect */
        @keyframes rippleEffect {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        /* Feature Point Entrance */
        .feature-point {
            opacity: 0;
            transform: translateX(-60px);
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .feature-point.animated {
            opacity: 1;
            transform: translateX(0);
        }
        
        /* Stat Box Entrance */
        .stat-box {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stat-box.counted {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎨 Animation Styles: Applied beautifully');
}

// ═══════════════════════════════════════════════════════════════
// 🎮 UTILITIES
// ═══════════════════════════════════════════════════════════════
class Utilities {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static isMobile() {
        return window.innerWidth <= 768;
    }
    
    static isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }
    
    static isDesktop() {
        return window.innerWidth > 1024;
    }
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
            console.log('✨                  PARK CITY 3&4 APARTMENTS                  ✨');
            console.log('        Apple Precision × Rolls-Royce Luxury × Creative Magic');
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('');
            
            // Add animation styles
            addAnimationStyles();
            
            // Initialize Hero
            console.log('🎬 HERO SECTION');
            this.components.fixedHero = new FixedLuxuryHero();
            this.components.buttonInteractions = new ButtonInteractions();
            console.log('');
            
            // Initialize Navigation
            console.log('🧭 NAVIGATION');
            this.components.navigation = new HeaderNavigation();
            console.log('');
            
            // Initialize About Section (NEW!)
            console.log('💎 ABOUT SECTION - ULTRA-PREMIUM');
            this.components.aboutSlideshow = new UltraSleekSlideshow();
            this.components.statCounter = new StatCounterAnimator();
            this.components.featurePoints = new FeaturePointAnimator();
            this.components.statInteractions = new StatCardInteractions();
            this.components.aboutParallax = new AboutParallaxEffects();
            console.log('');
            
            // Initialize Global Features
            console.log('🎨 GLOBAL FEATURES');
            this.components.scrollAnimations = new ScrollAnimations({ threshold: 0.1 });
            
            // Initialize FAQ
            const faqsContainer = document.querySelector('.faqs-container');
            if (faqsContainer) {
                this.components.faqAccordion = new FAQAccordion(faqsContainer);
            }
            
            // Initialize Contact Form
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                this.components.contactForm = new ContactForm(contactForm);
            }
            
            // Initialize Parallax
            this.components.parallaxEffects = new ParallaxEffects();
            
            // Initialize Smooth Scroll
            this.components.smoothScroll = new SmoothScroll();
            
            // Initialize Page Loader
            this.components.pageLoader = new PageLoader();
            
            console.log('');
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('✅ ALL COMPONENTS: Initialized successfully!');
            console.log('📸 Hero Slideshow: Auto-play (5s intervals)');
            console.log('🎬 About Slideshow: Ultra-fast (4s intervals)');
            console.log('🎯 Animations: Scroll-triggered entrance effects');
            console.log('🎨 Interactions: Hover effects & magnetic animations');
            console.log('💎 About Section: Apple × Rolls-Royce premium');
            console.log('🌟 Park City 3&4: Ready to impress!');
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('');
            
        } catch (error) {
            console.error('❌ Error initializing components:', error);
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 🚀 INITIALIZE APPLICATION
// ═══════════════════════════════════════════════════════════════
const parkCityApp = new ParkCityApp();

// Scroll to top on load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    console.log('🎬 Page: Loaded & scrolled to top gracefully');
});

console.log('🌟 Park City 3&4 Script: Loaded, polished & ready to shine!');
