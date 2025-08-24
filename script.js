// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Form validation for contact form
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Basic validation
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const subject = document.querySelector('#subject')?.value || 'General Inquiry';
        const message = document.querySelector('#message').value;
        
        if (!name || !email || !message) {
            if (window.showMessage) {
                window.showMessage('Please fill in all required fields', 'error');
            } else {
                alert('Please fill in all required fields');
            }
            return;
        }
        
        if (!isValidEmail(email)) {
            if (window.showMessage) {
                window.showMessage('Please enter a valid email address', 'error');
            } else {
                alert('Please enter a valid email address');
            }
            return;
        }
        
        // Use mock API if available, otherwise show simple success message
        if (window.contactAPI) {
            try {
                await window.contactAPI.submit({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                });
                contactForm.reset();
            } catch (error) {
                if (window.showMessage) {
                    window.showMessage(error.message, 'error');
                } else {
                    alert('Error: ' + error.message);
                }
            }
        } else {
            // Fallback for when api.js is not loaded
            if (window.showMessage) {
                window.showMessage('Thank you for your message! We will get back to you soon.', 'success');
            } else {
                alert('Thank you for your message! We will get back to you soon.');
            }
            contactForm.reset();
        }
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Login form handling
const loginForm = document.querySelector('#loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.querySelector('#loginEmail').value;
        const password = document.querySelector('#loginPassword').value;
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Simulate login (in real app, this would connect to backend)
        if (email === 'demo@arijitpanda.com' && password === 'demo123') {
            alert('Login successful! Redirecting to dashboard...');
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });
}

// Signup form handling
const signupForm = document.querySelector('#signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.querySelector('#signupName').value;
        const email = document.querySelector('#signupEmail').value;
        const password = document.querySelector('#signupPassword').value;
        const confirmPassword = document.querySelector('#confirmPassword').value;
        
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        // Simulate signup (in real app, this would connect to backend)
        alert('Account created successfully! Please login.');
        window.location.href = 'login.html';
    });
}

// Service card animations
const serviceCards = document.querySelectorAll('.service-card');
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

serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Initialize counters when they come into view
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
});

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #e74c3c;
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    z-index: 1000;
    transition: all 0.3s ease;
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to back to top button
backToTopBtn.addEventListener('mouseenter', () => {
    backToTopBtn.style.transform = 'scale(1.1)';
    backToTopBtn.style.background = '#c0392b';
});

backToTopBtn.addEventListener('mouseleave', () => {
    backToTopBtn.style.transform = 'scale(1)';
    backToTopBtn.style.background = '#e74c3c';
});
