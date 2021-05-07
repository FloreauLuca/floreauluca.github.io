# Blog Integration of PhysX into a C++ Engine

## Introduction
### Context
During my third year of Game Programming at SAE, we were asked to create a game on a custom C++ engine that could be played on the Nintendo Switch. So we develop the AerRacers project which you can find more details on my [post-mortem](https://floreauluca.github.io/aer_racers/blogpost_postmortem).

During this project, we first developed a prototype on Unity to define the needs of the project. Following this prototype, we realized that we would need a physics engine. 

### Problematic
Indeed, as we developed a racing game, we use the Unity physics engine to control speed, manage collisions and perform raycasting to determine how high the ships are.

