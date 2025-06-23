// ui-manager.js
import { db, currentUserId, auth, signInUser, signOutUser } from './firebase-init.js'; 
import { initializeDeityManager } from './deity-manager.js'; 
import { setupNoteLibrary, fetchAndDisplayNote } from './note-library-manager.js'; 
import { noteFiles } from './data-constants.js'; 

// Global UI elements that are always present (sidebar, loading overlay, auth controls)
const navLinks = document.querySelectorAll('.nav-link');
const loadingOverlay = document.getElementById('loading-overlay');
const breadcrumbsContainer = document.getElementById('breadcrumbs-container');

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
    // Remove active class from all nav links first
    navLinks.forEach(link => {
        link.classList.remove('active'); 
    });

    // Highlight the appropriate navigation link/text based on the current page
    if (currentPage === 'explorer.html' || currentPage === '') {
        // For explorer.html, initial highlight is done in handleExplorerNavigation based on hash
        // Here, just make sure the 'Note Library' static text is NOT highlighted if present
        const noteLibraryStaticText = document.querySelector('.sidebar-active-text');
        if (noteLibraryStaticText) {
            noteLibraryStaticText.classList.remove('active');
        }
    } else if (currentPage === 'note-library.html') {
        // For note-library.html, the 'Note Library' is a static text with specific styling
        const noteLibraryStaticText = document.querySelector('.sidebar-active-text');
        if (noteLibraryStaticText) {
            noteLibraryStaticText.classList.add('active'); 
        }
        // Ensure no other .nav-link is active on this page if it's meant to be static
        navLinks.forEach(link => link.classList.remove('active'));
    }

    // Handle home link click
    const homeLink = document.getElementById('home-link'); 
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'explorer.html#world'; 
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const currentPageName = window.location.pathname.split('/').pop();

            // Handle internal SPA navigation for explorer.html 
            if (link.getAttribute('href').startsWith('explorer.html#') && 
                (currentPageName === 'explorer.html' || currentPageName === '')) { 
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
        const authErrorMessage = document.getElementById('auth-error-message'); 
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
            const authErrorMessage = document.getElementById('auth-error-message'); 
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
    console.log("Initializing Explorer Page UI.");
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

        // Remove active class from all content sections
        contentSections.forEach(section => section.classList.remove('active'));
        
        const targetSectionId = hash.substring(1);
        const targetSection = document.getElementById(targetSectionId);

        // Remove active class from all explorer nav links
        document.querySelectorAll('a[href^="explorer.html#"]').forEach(link => {
            link.classList.remove('active');
        });

        if (targetSection) {
            targetSection.classList.add('active');
            // Highlight the corresponding nav link based on its href
            const correspondingNavLink = document.querySelector(`a[href="explorer.html#${targetSectionId}"]`);
            if (correspondingNavLink) {
                correspondingNavLink.classList.add('active');
            }
        } else {
            // Default to 'world' section if target not found
            document.getElementById('world').classList.add('active'); 
            document.querySelector('a[href="explorer.html#world"]').classList.add('active');
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
    console.log("Initializing Note Library Page UI.");
    
    // Retrieve Note Library elements within this function scope for robustness
    const noteListElement = document.getElementById('note-list');
    const noteTitleElement = document.getElementById('note-title'); 
    const noteContentElement = document.getElementById('note-content');
    const noteDisplayMainTitle = document.getElementById('note-display-title'); 

    // Crucial check: Ensure all elements are found before proceeding
    if (!noteListElement || !noteTitleElement || !noteContentElement || !noteDisplayMainTitle) {
        console.error("Note Library UI elements (note-list, note-title, note-content, note-display-title) not found. Cannot initialize Note Library.");
        loadingOverlay.classList.add('hidden');
        // Display a user-facing error message in the main content area
        const mainContentArea = document.querySelector('main');
        if (mainContentArea) {
            mainContentArea.innerHTML = `
                <h2 class="text-4xl font-bold text-red-600 mb-6 border-b-4 border-red-400 pb-2">Error Loading Note Library</h2>
                <div class="bg-white p-6 rounded-xl shadow-sm text-base text-slate-700 leading-relaxed">
                    <p>There was a problem loading the Note Library. Some required HTML elements were not found.</p>
                    <p>Please ensure all IDs in note-library.html match those expected by the JavaScript.</p>
                    <p>If the issue persists, try clearing your browser cache and refreshing the page.</p>
                </div>
            `;
        }
        return; // Stop initialization if elements are not found
    }
    
    // Pass the retrieved DOM elements to setupNoteLibrary
    setupNoteLibrary(loadingOverlay, noteListElement, noteTitleElement, noteContentElement, noteDisplayMainTitle); 

    window.addEventListener('hashchange', () => handleNoteLibraryNavigation(window.location.hash));
    handleNoteLibraryNavigation(window.location.hash); // Initial load based on hash

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
                noteDisplayMainTitle.textContent = "No Notes Available"; 
                noteTitleElement.style.display = 'none'; 
                noteContentElement.innerHTML = "<p>The note library is empty or could not be loaded.</p>"; 
                loadingOverlay.classList.add('hidden');
                return;
            }
        }
        
        fetchAndDisplayNote(fileToDisplay, loadingOverlay, noteTitleElement, noteContentElement, noteDisplayMainTitle); 
        
        if (noteListElement) { 
            noteListElement.querySelectorAll('.note-list-item-link').forEach(el => el.classList.remove('active-note')); 
            const correspondingLink = noteListElement.querySelector(`a[data-filepath-raw="${fileToDisplay}"]`); 
            if (correspondingLink) {
                correspondingLink.classList.add('active-note'); 
                let parentUl = correspondingLink.closest('ul');
                while (parentUl && !parentUl.classList.contains('root-ul')) { 
                    if (parentUl.classList.contains('hidden')) {
                        parentUl.classList.remove('hidden');
                        const folderToggle = parentUl.previousElementSibling;
                        if (folderToggle && folderToggle.classList.contains('note-list-folder-toggle')) { 
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
