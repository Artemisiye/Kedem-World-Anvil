---
aliases:
  - NPC
  - Npc
  - Creature
  - Creatures
---
- Beasts ( Animals ) – Natural creatures born from Gaia’s essence. (Wolves, deer, lions, birds...)
- Archbeasts – Majestic, legendary creatures of immense power. (Griffons, phoenixes, unicorns, manticores...) 
- Humanoid – Intelligent beings created by the overlords to protect Gaia. (Humans, goblins, orcs...) 
- Aberrations – Cosmic horrors from the Void, beyond earthly existence. (Cthulhu-like entities, voidlings...) 
- Undead – Beings that persist beyond death, often bound by a purpose. (Ghouls, zombies, liches...) 
- Spirits – Intangible beings of condensed mana, some serve Gaia by controlling energy. (Wisps, elementals, undine...) 
- Fiends – Beings that were once mortal but were warped and corrupted by great aberrations. (Wendigo, medusa, naga...) 
- Demons – Entities that exist solely for their own benefit, neither good nor evil. (Djinn, wraiths, skinwalkers, rakshasas...)
## Loyal NPCs
The player will have multiple loyal companions:
### [[Companion]]
Playful harmless small creature that follows the player and collects items.
```dataview
list
from #NPC 
WHERE contains(NpcLoyality, "Companion")
```

### [[Mount]]
A tamable creature that can equip a saddle and the player can ride
```dataview
list
from #NPC 
WHERE contains(NpcLoyality, "Mount")
```

### Pet
Tamable creature that takes a liking for the player, and willingly obeys, follows or protects the player.
```dataview
list
from #NPC 
WHERE contains(NpcLoyality, "Pet")
```

### Farm Animal
Similar to pets, but are not used for combat
```dataview
list
from #NPC 
WHERE contains(NpcLoyality, "Farm Animal")
```

### [[Minion]]
Requires mind control or charming spells to acquire
```dataview
list
from #NPC 
WHERE contains(NpcLoyality, "Minion")
```

## Animals (Beasts)

```dataview
table NpcTags as "Type", NpcAggresion as "Aggresion", NpcLoyality as "Loyality", NpcMovement as "Movement"
from #NPC
where contains(NpcTags,"Animal")
```


## Humanoids

```dataview
table NpcTags as "Type", NpcAggresion as "Aggresion", NpcLoyality as "Loyality", NpcMovement as "Movement"
from #NPC
where contains(NpcTags,"Humanoid")
```
## Monsters


