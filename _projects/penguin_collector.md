---
layout: article
title: Penguin Collector
tags: Solo Design Prog Art Unity Android
date: 2019-04-16
order: 3
excerpt: Penguin Collector is a shooter in which you must save the penguins from their predators.
key: penguin-collector
show_title : true
show_excerpt : false
show_date : true
show_tags : true
cover : /Data/Portfolio/Game/PenguinCollector/screengif2.gif
mode: normal
article_header:
  type: overlay
  theme: dark
  background_color: rgb(34, 57, 230)
  background_image: 
    gradient: 'linear-gradient(135deg, rgba(34, 139, 87 , .4), rgba(139, 34, 139, .4))'
    src: /Data/Portfolio/Game/PenguinCollector/screengif2.gif
---
# Context
During my first year of Bachelor in Games Programming and as part of the module of procedural generation and artificial intelligence, I was asked to create a game in Unity using procedural generation and artificial intelligence.

# Pitch
Penguin Collector is an isometric view shooter in which you play as a
explorer whose goal is to form a colony of penguins.
For this, you will have to navigate through procedurally generated archipelagos to collect
penguins and save them from their predators.
Therefore, the player controls an explorer with an AK47 to defend himself against
predators. His goal is to bring as many penguins as possible to his boat. For this, he must explore the island and free the penguins from the grip of the polar bears.
However, walruses and polar bears seek to kill him. He then has the opportunity to defend himself and shoot them with his AK47. The game ends when the player is killed by the
predators.

# Realization
I first work on the gameplay of the game, developing the movement of the player and the camera. I also developed the controls allowing the player to play on PC or Mobile.
For the procedural generation, I implement a cellular automata to create the island. Then, I build bridges allowing the player to travel across all the islands. Finally, I use a flowfield to detect regions where mobs can spawn.
For the artificial intelligence of the mob there are two types of mobs : 
	- the first mobs are the penguins using steering behavior to follow the player.
	- the second mobs are the walrus and the polar bears, they use a behavior tree to managed their action and an A* to follow the player.

Finally, I also create all the sprites of the environment and all the animations for each character using Illustrator and Photofiltre.

# Result
Play on itch : 

More information
You can check the Github of the project : 
You can also check the Technical Document (only in french) :
