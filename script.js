/**
 * Automotive Luleå - Modern Website
 * JavaScript Interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initMobileMenu();
    initStickyNav();
    initFAQAccordion();
    initStatCounters();
    initScrollAnimations();
    initFormHandling();
    initSmoothScroll();
    initFloatingCTA();
    initChatWidget();
});

/**
 * Navigation Dropdown Handling
 */
function initNavigation() {
    const dropdowns = document.querySelectorAll('.has-dropdown');

    dropdowns.forEach(dropdown => {
        const mainLink = dropdown.querySelector(':scope > a'); // Only the direct child link (Tjänster)

        // For touch devices - only prevent default on the main dropdown toggle
        if (mainLink) {
            mainLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }

        // Allow dropdown items to close the menu after clicking
        const dropdownLinks = dropdown.querySelectorAll('.dropdown a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function() {
                dropdown.classList.remove('active');
            });
        });
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

/**
 * Sticky Navigation with Shadow
 */
function initStickyNav() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * FAQ Accordion
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Animated Statistics Counter
 */
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();

    // Check if it's a decimal (like 4.8 for rating)
    const isDecimal = target % 1 !== 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const current = start + (target - start) * easeOut;

        if (isDecimal) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current).toLocaleString('sv-SE');
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            if (isDecimal) {
                element.textContent = target.toFixed(1);
            } else {
                element.textContent = target.toLocaleString('sv-SE');
            }
        }
    }

    requestAnimationFrame(updateCounter);
}

/**
 * Scroll Reveal Animations
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll(
        '.service-card, .testimonial-card, .why-card, .about-feature, .contact-card'
    );

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay
                setTimeout(() => {
                    entry.target.classList.add('reveal', 'active');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                headerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    sectionHeaders.forEach(header => {
        headerObserver.observe(header);
    });
}

/**
 * Form Handling
 */
function initFormHandling() {
    // Quick Quote Form
    const quickQuoteForm = document.getElementById('quickQuoteForm');
    if (quickQuoteForm) {
        quickQuoteForm.addEventListener('submit', handleQuickQuote);
    }

    // Booking Form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingForm);
    }

    // Input animations
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Registration number formatting
    const regInput = document.getElementById('bookingReg');
    if (regInput) {
        regInput.addEventListener('input', function(e) {
            let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (value.length > 3) {
                value = value.slice(0, 3) + ' ' + value.slice(3);
            }
            e.target.value = value;
        });
    }
}

function handleQuickQuote(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = `
        <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        Skickar...
    `;
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        submitBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Skickat!
        `;
        submitBtn.classList.add('btn-success');

        // Reset form
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-success');
        }, 3000);
    }, 1500);
}

function handleBookingForm(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Show loading state
    submitBtn.innerHTML = `
        <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        Skickar...
    `;
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <h3>Tack för din bokning!</h3>
            <p>Vi återkommer inom 2 timmar med bekräftelse.</p>
        `;

        form.style.display = 'none';
        form.parentElement.appendChild(successMessage);

        // Style the success message
        successMessage.style.cssText = `
            text-align: center;
            padding: 3rem 2rem;
            color: var(--primary);
        `;
        successMessage.querySelector('h3').style.cssText = `
            margin: 1rem 0 0.5rem;
            color: var(--gray-900);
        `;
        successMessage.querySelector('p').style.cssText = `
            color: var(--gray-600);
        `;

        // Reset after some time
        setTimeout(() => {
            successMessage.remove();
            form.style.display = 'flex';
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 5000);
    }, 2000);
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Floating CTA Button (Mobile)
 */
function initFloatingCTA() {
    const floatingCTA = document.getElementById('floatingCta');
    if (!floatingCTA) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScroll = window.pageYOffset;

                // Show after scrolling past hero
                if (currentScroll > 500) {
                    floatingCTA.style.opacity = '1';
                    floatingCTA.style.pointerEvents = 'auto';
                } else {
                    floatingCTA.style.opacity = '0';
                    floatingCTA.style.pointerEvents = 'none';
                }

                // Hide when near bottom (contact section)
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    const contactTop = contactSection.getBoundingClientRect().top;
                    if (contactTop < window.innerHeight) {
                        floatingCTA.style.opacity = '0';
                        floatingCTA.style.pointerEvents = 'none';
                    }
                }

                lastScroll = currentScroll;
                ticking = false;
            });

            ticking = true;
        }
    });
}

/**
 * Chat Widget
 */
function initChatWidget() {
    const chatWidget = document.getElementById('chatWidget');
    const chatToggle = document.getElementById('chatToggle');
    const chatMinimize = document.getElementById('chatMinimize');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const quickReplies = document.querySelectorAll('.quick-reply');

    if (!chatWidget || !chatToggle) return;

    // Toggle chat window
    chatToggle.addEventListener('click', function() {
        chatWidget.classList.toggle('active');
        if (chatWidget.classList.contains('active')) {
            chatInput.focus();
        }
    });

    // Minimize chat
    if (chatMinimize) {
        chatMinimize.addEventListener('click', function() {
            chatWidget.classList.remove('active');
        });
    }

    // Quick reply buttons
    quickReplies.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            sendMessage(message);

            // Hide quick replies after use
            const quickRepliesContainer = document.querySelector('.chat-quick-replies');
            if (quickRepliesContainer) {
                quickRepliesContainer.style.display = 'none';
            }
        });
    });

    // Send message on form submit
    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                sendMessage(message);
                chatInput.value = '';
            }
        });
    }

    function sendMessage(text) {
        // Add user message
        addMessage(text, 'sent');

        // Simulate typing indicator
        setTimeout(() => {
            showTypingIndicator();
        }, 500);

        // Simulate bot response
        setTimeout(() => {
            hideTypingIndicator();
            const response = getBotResponse(text);
            addMessage(response, 'received');
        }, 1500 + Math.random() * 1000);
    }

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;

        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' +
                       now.getMinutes().toString().padStart(2, '0');

        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${timeStr}</span>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message received typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Booking related
        if (lowerMessage.includes('boka') || lowerMessage.includes('tid')) {
            return 'Självklart! Du kan boka tid direkt på vår hemsida genom att klicka på "Boka Tid" knappen, eller ring oss på 0920-991 12. Vi har öppet mån-tors 09-18 och fredag 09-17.';
        }

        // Price related
        if (lowerMessage.includes('pris') || lowerMessage.includes('kost') || lowerMessage.includes('service')) {
            return 'Våra priser varierar beroende på tjänst:\n\n• Bilservice: från 1 295 kr\n• Kamremsbyte: från 3 995 kr\n• AC-service: från 895 kr\n• Däckbyte: från 395 kr\n\nVill du ha en exakt offert för din bil?';
        }

        // Opening hours
        if (lowerMessage.includes('öppet') || lowerMessage.includes('tider') || lowerMessage.includes('stängt')) {
            return 'Vi har öppet:\n\n• Måndag-Torsdag: 09:00-18:00\n• Fredag: 09:00-17:00\n• Lördag-Söndag: Stängt\n\nVälkommen in!';
        }

        // Location
        if (lowerMessage.includes('adress') || lowerMessage.includes('hitta') || lowerMessage.includes('var')) {
            return 'Vi finns på Fabriksvägen 18 i Luleå. Det finns gott om parkeringsmöjligheter. Kolla gärna kartan längst ner på sidan!';
        }

        // Timing belt / Kamrem
        if (lowerMessage.includes('kamrem')) {
            return 'Kamremsbytet är viktigt för att undvika motorskador. Intervallet är oftast 90 000-180 000 km beroende på bilmärke. Vårt pris börjar från 3 995 kr. Vill du boka en tid?';
        }

        // AC
        if (lowerMessage.includes('ac') || lowerMessage.includes('kyla') || lowerMessage.includes('luftkondition')) {
            return 'Vi rekommenderar AC-service vartannat år. Vi fyller på köldmedium, kontrollerar för läckor och ser till att din AC fungerar optimalt. Pris från 895 kr.';
        }

        // Default response
        return 'Tack för ditt meddelande! För snabbast hjälp, ring oss gärna på 0920-991 12, eller beskriv vad du behöver hjälp med så svarar vi så fort vi kan.';
    }

    // Auto-open chat after 30 seconds (optional - can be removed)
    // setTimeout(() => {
    //     if (!chatWidget.classList.contains('active')) {
    //         chatWidget.classList.add('active');
    //     }
    // }, 30000);
}

/**
 * CSS for loading spinner
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .animate-spin {
        animation: spin 1s linear infinite;
    }

    .btn-success {
        background-color: #10b981 !important;
        border-color: #10b981 !important;
    }

    .form-success {
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
