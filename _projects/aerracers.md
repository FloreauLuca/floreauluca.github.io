---
layout: article
title: AerRacers
tags: Team Prog C++
date: 2021-07-24
order: 1
excerpt: AerRacers is a local multi-player pod racing game running on Nintendo Switch.
key: aerracers
show_title : true
show_excerpt : false
show_date : true
show_tags : true
cover : /Data/Portfolio/Game/AerRacers/aerracers_run.gif
mode: normal
article_header:
  type: overlay
  theme: dark
  background_color: rgb(34, 57, 230)
  background_image: 
    gradient: 'linear-gradient(135deg, rgba(34, 139, 87 , .4), rgba(139, 34, 139, .4))'
    src: /Data/Portfolio/Game/AerRacers/aerracers_run.gif
---
# Context
During my third year of Bachelor in Game Programming at the SAE Institute, we had objectives to set up a specialization project aiming to put into practice what we had learned and to develop our skills in the fields of our future jobs.
This project took place over 8 months from September 2020 to April 2021.
Our objective was to create a racing game on Switch in local multiplayer.
For this, we had to use the NekoEngine, a custom game engine developed in C++ by Elias Farhan. It is an engine based on the ECS system. It uses the OpenGL, SDL2, and EasyProfiler libraries.

# Pitch
AerRacers is a local multiplayer pod racing game. You can choose between 2 ships with different colors to compete in a single race. You will cross different environments such as valleys, plains, and caves. You can play from 1 to 4 players on PC using 2 joysticks to controls each propeller separately.

# Roles
For the implementation of the project we were 5 programmers:
Sebastien Feser, Project Leader, Lead Designer, and Lead Game,
Stephen Grosjean Dev Ops,
Simon Canas Lead Engine Prog
Dylan Von Arx Lead Tool who left in January
Me, Luca Floreau, Producer and Lead Programmer

As Producer, I was in charge of the planning.

As Lead Programmer, I was in charge of the distribution and the progress of the tasks.

Finally, I also took care of the Engine and Game tasks according to the needs of each team.


# Realization 
## Plannification
I work on the planning of the project setting up the milestones, deliverables, and tasks for each team.
IMG

## Task Tracking
As Lead Programmer, I also manage the communication between teams and help the team in need.

## Implementation of a Physic Engine
One of my first tasks was the implementation of the library PhysX inside the project using CMake. You can learn more about it in my blogpost : https://floreauluca.github.io/blogposts/blogpost-physx 

## InputSystem
Another task was the implementation of an Input System based on SDL Events. This system has to managed keyboard and mouse input but also managed up to 4 controllers simultaneously. It also has to manage up to 4 switch controllers simultaneously and react to the connection or detection of each controller.

## Switch integration
Indeed, one of my tasks was the porting from PC to Switch and the correction of each faulty system.

## Scene System
I also had to develop a scene system capable to export and import a scene from Unity with each needed component and hierarchy. 
You can learn more about it in my other blogpost :
https://floreauluca.github.io/blogposts/blogpost-scene 

## Multijoueur
Finally, one of my last tasks was the implementation of the multiplayer allowing the manipulation of 4 players simultaneously.

# Learned Skills
As Producer and Lead Programmer, I learned a lot about planning and team management for an 8-month project. It was my first time working with artists on a big project. 
I also learn a lot about library implementation and project hierarchy using CMake.
The scene system introduced me to JSON files, serialization and deserialization, and the JSON Schema.
Finally, I discovered the programmation for the console with all the specificity of the Switch.

# Result
Trailer

To play the game check our Release : https://github.com/SAE-Institute-Geneva/AerRacers/release 

You can find more information on my blogpost :
About the project development with the post-mortem : https://floreauluca.github.io/blogposts/blogpost-postmortem 
About the PhysX implementation : https://floreauluca.github.io/blogposts/blogpost-physx 
About the Scene System : https://floreauluca.github.io/blogposts/blogpost-scene 
You can also check out the GitHub : https://github.com/SAE-Institute-Geneva/AerRacers 
