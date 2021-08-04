---
layout: article
title: Minecraft-like
tags: Team Prog C++
date: 2020-07-24
order: 2
excerpt: Our Minecraft-like is a project where you can move and construct inside an infinite generated world.
key: minecraft-like
show_title : true
show_excerpt : false
show_date : true
show_tags : true
cover : /Data/Portfolio/Game/Minecraft-like/screengif.gif
mode: normal
article_header:
  type: overlay
  theme: dark
  background_color: rgb(34, 57, 230)
  background_image: 
    gradient: 'linear-gradient(135deg, rgba(34, 139, 87 , .4), rgba(139, 34, 139, .4))'
    src: /Data/Portfolio/Game/Minecraft-like/screengif.gif
---
# Context
During my second year of Bachelor in Games Programming and as part of the module of computer graphics, we were asked to create a Minecraft-like in C++ using the NekoEngine. The NekoEngine is a custom game engine developed in C++ by Elias Farhan. It is an engine based on the ECS system. It uses the OpenGL ES 3.0, SDL2, and EasyProfiler libraries.

# Pitch
The project is a Minecraft-like allowing the player to navigate through an infinite voxel world to break and build blocks

# Realization
One of my first tasks was the implementation of Gizmo using OpenGL. We had to be able to draw cubes and lines for debugging.
Next, I had to implement an AABBManager allowing the detection of intersection between two AABB, one AABB, and a raycast or an AABB and a sphere.
I also have to implement a multi-threaded infinite chunk generation. You can learn more in my blogpost : https://floreauluca.github.io/blogposts/chunk-generation 
To optimize, I also implement the occlusion culling of non-viewable blocks of each chunk.


# Learned Skills
This project was my first complete game in C++ the first project with a big team of programmers. 
I learn a lot about C++ development and optimization. 
I also understood better multi-threading and job systems.
Finally, it also taught a lot about graphics rendering with OpenGL

# Result

IMG

Check out the release : https://github.com/LoshkinOleg/NekoEngine/releases

More information :
Infinite Chunk Generation Blogpost : https://floreauluca.github.io/blogposts/chunk-generation 
Full GitHub : https://github.com/LoshkinOleg/NekoEngine 
