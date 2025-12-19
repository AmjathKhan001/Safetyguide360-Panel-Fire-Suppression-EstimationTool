// Main script for Fire Safety Tools Website
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            // Change icon based on state
            mobileMenuBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation for calculator inputs
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
            
            // Add visual feedback
            if (this.value) {
                this.style.borderColor = '#34bf49';
            } else {
                this.style.borderColor = '';
            }
        });
    });
    
    // Reset button functionality
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Reset all calculator inputs
            document.querySelectorAll('#calculator input, #calculator select').forEach(input => {
                if (input.type === 'number') {
                    input.value = '';
                } else if (input.tagName === 'SELECT') {
                    input.selectedIndex = 0;
                }
                input.style.borderColor = '';
            });
            
            // Reset results
            const resultElements = document.querySelectorAll('#calculator .result-card p');
            resultElements.forEach(p => {
                if (p.id === 'roomVolume') p.textContent = '0 m³';
                else if (p.id === 'agentQuantity') p.textContent = '0 kg';
                else if (p.id === 'cylinderCount') p.textContent = '0';
                else if (p.id === 'estimatedCost') p.textContent = '$0';
            });
            
            // Add visual feedback
            this.style.backgroundColor = '#34bf49';
            this.textContent = 'Reset Complete!';
            
            setTimeout(() => {
                this.style.backgroundColor = '';
                this.textContent = 'Reset';
            }, 1500);
        });
    }
    
    // Add active state to current section in navigation
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a');
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
                link.style.backgroundColor = 'var(--primary-color)';
            } else {
                link.style.backgroundColor = '';
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
    
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.id === 'calculateBtn' || this.id === 'calculateExtBtn') {
                const originalText = this.textContent;
                this.textContent = 'Calculating...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 1000);
            }
        });
    });
    
    // Tool card hover effects enhancement
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Initialize tooltips for social links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const platform = this.textContent;
            this.setAttribute('title', `Visit my ${platform} profile`);
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.textContent = '☰';
        }
        
        // Tab key navigation focus styles
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('click', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Add print styles
    const printBtn = document.createElement('button');
    printBtn.textContent = 'Print This Page';
    printBtn.className = 'btn print-btn';
    printBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 1000; background: var(--secondary-color); color: white; display: none;';
    
    document.body.appendChild(printBtn);
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            printBtn.style.display = 'block';
        } else {
            printBtn.style.display = 'none';
        }
    });
    
    // Add style for print
    const printStyle = document.createElement('style');
    printStyle.textContent = `
        @media print {
            nav, .mobile-menu-btn, .print-btn, footer {
                display: none !important;
            }
            
            .calculator-container {
                box-shadow: none !important;
                border: 1px solid #000 !important;
                break-inside: avoid;
            }
            
            .tool-card {
                border: 1px solid #000 !important;
                break-inside: avoid;
            }
            
            body {
                font-size: 12pt !important;
            }
            
            h1, h2, h3 {
                color: #000 !important;
            }
        }
    `;
    document.head.appendChild(printStyle);
});
