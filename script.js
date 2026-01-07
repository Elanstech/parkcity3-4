/**
 * PARK CITY 3&4 APARTMENTS
 * Ultra-Luxury Residential Website - FIXED Enhanced Edition
 * ES6 Class-Based Architecture with Advanced Animations
 */

// ==================== ENHANCED HERO SLIDESHOW CLASS ====================
class HeroSlideshow {
    constructor(container, options = {}) {
        this.container = container;
        this.slides = Array.from(container.querySelectorAll('.hero-slide'));
        this.dotsContainer = document.getElementById('heroDots');
        this.prevBtn = document.getElementById('prevSlide');
        this.nextBtn = document.getElementById('nextSlide');
        
        this.currentIndex = 0;
        this.autoplayInterval = options.autoplayInterval || 7000;
        this.autoplayTimer = null;
        
        // Check if required elements exist
        if (!this.dotsContainer) {
            console.error('❌ heroDots container not found');
            return;
        }
        if (!this.prevBtn || !this.nextBtn) {
            console.error('❌ Slideshow navigation buttons not found');
            return;
        }
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.bindEvents();
        this.startAutoplay();
        this.initKenBurnsEffect();
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('hero-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        this.dots = Array.from(this.dotsContainer.querySelectorAll('.hero-dot'));
    }
    
    bindEvents() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    goToSlide(index) {
        if (!this.slides || !this.dots) return;
        
        this.slides[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');
        
        this.currentIndex = index;
        
        this.slides[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
        
        // Ken Burns zoom effect with GSAP
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(this.slides[this.currentIndex], 
                {
                    scale: 1.15,
                    rotation: 0
                },
                {
                    scale: 1,
                    rotation: 0.5,
                    duration: 15,
                    ease: 'power1.inOut'
                }
            );
        }
        
        this.resetAutoplay();
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoplay() {
        this.autoplayTimer = setInterval(() => this.nextSlide(), this.autoplayInterval);
    }
    
    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }
    
    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
    
    initKenBurnsEffect() {
        // Initial Ken Burns effect on first slide
        if (typeof gsap !== 'undefined' && this.slides[0]) {
            gsap.fromTo(this.slides[0], 
                { scale: 1.15 },
                { scale: 1, duration: 15, ease: 'power1.inOut' }
            );
        }
    }
}

// ==================== MODERN NAVIGATION CLASS ====================
class HeaderNavigation {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.navToggle = document.getElementById('navToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.menuClose = document.getElementById('menuClose');
        this.navItems = document.querySelectorAll('.nav-item');
        this.menuLinks = document.querySelectorAll('.menu-link');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleScroll();
        this.setActiveLink();
        this.initMagneticEffects();
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close button
        if (this.menuClose) {
            this.menuClose.addEventListener('click', () => this.closeMobileMenu());
        }
        
        // Mobile menu links - close menu when clicked
        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.closeMobileMenu(), 300);
            });
        });
        
        // Scroll handler
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Close menu on background click
        this.mobileMenu.addEventListener('click', (e) => {
            if (e.target === this.mobileMenu) {
                this.closeMobileMenu();
            }
        });
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
        // Get current page filename
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Set active class on desktop nav
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
        
        // Highlight active page in mobile menu
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
        // Add magnetic effect to menu links
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
        
        // Magnetic effect for close button
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
        
        // Magnetic CTA button
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

// Initialize Navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HeaderNavigation();
    });
} else {
    new HeaderNavigation();
}

// ==================== SCROLL ANIMATIONS CLASS ====================
class ScrollAnimations {
    constructor(options = {}) {
        this.elements = Array.from(document.querySelectorAll('[data-animate]'));
        this.threshold = options.threshold || 0.1;
        this.observerOptions = {
            threshold: this.threshold,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }
    
    init() {
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

// ==================== FAQ ACCORDION CLASS ====================
class FAQAccordion {
    constructor(container) {
        this.container = container;
        this.items = Array.from(container.querySelectorAll('.faq-item'));
        
        this.init();
    }
    
    init() {
        this.items.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => this.toggleItem(item));
        });
    }
    
    toggleItem(item) {
        const isActive = item.classList.contains('active');
        
        // Close all items
        this.items.forEach(i => i.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

// ==================== CONTACT FORM CLASS ====================
class ContactForm {
    constructor(form) {
        this.form = form;
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
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
            // Simulate form submission
            console.log('Form submitted:', data);
            
            // Show success message
            this.showMessage('Thank you! We will contact you soon.', 'success');
            
            // Reset form
            this.form.reset();
        } catch (error) {
            this.showMessage('Something went wrong. Please try again.', 'error');
        }
    }
    
    showMessage(text, type) {
        // Remove existing messages
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const message = document.createElement('div');
        message.className = `form-message form-message-${type}`;
        message.textContent = text;
        
        // Style message
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
        
        // Append message
        this.form.appendChild(message);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-10px)';
            message.style.transition = 'all 0.4s ease';
            setTimeout(() => message.remove(), 400);
        }, 5000);
    }
}

// ==================== PARALLAX EFFECTS CLASS ====================
class ParallaxEffects {
    constructor() {
        this.elements = Array.from(document.querySelectorAll('.amenities-parallax'));
        this.parallaxLayers = document.querySelectorAll('.parallax-layer');
        this.init();
    }
    
    init() {
        if (this.elements.length > 0) {
            window.addEventListener('scroll', () => this.handleScroll());
        }
        
        if (this.parallaxLayers.length > 0) {
            this.initMouseParallax();
            this.initScrollParallax();
        }
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
    
    initMouseParallax() {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            this.parallaxLayers.forEach((layer) => {
                const speed = parseFloat(layer.dataset.speed) || 0.5;
                const x = (mouseX - 0.5) * 100 * speed;
                const y = (mouseY - 0.5) * 100 * speed;
                
                if (typeof gsap !== 'undefined') {
                    gsap.to(layer, {
                        x: x,
                        y: y,
                        duration: 1,
                        ease: 'power2.out'
                    });
                } else {
                    layer.style.transform = `translate(${x}px, ${y}px)`;
                }
            });
        });
    }
    
    initScrollParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (!hero) return;
            
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                this.parallaxLayers.forEach((layer) => {
                    const speed = parseFloat(layer.dataset.speed) || 0.5;
                    const yPos = -(scrolled * speed);
                    layer.style.transform = `translateY(${yPos}px)`;
                });
            }
        });
    }
}

// ==================== SMOOTH SCROLL CLASS ====================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Smooth scroll for all anchor links
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

// ==================== PAGE LOADER CLASS ====================
class PageLoader {
    constructor() {
        this.init();
    }
    
    init() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            this.animateCounters();
        });
    }
    
    animateCounters() {
        // Animate any counter elements if they exist
        const counters = document.querySelectorAll('[data-counter]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
}

// ==================== UTILITIES CLASS ====================
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

// ==================== FIXED ENHANCED HERO ANIMATIONS ====================

// CHECK LIBRARIES
function checkLibraries() {
    const libraries = {
        'GSAP': typeof gsap !== 'undefined',
        'SplitType': typeof SplitType !== 'undefined',
        'Typed': typeof Typed !== 'undefined',
        'ScrollReveal': typeof ScrollReveal !== 'undefined',
        'ParticlesJS': typeof particlesJS !== 'undefined'
    };
    
    console.log('📚 Library Status:', libraries);
    
    Object.entries(libraries).forEach(([name, loaded]) => {
        if (!loaded) {
            console.warn(`⚠️ ${name} not loaded`);
        }
    });
}

// PARTICLES.JS CONFIGURATION
function initParticles() {
    if (typeof particlesJS === 'undefined') {
        console.warn('⚠️ ParticlesJS not loaded, skipping particles');
        return;
    }
    
    try {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#d4a574', '#a67c52', '#c8996b']
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.5,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#d4a574',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
        
        console.log('✅ Particles initialized');
    } catch (error) {
        console.error('❌ Particles error:', error);
    }
}

// SPLIT TEXT ANIMATION WITH GSAP
function initSplitTextAnimation() {
    const heroTitle = document.getElementById('heroTitle');
    if (!heroTitle) {
        console.warn('⚠️ Hero title not found');
        return;
    }
    
    if (typeof SplitType === 'undefined' || typeof gsap === 'undefined') {
        console.warn('⚠️ SplitType or GSAP not loaded, skipping text split');
        return;
    }
    
    try {
        const titleLines = heroTitle.querySelectorAll('.title-line');
        
        titleLines.forEach((line, lineIndex) => {
            const split = new SplitType(line, { types: 'chars' });
            const chars = split.chars;
            
            if (chars && chars.length > 0) {
                gsap.fromTo(chars,
                    {
                        opacity: 0,
                        y: 100,
                        rotationX: -90,
                        scale: 0.8
                    },
                    {
                        opacity: 1,
                        y: 0,
                        rotationX: 0,
                        scale: 1,
                        duration: 1,
                        stagger: 0.03,
                        delay: 0.5 + (lineIndex * 0.3),
                        ease: 'back.out(1.7)'
                    }
                );
            }
        });
        
        console.log('✅ Split text animation initialized');
    } catch (error) {
        console.error('❌ Split text error:', error);
    }
}

// FIXED TYPED.JS FOR SUBTITLE
function initTypedText() {
    const typedElement = document.getElementById('typedText');
    if (!typedElement) {
        console.warn('⚠️ Typed element not found');
        return;
    }
    
    if (typeof Typed === 'undefined') {
        console.warn('⚠️ Typed.js not loaded, using fallback text');
        typedElement.textContent = 'Experience luxury living where security, comfort, and convenience unite';
        return;
    }
    
    try {
        new Typed('#typedText', {
            strings: [
                'Experience luxury living where security, comfort, and convenience unite',
                'Your perfect home awaits in our premium community',
                '24/7 security with world-class amenities at your doorstep'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            startDelay: 1500,
            loop: true,
            showCursor: false
        });
        
        console.log('✅ Typed.js initialized');
    } catch (error) {
        console.error('❌ Typed.js error:', error);
        typedElement.textContent = 'Experience luxury living where security, comfort, and convenience unite';
    }
}

// FIXED ANIMATED STATS COUNTER
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) {
        console.warn('⚠️ No stat numbers found');
        return;
    }
    
    try {
        const animateCounter = (element) => {
            const target = parseInt(element.dataset.target);
            if (isNaN(target)) {
                console.warn('⚠️ Invalid target for stat:', element);
                return;
            }
            
            // Reset to 0 first
            element.textContent = '0';
            
            if (typeof gsap !== 'undefined') {
                gsap.to(element, {
                    textContent: target,
                    duration: 2.5,
                    delay: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    onUpdate: function() {
                        element.textContent = Math.ceil(parseFloat(element.textContent));
                    }
                });
            } else {
                // Fallback without GSAP
                let current = 0;
                const increment = target / 75;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = target;
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.ceil(current);
                    }
                }, 33);
            }
        };
        
        // Trigger animation after delay
        setTimeout(() => {
            statNumbers.forEach(animateCounter);
            console.log('✅ Stats counter animation started');
        }, 2000);
        
    } catch (error) {
        console.error('❌ Stats counter error:', error);
    }
}

// MAGNETIC BUTTON EFFECT
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    if (magneticBtns.length === 0) {
        console.warn('⚠️ No magnetic buttons found');
        return;
    }
    
    try {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                if (typeof gsap !== 'undefined') {
                    gsap.to(btn, {
                        x: x * 0.3,
                        y: y * 0.3,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                } else {
                    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                }
            });
            
            btn.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(btn, {
                        x: 0,
                        y: 0,
                        duration: 0.6,
                        ease: 'elastic.out(1, 0.5)'
                    });
                } else {
                    btn.style.transform = 'translate(0, 0)';
                }
            });
        });
        
        console.log('✅ Magnetic buttons initialized:', magneticBtns.length);
    } catch (error) {
        console.error('❌ Magnetic buttons error:', error);
    }
}

// SCROLL REVEAL ANIMATIONS
function initScrollReveal() {
    if (typeof ScrollReveal === 'undefined') {
        console.warn('⚠️ ScrollReveal not loaded, skipping scroll animations');
        return;
    }
    
    try {
        const sr = ScrollReveal({
            origin: 'bottom',
            distance: '60px',
            duration: 1000,
            delay: 200,
            easing: 'cubic-bezier(0.5, 0, 0, 1)',
            reset: false
        });
        
        sr.reveal('.hero-label', { delay: 200, origin: 'top', distance: '30px' });
        sr.reveal('.hero-cta', { delay: 1800, origin: 'bottom', distance: '40px' });
        sr.reveal('.hero-stats', { delay: 2000, origin: 'bottom', distance: '50px' });
        sr.reveal('.hero-controls', { delay: 2200, origin: 'bottom', distance: '30px' });
        sr.reveal('.scroll-indicator', { delay: 2400, origin: 'bottom', distance: '20px' });
        
        console.log('✅ ScrollReveal initialized');
    } catch (error) {
        console.error('❌ ScrollReveal error:', error);
    }
}

// FLOATING SHAPES ANIMATION
function initFloatingShapes() {
    const shapes = document.querySelectorAll('.floating-shape');
    
    if (shapes.length === 0) {
        console.warn('⚠️ No floating shapes found');
        return;
    }
    
    if (typeof gsap === 'undefined') {
        console.warn('⚠️ GSAP not loaded, skipping floating shapes');
        return;
    }
    
    try {
        shapes.forEach((shape, index) => {
            const duration = 15 + (index * 3);
            const delay = index * 2;
            
            gsap.to(shape, {
                x: 'random(-100, 100)',
                y: 'random(-80, 80)',
                rotation: 'random(-15, 15)',
                scale: 'random(0.9, 1.1)',
                duration: duration,
                delay: delay,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
            
            const shapeInner = shape.querySelector('.shape-inner');
            if (shapeInner) {
                gsap.to(shapeInner, {
                    rotation: 360,
                    duration: 20 + (index * 5),
                    ease: 'none',
                    repeat: -1
                });
            }
        });
        
        console.log('✅ Floating shapes initialized:', shapes.length);
    } catch (error) {
        console.error('❌ Floating shapes error:', error);
    }
}

// GRADIENT MESH ANIMATION
function initGradientMesh() {
    if (typeof gsap === 'undefined') {
        console.warn('⚠️ GSAP not loaded, skipping gradient mesh');
        return;
    }
    
    try {
        const gradientMesh = document.querySelector('.hero-gradient-mesh');
        if (gradientMesh) {
            gsap.to(gradientMesh, {
                opacity: 0.3,
                duration: 3,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut'
            });
            
            console.log('✅ Gradient mesh initialized');
        }
    } catch (error) {
        console.error('❌ Gradient mesh error:', error);
    }
}

// ==================== APP INITIALIZATION CLASS ====================
class ParkCityApp {
    constructor() {
        this.components = {};
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            console.log('🏙️ DOM Loaded - Initializing hero animations...');
            
            // Check libraries first
            checkLibraries();
            
            // Initialize Enhanced Hero Animations First
            this.initHeroEnhancements();
            
            // Initialize Hero Slideshow
            const heroSlideshow = document.getElementById('heroSlideshow');
            if (heroSlideshow) {
                this.components.heroSlideshow = new HeroSlideshow(heroSlideshow, {
                    autoplayInterval: 7000
                });
                console.log('✅ Hero slideshow initialized');
            } else {
                console.warn('⚠️ Hero slideshow container not found');
            }
            
            // Initialize Navigation
            const nav = document.getElementById('mainNav');
            if (nav) {
                this.components.navigation = new HeaderNavigation(nav);
            }
            
            // Initialize Scroll Animations
            this.components.scrollAnimations = new ScrollAnimations({
                threshold: 0.1
            });
            
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
            
            console.log('✨ All hero animations initialized!');
            console.log('🏙️ Park City 3&4 Apartments - All systems initialized with enhanced animations!');
            
        } catch (error) {
            console.error('Error initializing components:', error);
        }
    }
    
    initHeroEnhancements() {
        // Initialize all enhanced hero features
        initParticles();
        initSplitTextAnimation();
        initTypedText();
        initStatsCounter();
        initMagneticButtons();
        initScrollReveal();
        initFloatingShapes();
        initGradientMesh();
    }
}

// ==================== INITIALIZE APPLICATION ====================
const app = new ParkCityApp();

// Scroll to top on load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    console.log('🎬 Page loaded and scrolled to top');
});
