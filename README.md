# hue-shifting
A [website](https://rayo3.github.io/hue-shifting/) that uses hue shifting to find good color schemes for pixel art.

## About
The approach how colors are calculated is based on the idea of this [video](https://www.youtube.com/watch?v=QhgSM_tnPM4).
In short: First we pick a start color. We calculate the rest of the color scheme by lowering saturation and shifting hue and brightness to one direction.

### Technologies used
These technologies are used to develop this program:
- [SVG.js](https://github.com/svgdotjs/svg.js) (used to make SVG rectangles)
- [Pickr](https://github.com/Simonwep/pickr) (used to make color picker)
