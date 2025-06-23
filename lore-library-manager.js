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
        
        // Setup a *new* Marked.js renderer instance for each render to avoid conflicts
        // and ensure the latest extensions/options are applied.
        
        // Define the wikilink extension directly here to access loreFiles implicitly
        const wikilinkExtension = {
            name: 'wikilink',
            level: 'inline',
            start(src) { return src.indexOf('[['); },
            tokenizer(src, tokens) {
                const rule = /^\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]/;
                const match = rule.exec(src);
                if (match) {
                    let targetWikiName = match[1].trim(); 
                    const githubBasePath = `https://github.com/Artemisiye/Kedem-World-Anvil/blob/main/notes/`;
                    
                    // Use loreFiles from the module scope (already imported)
                    const resolvedFilePath = loreFiles.find(f => 
                        f.toLowerCase() === `${targetWikiName.toLowerCase()}.md` || 
                        f.toLowerCase().endsWith(`/${targetWikiName.toLowerCase()}.md`) ||
                        f.toLowerCase().split('/').pop() === `${targetWikiName.toLowerCase()}.md`
                    );
                    
                    let href;
                    if (resolvedFilePath) {
                        href = `#/lore-library:${resolvedFilePath}`; 
                        return {
                            type: 'wikilink',
                            raw: match[0],
                            page: targetWikiName,
                            text: match[2] || targetWikiName.split('/').pop().replace(/([A-Z])/g, ' $1').trim(),
                            href: href,
                            isInternal: true,
                            resolvedPath: resolvedFilePath
                        };
                    } else {
                        const fallbackPath = targetWikiName.replace(/ /g, '%20');
                        href = `${githubBasePath}${fallbackPath}.md`;
                        return {
                            type: 'wikilink',
                            raw: match[0],
                            page: targetWikiName,
                            text: match[2] || targetWikiName.split('/').pop().replace(/([A-Z])/g, ' $1').trim(),
                            href: href,
                            isInternal: false
                        };
                    }
                }
            },
            renderer(token) {
                if (token.isInternal) {
                    return `<a href="${token.href}" class="wikilink internal-wikilink" data-filepath="${token.resolvedPath}">${token.text}</a>`;
                } else {
                    return `<a href="${token.href}" class="wikilink" target="_blank">${token.text}</a>`;
                }
            }
        };

        const customRenderer = {
            paragraph(text) {
                // Heuristic to detect YAML frontmatter lines or custom properties (tags, aliases, etc.)
                if (text.startsWith('---') || text.includes('::') || text.startsWith('aliases:') || text.startsWith('tags:') || text.startsWith('NpcAggresion:') || text.startsWith('NpcTags:') || text.startsWith('BaseValue:') || text.startsWith('## Offerings:') || text.startsWith('## Favors:') || text.startsWith('## Starting Boon:')) {
                    const lines = text.split('<br>'); // marked with breaks:true will use <br>
                    let formattedHtml = '';
                    lines.forEach(line => {
                        line = line.trim();
                        if (line === '---') {
                            formattedHtml += `<hr class="my-2 border-slate-300">`; 
                        } else if (line.startsWith('aliases:')) {
                            const aliases = line.substring('aliases:'.length).trim();
                            if (aliases) {
                                formattedHtml += `<p class="metadata-line"><strong>Aliases:</strong> ${aliases}</p>`;
                            }
                        } else if (line.startsWith('tags:')) {
                            const tagsContent = line.substring('tags:'.length).trim();
                            const tags = tagsContent.split(/[\s,]+-/).map(t => t.replace('-', '').trim()).filter(t => t); 
                            if (tags.length > 0) {
                                formattedHtml += `<p class="metadata-line"><strong>Tags:</strong> ${tags.map(tag => `<span class="tag-chip">${tag}</span>`).join('')}</p>`;
                            }
                        } else if (line.includes('::')) { 
                            const [propName, propValue] = line.split('::', 2).map(s => s.trim());
                            if (propName && propValue) {
                                formattedHtml += `<p class="property-line"><strong>${propName}:</strong> ${propValue}</p>`;
                            }
                        } else if (line.startsWith('## ')) { 
                             formattedHtml += `<h4 class="text-md font-semibold text-teal-700 mt-3 mb-1">${line.substring(3).trim()}</h4>`;
                        } else if (line.startsWith('- ') && !line.startsWith('--')) { 
                             formattedHtml += `<p class="text-sm ml-4">• ${line.substring(2).trim()}</p>`; 
                        } else if (line.startsWith('BaseValue:')) {
                            formattedHtml += `<p class="property-line"><strong>${line.split(':')[0].trim()}:</strong> ${line.split(':')[1].trim()}</p>`;
                        }
                         else {
                            formattedHtml += `<p>${line}</p>`; 
                        }
                    });
                    return formattedHtml; 
                }
                // Handle image syntax like ![[Map.png]]
                if (text.startsWith('![[')) {
                    const imgFileName = text.match(/!\[\[(.*?)\]\]/);
                    if (imgFileName && imgFileName[1]) {
                        const currentFileDir = filePath.substring(0, filePath.lastIndexOf('/') + 1); 
                        const imgPathBase = `https://raw.githubusercontent.com/Artemisiye/Kedem-World-Anvil/main/notes/`;
                        
                        let imageSrc = `${imgPathBase}${imgFileName[1]}`;
                        if (imgFileName[1].includes('/')) {
                            imageSrc = `${imgPathBase}${imgFileName[1]}`;
                        } else if (currentFileDir) {
                            imageSrc = `${imgPathBase}${currentFileDir}${imgFileName[1]}`;
                        }
                        
                        return `<p><img src="${imageSrc}" alt="${imgFileName[1]}" class="max-w-full h-auto rounded-lg shadow-md mx-auto my-4"></p>`;
                    }
                }
                return `<p>${text}</p>`; 
            }
        };

        const markdownParser = new marked.Marked({ 
            breaks: true, 
            renderer: new marked.Renderer() 
        });
        markdownParser.use({ extensions: [wikilinkExtension] });
        markdownParser.use({ renderer: customRenderer }); 


        loreNoteTitle.textContent = displayName;
        loreNoteContent.innerHTML = markdownParser.parse(markdownText); 
        
        loreNoteContent.querySelectorAll('a.internal-wikilink').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetFilePath = e.target.dataset.filepath;
                if (targetFilePath) {
                    history.pushState(null, '', targetFilePath); 
                    // Pass current HTML elements for Lore Library to avoid re-querying
                    fetchAndDisplayMarkdown(targetFilePath.substring('#lore-library:'.length), loadingOverlay, loreNoteTitle, loreNoteContent);
                    
                    document.querySelectorAll('#lore-notes-list a').forEach(el => el.classList.remove('bg-slate-300', 'font-semibold'));
                    const correspondingLink = document.querySelector(`#lore-notes-list a[data-filepath-raw="${targetFilePath.substring('#lore-library:'.length)}"]`);
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
