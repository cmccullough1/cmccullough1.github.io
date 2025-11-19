// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Hero Slider
const heroSection = document.querySelector('.hero');
if (heroSection) {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const sidebarContents = document.querySelectorAll('.sidebar-content');
    const totalSlides = slides.length;
    let sliderInterval;
    let currentSidebarContent = 0;
    let sidebarInterval;

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Ensure index wraps around
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function showSidebarContent(index) {
        // Remove active class from all sidebar contents
        sidebarContents.forEach(content => content.classList.remove('active'));

        // Ensure index wraps around
        if (index >= sidebarContents.length) {
            currentSidebarContent = 0;
        } else if (index < 0) {
            currentSidebarContent = sidebarContents.length - 1;
        } else {
            currentSidebarContent = index;
        }

        // Add active class to current sidebar content
        sidebarContents[currentSidebarContent].classList.add('active');
    }

    function nextSidebarContent() {
        showSidebarContent(currentSidebarContent + 1);
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlider() {
        sliderInterval = setInterval(nextSlide, 10000); // Change slide every 10 seconds
    }

    function stopSlider() {
        clearInterval(sliderInterval);
    }

    function startSidebarRotation() {
        sidebarInterval = setInterval(nextSidebarContent, 10000); // Change sidebar content every 10 seconds
    }

    function stopSidebarRotation() {
        clearInterval(sidebarInterval);
    }

    // Initialize slider and sidebar
    showSlide(0);
    showSidebarContent(0);
    startSlider();
    startSidebarRotation();

    // Previous/Next button controls
    document.querySelector('.slider-prev').addEventListener('click', () => {
        stopSlider();
        prevSlide();
        startSlider();
    });

    document.querySelector('.slider-next').addEventListener('click', () => {
        stopSlider();
        nextSlide();
        startSlider();
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlider();
            showSlide(index);
            startSlider();
        });
    });

    // Pause slider and sidebar rotation on hover
    heroSection.addEventListener('mouseenter', () => {
        stopSlider();
        stopSidebarRotation();
    });
    heroSection.addEventListener('mouseleave', () => {
        startSlider();
        startSidebarRotation();
    });
}

// Secondary nav shadow on scroll
let lastScroll = 0;
const secondaryNav = document.getElementById('secondary-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 120) {
        secondaryNav.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
    } else {
        secondaryNav.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    }

    lastScroll = currentScroll;
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#secondary-nav')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
}

// Add fade-in animation on scroll for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all major sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.bureaus, .services, .faq, .about, .how-it-works, .contact');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});
