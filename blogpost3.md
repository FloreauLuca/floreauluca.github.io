# Blog Infinite Chunks Generation

## Introduction
I’m currently in a Games Programming formation and as part of the module of computer graphics, we are asked to create a Minecraft-Like in C++ using the NekoEngine.
The NekoEngine is a custom c++ engine using SDL 2.0 and OpenGlES 3.0.

One of my tasks was to implement the **infinite chunk generation**.

Our goal was to be able to generate an infinite world horizontally and 256 blocks vertically.

<img src="Data/BlogPost/BlogPost3/map.png" width="300" alt="Image Wolrd generation">

So, we started on the segmentation of the world in chunk of 16 x 16 x 16 blocks.

<img src="Data/BlogPost/BlogPost3/map.png" width="300" alt="Image chunk">

My chunk generation is composed of 5 actions :
1. Update chunks if they are visible or not
2. Generate new chunk if they are in the view distance
2. Calculate if the new chunks occlude other chunks
3. Calculate if the new chunks is occluded by other chunks
5. Set values to render chunks

<img src="Data/BlogPost/BlogPost3/map.png" width="300" alt="Diagram chunk generation">

All these action will be done in the class **ChunkSystem**.

<a name="UpdateVisibleChunks"></a>
## I. UpdateVisibleChunks
This function is call every Update of the engine. It purpose is to update chunks if they are visible or not, accessible or not, and launch the Job for **GenerateChunkContent** and **CalculateVisibleStatus** of new chunks.

### GetLoadedChunks
For each loaded, if it's not in viewDIst, remove visible and if it's not in accessibleDist, remove accessible.
To know the ChunkStatus, they are all stored inside ChunkStatusManager
```cpp
using ChunkMask = std::uint16_t;
enum class ChunkFlag: std :: uint16_t
{
EMPTY = 1u << 0u,
ACCESSIBLE = 1u << 1u,
VISIBLE = 1u << 2u,
LOADED = 1u << 3u,
OCCLUDED = 1u << 4u,
}
class ChunkStatusManager final : public ComponentManager<ChunkMask, ComponentType::CHUNK_STATUS>
{
public :
std::vector<Index> GetAccessibleChunks();

std::vector<Index> GetRenderedChunks();

std::vector<Index> GetDirtyChunks();

std::vector<Index> GetLoadedChunks();
}
```
To know the pos, they are all stored inside ChunkPosManager
```cpp
using ChunkPos = Vec3i;
class ChunkPosManager final : public ComponentManager<Vec3i, ComponentType::CHUNK_POS>
{
	Vec3i GetPositon(Entity chunkIndex);

	void SetPositon(Entity chunkIndex, const Vec3i& chunkPos);
	
	Entity GetChunkAtPos(const Vec3i& chunkPos);
};
```
If it's Dirty, I call **UpdateDirtyChunks**.

### CheckVisibleChunks
For each position inside the view distance, I search if the chunk exist.
If not I create a Job to launch the **GenerateChunkContent** in the other thread.
If the chunk exist, I use the [Frustrum culling of Guillaume]() to know if the chunk is in the view field and set it at visible. If this chunk is in the accessible distance, I will set it accessible.
If the chunk is not in the frustum I remove the status visible and accessible.
Finally the chunk Update look like that.
<img src="Data/BlogPost/BlogPost3/map.png" width="300" alt="Gif of CheckVisibleChunks">

### CheckGenerationJobs
Finally, I check if all my jobs are done and launch the **CalculateVisibleStatus** for all new chunks.

<a name="GenerateChunkContent"></a>
## II. GenerateChunkContent
This function is always execute in seperate threads. Indeed, the chunk generation is pretty slow (avg **TODO**) and to avoid to freeze the player when a new chunk is generated, it is better to loaded chunk in multi-threading. 
To generate a chunk, I use the chunk position.
### MapGeneration
If the chunk is underground, I fill all the chunks. If the chunk is over the sirface it be empty.
If the chunk is at the surface, I use the [Map Generation of Sebastien]() to generate the ChunkContent.

### ChunkContent
The ChunkContentVector is an ECS component used to store blocks data in chunks. It's a vector of ChunkContent
```cpp
struct ChunkContentVector
{
	std::vector<ChunkContent> blocks;
	
	void CalculateBlockOcclusion();
}
class ChunkContentManager final : public ComponentManager<ChunkContentVector, ComponentType::CHUNK_CONTENT>
{
}
```

Then, for each side of my chunk, I launch **CalculateOcclusionStatus** to know if i can occlude other chunks.
### Set Chunk Informations
As my function is in different thread, I lock all the component managers function of the component used in this thread to avoid race conditions.
So to avoid overlocking my generation, all the informations above are store and I set it now.
First, I set if the chunk status is Empty or not.
Then, I set the Occlusion Status informations.
Finally, I set the ChunkContent informations.

### Set Chunk Informations
In the stored chunk content, I **CalculateBlockOcclusion** to keep only visible blocks of each chunks.
And finally, I set this ChunkContentVector into the ChunkRender in the render thread.

### ChunkRender
The ChunkRender is an ECS component used to store the render data of the chunks. It create OpenGl data of the instance based on the ChunkContentVector. You can check the [Chunk Rendering of Simon]().
```cpp
struct ChunkRender
{
	unsigned vbo = 0;
	gl::RenderCuboid cube{Vec3f::zero, Vec3f::one};
};
class ChunkRenderManager final : public ComponentManager<ChunkRender, ComponentType::CHUNK_RENDER>
{
	void Init(Entity chunkIndex);
	
	void SetChunkValues(const Entity chunkIndex, ChunkContentVector chunkContentVector);
}
```

<a name="CalculateOcclusionBlocks"></a>
## III. CalculateBlockOcclusion
This function is call by the **UpdateDirtyChunks** and the **GenerateChunkContent**. It purpose is to calculate the occlusion of each block of the ChunkContentVector.
The function is pretty simple, for each block, if there is not another block on each side, it will set it visible.

<a name="CalculateVisibleStatus"></a>
## III. CalculateOcclusionStatus 
This function is also call by the **UpdateDirtyChunks** and the **GenerateChunkContent**. It purpose is to calculate if a chunk can occlude another chunk.

### Chunk Oclussion Status
The chunk occlusion status is store inside the ChunkStatus. It used to know if a side of a chunk can occlude its neighbour.
```cpp
enum class ChunkFlag: std :: uint16_t
{
OCCLUDE_DOWN = 1u << 4u,
OCCLUDE_UP = 1u << 5u,
OCCLUDE_RIGHT = 1u << 6u,
OCCLUDE_LEFT = 1u << 7u,
OCCLUDE_FRONT = 1u << 8u,
OCCLUDE_BACK = 1u << 9u,
}
```

### Chunk Side Check
First, if a chunk is empty, the function return false because it can't occlude another chunk and if a chunk is full, the function return true because it always occlude another chunk.
Then, I check all the side, if the side if full of block it return true because the side occlude the neighbor chunk, else it return false.


<a name="CalculateBlockOcclusion"></a>
## IV. CalculateVisibleStatus 
This function is also call by the **UpdateDirtyChunks** and the seperate thread by the **UpdateVisibleChunks**. Indeed, this fonction can be run in another thread because it will online affect invisible chunks.
Indeed, it purpose is to calculate if a chunk is occlude by another chunk.
That's why, this function must be called after the **CalculateOcclusionStatus** because it will use the occlusion datas of the other chunks.

### Check neighbour occlusion
For each side of the chunks, this function will get the neighbour ChunkStatus. If all the neighbour are occluded or if their side occlude the chunk, the chunk will be occluded.

<a name="UpdateDirtyChunks"></a>
## V. UpdateDirtyChunks
This function is only call by the **UpdateVisibleChunks** because it purpose is to recalculate chunk if a chunk is occluded or can occlude when the chunk has been modified.
### Chunk Dirty Status
The ChunkStatus Dirty is set by the PlayerController when a block is placed or break. It used to recalculate if a chunk is occluded or can occlude.
```cpp
enum class ChunkFlag: std :: uint16_t
{
	DIRTY = 1u << 11u;
}
```
### Reset Block Occlusion
First, it recalculate the block occlusion of the chunk with **CalculateBlockOcclusion**.
And then, it set this ChunkContentVector into the ChunkRender in the render thread.

### Check Chunk Occlusion Status
For each side of the chunk, it calculate the occlusion status using **CalculateOcclusionStatus**. If the calculated occlusion status is different from the stored status, it will set or remove the occlusion status.
Then, it get the chunk next to the modified side and call **CalculateVisibleStatus** for the neighbour chunk.
Finally, if remove the dirty status.

## Results

<img src="Data/BlogPost/BlogPost3/map.png" width="300" alt="Result rendering">

## Performance

### Without Optimization

<img src="Data/BlogPost/BlogPost3/map.png" width="300" alt="Performance without Optimization">
### With Optimization

<img src="Data/BlogPost/BlogPost3/map.png" width="300" alt="Performance With Optimization">

- Firsts chnks take 800ms to be generate X threads
- generation of new chunks take 76.7 ms

## Conclusion

As you can see, with my optimization, all the critical sections are reduced, allowing the main thread to run without interruption.
The project run at X fps with shadows and X fps without shadows

#### How to go futher
- the use of IDs for chunks greatly facilitated by the decision to set up a finite world

#### Lesson learned
This project taught me a lot about the importance of good data management.

