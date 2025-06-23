// ui-manager.js
import { db, currentUserId, auth, signInUser, signOutUser } from './firebase-init.js'; // Import Firebase instances, userId, and new auth functions
import { initializeDeityManager } from './deity-manager.js'; 
import { setupLoreLibrary } from './lore-library-manager.js'; 

// Declare UI elements globally within the module scope
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const userIdDisplay = document.getElementById('user-id-display');
const loadingOverlay = document.getElementById('loading-overlay');
const loreNoteTitle = document.getElementById('lore-note-title');
const loreNoteContent = document.getElementById('lore-note-content');
const loreNotesList = document.getElementById('lore-notes-list'); // Needed for highlighting in deep links

// New UI elements for login/logout
const authControlsContainer = document.createElement('div');
authControlsContainer.className = "p-4 text-xs text-slate-400 border-t border-slate-700 flex flex-col space-y-2";
authControlsContainer.innerHTML = `
    <div id="auth-status-display">
        User ID: <span id="user-id-display-main">Loading...</span><br>
        Status: <span id="auth-status-text">Not logged in</span>
    </div>
    <div id="login-form" class="space-y-2">
        <input type="email" id="login-email" placeholder="Email" class="w-full p-2 rounded-md bg-slate-700 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400">
        <input type="password" id="login-password" placeholder="Password" class="w-full p-2 rounded-md bg-slate-700 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400">
        <button id="login-button" class="w-full bg-amber-600 text-white py-2 rounded-md hover:bg-amber-700 transition-colors duration-200 text-sm font-semibold">Login</button>
        <p id="auth-error-message" class="text-red-300 text-xs mt-1 hidden">Error: </p>
    </div>
    <button id="logout-button" class="w-full bg-slate-600 text-white py-2 rounded-md hover:bg-slate-700 transition-colors duration-200 text-sm font-semibold hidden">Logout</button>
`;
document.querySelector('aside').appendChild(authControlsContainer);

const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const authStatusText = document.getElementById('auth-status-text');
const authErrorMessage = document.getElementById('auth-error-message');
const userIdDisplayMain = document.getElementById('user-id-display-main'); // Reference the new display element


export function setupUI() {
    // Update User ID and authentication status display once authenticated
    document.addEventListener('authReady', (event) => {
        userIdDisplayMain.textContent = event.detail.userId || 'N/A';
        if (event.detail.userId) {
            authStatusText.textContent = event.detail.isEditor ? 'Editor (Logged In)' : 'Logged In';
            document.getElementById('login-form').classList.add('hidden');
            logoutButton.classList.remove('hidden');
        } else {
            authStatusText.textContent = 'Not logged in';
            document.getElementById('login-form').classList.remove('hidden');
            logoutButton.classList.add('hidden');
        }
        // Initialize deity manager once Firebase is ready and we have editor status
        initializeDeityManager(event.detail.db, event.detail.userId, event.detail.isEditor);
    });

    // Handle login/logout clicks
    loginButton.addEventListener('click', async () => {
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        authErrorMessage.classList.add('hidden'); // Hide previous errors
        if (email && password) {
            const result = await signInUser(email, password);
            if (!result.success) {
                authErrorMessage.textContent = `Error: ${result.error}`;
                authErrorMessage.classList.remove('hidden');
            }
        } else {
            authErrorMessage.textContent = "Please enter email and password.";
            authErrorMessage.classList.remove('hidden');
        }
    });

    logoutButton.addEventListener('click', async () => {
        const result = await signOutUser();
        if (!result.success) {
            authErrorMessage.textContent = `Error logging out: ${result.error}`;
            authErrorMessage.classList.remove('hidden');
        }
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
    setupLoreLibrary(loadingOverlay); 
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
        // Need to pass loreFiles to fetchAndDisplayMarkdown for wikilink resolution
        // This is a bit tricky with module imports, but we can make loreFiles global or pass it down.
        // For now, let's keep it simple and assume loreFiles is accessible via its import in lore-library-manager.js
        // The fetchAndDisplayMarkdown function itself doesn't directly rely on the loreFiles *array* for its core logic once imported.
        // It uses it for wikilink resolution, which is handled in the marked.use extension.
        setupLoreLibrary(loadingOverlay); // Re-render the folder structure
        fetchAndDisplayMarkdown(filePath, loadingOverlay, document.getElementById('lore-note-title'), document.getElementById('lore-note-content')); // Assuming these are globally accessible DOM elements
        
        // Also highlight the corresponding link in the sidebar's lore list
        document.querySelectorAll('#lore-notes-list a').forEach(el => el.classList.remove('bg-slate-300', 'font-semibold'));
        // Find the link by its data-filepath-raw attribute
        const correspondingLink = document.querySelector(`#lore-notes-list a[data-filepath-raw="${filePath}"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('bg-slate-300', 'font-semibold');
            // Optional: Expand parent folders if necessary (more complex UI logic)
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
