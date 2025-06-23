// data-constants.js

export const initialDeityDataFallback = [
    { name: 'Azathoth', aliases: 'The Blind Idiot God, Chaos', tags: ['God/OuterGod'], description: 'The embodiment of chaos and destruction. A devouring black hole that seeks to bring the cosmos to its end. The mere presence of Azathoth warps space and time, threatening the existence of the Primordials.', domain: 'Chaos, Destruction' },
    { name: 'Chronus', aliases: 'The Time', tags: ['God/Primordial'], description: 'The Cosmic/Primordial Deity embodying time itself.', domain: 'Time' },
    { name: 'Gaia', aliases: 'The Earth', tags: ['God/Primordial'], description: 'Gaia is the primordial embodiment of the living world—land, soil, root, and breath. She is not worshiped in temples like the Overlords, but her presence is felt in every forest, mountain, and heartbeat. All natural mana flows from Gaia, and it is through her that the cycle of life, death, and rebirth is maintained. She is vast, ancient, and mostly dormant. Humanoids were intended to serve her, but humans—born of Prometheus—are unique in that they are no longer tied to her cycle.', domain: 'Earth, Nature, Life Cycle' },
    { name: 'Shamann', aliases: 'The Sun', tags: ['God/Primordial'], description: 'The Sun Itself, a radiant entity beaming with light and power. Shamann’s light provides strength to the Overlords and Gaia herself.', domain: 'Sun, Light, Power' },
    { name: 'Yamm', aliases: 'The Ocean', tags: ['God/Primordial'], description: 'The Cosmic/Primordial Deity embodying the ocean itself.', domain: 'Ocean, Water' },
    { name: 'Yorick', aliases: 'The Moon', tags: ['God/Primordial'], description: 'The Cosmic/Primordial Deity embodying the moon itself.', domain: 'Moon, Night, Cycles' },
    { name: 'Hades', aliases: '', tags: ['Influence/Greek', 'God/Overlord'], description: 'A Greek Overlord deity. Oversees the underworld.', domain: 'Mining, Underworld' },
    { name: 'Hypnos', aliases: '', tags: ['Influence/Greek', 'God/Overlord'], description: 'A Greek Overlord deity. Played a role in imprisoning Cthulhu.', domain: 'Psychic, Sleep, Dreams' },
    { name: 'Odin', aliases: '', tags: ['Influence/Norse', 'God/Overlord'], description: 'The All-Knowing-Father, a god of wisdom, knowledge, and magic. He sacrificed much to gain knowledge of the cosmic forces, guiding humanity and the gods alike in matters of fate.', domain: 'Rune magic, Teleportation, Wisdom' },
    { name: 'Osiris', aliases: '', tags: ['Influence/Egyptian', 'God/Overlord'], description: 'An Egyptian Overlord deity. Associated with the afterlife and resurrection.', domain: 'Necromantic magic, Afterlife' },
    { name: 'Poseidon', aliases: '', tags: ['Influence/Greek', 'God/Overlord'], description: 'A Greek Overlord deity. Ruler of the seas and storms.', domain: 'Horse riding, Water, Seas, Storms' },
    { name: 'Ra', aliases: '', tags: ['Influence/Egyptian', 'God/Overlord'], description: 'The Sun Overlord, the god of science, light and order, who spins Gaia to brings the sun across the sky each day. Ra’s power is connected directly to Shamann, who\'s power is channeled through the sun temples.', domain: 'Sun, Order, Science' },
    { name: 'Zeus', aliases: 'General of the Gods', tags: ['Influence/Greek', 'God/Overlord'], description: 'Zeus is one of the Overlords, known as the General of the Gods, the lord of the sky and thunder. Zeus rules from his temple in Mount Olympus, governing the west of the continent and overseeing Cthulhu\'s prison.', domain: 'Sky, Thunder, Kingship' },
    { name: 'Agni', aliases: '', tags: ['Influence/Hindu', 'God/LowerGod'], description: 'A Hindu Lower God. Embodies the sacred fire.', domain: 'Fire' },
    { name: 'Apollo', aliases: '', tags: ['Influence/Greek', 'God/LowerGod'], description: 'A Greek Lower God. God of music, poetry, light, healing, and archery.', domain: 'Combat Archery, Barding, Music, Healing' },
    { name: 'Ares', aliases: '', tags: ['Influence/Greek', 'God/LowerGod'], description: 'God of War and Combat. Known for brute strength and direct conflict. Offerings: Offensive combat abilities, Melee stances. Favors: Offensive combat, Bloodshed, Duels. Starting Boon: Bloodthirsty Vision, Rare bloodthirsty spear.', offerings: 'Offensive combat abilities, Melee stances', favors: 'Offensive combat, Bloodshed, Duels', startingBoon: ['Bloodthirsty Vision', 'Rare bloodthirsty spear'], domain: 'War, Combat' },
    { name: 'Artemis', aliases: '', tags: ['Influence/Greek', 'God/LowerGod'], description: 'A Greek Lower God. Goddess of the hunt, wilderness, wild animals, and the Moon.', domain: 'Hunting, Moon (via Yorick), Wilderness' },
    { name: 'Athena', aliases: '', tags: ['Influence/Greek', 'God/LowerGod'], description: 'Goddess of War and Strategy. Known for wisdom, handicraft, and strategic warfare. Offerings: Defensive combat abilities (parry), Target lock on Combat enhancing spells. Favors: Building communities. Starting Boon: Rare shield and sword.', offerings: 'Defensive combat abilities (parry), Target lock on Combat enhancing spells', favors: 'Building communities', startingBoon: 'Rare shield and sword', domain: 'War Strategy, Wisdom, Craftsmanship' },
    { name: 'Brigid', aliases: '', tags: ['Influence/Celtic', 'God/LowerGod'], description: 'A Celtic Lower God. Goddess of poetry, healing, smithcraft, and domesticated animals.', domain: 'Animal handling, Poetry, Healing, Smithcraft' },
    { name: 'Dagan', aliases: '', tags: ['Influence/Mesopotamian', 'God/LowerGod'], description: 'A Mesopotamian Lower God. God of fertility and grain.', domain: 'Agriculture, Fertility' },
    { name: 'Demeter', aliases: '', tags: ['Influence/Greek', 'God/LowerGod'], description: 'A Greek Lower God. Goddess of harvest and agriculture.', domain: 'Agriculture, Harvest' },
    { name: 'Dionysus', aliases: '', tags: ['Influence/Greek', 'God/LowerGod'], description: 'A Greek Lower God. God of wine, revelry, and ecstasy.', domain: 'Wine making, Festivity' },
    { name: 'Geb', aliases: '', tags: ['Influence/Egyptian', 'God/LowerGod'], description: 'An Egyptian Lower God. God of the Earth and vegetation.', domain: 'Earth, Vegetation' },
    { name: 'Hephaestus', aliases: '', tags: ['Influence/Greek', 'God/LowerGod'], description: 'A Greek Lower God. God of blacksmiths, craftsmen, artisans, sculptors, metals, metallurgy, fire, and volcanoes.', domain: 'Crafting, Smithing, Fire' },
    { name: 'Heracles', aliases: '', tags: ['Influence/Greek', 'God/LowerGod'], description: 'A Greek Lower God. Divine hero renowned for his strength and numerous adventures.', domain: 'Hand to hand combat, Strength' },
    { name: 'Hermes', aliases: '', tags: ['Influence/Greek', 'God/LowerGod'], description: 'A Greek Lower God. Messenger of the gods, god of trade, eloquence, and trickery.', domain: 'Communication, Trading, Travel' },
    { name: 'Isis', aliases: '', tags: ['Influence/Egyptian', 'God/LowerGod'], description: 'An Egyptian Lower God. Goddess of magic, healing, and motherhood.', domain: 'Healing, Magic, Motherhood' },
    { name: 'Loki', aliases: '', tags: ['Influence/Norse', 'God/LowerGod'], description: 'A Norse Lower God. Trickster god of mischief, illusions, and fire.', domain: 'Illusions, Mischief, Fire' },
    { name: 'Morrigan', aliases: '', tags: ['Influence/Celtic', 'God/LowerGod'], description: 'A Celtic Lower God. Goddess of war, fate, and death, often appearing as a crow or raven.', domain: 'Hexblade / spellblade, War, Fate' },
    { name: 'Nemesis', aliases: '', tags: ['Influence/Greek', 'God/LowerGod'], description: 'A Greek Lower God. Goddess of retribution and divine vengeance.', domain: 'Retribution, Vengeance' },
    { name: 'Pan', aliases: '', tags: ['Influence/Greek', 'God/LowerGod'], description: 'A Greek Lower God. God of the wild, shepherds, and rustic music.', domain: 'Druid and nature, Wild, Music' },
    { name: 'Thor', aliases: '', tags: ['Influence/Norse', 'God/LowerGod'], description: 'A Norse Lower God. God of thunder, lightning, storms, strength, and the protection of mankind.', domain: 'Physical augmentation, Thunder, Strength' },
    { name: 'Thoth', aliases: '', tags: ['Influence/Egyptian', 'God/LowerGod'], description: 'An Egyptian Lower God. God of writing, magic, wisdom, and the moon.', domain: 'Alchemy, Wisdom, Writing' },
    { name: 'Ullr', aliases: '', tags: ['Influence/Norse', 'God/LowerGod'], description: 'A Norse Lower God. God of skiing, hunting, bow, and shield.', domain: 'Survival, Hunting, Archery' },
    { name: 'Cthulhu', aliases: 'The Earth Dweller', tags: ['God/GreatOldOnes'], description: 'An enormous alien entity from beyond the solar system. A Great Old One, Cthulhu embodies cosmic horror and corruption, eternally imprisoned in The Dark Sea yet continuously influencing and corrupting the land.', domain: 'Cosmic Horror, Corruption' },
    { name: 'Nyarlathotep', aliases: 'Nyarlathotep', tags: ['God/GreatOldOnes'], description: 'The Crawling Chaos, a shape-shifting entity that represents deception, madness, and the decay of reality. A manipulator who arrived to infiltrate Gaia after Cthulhu was defeated and trapped.', domain: 'Deception, Madness, Chaos' },
    { name: 'Ashmedai', aliases: 'The Demon King', tags: ['God/Devil'], description: 'Son of Azazel, and known as The Demon King.', domain: 'Demons, Kingship' },
    { name: 'Azazel', aliases: 'Azael', tags: ['God/Devil'], description: 'The Deviant, a former Lower God who became a Devil. Known for introducing forbidden knowledge.', domain: 'Forbidden Knowledge, Deviation' },
    { name: 'Ben Shahar', aliases: 'Hilel, Lucifer, The Lightbringer', tags: ['God/Devil'], description: 'Son of the moon (Yorick), fallen from the moon to the earth. Associated with pride and rebellion.', domain: 'Light, Rebellion, Pride' },
    { name: 'Samael', aliases: 'Satan, The Creeping Death', tags: ['God/Devil'], description: 'An enigmatic god, perhaps the primordial Death Itself. Associated with temptation and destruction.', domain: 'Death, Temptation, Destruction' },
];

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
