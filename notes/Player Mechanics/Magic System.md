---
tags:
  - PlayerMechanic
aliases:
  - "#PlayerMechanic/MagicSystem"
---
### Casting Spells:

In order to cast any [[Spell]], the player will have to take their time and pour [[Mana]] into the spell.
The more mana invested, the more effective it will be.


### Attributes:

```dataview
list 
FROM #PlayerMechanic/MagicSystem  and #PlayerMechanic/Attribute 
```

[[Max Mana]]
[[Flow|(Mana) Flow]]

Derived Attributes:
```dataview
List
FROM #PlayerMechanic/MagicSystem  and #PlayerMechanic/Attribute/DerivedAttribute 
```

[[Number Of Active Spells]]


### [[Crystal]]
Crystals can be used to contain [[Mana]], storing mana particles for long periods without losing them due to their grid structure that can fit inside mana particles. 
Unlike [[metal]], crystals do not allow mana to flow through them.

Crystals will be sought after by magic users, and can be used as a form of currency.

Different crystals with different levels of purity will be able to store different amounts of mana per carat.