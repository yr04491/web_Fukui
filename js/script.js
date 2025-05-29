// ========================================
// DOM Content Loaded Event
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeScrollAnimation();
    initializeButtonEffects();
});

// ========================================
// Navigation Functions
// ========================================
function initializeNavigation() {
    const navSections = document.querySelectorAll('.nav-section');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Add click event listeners to navigation items
    navSections.forEach((navSection, index) => {
        const navTitle = navSection.querySelector('.nav-title');
        const navMenuItems = navSection.querySelectorAll('.nav-menu-item');
        
        // Navigation title click
        navTitle.addEventListener('click', function() {
            setActiveNavSection(index);
            scrollToSection(index);
        });
        
        // Navigation menu item clicks
        navMenuItems.forEach((menuItem, menuIndex) => {
            menuItem.addEventListener('click', function() {
                setActiveNavSection(index);
                scrollToSection(index);
                // You can add specific menu item actions here
                console.log(`Clicked menu item ${menuIndex} in section ${index}`);
            });
        });
    });
}

function setActiveNavSection(activeIndex) {
    const navTitles = document.querySelectorAll('.nav-title');
    
    // Remove active class from all nav titles
    navTitles.forEach(title => title.classList.remove('active'));
    
    // Add active class to clicked nav title
    if (navTitles[activeIndex]) {
        navTitles[activeIndex].classList.add('active');
    }
}

function scrollToSection(sectionIndex) {
    const contentSections = document.querySelectorAll('.content-section');
    if (contentSections[sectionIndex]) {
        contentSections[sectionIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ========================================
// Smooth Scrolling Functions
// ========================================
function initializeSmoothScrolling() {
    // Smooth scrolling for all internal links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// Scroll Animation Functions
// ========================================
function initializeScrollAnimation() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                updateActiveNavigation(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all content sections
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        observer.observe(section);
    });
}

function updateActiveNavigation(activeSection) {
    // Update navigation based on visible section
    const sectionClasses = activeSection.classList;
    let sectionIndex = -1;
    
    if (sectionClasses.contains('section-00')) sectionIndex = 0;
    else if (sectionClasses.contains('section-01')) sectionIndex = 1;
    else if (sectionClasses.contains('section-02')) sectionIndex = 2;
    
    if (sectionIndex >= 0) {
        setActiveNavSection(sectionIndex);
    }
}

// ========================================
// Button Effects Functions
// ========================================
function initializeButtonEffects() {
    // Add click effects to all buttons
    const buttons = document.querySelectorAll('.btn-project, .section-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            createRippleEffect(e, this);
        });
        
        // Add hover sound effect (optional)
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ========================================
// Utility Functions
// ========================================
function debounce(func, wait) {
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

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========================================
// Color Navigation Effects
// ========================================
function initializeColorNavigation() {
    const colorBars = document.querySelectorAll('.color-bar');
    
    colorBars.forEach((bar, index) => {
        bar.addEventListener('click', function() {
            scrollToSection(index);
        });
        
        // Add hover effects
        bar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.cursor = 'pointer';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// ========================================
// Keyboard Navigation
// ========================================
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowDown':
                if (e.ctrlKey) {
                    e.preventDefault();
                    navigateToNextSection();
                }
                break;
            case 'ArrowUp':
                if (e.ctrlKey) {
                    e.preventDefault();
                    navigateToPreviousSection();
                }
                break;
            case 'Home':
                if (e.ctrlKey) {
                    e.preventDefault();
                    scrollToTop();
                }
                break;
        }
    });
}

function navigateToNextSection() {
    const currentActive = document.querySelector('.nav-title.active');
    if (currentActive) {
        const navSections = Array.from(document.querySelectorAll('.nav-title'));
        const currentIndex = navSections.indexOf(currentActive);
        const nextIndex = (currentIndex + 1) % navSections.length;
        
        setActiveNavSection(nextIndex);
        scrollToSection(nextIndex);
    }
}

function navigateToPreviousSection() {
    const currentActive = document.querySelector('.nav-title.active');
    if (currentActive) {
        const navSections = Array.from(document.querySelectorAll('.nav-title'));
        const currentIndex = navSections.indexOf(currentActive);
        const prevIndex = currentIndex === 0 ? navSections.length - 1 : currentIndex - 1;
        
        setActiveNavSection(prevIndex);
        scrollToSection(prevIndex);
    }
}

// ========================================
// Performance Optimization
// ========================================
function optimizePerformance() {
    // Lazy load images (if any are added later)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// Accessibility Enhancements
// ========================================
function initializeAccessibility() {
    // Add ARIA labels
    const navItems = document.querySelectorAll('.nav-menu-item');
    navItems.forEach((item, index) => {
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `Navigation menu item ${index + 1}`);
    });
    
    // Add keyboard support for menu items
    navItems.forEach(item => {
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ========================================
// CSS Animations Keyframes (JavaScript version)
// ========================================
function addCSSAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes slideInFromRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .animate-in {
            animation: slideInFromRight 0.6s ease-out;
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        .pulse {
            animation: pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// Initialize All Functions
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initializeNavigation();
    initializeSmoothScrolling();
    initializeScrollAnimation();
    initializeButtonEffects();
    initializeColorNavigation();
    initializeKeyboardNavigation();
    initializeAccessibility();
    addCSSAnimations();
    optimizePerformance();
    
    // Console log for debugging
    console.log('ぼくらのみち website initialized successfully!');
});

// ========================================
// Error Handling
// ========================================
window.addEventListener('error', function(e) {
    console.error('JavaScript error occurred:', e.error);
});

// ========================================
// Export functions for potential module use
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        scrollToSection,
        setActiveNavSection,
        createRippleEffect,
        scrollToTop
    };
}