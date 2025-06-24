// generate-notes-list.js
// ---
// This script automatically finds all .md files in your './notes' directory
// and updates the 'noteFiles' array in 'data-constants.js'.
//
// HOW TO USE:
// 1. Make sure you have Node.js installed.
// 2. Open a terminal in the root of your project (in VS Code: Terminal > New Terminal).
// 3. Run this command: node generate-notes-list.js
// 4. Commit the updated 'data-constants.js' file to your repository.
// ---

const fs = require('fs');
const path = require('path');

const notesDirectory = path.join(__dirname, 'notes');
const outputFile = path.join(__dirname, 'data-constants.js');

/**
 * Recursively walks a directory path and returns an array of all file paths.
 * @param {string} dirPath - The directory to scan.
 * @param {Array<string>} arrayOfFiles - An array to store the file paths.
 * @returns {Array<string>} A flattened array of file paths.
 */
function getAllMarkdownFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllMarkdownFiles(path.join(dirPath, file), arrayOfFiles);
        } else {
            // Only include files with a .md extension
            if (path.extname(file) === '.md') {
                // Get the path relative to the './notes' directory
                const relativePath = path.relative(notesDirectory, path.join(dirPath, file));
                // Ensure all paths use forward slashes for web URL compatibility
                const webPath = relativePath.replace(/\\/g, '/');
                arrayOfFiles.push(webPath);
            }
        }
    });
    return arrayOfFiles;
}

try {
    if (!fs.existsSync(notesDirectory)) {
        throw new Error(`The './notes' directory was not found. Please run this script from the project root.`);
    }

    console.log(`Scanning for markdown files in '${notesDirectory}'...`);
    const noteFiles = getAllMarkdownFiles(notesDirectory);
    
    // Sort alphabetically to ensure consistent order in the output file
    noteFiles.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    
    console.log(`Found ${noteFiles.length} notes.`);

    // Read the existing data-constants.js file to preserve its other contents
    const originalContent = fs.readFileSync(outputFile, 'utf8');

    // Use a regular expression to find the 'noteFiles' array declaration and replace it.
    // This is robust and will work even if the array spans multiple lines.
    const updatedContent = originalContent.replace(
        /export const noteFiles = \[[\s\S]*?\];/,
        `export const noteFiles = ${JSON.stringify(noteFiles, null, 4)};`
    );

    // Safety check: if the content is unchanged, the regex probably failed.
    if (updatedContent === originalContent) {
        throw new Error("Could not find the 'export const noteFiles = [...]' array in 'data-constants.js'. No changes were made. Please check the file format.");
    }

    // Write the modified content back to the file
    fs.writeFileSync(outputFile, updatedContent, 'utf8');
    console.log(`Successfully updated 'data-constants.js' with ${noteFiles.length} note paths.`);

} catch (error) {
    console.error(`\x1b[31mError: ${error.message}\x1b[0m`); // Log error in red
    process.exit(1); // Exit with an error code
}
