# Ideas for improving the course

## General

-- Move Class 4 (DP 2) to the end of the course
-- New DP2 class uses chapter 8 for "more hard DP problems", mixing DP with other themes.


## Monitor.js
* Add a query for "students who solved 0, 1, 2, 3, 4+ problems
* Add a query for "students who tried 0, 1, 2, 3, 4+ problems
* Separate query functions from draw functions
* Student query -- make a summary for each week at the bottom: tried/submitted/submitted late

## For each class
Do not forget the TODO file in each class

### Week 0
* Rename week to "Ad Hoc Problems"
* Add "memoization techniques" to 3n+1 Discussion  

### Week 1
* Add more examples/code for class A.
* Class B was good in 2016

### Week 2
* Week 2A went all the way up to "Divide and Conquer"
* Working on actual examples was a good idea
* Notes about not being able to access UVA should go to class 0
* Should remember students on Class A to consider solutions for class B

### Week 3 -- Dynamic Programming

* Class A: introduction to DP with two examples (wedding, apple trees)
* Class B: classical DPs except TSP (no time)

### Week 4 -- Dynamic Programming

* Class A: TSP + other problems (OK)
* Class B: No topics, asked students to participate, failure. (Only one TSP class next year?)

### Week 5 -- Graph Part I AB
Class A
* Review of Graph Terms
* BFS and DFS
* BFS/DFS algorithms: Connected components/Topological Sort/Bipartite Check
* Spanning Tree, Cycles, Strongly Connected Components
* Minbimum Spanning Tree: Kruskal and Prim's algorithm, MST Variants

Class B
* Pathfinding: SSSP, Djikstra, Bellman Ford (NOT)
* All Pairs Shortest Path: Floyd Warshall/implementation (NOT)
* Tricks with APSP: Minimum Cycle, Negative Cycle, Diameter of a Graph (NOT)
* Problems

### Week 6 -- Graph Part II AB
* Students seemed to enjoy code with "why it works". 
* Class A: SSSP, Djikstra, BellmanFord, Floyd Warshall
* Class B: Max Flow, Min Flow, Special Graphs



### Others
Idea: put everything in a single class and break by time. Add examples as necessary.
Idea: There is a lot to cover on graphs. I will cover the most interesting bits, but 
      see the materials for the parts that I skipped.

* Review of Graph related terms
* BFS and DFS programming examples 
  (Many graph problems are variants and specializations of DFS and BFS)
** Simple graph problems (quick modification of DFS/BFS)

** Connected Components/Flood Fill
** Topological Sort
** Bipartite Check

** DFS Spanning Tree (edge type: tree edge/back edge/forward edge)
** Finding Cycles (back edges exist)/Finding articulations and Bridges
** Finding Strongly connected components (undirected graphs)

** Minimum Spanning Tree/Kruskal Algorithm
** Prim's Algorithm
** Minimum Spanning Tree Variants: Maximum Spanning Tree, MS Forest, MS subgraph

** Single Source Shortest Paths (Djikstra) -- Djikstra Original Paper does not specify an implementaton.
** Bellman Ford Algorithm for shortest path with negative loop (slower than djikstra)

** All pairs Shortest path (Floyd Warshall) ## Main attractiveness: Very simple to program
** Explain the idea of Floyd Warshall (DP!)
** Tricks with all pairs shortest path: Minimum Cycle/Negative Cycle: Check the diagonal for the cost of i,i
** Diameter of a graph: Maximum shortest path between any i,j of a graph


* Network Flow (Class II?)
* Graph Matching (Class II?)
