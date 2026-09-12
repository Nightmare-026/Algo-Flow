# 📚 Part 11: Problem Bank — Volume 05: Graphs, Traversal, Shortest Paths & MSTs (70 Problems)

> **Problems Covered:** Q341 to Q410  
> **Patterns:** BFS/DFS on Graphs & 2D Grids &bull; Multi-Source BFS &bull; Topological Sort (Kahn / DFS) &bull; Dijkstra's Min-Heap &bull; Bellman-Ford & Negative Cycles &bull; Floyd-Warshall &bull; 0-1 BFS with Deque &bull; Disjoint Set Union (DSU / Kruskal's) &bull; Prim's MST &bull; Tarjan's Bridges & Articulation Points &bull; Hierholzer Eulerian Paths

---

## Section 1: Grid Graphs, BFS, DFS & Cycles (Q341 – Q365)

#### Q341: Number of Islands
- **Difficulty:** `[Medium]` | **Pattern:** `[Connected Component DFS/BFS on Grid]`
- **Statement:** Count islands (connected groups of '1's adjacent horizontally or vertically).
- **Optimal Approach:** Scan grid cells. When '1' seen, increment island count, trigger DFS/BFS to sink entire island by setting all connected '1's to '0'.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** All water '0', all land '1', grid with 1 cell.

#### Q342: Max Area of Island
- **Difficulty:** `[Medium]` | **Pattern:** `[Grid DFS Component Size]`
- **Statement:** Find maximum area (number of cells) of an island.
- **Optimal Approach:** DFS returns size: `1 + dfs(up) + dfs(down) + dfs(left) + dfs(right)`. Track global maximum.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** No islands (returns 0).

#### Q343: Number of Closed Islands
- **Difficulty:** `[Medium]` | **Pattern:** `[Boundary Sinking Grid DFS]`
- **Statement:** An island is closed if surrounded by 1s (cannot touch grid perimeter).
- **Optimal Approach:** First sink all islands touching the outer boundary using DFS. Then count and sink remaining islands in the interior.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** Island touching boundary at a corner.

#### Q344: Number of Enclaves
- **Difficulty:** `[Medium]` | **Pattern:** `[Boundary Flood Fill]`
- **Statement:** Count land cells that cannot walk off the boundary of the grid.
- **Optimal Approach:** Flood fill from all land cells on grid borders to mark reachable cells. Count remaining unmarked land cells.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** All land reachable from boundary (returns 0).

#### Q345: Surrounded Regions
- **Difficulty:** `[Medium]` | **Pattern:** `[Reverse Boundary DFS Marker]`
- **Statement:** Capture all regions of 'O's completely surrounded by 'X's.
- **Optimal Approach:** Run DFS from border 'O's marking them as safe (e.g. 'S'). Flip remaining 'O's to 'X', then restore 'S' back to 'O'.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** No 'O' on boundary.

#### Q346: Pacific Atlantic Water Flow
- **Difficulty:** `[Medium]` | **Pattern:** `[Dual Ocean Reverse DFS]`
- **Statement:** Find cells from which water can flow to both Pacific (top/left) and Atlantic (bottom/right) oceans.
- **Optimal Approach:** Run reverse DFS upward (to cells with height $\ge current$) from Pacific borders and Atlantic borders into two boolean matrices. Cells marked in both matrices form answer.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** Water flows through cells with equal heights.

#### Q347: Clone Graph
- **Difficulty:** `[Medium]` | **Pattern:** `[DFS / BFS with Hash Map Clone]`
- **Statement:** Deep copy a connected undirected graph.
- **Optimal Approach:** Maintain map `{originalNode: clonedNode}`. Traverse via DFS; for each neighbor, if not in map, clone and recurse; connect cloned neighbor.
- **Complexity:** Time: $O(V + E)$ | Space: $O(V)$
- **Edge Cases:** Graph with single node, node with self-loop.

#### Q348: Graph Valid Tree
- **Difficulty:** `[Medium]` | **Pattern:** `[DSU / Cycle + Component Count]`
- **Statement:** Check if $n$ nodes and edge list form a valid tree.
- **Optimal Approach:** A graph is a tree iff: 1. $E == n - 1$. 2. Graph has no cycles (verified via DSU or DFS).
- **Complexity:** Time: $O(V + E)$ | Space: $O(V)$
- **Edge Cases:** $E \ne n - 1$ (immediately false), disconnected components.

#### Q349: Detect Cycle in a Directed Graph
- **Difficulty:** `[Medium]` | **Pattern:** `[3-Color DFS States]`
- **Statement:** Detect if directed graph contains a cycle.
- **Optimal Approach:** Colors: 0 = unvisited, 1 = visiting (on current recursion stack), 2 = visited. If neighbor has color 1 (back-edge), cycle detected!
- **Complexity:** Time: $O(V + E)$ | Space: $O(V)$
- **Edge Cases:** Cross-edges in DAG (color 2; not a cycle).

#### Q350: Is Graph Bipartite?
- **Difficulty:** `[Medium]` | **Pattern:** `[2-Coloring BFS/DFS]`
- **Statement:** Check if graph vertices can be colored using 2 colors such that no two adjacent vertices share a color.
- **Optimal Approach:** Color unvisited components with 0. For each neighbor: if uncolored, color with $1 - \text{currentColor}$; if neighbor has same color, not bipartite!
- **Complexity:** Time: $O(V + E)$ | Space: $O(V)$
- **Edge Cases:** Disconnected graph with isolated vertices, odd-length cycles.

#### Q351: Word Ladder
- **Difficulty:** `[Hard]` | **Pattern:** `[Unweighted Shortest Path BFS]`
- **Statement:** Find shortest transformation sequence from `beginWord` to `endWord` changing 1 letter at a time through dictionary.
- **Optimal Approach:** Standard or Bidirectional BFS. At each word, try all 26 character substitutions. If present in word set, enqueue and delete from set.
- **Complexity:** Time: $O(M^2 \cdot N)$ | Space: $O(M \cdot N)$
- **Edge Cases:** `endWord` not in dictionary (returns 0).

#### Q352: Word Ladder II
- **Difficulty:** `[Hard]` | **Pattern:** `[BFS Level Graph + Backtracking DFS]`
- **Statement:** Return all shortest transformation sequences.
- **Optimal Approach:** 1. Run BFS from `beginWord` to record shortest distance to each word and build predecessor DAG. 2. Run DFS backtracking from `endWord` to `beginWord` along DAG edges.
- **Complexity:** Time: $O(N \cdot M^2 + \text{paths})$ | Space: $O(N \cdot M)$
- **Edge Cases:** Multiple valid shortest paths.

#### Q353: Minimum Genetic Mutation
- **Difficulty:** `[Medium]` | **Pattern:** `[BFS State Graph]`
- **Statement:** Mutate gene string from `start` to `end` through bank in minimum mutations.
- **Optimal Approach:** BFS queue with words. Try 4 DNA bases (A, C, G, T) at each of the 8 character positions.
- **Complexity:** Time: $O(8 \cdot 4 \cdot N) = O(N)$ | Space: $O(N)$
- **Edge Cases:** `end` not in bank (returns $-1$).

#### Q354: Open the Lock
- **Difficulty:** `[Medium]` | **Pattern:** `[BFS on 4-Digit State Space]`
- **Statement:** Turn lock wheels from `"0000"` to `target` avoiding `deadends`.
- **Optimal Approach:** Bidirectional BFS on 10,000 states. Each state has 8 neighbors (turning each of the 4 wheels up or down).
- **Complexity:** Time: $O(10^4 \cdot 8) = O(1)$ | Space: $O(10^4)$
- **Edge Cases:** Initial state `"0000"` is in deadends (returns $-1$).

#### Q355: 01 Matrix
- **Difficulty:** `[Medium]` | **Pattern:** `[Multi-Source BFS from All Zeroes]`
- **Statement:** Find distance of each cell to nearest 0.
- **Optimal Approach:** Initialize BFS queue with all cells containing 0, set their distances to 0, mark other cells as $\infty$. Dequeue and update neighbor distances to `dist[curr] + 1`.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** Matrix of all 0s.

#### Q356: Rotting Oranges
- **Difficulty:** `[Medium]` | **Pattern:** `[Multi-Source BFS Elapsed Time]`
- **Statement:** Find minimum minutes until all oranges rot (rotten 2 infects adjacent fresh 1 every minute).
- **Optimal Approach:** Enqueue all initially rotten oranges, count total fresh oranges. Run BFS level-by-level incrementing minutes. If `freshCount == 0`, return minutes; else $-1$.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** No fresh oranges initially (returns 0), isolated fresh orange that can never be reached.

#### Q357: Shortest Bridge
- **Difficulty:** `[Medium]` | **Pattern:** `[DFS First Island + Multi-Source BFS]`
- **Statement:** Find minimum 0s to flip to connect two islands.
- **Optimal Approach:** Use DFS to find all cells of the first island, mark them, and enqueue them into BFS queue. Run multi-source BFS outward until hitting second island.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** Islands separated by distance 1.

#### Q358: Shortest Path in Binary Matrix
- **Difficulty:** `[Medium]` | **Pattern:** `[8-Directional BFS]`
- **Statement:** Find shortest clear path from $(0, 0)$ to $(n-1, n-1)$ moving in 8 directions.
- **Optimal Approach:** BFS from $(0, 0)$ exploring 8 neighbors where $grid == 0$. Mark visited in-place.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n^2)$
- **Edge Cases:** Start or end cell is blocked with 1 (returns $-1$).

#### Q359: As Far from Land as Possible
- **Difficulty:** `[Medium]` | **Pattern:** `[Multi-Source BFS Max Distance]`
- **Statement:** Find water cell with maximum distance to nearest land cell.
- **Optimal Approach:** Enqueue all land cells (1s). Multi-source BFS propagating distance to all water cells. Return maximum distance reached.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n^2)$
- **Edge Cases:** All land or all water (returns $-1$).

#### Q360: Keys and Rooms
- **Difficulty:** `[Easy]` | **Pattern:** `[BFS/DFS Reachability]`
- **Statement:** Check if you can visit all rooms given keys in each room starting in room 0.
- **Optimal Approach:** BFS/DFS with boolean visited array. Traverse room keys. At end, verify all rooms visited.
- **Complexity:** Time: $O(V + E)$ | Space: $O(V)$
- **Edge Cases:** Disconnected rooms.

#### Q361: Reorder Routes to Make All Paths Lead to City Zero
- **Difficulty:** `[Medium]` | **Pattern:** `[Undirected Graph Traversal with Edge Orientation]`
- **Statement:** Minimum roads to reverse so everyone can reach city 0 in tree network.
- **Optimal Approach:** Build adjacency list storing `(neighbor, isOriginalDirection)`. Traverse outward from 0; if edge points away from 0, it must be reversed: add 1.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Linear chain of edges.

#### Q362: Time Needed to Inform All Employees
- **Difficulty:** `[Medium]` | **Pattern:** `[Tree Max Depth Weighted DFS]`
- **Statement:** Find total time to inform all employees in hierarchy.
- **Optimal Approach:** DFS from head ID: `informTime[u] + max(dfs(child))` over all subordinates.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Single employee (time 0).

#### Q363: Jump Game III
- **Difficulty:** `[Medium]` | **Pattern:** `[1D Graph BFS/DFS]`
- **Statement:** Reach any index with value 0 jumping $i \pm arr[i]$.
- **Optimal Approach:** BFS/DFS exploring valid indices $i + arr[i]$ and $i - arr[i]$ with visited set.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Cycle of jumps that never reaches 0.

#### Q364: Snakes and Ladders
- **Difficulty:** `[Medium]` | **Pattern:** `[BFS on Flattened Board]`
- **Statement:** Find minimum dice rolls to reach square $N^2$.
- **Optimal Approach:** Flatten Boustrophedon board into 1D array. BFS queue with `(square, rolls)`. Try rolls $1 \dots 6$, jumping to destination if ladder/snake present.
- **Complexity:** Time: $O(N^2)$ | Space: $O(N^2)$
- **Edge Cases:** Consecutive snakes or ladders (only first one is taken per rules).

#### Q365: Cut Off Trees for Golf Event
- **Difficulty:** `[Hard]` | **Pattern:** `[Sorted Heights + Chained BFS]`
- **Statement:** Cut trees in order of increasing height. Find minimum steps.
- **Optimal Approach:** Collect and sort all trees by height. Run BFS from current position to next tree to find shortest path; sum all path steps.
- **Complexity:** Time: $O(T \cdot R \cdot C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** Tree unreachable (returns $-1$).

---

## Section 2: Topological Sort & DAGs (Q366 – Q375)

#### Q366: Course Schedule
- **Difficulty:** `[Medium]` | **Pattern:** `[Cycle Detection in Directed Graph]`
- **Statement:** Determine if it is possible to finish all courses given prerequisite pairs.
- **Optimal Approach:** Kahn's algorithm: calculate in-degrees, enqueue nodes with in-degree 0. Dequeue, decrement neighbor in-degrees. If total dequeued $== n$, true; else cycle exists.
- **Complexity:** Time: $O(V + E)$ | Space: $O(V + E)$
- **Edge Cases:** Disconnected components with cycles.

#### Q367: Course Schedule II
- **Difficulty:** `[Medium]` | **Pattern:** `[Kahn's BFS In-Degree / DFS Stack]`
- **Statement:** Return valid topological ordering of courses to take, or empty array if cycle exists.
- **Optimal Approach:** Kahn's algorithm recording dequeued vertices into array. If length $< n$, return empty array.
- **Complexity:** Time: $O(V + E)$ | Space: $O(V + E)$
- **Edge Cases:** Multiple valid topological orders.

#### Q368: Course Schedule IV
- **Difficulty:** `[Medium]` | **Pattern:** `[Floyd-Warshall Transitive Closure / Bitset DP]`
- **Statement:** Answer queries if course $u$ is prerequisite of $v$.
- **Optimal Approach:** Floyd-Warshall reachability: `reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j])`. Or BFS from each node.
- **Complexity:** Time: $O(V^3)$ or $O(V(V + E))$ | Space: $O(V^2)$
- **Edge Cases:** Long prerequisite chains.

#### Q369: Alien Dictionary
- **Difficulty:** `[Hard]` | **Pattern:** `[Lexicographical Dependency TopoSort]`
- **Statement:** Deduce sorted alien alphabet order from sorted word list.
- **Optimal Approach:** Compare adjacent words to find first differing character; add directed edge $c_1 \to c_2$. Run Topological Sort. Check for prefix invalidity (`"abc"` after `"abcd"`).
- **Complexity:** Time: $O(C)$ total characters | Space: $O(|\Sigma|)$
- **Edge Cases:** Cycle in alphabet, prefix violation.

#### Q370: Minimum Height Trees
- **Difficulty:** `[Medium]` | **Pattern:** `[Inward Leaf Pruning BFS]`
- **Statement:** Find roots of trees that yield minimum height (tree centroids).
- **Optimal Approach:** Enqueue all leaves (degree 1). Iteratively prune leaves and decrement neighbor degrees until $\le 2$ nodes remain.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** $n = 1, n = 2$.

#### Q371: Sequence Reconstruction
- **Difficulty:** `[Medium]` | **Pattern:** `[Unique Topological Sort Check]`
- **Statement:** Check if `nums` is the **only** sequence that can be reconstructed from subsequences.
- **Optimal Approach:** Build graph from subsequences. Run Kahn's algorithm: at every step, **the queue must contain EXACTLY 1 element**! If queue size $> 1$, topological order is not unique!
- **Complexity:** Time: $O(V + E)$ | Space: $O(V + E)$
- **Edge Cases:** Queue contains 2 items at any step (immediately false).

#### Q372: Parallel Courses
- **Difficulty:** `[Medium]` | **Pattern:** `[BFS Levels in DAG]`
- **Statement:** Minimum semesters to take all courses if you can take unlimited courses in parallel.
- **Optimal Approach:** Kahn's BFS tracking number of level iterations. Each level represents 1 semester.
- **Complexity:** Time: $O(V + E)$ | Space: $O(V + E)$
- **Edge Cases:** Graph has cycle (returns $-1$).

#### Q373: Find Eventual Safe States
- **Difficulty:** `[Medium]` | **Pattern:** `[Reverse Graph Kahn's TopoSort]`
- **Statement:** Find all nodes that cannot reach a cycle.
- **Optimal Approach:** Reverse all edge directions! Compute in-degrees on reversed graph. Run Kahn's BFS: all dequeued nodes are safe!
- **Complexity:** Time: $O(V + E)$ | Space: $O(V + E)$
- **Edge Cases:** Terminal nodes with out-degree 0 (always safe).

#### Q374: Longest Increasing Path in a Matrix
- **Difficulty:** `[Hard]` | **Pattern:** `[DAG DP with Memoization]`
- **Statement:** Find length of longest strictly increasing path in matrix.
- **Optimal Approach:** DFS with memoization matrix: $LIP(r, c) = 1 + \max_{(nr, nc)} LIP(nr, nc)$ for neighbors with $val > currentVal$.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** Strictly decreasing matrix, all equal values (path length 1).

#### Q375: All Ancestors of a Node in a DAG
- **Difficulty:** `[Medium]` | **Pattern:** `[Reverse DFS / Kahn's Bitset]`
- **Statement:** Return sorted list of all ancestors for each node.
- **Optimal Approach:** For each node $u$, run DFS on reversed graph to collect all reachable ancestors.
- **Complexity:** Time: $O(V(V + E))$ | Space: $O(V^2)$
- **Edge Cases:** Nodes with no ancestors.

---

## Section 3: Shortest Paths (Q376 – Q390)

#### Q376: Network Delay Time
- **Difficulty:** `[Medium]` | **Pattern:** `[Dijkstra's Min-Heap]`
- **Statement:** Find time for all $n$ nodes to receive signal from source $k$.
- **Optimal Approach:** Min-heap Dijkstra with distances array initialized to $\infty$. Return $\max(dist)$; if any node unreachable, $-1$.
- **Complexity:** Time: $O(E \log V)$ | Space: $O(V + E)$
- **Edge Cases:** Disconnected nodes.

#### Q377: Path with Minimum Effort
- **Difficulty:** `[Medium]` | **Pattern:** `[Dijkstra on Grid]`
- **Statement:** Find path from $(0, 0)$ to $(R-1, C-1)$ minimizing maximum absolute difference between consecutive cells.
- **Optimal Approach:** Min-heap of `(effort, r, c)`. Neighbor effort is $\max(effort, |height[nr][nc] - height[r][c]|)$.
- **Complexity:** Time: $O(R \cdot C \log(R \cdot C))$ | Space: $O(R \cdot C)$
- **Edge Cases:** Grid with 1 cell (effort 0).

#### Q378: Cheapest Flights Within K Stops
- **Difficulty:** `[Medium]` | **Pattern:** `[Bellman-Ford / BFS with K Steps]`
- **Statement:** Find cheapest flight from `src` to `dst` with at most $k$ stops.
- **Optimal Approach:** Bellman-Ford relaxed $k + 1$ times using copy of previous distance array to prevent cascading relaxation in single round.
- **Complexity:** Time: $O(k \cdot E)$ | Space: $O(V)$
- **Edge Cases:** Destination unreachable within $k$ stops.

#### Q379: Find City With Smallest Number of Neighbors at Threshold Distance
- **Difficulty:** `[Medium]` | **Pattern:** `[Floyd-Warshall All-Pairs]`
- **Statement:** Find city with fewest reachable cities within `distanceThreshold` (greatest city index on ties).
- **Optimal Approach:** Floyd-Warshall $O(V^3)$ all-pairs shortest paths. For each city, count reachable cities $\le threshold$.
- **Complexity:** Time: $O(V^3)$ | Space: $O(V^2)$
- **Edge Cases:** No cities reachable within threshold.

#### Q380: Shortest Path with Alternating Colors
- **Difficulty:** `[Medium]` | **Pattern:** `[2-State BFS (Red/Blue)]`
- **Statement:** Shortest path from 0 to all nodes alternating between red and blue edges.
- **Optimal Approach:** Distance array `dist[node][lastColor]`. BFS queue stores `(node, lastColor)`.
- **Complexity:** Time: $O(V + E)$ | Space: $O(V + E)$
- **Edge Cases:** Self-loops of alternating colors.

#### Q381: Shortest Path to Get All Keys
- **Difficulty:** `[Hard]` | **Pattern:** `[BFS with Bitmask Key State]`
- **Statement:** Find shortest path to collect all keys (`a-f`) unlocking corresponding doors (`A-F`).
- **Optimal Approach:** BFS with visited state `(r, c, keyBitmask)`. If key acquired, toggle bit; door passable only if bit set. Target reached when $keyBitmask == (1 \ll K) - 1$.
- **Complexity:** Time: $O(R \cdot C \cdot 2^K)$ | Space: $O(R \cdot C \cdot 2^K)$
- **Edge Cases:** Unreachable keys (returns $-1$).

#### Q382: Path with Maximum Probability
- **Difficulty:** `[Medium]` | **Pattern:** `[Max-Heap Dijkstra Multiplication]`
- **Statement:** Find path between two nodes with highest probability of success.
- **Optimal Approach:** Max-heap Dijkstra. Relaxation condition: `prob[v] < prob[u] * edgeWeight`.
- **Complexity:** Time: $O(E \log V)$ | Space: $O(V + E)$
- **Edge Cases:** Probability reaches 0.

#### Q383: Minimum Cost to Reach Destination in Time
- **Difficulty:** `[Hard]` | **Pattern:** `[Dijkstra with 2D States (Time & Cost)]`
- **Statement:** Reach destination within $maxTime$ minimizing fee.
- **Optimal Approach:** Min-heap storing `(cost, time, node)`. Track minimum time seen for each node to prune strictly worse paths.
- **Complexity:** Time: $O(E \cdot maxTime \log(V \cdot maxTime))$ | Space: $O(V \cdot maxTime)$
- **Edge Cases:** Unreachable within time limit.

#### Q384: Second Minimum Time to Reach Destination
- **Difficulty:** `[Hard]` | **Pattern:** `[Dijkstra with 2 Distinct Distances]`
- **Statement:** Find strictly second shortest time to reach destination taking traffic lights into account.
- **Optimal Approach:** Track `dist1[node]` and `dist2[node]`. Enqueue neighbor if new time $<$ `dist1` or between `dist1` and `dist2`.
- **Complexity:** Time: $O(E \log V)$ | Space: $O(V)$
- **Edge Cases:** Arriving at red light (must wait until green).

#### Q385: Minimum Obstacle Removal to Reach Corner
- **Difficulty:** `[Hard]` | **Pattern:** `[0-1 BFS via Deque]`
- **Statement:** Remove min obstacles to reach bottom-right corner.
- **Optimal Approach:** 0-1 BFS using Deque. Moving to empty cell (weight 0) pushes to **front**; moving to obstacle (weight 1) pushes to **back**.
- **Complexity:** Time: $O(R \cdot C)$ strictly linear | Space: $O(R \cdot C)$
- **Edge Cases:** Start or end cell contains obstacle.

#### Q386: Shortest Path Visiting All Nodes
- **Difficulty:** `[Hard]` | **Pattern:** `[Multi-Source BFS Bitmask]`
- **Statement:** Find shortest path visiting every node in undirected graph.
- **Optimal Approach:** Initialize BFS queue with all nodes as start states: `(node, 1 << node)`. Target reached when $mask == (1 \ll n) - 1$.
- **Complexity:** Time: $O(n \cdot 2^n)$ | Space: $O(n \cdot 2^n)$
- **Edge Cases:** $n = 1$ (0 steps).

#### Q387: Reachable Nodes In Subdivided Graph
- **Difficulty:** `[Hard]` | **Pattern:** `[Dijkstra Edge Subdivision Saturation]`
- **Statement:** Graph where edges have $cnt$ intermediate nodes. Find reachable nodes with $maxMoves$.
- **Optimal Approach:** Dijkstra on original vertices with remaining moves. For each edge, calculate intermediate nodes reachable from both endpoints.
- **Complexity:** Time: $O(E \log V)$ | Space: $O(V + E)$
- **Edge Cases:** Edge fully saturated by both endpoints.

#### Q388: Minimum Cost to Make at Least One Valid Path in a Grid
- **Difficulty:** `[Hard]` | **Pattern:** `[0-1 BFS with Direction Arrows]`
- **Statement:** Change cell arrows to reach $(R-1, C-1)$ minimizing modifications.
- **Optimal Approach:** 0-1 BFS. Moving in direction of arrow costs 0 (push front); changing direction costs 1 (push back).
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** Path already naturally exists (cost 0).

#### Q389: All-Pairs Shortest Path (Floyd-Warshall Algorithm)
- **Difficulty:** `[Medium]` | **Pattern:** `[Dynamic Programming Matrix Triple Loop]`
- **Statement:** Compute shortest path between all pairs of vertices.
- **Optimal Approach:** $D[i][j] = \min(D[i][j], D[i][k] + D[k][j])$ for all $k, i, j$. Detect negative cycle if $D[i][i] < 0$.
- **Complexity:** Time: $O(V^3)$ | Space: $O(V^2)$
- **Edge Cases:** Negative edge weights, negative cycles.

#### Q390: Bellman-Ford Negative Cycle Detection
- **Difficulty:** `[Medium]` | **Pattern:** `[Edge Relaxation V Rounds]`
- **Statement:** Find shortest paths with negative edges and detect negative cycles.
- **Optimal Approach:** Relax all edges $V - 1$ times. On $V$-th round, if any edge relaxes, graph contains a negative weight cycle!
- **Complexity:** Time: $O(V \cdot E)$ | Space: $O(V)$
- **Edge Cases:** Negative cycle unreachable from source.

---

## Section 4: MSTs & Disjoint Set Union (Q391 – Q405)

#### Q391: Min Cost to Connect All Points
- **Difficulty:** `[Medium]` | **Pattern:** `[Prim's MST / Kruskal's]`
- **Statement:** Connect all 2D points with Manhattan distance edges minimizing total cost.
- **Optimal Approach:** Prim's algorithm maintaining min-distance array from MST to all unvisited nodes in $O(n^2)$ time without building all edges.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n)$
- **Edge Cases:** $n = 1$ (cost 0).

#### Q392: Redundant Connection
- **Difficulty:** `[Medium]` | **Pattern:** `[DSU Cycle Detection]`
- **Statement:** Undirected graph with $n$ nodes and $n$ edges. Find edge that creates cycle.
- **Optimal Approach:** DSU with path compression. For each edge $(u, v)$, if `find(u) == find(v)`, edge is redundant; else `union(u, v)`.
- **Complexity:** Time: $O(n \cdot \alpha(n))$ | Space: $O(n)$
- **Edge Cases:** Multiple edges forming cycle (return last one in input).

#### Q393: Redundant Connection II
- **Difficulty:** `[Hard]` | **Pattern:** `[Directed Graph Two-Parent / Cycle DSU]`
- **Statement:** Directed tree with 1 extra directed edge. Find redundant edge.
- **Optimal Approach:** 1. Node with 2 parents: test removing one parent edge. 2. If no 2-parent node, standard DSU cycle detection.
- **Complexity:** Time: $O(n \cdot \alpha(n))$ | Space: $O(n)$
- **Edge Cases:** Both 2 parents and a cycle present simultaneously.

#### Q394: Number of Operations to Make Network Connected
- **Difficulty:** `[Medium]` | **Pattern:** `[DSU Redundant Edges vs Components]`
- **Statement:** Connect all computers by moving existing cables.
- **Optimal Approach:** If $E < n - 1$, impossible. Count connected components $C$ using DSU. Need $C - 1$ operations.
- **Complexity:** Time: $O(n \cdot \alpha(n))$ | Space: $O(n)$
- **Edge Cases:** $E < n - 1$ (returns $-1$).

#### Q395: Accounts Merge
- **Difficulty:** `[Medium]` | **Pattern:** `[DSU Email Clustering]`
- **Statement:** Merge accounts sharing common email addresses.
- **Optimal Approach:** Map each email to unique ID. Use DSU to union all emails belonging to same account. Group emails by DSU parent.
- **Complexity:** Time: $O(N \log N)$ | Space: $O(N)$
- **Edge Cases:** Duplicate emails in same account list.

#### Q396: Satisfiability of Equality Equations
- **Difficulty:** `[Medium]` | **Pattern:** `[DSU Equality First, Inequality Check]`
- **Statement:** Check if equations `"a==b"` and `"c!=d"` can be satisfied.
- **Optimal Approach:** 1. Union all variables in `"=="` equations. 2. For each `"!="` equation, verify `find(u) != find(v)`.
- **Complexity:** Time: $O(N \cdot \alpha(26)) = O(N)$ | Space: $O(26) = O(1)$
- **Edge Cases:** Equation `"a!=a"` (immediately false).

#### Q397: Number of Provinces
- **Difficulty:** `[Medium]` | **Pattern:** `[DSU Component Count]`
- **Statement:** Find number of connected components in adjacency matrix.
- **Optimal Approach:** DSU initialized with $n$ components. For each 1 in upper triangle, union and decrement component count.
- **Complexity:** Time: $O(n^2 \cdot \alpha(n))$ | Space: $O(n)$
- **Edge Cases:** Matrix of all isolated nodes ($n$ provinces).

#### Q398: Connecting Cities With Minimum Cost
- **Difficulty:** `[Medium]` | **Pattern:** `[Kruskal's MST]`
- **Statement:** Connect all cities with minimum cost using available connections.
- **Optimal Approach:** Sort edges ascending by cost. Add edges using DSU until $n - 1$ edges added. If edges added $< n - 1$, impossible.
- **Complexity:** Time: $O(E \log E)$ | Space: $O(V)$
- **Edge Cases:** Disconnected graph (returns $-1$).

#### Q399: Optimize Water Distribution in a Village
- **Difficulty:** `[Hard]` | **Pattern:** `[Virtual Super-Source Node + MST]`
- **Statement:** Supply water by digging wells in houses or connecting pipes. Minimize cost.
- **Optimal Approach:** Create virtual super-source node 0. Add edge from 0 to house $i$ with cost $well[i]$. Run Kruskal's MST on all edges!
- **Complexity:** Time: $O(E \log E)$ | Space: $O(V + E)$
- **Edge Cases:** Digging wells in all houses is cheaper than any pipe.

#### Q400: Checking Existence of Edge Length Limited Paths
- **Difficulty:** `[Hard]` | **Pattern:** `[Offline Queries Sorting + DSU]`
- **Statement:** Answer queries if path exists between $p$ and $q$ with edge weights $< limit$.
- **Optimal Approach:** Sort queries by limit ascending. Sort edges by weight ascending. Add all edges with $weight < limit$ into DSU before answering query.
- **Complexity:** Time: $O(E \log E + Q \log Q)$ | Space: $O(V + Q)$
- **Edge Cases:** Disconnected nodes.

#### Q401: Smallest String With Swaps
- **Difficulty:** `[Medium]` | **Pattern:** `[DSU Connected Component Sorting]`
- **Statement:** Lexicographically smallest string after arbitrary swaps between given pairs.
- **Optimal Approach:** Union indices of swap pairs using DSU. For each component, collect characters, sort them, and place back into sorted indices.
- **Complexity:** Time: $O(N \log N)$ | Space: $O(N)$
- **Edge Cases:** No pairs (string unchanged).

#### Q402: Making A Large Island
- **Difficulty:** `[Hard]` | **Pattern:** `[DSU / Grid Component Coloring + 4-Neighbor Merge]`
- **Statement:** Change at most one 0 to 1 to maximize island size.
- **Optimal Approach:** Color each island with unique ID and record its size. For each 0 cell, calculate potential size $1 + \sum_{\text{unique neighbor IDs}} \text{size}[ID]$.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** Grid already all 1s (return $R \cdot C$).

#### Q403: Bricks Falling When Hit
- **Difficulty:** `[Hard]` | **Pattern:** `[Reverse Time Addition DSU]`
- **Statement:** Remove hit bricks; bricks not connected to ceiling fall. Find bricks fallen after each hit.
- **Optimal Approach:** Process hits in **reverse order**! Add bricks back, union with neighbors, measure growth in size of ceiling connected component.
- **Complexity:** Time: $O(R \cdot C \cdot \alpha(R \cdot C))$ | Space: $O(R \cdot C)$
- **Edge Cases:** Hitting an empty cell.

#### Q404: Find Critical and Pseudo-Critical Edges in MST
- **Difficulty:** `[Hard]` | **Pattern:** `[Kruskal with Edge Exclusion / Forcing]`
- **Statement:** Critical edge: exclusion increases MST weight. Pseudo-critical: inclusion can form some MST.
- **Optimal Approach:** Compute base MST weight. For each edge: exclude it; if MST weight increases, edge is critical. If not critical, force-include it; if MST weight equals base, pseudo-critical.
- **Complexity:** Time: $O(E^2 \cdot \alpha(V))$ | Space: $O(V + E)$
- **Edge Cases:** Multiple edges with identical weights.

#### Q405: Similar String Groups
- **Difficulty:** `[Hard]` | **Pattern:** `[Word Similarity Graph + DSU]`
- **Statement:** Words are similar if they differ by at most 2 swaps. Find number of word groups.
- **Optimal Approach:** For every pair of words, test if they differ by 0 or 2 characters. If so, union in DSU. Count distinct component roots.
- **Complexity:** Time: $O(N^2 \cdot L)$ | Space: $O(N)$
- **Edge Cases:** Identical words.

---

## Section 5: Advanced Graph Algorithms (Q406 – Q410)

#### Q406: Critical Connections in a Network (Tarjan's Bridges)
- **Difficulty:** `[Hard]` | **Pattern:** `[Tarjan's Low-Link DFS]`
- **Statement:** Find all bridges (edges whose removal disconnects network).
- **Optimal Approach:** DFS maintaining `disc[u]` and `low[u]`. For neighbor $v \ne parent$, if $low[v] > disc[u]$, edge $(u, v)$ is a critical bridge!
- **Complexity:** Time: $O(V + E)$ strictly linear | Space: $O(V + E)$
- **Edge Cases:** Parallel edges between two vertices.

#### Q407: Strongly Connected Components (Kosaraju's Algorithm)
- **Difficulty:** `[Hard]` | **Pattern:** `[Transpose Graph 2-Pass DFS]`
- **Statement:** Find all SCCs in directed graph.
- **Optimal Approach:** 1. DFS on $G$ pushing to stack by finish time. 2. Reverse graph edges ($G^T$). 3. Pop stack running DFS on $G^T$ to extract SCCs.
- **Complexity:** Time: $O(V + E)$ | Space: $O(V + E)$
- **Edge Cases:** Entire graph is one single SCC.

#### Q408: Reconstruct Itinerary (Eulerian Path)
- **Difficulty:** `[Hard]` | **Pattern:** `[Hierholzer's DFS Postorder]`
- **Statement:** Find Eulerian path visiting all tickets starting from `"JFK"` with smallest lexical order.
- **Optimal Approach:** Hierholzer's algorithm: maintain priority queues of outgoing flights. DFS into lexical neighbor, delete edge, push to itinerary on return (postorder). Reverse itinerary.
- **Complexity:** Time: $O(E \log E)$ | Space: $O(V + E)$
- **Edge Cases:** Dead-end branches before visiting all edges (handled by postorder push).

#### Q409: Articulation Points in Graph
- **Difficulty:** `[Hard]` | **Pattern:** `[Tarjan's Cut Vertex Condition]`
- **Statement:** Find all vertices whose removal disconnects the graph.
- **Optimal Approach:** Root is cut vertex iff it has $\ge 2$ children in DFS tree. Non-root $u$ is cut vertex iff it has child $v$ with $low[v] \ge disc[u]$.
- **Complexity:** Time: $O(V + E)$ | Space: $O(V + E)$
- **Edge Cases:** Disconnected graph, root node with 1 child.

#### Q410: Maximum Flow (Edmonds-Karp Algorithm)
- **Difficulty:** `[Hard]` | **Pattern:** `[BFS Augmenting Paths in Residual Graph]`
- **Statement:** Find maximum flow from source $S$ to sink $T$ in network with capacities.
- **Optimal Approach:** While BFS finds augmenting path in residual graph, find bottleneck capacity, add to total flow, update forward and backward residual capacities.
- **Complexity:** Time: $O(V \cdot E^2)$ | Space: $O(V + E)$
- **Edge Cases:** Disconnected source and sink.

---
[⬅️ Previous: Volume 04 — Trees & Heaps](file:///d:/DSA/Part-11-Problem-Bank-and-Revision/04_trees_bst_tries_heaps_100.md) | [Next: Volume 06 — Dynamic Programming (Q411–Q470) ➡️](file:///d:/DSA/Part-11-Problem-Bank-and-Revision/06_dynamic_programming_60.md)
