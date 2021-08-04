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
During my **first year of Bachelor in Games Programming** and as part of the module of **procedural generation and artificial intelligence**, I was asked to create a game in Unity using procedural generation and artificial intelligence.

# Pitch
Penguin Collector is an **isometric view shooter** in which you play as an explorer whose goal is to **form a colony of penguins**.

For this, you will have to navigate through **procedurally generated archipelagos** to **collect penguins** and **save them from their predators**.

# Realization
I first work on the **gameplay** of the game, developing the **movement** of the player and the camera. I also developed the **controls** allowing the player to play on **PC or Mobile**.

For the procedural generation, I implement a **cellular automata** to create the island. Then, I build **bridges** allowing the player to travel across all the islands. Finally, I use a **flowfield to detect regions** where mobs can spawn.

<img src="/Data/BlogPost/penguincollector/cellular.png" width="300" alt="">
> Cellular Automata

<img src="/Data/BlogPost/penguincollector/bridge.png" width="300" alt="">
> Bridge Generation

<img src="/Data/BlogPost/penguincollector/spawn_enemy.png" width="300" alt="">
> Spawn Regions

For the artificial intelligence of the mob there are two types of mobs : the first mobs are the penguins using **steering behavior** to **follow the player**.

<img src="/Data/BlogPost/penguincollector/penguin_ia.png" width="600" alt="">
> Penguin Steering Behavior

The second mobs are the walrus and the polar bears, they use **a behavior tree** to managed their action and an **A\* to follow the player**.

<img src="/Data/BlogPost/penguincollector/bear_behavior_tree.png" width="600" alt="">
> Polar Bear Behavior Tree

<img src="/Data/BlogPost/penguincollector/pathfinding_image.png" width="600" alt="">
> Polar Bear PathFinding


Finally, I also create all the **sprites of the environment** and all the **animations for each character** using **Illustrator and Photofiltre**.

<img src="/Data/BlogPost/penguincollector/bear.png" width="300" alt="">
> Polar Bear Sprites

<img src="/Data/BlogPost/penguincollector/playermouvement.png" width="300" alt="">
> Character Sprites

# Result

<img src="/Data/Portfolio/Game/PenguinCollector/screengif2.gif" width="600" alt="">

<iframe width="552" height="167" frameborder="0" src="https://itch.io/embed/404584?border_width=0&bg_color=02fff0&link_color=2f7dff&border_color=c7fefd"></iframe>

### More information
You can check the Github of the project : [https://github.com/FloreauLuca/Penguin-Collector](https://github.com/FloreauLuca/Penguin-Collector)

You can also check the Technical Document (only in french) : [https://github.com/FloreauLuca/floreauluca.github.io/blob/master/Data/Blogpost/penguincollector/PenguinCollectorDocumentTechnique.pdf](https://github.com/FloreauLuca/floreauluca.github.io/blob/master/Data/Blogpost/penguincollector/PenguinCollectorDocumentTechnique.pdf)
