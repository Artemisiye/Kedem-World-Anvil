// note-library-manager.js
import { noteFiles } from './data-constants.js';
import { markedInstance } from './markdown-parser.js';
import { updateBreadcrumbs } from './ui-manager.js';

// --- NEW: A cache to store pre-fetched note content ---
const noteCache = new Map();
const GITHUB_BASE_PATH = 'https://raw.githubusercontent.com/Artemisiye/Kedem-World-Anvil/main/notes/';

/**
 * Initializes the note library, pre-fetches all notes, and sets up UI.
 */
export async function setupNoteLibrary() {
    // Render the initial list structure immediately
    renderNoteList(noteFiles);
    
    // Start pre-fetching all notes in the background
    await prefetchAllNotes();

    // Set up search functionality after everything is loaded
    const noteSearchInput = document.getElementById('note-search-input');
    if (noteSearchInput) {
        noteSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredFiles = noteFiles.filter(file => file.toLowerCase().includes(searchTerm));
            renderNoteList(filteredFiles);
            // After filtering, re-apply active state based on current hash
            updateNoteListActiveState(window.location.hash.substring('#note-library:'.length));
        });
    }
}

/**
 * Pre-fetches all note files from GitHub and stores them in the local cache.
 */
async function prefetchAllNotes() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = loadingOverlay ? loadingOverlay.querySelector('span') : null;

    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
        if(loadingText) loadingText.textContent = 'Preparing library...';
    }

    let loadedCount = 0;
    const totalFiles = noteFiles.length;

    // Create an array of fetch promises
    const fetchPromises = noteFiles.map(filePath => 
        fetch(`${GITHUB_BASE_PATH}${filePath}`)
            .then(response => {
                if (!response.ok) {
                    // Don't throw; just log the error and return null content
                    console.error(`Failed to pre-fetch ${filePath}: ${response.statusText}`);
                    return null;
                }
                return response.text();
            })
            .then(text => {
                if (text !== null) {
                    noteCache.set(filePath, text);
                }
                loadedCount++;
                if (loadingText) {
                    // Update the loading text with progress
                    loadingText.textContent = `Loading Notes... ${loadedCount} / ${totalFiles}`;
                }
            })
            .catch(error => {
                console.error(`Network error pre-fetching ${filePath}:`, error);
                // Also update count on error to ensure progress bar completes
                loadedCount++;
                 if (loadingText) {
                    loadingText.textContent = `Loading Notes... ${loadedCount} / ${totalFiles}`;
                }
            })
    );

    // Wait for all fetches to settle (complete or fail)
    await Promise.all(fetchPromises);

    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
    console.log(`Note cache populated. ${noteCache.size} of ${totalFiles} notes loaded.`);
}

/**
 * Renders the hierarchical list of notes in the sidebar.
 * @param {string[]} files - An array of note file paths to render.
 */
function renderNoteList(files) {
    const noteListElement = document.getElementById('note-list');
    if (!noteListElement) return;
    
    noteListElement.innerHTML = '';
    const structure = buildFolderStructure(files);
    const listHtml = createListHtml(structure);
    noteListElement.innerHTML = listHtml;

    // Add event listeners after rendering
    noteListElement.querySelectorAll('.note-list-folder-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.nextElementSibling?.classList.toggle('hidden');
            toggle.querySelector('.toggle-icon')?.classList.toggle('rotated');
        });
    });

    noteListElement.querySelectorAll('.note-list-item-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filePath = e.currentTarget.dataset.filepathRaw;
            handleNoteLinkClick(filePath);
        });
    });
}

/**
 * A central handler for navigating to a note. Updates URL, content, and UI states.
 * @param {string} filePath - The path of the note to display.
 * @param {boolean} [pushState=true] - Whether to push a new state to the browser history.
 */
export function handleNoteLinkClick(filePath, pushState = true) {
    if (!filePath) return;
    
    const newHash = `#note-library:${filePath}`;
    if (pushState && window.location.hash !== newHash) {
        history.pushState({ filePath }, '', newHash);
    }

    displayNote(filePath);
    updateNoteListActiveState(filePath);
    updateNoteLibraryBreadcrumbs(filePath);
}

/**
 * Displays a note from the cache or falls back to fetching it.
 * @param {string} filePath - Path to the note file.
 */
async function displayNote(filePath) {
    const noteContentElement = document.getElementById('note-content');
    const noteDisplayMainTitle = document.getElementById('note-display-title');
    const loadingOverlay = document.getElementById('loading-overlay');

    if (!noteContentElement || !noteDisplayMainTitle) return;

    noteContentElement.innerHTML = ''; // Clear previous content immediately
    const displayName = filePath.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim();
    noteDisplayMainTitle.textContent = displayName;

    let markdownText;

    // --- PRIMARY CHANGE: Check cache first ---
    if (noteCache.has(filePath)) {
        markdownText = noteCache.get(filePath);
    } else {
        // Fallback: fetch the note if it wasn't in the cache (e.g., pre-fetch failed)
        console.warn(`Note "${filePath}" not in cache. Fetching on demand.`);
        if(loadingOverlay) loadingOverlay.classList.remove('hidden');
        try {
            const response = await fetch(`${GITHUB_BASE_PATH}${filePath}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            markdownText = await response.text();
            noteCache.set(filePath, markdownText); // Add to cache for next time
        } catch (error) {
            console.error('Error fetching on-demand:', error);
            noteContentElement.innerHTML = `<p class="text-red-600">Could not load note: ${error.message}</p>`;
            if(loadingOverlay) loadingOverlay.classList.add('hidden');
            return;
        } finally {
             if(loadingOverlay) loadingOverlay.classList.add('hidden');
        }
    }

    // Process and render the markdown
    const { propertiesHtml, contentMarkdown } = parseFrontmatter(markdownText);
    const finalContentHtml = propertiesHtml + markedInstance.parse(contentMarkdown);
    noteContentElement.innerHTML = finalContentHtml;

    // Re-attach listeners for internal links
    noteContentElement.querySelectorAll('a.internal-wikilink').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetFilePath = e.currentTarget.dataset.filepath;
            if (targetFilePath) handleNoteLinkClick(targetFilePath);
        });
    });
}


// --- Helper Functions (Unchanged) ---

function buildFolderStructure(files) {
    const structure = { folders: {}, files: [] };
    files.forEach(fullPath => {
        const parts = fullPath.split('/');
        let currentLevel = structure;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1) {
                currentLevel.files.push(fullPath);
            } else {
                if (!currentLevel.folders[part]) {
                    currentLevel.folders[part] = { folders: {}, files: [] };
                }
                currentLevel = currentLevel.folders[part];
            }
        }
    });
    return structure;
}

function createListHtml(data) {
    let html = '';
    const sortedFolderNames = Object.keys(data.folders).sort();
    const sortedFilePaths = (data.files || []).sort((a, b) => a.split('/').pop().localeCompare(b.split('/').pop()));

    sortedFolderNames.forEach(folderName => {
        html += `<li class="folder-item">
            <div class="note-list-folder-toggle">
                <svg class="toggle-icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                <span>${folderName}</span>
            </div>
            <ul class="folder-item-sub-list hidden">${createListHtml(data.folders[folderName])}</ul>
        </li>`;
    });

    sortedFilePaths.forEach(file => {
        const displayName = file.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim();
        html += `<li><a href="#" class="note-list-item-link" data-filepath-raw="${file}">${displayName}</a></li>`;
    });

    return html;
}

function parseFrontmatter(markdownText) {
    const lines = markdownText.split('\n');
    let inFrontmatter = false, foundFirstDashLine = false, propertiesHtml = '', contentLines = [];
    
    for (const line of lines) {
        if (line.trim() === '---') {
            if (!foundFirstDashLine) { inFrontmatter = true; foundFirstDashLine = true; continue; }
            if (inFrontmatter) { inFrontmatter = false; continue; }
        }
        if (inFrontmatter) { propertiesHtml += parsePropertyLine(line); } 
        else { contentLines.push(line); }
    }
    
    const finalPropertiesHtml = propertiesHtml ? `<div class="properties-box mb-6"><div class="properties-box-title"><svg class="w-4 h-4 mr-1 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.325-.325-.79-.5-1.276-.5H9.234c-.486 0-.95.175-1.276.5L4.475 7.127a3.003 3.003 0 00-1.077 1.772l-.71 3.551A.5.5 0 003 13.5h14a.5.5 0 00.312-.92l-.71-3.551a3.003 3.003 0 00-1.077-1.772l-3.743-3.957zM10 15a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path></svg>Properties</div>${propertiesHtml}</div>` : '';
    return { propertiesHtml: finalPropertiesHtml, contentMarkdown: contentLines.join('\n') };
}

function parsePropertyLine(line) {
    const parts = line.split(':');
    const key = parts[0].trim();
    const value = parts.slice(1).join(':').trim();
    if (!key || !value) return '';

    let valueHtml = (key.toLowerCase() === 'tags')
        ? value.split(/[\s,-]+/).map(t => t.trim()).filter(t => t && t !== '-').map(tag => `<span class="tag-chip">${tag.replace('#', '')}</span>`).join('')
        : markedInstance.parseInline(value.replace(/^- /, ''));

    return `<div class="properties-item"><div class="properties-label">${key.charAt(0).toUpperCase() + key.slice(1)}</div><div class="properties-value">${valueHtml}</div></div>`;
}

function updateNoteListActiveState(filePath) {
    const noteListElement = document.getElementById('note-list');
    if (!noteListElement) return;

    noteListElement.querySelectorAll('.note-list-item-link').forEach(el => el.classList.remove('active-note'));
    
    const activeLink = noteListElement.querySelector(`a[data-filepath-raw="${filePath}"]`);
    if (activeLink) {
        activeLink.classList.add('active-note');
        let current = activeLink.parentElement;
        while (current && current !== noteListElement) {
            if (current.classList.contains('folder-item-sub-list') && current.classList.contains('hidden')) {
                current.classList.remove('hidden');
                const toggle = current.previousElementSibling;
                toggle?.querySelector('.toggle-icon')?.classList.add('rotated');
            }
            current = current.parentElement;
        }
    }
}

function updateNoteLibraryBreadcrumbs(filePath) {
    const pathParts = filePath.replace('.md', '').split('/');
    const breadcrumbs = [{ name: 'Note Library', path: `note-library.html` }];

    let currentPath = '';
    pathParts.forEach((part, index) => {
        currentPath += (index > 0 ? '/' : '') + part;
        const displayName = part.replace(/([A-Z])/g, ' $1').trim();
        const isLast = index === pathParts.length - 1;
        const folderNotePath = `${currentPath}.md`;
        const hasFolderNote = !isLast && noteFiles.includes(folderNotePath);
        breadcrumbs.push({ name: displayName, path: hasFolderNote ? `note-library.html#note-library:${folderNotePath}` : null });
    });
    updateBreadcrumbs(breadcrumbs);
}
