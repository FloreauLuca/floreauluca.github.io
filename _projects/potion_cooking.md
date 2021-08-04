---
layout: article
title: Potion Cooking
tags: Solo Design Prog Art Unity Android
date: 2018-11-25
order: 4
excerpt: Potion Cooking is a point'n'click in which you play as a mage who must make and sell magic potions to his customers.
key: potion-cooking
show_title : true
show_excerpt : false
show_date : true
show_tags : true
cover : /Data/Portfolio/Game/PotionCooking/screengif.gif
mode: normal
article_header:
  type: overlay
  theme: dark
  background_color: rgb(34, 57, 230)
  background_image: 
    gradient: 'linear-gradient(135deg, rgba(34, 139, 87 , .4), rgba(139, 34, 139, .4))'
    src: /Data/Portfolio/Game/PotionCooking/screengif.gif
---
# Context
During **my first year of Bachelor in Games Programming** and as part of the **module of Unity basics**, I was asked to create a **full game in Unity**.

# Pitch
In a medieval fantasy world, there is, at the bottom of a forest, a **magic fast-potion stand**. Customers come to ask for a magic potion and they are served in the shortest time.

You play as **the potion-making sorcerer**. You are therefore requested to **welcome** the customers, **choose the ingredients**, **manage the cooking**, **fill the containers** and then **serve the clients**.

For this, you have access to 4 windows: Ingredient, Cooking, Preparation, and Reception.

Customers have a **waiting limit** before they get angry and leave.

# Realization
I first work on the **camera** of the game allowing the player to switch between each step of the preparation.

Then, I developed a **Drag’n Drop System** to manipulate brewing ingredients.

<img src="/Data/BlogPost/potioncooking/DragDrop.gif" width="300" alt="">

The next step was to developed the **interaction between each object**. To manage the recipe, I use **ScriptableObject**.

<img src="/Data/BlogPost/potioncooking/scriptable_object.png" width="300" alt="">

Finally, I had time to add some **signs and feedback** for the cooking and the customer.

<img src="/Data/BlogPost/potioncooking/Chaudron.gif" height="300" alt="">

<img src="/Data/BlogPost/potioncooking/Customer.gif" height="300" alt="">

I also create **all the graphism** allowing me to practice using **Illustrator**.

<img src="/Data/BlogPost/potioncooking/backgrounds.png" width="800" alt="">

# Learned Skills
It allows me to practice in Unity and **discover a lot of mechanics**.

This project taught me **why and how to use the ScriptableObjects**.

Finally, it was **my first game on mobile** allowing me to learn a lot about **Android development in Unity**.


# Result

<img src="/Data/Portfolio/Game/PotionCooking/screengif.gif" width="600" alt="">

<iframe width="552" height="167" frameborder="0" src="https://itch.io/embed/334586?border_width=5&amp;bg_color=8d642d&amp;fg_color=ffffff&amp;link_color=de8300&amp;border_color=5f3c00"><a href="https://demonskiddy.itch.io/potion-cooking">Potion Cooking by DemonsKiddy</a></iframe>


### More information
You can check the Github of the project : [https://github.com/FloreauLuca/Penguin-Collector](https://github.com/FloreauLuca/PotionCooking)

You can also check the Technical Document (only in french) : [https://github.com/FloreauLuca/floreauluca.github.io/blob/master/Data/Blogpost/potioncooking/DocTechnique.pdf](https://github.com/FloreauLuca/floreauluca.github.io/blob/master/Data/Blogpost/potioncooking/DocTechnique.pdf)
