---
tags:
  - PlayerMechanic/MagicSystem
  - PlayerMechanic/Attribute/DerivedAttribute
BaseValue: 8
---
WP soft cap - 
Ranges from 8 to 100 in a nonlinear fashion, will mitigate the growth of [[Will Power]], meaning training WP will be more difficult the more WP the player has, resulting in a plateau until reaching the next [[Arcana]] level.


$WpSoftCap=7.815+2^{Arcana}/10.826$

**bonus_wp = manipulated_mana * 2.1% * soft_cap/(soft_cap + WP)**

