Death delay - when receiving fatal damage, the player will have 1 sec delay before dying, allowing for one last action  
The delay will shorten according to the overkill score, which will be the 

$Overkill\_Score = fatal\_dmg/100$
$Death\_Delay=3_s /Overkill\_Score$

Meaning, a player will have at most 3 seconds of death delay, when they recieve fatal [[Damage]], allowing them for few last actions
