// ui-manager.js
import { db, currentUserId, auth, signInUser, signOutUser } from './firebase-init.js'; 
import { initializeDeityManager } from './deity-manager.js'; // Only imported/used if on explorer.html
import { setupNoteLibrary, fetchAndDisplayNote } from './note-library-manager.js'; // Only imported/used if on note-library.html
import { noteFiles } from './data-constants.js'; // Shared, used for wikilinks and note library logic

// Global UI elements that are always present (sidebar, loading overlay, auth controls)
const navLinks = document.querySelectorAll('.nav-link');
const loadingOverlay = document.getElementById('loading-overlay');
const breadcrumbsContainer = document.getElementById('breadcrumbs-container');

// IMPORTANT: These elements are now retrieved globally, assuming the script is loaded AFTER their HTML definition in index.html
// Corrected to use singular IDs as per index.html
const globalNoteList = document.getElementById('note-list'); 
const globalNoteTitle = document.getElementById('note-title'); 
const globalNoteContent = document.getElementById('note-content'); 
const globalNoteDisplayMainTitle = document.getElementById('note-display-title'); // The H2 title of the Note Library page


// Auth UI elements (dynamically appended by setupUI)
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

/**
 * Main setup function called on DOMContentLoaded for both pages.
 * Detects the current page and initializes relevant functionality.
 */
export function setupUI() {
    // Determine current page based on filename
    const currentPage = window.location.pathname.split('/').pop(); 
    console.log(`Current page: ${currentPage}`);

    // Set up global navigation listeners
    setupGlobalNav(currentPage);

    // Set up auth listeners
    setupAuthControls(currentPage); 

    // Page-specific initializations
    if (currentPage === 'explorer.html' || currentPage === '') { 
        initExplorerPage();
    } else if (currentPage === 'note-library.html') {
        initNoteLibraryPage();
    } else {
        console.warn(`Unknown page: ${currentPage}. No specific UI initialization.`);
    }
}

/**
 * Sets up listeners for sidebar navigation links and highlights the active page.
 * @param {string} currentPage - The filename of the current HTML page.
 */
function setupGlobalNav(currentPage) {
    navLinks.forEach(link => {
        link.classList.remove('active'); 
        const linkHref = link.getAttribute('href');

        // Logic to highlight the current main page/section
        if (currentPage === 'explorer.html' || currentPage === '') {
            const currentHash = window.location.hash || '#world';
            if (linkHref === `explorer.html${currentHash}` || (linkHref === 'explorer.html#world' && currentHash === '#world')) {
                link.classList.add('active');
            }
        } else if (currentPage === 'note-library.html') {
            if (linkHref === 'note-library.html') {
                link.classList.add('active');
            }
        }
    });

    const homeLink = document.getElementById('home-link'); 
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'explorer.html#world'; 
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Prevent default behavior for hash links managed by internal SPA logic
            if (link.getAttribute('href').startsWith('explorer.html#') && currentPage === 'explorer.html') {
                e.preventDefault();
                window.location.hash = link.getAttribute('href').split('#')[1];
            } else if (link.getAttribute('href').startsWith('note-library.html#note-library:') && currentPage === 'note-library.html') {
                 e.preventDefault();
                 window.location.hash = link.getAttribute('href').split('#')[1];
            }
        });
    });
}

/**
 * Sets up Firebase authentication controls and conditionally initializes managers.
 * @param {string} currentPage - The filename of the current HTML page.
 */
function setupAuthControls(currentPage) {
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
        
        if (currentPage === 'explorer.html' || currentPage === '') {
            initializeDeityManager(db, userId, isEditor);
        }
    });

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
}

/**
 * Initializes functionality specific to the Kedem Explorer page (explorer.html).
 */
function initExplorerPage() {
    console.log("Initializing Explorer Page UI...");
    const contentSections = document.querySelectorAll('.content-section'); 

    setupAttributesChart();

    window.addEventListener('hashchange', () => handleExplorerNavigation(window.location.hash));
    handleExplorerNavigation(window.location.hash); 

    /**
     * Handles navigation within the Explorer page (SPA-style hash navigation).
     * @param {string} hash - The current URL hash (e.g., "#world", "#pantheon").
     */
    function handleExplorerNavigation(hash) {
        if (!hash || !hash.startsWith('#')) hash = '#world';

        contentSections.forEach(section => section.classList.remove('active'));
        
        const targetSectionId = hash.substring(1);
        const targetSection = document.getElementById(targetSectionId);

        if (targetSection) {
            targetSection.classList.add('active');
        } else {
            document.getElementById('world').classList.add('active'); 
            window.location.hash = '#world';
        }

        const sectionName = (targetSectionId.charAt(0).toUpperCase() + targetSectionId.slice(1)).replace('-', ' ');
        updateBreadcrumbs([{ name: 'Home', path: 'explorer.html#world' }, { name: sectionName, path: `explorer.html#${targetSectionId}` }]);
    }
}

/**
 * Initializes functionality specific to the Note Library page (note-library.html).
 */
function initNoteLibraryPage() {
    console.log("Initializing Note Library Page UI...");
    
    // Retrieve Note Library elements once they are guaranteed to be in the DOM
    // These are already declared globally at the top of this file
    if (!globalNoteList || !globalNoteTitle || !globalNoteContent || !globalNoteDisplayMainTitle) {
        console.error("Note Library UI elements (note-list, note-title, note-content, note-display-title) not found. Cannot initialize Note Library.");
        loadingOverlay.classList.add('hidden');
        return;
    }
    
    // Pass the actual DOM elements to setupNoteLibrary
    setupNoteLibrary(loadingOverlay, globalNoteList, globalNoteTitle, globalNoteContent, globalNoteDisplayMainTitle); 

    window.addEventListener('hashchange', () => handleNoteLibraryNavigation(window.location.hash));
    handleNoteLibraryNavigation(window.location.hash); 

    /**
     * Handles navigation within the Note Library page (deep links to specific notes).
     * This is an SPA-like navigation for notes, not a full page reload.
     * @param {string} hash - The current URL hash (e.g., "#note-library:path/to/note.md").
     */
    function handleNoteLibraryNavigation(hash) {
        let filePathFromHash = '';
        if (hash.startsWith('#note-library:')) {
            filePathFromHash = hash.substring('#note-library:'.length);
        }

        let fileToDisplay = filePathFromHash;
        if (filePathFromHash === '' || !noteFiles.includes(filePathFromHash)) { 
            if (noteFiles.length > 0) { 
                fileToDisplay = noteFiles[0]; 
            } else {
                console.warn("No notes available in noteFiles array to display.");
                globalNoteDisplayMainTitle.textContent = "No Notes Available"; 
                globalNoteTitle.style.display = 'block'; // Ensure it's visible if content area is empty
                globalNoteTitle.textContent = "Select a note from the left panel to display its content."; 
                globalNoteContent.innerHTML = ""; // Clear content if no notes to display
                loadingOverlay.classList.add('hidden');
                return;
            }
        }
        
        fetchAndDisplayNote(fileToDisplay, loadingOverlay, globalNoteTitle, globalNoteContent, globalNoteDisplayMainTitle); 
        
        if (globalNoteList) { 
            globalNoteList.querySelectorAll('a').forEach(el => el.classList.remove('bg-slate-300', 'font-semibold')); 
            const correspondingLink = globalNoteList.querySelector(`a[data-filepath-raw="${fileToDisplay}"]`); 
            if (correspondingLink) {
                correspondingLink.classList.add('bg-slate-300', 'font-semibold');
                let parentUl = correspondingLink.closest('ul');
                while (parentUl && !parentUl.classList.contains('root-ul')) { 
                    if (parentUl.classList.contains('hidden')) {
                        parentUl.classList.remove('hidden');
                        const folderToggle = parentUl.previousElementSibling;
                        if (folderToggle && folderToggle.classList.contains('flex') && folderToggle.querySelector('.toggle-icon')) {
                             folderToggle.querySelector('.toggle-icon').textContent = '▼';
                        }
                    }
                    parentUl = parentUl.parentElement.closest('ul');
                }
            }
        }

        const pathParts = fileToDisplay.replace('.md', '').split('/');
        const breadcrumbs = [{ name: 'Home', path: 'explorer.html#world' }, { name: 'Note Library', path: 'note-library.html' }];
        pathParts.forEach((part, index) => {
            const currentPathSegment = pathParts.slice(0, index + 1).join('/');
            const displayName = part.replace(/([A-Z])/g, ' $1').trim(); 
            if (index === pathParts.length - 1) {
                breadcrumbs.push({ name: displayName }); 
            } else {
                breadcrumbs.push({ name: displayName, path: `note-library.html#note-library:${currentPathSegment}.md` });
            }
        });
        updateBreadcrumbs(breadcrumbs);
    }
}

/**
 * Dynamically updates the breadcrumbs display.
 * @param {Array<Object>} crumbs - An array of objects like { name: 'Display Name', path: 'url_or_hash' }.
 */
function updateBreadcrumbs(crumbs) {
    if (!breadcrumbsContainer) {
        console.warn("Breadcrumbs container not found.");
        return;
    }
    breadcrumbsContainer.innerHTML = ''; 
    crumbs.forEach((crumb, index) => {
        const span = document.createElement('span');
        if (index > 0) {
            span.innerHTML += ' &gt; '; 
        }
        if (index === crumbs.length - 1 || !crumb.path) { 
            span.innerHTML += `<span class="text-slate-700 font-semibold">${crumb.name}</span>`;
        } else {
            span.innerHTML += `<a href="${crumb.path}" class="text-amber-600 hover:underline">${crumb.name}</a>`;
        }
        breadcrumbsContainer.appendChild(span);
    });
}


// Function for the attributes chart (only on explorer page)
function setupAttributesChart() {
    const ctx = document.getElementById('attributesChart');
    if (!ctx) { 
        return;
    }
    const chartContext = ctx.getContext('2d');

    new Chart(chartContext, {
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

document.addEventListener('DOMContentLoaded', setupUI);
