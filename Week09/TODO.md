# Changes for Week 9 -- Geometry

## Lecture Glossary

## Future
- [ ] Better code examples for this chapter
  - [ ] Input and output for basic functions (code in repo)
  - [ ] Add code to "Intersection" motivating problem
  - [ ] Add code to "order by angle" - Code already part of Convex Hull
- [ ] Add a polygon problem example

## Simple line intersection code
var judgeIentersected = function(ax, ay, bx, by, cx, cy, dx, dy) {
  var ta = (cx - dx) * (ay - cy) + (cy - dy) * (cx - ax);
  var tb = (cx - dx) * (by - cy) + (cy - dy) * (cx - bx);
  var tc = (ax - bx) * (cy - ay) + (ay - by) * (ax - cx);
  var td = (ax - bx) * (dy - ay) + (ay - by) * (ax - dx);

  return tc * td < 0 && ta * tb < 0;
  // return tc * td <= 0 && ta * tb <= 0; // 端点を含む場合
};
