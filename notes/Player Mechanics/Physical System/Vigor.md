---
aliases:
  - VIG
tags:
  - PlayerMechanic/Attribute/SecondaryResource
  - PlayerMechanic/PhysicalSystem
---
Vigor - [[Energy]] Core. 
Represents Energy reserves. 
Acts as a multiplier to the stamina to determine how much energy is restored per sec.  
The multiplier is linear between 40% and 150% when at 0% and 100% vigor respectively

$$
EnergyPerSec =Stamina(40+1.1*VigorBase/Vigor)
$$

Excess vigor will allow excess energy beyond the max value