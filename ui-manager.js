// ui-manager.js
import { db, currentUserId, auth, signInUser, signOutUser } from './firebase-init.js'; 
import { initializeDeityManager } from './deity-manager.js'; 
import { setupNoteLibrary, fetchAndDisplayNote } from './note-library-manager.js'; // Renamed import
import { noteFiles } from './data-constants.js'; // Renamed import

// Declare UI elements globally within the module scope for accessibility
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const loadingOverlay = document.getElementById('loading-overlay');
const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const noteList = document.getElementById('note-list'); 

// New UI elements for login/logout (created once and appended)
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
        <p id="auth-error-message" class="text-red-300 text-xs mt-1 hidden"></p>
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
const userIdDisplayMain = document.getElementById('user-id-display-main'); 


export function setupUI() {
    // Listen for authReady event to update UI and initialize managers
    document.addEventListener('authReady', (event) => {
        const { userId, db, auth, isEditor } = event.detail;

        userIdDisplayMain.textContent = userId || 'Not available';
        if (userId) {
            authStatusText.textContent = isEditor ? 'Editor (Logged In)' : 'Logged In (Viewer)';
            document.getElementById('login-form').classList.add('hidden');
            logoutButton.classList.remove('hidden');
        } else {
            authStatusText.textContent = 'Not logged in (Viewer)'; 
            document.getElementById('login-form').classList.remove('hidden'); 
            logoutButton.classList.add('hidden');
        }
        
        initializeDeityManager(db, userId, isEditor);
    });

    // Handle login/logout clicks
    loginButton.addEventListener('click', async () => {
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        authErrorMessage.classList.add('hidden'); 
        if (email && password) {
            loadingOverlay.classList.remove('hidden');
            const result = await signInUser(email, password);
            if (!result.success) {
                authErrorMessage.textContent = `Error: ${result.error}`;
                authErrorMessage.classList.remove('hidden');
            }
            loadingOverlay.classList.add('hidden');
        } else {
            authErrorMessage.textContent = "Please enter email and password.";
            authErrorMessage.classList.remove('hidden');
        }
    });

    logoutButton.addEventListener('click', async () => {
        loadingOverlay.classList.remove('hidden');
        const result = await signOutUser();
        if (!result.success) {
            authErrorMessage.textContent = `Error logging out: ${result.error}`;
            authErrorMessage.classList.remove('hidden');
        } else {
            loginEmailInput.value = '';
            loginPasswordInput.value = '';
        }
        loadingOverlay.classList.add('hidden');
    });

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
    
    // Pass noteFiles to handleNavigation via the global window object.
    // The handleNavigation function will then call fetchAndDisplayNote,
    // which also relies on window.noteFiles (from markdown-parser.js and data-constants.js).
    window.addEventListener('hashchange', () => handleNavigation(window.location.hash));
    handleNavigation(window.location.hash); 

    setupAttributesChart();
    setupNoteLibrary(loadingOverlay); 
}

function handleNavigation(hash) {
    if (!hash) hash = '#world';

    navLinks.forEach(link => link.classList.remove('active'));
    contentSections.forEach(section => section.classList.remove('active'));
    
    // Updated to use the new section name and handle default note display
    if (hash.startsWith('#note-library')) { // Check for base #note-library as well
        const filePathFromHash = hash.substring('#note-library:'.length);
        document.querySelector('a[href="#note-library"]').classList.add('active'); // Activate Note Library nav link
        document.getElementById('note-library').classList.add('active'); // Activate Note Library section (by ID)
        
        let fileToDisplay = filePathFromHash;
        // Logic to display the first note if no specific file is requested or if the path is invalid
        if (filePathFromHash === '' || filePathFromHash === 'note-library' || !noteFiles.includes(filePathFromHash)) { // Renamed noteFiles
            if (noteFiles.length > 0) { // Renamed noteFiles
                fileToDisplay = noteFiles[0]; // Display the first note by default
            } else {
                console.warn("No notes available in noteFiles array to display.");
                noteTitle.textContent = "No Notes Available"; // Use renamed variable
                noteContent.innerHTML = "<p>The note library is empty or could not be loaded.</p>"; // Use renamed variable
                loadingOverlay.classList.add('hidden');
                return; // Exit if no files to display
            }
        }
        
        // Pass noteTitle, noteContent to the fetch function directly
        fetchAndDisplayNote(fileToDisplay, loadingOverlay, noteTitle, noteContent); // Renamed function and variables
        
        document.querySelectorAll('#note-list a').forEach(el => el.classList.remove('bg-slate-300', 'font-semibold')); // Renamed ID
        const correspondingLink = document.querySelector(`#note-list a[data-filepath-raw="${fileToDisplay}"]`); // Renamed ID
        if (correspondingLink) {
            correspondingLink.classList.add('bg-slate-300', 'font-semibold');
        }

    } else {
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
