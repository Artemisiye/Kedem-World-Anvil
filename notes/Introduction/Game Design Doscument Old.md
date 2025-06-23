**

Kedem - Game Design Document

# Introduction

- ## Overview of the game
    

Kedem is a player-driven MMO RPG survival game set in a vast (open) world where players shape the environment and their destiny.  
The game emphasizes on freedom, individual agency, and unrestricted power fantasy through intuitive mechanics.

- ## High-level concept and goals
    

Kedem aims to offer players a strong power fantasy on their journey to becoming a legend, potentially challenging the gods and ascending to godhood themselves. Players can also choose to oppose the gods and become adversaries through various means.

- ## Target audience
    

# Inspirations and influences

Kedem draws inspiration from a variety of sources, including games, literature, mythology, and the desire to create a unique player experience. Some of the key inspirations and influences include:

- ## Games:
    

- Ark: Survival Evolved - Sandbox survival elements and player-driven world.
    
- Valheim - Sandbox survival with terraforming and less constrained building system.
    
- Rust - Emphasis on player interactions and emergent gameplay.
    
- Albion Online - Player-driven economy and open-world PvP.
    
- V Rising - Blend of survival, RPG, and exploration.
    
- Skyrim - Open-ended gameplay, power fantasy and immersive world.
    
- Souls series (FromSoftware games) - Satisfying combat, movement and fair magic system.
    
- League of Legends - World building and the Petricite element.
    

- ## Literature:
    

- The Inheritance Cycle series by Christopher Paolini - Intuitive approach to magic as an alternative to physical forces.
    
- Lovecraftian literature - The Great Old Ones and cosmic gods will come into play
    

- ## Mythology:
    

Greek, Egyptian, and Norse mythology, which influence the design of gods, creatures, and the game world itself.

- ## Desire for Freedom:
    

The motivation to create a game where players can experience power fantasy without limitations, such as PvP balancing (“this mechanic is too powerful in the context of a matchmaking and can be exploited”) or time constraints (“This mechanic scales with playtime and is unfair against new players”).  
This desire for freedom and player agency is a core principle of Kedem's design.

# Gameplay

  

- ## Early Game:
    

The player starts their journey in Kedem practically naked, spawning in either predetermined starter areas or a random valid location.

They begin by gathering basic resources like wood, stone, and herbs to build their first shelter and defend against creatures of the night, such as wolves.

Players can choose one starting perk, a blessing from a god of worship, which grants them special abilities or advantages.

As they progress, players will work towards acquiring better equipment, such as leather armor, cloth robes, and eventually metal armor.

They will also encounter or seek out gods, who can teach them new skills and offer blessings and resources in exchange for their worship.

- ## Mid Game:
    

In the mid game, players focus on establishing a more advanced base and working towards acquiring their preferred gear and advanced weapons made of steel. 

They will be encouraged to seek out gods and fulfill their requests, which may involve building temples or completing quests. 

Players will also interact more with other players, forming alliances and trading resources. 

- ## End Game:
    

The end game of Kedem is the stage where the players will be able to build their power fantasy. 

- ### The Labyrinth:
    

The Labyrinth is a challenging rogue-like dungeon experience that serves as a major end-game activity in Kedem.  
Players can enter the Labyrinth to test their skills and earn valuable rewards.  
The Labyrinth is procedurally generated, with each run presenting a new layout and challenges.

- #### Random Modifiers:
    

Each room in the Labyrinth has a random modifier that affects gameplay. These modifiers can change the behavior of enemies, alter the environment, or provide temporary buffs or debuffs to the player. Players must adapt to these modifiers to survive and progress through the Labyrinth.

- #### The Minotaur: 
    

At the center of the Labyrinth awaits the final challenge - The Minotaur.

- #### Rewards: 
    

Slaying The Minotaur grants players a collection of randomized weapons to choose from, each with its own unique effects.  
The weapon claimed by the player becomes soul-bound, ensuring that it cannot be lost upon death.

  

- ### Legendary Relics:
    

Players can seek out legendary relics scattered throughout the world of Kedem. These relics are exceptionally powerful and may grant unique abilities or advantages to the player who finds them.  
Legendary relics are one-of-a-kind, and there cannot be more than one instance of a legendary relic per server, meaning only one player can own them, which may lead to emergent interactions in order to claim a legendary item from a player.

Due to the unique status of the relics, inactive players will drop any legendary items they own, and those will reappear in the world in a randomized location.

- ### Mastering a Domain:
    

As players progress through the game, they can choose to focus on mastering a specific domain, such as combat, magic or various crafting arts.

Completely mastering a domain will grant the player the Legendary title, and will grant them the opportunity to challenge the respective god of the domain.

- ### Ascending to Godhood:
    

One of the ultimate goals in Kedem is to ascend to godhood or oppose the gods themselves. Players who successfully challenge and defeat a god, such as Ares, can ascend to take their place and become a new god. As a god, players can guide and train other players, shaping the world of Kedem according to their will.

- ### Opposing the Gods:
    

  
  

# Mechanics

  

- ## Player Attributes:
    

The player will have the following resources and attributes:

- ### Health: [                ]
    
- Health (HP, Resource) - The amount of damage the player can take before dying.  
    1000 by default to all players, and generally will not change throughout the game. Effective health will increase by improving damage mitigation via armor and other means.
    
- Vitality (VIT, Secondary Resource) - Health Core. Represents the player’s wellness and ability to regenerate after leaving combat. Measured in percentages.  
    Recovering health will drain vitality. Eating restores vitality.  
    Can be raised above 100% temporarily, any excess vitality will decay over time.
    
- Resilience (RES, Attribute) - Represents how much 1% of Vitality is worth in HP. 100 by default.
    
- Rejuvenance (REJ, Attribute) - Determines how fast the player can fully recover (assuming 100% Vitality, 1HP)
    
- ### Energy: [                ]
    
- Energy (Resource) - The amount of energy the player has available to use for physical actions.  
    Can be raised above Max Energy, 
    
- Max Energy (Variable) - Soft cap for energy pool. Affected by Endurance.
    
- Endurance (END, Attribute, Trainable) - Represents the capacity to use large amounts of energy i.e. Lift heavy weight.  
    Endurance increases the max energy pool.  
    Training: Performing a physical action will create a target value for endurance, such that at the target endurance, the action will cost the specified percentage of energy from the max.  
      
    
- Stamina (STA, Attribute, Trainable) - The amount of energy the player recovers per second.  
    Training: Continuously performing physical actions will create a tracker for average energy spent per second, and the target stamina will be adjusted to match that average.
    
- Vigor (VIG, Secondary Resource) - Energy Core. Represents energy reserves. Acts as a multiplier to the stamina to determine how much energy is restored per sec.  
    The multiplier is linear between 40% and 150% when at 0% and 100% vigor respectively:  
    Energy_per_sec =Stamina(40+1.1VigorBase_Vigor)  
    Excess vigor will allow excess energy beyond the max value.
    
- Base Vigor (Variable) - The base value for vigor. Based on this variable we calculate the state of the vigor.
    
- Strength (STR, Attribute, Trainable) - Represents the ability to apply force within a time frame i.e. Move an object fast.
    

  

-   
    
-   
    
- ### Mana: [                ]
    
- Mana (Resource) - The amount of energy the player has to use for magic spells.
    
- Will Power (WP, Attribute, Trainable) - Represents the player’s ability to manipulate the flow of mana in the world and channel it into spells or through various sources.
    
- Arcana (Attribute, Trainable) - Represents the player’s expertise in the art of the arcane. There are 10 Arcana Levels that will determine the soft cap for Will Power growth.
    
- WP soft cap (Variable) - Ranges from 8 to 100 in a nonlinear fashion, will mitigate the growth of Will Power, meaning training WP will be more difficult the more WP the player has, resulting in a plateau until reaching the next Arcana level.
    

wp_soft_cap=7.815+2Arcana10.826

bonus_wp = manipulated_mana * 2.1% * soft_cap/(soft_cap + WP)

  

- ### Aether: [                ]
    
- Aether (Resource) - The amount of energy the player has to use for advanced magic spells, like manipulating space and time.  
    Aether will behave in a similar way to mana, but will be a magnitude more difficult to use and obtain.  
    Aether will not replenish passively like mana, but will have to be collected from rare sources, like slaying mythic creatures, or exploring dungeons.
    

  

- ## Soft Caps
    

General Soft Cap Formula: Reduction = Affecting VariableAffecting Variable + Soft Cap  
So for example, calculating damage reduction from armor with a soft cap of 100 will look like: Damage Reduction = ArmorArmor + 100  
Resulting in 33% damage reduction at 50 armor, 50% at 100, 66% at 200 and so on…

  
  

- ## Energy System
    

  

- ### Physical action:
    

Each physical action will require a percentage of the current energy, and the effectiveness of the action will depend on the amount of energy used.

Each action will require a minimum amount of energy to perform. If the player doesn't meet the required strength or energy, it will be slower or less effective.

  

- ## Magic System  
      
    

- ### Casting Spells:
    

In order to cast any spell, the player will have to take their time and pour mana into the spell. The more mana invested, the more effective it will be.

- ### Crystals:
    

Crystals Can be used to contain mana, storing mana particles for long periods without losing them due to their grid structure that can fit inside mana particles. Unlike metal, crystals do not allow mana to flow through them.

Crystals will be sought after by magic users, and can be used as a form of currency.

Different crystals with different levels of purity will be able to store different amounts of mana per carat. 

- ### Gems Tier List:
    

  

#### Grade S - Celestial Gems (Highest Mana Storage):

- Diamond - $15,000 per carat.
    
- Alexandrite - $12,000 per carat.
    
- Ruby - $10,000 per carat.
    

#### Grade A - Noble Gems (High Mana Storage):

- Emerald - $8,000 per carat.
    
- Sapphire - $7,000 per carat.
    
- Aquamarine - $5,000 per carat.
    

#### Grade B - Royal Gems (Moderate Mana Storage):

- Amethyst - $3,000 per carat.
    
- Tourmaline - $2,500 per carat.
    
- Citrine - $2,000 per carat.
    

#### Grade C - Noble Gems (Low Mana Storage):

- Garnet - $1,500 per carat.
    
- Peridot - $1,200 per carat.
    
- Topaz - $1,000 per carat.
    

#### Grade D - Common Gems (Minimal Mana Storage):

- Opal - $800 per carat.
    
- Moonstone - $600 per carat.
    
- Turquoise - $500 per carat.
    

#### Grade E - Ordinary Gems (Negligible Mana Storage):

- Lapis Lazuli - $300 per carat.
    
- Onyx - $200 per carat.
    
- Jade - $100 per carat.
    

- ### Maginullium / Nullstones:
    

Soft clay-like material that can absorb Mana and nullify spells. When it comes into contact with Mana, it undergoes a rapid crystallization process, becoming hard and brittle, eventually crumbling apart into dust.

Can be used as a crafting component to grant anti-magic properties to weapons, armor and buildings.

- ### Metals:
    

Metals have the property of conducting Mana, just like electricity. When a mage channels mana into a spell, part of it can be disrupted by the presence of metals, like armor and weapons, reducing the effectiveness of the mana flow.  
Note the metals do not absorb mana from already cast spells. 

Different metals with different conductivity disrupt the flow differently. Good conductivity like in silver will disrupt very little, and bad conductivity like iron will disrupt the flow heavily.  
Therefore, magic users are encouraged to wear non metallic armor, like cloth robes pure-caster or leather armor for hybrid builds, and precious metals like silver and gold would fit for crafting magical jewelry (to store mana in crystals)

  

- ## Items and Inventory System:
    

  

- ## Weapons and Armor System:
    

In order to make the physical combat intuitive, the interaction between armor and weapons will include mutual wear and tear, and a simplified representation of physical concepts like impact, sharpness, hardness and shock absorption.

Armor will act as a buffer that will absorb damage, and cracks and tears in the armor will allow some damage to sink-in to damage the player.

Armor will be double layered, regular clothes will be considered Inner Armor, and metal armor will be considered Outer Armor.

- ### Armor Slots:
    

  

|   |   |   |   |   |   |
|---|---|---|---|---|---|
||Head|Torso|Legs|Arms|Feet|
|Inner|Hood|Shirt|Trousers|Gloves|Shoes|
|Outter|Helmet|Breastplate|Greaves|Gauntlets|Sabatons|

  
  
  
  

- ### Weapon Properties:
    
- Item properties (name, weight, volume…)
    
- Sharpness - A multiplier to the impact damage that will result in slash damage.  
    Since sharp object utilize the property of pressure (Pressure = ForceArea) to scale inversely to area, we can define Sharpness=1Blade Contact Area and therefore Slash Damage (pressure)=Impact (force)Sharpness  
    Hitting a hard object (armor) will dull the sharpness of the weapon, which will need to be sharpened again via whetstone or grinder.
    
- Durability - Represents the ability to resist deformation (getting dull, and breaking)
    
- Integrity
    
- Max Integrity
    
- Balance - might affect energy needed, and delay between attacks.
    
- Reach 
    
- Weight
    
-   
      
    
- ### Armor Properties:
    
- Defense - Represents the Hardness and overall protection from cuts (slash damage).  
    Defense will reduce slash damage, harm sharpness, and will be damaged by impact damage.
    
- Padding - Represents the shock absorption capability of the armor.  
    Padding will reduce impact damage, and will be damaged by slash damage.
    
- Slash Reduction - Determined by Defense and Defense Integrity.  
    Slash Reduction = DefenseDefense + 100Defense Integrity
    
- Impact Reduction - Determined by Padding and Padding Integrity.  
    Impact Reduction=PaddingPadding+100Padding Integrity
    
- Defense Integrity - Internal hit point counter for the defense aspect of the armor.  
    Damaged by impact damage.
    
- Defense Max Integrity 
    
- Defense Integrity Status - Defense Integrity / Defense Max Integrity, in percentages.  
    Determines how much slash damage it passes onto the the next layer of armor (or to the HP if it’s the inner armor)  
    Also affects the slash reduction.
    
- Padding Integrity - Internal hit point counter for the padding aspect of the armor.  
    Damaged by slash damage.
    
- Padding Max Integrity 
    
- Padding Integrity Status - Padding Integrity / Padding Max Integrity, in percentages.  
    Determines how much impact damage it passes onto the the next layer of armor (Impact damage will pass onto the HP regardless of the integrity of the inner armor)  
    Also affects the Impact reduction.
    
-   
    
-   
    

  

# Ideas

- Death delay - when receiving fatal damage, the player will have 1 sec delay before dying, allowing for one last action  
    The delay will shorten according to the overkill score, which will be the fatal_dmg/last_instance_of_hp
    
- food can be queued.
    

- Boards and signs can be placed, to be able to communicate with afk players
    
- Training strength (performing actions that require higher strength stat) might be harmful to hp, vitality or vigor.
    
- premium currency: Ambrosia
    
- Directed Jump (bullet jump) 
    
- Piercing attacks will ignore a portion of the armor buffering
    
- Different types of gems will be able to also hold different types of resources, according to the color coding of the resources. For examples, ruby gemstones will be able to hold a considerable amount of Life Force (HP), citrine - energy, and emerald, both energy and mana.
    
- spells - there would be the base form of a spell, for example Mana Blast (a ray of concentrated mana that impacts the target), And there would be variations, that can be combined with the base spell to create a variant 
    

for example, lock-on-target, chain casting (release a spell every X mana channeled), chain spell (cast a second spell after the first one hitting)

- Players will be able to assign a base spell to their hotbar, but when using an Arcane Focus, additional widget will open, extending the selection of spells
    

  
**