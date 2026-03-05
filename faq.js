/**
 * FAQ Page Controller - Park City 3&4 Apartments
 */

class FAQPageController {
    constructor() {
        this.searchInput = document.getElementById('faqSearch');
        this.searchClear = document.getElementById('searchClear');
        this.searchResults = document.getElementById('searchResults');
        this.noResults = document.getElementById('noResults');
        this.categoryPills = document.querySelectorAll('.cat-pill');
        this.categoryGroups = document.querySelectorAll('.faq-category-group');
        this.accordionItems = document.querySelectorAll('.faq-accordion-item');
        this.activeFilter = 'all';
        
        this.init();
    }
    
    init() {
        console.log('❓ FAQ Page: Initializing...');
        this.bindAccordion();
        this.bindSearch();
        this.bindCategoryFilters();
        this.bindScrollAnimations();
        this.updateCategoryCounts();
        this.bindSmoothScroll();
        console.log('✅ FAQ Page: Ready');
    }
    
    // Accordion
    bindAccordion() {
        this.accordionItems.forEach(item => {
            const trigger = item.querySelector('.faq-trigger');
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all in same group
                const group = item.closest('.faq-items-list');
                group.querySelectorAll('.faq-accordion-item').forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        });
    }
    
    // Search
    bindSearch() {
        if (!this.searchInput) return;
        
        let debounce;
        this.searchInput.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(() => this.performSearch(), 200);
            this.searchClear.classList.toggle('visible', this.searchInput.value.length > 0);
        });
        
        this.searchClear.addEventListener('click', () => {
            this.searchInput.value = '';
            this.searchClear.classList.remove('visible');
            this.searchResults.textContent = '';
            this.clearSearch();
        });
    }
    
    performSearch() {
        const query = this.searchInput.value.trim().toLowerCase();
        
        if (!query) {
            this.clearSearch();
            this.searchResults.textContent = '';
            return;
        }
        
        const terms = query.split(/\s+/);
        let visibleCount = 0;
        
        this.accordionItems.forEach(item => {
            const text = item.querySelector('.trigger-text').textContent.toLowerCase();
            const keywords = (item.dataset.keywords || '').toLowerCase();
            const panelText = item.querySelector('.panel-content')?.textContent.toLowerCase() || '';
            const combined = text + ' ' + keywords + ' ' + panelText;
            
            const match = terms.every(t => combined.includes(t));
            item.classList.toggle('search-hidden', !match);
            if (match) visibleCount++;
        });
        
        // Show/hide category groups based on visible items
        this.categoryGroups.forEach(group => {
            const visibleItems = group.querySelectorAll('.faq-accordion-item:not(.search-hidden)');
            group.classList.toggle('hidden', visibleItems.length === 0);
        });
        
        this.searchResults.textContent = visibleCount === 0 
            ? '' 
            : `${visibleCount} result${visibleCount !== 1 ? 's' : ''} found`;
        
        this.noResults.classList.toggle('visible', visibleCount === 0);
        
        // Reset category pills
        this.categoryPills.forEach(p => p.classList.remove('active'));
        this.categoryPills[0].classList.add('active');
        this.activeFilter = 'all';
    }
    
    clearSearch() {
        this.accordionItems.forEach(item => item.classList.remove('search-hidden'));
        this.categoryGroups.forEach(group => group.classList.remove('hidden'));
        this.noResults.classList.remove('visible');
        this.applyFilter(this.activeFilter);
    }
    
    // Category Filters
    bindCategoryFilters() {
        this.categoryPills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Clear search when changing category
                if (this.searchInput.value) {
                    this.searchInput.value = '';
                    this.searchClear.classList.remove('visible');
                    this.searchResults.textContent = '';
                    this.accordionItems.forEach(item => item.classList.remove('search-hidden'));
                    this.noResults.classList.remove('visible');
                }
                
                this.categoryPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                
                this.activeFilter = pill.dataset.filter;
                this.applyFilter(this.activeFilter);
            });
        });
    }
    
    applyFilter(filter) {
        this.categoryGroups.forEach(group => {
            if (filter === 'all') {
                group.classList.remove('hidden');
            } else {
                group.classList.toggle('hidden', group.dataset.category !== filter);
            }
        });
    }
    
    // Category Counts
    updateCategoryCounts() {
        this.categoryGroups.forEach(group => {
            const count = group.querySelectorAll('.faq-accordion-item').length;
            const countEl = group.querySelector('.category-count');
            if (countEl) countEl.textContent = `${count} question${count !== 1 ? 's' : ''}`;
        });
    }
    
    // Scroll Animations
    bindScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    }
    
    // Smooth Scroll for anchor links
    bindSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
                }
            });
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new FAQPageController();
});
