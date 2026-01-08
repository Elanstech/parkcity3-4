/**
 * ============================================
 * PARK CITY 3&4 APARTMENTS
 * Complete JavaScript - ES6 Class Architecture
 * ============================================
 */

// ============================================
// FIXED LUXURY HERO CONTROLLER
// ============================================
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
        console.log('✨ Fixed Luxury Hero initialized');
        console.log(`📸 Found ${this.totalImages} images`);
        
        this.setActiveLayer(0);
        this.updateProgress(0);
        this.bindParallaxScroll();
        this.bindProgressClicks();
        this.bindScrollIndicator();
        
        setTimeout(() => {
            console.log('🔄 Starting auto-switch...');
            this.startAutoSwitch();
        }, 1000);
        
        this.bindHoverPause();
    }
    
    startAutoSwitch() {
        this.autoSwitchTimer = setInterval(() => {
            if (!this.isTransitioning) {
                const nextIndex = (this.currentIndex + 1) % this.totalImages;
                console.log(`🔄 Auto-switching from ${this.currentIndex} to ${nextIndex}`);
                this.switchToImage(nextIndex);
            }
        }, this.autoSwitchInterval);
        
        console.log('✅ Auto-switch started - images will change every 5 seconds');
    }
    
    stopAutoSwitch() {
        if (this.autoSwitchTimer) {
            clearInterval(this.autoSwitchTimer);
            this.autoSwitchTimer = null;
            console.log('⏸️ Auto-switch paused');
        }
    }
    
    resetAutoSwitch() {
        this.stopAutoSwitch();
        this.startAutoSwitch();
        console.log('🔄 Auto-switch reset');
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
        
        console.log(`🎬 Switching to image ${index}`);
        this.isTransitioning = true;
        
        this.setActiveLayer(index);
        this.updateProgress(index);
        this.currentIndex = index;
        
        setTimeout(() => {
            this.isTransitioning = false;
            console.log('✅ Transition complete');
        }, 1500);
    }
    
    setActiveLayer(index) {
        this.parallaxLayers.forEach((layer, i) => {
            if (i === index) {
                layer.classList.add('active');
                console.log(`✅ Layer ${i} activated`);
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
                if (fill) {
                    fill.style.animation = 'none';
                }
            }
        });
    }
    
    bindProgressClicks() {
        this.progressItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (!this.isTransitioning && index !== this.currentIndex) {
                    console.log(`👆 Manual switch to image ${index}`);
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
                const nextSection = document.querySelector('.premium-amenities') || 
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

// ============================================
// BUTTON INTERACTIONS
// ============================================
class ButtonInteractions {
    constructor() {
        this.buttons = document.querySelectorAll('.luxury-btn');
        this.init();
    }
    
    init() {
        console.log('🎨 Button interactions initialized');
        
        this.buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
            
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
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

// ============================================
// MODERN NAVIGATION
// ============================================
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
        console.log('🧭 Navigation initialized');
        
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
        console.log('📱 Mobile menu opened');
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.mobileMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        
        setTimeout(() => {
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }, 400);
        
        console.log('📱 Mobile menu closed');
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

// ============================================
// LUXURY SLIDESHOW
// ============================================
class LuxurySlideshow {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.thumbnails = document.querySelectorAll('.thumbnail');
        this.prevBtn = document.querySelector('.slide-prev');
        this.nextBtn = document.querySelector('.slide-next');
        this.progressBar = document.querySelector('.progress-bar');
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = 5000;
        this.autoPlayTimer = null;
        this.isTransitioning = false;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('✨ Luxury Slideshow initialized');
        console.log(`📸 ${this.totalSlides} slides loaded`);
        
        this.showSlide(0);
        this.bindNavigation();
        this.bindThumbnails();
        this.bindKeyboard();
        this.bindHoverPause();
        this.bindSwipeGestures();
        this.startAutoPlay();
        
        console.log('▶️ Auto-play started');
    }
    
    showSlide(index) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        this.slides[index].classList.add('active');
        this.thumbnails[index].classList.add('active');
        
        this.currentIndex = index;
        this.resetProgressBar();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
        
        console.log(`📍 Showing slide ${index + 1}/${this.totalSlides}`);
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        this.showSlide(nextIndex);
        this.resetAutoPlay();
    }
    
    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prevIndex);
        this.resetAutoPlay();
    }
    
    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        }, this.autoPlayInterval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
    
    resetProgressBar() {
        if (this.progressBar) {
            this.progressBar.style.animation = 'none';
            setTimeout(() => {
                this.progressBar.style.animation = 'slideProgressAnim 5s linear forwards';
            }, 10);
        }
    }
    
    bindNavigation() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
    }
    
    bindThumbnails() {
        this.thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                if (index !== this.currentIndex && !this.isTransitioning) {
                    this.showSlide(index);
                    this.resetAutoPlay();
                }
            });
        });
    }
    
    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            const slideshowMain = document.querySelector('.slideshow-main');
            if (!slideshowMain) return;
            
            const rect = slideshowMain.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                }
            }
        });
    }
    
    bindHoverPause() {
        const slideshowMain = document.querySelector('.slideshow-main');
        
        if (slideshowMain) {
            slideshowMain.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
                console.log('⏸️ Auto-play paused');
            });
            
            slideshowMain.addEventListener('mouseleave', () => {
                this.startAutoPlay();
                console.log('▶️ Auto-play resumed');
            });
        }
    }
    
    bindSwipeGestures() {
        const slideshowMain = document.querySelector('.slideshow-main');
        if (!slideshowMain) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        slideshowMain.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slideshowMain.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
}

// ============================================
// STAT COUNTER ANIMATION
// ============================================
class StatCounter {
    constructor() {
        this.statBoxes = document.querySelectorAll('.stat-box');
        if (this.statBoxes.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('📊 Stat counter initialized');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    this.animateCounter(entry.target);
                }
            });
        }, observerOptions);
        
        this.statBoxes.forEach(box => observer.observe(box));
    }
    
    animateCounter(statBox) {
        const numberElement = statBox.querySelector('.stat-number-large');
        if (!numberElement) return;
        
        const text = numberElement.textContent;
        const hasPlus = text.includes('+');
        const hasSlash = text.includes('/');
        
        if (hasSlash) {
            this.animateText(numberElement, text);
            return;
        }
        
        const number = parseInt(text.replace(/[^0-9]/g, ''));
        
        if (isNaN(number)) return;
        
        let current = 0;
        const increment = number / 60;
        const duration = 1500;
        const stepTime = duration / 60;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                numberElement.textContent = number + (hasPlus ? '+' : '');
                clearInterval(timer);
            } else {
                numberElement.textContent = Math.floor(current) + (hasPlus ? '+' : '');
            }
        }, stepTime);
        
        console.log(`🔢 Animated counter: ${number}`);
    }
    
    animateText(element, text) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.5)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 100);
    }
}

// ============================================
// FEATURE POINTS ANIMATOR
// ============================================
class FeaturePointsAnimator {
    constructor() {
        this.featurePoints = document.querySelectorAll('.feature-point');
        if (this.featurePoints.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🎯 Feature points animated');
        
        this.animateEntrance();
        this.addHoverEffects();
        this.addParallaxEffect();
    }
    
    animateEntrance() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        this.featurePoints.forEach(point => observer.observe(point));
    }
    
    addHoverEffects() {
        this.featurePoints.forEach(point => {
            const icon = point.querySelector('.point-icon');
            const number = point.querySelector('.point-number');
            
            point.addEventListener('mouseenter', () => {
                if (icon) {
                    icon.style.animation = 'iconPulse 0.6s ease';
                }
                
                if (number) {
                    number.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                }
            });
            
            point.addEventListener('mouseleave', () => {
                if (icon) {
                    icon.style.animation = '';
                }
            });
        });
    }
    
    addParallaxEffect() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleParallax() {
        this.featurePoints.forEach((point, index) => {
            const rect = point.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const scrolled = window.pageYOffset;
                const speed = 0.02 * (index + 1);
                const yPos = -(scrolled - rect.top) * speed;
                
                point.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
}

// ============================================
// SHOWCASE LABEL ANIMATOR
// ============================================
class ShowcaseLabelAnimator {
    constructor() {
        this.labels = document.querySelectorAll('.showcase-label');
        if (this.labels.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🏷️ Showcase labels animated');
        
        this.labels.forEach(label => {
            this.animateLabel(label);
        });
    }
    
    animateLabel(label) {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('label-animated')) {
                    entry.target.classList.add('label-animated');
                    this.addShimmerEffect(entry.target);
                }
            });
        }, observerOptions);
        
        observer.observe(label);
    }
    
    addShimmerEffect(label) {
        label.style.position = 'relative';
        label.style.overflow = 'hidden';
        
        const shimmer = document.createElement('div');
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
            animation: shimmerMove 1.5s ease-in-out;
        `;
        
        label.appendChild(shimmer);
        
        setTimeout(() => {
            shimmer.remove();
        }, 1500);
    }
}

// ============================================
// BUILDING SHOWCASE ANIMATOR
// ============================================
class BuildingShowcaseAnimator {
    constructor() {
        this.showcase = document.querySelector('.building-showcase');
        if (this.showcase) {
            this.init();
        }
    }
    
    init() {
        console.log('🏢 Building showcase animated');
        
        this.addFloatingEffect();
        this.addMagneticEffect();
    }
    
    addFloatingEffect() {
        const showcaseContent = document.querySelector('.showcase-content');
        if (!showcaseContent) return;
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = showcaseContent.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    
                    if (isVisible) {
                        const scrolled = window.pageYOffset;
                        const offset = (scrolled - rect.top) * 0.05;
                        showcaseContent.style.transform = `translateY(${offset}px)`;
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    addMagneticEffect() {
        const statBoxes = document.querySelectorAll('.stat-box');
        
        statBoxes.forEach(box => {
            box.addEventListener('mousemove', (e) => {
                const rect = box.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const icon = box.querySelector('.stat-icon-wrapper');
                if (icon) {
                    icon.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.1) rotate(-5deg)`;
                }
            });
            
            box.addEventListener('mouseleave', () => {
                const icon = box.querySelector('.stat-icon-wrapper');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    }
}

// ============================================
// PREMIUM AMENITIES CONTROLLER
// ============================================
class PremiumAmenitiesController {
    constructor() {
        this.bentoItems = document.querySelectorAll('.bento-item');
        this.statBoxes = document.querySelectorAll('.stat-box');
        this.featurePoints = document.querySelectorAll('.feature-point');
        
        if (this.bentoItems.length > 0 || this.statBoxes.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('✨ Premium Amenities Controller initialized');
        
        this.initMagneticEffects();
        this.initParallaxEffects();
        this.initStatCounters();
        this.initBentoInteractions();
    }
    
    initMagneticEffects() {
        this.bentoItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const icon = item.querySelector('.bento-icon');
                if (icon) {
                    icon.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px) scale(1.1) rotate(-5deg)`;
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('.bento-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
        
        console.log('🧲 Magnetic effects initialized');
    }
    
    initParallaxEffects() {
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
        
        this.featurePoints.forEach((point, index) => {
            const rect = point.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const speed = 0.05 * (index + 1);
                const yPos = (scrolled - rect.top) * speed;
                point.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
    
    initStatCounters() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    this.animateCounter(entry.target);
                }
            });
        }, observerOptions);
        
        this.statBoxes.forEach(box => observer.observe(box));
    }
    
    animateCounter(statBox) {
        const numberElement = statBox.querySelector('.stat-number-large');
        if (!numberElement) return;
        
        const text = numberElement.textContent;
        const hasPlus = text.includes('+');
        const number = parseInt(text.replace(/[^0-9]/g, ''));
        
        if (isNaN(number)) return;
        
        let current = 0;
        const increment = number / 60;
        const duration = 1500;
        const stepTime = duration / 60;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                numberElement.textContent = number + (hasPlus ? '+' : '');
                clearInterval(timer);
            } else {
                numberElement.textContent = Math.floor(current) + (hasPlus ? '+' : '');
            }
        }, stepTime);
        
        console.log(`📊 Animated counter: ${number}`);
    }
    
    initBentoInteractions() {
        this.bentoItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.createRipple(e, item);
            });
            
            item.addEventListener('mousemove', (e) => {
                if (window.innerWidth > 968) {
                    this.add3DTilt(e, item);
                }
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
            });
        });
        
        console.log('🎨 Bento interactions initialized');
    }
    
    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(212, 165, 116, 0.4);
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
            animation: rippleAnimation 0.8s ease-out;
            z-index: 0;
        `;
        
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    }
    
    add3DTilt(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
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
        console.log('🎬 Scroll animations initialized');
        
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

// ============================================
// FAQ ACCORDION
// ============================================
class FAQAccordion {
    constructor(container) {
        this.container = container;
        this.items = Array.from(container.querySelectorAll('.faq-item'));
        
        if (this.items.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('❓ FAQ accordion initialized');
        
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

// ============================================
// CONTACT FORM
// ============================================
class ContactForm {
    constructor(form) {
        this.form = form;
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        console.log('📧 Contact form initialized');
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
            this.showMessage('Please fill in all fields', 'error');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return false;
        }
        
        return true;
    }
    
    async submitForm(data) {
        try {
            console.log('Form submitted:', data);
            
            this.showMessage('Thank you! We will contact you soon.', 'success');
            this.form.reset();
        } catch (error) {
            this.showMessage('Something went wrong. Please try again.', 'error');
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

// ============================================
// PARALLAX EFFECTS
// ============================================
class ParallaxEffects {
    constructor() {
        this.elements = Array.from(document.querySelectorAll('.amenities-parallax'));
        if (this.elements.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🌊 Parallax effects initialized');
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

// ============================================
// SMOOTH SCROLL
// ============================================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🎯 Smooth scroll initialized');
        
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

// ============================================
// PAGE LOADER
// ============================================
class PageLoader {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('⏳ Page loader initialized');
        
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            console.log('✅ Page fully loaded');
        });
    }
}

// ============================================
// ADD ANIMATION STYLES
// ============================================
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
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
        
        /* Ripple Animation for Amenities */
        @keyframes rippleAnimation {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        /* Icon Pulse Animation */
        @keyframes iconPulse {
            0%, 100% {
                transform: scale(1) rotate(0deg);
            }
            25% {
                transform: scale(1.15) rotate(-8deg);
            }
            75% {
                transform: scale(1.1) rotate(8deg);
            }
        }
        
        /* Shimmer Move Animation */
        @keyframes shimmerMove {
            0% {
                left: -100%;
            }
            100% {
                left: 100%;
            }
        }
        
        /* Feature Point Entrance Animation */
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
        
        .feature-point:nth-child(1) {
            transition-delay: 0.1s;
        }
        
        .feature-point:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .feature-point:nth-child(3) {
            transition-delay: 0.3s;
        }
        
        /* Stat Box Entrance Animation */
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
        
        /* Showcase Label Animation */
        .showcase-label {
            opacity: 0;
            transform: translateY(-20px) scale(0.9);
            transition: opacity 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55),
                        transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .showcase-label.label-animated {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        
        /* Showcase Title Animation */
        .showcase-title {
            opacity: 0;
            transform: translateY(20px);
            animation: titleFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            animation-delay: 0.2s;
        }
        
        @keyframes titleFadeIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Showcase Description Animation */
        .showcase-description {
            opacity: 0;
            transform: translateY(20px);
            animation: descFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            animation-delay: 0.4s;
        }
        
        @keyframes descFadeIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎨 Animation styles added');
}

// ============================================
// UTILITIES
// ============================================
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

// ============================================
// MAIN PARK CITY APP
// ============================================
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
            console.log('🏙️ Initializing Park City 3&4 Apartments...');
            console.log('═══════════════════════════════════════');
            
            // Add animation styles first
            addAnimationStyles();
            
            // Initialize Hero Components
            this.components.fixedHero = new FixedLuxuryHero();
            this.components.buttonInteractions = new ButtonInteractions();
            
            // Initialize Navigation
            this.components.navigation = new HeaderNavigation();
            
            // Initialize Scroll Animations
            this.components.scrollAnimations = new ScrollAnimations({
                threshold: 0.1
            });
            
            // Initialize About & Slideshow Components
            this.components.slideshow = new LuxurySlideshow();
            this.components.statCounter = new StatCounter();
            this.components.featurePoints = new FeaturePointsAnimator();
            this.components.showcaseLabel = new ShowcaseLabelAnimator();
            this.components.buildingShowcase = new BuildingShowcaseAnimator();
            
            // Initialize Premium Amenities
            this.components.premiumAmenities = new PremiumAmenitiesController();
            
            // Initialize FAQ Accordion
            const faqsContainer = document.querySelector('.faqs-container');
            if (faqsContainer) {
                this.components.faqAccordion = new FAQAccordion(faqsContainer);
            }
            
            // Initialize Contact Form
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                this.components.contactForm = new ContactForm(contactForm);
            }
            
            // Initialize Parallax Effects
            this.components.parallaxEffects = new ParallaxEffects();
            
            // Initialize Smooth Scroll
            this.components.smoothScroll = new SmoothScroll();
            
            // Initialize Page Loader
            this.components.pageLoader = new PageLoader();
            
            console.log('═══════════════════════════════════════');
            console.log('✅ All components initialized successfully!');
            console.log('📸 Slideshow: Auto-play enabled (5s intervals)');
            console.log('🎯 Animations: Scroll-triggered entrance effects');
            console.log('🎨 Interactive: Hover effects and magnetic animations');
            console.log('🗽 NYC-themed icons with smooth animations');
            console.log('🏙️ Park City 3&4 Apartments - Ready!');
            console.log('═══════════════════════════════════════');
            
        } catch (error) {
            console.error('❌ Error initializing components:', error);
        }
    }
}

// ============================================
// INITIALIZE APPLICATION
// ============================================
const parkCityApp = new ParkCityApp();

// Scroll to top on load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    console.log('🎬 Page loaded and scrolled to top');
});

console.log('🌟 Park City 3&4 Script loaded and ready');
