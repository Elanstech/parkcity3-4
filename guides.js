/**
 * ═══════════════════════════════════════════════════════════════
 *                    BUILDING GUIDES PAGE
 *               Animations & Interactions Controller
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// 🎬 SCROLL ANIMATIONS CONTROLLER
// ═══════════════════════════════════════════════════════════════

class GuidesScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('[data-animate]');
        this.guideHeaders = document.querySelectorAll('.guide-header');
        this.guideCards = document.querySelectorAll('.guide-card');
        
        if (this.animatedElements.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🎬 Guides Scroll Animations: Initializing...');
        
        this.setupIntersectionObserver();
        // Card tilt effect removed
        
        console.log('✅ Scroll Animations: Ready');
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -80px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Observe all animated elements
        this.animatedElements.forEach(el => observer.observe(el));
        this.guideHeaders.forEach(el => observer.observe(el));
    }
}

// ═══════════════════════════════════════════════════════════════
// 🔗 SMOOTH SCROLL FOR QUICK NAV
// ═══════════════════════════════════════════════════════════════

class QuickNavController {
    constructor() {
        this.quickNavItems = document.querySelectorAll('.quick-nav-item');
        
        if (this.quickNavItems.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🔗 Quick Nav: Initializing...');
        
        this.quickNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        console.log('✅ Quick Nav: Ready');
    }
}

// ═══════════════════════════════════════════════════════════════
// ✨ HERO PARALLAX EFFECT
// ═══════════════════════════════════════════════════════════════

class HeroParallaxEffect {
    constructor() {
        this.hero = document.querySelector('.guides-hero');
        this.gradient1 = document.querySelector('.hero-gradient-1');
        this.gradient2 = document.querySelector('.hero-gradient-2');
        
        if (this.hero && window.innerWidth > 768) {
            this.init();
        }
    }
    
    init() {
        console.log('✨ Hero Parallax: Initializing...');
        
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
        
        console.log('✅ Hero Parallax: Ready');
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        const heroHeight = this.hero.offsetHeight;
        
        if (scrollY < heroHeight) {
            const parallaxAmount = scrollY * 0.3;
            
            if (this.gradient1) {
                this.gradient1.style.transform = `translate(${-parallaxAmount * 0.5}px, ${parallaxAmount}px)`;
            }
            
            if (this.gradient2) {
                this.gradient2.style.transform = `translate(${parallaxAmount * 0.3}px, ${-parallaxAmount * 0.5}px)`;
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 📋 COPY TO CLIPBOARD FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════

class CopyToClipboard {
    constructor() {
        this.copyTriggers = document.querySelectorAll('[data-copy]');
        
        if (this.copyTriggers.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.copyTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const textToCopy = trigger.getAttribute('data-copy');
                this.copyText(textToCopy, trigger);
            });
        });
    }
    
    async copyText(text, element) {
        try {
            await navigator.clipboard.writeText(text);
            this.showFeedback(element, 'Copied!');
        } catch (err) {
            console.error('Failed to copy:', err);
            this.showFeedback(element, 'Failed');
        }
    }
    
    showFeedback(element, message) {
        const feedback = document.createElement('span');
        feedback.className = 'copy-feedback';
        feedback.textContent = message;
        feedback.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            padding: 6px 12px;
            background: #2d2520;
            color: white;
            font-size: 0.75rem;
            font-weight: 600;
            border-radius: 6px;
            opacity: 0;
            animation: feedbackPop 1.5s ease forwards;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 1500);
    }
}

// Add feedback animation
const feedbackStyle = document.createElement('style');
feedbackStyle.textContent = `
    @keyframes feedbackPop {
        0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
        20% { opacity: 1; transform: translateX(-50%) translateY(0); }
        80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
`;
document.head.appendChild(feedbackStyle);

// ═══════════════════════════════════════════════════════════════
// 🎯 STEP COUNTER ANIMATION
// ═══════════════════════════════════════════════════════════════

class StepCounterAnimation {
    constructor() {
        this.stepCards = document.querySelectorAll('.steps-card');
        
        if (this.stepCards.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🎯 Step Counter: Initializing...');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSteps(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        this.stepCards.forEach(card => observer.observe(card));
    }
    
    animateSteps(card) {
        const steps = card.querySelectorAll('.step');
        
        steps.forEach((step, index) => {
            setTimeout(() => {
                step.style.opacity = '0';
                step.style.transform = 'translateX(-30px)';
                
                requestAnimationFrame(() => {
                    step.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                    step.style.opacity = '1';
                    step.style.transform = 'translateX(0)';
                });
            }, index * 150);
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 📊 COVERAGE TABLE HIGHLIGHT
// ═══════════════════════════════════════════════════════════════

class CoverageTableInteraction {
    constructor() {
        this.coverageRows = document.querySelectorAll('.coverage-row');
        
        if (this.coverageRows.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.coverageRows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                this.coverageRows.forEach(r => {
                    if (r !== row) {
                        r.style.opacity = '0.5';
                    }
                });
            });
            
            row.addEventListener('mouseleave', () => {
                this.coverageRows.forEach(r => {
                    r.style.opacity = '1';
                });
            });
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 🔝 BACK TO TOP FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════

class BackToTopController {
    constructor() {
        this.backToTop = document.getElementById('backToTop');
        
        if (this.backToTop) {
            this.init();
        }
    }
    
    init() {
        this.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 🏠 NAVIGATION CONTROLLER (Same as main script)
// ═══════════════════════════════════════════════════════════════

class GuidesNavigation {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.navToggle = document.getElementById('navToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.menuClose = document.getElementById('menuClose');
        this.isMenuOpen = false;
        
        if (this.nav) {
            this.init();
        }
    }
    
    init() {
        console.log('🧭 Navigation: Initialized');
        
        this.bindEvents();
        this.handleScroll();
    }
    
    bindEvents() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        if (this.menuClose) {
            this.menuClose.addEventListener('click', () => this.closeMobileMenu());
        }
        
        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.closeMobileMenu(), 300);
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
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
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.mobileMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        
        setTimeout(() => {
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
}

// ═══════════════════════════════════════════════════════════════
// 🚀 INITIALIZE ALL COMPONENTS
// ═══════════════════════════════════════════════════════════════

class BuildingGuidesApp {
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
            console.log('✨              BUILDING GUIDES PAGE                          ✨');
            console.log('         Premium Sleek Design - All Features Active');
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('');
            
            // Initialize all components
            this.components.navigation = new GuidesNavigation();
            this.components.scrollAnimations = new GuidesScrollAnimations();
            this.components.quickNav = new QuickNavController();
            this.components.heroParallax = new HeroParallaxEffect();
            this.components.copyToClipboard = new CopyToClipboard();
            this.components.stepCounter = new StepCounterAnimation();
            this.components.magneticButtons = new MagneticButtons();
            this.components.coverageTable = new CoverageTableInteraction();
            this.components.backToTop = new BackToTopController();
            
            console.log('');
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('✅ ALL COMPONENTS: Initialized successfully!');
            console.log('🎬 Scroll Animations: Active');
            console.log('✨ Hero Parallax: Active');
            console.log('💫 Magnetic Buttons: Active');
            console.log('🔗 Quick Navigation: Active');
            console.log('═══════════════════════════════════════════════════════════════');
            console.log('');
            
        } catch (error) {
            console.error('❌ Error initializing:', error);
        }
    }
}

// Initialize the application
const buildingGuidesApp = new BuildingGuidesApp();

// Scroll to top on page load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

console.log('🏢 Building Guides Script: Loaded');
