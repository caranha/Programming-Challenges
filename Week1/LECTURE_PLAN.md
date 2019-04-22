Week 1 - Data Structures
========================

# THOUGHTS
- Rewrite the "Linear Data Structures with Libraries"
- Rewrite the "Tree Data Structures with Libraries"
- Rewrite the "No-library data structures: Union-Find"
- Rewrite the "No-library data structures: Segment-Trees"
- TODO: Add Fenwick Tree

# CHANGES
- Removed Jolly Jumpers and CD, added: Back to 8 queens, Frequent Values
- Added Segment Tree

# Problems
- Jolly Jumpers -- Simple problem
- Newspaper -- Map the cost
- Army Buddies -- Choose right data structure (array)
- Grid Successors -- Implement 2D array (implementation)
- Football (aka Soccer) -- Implement Sorting (implementation)
- File Fragmentation -- Many solutions, map of bit combinations is one
- CD -- Implement Map for speed (implementation)
- War -- Implement 2 Union finds

# Lecture Outline

## Motivations for Data Sets
### Motivating Examples: 8 Queen and Towers of Hanoi
- The 8 queen problem is an example where the right data set and pruning
  can make a big difference (10 minutes or so). **TODO** Add 8-queen problem code
- Ask students for data structures for the Towers of Hanoi. Explain how some
  Data structures can be used for visualization.

### Programming Example 1: Army Buddies
- Explain the problem, ask students to think about how would they solve it.
- Some people propose the use of linked lists, and other people propose the use of arrays
  Let's discuss the pro-and cons of each solution
- For this problem, arrays ended being the right solution.

### Thinking about Data Structures
- The data structure can change the efficiency of the problem
- But complex data structures can also make the program complex to implement
- Balance: Can you rely on Data structures that already exist on the library? Or do you need to modify them?
- Every solution to a programming challenge begins with the data structure.

## Linear Data Structures with Libraries
- Arrays and Vectors (Implementation and Initialization)
- Things that we usually have to do in arrays: Sorting and Searching
- Implementation of Sorting using arrays in C++
  - Example of sorting to solve a problem: Vitor's Family
  - Many different applications of Sorting
  - We often should use sorting when solving a problem, but it adds a cost of nlogn
- Implementation of Binary Search using algorithm::lower_bound and algorithm::upper_bound
- Implementation of Sorting using a specific function:
  - Some examples of cases where sorting with a specific function can be useful: ICPC contest
  - **TODO** Sorting "pair" class in C++ can be done automatically

- Bitmasks and Bit manipulation
  - **TODO** Add motivating problem for bitmask manipulation
  - Motivation for bitmask on Programming challenges (True/False arrays, Exist/Not Exist arrays, Binary Indexes)
  - Operations and implementations on bitmasks.

- Extra Linear Structures: Queues and Stacks:
  **TODO** Descriptions of some problems that can be solved by queues and stacks
  Implementation examples: Queues and Stacks.

## Non-Linear Data Structures with Libraries

- Problem Example: CD
- Balanced Search Tree **TODO** Improve
  - A search tree allows for search and insertion in log_n time
  - But balancing the tree is not trivial to implement, specially in short time.
- Implementations of BST: Map and Set
  - Implementation example
  - When to use maps and sets: Counting elements, Eliminating duplicates, N is very big.

## Some Data Sets without Libraries
- Sometimes you need to extend a library Data structure, or create your own data structure
- Here are two examples

### UFDS
- Motivating Example: Network Connection
- What is a UFDS
  - Quick data set that keeps linked groups of items
  - Images from the Online Visualization Tool
  - Code example and explanation
  - How fast is the UFDS?
- Discussion of the "WAR" problem
  - Problem explanation -- Ask for students to think about the problem
  - Suggestions for the problem

### Segment Tree and Fenwick Tree
- Motivation Example: **TODO 2019**
- Description: **TODO 2019**
- Code explanation: **TODO 2019**
