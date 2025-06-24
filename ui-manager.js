// ui-manager.js
import { db, currentUserId, auth, signInUser, signOutUser } from './firebase-init.js';
import { initializeDeityManager } from './deity-manager.js';
import { setupNoteLibrary, fetchAndDisplayNote } from './note-library-manager.js';
import { noteFiles } from './data-constants.js';

// --- NEW: Function to load shared HTML components ---
/**
 * Loads a shared HTML component (like the sidebar) into a placeholder element.
 * @param {string} placeholderId - The ID of the element to inject the HTML into.
 * @param {string} htmlFilePath - The path to the HTML component file.
 */
async function loadComponent(placeholderId, htmlFilePath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.error(`Placeholder element with ID '${placeholderId}' not found.`);
        return;
    }
    try {
        const response = await fetch(htmlFilePath);
        if (!response.ok) throw new Error(`Could not fetch ${htmlFilePath}`);
        const componentHtml = await response.text();
        placeholder.outerHTML = componentHtml; // Replace the placeholder div with the actual component content
    } catch (error) {
        console.error(`Error loading component: ${error}`);
        placeholder.innerHTML = '<p class="p-4 text-red-400">Error loading sidebar component.</p>';
    }
}


/**
 * Main setup function called on DOMContentLoaded for both pages.
 * Detects the current page and initializes relevant functionality.
 */
export async function setupUI() {
    // --- MODIFIED: Load shared sidebar component FIRST ---
    await loadComponent('sidebar-placeholder', '_sidebar.html');

    // Now that the sidebar is loaded, we can safely query for its elements.
    const loadingOverlay = document.getElementById('loading-overlay');
    const breadcrumbsContainer = document.getElementById('breadcrumbs-container');
    
    const currentPage = window.location.pathname.split('/').pop() || 'explorer.html';
    console.log(`Current page: ${currentPage}`);

    // Set up global navigation listeners and dynamic sidebar content
    setupGlobalNav(currentPage);

    // Set up auth controls and listeners (now that the sidebar exists)
    setupAuthControls(currentPage, loadingOverlay);

    // Page-specific initializations
    if (currentPage === 'explorer.html') {
        initExplorerPage(loadingOverlay, breadcrumbsContainer);
    } else if (currentPage === 'note-library.html') {
        // Delay to ensure the DOM is fully parsed after sidebar injection
        setTimeout(() => {
            initNoteLibraryPage(loadingOverlay, breadcrumbsContainer);
        }, 0);
    } else {
        console.warn(`Unknown page: ${currentPage}. No specific UI initialization.`);
    }
}

/**
 * Sets up listeners for sidebar navigation links and highlights the active page.
 * @param {string} currentPage - The filename of the current HTML page.
 */
function setupGlobalNav(currentPage) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    const noteLibraryNavContainer = document.getElementById('note-library-nav-container');

    if (currentPage === 'explorer.html') {
        // On explorer page, highlight the "World (Explorer)" link
        document.querySelector('a[data-nav-id="explorer"]').classList.add('active');
        // And show a normal link to the Note Library
        noteLibraryNavContainer.innerHTML = `<a href="note-library.html" class="nav-link flex items-center px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-slate-700">Note Library</a>`;

    } else if (currentPage === 'note-library.html') {
        // On note library page, show a non-clickable "active" block
        noteLibraryNavContainer.innerHTML = `<span class="sidebar-active-text flex items-center">Note Library</span>`;
        // And dynamically create the note list inside the sidebar's specific content area
        const sidebarContentArea = document.getElementById('sidebar-page-specific-content');
        if (sidebarContentArea) {
             sidebarContentArea.innerHTML = `
                <h3 class="text-xl font-bold text-teal-300 mb-3">Notes</h3>
                <input type="text" id="note-search-input" placeholder="Search notes..." class="w-full p-2 mb-3 rounded-md bg-slate-700 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400">
                <ul id="note-list" class="space-y-1">
                    <!-- Note list will be injected here by JavaScript -->
                </ul>
             `;
        }
    }
    
    // Add SPA-like navigation for explorer page links
    document.querySelectorAll('a[href^="explorer.html#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            if (currentPage === 'explorer.html') {
                e.preventDefault();
                window.location.hash = link.getAttribute('href').split('#')[1];
            }
        });
    });
}

/**
 * Sets up Firebase authentication controls and conditionally initializes managers.
 * @param {string} currentPage - The filename of the current HTML page.
 * @param {HTMLElement} loadingOverlay - The loading overlay element.
 */
function setupAuthControls(currentPage, loadingOverlay) {
    const authControlsContainer = document.createElement('div');
    authControlsContainer.className = "p-4 text-xs text-slate-400 border-t border-slate-700 flex flex-col space-y-2 mt-auto"; // mt-auto pushes it to the bottom
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
    const sidebar = document.querySelector('aside');
    if (sidebar) {
        sidebar.appendChild(authControlsContainer);
    } else {
        console.error("Sidebar element (<aside>) not found. Auth controls cannot be appended.");
        return;
    }

    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const authStatusText = document.getElementById('auth-status-text');
    const userIdDisplayMain = document.getElementById('user-id-display-main');
    const authErrorMessage = document.getElementById('auth-error-message');

    document.addEventListener('authReady', (event) => {
        const { userId, db, isEditor } = event.detail;

        if (userIdDisplayMain) userIdDisplayMain.textContent = userId || 'Not available';
        const loginForm = document.getElementById('login-form');

        if (userId) {
            if (authStatusText) authStatusText.textContent = isEditor ? 'Editor (Logged In)' : 'Logged In (Viewer)';
            if (loginForm) loginForm.classList.add('hidden');
            if (logoutButton) logoutButton.classList.remove('hidden');
        } else {
            if (authStatusText) authStatusText.textContent = 'Not logged in (Viewer)';
            if (loginForm) loginForm.classList.remove('hidden');
            if (logoutButton) logoutButton.classList.add('hidden');
        }

        if (currentPage === 'explorer.html') {
            initializeDeityManager(db, userId, isEditor);
        }
    });

    if (loginButton) {
        loginButton.addEventListener('click', async () => {
            const email = loginEmailInput.value;
            const password = loginPasswordInput.value;
            if (authErrorMessage) authErrorMessage.classList.add('hidden');
            if (email && password) {
                if (loadingOverlay) loadingOverlay.classList.remove('hidden');
                const result = await signInUser(email, password);
                if (!result.success) {
                    if (authErrorMessage) {
                        authErrorMessage.textContent = `Error: ${result.error}`;
                        authErrorMessage.classList.remove('hidden');
                    }
                }
                if (loadingOverlay) loadingOverlay.classList.add('hidden');
            } else {
                if (authErrorMessage) {
                    authErrorMessage.textContent = "Please enter email and password.";
                    authErrorMessage.classList.remove('hidden');
                }
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            if (authErrorMessage) authErrorMessage.classList.add('hidden');
            if (loadingOverlay) loadingOverlay.classList.remove('hidden');
            const result = await signOutUser();
            if (!result.success) {
                if (authErrorMessage) {
                    authErrorMessage.textContent = `Error logging out: ${result.error}`;
                    authErrorMessage.classList.remove('hidden');
                }
            } else {
                if (loginEmailInput) loginEmailInput.value = '';
                if (loginPasswordInput) loginPasswordInput.value = '';
            }
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
        });
    }
}


/**
 * Initializes functionality specific to the Kedem Explorer page (explorer.html).
 * @param {HTMLElement} loadingOverlay 
 * @param {HTMLElement} breadcrumbsContainer 
 */
function initExplorerPage(loadingOverlay, breadcrumbsContainer) {
    console.log("Initializing Explorer Page UI.");
    const contentSections = document.querySelectorAll('.content-section');

    setupAttributesChart();

    window.addEventListener('hashchange', () => handleExplorerNavigation(window.location.hash, contentSections, breadcrumbsContainer));
    handleExplorerNavigation(window.location.hash, contentSections, breadcrumbsContainer); // Initial load
}

/**
 * Handles navigation within the Explorer page (SPA-style hash navigation).
 * @param {string} hash - The current URL hash (e.g., "#world", "#pantheon").
 * @param {NodeListOf<Element>} contentSections 
 * @param {HTMLElement} breadcrumbsContainer 
 */
function handleExplorerNavigation(hash, contentSections, breadcrumbsContainer) {
    hash = hash || '#world'; // Default to #world
    if (!hash.startsWith('#')) hash = '#world';

    contentSections.forEach(section => section.classList.remove('active'));
    document.querySelectorAll('a[href^="explorer.html#"]').forEach(link => {
        link.classList.remove('active');
    });

    const targetSectionId = hash.substring(1);
    const targetSection = document.getElementById(targetSectionId);

    if (targetSection) {
        targetSection.classList.add('active');
        const correspondingNavLink = document.querySelector(`a[href="explorer.html#${targetSectionId}"]`);
        if (correspondingNavLink) correspondingNavLink.classList.add('active');
    } else {
        document.getElementById('world').classList.add('active');
        const worldNavLink = document.querySelector('a[href="explorer.html#world"]');
        if(worldNavLink) worldNavLink.classList.add('active');
        window.location.hash = '#world';
    }
    const sectionName = (targetSectionId.charAt(0).toUpperCase() + targetSectionId.slice(1)).replace('-', ' ');
    updateBreadcrumbs([{ name: 'Home', path: 'explorer.html#world' }, { name: sectionName }], breadcrumbsContainer);
}

/**
 * Initializes functionality specific to the Note Library page (note-library.html).
 * @param {HTMLElement} loadingOverlay 
 * @param {HTMLElement} breadcrumbsContainer 
 */
function initNoteLibraryPage(loadingOverlay, breadcrumbsContainer) {
    console.log("Initializing Note Library Page UI.");

    const noteListElement = document.getElementById('note-list');
    const noteContentElement = document.getElementById('note-content');
    const noteDisplayMainTitle = document.getElementById('note-display-title');

    if (!noteListElement || !noteContentElement || !noteDisplayMainTitle) {
        console.error("Note Library UI elements not found. Initialization aborted.");
        return;
    }

    setupNoteLibrary(loadingOverlay, noteListElement, noteContentElement, noteDisplayMainTitle);

    window.addEventListener('hashchange', () => handleNoteLibraryNavigation(window.location.hash, loadingOverlay, noteListElement, noteContentElement, noteDisplayMainTitle, breadcrumbsContainer));
    handleNoteLibraryNavigation(window.location.hash, loadingOverlay, noteListElement, noteContentElement, noteDisplayMainTitle, breadcrumbsContainer);
}

/**
 * Handles navigation within the Note Library page.
 * @param {string} hash 
 * @param {HTMLElement} loadingOverlay 
 * @param {HTMLElement} noteListElement 
 * @param {HTMLElement} noteContentElement 
 * @param {HTMLElement} noteDisplayMainTitle 
 * @param {HTMLElement} breadcrumbsContainer 
 */
function handleNoteLibraryNavigation(hash, loadingOverlay, noteListElement, noteContentElement, noteDisplayMainTitle, breadcrumbsContainer) {
    let filePathFromHash = '';
    if (hash.startsWith('#note-library:')) {
        filePathFromHash = decodeURIComponent(hash.substring('#note-library:'.length));
    }

    let fileToDisplay = filePathFromHash || (noteFiles.length > 0 ? noteFiles[0] : '');

    if (!fileToDisplay) {
        console.warn("No notes available to display.");
        return;
    }

    fetchAndDisplayNote(fileToDisplay, loadingOverlay, noteContentElement, noteDisplayMainTitle);

    // Update active state in note list
    if (noteListElement) {
        noteListElement.querySelectorAll('.note-list-item-link, .note-list-folder-toggle').forEach(el => el.classList.remove('active-note'));
        
        const correspondingLink = noteListElement.querySelector(`a[data-filepath-raw="${fileToDisplay}"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('active-note');
            let current = correspondingLink.parentElement;
            while(current) {
                if (current.classList.contains('folder-item')) {
                    const subList = current.querySelector('.folder-item-sub-list');
                    const toggle = current.querySelector('.note-list-folder-toggle');
                    if (subList && subList.classList.contains('hidden')) {
                        subList.classList.remove('hidden');
                        toggle.querySelector('.toggle-icon').classList.add('rotated');
                    }
                }
                current = current.parentElement;
            }
        }
    }
    
    const pathParts = fileToDisplay.replace('.md', '').split('/');
    const breadcrumbs = [{ name: 'Home', path: 'explorer.html#world' }, { name: 'Note Library', path: 'note-library.html' }];
    pathParts.forEach((part, index) => {
        breadcrumbs.push({ name: part.replace(/([A-Z])/g, ' $1').trim() });
    });
    updateBreadcrumbs(breadcrumbs, breadcrumbsContainer);
}


/**
 * Dynamically updates the breadcrumbs display.
 * @param {Array<Object>} crumbs - An array of objects like { name: 'Display Name', path: 'url_or_hash' }.
 * @param {HTMLElement} breadcrumbsContainer 
 */
function updateBreadcrumbs(crumbs, breadcrumbsContainer) {
    if (!breadcrumbsContainer) return;
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

// Chart setup for explorer page
function setupAttributesChart() {
    const ctx = document.getElementById('attributesChart');
    if (!ctx) return;
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Health', 'Resilience', 'Endurance (Max Energy)', 'Stamina (Energy Regen)'],
            datasets: [{
                label: 'Base Attribute Concepts',
                data: [1000, 100, 100, 5],
                backgroundColor: ['rgba(239, 68, 68, 0.6)', 'rgba(34, 197, 94, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(251, 191, 36, 0.6)'],
                borderColor: ['rgba(239, 68, 68, 1)', 'rgba(34, 197, 94, 1)', 'rgba(59, 130, 246, 1)', 'rgba(251, 191, 36, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, display: false }, x: { grid: { display: false } } }
        }
    });
}

// --- MODIFIED: Event listener to start the whole process ---
document.addEventListener('DOMContentLoaded', setupUI);
