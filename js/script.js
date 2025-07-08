// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.98)';
    } else {
        navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            resetSubmitButton(submitBtn);
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            resetSubmitButton(submitBtn);
            return;
        }
        
        // Name validation (minimum 2 characters)
        if (name.length < 2) {
            showNotification('Please enter a valid name (minimum 2 characters)', 'error');
            resetSubmitButton(submitBtn);
            return;
        }
        
        // Subject validation (minimum 3 characters)
        if (subject.length < 3) {
            showNotification('Please enter a more descriptive subject (minimum 3 characters)', 'error');
            resetSubmitButton(submitBtn);
            return;
        }
        
        // Message validation (minimum 10 characters)
        if (message.length < 10) {
            showNotification('Please provide a more detailed message (minimum 10 characters)', 'error');
            resetSubmitButton(submitBtn);
            return;
        }
        
        // Create email content
        const emailSubject = `Portfolio Contact: ${subject}`;
        const emailBody = `Hi Moulik,

I'm reaching out through your portfolio website.

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent through your portfolio contact form.

Best regards,
${name}`;
        
        // Create mailto link
        const mailtoLink = `mailto:molijindal17@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Simulate processing delay for better UX
        setTimeout(() => {
            const formDataForIntent = { subject, message, name, email };
            openEmailClient(mailtoLink, contactForm, submitBtn, formDataForIntent);
        }, 1000);
    });
}

// Reset submit button function
function resetSubmitButton(button) {
    button.classList.remove('loading');
    button.disabled = false;
}

// Add real-time validation
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
});

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Validate based on field type
    switch (field.name) {
        case 'name':
            if (value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters');
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
            }
            break;
        case 'subject':
            if (value.length < 3 && value.length > 0) {
                showFieldError(field, 'Subject must be at least 3 characters');
            }
            break;
        case 'message':
            if (value.length < 10 && value.length > 0) {
                showFieldError(field, 'Message must be at least 10 characters');
            }
            break;
    }
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentElement.appendChild(errorElement);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification && notification.parentElement) {
            notification.remove();
        }
    }, 5000);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
}

// Intersection Observer for animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .certification-card, .timeline-item, .stat');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing effect for hero text
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.innerHTML = '';
    
    const typing = () => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    };
    
    typing();
};

// Initialize typing effect
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }
});

// Enhanced email client opening function for better mobile compatibility
function openEmailClient(mailtoLink, contactForm, submitBtn, formData) {
    let emailOpened = false;
    
    // Function to handle successful email opening
    const handleEmailSuccess = () => {
        if (!emailOpened) {
            emailOpened = true;
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                showNotification('Opening your email app... If it doesn\'t open automatically, please check your email app manually.', 'success');
            } else {
                showNotification('Email client opened successfully! Please send the email to complete your message.', 'success');
            }
            
            // Reset form after successful submission
            setTimeout(() => {
                contactForm.reset();
                showNotification('Form cleared. Thank you for reaching out!', 'info');
            }, 2000);
        }
        resetSubmitButton(submitBtn);
    };
    
    // Function to handle email opening failure
    const handleEmailFailure = () => {
        if (!emailOpened) {
            showNotification('Unable to open email client. Please copy the email address: molijindal17@gmail.com', 'error');
            
            // Fallback: copy email to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText('molijindal17@gmail.com').then(() => {
                    showNotification('Email address copied to clipboard!', 'info');
                }).catch(() => {
                    console.log('Clipboard not available');
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = 'molijindal17@gmail.com';
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showNotification('Email address copied to clipboard!', 'info');
                } catch (err) {
                    console.log('Copy failed');
                }
                document.body.removeChild(textArea);
            }
        }
        resetSubmitButton(submitBtn);
    };
    
    // Detect if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const mobileOS = getMobileOS();
    
    try {
        if (isMobile) {
            // Mobile-specific handling
            const link = document.createElement('a');
            link.href = mailtoLink;
            link.style.display = 'none';
            document.body.appendChild(link);
            
            // Add event listeners to detect if email client opens
            const startTime = Date.now();
            let fallbackTriggered = false;
            
            // Listen for visibility change (common when email app opens)
            const handleVisibilityChange = () => {
                if (document.hidden) {
                    // Page became hidden, likely email client opened
                    setTimeout(() => {
                        if (!document.hidden) {
                            handleEmailSuccess();
                        }
                    }, 100);
                    document.removeEventListener('visibilitychange', handleVisibilityChange);
                }
            };
            
            document.addEventListener('visibilitychange', handleVisibilityChange);
            
            // Listen for page blur (another indicator email client opened)
            const handleBlur = () => {
                setTimeout(() => {
                    if (Date.now() - startTime > 500) {
                        handleEmailSuccess();
                    }
                }, 100);
                window.removeEventListener('blur', handleBlur);
            };
            
            window.addEventListener('blur', handleBlur);
            
            // Try to open email client
            try {
                link.click();
                logEmailAttempt('mobile-link-click', true);
            } catch (e) {
                logEmailAttempt('mobile-link-click', false, e);
                // If click fails, try alternative methods
                openEmailWithFallbacks(mailtoLink, formData);
            }
            
            // Cleanup and fallback after timeout
            setTimeout(() => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                window.removeEventListener('blur', handleBlur);
                if (link.parentNode) {
                    document.body.removeChild(link);
                }
                
                if (!emailOpened && !fallbackTriggered) {
                    fallbackTriggered = true;
                    // If no indicators of email client opening, try alternative approach
                    try {
                        openEmailWithFallbacks(mailtoLink, formData);
                        // Give it a bit more time
                        setTimeout(() => {
                            if (!emailOpened) {
                                handleEmailSuccess(); // Assume success to avoid double fallback
                            }
                        }, 1000);
                    } catch (error) {
                        handleEmailFailure();
                    }
                }
            }, 2000);
            
        } else {
            // Desktop handling
            const startTime = Date.now();
            
            // Listen for page blur (email client opening)
            const handleBlur = () => {
                setTimeout(() => {
                    if (Date.now() - startTime > 500) {
                        handleEmailSuccess();
                    }
                }, 100);
                window.removeEventListener('blur', handleBlur);
            };
            
            window.addEventListener('blur', handleBlur);
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Cleanup after timeout
            setTimeout(() => {
                window.removeEventListener('blur', handleBlur);
                if (!emailOpened) {
                    handleEmailSuccess(); // Assume success on desktop
                }
            }, 1500);
        }
    } catch (error) {
        console.error('Email client error:', error);
        handleEmailFailure();
    }
}

// Debug logging for mobile email client issues
function logEmailAttempt(method, success, error = null) {
    const logData = {
        method,
        success,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        os: getMobileOS()
    };
    
    if (error) {
        logData.error = error.message || error;
    }
    
    console.log('Email client attempt:', logData);
}

// Android Gmail intent handler for better compatibility
function createGmailIntent(subject, body, recipient) {
    const baseIntent = 'intent://send?';
    const params = new URLSearchParams({
        'android.intent.extra.EMAIL': recipient,
        'android.intent.extra.SUBJECT': subject,
        'android.intent.extra.TEXT': body,
        'android.intent.type': 'text/plain'
    });
    
    const intentEnd = '#Intent;scheme=mailto;package=com.google.android.gm;end';
    return baseIntent + params.toString() + intentEnd;
}

// Universal email opening function with multiple fallbacks
function openEmailWithFallbacks(mailtoLink, formData) {
    const approaches = [
        // Standard mailto
        () => window.location.href = mailtoLink,
        
        // Try with location.assign
        () => window.location.assign(mailtoLink),
        
        // Try with a temporary link click
        () => {
            const tempLink = document.createElement('a');
            tempLink.href = mailtoLink;
            tempLink.target = '_blank';
            tempLink.rel = 'noopener noreferrer';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
        },
        
        // Android-specific Gmail intent (if on Android)
        () => {
            if (getMobileOS() === 'Android') {
                const gmailIntent = createGmailIntent(
                    formData.subject,
                    formData.message,
                    'molijindal17@gmail.com'
                );
                window.location.href = gmailIntent;
            }
        }
    ];
    
    let currentApproach = 0;
    const tryNextApproach = () => {
        if (currentApproach < approaches.length) {
            try {
                approaches[currentApproach]();
                currentApproach++;
                return true;
            } catch (error) {
                console.log(`Approach ${currentApproach} failed:`, error);
                currentApproach++;
                if (currentApproach < approaches.length) {
                    setTimeout(tryNextApproach, 100);
                }
                return false;
            }
        }
        return false;
    };
    
    return tryNextApproach();
}

// Enhanced mobile detection
function getMobileOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS';
    }
    
    if (/android/i.test(userAgent)) {
        return 'Android';
    }
    
    return 'Other';
}

// Alternative email opening method for stubborn mobile browsers
function tryAlternativeEmailOpening(mailtoLink) {
    const mobileOS = getMobileOS();
    
    if (mobileOS === 'iOS') {
        // Try different approaches for iOS
        const approaches = [
            () => window.location.href = mailtoLink,
            () => window.location.assign(mailtoLink),
            () => window.location.replace(mailtoLink),
            () => {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = mailtoLink;
                document.body.appendChild(iframe);
                setTimeout(() => document.body.removeChild(iframe), 1000);
            }
        ];
        
        let currentApproach = 0;
        const tryNext = () => {
            if (currentApproach < approaches.length) {
                try {
                    approaches[currentApproach]();
                    currentApproach++;
                } catch (e) {
                    console.log('Approach failed:', e);
                    setTimeout(tryNext, 500);
                }
            }
        };
        
        tryNext();
    } else if (mobileOS === 'Android') {
        // Android-specific approach
        try {
            // Try intent-based opening first
            const intentUrl = `intent://send?subject=${encodeURIComponent(mailtoLink.split('subject=')[1]?.split('&')[0] || '')}&body=${encodeURIComponent(mailtoLink.split('body=')[1] || '')}&type=text/plain#Intent;scheme=mailto;package=com.google.android.gm;end`;
            window.location.href = intentUrl;
        } catch (e) {
            // Fallback to regular mailto
            window.location.href = mailtoLink;
        }
    } else {
        // Default approach for other mobile devices
        window.location.href = mailtoLink;
    }
}
