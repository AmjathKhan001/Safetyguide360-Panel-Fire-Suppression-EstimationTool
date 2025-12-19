// Visitor Counter for Fire Safety Tools Website
class VisitorCounter {
    constructor() {
        this.apiUrl = 'https://api.countapi.xyz';
        this.namespace = 'fire-safety-tools';
        this.key = 'visits';
        this.localStorageKey = 'fireSafetyVisitorCount';
        this.lastVisitKey = 'fireSafetyLastVisit';
        this.init();
    }

    async init() {
        try {
            // Set current year in footer
            this.setCurrentYear();
            
            // Try to use countapi.xyz first
            await this.updateWithAPI();
        } catch (error) {
            console.log('Using local visitor counter');
            this.updateLocalCounter();
        }
    }

    setCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    async updateWithAPI() {
        try {
            // Try to get existing count
            const getResponse = await fetch(`${this.apiUrl}/get/${this.namespace}/${this.key}`);
            if (!getResponse.ok) throw new Error('API not available');
            
            const data = await getResponse.json();
            let currentCount = data.value || 0;
            
            // Check if we've already visited today (using local storage)
            const lastVisit = localStorage.getItem(this.lastVisitKey);
            const today = new Date().toDateString();
            
            if (lastVisit !== today) {
                // Increment count
                currentCount++;
                await fetch(`${this.apiUrl}/hit/${this.namespace}/${this.key}`);
                
                // Update local storage
                localStorage.setItem(this.lastVisitKey, today);
                localStorage.setItem(this.localStorageKey, currentCount);
            } else {
                // Use local count for today
                currentCount = localStorage.getItem(this.localStorageKey) || currentCount;
            }
            
            this.displayCount(currentCount);
        } catch (error) {
            throw error; // Pass to fallback
        }
    }

    updateLocalCounter() {
        const lastVisit = localStorage.getItem(this.lastVisitKey);
        const today = new Date().toDateString();
        let count = localStorage.getItem(this.localStorageKey) || 1000;
        
        if (lastVisit !== today) {
            count = parseInt(count) + 1;
            localStorage.setItem(this.localStorageKey, count);
            localStorage.setItem(this.lastVisitKey, today);
        }
        
        this.displayCount(count);
    }

    displayCount(count) {
        const counterElement = document.getElementById('visitorCount');
        if (counterElement) {
            // Format number with commas
            const formattedCount = parseInt(count).toLocaleString();
            
            // Add animation effect
            counterElement.style.opacity = '0';
            counterElement.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                counterElement.textContent = formattedCount;
                counterElement.style.opacity = '1';
                counterElement.style.transform = 'translateY(0)';
                counterElement.style.transition = 'all 0.3s ease';
            }, 300);
        }
    }
}

// Initialize counter when page loads
document.addEventListener('DOMContentLoaded', () => {
    new VisitorCounter();
});
