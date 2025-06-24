// ui-manager.js
import { db, currentUserId, auth, signInUser, signOutUser } from './firebase-init.js';
import { initializeDeityManager } from './deity-manager.js';
import { setupNoteLibrary, handleNoteLinkClick } from './note-library-manager.js';
import { noteFiles } from './data-constants.js';

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
        placeholder.outerHTML = componentHtml;
    } catch (error) {
        console.error(`Error loading component: ${error}`);
        placeholder.innerHTML = '<p class="p-4 text-red-400">Error loading sidebar component.</p>';
    }
}

/**
 * Main setup function called on DOMContentLoaded for both pages.
 */
export async function setupUI() {
    await loadComponent('sidebar-placeholder', '_sidebar.html');

    const loadingOverlay = document.getElementById('loading-overlay');
    // Ensure currentPage defaults to explorer.html if the path is empty (root)
    const currentPage = window.location.pathname.split('/').pop() || 'explorer.html';
    
    setupGlobalNav(currentPage);
    setupAuthControls(currentPage, loadingOverlay);

    if (currentPage === 'explorer.html') {
        initExplorerPage();
    } else if (currentPage === 'note-library.html') {
        initNoteLibraryPage();
    }
}

/**
 * Sets up the main sidebar navigation based on the current page.
 * @param {string} currentPage - The filename of the current HTML page.
 */
function setupGlobalNav(currentPage) {
    const mainNavContainer = document.getElementById('main-navigation');
    if (!mainNavContainer) return;

    const isExplorer = currentPage === 'explorer.html';
    const isLibrary = currentPage === 'note-library.html';

    let navHtml = '';

    if (isExplorer) {
        // Build the full navigation for the Explorer page
        navHtml = `
            <a href="explorer.html#world" data-nav-id="world" class="nav-link flex items-center px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-slate-700">The World (Explorer)</a>
            <a href="explorer.html#pantheon" data-nav-id="pantheon" class="nav-link flex items-center px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-slate-700">The Pantheon</a>
            <a href="explorer.html#bestiary" data-nav-id="bestiary" class="nav-link flex items-center px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-slate-700">Bestiary</a>
            <a href="explorer.html#gameplay" data-nav-id="gameplay" class="nav-link flex items-center px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-slate-700">Gameplay & Mechanics</a>
            <a href="note-library.html" class="nav-link flex items-center px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-slate-700">Note Library</a>
        `;
    } else if (isLibrary) {
        // Build the simplified navigation for the Note Library page
        navHtml = `
            <a href="explorer.html" class="nav-link flex items-center px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-slate-700">The World (Explorer)</a>
            <span class="sidebar-active-text">Note Library</span>
        `;
    }
    
    mainNavContainer.innerHTML = navHtml;
    
    // Add SPA-like hash navigation event listeners ONLY for explorer page links
    mainNavContainer.querySelectorAll('a[href^="explorer.html#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            if (isExplorer) {
                e.preventDefault();
                window.location.hash = link.getAttribute('href').split('#')[1];
            }
        });
    });
}


/**
 * Sets up Firebase authentication controls and listeners.
 * @param {string} currentPage - The filename of the current HTML page.
 * @param {HTMLElement} loadingOverlay - The loading overlay element.
 */
function setupAuthControls(currentPage, loadingOverlay) {
    const authControlsContainer = document.createElement('div');
    authControlsContainer.className = "p-4 text-xs text-slate-400 border-t border-slate-700 flex flex-col space-y-2 mt-auto";
    // Using simplified innerHTML for setup
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

    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const authErrorMessage = document.getElementById('auth-error-message');

    document.addEventListener('authReady', (event) => {
        const { userId, db, isEditor } = event.detail;
        const userIdDisplay = document.getElementById('user-id-display-main');
        const authStatusText = document.getElementById('auth-status-text');
        const loginForm = document.getElementById('login-form');

        if (userIdDisplay) userIdDisplay.textContent = userId || 'Not available';
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

    loginButton.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        authErrorMessage.classList.add('hidden');
        if (email && password) {
            loadingOverlay.classList.remove('hidden');
            const result = await signInUser(email, password);
            if (!result.success) {
                authErrorMessage.textContent = `Error: ${result.error}`;
                authErrorMessage.classList.remove('hidden');
            }
            loadingOverlay.classList.add('hidden');
        }
    });

    logoutButton.addEventListener('click', () => signOutUser());
}

/**
 * Initializes functionality specific to the Kedem Explorer page.
 */
function initExplorerPage() {
    console.log("Initializing Explorer Page UI.");
    setupAttributesChart();
    window.addEventListener('hashchange', () => handleExplorerNavigation(window.location.hash));
    handleExplorerNavigation(window.location.hash); // Initial call
}

/**
 * Handles SPA-style hash navigation within the Explorer page.
 * @param {string} hash - The current URL hash (e.g., "#world").
 */
function handleExplorerNavigation(hash) {
    const targetSectionId = (hash && hash.startsWith('#')) ? hash.substring(1) : 'world';
    
    const contentSections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('#main-navigation .nav-link');

    contentSections.forEach(section => section.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));

    const targetSection = document.getElementById(targetSectionId);
    
    if (targetSection) {
        targetSection.classList.add('active');
        const activeLink = document.querySelector(`a[data-nav-id="${targetSectionId}"]`);
        if (activeLink) activeLink.classList.add('active');
    } else {
        document.getElementById('world').classList.add('active');
        document.querySelector('a[data-nav-id="world"]').classList.add('active');
    }
    
    const sectionName = (targetSectionId.charAt(0).toUpperCase() + targetSectionId.slice(1));
    const breadcrumbData = [{ name: 'Home', path: 'explorer.html#world' }];
    if (targetSectionId !== 'world') {
        breadcrumbData.push({ name: sectionName });
    }
    updateBreadcrumbs(breadcrumbData);
}

/**
 * Initializes functionality specific to the Note Library page.
 */
function initNoteLibraryPage() {
    console.log("Initializing Note Library Page UI.");
    const sidebarContentArea = document.getElementById('sidebar-page-specific-content');
    if (sidebarContentArea) {
         sidebarContentArea.innerHTML = `
            <h3 class="text-xl font-bold text-teal-300 mb-3">Notes</h3>
            <div id="loading-indicator-notes" class="text-sm text-slate-400 mb-2">Preparing library...</div>
            <input type="text" id="note-search-input" placeholder="Search notes..." class="w-full p-2 mb-3 rounded-md bg-slate-700 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400">
            <ul id="note-list" class="space-y-1"></ul>`;
    }

    setupNoteLibrary();
    window.addEventListener('hashchange', () => handleNoteLibraryHashChange());
    handleNoteLibraryHashChange();
}

/**
 * Handles hash changes on the Note Library page (for back/forward buttons).
 */
function handleNoteLibraryHashChange() {
    let filePathFromHash = '';
    if (window.location.hash.startsWith('#note-library:')) {
        filePathFromHash = decodeURIComponent(window.location.hash.substring('#note-library:'.length));
    }
    const fileToDisplay = filePathFromHash || (noteFiles.length > 0 ? noteFiles[0] : '');
    if (fileToDisplay) {
        handleNoteLinkClick(fileToDisplay, false);
    }
}

/**
 * Dynamically updates the breadcrumbs display.
 * @param {Array<Object>} crumbs - Array of { name: 'Display Name', path: 'url_or_hash' }.
 */
export function updateBreadcrumbs(crumbs) {
    const breadcrumbsContainer = document.getElementById('breadcrumbs-container');
    if (!breadcrumbsContainer) return;
    breadcrumbsContainer.innerHTML = '';
    crumbs.forEach((crumb, index) => {
        const span = document.createElement('span');
        if (index > 0) {
            span.innerHTML += ' <span class="text-slate-400">&gt;</span> ';
        }
        if (!crumb.path) {
            span.innerHTML += `<span class="text-slate-700 font-semibold">${crumb.name}</span>`;
        } else {
            const link = document.createElement('a');
            link.href = crumb.path;
            link.className = 'text-amber-600 hover:underline';
            link.textContent = crumb.name;
            if(crumb.path.startsWith('note-library.html#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const filePath = crumb.path.split(':')[1];
                    handleNoteLinkClick(filePath);
                });
            } else if (crumb.path.startsWith('explorer.html#')) {
                 link.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.hash = crumb.path.split('#')[1];
                });
            }
            span.appendChild(link);
        }
        breadcrumbsContainer.appendChild(span);
    });
}

/**
 * Sets up the attributes chart on the explorer page.
 */
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

document.addEventListener('DOMContentLoaded', setupUI);
