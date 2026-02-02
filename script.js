// ===================================
// PORTFOLIO KILIAN - INTERACTIVE SCRIPTS
// ===================================

// ===== CUSTOM CURSOR =====
let cursor = document.getElementById('cursorDot');

// Create cursor element if it doesn't exist
if (!cursor) {
    cursor = document.createElement('div');
    cursor.className = 'cursor-dot';
    cursor.id = 'cursorDot';
    document.body.appendChild(cursor);
}

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth cursor movement with interpolation
function animateCursor() {
    if (!cursor) return;
    
    // Smooth follow effect
    const speed = 0.15;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}

// Only initialize cursor on desktop
if (window.innerWidth > 768 && cursor) {
    animateCursor();
    cursor.classList.add('active');
}

// Scale cursor on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-tag');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
    });
});

// ===== NAVIGATION =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#" (return to top handled differently)
        if (href === '#' || href === '#accueil') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active nav link highlighting
const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
};

// Add active state styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--color-accent-primary);
    }
`;
document.head.appendChild(style);

// ===== SCROLL ANIMATIONS =====
// Intersection Observer for scroll-triggered reveal (appear on scroll down, disappear on scroll up)
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
            el.classList.add('is-visible');
        } else {
            el.classList.remove('is-visible');
        }
    });
}, observerOptions);

// Observe sections and key blocks
function initScrollReveal() {
    const revealTargets = document.querySelectorAll(
        '.section, section.project-header, .project-card, .skill-category, .timeline-item, .hobby-card, .hobby-item, .project-detail-section, .mission-card, .tech-item, .video-container, .project-video'
    );

    revealTargets.forEach(el => {
        el.classList.add('scroll-reveal');
        revealObserver.observe(el);
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
    initScrollReveal();
}

// ===== SCROLL EFFECTS =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Update active nav link
    updateActiveNavLink();
    
    // Navbar background on scroll
    if (currentScroll > 50) {
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
    }
    
    lastScroll = currentScroll;
});

// Initial call
updateActiveNavLink();

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Slow down background video playback if present
    const bgVideo = document.querySelector('.background-video video');
    if (bgVideo) {
        bgVideo.playbackRate = 0.5;
    }
});

// ===== TYPING EFFECT FOR TERMINAL PROMPTS =====
// Add subtle glitch effect to certain elements
function addGlitchEffect() {
    const glitchElements = document.querySelectorAll('.hero-title-outline, .section-number');
    
    glitchElements.forEach(el => {
        setInterval(() => {
            if (Math.random() > 0.95) { // 5% chance
                el.style.opacity = '0.8';
                setTimeout(() => {
                    el.style.opacity = '1';
                }, 50);
            }
        }, 3000);
    });
}

// Initialize glitch effect
setTimeout(addGlitchEffect, 2000);

// ===== TECH TAG ANIMATIONS =====
// Add staggered hover effects to tech tags
const techTags = document.querySelectorAll('.tech-tag, .skill-tag');
techTags.forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.05}s`;
});

// ===== PROJECT CARDS INTERACTIVE =====
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Disable animations on mobile for better performance
if (window.innerWidth <= 768) {
    document.body.style.cursor = 'default';
}

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Disable parallax
    window.removeEventListener('scroll', updateParallax);
}

// ===== CONSOLE MESSAGE =====
console.log('%c[ KILIAN ]', 'color: #9342d4; font-size: 24px; font-weight: bold; font-family: monospace;');
console.log('%c> Développeur Web', 'color: #00d9ff; font-size: 14px; font-family: monospace;');
console.log('%c> Portfolio 2026', 'color: #a0a0a0; font-size: 14px; font-family: monospace;');
console.log('%c> Contact: kilian.dach@proton.me', 'color: #606060; font-size: 12px; font-family: monospace;');

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Easter egg activated!
            document.body.style.animation = 'rainbow 2s infinite';
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            console.log('%c🎮 KONAMI CODE ACTIVATED! 🎮', 'color: #ff0080; font-size: 20px; font-weight: bold;');
            
            // Reset after 5 seconds
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
            
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// ===== INITIALIZE =====
// Add loaded class to body when everything is ready
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Refresh scroll animations on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reinitialize animations if needed
        initAnimations();
    }, 250);
});
