Week 2 - Data Structures
========================
# TODO
- [ ] Improve "library" section (add use examples of queue and stacks)
- [ ] Improve "library" section (more details queues/stacks)
- [ ] Add discussion on Fenwick tree

# Problems
- Army Buddies -- Choose right data structure (array)
- Grid Successors -- Implement 2D array (implementation)
- File Fragmentation -- Many solutions, map of bit combinations is one
- War -- Implement 2 Union finds
- Back to the 8 Queens
- Football (aka Soccer) -- Implement Sorting (implementation)
- Newspaper -- Map the cost
- Frequent Values

## Problems not used currently
- CD -- Implement Map for speed (implementation)


# Lecture Outline
Discussion of several Data sets and how they can be used in programming challenges.

## Part 1: Motivations for Data Sets
### Motivation problems:
- The 8 queen problem (*WISHLIST*: code for 8-queen)
- Towers of hanoi (graph data structure, no code)
- Army Buddies (Initial Problem)

### Thinking about Data Structures
- The data structure can change the efficiency of the problem
- But complex data structures can also make the program complex to implement
- Balance: Can you rely on Data structures that already exist on the library? Or do you need to modify them?
- Every solution to a programming challenge begins with the data structure.

## Part II/III Linear Data Structures and libraries
### Arrays and Vectors
- Implementation and Initialization
- Arrays and Sorting, and using sorting in problems
- Implementation of Sorting using arrays in C++
  - Example of sorting to solve a problem: Vito's Family
  - Many different applications of Sorting
  - We often should use sorting when solving a problem, but it adds a cost of nlogn
- Implementation of Binary Search using algorithm::lower_bound and algorithm::upper_bound
- Implementation of Sorting using a specific function:
  - Some examples of cases where sorting with a specific function can be useful: ICPC contest
  - **TODO** Show that sorting "pair" class in C++ can be done automatically

<!-- - Bitmasks and Bit manipulation
  - **TODO** Add motivating problem for bitmask manipulation
  - Motivation for bitmask on Programming challenges (True/False arrays, Exist/Not Exist arrays, Binary Indexes)
  - Operations and implementations on bitmasks. -->

### Non-Linear Data Structures with Libraries

- **TODO** Extra Linear Structures: Queues and Stacks:
  - Coding example of queues and stacks
  - Problem examples of queue and stacks (parenthesis balancing)
- Extra Linear Structures: Maps
    - Problem Example: CD
    - Quick discussion on Balanced Search Tree
    - Implementations of BST: Map and Set
      - Implementation example
      - When to use maps and sets: Counting elements, Eliminating duplicates, N is very big.

## Hand-made Data Structures
- Sometimes you need to extend a library Data structure, or create your own data structure
- Two examples: UFDS and Segment Tree

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

### Segment Tree
- **TODO:** Review this part

### Fenwick Tree
- **WISHLIST**
