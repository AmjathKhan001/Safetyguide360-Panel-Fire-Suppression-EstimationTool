// Main Calculator Script for Fire Safety Tools Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId + '-tab') {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Calculator Functions
    function calculateRoomVolume() {
        const length = parseFloat(document.getElementById('roomLength').value) || 0;
        const width = parseFloat(document.getElementById('roomWidth').value) || 0;
        const height = parseFloat(document.getElementById('roomHeight').value) || 0;
        
        return length * width * height;
    }
    
    function calculateSuppressionRequirements() {
        const volume = calculateRoomVolume();
        const suppressionType = document.getElementById('suppressionType').value;
        const fireClass = document.getElementById('fireClass').value;
        const panelType = document.getElementById('panelType').value;
        
        let agentQuantity = 0;
        let cylinderCount = 0;
        let cost = 0;
        
        // Base calculation based on volume
        agentQuantity = volume * 0.2; // 0.2 kg per cubic meter
        
        // Adjust based on suppression type
        const suppressionMultipliers = {
            'co2': 1.2,
            'fm200': 0.8,
            'novec': 0.7,
            'water': 1.0
        };
        
        agentQuantity *= suppressionMultipliers[suppressionType] || 1;
        
        // Adjust based on fire class
        const classMultipliers = {
            'A': 1.0,
            'B': 1.2,
            'C': 1.5,
            'D': 2.0
        };
        
        agentQuantity *= classMultipliers[fireClass] || 1;
        
        // Adjust based on panel type
        const panelMultipliers = {
            'low_voltage': 1.0,
            'medium_voltage': 1.3,
            'high_voltage': 1.7,
            'control_panel': 1.1,
            'distribution': 1.0
        };
        
        agentQuantity *= panelMultipliers[panelType] || 1;
        
        // Calculate cylinders (assuming 50kg per cylinder)
        cylinderCount = Math.ceil(agentQuantity / 50);
        
        // Calculate cost
        const costPerKg = {
            'co2': 50,
            'fm200': 120,
            'novec': 150,
            'water': 30
        };
        
        cost = agentQuantity * (costPerKg[suppressionType] || 100);
        cost += cylinderCount * 500; // Cylinder cost
        cost = Math.round(cost);
        
        return {
            volume: Math.round(volume * 100) / 100,
            agentQuantity: Math.round(agentQuantity * 100) / 100,
            cylinderCount: cylinderCount,
            cost: cost
        };
    }
    
    function calculateExtinguisherRequirements() {
        const area = parseFloat(document.getElementById('areaSize').value) || 0;
        const hazardLevel = document.getElementById('hazardLevel').value;
        const buildingType = document.getElementById('buildingType').value;
        
        // Base extinguishers per square meter
        const baseCoverage = {
            'low': 100,    // 1 extinguisher per 100 sqm
            'medium': 50,  // 1 extinguisher per 50 sqm
            'high': 25     // 1 extinguisher per 25 sqm
        };
        
        let minExtinguishers = Math.ceil(area / (baseCoverage[hazardLevel] || 50));
        
        // Adjust based on building type
        const buildingMultipliers = {
            'commercial': 1.0,
            'industrial': 1.5,
            'residential': 0.8,
            'warehouse': 2.0
        };
        
        minExtinguishers = Math.ceil(minExtinguishers * (buildingMultipliers[buildingType] || 1));
        
        // Determine extinguisher type
        let recommendedType = 'ABC Powder';
        if (hazardLevel === 'low') recommendedType = 'Water';
        if (hazardLevel === 'high') recommendedType = 'CO2 or Clean Agent';
        
        // Calculate coverage area per extinguisher
        const coverageArea = baseCoverage[hazardLevel] || 50;
        
        // Calculate maximum travel distance
        const placementDistance = hazardLevel === 'low' ? '30 m' : '15 m';
        
        return {
            minExtinguishers: minExtinguishers,
            recommendedType: recommendedType,
            coverageArea: coverageArea + ' m²',
            placementDistance: placementDistance
        };
    }
    
    // Event Listeners for Calculations
    const calculateBtn = document.getElementById('calculateBtn');
    const calculateExtBtn = document.getElementById('calculateExtBtn');
    const resetBtn = document.getElementById('resetBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const results = calculateSuppressionRequirements();
            
            document.getElementById('roomVolume').textContent = results.volume + ' m³';
            document.getElementById('agentQuantity').textContent = results.agentQuantity + ' kg';
            document.getElementById('cylinderCount').textContent = results.cylinderCount;
            document.getElementById('estimatedCost').textContent = '$' + results.cost.toLocaleString();
            
            // Add animation
            this.innerHTML = '<i class="fas fa-check"></i> Calculated!';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-calculator"></i> Calculate Requirements';
            }, 1500);
        });
    }
    
    if (calculateExtBtn) {
        calculateExtBtn.addEventListener('click', function() {
            const results = calculateExtinguisherRequirements();
            
            document.getElementById('minExtinguishers').textContent = results.minExtinguishers + ' units';
            document.getElementById('recommendedType').textContent = results.recommendedType;
            document.getElementById('coverageArea').textContent = results.coverageArea;
            document.getElementById('placementDistance').textContent = results.placementDistance;
            
            // Add animation
            this.innerHTML = '<i class="fas fa-check"></i> Calculated!';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-calculator"></i> Calculate Extinguishers';
            }, 1500);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Reset suppression calculator
            document.getElementById('roomLength').value = '';
            document.getElementById('roomWidth').value = '';
            document.getElementById('roomHeight').value = '';
            document.getElementById('fireClass').selectedIndex = 2;
            document.getElementById('suppressionType').selectedIndex = 1;
            document.getElementById('panelType').selectedIndex = 1;
            
            document.getElementById('roomVolume').textContent = '0 m³';
            document.getElementById('agentQuantity').textContent = '0 kg';
            document.getElementById('cylinderCount').textContent = '0';
            document.getElementById('estimatedCost').textContent = '$0';
            
            // Add feedback
            this.innerHTML = '<i class="fas fa-check"></i> Reset Complete!';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-redo"></i> Reset';
            }, 1500);
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            const results = calculateSuppressionRequirements();
            
            // Create PDF content
            const pdfContent = `
                Fire Suppression Calculation Report
                ==================================
                
                Room Dimensions:
                - Length: ${document.getElementById('roomLength').value || 0} m
                - Width: ${document.getElementById('roomWidth').value || 0} m
                - Height: ${document.getElementById('roomHeight').value || 0} m
                - Volume: ${results.volume} m³
                
                System Parameters:
                - Fire Class: ${document.getElementById('fireClass').options[document.getElementById('fireClass').selectedIndex].text}
                - Suppression Type: ${document.getElementById('suppressionType').options[document.getElementById('suppressionType').selectedIndex].text}
                - Panel Type: ${document.getElementById('panelType').options[document.getElementById('panelType').selectedIndex].text}
                
                Results:
                - Required Agent: ${results.agentQuantity} kg
                - Cylinders Required: ${results.cylinderCount}
                - Estimated Cost: $${results.cost.toLocaleString()}
                
                Generated by Fire Safety Tools
                https://panel-fire-suppression-calculator.vercel.app/
            `;
            
            // Create blob and download
            const blob = new Blob([pdfContent], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fire-suppression-report.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Add feedback
            this.innerHTML = '<i class="fas fa-check"></i> PDF Downloaded!';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-file-pdf"></i> Export PDF';
            }, 1500);
        });
    }
    
    // Auto-calculate on input change
    const calculatorInputs = document.querySelectorAll('#suppression-tab input, #suppression-tab select');
    calculatorInputs.forEach(input => {
        input.addEventListener('change', function() {
            const results = calculateSuppressionRequirements();
            
            document.getElementById('roomVolume').textContent = results.volume + ' m³';
            document.getElementById('agentQuantity').textContent = results.agentQuantity + ' kg';
            document.getElementById('cylinderCount').textContent = results.cylinderCount;
            document.getElementById('estimatedCost').textContent = '$' + results.cost.toLocaleString();
        });
    });
    
    const extinguisherInputs = document.querySelectorAll('#extinguisher-tab input, #extinguisher-tab select');
    extinguisherInputs.forEach(input => {
        input.addEventListener('change', function() {
            const results = calculateExtinguisherRequirements();
            
            document.getElementById('minExtinguishers').textContent = results.minExtinguishers + ' units';
            document.getElementById('recommendedType').textContent = results.recommendedType;
            document.getElementById('coverageArea').textContent = results.coverageArea;
            document.getElementById('placementDistance').textContent = results.placementDistance;
        });
    });
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize with sample calculations
    if (calculateBtn) calculateBtn.click();
    if (calculateExtBtn) calculateExtBtn.click();
});
