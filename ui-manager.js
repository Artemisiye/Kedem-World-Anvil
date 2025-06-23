// ui-manager.js
import { db, currentUserId, auth } from './firebase-init.js'; // Import Firebase instances and userId
import { initializeDeityManager } from './deity-manager.js'; // Import deity manager
import { setupLoreLibrary, fetchAndDisplayMarkdown } from './lore-library-manager.js'; // Import lore library manager and fetch function

// Declare UI elements globally within the module scope
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const userIdDisplay = document.getElementById('user-id-display');
const loadingOverlay = document.getElementById('loading-overlay');
const loreNoteTitle = document.getElementById('lore-note-title');
const loreNoteContent = document.getElementById('lore-note-content');
const loreNotesList = document.getElementById('lore-notes-list'); // Needed for highlighting in deep links

export function setupUI() {
    // Update User ID display once authenticated
    document.addEventListener('authReady', (event) => {
        userIdDisplay.textContent = event.detail.userId;
        // Initialize deity manager once Firebase is ready
        initializeDeityManager(event.detail.db, event.detail.userId);
    });

    // Handle navigation
    const homeLink = document.getElementById('home-link'); 
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#world';
        });
    }

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
    // Default to #world if no hash
    if (!hash) hash = '#world';

    // Remove active class from all nav links and content sections
    navLinks.forEach(link => link.classList.remove('active'));
    contentSections.forEach(section => section.classList.remove('active'));
    
    // Check for Lore Library deep link
    if (hash.startsWith('#lore-library:')) {
        const filePath = hash.substring('#lore-library:'.length);
        document.querySelector('a[href="#lore-library"]').classList.add('active'); // Activate Lore Library nav link
        document.getElementById('lore-library').classList.add('active'); // Activate Lore Library section
        fetchAndDisplayMarkdown(filePath, loadingOverlay, loreNoteTitle, loreNoteContent);
        
        // Also highlight the corresponding link in the sidebar's lore list
        document.querySelectorAll('#lore-notes-list a').forEach(el => el.classList.remove('bg-slate-300', 'font-semibold'));
        const correspondingLink = document.querySelector(`#lore-notes-list a[data-filepath-raw="${filePath}"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('bg-slate-300', 'font-semibold');
        }

    } else {
        // Handle standard section navigation
        const targetSectionId = hash.substring(1);
        const targetNavLink = document.querySelector(`a[href="${hash}"]`);
        const targetSection = document.getElementById(targetSectionId);

        if (targetNavLink) {
            targetNavLink.classList.add('active');
        }
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
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
