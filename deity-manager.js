// deity-manager.js
import { collection, onSnapshot, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { APP_ID } from './firebase-init.js'; 
import { initialDeityDataFallback } from './data-constants.js'; 
import { markedInstance } from './markdown-parser.js'; // Import the configured marked instance

let deityData = []; 
let currentDeityDocId = null; 
let db = null;
let currentUserId = null;
let isCurrentUserEditor = false; 

// UI elements (passed from ui-manager or accessed directly if necessary)
const deityGrid = document.getElementById('deity-grid');
const searchInput = document.getElementById('deity-search');
const rankFiltersContainer = document.getElementById('rank-filters');
const loadingOverlay = document.getElementById('loading-overlay');

const deityModal = document.getElementById('deity-modal');
const deityModalCloseButton = document.getElementById('deity-modal-close-button');
const modalViewMode = document.getElementById('modal-view-mode');
const modalEditMode = document.getElementById('modal-edit-mode');

const modalDeityName = document.getElementById('modal-deity-name');
const modalDeityAliases = document.getElementById('modal-deity-aliases');
const modalDeityTags = document.getElementById('modal-deity-tags');
const modalDeityDescriptionRendered = document.getElementById('modal-deity-description-rendered');
const modalDeityAdditionalRendered = document.getElementById('modal-deity-additional-rendered');

const deityModalEditButton = document.getElementById('deity-modal-edit-button');
const deityModalSaveButton = document.getElementById('deity-modal-save-button');
const deityModalCancelButton = document.getElementById('deity-modal-cancel-button');

const editDeityNameDisplay = document.getElementById('edit-deity-name-display');
const editDeityAliases = document.getElementById('edit-deity-aliases');
const editDeityTags = document.getElementById('edit-deity-tags');
const editDeityDescription = document.getElementById('edit-deity-description');
const editDeityOfferings = document.getElementById('edit-deity-offerings');
const editDeityFavors = document.getElementById('edit-deity-favors');
const editDeityStartingBoon = document.getElementById('edit-deity-startingBoon');
const editDeityDomain = document.getElementById('edit-deity-domain');

let activeRankFilter = 'All';

export function initializeDeityManager(firestoreInstance, userIdParam, isEditorParam) {
    db = firestoreInstance;
    currentUserId = userIdParam;
    isCurrentUserEditor = isEditorParam; 

    // Adjust edit button visibility based on editor status
    if (deityModalEditButton) { 
        if (isCurrentUserEditor) {
            deityModalEditButton.classList.remove('hidden');
        } else {
            deityModalEditButton.classList.add('hidden');
        }
    }

    // Set up real-time listener for deities collection
    const deitiesColRef = collection(db, `artifacts/${APP_ID}/public/data/deities`);
    onSnapshot(deitiesColRef, async (snapshot) => { 
        deityData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Firestore snapshot received. Number of deities:", deityData.length);

        if (deityData.length === 0 && snapshot.empty) {
            console.log("Firestore collection is empty, seeding with initial data...");
            await seedFirestoreWithInitialData(); 
        } else {
            console.log("Populating default details and rendering deities.");
            populateDefaultDeityDetails(); 
            setupFilters(); 
            renderDeities();
        }
        loadingOverlay.classList.add('hidden'); 
    }, (error) => {
        console.error("Error fetching deities:", error);
        loadingOverlay.classList.add('hidden'); 
    });

    // Event listeners for UI interactions
    searchInput.addEventListener('input', renderDeities);
    deityModalCloseButton.addEventListener('click', closeDeityModal);
    deityModal.addEventListener('click', (e) => {
        if (e.target === deityModal) {
            closeDeityModal();
        }
    });
    deityModalEditButton.addEventListener('click', toggleEditMode);
    deityModalSaveButton.addEventListener('click', saveDeityChanges);
    deityModalCancelButton.addEventListener('click', toggleEditMode);
}

async function seedFirestoreWithInitialData() {
    if (!db) {
        console.error("Firestore not initialized for seeding.");
        return;
    }
    const deitiesColRef = collection(db, `artifacts/${APP_ID}/public/data/deities`);
    for (const deity of initialDeityDataFallback) {
        try {
            const docRef = doc(deitiesColRef, deity.name); 
            await setDoc(docRef, deity);
            console.log(`Seeded deity: ${deity.name}`);
        } catch (error) {
            console.error(`Error seeding deity ${deity.name}:`, error);
        }
    }
    console.log("Initial deity data seeding complete.");
}

function getRank(tags) {
    if (!tags) return 'Other';
    if (tags.includes('God/Primordial')) return 'Primordial';
    if (tags.includes('God/Overlord')) return 'Overlord';
    if (tags.includes('God/LowerGod')) return 'Lower God';
    if (tags.includes('God/GreatOldOnes')) return 'Great Old One';
    if (tags.includes('God/Devil')) return 'Devil';
    if (tags.includes('God/OuterGod')) return 'Outer God';
    return 'Other';
}

function getTagColor(rank) {
    const colors = {
        'Primordial': 'bg-sky-200 text-sky-800',
        'Overlord': 'bg-amber-200 text-amber-800',
        'Lower God': 'bg-teal-200 text-teal-800',
        'Great Old One': 'bg-purple-200 text-purple-800',
        'Devil': 'bg-red-200 text-red-800',
        'Outer God': 'bg-indigo-200 text-indigo-800',
        'Other': 'bg-slate-200 text-slate-800',
    };
    return colors[rank] || colors['Other'];
}

function renderDeities() {
    const searchTerm = searchInput.value.toLowerCase();
    deityGrid.innerHTML = '';

    const filteredDeities = deityData.filter(deity => {
        const matchesSearch = deity.name.toLowerCase().includes(searchTerm) || (deity.aliases && deity.aliases.toLowerCase().includes(searchTerm));
        const matchesRank = activeRankFilter === 'All' || getRank(deity.tags) === activeRankFilter;
        return matchesSearch && matchesRank;
    });

    filteredDeities.forEach(deity => {
        const rank = getRank(deity.tags);
        const card = document.createElement('div');
        card.className = 'deity-card bg-white rounded-xl shadow-md p-5 flex flex-col';
        card.innerHTML = `
            <div class="flex-1">
                <div class="flex justify-between items-start">
                    <h4 class="text-xl font-bold text-slate-800">${deity.name}</h4>
                    <span class="text-xs font-semibold px-2 py-1 rounded-full ${getTagColor(rank)}">${rank}</span>
                </div>
                <p class="text-sm text-slate-500 italic mb-3">${deity.aliases || ' '}</p>
                <p class="text-base text-slate-600">${deity.description ? truncateText(deity.description, 150) : 'No description available.'}</p>
            </div>
        `;
        card.addEventListener('click', () => openDeityModal(deity));
        deityGrid.appendChild(card);
    });
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

function openDeityModal(deity) {
    currentDeityDocId = deity.id; 
    
    modalDeityName.textContent = deity.name;
    modalDeityAliases.textContent = deity.aliases || '';
    
    modalDeityTags.innerHTML = '';
    (deity.tags || []).forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = `text-xs font-semibold px-2 py-1 rounded-full ${getTagColor(getRank(deity.tags))}`; 
        tagSpan.textContent = tag;
        modalDeityTags.appendChild(tagSpan);
    });

    // Render description with Markdown using the globally configured marked instance
    modalDeityDescriptionRendered.innerHTML = markedInstance.parse(deity.description || 'No description available.');
    
    modalDeityAdditionalRendered.innerHTML = '';
    let additionalHtml = '';
    if (deity.offerings) {
        additionalHtml += `<p><b class="font-semibold">Offerings</b>: ${deity.offerings}</p>`;
    }
    if (deity.favors) {
        additionalHtml += `<p><b class="font-semibold">Favors</b>: ${deity.favors}</p>`;
    }
    if (deity.startingBoon) {
         let boonText = '';
         if (Array.isArray(deity.startingBoon)) {
             boonText = deity.startingBoon.join(', ');
         } else {
             boonText = deity.startingBoon;
         }
        additionalHtml += `<p><b class="font-semibold">Starting Boon</b>: ${boonText}</p>`;
    }
    if (deity.domain) {
        additionalHtml += `<p><b class="font-semibold">Domain</b>: ${deity.domain}</p>`;
    }
    // Render additional info with Markdown using the globally configured marked instance
    modalDeityAdditionalRendered.innerHTML = markedInstance.parse(additionalHtml); 
    
    editDeityNameDisplay.textContent = deity.name; 
    editDeityAliases.value = deity.aliases || '';
    editDeityTags.value = (deity.tags || []).join(', ');
    editDeityDescription.value = deity.description || '';
    editDeityOfferings.value = deity.offerings || '';
    editDeityFavors.value = deity.favors || '';
    editDeityStartingBoon.value = Array.isArray(deity.startingBoon) ? deity.startingBoon.join(', ') : (deity.startingBoon || '');
    editDeityDomain.value = deity.domain || '';

    // Conditionally show/hide edit button based on editor status
    if (deityModalEditButton) {
        if (isCurrentUserEditor) {
            deityModalEditButton.classList.remove('hidden');
        } else {
            deityModalEditButton.classList.add('hidden');
        }
    }

    modalViewMode.classList.remove('hidden');
    modalEditMode.classList.add('hidden');
    deityModal.classList.add('open');
}

function closeDeityModal() {
    deityModal.classList.remove('open');
    currentDeityDocId = null; 
}

function toggleEditMode() {
    modalViewMode.classList.toggle('hidden');
    modalEditMode.classList.toggle('hidden');
}

async function saveDeityChanges() {
    if (!db || !currentUserId || !isCurrentUserEditor) { 
        console.error("Firestore not initialized, user not authenticated, or not authorized to edit.");
        return;
    }
    if (currentDeityDocId) {
        loadingOverlay.classList.remove('hidden'); 
        try {
            const deityRef = doc(db, `artifacts/${APP_ID}/public/data/deities`, currentDeityDocId);
            await setDoc(deityRef, {
                name: editDeityNameDisplay.textContent, 
                aliases: editDeityAliases.value,
                tags: editDeityTags.value.split(',').map(tag => tag.trim()).filter(tag => tag),
                description: editDeityDescription.value,
                offerings: editDeityOfferings.value,
                favors: editDeityFavors.value,
                startingBoon: editDeityStartingBoon.value.split(',').map(item => item.trim()).filter(item => item),
                domain: editDeityDomain.value,
            }, { merge: true }); 

            console.log("Deity updated successfully!");
            closeDeityModal();
        } catch (error) {
            console.error("Error updating deity:", error);
        } finally {
            loadingOverlay.classList.add('hidden'); 
        }
    }
}

function populateDefaultDeityDetails() {
    const defaultDetails = {
        'Apollo': { domain: 'Combat Archery, Barding, Music' },
        'Artemis': { domain: 'Hunting, Moon (via Yorick)' },
        'Osiris': { domain: 'Necromantic magic' },
        'Odin': { domain: 'Rune magic, Teleportation' },
        'Loki': { domain: 'Illusions' },
        'Morrigan': { domain: 'Hexblade / spellblade' },
        'Thor': { domain: 'Physical augmentation' },
        'Hermes': { domain: 'Communication, Trading' },
        'Ullr': { domain: 'Survival' },
        'Poseidon': { domain: 'Horse riding, Water (via Yamm)' },
        'Hephaestus': { domain: 'Crafting' },
        'Pan': { domain: 'Druid and nature' },
        'Isis': { domain: 'Healing' },
        'Thoth': { domain: 'Alchemy' },
        'Yamm': { domain: 'Water' },
        'Agni': { domain: 'Fire' },
        'Geb': { domain: 'Earth' },
        'Chronus': { domain: 'Time' },
        'Shamann': { domain: 'Sun (via Ra)' },
        'Yorick': { domain: 'Moon (via Artemis)' },
        'Hypnos': { domain: 'Psychic' },
        'Nemesis': { domain: 'Retribution' },
        'Dionysus': { domain: 'Wine making' },
        'Demeter': { domain: 'Agriculture' },
        'Dagan': { domain: 'Agriculture' },
        'Hades': { domain: 'Mining' },
        'Heracles': { domain: 'Hand to hand combat' },
        'Cthulhu': { domain: 'Cosmic Horror, Corruption' }
    };

    deityData.forEach(deity => { 
        const name = deity.name;
        if (defaultDetails[name]) {
            Object.keys(defaultDetails[name]).forEach(key => {
                if (deity[key] === undefined || deity[key] === null || deity[key] === '') {
                    deity[key] = defaultDetails[name][key];
                }
            });
        }
        if (!deity.description) {
            const fallbackItem = initialDeityDataFallback.find(item => item.name === name);
            if (fallbackItem) {
                deity.description = fallbackItem.description;
            }
        }
        if (!deity.tags || !Array.isArray(deity.tags) || deity.tags.length === 0) {
            deity.tags = ['Other'];
        }
    });
}

function setupFilters() {
    rankFiltersContainer.innerHTML = ''; 
    const ranks = ['All', ...new Set(deityData.map(d => getRank(d.tags)))].sort(); 
    ranks.forEach(rank => {
        const button = document.createElement('button');
        button.textContent = rank;
        button.className = 'px-4 py-2 text-sm font-medium rounded-lg transition';
        if (rank === activeRankFilter) {
            button.classList.add('bg-amber-500', 'text-white', 'shadow');
        } else {
            button.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-200');
        }
        button.addEventListener('click', () => {
            activeRankFilter = rank;
            document.querySelectorAll('#rank-filters button').forEach(btn => {
                btn.classList.remove('bg-amber-500', 'text-white', 'shadow');
                 btn.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-200');
            });
            button.classList.add('bg-amber-500', 'text-white', 'shadow');
            button.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-200');
            renderDeities();
        });
        rankFiltersContainer.appendChild(button);
    });
}
