// lore-library-manager.js

// Marked.js is globally available via CDN link in index.html, no import needed here.

// List of Markdown files to display in the Lore Library
// IMPORTANT: Manually add paths to your notes here, relative to the /notes/ directory in your GitHub repo
export const loreFiles = [
    // Gameplay
    'Gameplay/Ascending to Godhood.md',
    'Gameplay/Early Game.md',
    'Gameplay/End Game.md',
    'Gameplay/Gameplay Domains.md',
    'Gameplay/Mastering a Domain.md',
    'Gameplay/Mid Game.md',
    'Gameplay/notes.md',
    'Gameplay/Starting Boon.md',
    'Gameplay/The Labyrinth.md',

    // Ideas
    'Ideas/Death Delay.md',
    'Ideas/Food Queue.md',
    'Ideas/Human Skulls.md',
    'Ideas/Meditation.md',
    'Ideas/Players Name.md',
    'Ideas/PVP.md',
    'Ideas/Race.md',
    'Ideas/Underworld.md',

    // Introduction
    'Introduction/Game Design Doscument Old.md',
    'Introduction/Inspirations and Influences.md',
    'Introduction/Introduction.md',

    // Items
    'Items/Cling.md',
    'Items/Soulbind.md',
    // Items/Armor
    'Items/Armor/Armor.md',
    'Items/Armor/Ogre Mask.md',
    // Items/Armor/Armor Slots
    'Items/Armor/Armor Slots/Breastplate.md',
    'Items/Armor/Armor Slots/Gauntlets.md',
    'Items/Armor/Armor Slots/Gloves.md',
    'Items/Armor/Armor Slots/Greaves.md',
    'Items/Armor/Armor Slots/Helmet.md',
    'Items/Armor/Armor Slots/Hood.md',
    'Items/Armor/Armor Slots/Sabatons.md',
    'Items/Armor/Armor Slots/Shirt.md',
    'Items/Armor/Armor Slots/Shoes.md',
    'Items/Armor/Armor Slots/Trousers.md',
    // Items/Blessings
    'Items/Blessings/Bloodthirsty Vision.md',
    'Items/Blessings/Messangers Blessing.md',
    // Items/Crafting
    'Items/Crafting/Crafting.md',
    // Items/Crafting/Crafting Materials
    'Items/Crafting/Crafting Materials/Nullstone.md',
    // Items/Crafting/Crafting Materials/Crystals
    'Items/Crafting/Crafting Materials/Crystals/Crystal.md',
    'Items/Crafting/Crafting Materials/Crystals/Crystals Tier List.md',
    // Items/Crafting/Crafting Materials/Fabrics
    'Items/Crafting/Crafting Materials/Fabrics/Cotton.md',
    'Items/Crafting/Crafting Materials/Fabrics/Linen.md',
    'Items/Crafting/Crafting Materials/Fabrics/Silk.md',
    // Items/Crafting/Crafting Materials/Metals
    'Items/Crafting/Crafting Materials/Metals/Copper.md',
    'Items/Crafting/Crafting Materials/Metals/Gold.md',
    'Items/Crafting/Crafting Materials/Metals/Iron.md',
    'Items/Crafting/Crafting Materials/Metals/Metals.md',
    'Items/Crafting/Crafting Materials/Metals/Silver.md',
    'Items/Crafting/Crafting Materials/Metals/Tin.md',
    // Items/Crafting/Crafting Stations
    'Items/Crafting/Crafting Stations/Alchemy Bath.md',
    'Items/Crafting/Crafting Stations/Anvil.md',
    'Items/Crafting/Crafting Stations/Loom.md',
    'Items/Crafting/Crafting Stations/Smelter.md',
    'Items/Crafting/Crafting Stations/Spinning Wheel.md',
    'Items/Crafting/Crafting Stations/Tanning Rack.md',
    'Items/Crafting/Crafting Stations/Vacuum Chamber.md',
    'Items/Crafting/Crafting Stations/Wood Kiln.md',
    'Items/Crafting/Crafting Stations/Wood Press.md',
    'Items/Crafting/Crafting Stations/Workbench.md',
    // Items/Relics
    'Items/Relics/All-Seeing Eye.md',
    'Items/Relics/Everlasting Aegis.md',
    'Items/Relics/Excalibur.md',
    'Items/Relics/Fleetfoot Hooves.md',
    'Items/Relics/Gorgon\'s Gaze.md',
    'Items/Relics/Legendary Relics.md',
    'Items/Relics/Mjolnir.md',
    'Items/Relics/Shroud Helm.md',
    'Items/Relics/Skywalkers.md',
    'Items/Relics/Thunderrod.md',
    // Items/Weapons
    'Items/Weapons/Sword.md',
    'Items/Weapons/Weapon.md',

    // Magic
    'Magic/Mage.md',
    'Magic/Magic Domains.md',
    'Magic/Magic Schools.md',
    'Magic/Ritual.md',
    'Magic/Spell.md',
    // Magic/Magic Schools
    'Magic/Magic Schools/Abjuration School.md',
    'Magic/Magic Schools/Conjuration School.md',
    'Magic/Magic Schools/Divination School.md',
    'Magic/Magic Schools/Enchantment School.md',
    'Magic/Magic Schools/Evocation School.md',
    'Magic/Magic Schools/Illusion School.md',
    'Magic/Magic Schools/Necromancy School.md',
    'Magic/Magic Schools/Transmutation School.md',
    // Magic/Spells
    'Magic/Spells/Fog Cloud.md',
    'Magic/Spells/Haste.md',
    'Magic/Spells/Life Toll.md',
    'Magic/Spells/Mana Blast.md',
    
    // Melee Combat (placeholder, assuming it's a file)
    'Melee Combat.md', 

    // Player Mechanics
    'Player Mechanics/Attribute.md',
    'Player Mechanics/Health System.md',
    'Player Mechanics/Magic System.md',
    'Player Mechanics/Physical System.md',
    // Player Mechanics/Damage
    'Player Mechanics/Damage/Damage.md',
    'Player Mechanics/Damage/Fire Damage.md',
    'Player Mechanics/Damage/Force Damage.md',
    'Player Mechanics/Damage/Impact Damage.md',
    'Player Mechanics/Damage/Pierce Damage.md',
    'Player Mechanics/Damage/Slash Damage.md',
    // Player Mechanics/Health System
    'Player Mechanics/Health System/Health Max.md',
    'Player Mechanics/Health System/Health.md',
    'Player Mechanics/Health System/Rejuvenance.md',
    'Player Mechanics/Health System/Resilience.md',
    'Player Mechanics/Health System/Vitality.md',
    // Player Mechanics/Magic System (Attributes related to magic, not the Magic System overview itself)
    'Player Mechanics/Magic System/Aether.md',
    'Player Mechanics/Magic System/Arcana.md',
    'Player Mechanics/Magic System/Intelligence.md',
    'Player Mechanics/Magic System/Mana.md',
    'Player Mechanics/Magic System/Will Power.md',
    'Player Mechanics/Magic System/WP soft cap.md',
    // Player Mechanics/Physical System
    'Player Mechanics/Physical System/Endurance.md',
    'Player Mechanics/Physical System/Energy Max.md',
    'Player Mechanics/Physical System/Energy.md',
    'Player Mechanics/Physical System/Stamina.md',
    'Player Mechanics/Physical System/Strength.md',
    'Player Mechanics/Physical System/Vigor Base.md',
    'Player Mechanics/Physical System/Vigor.md',
    // Player Mechanics/Player Attributes (general attributes)
    'Player Mechanics/Player Attributes/Gigantism.md',
    // Player Mechanics/Training
    'Player Mechanics/Training/Training.md',

    // smart-chats
    'smart-chats/CHAT 2024-08-11 crafting system.md',

    // Technical
    'Technical/Back end.md',
    'Technical/Development Tasks.md',

    // World Building
    'World Building/Kedem Worldbuilding.md',
    'World Building/Lore.md',
    // World Building/Flora
    'World Building/Flora/Beech.md',
    'World Building/Flora/Birch.md',
    'World Building/Flora/Fir.md',
    'World Building/Flora/Oak.md',
    'World Building/Flora/Palm.md',
    'World Building/Flora/Pine.md',
    'World Building/Flora/Spurce.md',
    // World Building/Gods
    'World Building/Gods/God.md',
    'World Building/Gods/Overlord.md',
    'World Building/Gods/Primordial.md',
    // World Building/Gods/Devils
    'World Building/Gods/Devils/Ashmedai.md',
    'World Building/Gods/Devils/Azazel.md',
    'World Building/Gods/Devils/Ben Shahar.md',
    'World Building/Gods/Devils/Samael.md',
    // World Building/Gods/Great Old Ones
    'World Building/Gods/Great Old Ones/Cthulhu.md',
    'World Building/Gods/Great Old Ones/Nyarlathotep.md',
    // World Building/Gods/Lower Gods
    'World Building/Gods/Lower Gods/Agni.md',
    'World Building/Gods/Lower Gods/Apollo.md',
    'World Building/Gods/Lower Gods/Ares.md',
    'World Building/Gods/Lower Gods/Artemis.md',
    'World Building/Gods/Lower Gods/Athena.md',
    'World Building/Gods/Lower Gods/Brigid.md',
    'World Building/Gods/Lower Gods/Dagan.md',
    'World Building/Gods/Lower Gods/Demeter.md',
    'World Building/Gods/Lower Gods/Dionysus.md',
    'World Building/Gods/Lower Gods/Geb.md',
    'World Building/Gods/Lower Gods/Hephaestus.md',
    'World Building/Gods/Lower Gods/Heracles.md',
    'World Building/Gods/Lower Gods/Hermes.md',
    'World Building/Gods/Lower Gods/Isis.md',
    'World Building/Gods/Lower Gods/Loki.md',
    'World Building/Gods/Lower Gods/Morrigan.md',
    'World Building/Gods/Lower Gods/Nemesis.md',
    'World Building/Gods/Lower Gods/Pan.md',
    'World Building/Gods/Lower Gods/Thor.md',
    'World Building/Gods/Lower Gods/Thoth.md',
    'World Building/Gods/Lower Gods/Ullr.md',
    // World Building/Gods/Overlords
    'World Building/Gods/Overlords/Hades.md',
    'World Building/Gods/Overlords/Hypnos.md',
    'World Building/Gods/Overlords/Odin.md',
    'World Building/Gods/Overlords/Osiris.md',
    'World Building/Gods/Overlords/Poseidon.md',
    'World Building/Gods/Overlords/Ra.md',
    'World Building/Gods/Overlords/Zeus.md',
    // World Building/Gods/Primordial
    'World Building/Gods/Primordial/Azathoth.md',
    'World Building/Gods/Primordial/Chronus.md',
    'World Building/Gods/Primordial/Gaia.md',
    'World Building/Gods/Primordial/Shamann.md',
    'World Building/Gods/Primordial/Yamm.md',
    'World Building/Gods/Primordial/Yorick.md',
    // World Building/Gods/Titans
    'World Building/Gods/Titans/Titan.md',
    // World Building/NPC
    'World Building/NPC/Non Player Characters.md',
    // World Building/NPC/Aberrations
    'World Building/NPC/Aberrations/Mimics.md',
    'World Building/NPC/Aberrations/Voidling.md',
    // World Building/NPC/Animals
    'World Building/NPC/Animals/Bats.md',
    'World Building/NPC/Animals/Bears.md',
    'World Building/NPC/Animals/Beetles.md',
    'World Building/NPC/Animals/Behemoth.md',
    'World Building/NPC/Animals/Boars.md',
    'World Building/NPC/Animals/Camels.md',
    'World Building/NPC/Animals/Cats.md',
    'World Building/NPC/Animals/Chickens.md',
    'World Building/NPC/Animals/Cows.md',
    'World Building/NPC/Animals/Coyotes.md',
    'World Building/NPC/Animals/Deer.md',
    'World Building/NPC/Animals/Dogs.md',
    'World Building/NPC/Animals/Donkeys.md',
    'World Building/NPC/Animals/Dragonflies.md',
    'World Building/NPC/Animals/Ducks.md',
    'World Building/NPC/Animals/Falcons.md',
    'World Building/NPC/Animals/Ferrets.md',
    'World Building/NPC/Animals/Fireflies.md',
    'World Building/NPC/Animals/Foxes.md',
    'World Building/NPC/Animals/Frogs.md',
    'World Building/NPC/Animals/Geese.md',
    'World Building/NPC/Animals/Giant Crabs.md',
    'World Building/NPC/Animals/Giant Moths.md',
    'World Building/NPC/Animals/Giant Serpents.md',
    'World Building/NPC/Animals/Giant Sloths.md',
    'World Building/NPC/Animals/Glowtoads.md',
    'World Building/NPC/Animals/Goats.md',
    'World Building/NPC/Animals/Horses.md',
    'World Building/NPC/Animals/Hyenas.md',
    'World Building/NPC/Animals/Komodo Dragons.md',
    'World Building/NPC/Animals/Komodo Hounds.md',
    'World Building/NPC/Animals/Land Squids.md',
    'World Building/NPC/Animals/Lions.md',
    'World Building/NPC/Animals/Lizards.md',
    'World Building/NPC/Animals/Llama.md',
    'World Building/NPC/Animals/Mammoths.md',
    'World Building/NPC/Animals/Mice.md',
    'World Building/NPC/Animals/Monkeys.md',
    'World Building/NPC/Animals/Mossbacks.md',
    'World Building/NPC/Animals/Owlcats.md',
    'World Building/NPC/Animals/Pigs.md',
    'World Building/NPC/Animals/Porcupine.md',
    'World Building/NPC/Animals/Rabbits.md',
    'World Building/NPC/Animals/Raccoons.md',
    'World Building/NPC/Animals/Ravens.md',
    'World Building/NPC/Animals/Sabertooth.md',
    'World Building/NPC/Animals/Sheep.md',
    'World Building/NPC/Animals/Small Snakes.md',
    'World Building/NPC/Animals/Squirrels.md',
    'World Building/NPC/Animals/Terror Birds.md',
    'World Building/NPC/Animals/Tigers.md',
    'World Building/NPC/Animals/Toads.md',
    'World Building/NPC/Animals/Tortoise.md',
    'World Building/NPC/Animals/Wolverines.md',
    'World Building/NPC/Animals/Wolves.md',
    'World Building/NPC/Animals/Wyvernlings.md',
    'World Building/NPC/Animals/Wyverns.md',
    // World Building/NPC/Archbeasts
    'World Building/NPC/Archbeasts/Archbeast.md',
    'World Building/NPC/Archbeasts/Dragon.md',
    'World Building/NPC/Archbeasts/Griffon.md',
    'World Building/NPC/Archbeasts/Manticore.md',
    'World Building/NPC/Archbeasts/Phoenix.md',
    'World Building/NPC/Archbeasts/Unicorn.md',
    // World Building/NPC/Bosses
    'World Building/NPC/Bosses/Frost Giant.md',
    // World Building/NPC/Demons
    'World Building/NPC/Demons/Skinwalker.md',
    // World Building/NPC/Devils
    'World Building/NPC/Devils/Imps.md',
    // World Building/NPC/Fey
    'World Building/NPC/Fey/Pixies.md',
    // World Building/NPC/Fiends
    'World Building/NPC/Fiends/Medusa.md',
    // World Building/NPC/Humanoids
    'World Building/NPC/Humanoids/Goblin.md',
    'World Building/NPC/Humanoids/Hobgoblin.md',
    'World Building/NPC/Humanoids/Minotaur.md',
    'World Building/NPC/Humanoids/Ogre.md',
    'World Building/NPC/Humanoids/Orc.md',
    'World Building/NPC/Humanoids/Troll.md',
    // World Building/NPC/Monsters
    'World Building/NPC/Monsters/Ophanim.md',
    // World Building/NPC/Spirits
    'World Building/NPC/Spirits/Djinn.md',
    'World Building/NPC/Spirits/Phantom.md',
    // World Building/NPC/Undead
    'World Building/NPC/Undead/Ghoul.md',
    // World Building/Regions
    'World Building/Regions/Boreal Forest (Frostpine Wilds).md',
    'World Building/Regions/Dark Sea.md',
    'World Building/Regions/Desert (Gravewind Sands).md',
    'World Building/Regions/Desert (Wild Arids).md',
    'World Building/Regions/Highlands.md',
    'World Building/Regions/Magical Forest (Elderglim Woods).md',
    'World Building/Regions/Oasis.md',
    'World Building/Regions/Olympus.md',
    'World Building/Regions/Styx River.md',
    'World Building/Regions/Tundra (The Barren Expanse).md',
    
    // z Misc
    'z Misc/Lumen Command.md'
];

export function setupLoreLibrary(loadingOverlay) {
    const loreNotesList = document.getElementById('lore-notes-list');
    const loreNoteTitle = document.getElementById('lore-note-title');
    const loreNoteContent = document.getElementById('lore-note-content');
    loreNotesList.innerHTML = ''; 

    const sortedLoreFiles = [...loreFiles].sort((a, b) => {
        const nameA = a.replace('.md', '').split('/').pop().replace(/([A-Z])/g, ' $1').trim();
        const nameB = b.replace('.md', '').split('/').pop().replace(/([A-Z])/g, ' $1').trim();
        return nameA.localeCompare(nameB);
    });

    sortedLoreFiles.forEach(file => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#`; 
        const displayName = file.replace('.md', '').split('/').pop().replace(/([A-Z])/g, ' $1').trim(); 
        link.textContent = displayName;
        link.className = 'block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors duration-200';
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            loadingOverlay.classList.remove('hidden');
            // Construct the raw GitHub URL for the markdown file
            const rawGitHubUrl = `https://raw.githubusercontent.com/Artemisiye/Kedem-World-Anvil/main/notes/${file}`;
            
            try {
                const response = await fetch(rawGitHubUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} - Could not access raw file. Ensure it's public and path is correct.`);
                }
                const markdownText = await response.text();
                loreNoteTitle.textContent = displayName; // Use the clean display name
                loreNoteContent.innerHTML = marked.parse(markdownText); // Parse Markdown to HTML
            } catch (error) {
                console.error('Error fetching Markdown file:', error);
                loreNoteTitle.textContent = `Error loading ${displayName}`;
                loreNoteContent.innerHTML = `<p class="text-red-600">Could not load note. Please ensure the file path is correct and the file is publicly accessible.</p><p>Error: ${error.message}</p>`;
            } finally {
                loadingOverlay.classList.add('hidden');
            }
            // Highlight active link
            document.querySelectorAll('#lore-notes-list a').forEach(el => el.classList.remove('bg-slate-300', 'font-semibold'));
            link.classList.add('bg-slate-300', 'font-semibold');
        });
        listItem.appendChild(link);
        loreNotesList.appendChild(listItem);
    });
}
