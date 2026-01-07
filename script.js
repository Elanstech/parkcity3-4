/**
 * PARK CITY 3&4 APARTMENTS
 * Ultra-Luxury Residential Website
 * ES6 Class-Based Architecture
 */

// ==================== HERO SLIDESHOW CLASS ====================
class HeroSlideshow {
    constructor(container, options = {}) {
        this.container = container;
        this.slides = Array.from(container.querySelectorAll('.hero-slide'));
        this.dotsContainer = document.getElementById('heroDots');
        this.prevBtn = document.getElementById('prevSlide');
        this.nextBtn = document.getElementById('nextSlide');
        
        this.currentIndex = 0;
        this.autoplayInterval = options.autoplayInterval || 6000;
        this.autoplayTimer = null;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.bindEvents();
        this.startAutoplay();
    }
    
    createDots() {
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
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    goToSlide(index) {
        this.slides[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');
        
        this.currentIndex = index;
        
        this.slides[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
        
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
}

// ==================== NAVIGATION CLASS ====================
class Navigation {
    constructor(nav) {
        this.nav = nav;
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = Array.from(this.navMenu.querySelectorAll('.nav-link'));
        this.scrollThreshold = 100;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleScroll();
    }
    
    bindEvents() {
        // Toggle mobile menu
        this.navToggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking link
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    this.closeMenu();
                    this.scrollToSection(link.getAttribute('href'));
                }
            });
        });
        
        // Handle scroll
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Add scrolled class to nav
        if (scrollY > this.scrollThreshold) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
        
        // Update active link based on scroll position
        this.updateActiveLink();
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    scrollToSection(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
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
            backgroundColor: type === 'success' ? 'rgba(92, 141, 90, 0.2)' : 'rgba(220, 38, 38, 0.2)',
            border: type === 'success' ? '1px solid rgba(92, 141, 90, 0.4)' : '1px solid rgba(220, 38, 38, 0.4)',
            color: type === 'success' ? '#5c8d5a' : '#ef4444'
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
            // Initialize Hero Slideshow
            const heroSlideshow = document.getElementById('heroSlideshow');
            if (heroSlideshow) {
                this.components.heroSlideshow = new HeroSlideshow(heroSlideshow, {
                    autoplayInterval: 6000
                });
            }
            
            // Initialize Navigation
            const nav = document.getElementById('mainNav');
            if (nav) {
                this.components.navigation = new Navigation(nav);
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
            
            console.log('🏙️ Park City 3&4 Apartments - All systems initialized');
            
        } catch (error) {
            console.error('Error initializing components:', error);
        }
    }
}

// ==================== INITIALIZE APPLICATION ====================
const app = new ParkCityApp();
