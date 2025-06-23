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

            // Add visual indent for sub-folders
            const subList = createList(data.folders[folderName]);
            subList.classList.add('hidden', 'ml-4', 'border-l', 'border-slate-300', 'pl-2'); // Add indent and border
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
            link.href = `#lore-library:${file}`; // Update hash for history API
            // Add a data attribute with the raw file path for easy lookup when navigating via URL hash
            link.dataset.filepathRaw = file; 
            const displayName = file.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim(); 
            link.textContent = displayName;
            link.className = 'block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors duration-200';
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                // Update URL hash without page reload
                history.pushState(null, '', `#lore-library:${file}`);
                await fetchAndDisplayMarkdown(file, loadingOverlay, loreNoteTitle, loreNoteContent);
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

export async function fetchAndDisplayMarkdown(filePath, loadingOverlay, loreNoteTitle, loreNoteContent) {
    loadingOverlay.classList.remove('hidden');
    const rawGitHubUrl = `https://raw.githubusercontent.com/Artemisiye/Kedem-World-Anvil/main/notes/${filePath}`;
    const displayName = filePath.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim(); 

    try {
        const response = await fetch(rawGitHubUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - Could not access raw file. Ensure it's public and path is correct.`);
        }
        const markdownText = await response.text();
        
        // Custom Marked.js renderer for Obsidian-like features
        const renderer = {
            paragraph(text) {
                // Heuristic to detect YAML frontmatter lines or custom properties (tags, aliases, etc.)
                if (text.startsWith('---') || text.startsWith('aliases:') || text.startsWith('tags:') || text.startsWith('NpcAggresion:') || text.startsWith('NpcTags:') || text.startsWith('Description::') || text.startsWith('BaseValue:') || text.startsWith('## Offerings:') || text.startsWith('## Favors:') || text.startsWith('## Starting Boon:')) {
                    // Split lines and process them
                    const lines = text.split('<br>');
                    let formattedText = '';
                    lines.forEach(line => {
                        line = line.trim();
                        if (line === '---' || line.startsWith('aliases:') || line.startsWith('NpcAggresion:') || line.startsWith('NpcTags:') || line.startsWith('BaseValue:') || line.startsWith('## Offerings:') || line.startsWith('## Favors:') || line.startsWith('## Starting Boon:')) {
                            // General styling for metadata lines
                            formattedText += `<p class="text-sm text-slate-500 italic">${line}</p>`;
                        } else if (line.startsWith('tags:')) {
                            // Specific styling for 'tags:' line
                            const tagsContent = line.substring(5).trim();
                            const tags = tagsContent.split('-').map(t => t.trim()).filter(t => t);
                            if (tags.length > 0) {
                                formattedText += `<p class="text-sm text-slate-500 italic">tags: ${tags.map(tag => `<span class="inline-block bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full mr-1">${tag}</span>`).join('')}</p>`;
                            } else {
                                formattedText += `<p class="text-sm text-slate-500 italic">${line}</p>`; // Fallback for empty tags
                            }
                        } else if (line.startsWith('- ')) {
                            // List items for tags under 'tags:' block or other lists
                            formattedText += `<span class="inline-block bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2 mb-1">${line.substring(2).trim()}</span>`;
                        }
                         else {
                            formattedText += `<p>${line}</p>`; // Default paragraph
                        }
                    });
                    return `<div class="mb-2">${formattedText}</div>`;
                }
                // Handle image syntax like ![[Map.png]]
                if (text.startsWith('![[')) {
                    const imgFileName = text.match(/!\[\[(.*?)\]\]/);
                    if (imgFileName && imgFileName[1]) {
                        // Assume images are in the same folder as the markdown or directly in the notes root if not specified.
                        // This is a heuristic and might need refinement for complex image paths.
                        const imgPathBase = `https://raw.githubusercontent.com/Artemisiye/Kedem-World-Anvil/main/notes/`;
                        let imageSrc = `${imgPathBase}${imgFileName[1]}`;
                        // If the markdown file is nested, try to resolve the image relative to it.
                        const fileDir = filePath.substring(0, filePath.lastIndexOf('/') + 1);
                        if (fileDir !== '' && !imgFileName[1].includes('/')) { // If image is not absolute path and file is nested
                            imageSrc = `${imgPathBase}${fileDir}${imgFileName[1]}`;
                        }

                        return `<p><img src="${imageSrc}" alt="${imgFileName[1]}" class="max-w-full h-auto rounded-lg shadow-md mx-auto my-4"></p>`;
                    }
                }
                return `<p>${text}</p>`; // Default paragraph rendering
            }
        };

        marked.use({ renderer });
        marked.setOptions({ breaks: true }); // Ensure breaks option is always set for this parser instance

        loreNoteTitle.textContent = displayName;
        loreNoteContent.innerHTML = marked.parse(markdownText);
        
        // Re-attach event listeners for internal wikilinks after parsing
        loreNoteContent.querySelectorAll('a.internal-wikilink').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetFilePath = e.target.dataset.filepath;
                if (targetFilePath) {
                    // Update URL hash and trigger navigation
                    history.pushState(null, '', `#lore-library:${targetFilePath}`);
                    // Fetch and display the new note
                    fetchAndDisplayMarkdown(targetFilePath, loadingOverlay, loreNoteTitle, loreNoteContent, allLoreFiles); // Pass allLoreFiles
                    // Highlight the corresponding link in the sidebar
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
        loreNoteTitle.textContent = `Error loading ${displayName}`;
        loreNoteContent.innerHTML = `<p class="text-red-600">Could not load note. Please ensure the file path is correct and the file is publicly accessible.</p><p>Error: ${error.message}</p>`;
    } finally {
        loadingOverlay.classList.add('hidden');
    }
}
