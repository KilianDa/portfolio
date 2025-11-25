// Navigation mobile toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

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

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
// Optimized for both mobile and desktop
function checkMobileDevice() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Create observer with optimized options
const observerOptions = {
    threshold: checkMobileDevice() ? 0.05 : 0.15,
    rootMargin: checkMobileDevice() ? '0px' : '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Only animate if element is intersecting and hasn't been animated yet
        if (entry.isIntersecting && !entry.target.classList.contains('fade-in-up')) {
            // Use requestAnimationFrame for smoother animations
            requestAnimationFrame(() => {
                entry.target.classList.add('fade-in-up');
                // Immediately stop observing to prevent re-animation
                observer.unobserve(entry.target);
            });
        }
    });
}, observerOptions);

// Wait for DOM to be fully loaded before observing
function initAnimations() {
    const sections = document.querySelectorAll('.section, .project-card, .skill-category, .timeline-item');
    sections.forEach(section => {
        // Only observe if not already animated
        if (!section.classList.contains('fade-in-up')) {
            observer.observe(section);
        }
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}

// Active nav link highlighting
const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
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

window.addEventListener('scroll', updateActiveNavLink);
updateActiveNavLink(); // Initial call

// Add active state styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Subtle parallax effect on images only (not on sections to avoid layout issues)
// Disabled on mobile devices for better performance and UX
let ticking = false;
const imageParallaxState = new Map();

function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function updateParallax() {
    // Disable parallax on mobile devices
    if (isMobileDevice()) {
        const profileImg = document.querySelector('.profile-img');
        const aboutImg = document.querySelector('.about-img');
        if (profileImg) profileImg.style.transform = '';
        if (aboutImg) aboutImg.style.transform = '';
        ticking = false;
        return;
    }

    const scrolled = window.pageYOffset;
    const profileImg = document.querySelector('.profile-img');
    const aboutImg = document.querySelector('.about-img');
    
    // Parallax on hero image (very subtle, only when visible and not hovered)
    if (profileImg && !imageParallaxState.get(profileImg)) {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const heroTop = heroSection.offsetTop;
            const heroHeight = heroSection.offsetHeight;
            const heroBottom = heroTop + heroHeight;
            const windowHeight = window.innerHeight;
            
            // Only apply parallax when image is in viewport
            if (scrolled + windowHeight >= heroTop && scrolled <= heroBottom) {
                const parallaxValue = (scrolled - heroTop) * 0.08; // Very subtle
                profileImg.style.transform = `translateY(${parallaxValue}px)`;
            } else {
                profileImg.style.transform = 'translateY(0)';
            }
        }
    }
    
    // Parallax on about image (very subtle, only when visible and not hovered)
    if (aboutImg && !imageParallaxState.get(aboutImg)) {
        const aboutSection = document.querySelector('#apropos');
        if (aboutSection) {
            const aboutTop = aboutSection.offsetTop;
            const aboutHeight = aboutSection.offsetHeight;
            const aboutBottom = aboutTop + aboutHeight;
            const windowHeight = window.innerHeight;
            
            // Only apply parallax when image is in viewport
            if (scrolled + windowHeight >= aboutTop && scrolled <= aboutBottom) {
                const parallaxValue = (scrolled + windowHeight - aboutTop) * 0.06; // Very subtle
                aboutImg.style.transform = `translateY(${parallaxValue}px)`;
            } else {
                aboutImg.style.transform = 'translateY(0)';
            }
        }
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Reset parallax on window resize
window.addEventListener('resize', () => {
    if (isMobileDevice()) {
        const profileImg = document.querySelector('.profile-img');
        const aboutImg = document.querySelector('.about-img');
        if (profileImg) profileImg.style.transform = '';
        if (aboutImg) aboutImg.style.transform = '';
    }
});

// Disable parallax on hover to avoid conflicts with CSS hover effects
document.addEventListener('DOMContentLoaded', () => {
    const profileImg = document.querySelector('.profile-img');
    const aboutImg = document.querySelector('.about-img');
    
    [profileImg, aboutImg].forEach(img => {
        if (img) {
            imageParallaxState.set(img, false);
            
            img.addEventListener('mouseenter', () => {
                imageParallaxState.set(img, true);
                img.style.transform = ''; // Let CSS handle the hover transform
            });
            
            img.addEventListener('mouseleave', () => {
                imageParallaxState.set(img, false);
                updateParallax(); // Re-enable parallax
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Project card hover effects are now handled by CSS for better performance

// Skill tags hover effects are now handled by CSS for better performance

// Console message
console.log('%c👋 Bienvenue sur mon portfolio !', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cVous êtes développeur ? N\'hésitez pas à me contacter !', 'color: #6b7280; font-size: 14px;');

