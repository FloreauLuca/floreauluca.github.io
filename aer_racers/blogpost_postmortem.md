#Blog Import Unity Scene into Engine C++

## Introduction

### Context

During my third year of Bachelor in Game Programming at the SAE Institute, we had objectives to set up a specialization project aiming to put into practice what we had learned and to develop our skills in the fields of our future jobs.

### Instructions

This project took place over 8 months from September to April 2021.

Our project was to create a racing game on Switch in local multiplayer.

For this, we had to use the [NekoEngine](https://github.com/EliasFarhan/NekoEngine/tree/develop), a custom game engine developed in C++ by Elias Farhan. It is an engine based on the ECS system. It uses the OpenGL, SDL2, and EasyProfiler libraries.

### Team

For the implementation of the project we were 5 programmers: 
- Sebastien Feser, Project Leader, Lead Designer, and Lead Game, 
- Stephen Grosjean Dev Ops, 
- Simon Canas Lead Engine Prog 
- Dylan Von Arx Lead Tool who left in January
- me, Luca Floreau, Producer and Lead Programmer

### My Roles

As Producer, I was in charge of the planning.

As Lead Programmer, I was in charge of the distribution and the progress of the tasks.

Finally, I also took care of the Engine and Game tasks according to the needs of each team.

## Project

So we decided to start on a pod racing game inspired by Star Wars Pod Racer. 

<img src="data/star_wars.jpg" width="300" alt="Star Wars Pod Racer">

> Star Wars Pod Racer

For the artistic direction, we received concept arts from Nicolas Vallée inspired by Porco Rosso. However, following a lack of communication of our art, we have some misunderstandings concerning the concept art produced.

<img src="data/concept_art.jpg" width="300" alt="Concept Arts">

> Concept Arts

During the production, we welcomed several teams to help us.

First of all, we welcomed the second-year Games Programmer as part of their Tool Production modules. They produced tools on Unity and Neko to help us in the production of our project.

<img src="data/hierarchy_prog.png" width="300" alt="Tools Hierarchy">

> Tools Hierarchy

Next, we welcomed the second-year Game Artist for the production of graphic models. They used Nicolas Vallée's concept art to produce the environment, the ships, and the totems.

<img src="data/hierarchy_art.png" width="300" alt="Art Hierarchy">

> Art Hierarchy

We also welcomed the second-year Audio Designer for the production of the sound effects. We also used the production of Leo for the music of the game.

<img src="data/hierarchy_audio.png" width="300" alt="Audio Hierarchy">

> Audio Hierarchy

## Pre-production

The pre-production started mid-September with the presentation of the instructions

My first task as a producer was to divide, plan and distribute the tasks until December. 

<img src="data/planning_september.png" width="300" alt="Plannification in September">

> Plannification in September

For this, I was inspired by the documents put in place during the PokProject of the third-year student last year.

So, I first set up milestones representing the main production steps.

However, as it was the first time we worked on a project of this size, the definition of the tasks was risky and many tasks were badly defined, planned, or even forgotten.

In parallel, I also set up different organizational tools: 
- Trello for the distribution and progress of tasks, 
- Drive for technical and administrative documentation and assets.

In parallel, the DevOps took care of setting up and prioritizing the git.

The Design team set up the rules and objectives of the game and the Game team has created a prototype on Unity to define the movements of the ship and the camera.

The Tool team is in charge of setting up a working environment for the creation of the second-year student's tools.

The Engine team took care of the structure of the Visual Studio project. Then, Simon took care of the implementation of a Vulkan engine while I took care of the detection of the inputs and the implementation of the physical engine

In parallel, we also took in hand the use of the development kit of the Nintendo Switch.

## Planning Failure

Arrived in December, the project had not progressed as planned.

Almost all the teams were behind schedule and the tasks were stuck on a task.

<img src="data/planning_december.png" width="300" alt="Plannification in December"> 

> Plannification in December

For my part, I was stuck on the physics engine

As a result, our teacher talked to us about it and we had the chance to have Sylvain Cardin who gave us a course on project management to put our project in order.

