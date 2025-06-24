// appearance-settings.js

/**
 * Defines core appearance settings for the application.
 * Centralizing these allows for easier theming and UI adjustments.
 */

// Font sizes for markdown headings (in pixels)
export const markdownFontSizes = {
    h1: '24px',
    h2: '18px',
    h3: '13.5px',
    h4: '12px',
    h5: '10px',
    h6: '7.5px',
    normalText: '12px'
};

// Color theme variables (base for light/dark mode)
export const colorThemes = {
    light: {
        '--bg-color': '#f8fafc', /* slate-50 */
        '--text-color': '#334155', /* slate-700 */
        '--sidebar-bg': '#1e293b', /* slate-800 */
        '--sidebar-text': '#f1f5f9', /* slate-100 */
        '--sidebar-border': '#475569', /* slate-700 */
        '--nav-hover-bg': '#334155', /* slate-700 */
        '--nav-active-bg': '#fbbf24', /* amber-400 */
        '--nav-active-text': '#1e293b', /* slate-800 */
        '--note-bg': '#ffffff', /* white */
        '--note-border': '#e2e8f0', /* slate-200 */
        '--properties-bg': '#f1f5f9', /* slate-100 */
        '--properties-border': '#e2e8f0', /* slate-200 */
        '--properties-title-color': '#475569', /* slate-600 */
        '--properties-label-color': '#1e293b', /* slate-800 */
        '--tag-chip-bg': '#cbd5e1', /* slate-300 */
        '--tag-chip-text': '#1e293b', /* slate-800 */
        '--wikilink-color': '#2563eb', /* blue-600 */
        '--broken-link-color': '#94a3b8', /* slate-400 */
        '--loading-overlay-bg': 'rgba(255, 255, 255, 0.8)',
    },
    dark: {
        '--bg-color': '#1e293b', /* slate-800 */
        '--text-color': '#e2e8f0', /* slate-200 */
        '--sidebar-bg': '#0f172a', /* slate-900 */
        '--sidebar-text': '#cbd5e1', /* slate-300 */
        '--sidebar-border': '#334155', /* slate-700 */
        '--nav-hover-bg': '#1e293b', /* slate-800 */
        '--nav-active-bg': '#fbbf24', /* amber-400 */
        '--nav-active-text': '#1e293b', /* slate-800 */
        '--note-bg': '#2d3748', /* darker blue-grey */
        '--note-border': '#4a5568', /* even darker blue-grey */
        '--properties-bg': '#334155', /* slate-700 */
        '--properties-border': '#475569', /* slate-600 */
        '--properties-title-color': '#a0aec0', /* slate-400 */
        '--properties-label-color': '#e2e8f0', /* slate-200 */
        '--tag-chip-bg': '#4a5568', /* slate-600 */
        '--tag-chip-text': '#e2e8f0', /* slate-200 */
        '--wikilink-color': '#63b3ed', /* blue-300 */
        '--broken-link-color': '#718096', /* slate-500 */
        '--loading-overlay-bg': 'rgba(0, 0, 0, 0.7)',
    }
};
