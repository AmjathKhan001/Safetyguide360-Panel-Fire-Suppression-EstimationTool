// Visitor Counter for Fire Safety Tools Website
class VisitorCounter {
    constructor() {
        this.localStorageKey = 'fireSafetyVisitorCount';
        this.lastVisitKey = 'fireSafetyLastVisit';
        this.initialCount = 1254; // Starting count
        this.init();
    }

    init() {
        this.updateCounter();
        
        // Update counter every 30 seconds to simulate real-time updates
        setInterval(() => {
            this.updateCounter();
        }, 30000);
    }

    updateCounter() {
        const lastVisit = localStorage.getItem(this.lastVisitKey);
        const today = new Date().toDateString();
        let count = parseInt(localStorage.getItem(this.localStorageKey)) || this.initialCount;
        
        // Only increment if last visit was more than 1 hour ago
        if (!lastVisit || (Date.now() - parseInt(lastVisit)) > 3600000) {
            // Add random increment between 1-5
            const increment = Math.floor(Math.random() * 5) + 1;
            count += increment;
            
            localStorage.setItem(this.localStorageKey, count);
            localStorage.setItem(this.lastVisitKey, Date.now());
        }
        
        this.displayCount(count);
    }

    displayCount(count) {
        const counterElement = document.getElementById('visitorCount');
        if (counterElement) {
            const formattedCount = count.toLocaleString();
            
            // Add animation effect
            counterElement.style.opacity = '0';
            counterElement.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                counterElement.textContent = formattedCount;
                counterElement.style.opacity = '1';
                counterElement.style.transform = 'scale(1)';
                counterElement.style.transition = 'all 0.3s ease';
            }, 200);
        }
    }
}

// Initialize counter when page loads
document.addEventListener('DOMContentLoaded', () => {
    new VisitorCounter();
});
