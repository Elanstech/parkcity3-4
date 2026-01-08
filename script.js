/**
 * PARK CITY 3&4 APARTMENTS
 * Complete Final JavaScript - All Components Integrated
 * ES6 Class-Based Architecture
 */

// ==================== FIXED LUXURY HERO CONTROLLER ====================
class FixedLuxuryHero {
    constructor() {
        this.hero = document.querySelector('.luxury-hero');
        this.parallaxLayers = document.querySelectorAll('.parallax-image-layer');
        this.progressItems = document.querySelectorAll('.progress-item');
        this.scrollIndicator = document.querySelector('.luxury-scroll-indicator');
        
        this.currentIndex = 0;
        this.totalImages = this.parallaxLayers.length;
        this.autoSwitchInterval = 5000; // 5 seconds
        this.autoSwitchTimer = null;
        this.isTransitioning = false;
        
        if (this.hero && this.parallaxLayers.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('✨ Fixed Luxury Hero initialized');
        console.log(`📸 Found ${this.totalImages} images`);
        
        // Set initial active layer
        this.setActiveLayer(0);
        this.updateProgress(0);
        
        // Bind events
        this.bindParallaxScroll();
        this.bindProgressClicks();
        this.bindScrollIndicator();
        
        // Start auto-switching after a short delay
        setTimeout(() => {
            console.log('🔄 Starting auto-switch...');
            this.startAutoSwitch();
        }, 1000);
        
        // Pause auto-switch on hover
        this.bindHoverPause();
    }
    
    // Auto-switch images every 5 seconds
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
    
    // Pause auto-switch when hovering over hero
    bindHoverPause() {
        this.hero.addEventListener('mouseenter', () => {
            this.stopAutoSwitch();
        });
        
        this.hero.addEventListener('mouseleave', () => {
            this.startAutoSwitch();
        });
    }
    
    // Switch to specific image with animation
    switchToImage(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        
        console.log(`🎬 Switching to image ${index}`);
        this.isTransitioning = true;
        
        // Update layers
        this.setActiveLayer(index);
        
        // Update progress indicators
        this.updateProgress(index);
        
        // Update current index
        this.currentIndex = index;
        
        // Allow next transition after animation
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
                // Restart progress fill animation
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
    
    // Manual click on progress indicators
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
    
    // Parallax scroll effect
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
    
    // Scroll indicator
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

// ==================== BUTTON INTERACTIONS ====================
class ButtonInteractions {
    constructor() {
        this.buttons = document.querySelectorAll('.luxury-btn');
        this.init();
    }
    
    init() {
        this.buttons.forEach(button => {
            // Simple hover effect (no magnetic pull that moves text)
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
            
            // Click ripple effect
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

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
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
`;
document.head.appendChild(rippleStyle);

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
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener('click', (e) => {
                if (e.target === this.mobileMenu) {
                    this.closeMobileMenu();
                }
            });
        }
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

// ==================== PREMIUM AMENITIES CONTROLLER ====================
class PremiumAmenitiesController {
    constructor() {
        this.bentoItems = document.querySelectorAll('.bento-item');
        this.statBoxes = document.querySelectorAll('.stat-box');
        this.featurePoints = document.querySelectorAll('.feature-point');
        
        if (this.bentoItems.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('✨ Premium Amenities Controller initialized');
        
        // Add magnetic hover effects
        this.initMagneticEffects();
        
        // Add parallax scroll effects
        this.initParallaxEffects();
        
        // Add stat counter animations
        this.initStatCounters();
        
        // Add bento item interactions
        this.initBentoInteractions();
    }
    
    // Magnetic hover effect for bento items
    initMagneticEffects() {
        this.bentoItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Apply subtle magnetic pull
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
    
    // Parallax scroll effects
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
        
        // Parallax for building features
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
    
    // Animated stat counters
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
        const increment = number / 60; // 60 frames for smooth animation
        const duration = 1500; // 1.5 seconds
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
    
    // Bento item interactions
    initBentoInteractions() {
        this.bentoItems.forEach(item => {
            // Add ripple effect on click
            item.addEventListener('click', (e) => {
                this.createRipple(e, item);
            });
            
            // Add 3D tilt effect on hover
            item.addEventListener('mousemove', (e) => {
                if (window.innerWidth > 968) { // Only on desktop
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

// Add ripple animation style for amenities
const amenitiesRippleStyle = document.createElement('style');
amenitiesRippleStyle.textContent = `
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
`;
document.head.appendChild(amenitiesRippleStyle);

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
        this.init();
    }
    
    init() {
        if (this.elements.length > 0) {
            window.addEventListener('scroll', () => this.handleScroll());
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
            console.log('🏙️ Initializing Park City 3&4 Apartments...');
            
            // Initialize Fixed Luxury Hero Components
            this.components.fixedHero = new FixedLuxuryHero();
            this.components.buttonInteractions = new ButtonInteractions();
            
            // Initialize Navigation
            this.components.navigation = new HeaderNavigation();
            
            // Initialize Scroll Animations
            this.components.scrollAnimations = new ScrollAnimations({
                threshold: 0.1
            });
            
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
            
            console.log('✅ All components initialized successfully!');
            console.log('🎨 Auto-switch enabled: Images change every 5 seconds');
            console.log('🗽 NYC-themed icons with smooth animations');
            console.log('✨ Premium Amenities with interactive bento grid');
            console.log('🏙️ Park City 3&4 Apartments - Ready!');
            
        } catch (error) {
            console.error('❌ Error initializing components:', error);
        }
    }
}

// ==================== INITIALIZE APPLICATION ====================
const app = new ParkCityApp();

// Scroll to top on load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    console.log('🎬 Page loaded and scrolled to top');
});
