// markdown-parser.js

// Marked.js is globally available via CDN, no explicit import needed for 'marked'.

// Configure marked to handle single newlines as breaks by default
marked.setOptions({
  breaks: true // This will convert single newlines to <br> tags
});

// Custom extension for [[wikilinks]]
marked.use({
  extensions: [{
    name: 'wikilink',
    level: 'inline', // This is an inline extension
    start(src) { return src.indexOf('[['); }, // The character to look for to start the parsing
    tokenizer(src, tokens) {
      const rule = /^\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]/; // Regex to capture [[link|text]] or [[link]]
      const match = rule.exec(src);
      if (match) {
        let targetWikiName = match[1].trim(); 
        const githubBasePath = `https://github.com/Artemisiye/Kedem-World-Anvil/blob/main/notes/`;
        
        // Access window.noteFiles (exported from data-constants.js and attached to window in index.html)
        const resolvedFilePath = window.noteFiles.find(f => 
            f.toLowerCase() === `${targetWikiName.toLowerCase()}.md` || 
            f.toLowerCase().endsWith(`/${targetWikiName.toLowerCase()}.md`) ||
            f.toLowerCase().split('/').pop().replace('.md', '') === targetWikiName.toLowerCase() // Handles "Will Power" -> "Will Power.md"
        );
        
        let href;
        if (resolvedFilePath) {
            // If found in our list, it's an internal SPA link
            href = `#/notes-library:${resolvedFilePath}`; // Use the new section hash
            return {
                type: 'wikilink',
                raw: match[0],
                page: targetWikiName,
                text: match[2] || targetWikiName.split('/').pop().replace(/([A-Z])/g, ' $1').trim(), // Display text (text || cleaned page name)
                href: href,
                isInternal: true, // Custom property to signify internal link
                resolvedPath: resolvedFilePath // Store the exact path for later use
            };
        } else {
            // Fallback: Link directly to GitHub if not found internally
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
            // For internal links, add data-filepath attribute for click handler
            return `<a href="${token.href}" class="wikilink internal-wikilink" data-filepath="${token.resolvedPath}">${token.text}</a>`;
        } else {
            // For external links, open in new tab
            return `<a href="${token.href}" class="wikilink" target="_blank">${token.text}</a>`;
        }
    }
  }]
});

// Export the globally configured marked instance
export const markedInstance = marked;
