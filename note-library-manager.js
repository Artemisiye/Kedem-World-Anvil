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

    function createList(data) {
        const ul = document.createElement('ul');
        ul.className = 'ml-0 space-y-1'; 

        // Add a class to the root UL for easier traversal in UI manager
        if (noteList === ul) { 
            ul.classList.add('root-ul');
        }

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
            subList.classList.add('hidden', 'ml-4', 'border-l', 'border-slate-300', 'pl-2'); 
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
            link.className = 'block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors duration-200';
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

    noteList.appendChild(createList(organizedFiles)); 
}

export async function fetchAndDisplayNote(filePath, loadingOverlay, noteTitleElement, noteContentElement, noteDisplayMainTitle) { 
    loadingOverlay.classList.remove('hidden');
    const rawGitHubUrl = `https://raw.githubusercontent.com/Artemisiye/Kedem-World-Anvil/main/notes/${filePath}`;
    const displayName = filePath.split('/').pop().replace('.md', '').replace(/([A-Z])/g, ' $1').trim(); 

    try {
        const response = await fetch(rawGitHubUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - Could not access raw file. Ensure it's public and path is correct.`);
        }
        let markdownText = await response.text();
        
        noteTitleElement.dataset.rawfilepath = filePath; 

        noteDisplayMainTitle.textContent = displayName;
        noteTitleElement.style.display = 'none'; 


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
                    processedLines.push(`<h4 class="text-md font-semibold text-teal-700 mt-3 mb-1">${line.substring(3).trim()}</h4>`);
                } else if (line.startsWith('- ')) { 
                    processedLines.push(`<p class="text-sm ml-4">• ${markedInstance.parseInline(line.substring(2).trim())}</p>`);
                } else if (line.startsWith('BaseValue:')) {
                    processedLines.push(`<p class="property-line"><strong>${line.split(':')[0].trim()}:</strong> ${line.split(':')[1].trim()}</p>`);
                } else if (line.trim() !== '') { 
                    processedLines.push(`<p class="metadata-line">${markedInstance.parseInline(line.trim())}</p>`);
                }
            } else {
                processedLines.push(line);
            }
        }
        markdownText = processedLines.join('\n'); 


        noteContentElement.innerHTML = markedInstance.parse(markdownText); 
        
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
        noteDisplayMainTitle.textContent = `Error loading note`; 
        noteTitleElement.style.display = 'block'; 
        noteTitleElement.textContent = `Error loading: ${displayName}`; 
        noteContentElement.innerHTML = `<p class="text-red-600">Could not load note. Please ensure the file path is correct and the file is publicly accessible.</p><p>Error: ${error.message}</p>`; 
    } finally {
        loadingOverlay.classList.add('hidden');
    }
}
