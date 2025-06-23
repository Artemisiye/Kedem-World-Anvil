// lore-library-manager.js

import { loreFiles } from './data-constants.js'; // Import loreFiles from constants

// Marked.js is globally available via CDN link in index.html, no import needed here.

export function setupLoreLibrary(loadingOverlay) {
    const loreNotesList = document.getElementById('lore-notes-list');
    const loreNoteTitle = document.getElementById('lore-note-title');
    const loreNoteContent = document.getElementById('lore-note-content');
    loreNotesList.innerHTML = ''; 

    // Function to build the folder structure recursively
    function buildFolderStructure(files) {
        const structure = { folders: {}, files: [] };

        files.forEach(fullPath => {
            const parts = fullPath.split('/');
            let currentLevel = structure;

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                if (i === parts.length - 1) { // It's a file
                    if (!currentLevel.files) {
                        currentLevel.files = [];
                    }
                    currentLevel.files.push(fullPath);
                } else { // It's a folder
                    if (!currentLevel.folders[part]) {
                        currentLevel.folders[part] = { folders: {}, files: [] };
                    }
                    currentLevel = currentLevel.folders[part];
                }
            }
        });
        return structure;
    }

    const organizedFiles = buildFolderStructure(loreFiles);

    function createList(data) {
        const ul = document.createElement('ul');
        ul.className = 'ml-0 space-y-1'; // Start with no left margin for the top level

        // Sort folders and files alphabetically
        const sortedFolderNames = Object.keys(data.folders).sort();
        const sortedFilePaths = (data.files || []).sort((a, b) => {
            const nameA = a.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim();
            const nameB = b.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim();
            return nameA.localeCompare(nameB);
        });

        sortedFolderNames.forEach(folderName => {
            const li = document.createElement('li');
            li.className = 'folder-item';
            
            const folderToggle = document.createElement('div');
            folderToggle.className = 'flex items-center cursor-pointer px-2 py-1 rounded-lg text-slate-800 hover:bg-slate-200 transition-colors duration-200 font-semibold';
            folderToggle.innerHTML = `<span class="toggle-icon mr-2">▶</span> ${folderName}`;
            li.appendChild(folderToggle);

            const subList = createList(data.folders[folderName]);
            subList.classList.add('hidden'); // Start collapsed
            li.appendChild(subList);

            folderToggle.addEventListener('click', () => {
                subList.classList.toggle('hidden');
                folderToggle.querySelector('.toggle-icon').textContent = subList.classList.contains('hidden') ? '▶' : '▼';
            });
            ul.appendChild(li);
        });

        sortedFilePaths.forEach(file => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#`; 
            const displayName = file.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim(); 
            link.textContent = displayName;
            link.className = 'block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors duration-200';
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                await fetchAndDisplayMarkdown(file, loadingOverlay, loreNoteTitle, loreNoteContent, loreFiles); // Pass loreFiles for wikilink resolution
                document.querySelectorAll('#lore-notes-list a').forEach(el => el.classList.remove('bg-slate-300', 'font-semibold'));
                link.classList.add('bg-slate-300', 'font-semibold');
            });
            listItem.appendChild(link);
            ul.appendChild(listItem);
        });
        return ul;
    }

    loreNotesList.appendChild(createList(organizedFiles));
}

async function fetchAndDisplayMarkdown(filePath, loadingOverlay, loreNoteTitle, loreNoteContent, allLoreFiles) {
    loadingOverlay.classList.remove('hidden');
    const rawGitHubUrl = `https://raw.githubusercontent.com/Artemisiye/Kedem-World-Anvil/main/notes/${filePath}`;
    
    try {
        const response = await fetch(rawGitHubUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - Could not access raw file. Ensure it's public and path is correct.`);
        }
        const markdownText = await response.text();
        
        // Re-configure Marked.js for each render to ensure correct context for wikilinks
        marked.use({
            extensions: [{
                name: 'wikilink',
                level: 'inline',
                start(src) { return src.indexOf('[['); },
                tokenizer(src, tokens) {
                    const rule = /^\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]/;
                    const match = rule.exec(src);
                    if (match) {
                        const targetWikiName = match[1];
                        const linkText = match[2] || targetWikiName.split('/').pop().replace(/([A-Z])/g, ' $1').trim(); // Default display text

                        // Attempt to find the full path in loreFiles
                        let resolvedFilePath = allLoreFiles.find(f => 
                            f.toLowerCase() === `${targetWikiName.toLowerCase()}.md` || // Direct match
                            f.toLowerCase() === `world building/gods/${targetWikiName.toLowerCase()}.md` || // Common sub-folder for gods
                            f.toLowerCase().endsWith(`/${targetWikiName.toLowerCase()}.md`) // Ends with the name
                        );
                        
                        let href;
                        if (resolvedFilePath) {
                            // If found, link to the local handler (for in-app navigation)
                            // This will be handled by a custom click event on the rendered link
                            // For now, let's make it a unique class so we can attach an event listener globally
                            href = `javascript:void(0);`; // Placeholder, actual navigation via JS
                            return {
                                type: 'wikilink',
                                raw: match[0],
                                page: targetWikiName,
                                text: linkText,
                                href: href,
                                resolvedPath: resolvedFilePath // Store resolved path
                            };
                        } else {
                            // Fallback: Link directly to GitHub if not found internally
                            href = `https://github.com/Artemisiye/Kedem-World-Anvil/blob/main/notes/${targetWikiName.replace(/ /g, '%20')}.md`;
                             return {
                                type: 'wikilink',
                                raw: match[0],
                                page: targetWikiName,
                                text: linkText,
                                href: href
                            };
                        }
                    }
                },
                renderer(token) {
                    if (token.resolvedPath) {
                        // For internally resolvable links, add a specific class and data attribute
                        return `<a href="${token.href}" class="wikilink internal-wikilink" data-filepath="${token.resolvedPath}">${token.text}</a>`;
                    } else {
                        // For external links, open in new tab
                        return `<a href="${token.href}" class="wikilink" target="_blank">${token.text}</a>`;
                    }
                }
            }]
        });
        marked.setOptions({ breaks: true }); // Ensure breaks option is always set for this parser instance

        loreNoteTitle.textContent = filePath.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim(); // Clean filename for display
        loreNoteContent.innerHTML = marked.parse(markdownText); // Parse Markdown to HTML

        // Add event listeners for internal wikilinks *after* rendering
        loreNoteContent.querySelectorAll('a.internal-wikilink').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetFilePath = e.target.dataset.filepath;
                if (targetFilePath) {
                    fetchAndDisplayMarkdown(targetFilePath, loadingOverlay, loreNoteTitle, loreNoteContent, allLoreFiles);
                    // Also update active state in the left panel for the clicked internal link
                    document.querySelectorAll('#lore-notes-list a').forEach(el => el.classList.remove('bg-slate-300', 'font-semibold'));
                    const correspondingLink = document.querySelector(`#lore-notes-list a[data-filepath-raw="${targetFilePath}"]`);
                    if (correspondingLink) {
                        correspondingLink.classList.add('bg-slate-300', 'font-semibold');
                    }
                }
            });
        });
        
    } catch (error) {
        console.error('Error fetching Markdown file:', error);
        loreNoteTitle.textContent = `Error loading ${filePath.split('/').pop().replace('.md', '')}`;
        loreNoteContent.innerHTML = `<p class="text-red-600">Could not load note. Please ensure the file path is correct and the file is publicly accessible.</p><p>Error: ${error.message}</p>`;
    } finally {
        loadingOverlay.classList.add('hidden');
    }
}
