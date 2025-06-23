// note-library-manager.js

import { noteFiles } from './data-constants.js';
import { markedInstance } from './markdown-parser.js';

export function setupNoteLibrary(loadingOverlay, noteList, noteTitleElement, noteContentElement, noteDisplayMainTitle) {
    noteList.innerHTML = '';

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

    const organizedFiles = buildFolderStructure(noteFiles);

    function createList(data, parentUl) {
        const ul = parentUl || document.createElement('ul');
        if (!parentUl) { // Apply only to the top-level ul
            ul.className = 'space-y-1';
            ul.classList.add('root-ul'); // Add root-ul class for easier traversal
        } else {
            ul.classList.add('folder-list-indent');
        }

        // Sort folders and files alphabetically
        const sortedFolderNames = Object.keys(data.folders).sort((a, b) => a.localeCompare(b));
        const sortedFilePaths = (data.files || []).sort((a, b) => {
            const nameA = a.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim();
            const nameB = b.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim();
            return nameA.localeCompare(nameB);
        });

        sortedFolderNames.forEach(folderName => {
            const li = document.createElement('li');
            li.className = 'folder-item';

            const folderToggle = document.createElement('div');
            folderToggle.className = 'note-list-folder-toggle flex items-center cursor-pointer px-2 py-1 rounded-lg text-slate-100 font-semibold transition-colors duration-200 hover:bg-slate-700';
            folderToggle.innerHTML = `<span class="toggle-icon mr-2">▶</span> ${folderName}`;
            li.appendChild(folderToggle);

            // Add visual indent for sub-folders
            const subList = createList(data.folders[folderName], document.createElement('ul')); // Pass new ul for recursion
            subList.classList.add('hidden');
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
            link.href = `#note-library:${file}`;
            link.dataset.filepathRaw = file;
            const displayName = file.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim();
            link.textContent = displayName;
            link.className = 'note-list-item-link block px-4 py-2 rounded-lg text-slate-100 transition-colors duration-200 hover:bg-slate-700';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                history.pushState(null, '', `note-library.html#note-library:${file}`);
                window.dispatchEvent(new HashChangeEvent('hashchange'));
            });
            listItem.appendChild(link);
            ul.appendChild(listItem);
        });
        return ul;
    }

    noteList.appendChild(createList(organizedFiles, null)); // Start recursion with null for parentUl


    // Initial search setup (if needed, currently not connected)
    const noteSearchInput = document.getElementById('note-search-input');
    if (noteSearchInput) {
        noteSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            // Implement search logic here, e.g., filter the displayed list
            console.log("Search term:", searchTerm); // Placeholder
        });
    }

    // Set initial display to the main title
    noteDisplayMainTitle.textContent = 'Note Library';
    noteTitleElement.textContent = 'Welcome!'; // Assuming this is still used for initial welcome
    noteContentElement.innerHTML = '<p class="text-slate-500">Select a note from the left panel to view its content.</p>';
}

export async function fetchAndDisplayNote(filePath, loadingOverlay, noteTitleElement, noteContentElement, noteDisplayMainTitle) {
    loadingOverlay.classList.remove('hidden');
    // noteTitleElement.textContent = ''; // Clear previous title - this is handled by noteDisplayMainTitle now.
    noteContentElement.innerHTML = ''; // Clear previous content

    const githubBasePath = `https://raw.githubusercontent.com/Artemisiye/Kedem-World-Anvil/main/notes/`;
    const fullUrl = `${githubBasePath}${filePath}`;
    const displayName = filePath.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim();

    try {
        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - Could not access raw file. Ensure it's public and path is correct.`);
        }
        let markdownText = await response.text();

        // Set raw file path on an element, if needed (e.g., for edit buttons)
        if (noteTitleElement) noteTitleElement.dataset.rawfilepath = filePath;

        // Set the main display title
        if (noteDisplayMainTitle) noteDisplayMainTitle.textContent = displayName;
        // The smaller noteTitleElement is now effectively unused or hidden for fetched notes
        if (noteTitleElement) noteTitleElement.style.display = 'none';


        // --- PRE-PROCESSING FOR OBSIDIAN METADATA AND CUSTOM PROPERTIES ---
        const processedLines = [];
        const lines = markdownText.split('\n');
        let inFrontmatter = false;
        let foundFirstDashLine = false;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // Toggle frontmatter state
            if (line.trim() === '---') {
                if (!foundFirstDashLine) {
                    inFrontmatter = true;
                    foundFirstDashLine = true;
                    // Add a horizontal rule to visually separate metadata
                    processedLines.push('<hr class="my-2 border-slate-300">');
                    continue;
                } else if (inFrontmatter) {
                    inFrontmatter = false;
                    processedLines.push('<hr class="my-2 border-slate-300">');
                    continue;
                }
            }

            if (inFrontmatter) {
                // Process lines within frontmatter
                if (line.startsWith('aliases:')) {
                    const aliases = line.substring('aliases:'.length).trim();
                    if (aliases) {
                        processedLines.push(`<p class="metadata-line"><strong>Aliases:</strong> ${markedInstance.parseInline(aliases.replace(/-/g, ''))}</p>`);
                    }
                } else if (line.startsWith('tags:')) {
                    const tagsContent = line.substring('tags:'.length).trim();
                    // Split tags by space, comma, or hyphen, then filter out empty strings/hyphens
                    const tags = tagsContent.split(/[\s,-]+/).map(t => t.trim()).filter(t => t && t !== '-');
                    if (tags.length > 0) {
                        processedLines.push(`<p class="metadata-line"><strong>Tags:</strong> ${tags.map(tag => `<span class="tag-chip">${tag.replace('#', '')}</span>`).join('')}</p>`);
                    }
                } else if (line.includes('::')) {
                    const [propName, propValue] = line.split('::', 2).map(s => s.trim());
                    if (propName && propValue) {
                        processedLines.push(`<p class="property-line"><strong>${propName}:</strong> ${markedInstance.parseInline(propValue)}</p>`);
                    }
                } else if (line.startsWith('## Offerings:') || line.startsWith('## Favors:') || line.startsWith('## Starting Boon:')) {
                    // Specific headers for deity-like notes
                    processedLines.push(`<h4 class="text-md font-semibold text-teal-700 mt-3 mb-1">${line.substring(3).trim()}</h4>`);
                } else if (line.startsWith('- ')) {
                    // List items within metadata (e.g., under Offerings/Favors)
                    processedLines.push(`<p class="text-sm ml-4">• ${markedInstance.parseInline(line.substring(2).trim())}</p>`);
                } else if (line.startsWith('BaseValue:')) {
                    // Example of a specific property like BaseValue: 100
                    processedLines.push(`<p class="property-line"><strong>${line.split(':')[0].trim()}:</strong> ${line.split(':')[1].trim()}</p>`);
                } else if (line.trim() !== '') {
                    // Any other non-empty lines in the frontmatter block are treated as metadata paragraphs
                    processedLines.push(`<p class="metadata-line">${markedInstance.parseInline(line.trim())}</p>`);
                }
            } else {
                // If not in frontmatter, add the line as is for standard markdown parsing
                processedLines.push(line);
            }
        }
        markdownText = processedLines.join('\n');


        // Render the processed Markdown content
        if (noteContentElement) noteContentElement.innerHTML = markedInstance.parse(markdownText);

        // Add event listeners to internal wikilinks for SPA-like navigation
        noteContentElement.querySelectorAll('a.internal-wikilink').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetFilePath = e.target.dataset.filepath;
                if (targetFilePath) {
                    history.pushState(null, '', `note-library.html#note-library:${targetFilePath}`);
                    window.dispatchEvent(new HashChangeEvent('hashchange'));
                }
            });
        });

    } catch (error) {
        console.error('Error fetching Markdown file:', error);
        if (noteDisplayMainTitle) noteDisplayMainTitle.textContent = `Error loading note`;
        if (noteTitleElement) {
            noteTitleElement.style.display = 'block'; // Show if there's an error
            noteTitleElement.textContent = `Error loading: ${displayName}`;
        }
        if (noteContentElement) noteContentElement.innerHTML = `<p class="text-red-600">Could not load note. Please ensure the file path is correct and the file is publicly accessible.</p><p>Error: ${error.message}</p>`;
    } finally {
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
    }
}
