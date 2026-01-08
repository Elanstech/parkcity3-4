/**
 * PARK CITY 3&4 APARTMENTS
 * Complete JavaScript with Luxury Hero Section
 * ES6 Class-Based Architecture
 */

// ==================== LUXURY HERO SECTION CONTROLLER ====================
class LuxuryHeroController {
    constructor() {
        this.hero = document.querySelector('.luxury-hero');
        this.parallaxLayers = document.querySelectorAll('.parallax-image-layer');
        this.navButtons = document.querySelectorAll('.image-nav-btn');
        this.scrollIndicator = document.querySelector('.luxury-scroll-indicator');
        
        this.currentLayer = 1; // Start with middle layer
        this.isTransitioning = false;
        
        if (this.hero) {
            this.init();
        }
    }
    
    init() {
        // Set initial active layer
        this.setActiveLayer(this.currentLayer);
        
        // Bind events
        this.bindParallaxScroll();
        this.bindImageNavigation();
        this.bindScrollIndicator();
        this.initAOSAnimations();
        
        // Optional: Auto-cycle through images
        // Uncomment the line below to enable auto-cycling every 5 seconds
        // this.startAutoCycle(5000);
        
        console.log('✨ Luxury Hero initialized');
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
        
        // Only apply parallax within hero section
        if (scrolled < heroHeight) {
            this.parallaxLayers.forEach((layer) => {
                const speed = parseFloat(layer.dataset.speed) || 0.5;
                const yPos = -(scrolled * speed);
                layer.style.transform = `translateY(${yPos}px)`;
            });
        }
    }
    
    // Image navigation
    bindImageNavigation() {
        this.navButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (!this.isTransitioning && this.currentLayer !== index) {
                    this.switchLayer(index);
                }
            });
        });
    }
    
    switchLayer(layerIndex) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentLayer = layerIndex;
        
        // Update active layer
        this.setActiveLayer(layerIndex);
        
        // Update navigation buttons
        this.navButtons.forEach((btn, index) => {
            if (index === layerIndex) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Allow next transition after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 1500);
    }
    
    setActiveLayer(layerIndex) {
        this.parallaxLayers.forEach((layer, index) => {
            if (index === layerIndex) {
                layer.classList.add('active');
            } else {
                layer.classList.remove('active');
            }
        });
    }
    
    // Scroll indicator
    bindScrollIndicator() {
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                const nextSection = document.querySelector('.highlights') || 
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
    
    // Auto-cycle through images (optional feature)
    startAutoCycle(interval = 5000) {
        setInterval(() => {
            if (!this.isTransitioning) {
                const nextLayer = (this.currentLayer + 1) % this.parallaxLayers.length;
                this.switchLayer(nextLayer);
            }
        }, interval);
    }
    
    // Simple AOS-style animations
    initAOSAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all elements with data-aos
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }
}

// ==================== MOUSE PARALLAX EFFECT ====================
class MouseParallaxEffect {
    constructor() {
        this.hero = document.querySelector('.luxury-hero');
        this.content = document.querySelector('.luxury-content-wrapper');
        
        if (this.hero && window.innerWidth > 968) {
            this.init();
        }
    }
    
    init() {
        this.hero.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
    }
    
    handleMouseMove(e) {
        const rect = this.hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        // Subtle movement for content
        const moveX = (x - 0.5) * 20;
        const moveY = (y - 0.5) * 20;
        
        if (this.content) {
            this.content.style.transform = `translate(${moveX}px, ${moveY}px)`;
            this.content.style.transition = 'transform 0.3s ease-out';
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
            
            // Initialize Luxury Hero Section
            this.components.luxuryHero = new LuxuryHeroController();
            this.components.mouseParallax = new MouseParallaxEffect();
            
            // Initialize Navigation
            this.components.navigation = new HeaderNavigation();
            
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
            
            console.log('✅ All components initialized successfully!');
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
