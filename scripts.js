// ===================================
// Mobile Menu Toggle
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update ARIA
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });
    }

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // ===================================
    // Form Handling (Contact Page)
    // ===================================
    const bookingForm = document.getElementById('bookingForm');
    const formMessage = document.getElementById('formMessage');

    if (bookingForm) {
        // Load saved data from localStorage
        const savedName = localStorage.getItem('userName');
        const savedPhone = localStorage.getItem('userPhone');
        
        if (savedName) document.getElementById('name').value = savedName;
        if (savedPhone) document.getElementById('phone').value = savedPhone;

        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                pickup: document.getElementById('pickup').value,
                drop: document.getElementById('drop').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                message: document.getElementById('message').value
            };

            // Client-side validation
            if (!formData.name || !formData.phone || !formData.pickup || !formData.drop || !formData.date || !formData.time) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Phone validation (basic)
            const phoneRegex = /^[+]?[\d\s-()]+$/;
            if (!phoneRegex.test(formData.phone)) {
                showMessage('Please enter a valid phone number.', 'error');
                return;
            }

            // Email validation (if provided)
            if (formData.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    showMessage('Please enter a valid email address.', 'error');
                    return;
                }
            }

            // Save name and phone to localStorage
            localStorage.setItem('userName', formData.name);
            localStorage.setItem('userPhone', formData.phone);

            // ===================================
            // FORM SUBMISSION OPTIONS
            // ===================================
            
            // OPTION 1: Send to Formspree (Recommended)
            // Uncomment and add your Formspree endpoint
            /*
            fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                showMessage('Thank you! Your booking request has been submitted. We will contact you soon. — আপনার রিকোয়েস্ট পাওয়া গেছে', 'success');
                bookingForm.reset();
            })
            .catch(error => {
                showMessage('There was an error submitting your request. Please call us directly.', 'error');
            });
            */

            // OPTION 2: Send via WhatsApp (Simple fallback)
            const whatsappMessage = `New Booking Request:%0A%0AName: ${formData.name}%0APhone: ${formData.phone}%0AEmail: ${formData.email}%0APickup: ${formData.pickup}%0ADrop: ${formData.drop}%0ADate: ${formData.date}%0ATime: ${formData.time}%0AMessage: ${formData.message}`;
            const whatsappUrl = `https://wa.me/917654086308?text=${whatsappMessage}`;
            
            // Show success message
            showMessage('Thank you! Redirecting to WhatsApp... — আপনার রিকোয়েস্ট পাওয়া গেছে', 'success');
            
            // Redirect to WhatsApp after 2 seconds
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 2000);

            // Reset form
            bookingForm.reset();

            // OPTION 3: Simulate success (for testing)
            /*
            showMessage('Thank you! Your booking request has been submitted. We will contact you soon. — আপনার রিকোয়েস্ট পাওয়া গেছে', 'success');
            bookingForm.reset();
            */
        });
    }

    function showMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message ' + type;
            
            // Hide message after 5 seconds for error, keep visible for success
            if (type === 'error') {
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    }

    // ===================================
    // Smooth Scroll for Anchor Links
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===================================
    // Lazy Loading Images
    // ===================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===================================
    // Scroll Animations
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .feature-item, .value-card, .destination-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        animationObserver.observe(el);
    });

    // ===================================
    // Navbar Background on Scroll
    // ===================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#ffffff';
            navbar.style.backdropFilter = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // Hero Image Carousel Auto Slide
let index = 0;
const images = document.querySelectorAll('.carousel-image');

if (images.length > 0) {
    setInterval(() => {
        images[index].classList.remove('active');
        index = (index + 1) % images.length;
        images[index].classList.add('active');
    }, 4000); // change every 4 seconds
}

// Fade-in animation for destination cards
const destCards = document.querySelectorAll('.destination-card');

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

destCards.forEach(card => fadeObserver.observe(card));

// Add in your scripts.js
document.addEventListener("scroll", () => {
  document.querySelectorAll(".choose-card").forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      card.classList.add("active");
    }
  });
});


});
