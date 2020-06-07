Week 7 - Computational Geometry
===============================

# Problems
(+) 2016
(*) 2017
(x) 2018


## Points and Lines (2 problems)
- 10263 - Railway (1024) - Given a point M and a list of segments, find the 
          point in the segment closest to M
- 10585 - Center of symmetry (1526) - "simple": calculate the mean point,
          move all points so mean is at origin, and check if every point has a
          "reflex" near the mean.
- (+*x) 920 - Sunny Mountains (861) - occlusion - calculate "sunny" segment size
- (+*) 10927 - Bright Lights (1868) - which points can be seen from the origin?
- (x) 833 - Water Falls (774) - Full search / Recursive search / Scan


## Circles (2 problem)
- (*) 10005 - Packing polygons - 946 -- Full search of the points, see if any circle 
              fits them all.
- (*x) 11834 - Elevator - 2934 -- "Easy" measure if two circles fit in a rectangle
              (See if the largest circle fits, place it in the lower left corner,
              Try placing the smaller circle in the other corners and see if they 
              overlap)
- (+) 10180 Rope Crisis in Ropeland -- 1121
- (x) 11152 - Colorful Flowers (simple formula of inner and outer circle) -- 2093

## Triangles (2 problems)
- (+x)10577 - Bounding box -- 1518 -- Get center of the bounding circle, get all vertex,
 get min/max X/Y
- (+*x) 11909 - Soya Milk -- 3060 -- Triangles and rectangles (law of sines) 
                                     -- two cases!

## Polygons (2 problems)
- (+)  109 SCUD Busters -- 45
- (+*x) 1111 Trash Removal -- 3552 -- 
    - Solution 1 -- Convex hull + triangle height
    - Solution 2 -- Binary Search on angles plus max/min point
- (+*) 11265 The Sultan's problem -- 2232
- (*x)  10652 - Board Wrapping -- 1593 - Find the points of the rectangle, 
               convex hull, and then subtract areas.

