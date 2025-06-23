---
aliases:
  - Resource
  - Secondary Resource
  - Primary Resource
  - "#PlayerMechanic/Attribute"
---
Attributes are variables that are visible to the player, which determine the behaviour of different mechanics.

Some attributes can be considered as **Resource**, or **Secondary Resource**, but generally speaking, when not specified, attributes are background numbers.

Some Attributes are [[Trainable]].

### Health Attributes:
```dataview
list from #PlayerMechanic/HealthSystem  and #PlayerMechanic/Attribute 
```

### Physical Attributes:
```dataview
list from #PlayerMechanic/PhysicalSystem and #PlayerMechanic/Attribute 
```
### Magic Attributes
```dataview
list from #PlayerMechanic/MagicSystem and #PlayerMechanic/Attribute 
```
Derived Attributes:
```dataview
list from #PlayerMechanic/MagicSystem  and #PlayerMechanic/Attribute/DerivedAttribute 
```
# Resource (Primary Resource)

A resource is an attribute that gets depleted upon certain events, such as getting hit, performing a physical ability, or casting a spell.

In Kedem we have 4 primary resources:
```dataview
list from #PlayerMechanic/Attribute/Resource 
```
# Secondary Resource

A secondary resource is the underlying backbone of a **Primary Resource**, which gets depleted when the primary resource is recovered.

For example, [[Vitality]] is the secondary resource to [[Health]], and when the player passively heals outside of combat (HP goes up), his vitality gets depleted.

Secondary Resources:
```dataview
list from #PlayerMechanic/Attribute/SecondaryResource 
```

