document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================
    // 1. CUSTOM CURSOR
    // ==========================================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Only enable custom cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Adding a slight delay to the outline for a smooth effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effect for clickable elements
        const clickables = document.querySelectorAll('a, button, input, textarea');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    } else {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    }

    // ==========================================================
    // 2. THEME TOGGLE (Light/Dark Mode)
    // ==========================================================
    const themeBtn = document.getElementById('theme-toggle');
    const icon = themeBtn.querySelector('i');
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        // Default to dark mode
        document.body.classList.add('dark-mode');
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('light-mode')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
            initParticles('#0061ff'); // Re-init particles for light mode
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
            initParticles('#00f2fe'); // Re-init particles for dark mode
        }
    });

    // ==========================================================
    // 3. MOBILE NAVIGATION
    // ==========================================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Sticky Navbar
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--glass-shadow)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // ==========================================================
    // 4. TYPEWRITER EFFECT
    // ==========================================================
    const titles = [
        "Computer Engineering Student",
        "Java Developer",
        "Android Enthusiast",
        "AI Learner"
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter');
    
    function typeEffect() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentTitle.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 500; // Pause before new word
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing effect
    setTimeout(typeEffect, 1500);

    // ==========================================================
    // 5. SCROLL REVEAL ANIMATIONS & SKILL BARS
    // ==========================================================
    // Add reveal class to sections and elements that need it
    const sections = document.querySelectorAll('section:not(.hero)');
    const cards = document.querySelectorAll('.card');
    
    sections.forEach(el => el.classList.add('reveal'));
    cards.forEach(el => el.classList.add('reveal'));

    // Now observe ALL elements with the reveal class
    const allRevealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.classList.add('active');
            
            // If it's the skills section, animate progress bars
            if (entry.target.classList.contains('skills') || entry.target.id === 'skills') {
                const progressBars = document.querySelectorAll('.progress-line span');
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width');
                    bar.style.width = targetWidth;
                });
            }

            // If stats section, animate numbers
            if (entry.target.classList.contains('about') || entry.target.id === 'about' || entry.target.querySelector('.stat-num')) {
                const counters = document.querySelectorAll('.stat-num');
                counters.forEach(counter => {
                    if (counter.classList.contains('counted')) return;
                    counter.classList.add('counted');
                    
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // 60fps
                    
                    let currentNum = 0;
                    const updateCounter = () => {
                        currentNum += increment;
                        if (currentNum < target) {
                            counter.innerText = Math.ceil(currentNum);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
            }

            observer.unobserve(entry.target);
        });
    }, revealOptions);

    allRevealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // ==========================================================
    // 6. PROJECT FILTERING
    // ==========================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==========================================================
    // 7. BACK TO TOP BUTTON
    // ==========================================================
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    // ==========================================================
    // 8. CONTACT FORM HANDLING
    // ==========================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real scenario, you'd send this data via fetch/EmailJS
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            
            // Simulate network request
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                btn.style.background = '#28a745';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ==========================================================
    // 9. PARTICLE BACKGROUND CANVAS
    // ==========================================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let particleColor = document.body.classList.contains('light-mode') ? '#0061ff' : '#00f2fe';

    function initParticles(color) {
        particleColor = color || particleColor;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        
        const numParticles = window.innerWidth < 768 ? 40 : 100;
        
        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                vx: Math.random() * 0.5 - 0.25,
                vy: Math.random() * 0.5 - 0.25
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Setup gradient for links based on theme
        const isLight = document.body.classList.contains('light-mode');
        
        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.globalAlpha = 0.5;
            ctx.fill();
            
            // Draw lines between close particles
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const distance = Math.hypot(p.x - p2.x, p.y - p2.y);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = particleColor;
                    // Opacity based on distance
                    ctx.globalAlpha = 1 - (distance / 120);
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(drawParticles);
    }

    initParticles();
    drawParticles();

    window.addEventListener('resize', () => {
        initParticles();
    });
});
