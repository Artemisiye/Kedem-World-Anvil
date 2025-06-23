// note-library-manager.js

import { noteFiles } from './data-constants.js';
import { markedInstance } from './markdown-parser.js';

export function setupNoteLibrary(loadingOverlay, noteList, noteContentElement, noteDisplayMainTitle) {
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
            // This class applies to the nested UL for the visual indent line
            ul.classList.add('folder-item-sub-list');
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
            li.className = 'folder-item'; // For general list item styling

            const folderToggle = document.createElement('div');
            folderToggle.className = 'note-list-folder-toggle flex items-center cursor-pointer px-2 py-1 rounded-lg text-slate-100 transition-colors duration-200 hover:bg-slate-700';
            // Using a specific SVG path for the arrow
            folderToggle.innerHTML = `
                <svg class="toggle-icon w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>${folderName}</span>
            `;
            li.appendChild(folderToggle);

            const subList = createList(data.folders[folderName], document.createElement('ul'));
            subList.classList.add('hidden'); // Initially hidden
            li.appendChild(subList);

            folderToggle.addEventListener('click', () => {
                subList.classList.toggle('hidden');
                folderToggle.querySelector('.toggle-icon').classList.toggle('rotated'); // Toggle rotated class for arrow icon
            });
            ul.appendChild(li);
        });

        sortedFilePaths.forEach(file => {
            const listItem = document.createElement('li');
            // No specific class for LI, styling applied to the link
            const link = document.createElement('a');
            link.href = `#note-library:${file}`;
            link.dataset.filepathRaw = file; // Store raw path for active highlighting
            const displayName = file.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim();
            link.textContent = displayName;
            link.className = 'note-list-item-link block px-2 py-1 rounded-lg text-slate-100 transition-colors duration-200 hover:bg-slate-700';
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

    noteList.appendChild(createList(organizedFiles, null));


    const noteSearchInput = document.getElementById('note-search-input');
    if (noteSearchInput) {
        noteSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            console.log("Search term:", searchTerm);
            // Re-render the note list based on search term
            const filteredFiles = noteFiles.filter(file => file.toLowerCase().includes(searchTerm));
            noteList.innerHTML = ''; // Clear current list
            noteList.appendChild(createList(buildFolderStructure(filteredFiles), null));
            // Trigger navigation logic to re-apply active state if needed after filter
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
    }

    if (noteDisplayMainTitle) noteDisplayMainTitle.textContent = 'Note Library';
    if (noteContentElement) noteContentElement.innerHTML = '<p class="text-slate-500">Select a note from the left panel to view its content.</p>';
}

export async function fetchAndDisplayNote(filePath, loadingOverlay, noteContentElement, noteDisplayMainTitle) {
    if (loadingOverlay) loadingOverlay.classList.remove('hidden');
    if (noteContentElement) noteContentElement.innerHTML = '';

    const githubBasePath = `https://raw.githubusercontent.com/Artemisiye/Kedem-World-Anvil/main/notes/`;
    const fullUrl = `${githubBasePath}${filePath}`;
    const displayName = filePath.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim();

    try {
        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - Could not access raw file. Ensure it's public and path is correct.`);
        }
        let markdownText = await response.text();

        if (noteDisplayMainTitle) noteDisplayMainTitle.textContent = displayName;

        // --- PRE-PROCESSING FOR OBSIDIAN METADATA AND CUSTOM PROPERTIES ---
        const processedMarkdownLines = [];
        const lines = markdownText.split('\n');
        let inFrontmatter = false;
        let foundFirstDashLine = false;
        let propertiesHtml = ''; // Accumulate HTML for properties box
        let hasProperties = false;
        let mainContentStarted = false; // Flag to indicate when markdown content starts

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            if (line.trim() === '---') {
                if (!foundFirstDashLine) {
                    inFrontmatter = true;
                    foundFirstDashLine = true;
                    continue; // Skip the first '---' line
                } else if (inFrontmatter) {
                    inFrontmatter = false;
                    // End of frontmatter, propertiesHtml is now complete
                    mainContentStarted = true; // Main content will start after this
                    continue; // Skip the second '---' line
                }
            }

            if (inFrontmatter) {
                // Process lines within frontmatter for properties box
                if (line.startsWith('aliases:')) {
                    const aliases = line.substring('aliases:'.length).trim();
                    if (aliases) {
                        const cleanAliases = aliases.replace(/^- /, ''); // Remove leading hyphen from alias if it's a list
                        propertiesHtml += `
                            <div class="properties-item">
                                <div class="properties-label">Aliases</div>
                                <div class="properties-value">${markedInstance.parseInline(cleanAliases)}</div>
                            </div>
                        `;
                        hasProperties = true;
                    }
                } else if (line.startsWith('tags:')) {
                    const tagsContent = line.substring('tags:'.length).trim();
                    const tags = tagsContent.split(/[\s,-]+/).map(t => t.trim()).filter(t => t && t !== '-');
                    if (tags.length > 0) {
                        propertiesHtml += `
                            <div class="properties-item">
                                <div class="properties-label">Tags</div>
                                <div class="properties-value">
                                    ${tags.map(tag => `<span class="tag-chip">${tag.replace('#', '')}</span>`).join('')}
                                </div>
                            </div>
                        `;
                        hasProperties = true;
                    }
                }
                // Generic property handler for key:: value
                 else if (line.includes('::')) {
                    const [propName, propValue] = line.split('::', 2).map(s => s.trim());
                    if (propName && propValue) {
                        propertiesHtml += `
                            <div class="properties-item">
                                <div class="properties-label">${propName.charAt(0).toUpperCase() + propName.slice(1)}</div>
                                <div class="properties-value">${markedInstance.parseInline(propValue)}</div>
                            </div>
                        `;
                        hasProperties = true;
                    }
                }
                // For other content within frontmatter that's not a standard property, add as a metadata line
                else if (line.trim() !== '') {
                    // This catches things like descriptions directly under '---' if not a key::value
                    propertiesHtml += `<p class="metadata-line">${markedInstance.parseInline(line.trim())}</p>`;
                    hasProperties = true; // Consider any content here as part of properties
                }
            } else {
                // If not in frontmatter, add the line to be parsed as standard markdown
                processedMarkdownLines.push(line);
            }
        }

        // Conditionally add the properties box if any properties were found
        let finalContentHtml = '';
        if (hasProperties) {
            finalContentHtml += `
                <div class="properties-box mb-6">
                    <div class="properties-box-title">
                        <svg class="w-4 h-4 mr-1 text-slate-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11.49 3.17c-.325-.325-.79-.5-1.276-.5H9.234c-.486 0-.95.175-1.276.5L4.475 7.127a3.003 3.003 0 00-1.077 1.772l-.71 3.551A.5.5 0 003 13.5h14a.5.5 0 00.312-.92l-.71-3.551a3.003 3.003 0 00-1.077-1.772l-3.743-3.957zM10 15a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path></svg>
                        Properties
                    </div>
                    ${propertiesHtml}
                </div>
            `;
        }
        finalContentHtml += markedInstance.parse(processedMarkdownLines.join('\n')); // Join remaining lines for main content

        if (noteContentElement) noteContentElement.innerHTML = finalContentHtml;

        if (noteContentElement) {
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
        }

    } catch (error) {
        console.error('Error fetching Markdown file:', error);
        if (noteDisplayMainTitle) noteDisplayMainTitle.textContent = `Error loading note`;
        if (noteContentElement) noteContentElement.innerHTML = `<p class="text-red-600">Could not load note. Please ensure the file path is correct and the file is publicly accessible.</p><p>Error: ${error.message}</p>`;
    } finally {
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
    }
}
