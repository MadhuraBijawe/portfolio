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

// Smooth scrolling for navigation links
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

// Active navigation links on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.pageYOffset + 100; // Offset for navbar height
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id') || 'hero';
        }
    });
    
    // Special case for hero section (when at top of page)
    if (window.pageYOffset < 100) {
        currentSection = 'hero';
    }
    
    // Remove active class from all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current section's nav link
    if (currentSection) {
        const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        // Special handling for hero section (About link should be active)
        if (currentSection === 'hero') {
            const aboutLink = document.querySelector('.nav-link[href="#about"]');
            if (aboutLink) {
                aboutLink.classList.add('active');
            }
        }
    }
}

// Enhanced navbar background on scroll with better transparency
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    // Update navbar background
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.borderBottom = '1px solid rgba(0, 190, 172, 0.2)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.borderBottom = '1px solid rgba(0, 190, 172, 0.1)';
    }
    
    // Update active nav link
    updateActiveNavLink();
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add animation classes and observe elements
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Add slide animations to cards
    const cards = document.querySelectorAll('.skill-card, .project-card, .interest-card');
    cards.forEach((card, index) => {
        card.classList.add(index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
        observer.observe(card);
    });

    // Animate skill bars
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
    
    // Initialize active nav link
    updateActiveNavLink();
});

// Enhanced Contact form handling with email client integration
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Simple form validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Prepare email content
    const emailSubject = `Portfolio Contact: ${subject}`;
    const emailBody = `Hi Madhura,

I'm reaching out through your portfolio website. Here are my details:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Best regards,
${name}`;

    // Create mailto link with pre-filled data
    const mailtoLink = `mailto:madhurabijawe@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening Email Client...';
    submitBtn.disabled = true;
    
    // Open email client
    try {
        window.location.href = mailtoLink;
        
        // Show success message after a short delay
        setTimeout(() => {
            showNotification('Email client opened! Please send the pre-filled email.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
        
    } catch (error) {
        // Fallback: copy email details to clipboard
        const emailDetails = `To: madhurabijawe@gmail.com\nSubject: ${emailSubject}\n\n${emailBody}`;
        
        navigator.clipboard.writeText(emailDetails).then(() => {
            showNotification('Email details copied to clipboard! Please paste in your email client.', 'info');
        }).catch(() => {
            showNotification('Please manually send email to: madhurabijawe@gmail.com', 'info');
        });
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Download resume functionality
document.getElementById('download-resume').addEventListener('click', (e) => {
    e.preventDefault();
    
    // Create a comprehensive resume content
    const resumeContent = `
MADHURA BIJAWE
Full Stack Python Developer
Email: madhurabijawe@gmail.com
Location: Pune, Maharashtra, India
LinkedIn: https://www.linkedin.com/in/madhura-bijawe-004610228
GitHub: https://github.com/MadhuraBijawe

PROFESSIONAL SUMMARY:
Passionate Python Full Stack Developer where frontend brings elegance, backend provides strength, and I bridge the gap to build seamless, user-friendly, and innovative web applications.

TECHNICAL SKILLS:
• Frontend: HTML5, CSS3, JavaScript, React
• Backend: Python, Django
• Database: MySQL
• Tools & Technologies: Git, RESTful APIs, Responsive Design

CORE COMPETENCIES:
• Web Development
• UI/UX Design
• Problem Solving
• Team Collaboration
• Continuous Learning
• Innovation

ABOUT:
I want to become developer, much like actors in movies, front-end developer acts as the face of the website, creating a visual representation like actors in IT industries meanwhile backend developer works as story maker, ensuring the functionality works behind the scenes.

I'm eager to learn, solve real-world problems, and collaborate with teams to create impactful solutions. Currently, I'm seeking an opportunity to apply my skills, grow as a developer, and contribute to meaningful projects in a dynamic environment.

PROJECTS:
• E-Commerce Platform - Full-stack solution with Django and React
• Task Management App - Collaborative application with real-time updates
• Portfolio Website - Responsive showcase with modern web practices

INTERESTS:
• Creating modern, responsive web applications
• Designing intuitive user interfaces
• Tackling complex challenges with innovative solutions
• Collaborating with diverse teams
• Staying updated with emerging technologies
• Exploring new ideas and creative implementations
    `;
    
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Madhura_Bijawe_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Resume downloaded successfully!', 'success');
});

// Add some interactive hover effects
document.querySelectorAll('.skill-card, .project-card, .interest-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect for hero section (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.2; // Reduced for subtlety
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Preloader (optional)
const preloader = document.createElement('div');
preloader.className = 'preloader';
preloader.innerHTML = `
    <div class="preloader-content">
        <div class="spinner"></div>
        <p>Loading...</p>
    </div>
`;

// Add preloader styles
const preloaderStyles = `
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0a0a0a;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    }
    
    .preloader-content {
        text-align: center;
        color: #00beac;
    }
    
    .spinner {
        width: 50px;
        height: 50px;
        border: 3px solid #333;
        border-top: 3px solid #00beac;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    body.loaded .preloader {
        opacity: 0;
        pointer-events: none;
    }
`;

// Add preloader styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = preloaderStyles;
document.head.appendChild(styleSheet);

// Add preloader to body
document.body.appendChild(preloader);

// Remove preloader after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }, 1000);
});