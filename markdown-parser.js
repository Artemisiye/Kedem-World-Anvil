// markdown-parser.js

// Marked.js is globally available via CDN link in index.html, no import needed here for the global marked object.

// MARKED.JS GLOBAL CONFIGURATION FOR WIKILINKS AND OPTIONS
marked.setOptions({
  breaks: true // This will convert single newlines to <br> tags
});

marked.use({
  extensions: [{
    name: 'wikilink',
    level: 'inline', // This is an inline extension
    start(src) { return src.indexOf('[['); }, // The character to look for to start the parsing
    tokenizer(src, tokens) {
      const rule = /^\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]/; // Regex to capture [[link|text]] or [[link]]
      const match = rule.exec(src);
      if (match) {
        // Determine the base path for the wikilink target
        let targetWikiName = match[1].trim(); 
        const githubBasePath = `https://github.com/Artemisiye/Kedem-World-Anvil/blob/main/notes/`;
        
        // Use window.loreFiles as it's attached to the global window object in index.html
        const resolvedFilePath = window.loreFiles.find(f => 
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
                text: match[2] || targetWikiName.split('/').pop().replace(/([A-Z])/g, ' $1').trim(), // Display text
                href: href,
                isInternal: true, // Custom property to signify internal link
                resolvedPath: resolvedFilePath // Store the exact path for later use
            };
        } else {
            const fallbackPath = targetWikiName.replace(/ /g, '%20');
            href = `${githubBasePath}${fallbackPath}.md`;
             return {
                type: 'wikilink',
                raw: match[0],
                page: targetWikiName,
                text: match[2] || targetWikiName.split('/').pop().replace(/([A-Z])/g, ' $1').trim(), // Display text
                href: href,
                isInternal: false // Not an internal SPA link
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
    },
    // Custom paragraph renderer for metadata and single line breaks
    paragraph(text) {
        if (text.startsWith('---') || text.includes('::') || text.startsWith('aliases:') || text.startsWith('tags:') || text.startsWith('NpcAggresion:') || text.startsWith('NpcTags:') || text.startsWith('Description::') || text.startsWith('BaseValue:') || text.startsWith('## Offerings:') || text.startsWith('## Favors:') || text.startsWith('## Starting Boon:')) {
            const lines = text.split('<br>'); 
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
                const currentFilePath = document.getElementById('lore-note-title').dataset.rawfilepath || ''; 
                const fileDir = currentFilePath.substring(0, currentFilePath.lastIndexOf('/') + 1);
                const imgPathBase = `https://raw.githubusercontent.com/Artemisiye/Kedem-World-Anvil/main/notes/`;
                
                let imageSrc = `${imgPathBase}${imgFileName[1]}`;
                if (imgFileName[1].includes('/')) {
                    imageSrc = `${imgPathBase}${imgFileName[1]}`;
                } else if (fileDir) {
                    imageSrc = `${imgPathBase}${fileDir}${imgFileName[1]}`;
                }
                
                return `<p><img src="${imageSrc}" alt="${imgFileName[1]}" class="max-w-full h-auto rounded-lg shadow-md mx-auto my-4"></p>`;
            }
        }
        return `<p>${text}</p>`; 
    }
  }]
});

// Export the globally configured marked instance
export const markedInstance = marked;
