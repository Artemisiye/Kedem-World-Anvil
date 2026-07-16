Version: 1.1
Date: June 26, 2025
Status: In-Progress Migration
## 1. Project Overview

### 1.1. Context

The "Kedem Anvil" project is a web-based companion to "Kedem," a game development project in Unreal Engine 5. The primary author uses Obsidian for world-building and game design documentation, resulting in a large, interconnected body of notes in Markdown (.md) format. The goal of Kedem Anvil is to transform this local knowledge base into a public-facing, interactive website.

### 1.2. Vision & Usage

The vision is to create a "Digital Tome" that functions as an intelligent and interactive creative suite for the world of Kedem. This platform will serve multiple purposes:

- Personal Knowledge Base: A centralized, searchable, and visually engaging way for the creator to review their own notes.
    
- In-Browser Editing: Provide a seamless web-based editor as an alternative to Obsidian, allowing for quick modifications and content creation directly on the website.
    
- Collaborative Hub: A reference point for any team members, ensuring a single source of truth for the game's lore and mechanics.
    
- Public-Facing Lore Bible: A website for future players to explore the world of Kedem, enhancing their immersion and engagement.
    
- AI-Powered Creative Partner: The integrated LLM chatbot will "talk to the notes," functioning as an active participant in the creative process. It will be able to understand context, brainstorm new ideas, answer complex lore questions, and suggest concrete edits to the notes.
    

### 1.3. Scope & Constraints

This is a personal/indie project with a focus on high-impact, low-overhead solutions.

- Effort-Effective: The chosen architecture should minimize boilerplate and maintenance while maximizing performance and features.
    
- Cost-Free: The project will leverage free-tier services for hosting (GitHub Pages) and database (Firebase).
    
- Personal Workflow Integration: The system must seamlessly integrate with the existing Obsidian-based note-taking workflow, using the .md files as the ultimate source of truth.
    

### 1.4. Project-Specific Considerations

- Obsidian Markdown Syntax: The system must correctly parse Obsidian-specific features, most notably `[[WikiLink]]` syntax for inter-note linking and YAML frontmatter for metadata (tags, aliases).
    
- Hybrid Data Model: The website needs to handle both static content (the Markdown notes) and dynamic, structured data (e.g., a bestiary or character list managed in a database).
    
- Two-Way Editing Workflow: Implementing a web-based editor introduces the complexity of keeping the Git-based .md files in sync with changes made online. A clear strategy for this (e.g., Git API integration, manual sync process) will be required.
    
- Future-Proofing for AI: The final output must be semantically structured and easily parsable by Large Language Models.
    

## 2. Part 1: Analysis of the Original System

This section details the initial vanilla JavaScript application built by the project owner.

### 2.1. Architecture

The original system is a Multi-Page Application (MPA) hosted on GitHub Pages. It consists of two primary HTML files, explorer.html and note-library.html, which function as two distinct Single-Page Applications (SPAs).

- Data Sources:
    

1. Static Notes: Markdown notes are stored in the /notes directory of the GitHub repository. They are fetched individually at runtime from the GitHub raw content CDN.
    
2. Dynamic Data: Structured data (e.g., Deities) is stored in and fetched from Google Firebase's Firestore database.
    
3. Note Index: A local script (generate-notes-list.js) is run manually to create a static list of all note paths, which is then used by the website to avoid crawling the GitHub repository at runtime.
    

- Rendering: All rendering is performed client-side. The user's browser fetches HTML, then executes JavaScript to fetch data and manipulate the DOM.
    

### 2.2. Current Functionalities & Main Features

- Markdown Parsing: Uses the Marked.js library with a custom extension to correctly parse `[[WikiLink]]` syntax into clickable `<a>` tags.
    
- Deity Manager: An interactive UI on the explorer.html page that fetches a deities collection from Firestore in real-time. It includes functionality for client-side search and filtering by rank.
    
- Firebase Integration:
    

- Authentication: A complete email/password authentication system allows a whitelisted "editor" user to log in.
    
- Real-time Database: Uses onSnapshot to listen for live updates to the Firestore data.
    
- Editing: Logged-in editors can modify deity information directly from a modal UI on the website, with changes saved back to Firestore.
    

- Note Library: The note-library.html page provides a file-tree view of all notes, allowing users to select and view the rendered content of any Markdown file. It includes a search filter and client-side caching of fetched notes to improve performance on subsequent views.
    

### 2.3. Summary of Key Modules

- firebase-init.js: Initializes the Firebase app and handles all authentication logic.
    
- deity-manager.js: Contains all logic for the Pantheon explorer feature.
    
- note-library-manager.js: Manages fetching, caching, and displaying the .md notes.
    
- markdown-parser.js: Configures Marked.js and defines the custom wikilink extension.
    
- ui-manager.js: A central module for DOM manipulation, routing between SPA sections, and initializing other modules.
    
- appearance-settings.js: A constants file defining color themes and font sizes.
    

## 3. Part 2: The Proposed Architecture & Vision

This section details the target state for the project: a modern, performant, and maintainable application.

### 3.1. Proposed Framework: Next.js (App Router)

The project will be migrated to Next.js, a production-grade React framework. This choice is based on its powerful features that directly address the project's needs:

- Static Site Generation (SSG): Next.js can pre-render every Markdown note into a static HTML page at build time. This results in maximum performance, perfect SEO, and ideal crawlability for LLMs.
    
- Client Components ("Islands"): For dynamic features like the Deity Manager, we can designate them as "Client Components." Next.js will render a static shell for them and then load the necessary JavaScript in the browser to make them interactive.
    
- Integrated Tooling: Next.js provides a cohesive development experience with built-in routing, code optimization, and image handling.
    

### 3.2. Proposed Design & Layout

The website will adopt the "Digital Tome" aesthetic from the mockup.

- Layout: A responsive three-column layout:
    

1. Left Sidebar: Collapsible navigation tree of all notes.
    
2. Center Column: The main, focused reading area for the selected note's content.
    
3. Right Sidebar: A contextual area for related information.
    

- Color Palette: The "Dawn of Antiquity" theme (--bg-midnight: `#1A1A2E`, --accent-gold: `#F0A500`, etc.) will be used for a cohesive, atmospheric UI.
    
- Typography: A blend of a classic serif font (EB Garamond) for body text and a clean sans-serif (Inter) for the UI to enhance readability and theme.
    

### 3.3. Notable Mockup Features to Implement

- Infoboxes: The right sidebar will feature a Wikipedia-style "Infobox" that displays structured data parsed from the note's frontmatter (tags, aliases, etc.).
    
- Automated Backlinks: At the bottom of each note, a section will automatically list all other notes that link to the current one, revealing the web of connections.
    
- Interactive Graph View: A visual, force-directed graph (like in Obsidian) will be implemented as a client component to visualize the relationships between notes.
    
- Intelligent Chat Interface: The right sidebar will house an LLM-powered chat panel. Its capabilities will include:
    

- Contextual Q&A: Answering questions based on the content of the currently viewed note.
    
- Creative Brainstorming: Generating ideas for new characters, plot points, or locations based on existing lore.
    
- Content-Aware Suggestions: Proposing concrete additions or modifications to the note to improve clarity or depth.
    

## 4. Part 3: Migration & Development Roadmap

This section outlines the concrete steps to transition from the original system to the proposed Next.js application.

### 4.1. Architectural Evolution

The core change is moving from a client-side rendering (CSR) model to a primarily static-first model with "islands" of client-side interactivity, leveraging the JAMstack (JavaScript, APIs, Markup) philosophy.

- From MPA to Next.js App Router: The two separate .html files will be replaced by a single, unified application structure within the Next.js app directory. The file system will drive the routing.
    
- From Runtime Fetching to Build-Time Generation: Instead of fetching notes from GitHub on page load, Next.js will read all notes from the local /notes directory during the build process and generate optimized, static HTML pages.
    
- From Manual Indexing to Automated Discovery: The generate-notes-list.js script becomes obsolete. Next.js's build process will automatically discover all notes.
    

### 4.2. Phased Implementation Plan

#### Phase 1: Foundation & Static Content (In Progress)

1. Scaffold Project: Initialize a new Next.js project within a /next-app sub-directory of the existing repository.
    
2. Set Up Styling: Configure Tailwind CSS with the "Dawn of Antiquity" theme and the typography plugin.
    
3. Create Root Layout: Implement the three-column layout in app/layout.tsx.
    
4. Implement Note Rendering:
    

- Create a library lib/notes.ts to read the /notes directory.
    
- Create a dynamic route app/notes/[...slug]/page.tsx to pre-render each note as a static page using generateStaticParams.
    
- Parse frontmatter and Markdown content.
    

#### Phase 2: Integrating Dynamic Features

1. Firebase Integration: Set up a centralized Firebase configuration and a React Context provider for auth state.
    
2. Re-implement Deity Manager: Convert the deity-manager.js logic into a React Client Component. This component will be responsible for fetching data from Firestore and managing its own state.
    
3. Re-implement Authentication: Convert the auth UI and logic into a Client Component to be placed in the main layout.
    

#### Phase 3: Advanced Interactivity & AI

1. Build Note Navigation: Create a recursive sidebar component that reads the entire note structure and generates a collapsible file tree.
    
2. Implement Backlinks: During the build process, create a map of all wikilinks. On each note's page, use this map to display its backlinks.
    
3. Implement LLM Chat (Q&A and Brainstorming):
    

- Build the chat UI component.
    
- Create a Next.js API Route (app/api/chat/route.ts) to act as a secure backend that receives context from the chat UI and forwards it to the Gemini API.
    

4. Implement In-Browser Note Editing:
    

- Create a toggleable "Edit Mode" for the note view.
    
- Use a rich text editor component (e.g., TipTap) that supports Markdown.
    
- Implement a saving mechanism that uses the GitHub API to commit changes directly back to the .md file in the repository, effectively creating a two-way sync.
    

### 4.3. Required Steps for Migration

1. Repository Restructuring: Create the next-app directory. Move all original website files into an old_website directory for archival. The notes directory remains at the root.
    
2. Dependency Management: All new dependencies (next, react, firebase, gray-matter, remark, etc.) will be managed via npm or yarn within the next-app directory's package.json.
    
3. Configuration: Set up the necessary Next.js configuration files: next.config.mjs, tailwind.config.ts, tsconfig.json, and postcss.config.js.
    
4. Incremental Componentization: Gradually break down the features of the original application into discrete, reusable React components within the new architecture.
    

**