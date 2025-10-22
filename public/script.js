// Navigation Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Navigation item click handlers
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Class tabs switching
    const classTabs = document.querySelectorAll('.class-tab');
    classTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            classTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Collapse button functionality
    const collapseBtn = document.querySelector('.collapse-btn');
    const growthGrid = document.querySelector('.growth-grid');

    if (collapseBtn && growthGrid) {
        collapseBtn.addEventListener('click', function() {
            if (growthGrid.style.display === 'none') {
                growthGrid.style.display = 'grid';
                this.textContent = '^';
            } else {
                growthGrid.style.display = 'none';
                this.textContent = 'v';
            }
        });
    }

    // Settings button click
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            alert('Settings functionality would be implemented here');
        });
    }

    // View profile button
    const viewProfileBtn = document.querySelector('.view-profile-btn');
    if (viewProfileBtn) {
        viewProfileBtn.addEventListener('click', function() {
            alert('Profile view functionality would be implemented here');
        });
    }

    // Header icon buttons hover effects
    const iconBtns = document.querySelectorAll('.icon-btn');
    iconBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Icon button clicked');
        });
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Smooth scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe stat cards for animation
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Add current time to welcome message
    function updateGreeting() {
        const now = new Date();
        const hour = now.getHours();
        let greeting = 'Welcome back';
        
        if (hour < 12) {
            greeting = 'Good morning';
        } else if (hour < 18) {
            greeting = 'Good afternoon';
        } else {
            greeting = 'Good evening';
        }
        
        // Uncomment to dynamically update greeting
        // document.querySelector('.welcome-title').textContent = greeting + ' !';
    }

    updateGreeting();

    // Counter animation for stat numbers
    function animateCounter(element, target, duration = 1000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Animate numbers when they come into view
    const statNumbers = document.querySelectorAll('.stat-number');
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const text = entry.target.textContent;
                const number = parseInt(text);
                
                if (!isNaN(number)) {
                    animateCounter(entry.target, number);
                    entry.target.dataset.animated = 'true';
                }
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => {
        numberObserver.observe(num);
    });

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
        ripple.classList.add('ripple');

        const rippleEffect = button.getElementsByClassName('ripple')[0];
        if (rippleEffect) {
            rippleEffect.remove();
        }

        button.appendChild(ripple);
    }

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('SEIJ UMS Dashboard loaded successfully');
});
