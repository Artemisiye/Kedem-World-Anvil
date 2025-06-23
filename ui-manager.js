// ui-manager.js
import { db, currentUserId, auth } from './firebase-init.js'; // Import Firebase instances and userId
import { initializeDeityManager } from './deity-manager.js'; // Import deity manager
import { setupLoreLibrary } from './lore-library-manager.js'; // Import lore library manager

export function setupUI() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const userIdDisplay = document.getElementById('user-id-display');
    const loadingOverlay = document.getElementById('loading-overlay');

    // Update User ID display once authenticated
    document.addEventListener('authReady', (event) => {
        userIdDisplay.textContent = event.detail.userId;
        // Initialize deity manager once Firebase is ready
        initializeDeityManager(event.detail.db, event.detail.userId);
    });

    // Handle navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = link.getAttribute('href');
        });
    });
    
    window.addEventListener('hashchange', () => handleNavigation(window.location.hash));
    handleNavigation(window.location.hash); // Initial load based on hash

    // Setup chart (assuming it's in the Gameplay section)
    setupAttributesChart();

    // Setup Lore Library
    setupLoreLibrary(loadingOverlay); // Pass loading overlay to the lore manager
}

// Global UI functions (e.g., charts, general navigation)
function handleNavigation(hash) {
    if (!hash) hash = '#world';

    navLinks.forEach(link => {
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    contentSections.forEach(section => {
        if (`#${section.id}` === hash) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

function setupAttributesChart() {
    const ctx = document.getElementById('attributesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Health', 'Resilience', 'Endurance (Max Energy)', 'Stamina (Energy Regen)'],
            datasets: [{
                label: 'Base Attribute Concepts',
                data: [1000, 100, 100, 5], 
                backgroundColor: [
                    'rgba(239, 68, 68, 0.6)', 
                    'rgba(34, 197, 94, 0.6)', 
                    'rgba(59, 130, 246, 0.6)', 
                    'rgba(251, 191, 36, 0.6)',
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(251, 191, 36, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            const descriptions = {
                                'Health': 'Base HP. Increased by armor.',
                                'Resilience': 'Determines HP value of Vitality. Base 100.',
                                'Endurance (Max Energy)': 'Trainable. Increases max energy pool.',
                                'Stamina': 'Trainable. Increases energy recovery rate.'
                            };
                            return descriptions[context.label];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    display: false
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 14,
                            family: 'Inter'
                        }
                    }
                }
            }
        }
    });
}
